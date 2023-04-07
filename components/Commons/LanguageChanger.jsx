import React, { useEffect } from 'react';

export default function LanguageChanger() {
  const LANGS = {
    'en|en': 'English',
    'en|ar': 'Arabic',
    'en|zh-CN': 'Chinese (Simplified)',
    'en|fr': 'French',
    'en|ja': 'Japanese',
    'en|es': 'Spanish',
  };

  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: 'en',
        includedLanguages: 'en,es,ja,zh-CN,fr,ar',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
      },
      'google_translate_element'
    );
  };
  function handleLanguage() {
    let getLabel = document.querySelector('.goog-te-gadget-simple a span');
    let val = readCookie('googtrans');
    let slicedVal = val ? val.slice(1) : '';

    let output = slicedVal ? slicedVal.replace(/\//g, '|') : '';
    if (getLabel) {
      if (output) {
        getLabel.innerHTML = LANGS[output];
      } else {
        getLabel.innerHTML = 'English';
      }
    }
  }
  function readCookie(name) {
    var c = document.cookie.split('; '),
      cookies = {},
      i,
      C;

    for (i = c.length - 1; i >= 0; i--) {
      C = c[i].split('=');
      cookies[C[0]] = C[1];
    }
    return cookies[name];
  }

  useEffect(() => {
    var addScript = document.createElement('script');
    addScript.setAttribute(
      'src',
      '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    );
    document?.body?.appendChild(addScript);
    if (typeof window !== 'undefined') {
      window.googleTranslateElementInit = googleTranslateElementInit;
    }
    return () => {
      let container = document.getElementById('google_translate_element');
      container?.remove();
    };
  }, []);
  useEffect(() => {
    let getLabel = document.querySelector('.goog-te-gadget-simple a span');
    if (getLabel?.innerHTML === 'Select Language') {
      getLabel.innerHTML = 'English';
    }

    handleLanguage();
  });

  return (
    <div>
      <div id='google_translate_element'></div>
    </div>
  );
}
