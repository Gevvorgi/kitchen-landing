let currentTranslations = {};

async function loadTranslations(lang) {
    try {
        const response = await fetch(`lang/${lang}.json`);
        if (!response.ok) throw new Error("Translation not found");
        return await response.json();
    } catch (error) {
        console.error("Translation load error:", error);
        return {};
    }
}

function getTranslation(key) {
    return key.split('.').reduce((obj, k) => (obj || {})[k], currentTranslations);
}

function updateLanguageDisplay() {
    const lang = localStorage.getItem('lang') || 'ru';
    const flags = document.querySelectorAll('.language-flag');
    const names = document.querySelectorAll('.language-name');
    const selects = document.querySelectorAll('.language-switcher');
    
    selects.forEach(select => {
        select.value = lang;
    });
    
    flags.forEach(flag => {
        flag.src = `img/${lang}-lang.png`;
        flag.alt = lang.toUpperCase();
    });
    
    names.forEach(name => {
        name.textContent = lang.toUpperCase();
    });
}

// Обновление кнопки галереи
export function updateGalleryButton() {
    const btn = document.querySelector('.work-card__btn');
    if (!btn) return;

    const hiddenCount = document.querySelectorAll('.work-card.hidden').length;
    
    if (hiddenCount > 0) {
        const translation = getTranslation('button.showMore') || 'Показать ещё';
        btn.textContent = `${translation} (+${hiddenCount})`;
    } else {
        btn.textContent = getTranslation('button.showLess') || 'Скрыть';
    }
}

// Применение переводов ко всем элементам
function applyTranslations(translations) {
    currentTranslations = translations || {};
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const value = getTranslation(key);
        
        if (value !== undefined) {
            if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                el.placeholder = value;
            } else if (el.tagName === 'IMG' && el.hasAttribute('alt')) {
                el.alt = value;
            } else {
                el.textContent = value;
            }
        }
    });
    
    updateLanguageDisplay();
    updateGalleryButton();
    updateInstallmentPlaceholders();
}

// Инициализация языка
export async function initLanguage() {
    const langSelects = document.querySelectorAll('.language-switcher');
    const savedLang = localStorage.getItem('lang') || 'ru';
    
    document.documentElement.lang = savedLang;
    
    try {
        const translations = await loadTranslations(savedLang);
        applyTranslations(translations);
    } catch (error) {
        console.error('Language init error:', error);
    }
    
    // Обработчики изменения языка
    langSelects.forEach(select => {
        select.addEventListener('change', async (e) => {
            const lang = e.target.value;
            try {
                const translations = await loadTranslations(lang);
                localStorage.setItem('lang', lang);
                document.documentElement.lang = lang;
                applyTranslations(translations);
            } catch (error) {
                console.error('Language change error:', error);
            }
        });
    });

}

// Функция для обновления плейсхолдеров в блоке рассрочки
export function updateInstallmentPlaceholders() {
  const elements = [
    { 
      id: 'name', 
      key: 'installment.form.name.placeholder',
      default: 'Ваше имя:' 
    },
    { 
      id: 'phoneInput2', 
      key: 'installment.form.phone.placeholder',
      default: 'Ваш телефон:' 
    }
  ];

  elements.forEach(item => {
    const el = document.getElementById(item.id);
    if (el) {
      const translation = getTranslation(item.key);
      el.placeholder = translation || item.default;
    }
  });
}
