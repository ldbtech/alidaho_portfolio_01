"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { translateBatch, translateOne } from "../services/translator";

/**
 * Auto-translate a single dynamic string into the active language.
 * Returns the original immediately, then swaps to the translation when ready.
 *
 *   const title = useAutoText(project.title);
 */
export function useAutoText(text) {
  const { language } = useLanguage();
  const [out, setOut] = useState(text);

  useEffect(() => {
    let active = true;
    if (!text || language === "en") {
      setOut(text);
      return;
    }
    setOut(text); // show source while translating
    translateOne(text, language).then((r) => {
      if (active) setOut(r);
    });
    return () => {
      active = false;
    };
  }, [text, language]);

  return out;
}

/**
 * Same as useAutoText but for an array of strings (e.g. a list of items).
 *
 *   const points = useAutoTextList(experience.highlights);
 */
export function useAutoTextList(texts) {
  const { language } = useLanguage();
  const [out, setOut] = useState(texts || []);
  // Stable dependency so we don't re-run on every render for the same content.
  const key = JSON.stringify(texts || []);

  useEffect(() => {
    let active = true;
    const list = texts || [];
    if (!list.length || language === "en") {
      setOut(list);
      return;
    }
    setOut(list);
    translateBatch(list, language).then((r) => {
      if (active) setOut(r);
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, language]);

  return out;
}
