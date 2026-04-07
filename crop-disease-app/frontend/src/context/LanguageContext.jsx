import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");
  const [translations, setTranslations] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // 🔥 Load translations
  const loadTranslations = async (lang) => {
    try {
      const response = await fetch(`/locales/${lang}.json`);
      if (!response.ok) throw new Error("Failed to load");

      const data = await response.json();
      if (!data || Object.keys(data).length === 0) {
        const fallbackResponse = await fetch("/locales/en.json");
        return await fallbackResponse.json();
      }
      return data;
    } catch (error) {
      console.error("Error loading language, fallback to English:", error);

      const fallback = await fetch("/locales/en.json");
      return await fallback.json();
    }
  };

  // 🔥 Initialize
  useEffect(() => {
    const init = async () => {
      try {
        const savedLang = localStorage.getItem("language");
        const lang = (savedLang === 'hi' || savedLang === 'en') ? savedLang : 'en';
        setLanguage(lang);
        console.log('Current language:', lang);

        const data = await loadTranslations(savedLang);
        setTranslations(data);
      } catch (err) {
        console.error("Init error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  // 🔥 Language change
  useEffect(() => {
    if (!isLoading) {
      fetch(`/locales/${language}.json?t=${Date.now()}`).then(response => {
        if (!response.ok) throw new Error("Failed to load");
        return response.json();
      }).then((data) => {
        if (!data || Object.keys(data).length === 0) {
          return fetch("/locales/en.json").then(fb => fb.json());
        }
        return data;
      }).then((data) => {
        setTranslations(data);
        localStorage.setItem("language", language);
      });
    }
  }, [language]);

  // 🔥 FIXED t() FUNCTION (Nested support)
  const t = (key) => {
    const keys = key.split(".");
    let value = translations;

    for (let k of keys) {
      value = value?.[k];
      if (!value) break;
    }

    return value || key;
  };

  const switchLanguage = (lang) => {
    setLanguage(lang);
  };

  // 🔥 Loader
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <LanguageContext.Provider
      value={{
        t,
        language,
        switchLanguage,
        languages: ["en", "hi"],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};