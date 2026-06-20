import { NextResponse } from "next/server";
import { ref, get, set } from "firebase/database";
import database from "../../services/firebase";

// Human-readable names so Gemini gets an unambiguous target language.
const LANG_NAMES = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
  zh: "Chinese (Simplified)",
  ja: "Japanese",
  ko: "Korean",
  ar: "Arabic",
};

// Short, stable, Firebase-key-safe hash (no . # $ [ ] / chars).
function hashKey(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i);
  }
  return (h >>> 0).toString(36);
}

export async function POST(req) {
  try {
    const { texts, target } = await req.json();

    if (!Array.isArray(texts)) {
      return NextResponse.json({ error: "texts must be an array" }, { status: 400 });
    }

    const clean = texts.map((t) => (typeof t === "string" ? t : ""));

    // English is the source language — nothing to translate.
    if (!target || target === "en") {
      return NextResponse.json({ translations: clean });
    }

    const langName = LANG_NAMES[target] || target;
    const results = new Array(clean.length);
    const keys = clean.map((t) => hashKey(t));

    // --- 1. Try the Firebase cache (shared across all visitors) ---
    const misses = [];
    await Promise.all(
      clean.map(async (text, i) => {
        if (!text.trim()) {
          results[i] = text;
          return;
        }
        try {
          const snap = await get(ref(database, `translations/${target}/${keys[i]}`));
          const val = snap.val();
          if (val && typeof val.t === "string") {
            results[i] = val.t;
            return;
          }
        } catch {
          // cache read failed — treat as a miss and translate
        }
        misses.push(i);
      })
    );

    // --- 2. Translate cache misses with Gemini, in a single batched call ---
    if (misses.length) {
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        // No key configured: degrade gracefully, return the originals.
        misses.forEach((i) => {
          results[i] = clean[i];
        });
      } else {
        const payload = misses.map((i) => clean[i]);
        const prompt =
          `You are a professional translator. Translate each string in the following JSON array into ${langName}. ` +
          `Return ONLY a JSON array of the same length and order, containing the translated strings. ` +
          `Keep proper nouns, brand/product names, code, URLs and emojis unchanged. Do not add notes or explanations.\n\n` +
          JSON.stringify(payload);

        let translated = null;
        try {
          const resp = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: {
                  temperature: 0.2,
                  maxOutputTokens: 8192,
                  responseMimeType: "application/json",
                },
              }),
            }
          );

          if (resp.ok) {
            const data = await resp.json();
            let raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
            // Safety net in case the model wraps output in code fences.
            raw = raw.trim().replace(/^```(json)?/i, "").replace(/```$/, "").trim();
            const arr = JSON.parse(raw);
            if (Array.isArray(arr) && arr.length === payload.length) {
              translated = arr;
            }
          } else {
            console.error("Gemini translate error:", resp.status, await resp.text());
          }
        } catch (err) {
          console.error("Gemini translate request failed:", err);
        }

        misses.forEach((idx, k) => {
          const value =
            translated && typeof translated[k] === "string" ? translated[k] : clean[idx];
          results[idx] = value;
          // Best-effort write-back so the next visitor hits the cache.
          if (translated) {
            set(ref(database, `translations/${target}/${keys[idx]}`), {
              t: value,
              src: clean[idx].slice(0, 240),
            }).catch(() => {});
          }
        });
      }
    }

    return NextResponse.json({ translations: results });
  } catch (err) {
    console.error("translate route error:", err);
    return NextResponse.json({ error: "translation failed" }, { status: 500 });
  }
}
