// Client-side translation helper.
// Two-layer cache: in-memory + localStorage (per visitor), backed by the
// /api/translate route which has the shared Firebase cache + Gemini.

function hashKey(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i);
  }
  return (h >>> 0).toString(36);
}

// lang -> { hash: translatedString }
const mem = {};

function loadLang(lang) {
  if (mem[lang]) return mem[lang];
  let obj = {};
  try {
    obj = JSON.parse(localStorage.getItem(`trcache_${lang}`) || "{}");
  } catch {
    obj = {};
  }
  mem[lang] = obj;
  return obj;
}

function saveLang(lang) {
  try {
    localStorage.setItem(`trcache_${lang}`, JSON.stringify(mem[lang]));
  } catch {
    // localStorage full or unavailable — ignore, mem cache still works
  }
}

/**
 * Translate an array of strings into `lang`. Returns a same-length array.
 * English (or empty/blank entries) pass through untouched.
 */
export async function translateBatch(texts, lang) {
  const list = Array.isArray(texts) ? texts : [];
  if (!lang || lang === "en") return list.slice();

  const cache = loadLang(lang);
  const results = new Array(list.length);
  const missIdx = [];
  const missText = [];

  list.forEach((t, i) => {
    if (typeof t !== "string" || !t.trim()) {
      results[i] = t;
      return;
    }
    const k = hashKey(t);
    if (cache[k] != null) {
      results[i] = cache[k];
    } else {
      missIdx.push(i);
      missText.push(t);
    }
  });

  if (missText.length) {
    try {
      const resp = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts: missText, target: lang }),
      });
      if (resp.ok) {
        const data = await resp.json();
        const tr = data.translations || [];
        missIdx.forEach((idx, k) => {
          const value = typeof tr[k] === "string" ? tr[k] : list[idx];
          results[idx] = value;
          cache[hashKey(list[idx])] = value;
        });
        saveLang(lang);
      } else {
        missIdx.forEach((idx) => (results[idx] = list[idx]));
      }
    } catch {
      missIdx.forEach((idx) => (results[idx] = list[idx]));
    }
  }

  return results;
}

export async function translateOne(text, lang) {
  const [r] = await translateBatch([text], lang);
  return r;
}
