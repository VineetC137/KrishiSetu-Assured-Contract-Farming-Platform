'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TranslationKeys, DEFAULT_LANGUAGE, getBrowserLanguage, LANGUAGE_STORAGE_KEY } from '@/lib/i18n';
import { translations } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationKeys;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load saved language or detect browser language
  useEffect(() => {
    if (!mounted) return;

    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
    if (savedLanguage && ['en', 'hi', 'mr'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    } else {
      const browserLanguage = getBrowserLanguage();
      setLanguageState(browserLanguage);
    }
  }, [mounted]);

  // Update document language and direction
  useEffect(() => {
    if (!mounted) return;

    document.documentElement.lang = language;
    
    // Set text direction (Hindi and Marathi are LTR, but we keep this for future RTL languages)
    const isRTL = false; // Hindi and Marathi are LTR
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    
    // Add language class to body for CSS targeting
    document.body.className = document.body.className.replace(/lang-\w+/g, '');
    document.body.classList.add(`lang-${language}`);
  }, [language, mounted]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (mounted) {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    }
  };

  const value = {
    language,
    setLanguage,
    t: translations[language] || translations[DEFAULT_LANGUAGE],
    isRTL: false, // Hindi and Marathi are LTR
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};