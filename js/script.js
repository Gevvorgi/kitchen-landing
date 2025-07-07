// функция загрузки переводов с обработкой ошибок
async function loadTranslations(lang) {
  try {
    const response = await fetch(`lang/${lang}.json`);
    if (!response.ok) throw new Error("Translation not found");
    return await response.json();
  } catch (error) {
    console.error("Ошибка загрузки перевода:", error);
    return {};
  }
}

// обработчик изменения языка
document
  .querySelector(".language-switcher")
  .addEventListener("change", async (e) => {
    const lang = e.target.value;
    const translations = await loadTranslations(lang);


    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (translations[key]) {
        el.textContent = translations[key];
      }
    });


    localStorage.setItem("lang", lang);
  });


(async () => {
  const savedLang = localStorage.getItem("lang") || "ru";
  const translations = await loadTranslations(savedLang);


  document.querySelector(".language-switcher").value = savedLang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (translations[key]) {
      el.textContent = translations[key];
    }
  });
})();

const langSelect = document.querySelector(".language-switcher");
langSelect.disabled = true; 
langSelect.disabled = false;

// флаги кастом
document
  .querySelector(".language-switcher")
  .addEventListener("change", function () {
    const lang = this.value;
    const display = this.nextElementSibling;


    display.querySelector(".language-flag").src = `img/${lang}-lang.png`;
    display.querySelector(".language-flag").alt = lang.toUpperCase();
    display.querySelector(".language-name").textContent =
      this.options[this.selectedIndex].text;
  });


const initialLang = document.querySelector(".language-switcher").value;
document.querySelector(".language-flag").src = `img/${initialLang}-lang.png`;

// счетчик
document.addEventListener("DOMContentLoaded", function () {

  let days = parseInt(document.querySelector(".days").textContent);
  let hours = parseInt(document.querySelector(".hours").textContent);
  let minutes = parseInt(document.querySelector(".minutes").textContent);
  let seconds = parseInt(document.querySelector(".seconds").textContent);

  // функция для обновления таймера
  function updateTimer() {
    seconds--;

    if (seconds < 0) {
      seconds = 59;
      minutes--;

      if (minutes < 0) {
        minutes = 59;
        hours--;

        if (hours < 0) {
          hours = 23;
          days--;

          if (days < 0) {
            clearInterval(timerInterval);
            document.querySelector(".timer").innerHTML =
              "<p>Акция завершена!</p>";
            return;
          }
        }
      }
    }

    updateValue(".days", days);
    updateValue(".hours", hours);
    updateValue(".minutes", minutes);
    updateValue(".seconds", seconds);
  }

  function updateValue(selector, value) {
    const element = document.querySelector(selector);
    if (element.textContent !== value.toString().padStart(2, "0")) {
      element.classList.add("scale");
      setTimeout(() => {
        element.textContent = value.toString().padStart(2, "0");
        element.classList.remove("scale");
      }, 150);
    }
  }

  const timerInterval = setInterval(updateTimer, 1000);
});

// кнопка раскрытия карточек

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".work-card__btn");
  const cards = document.querySelectorAll(".work-card");
  const initialShow = 6;
  const step = 3; 
  let visibleCount = initialShow;

  const initCards = () => {
    cards.forEach((card, index) => {
      card.classList.toggle("hidden", index >= initialShow);
    });
    updateButtonText();
  };

  // обновление текста кнопки
  const updateButtonText = () => {
    const hiddenCount = document.querySelectorAll(".work-card.hidden").length;
    btn.textContent =
      hiddenCount > 0 ? "Показать ещё (+" + hiddenCount + ")" : "Скрыть";

    btn.style.display =
      hiddenCount === 0 && visibleCount === initialShow ? "none" : "block";
  };

  const toggleCards = () => {
    const hiddenCards = document.querySelectorAll(".work-card.hidden");

    if (hiddenCards.length > 0) {
      const cardsToShow = Math.min(step, hiddenCards.length);
      for (let i = 0; i < cardsToShow; i++) {
        hiddenCards[i].classList.remove("hidden");
      }
      visibleCount += cardsToShow;
    } else {
      cards.forEach((card, index) => {
        if (index >= initialShow) {
          card.classList.add("hidden");
        }
      });
      visibleCount = initialShow;
      window.scrollTo({
        top: btn.offsetTop - 100,
        behavior: "smooth",
      });
    }

    updateButtonText();
  };

  btn.addEventListener("click", toggleCards);

  initCards();
});

// номер телефона

document.addEventListener("DOMContentLoaded", function () {
  const phoneInputs = document.querySelectorAll('.phone-input');
  
  // функция для форматирования телефона
  function formatPhoneInput(input) {
    let currentValue = input.value.replace(/\D/g, "");
    
    if (currentValue.length > 0 && currentValue[0] !== "7") {
      currentValue = "7" + currentValue;
    }
    
    if (currentValue.length > 11) {
      currentValue = currentValue.substring(0, 11);
    }
    
    // форматируем номер
    let formattedValue = "";
    if (currentValue.length > 0) {
      formattedValue = "+7 ";
      
      if (currentValue.length > 1) {
        formattedValue += "(" + currentValue.substring(1, 4);
      }
      if (currentValue.length > 4) {
        formattedValue += ") " + currentValue.substring(4, 7);
      }
      if (currentValue.length > 7) {
        formattedValue += "-" + currentValue.substring(7, 9);
      }
      if (currentValue.length > 9) {
        formattedValue += "-" + currentValue.substring(9, 11);
      }
    }
    
    input.value = formattedValue;
  }
  
  // обработчики для каждого инпута
  phoneInputs.forEach(input => {
    let previousValue = "";
    
    input.addEventListener("input", function(e) {
      formatPhoneInput(this);
      previousValue = this.value;
    });
    
    input.addEventListener("focus", function() {
      if (this.value === "") {
        this.value = "+7 ";
      }
    });
    
    input.addEventListener("blur", function() {
      if (this.value === "+7 ") {
        this.value = "";
      }
    });
    
    // запрет ввода букв и символов (кроме цифр и управляющих клавиш)
    input.addEventListener('keydown', function(e) {
      // backspace, delete, tab, escape, enter
      if ([46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
         // Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
         (e.keyCode === 65 && e.ctrlKey === true) || 
         (e.keyCode === 67 && e.ctrlKey === true) ||
         (e.keyCode === 86 && e.ctrlKey === true) ||
         (e.keyCode === 88 && e.ctrlKey === true) ||
         // home, end, left, right
         (e.keyCode >= 35 && e.keyCode <= 39)) {
           return;
      }
      
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && 
          (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }
    });
  });
});

// функция калькулятора

function calculatePayment() {
  const budget = parseFloat(document.getElementById("budget").value);
  const period = parseInt(document.getElementById("period").value);
  const downPaymentPercent = parseFloat(
    document.getElementById("downPayment").value
  );

  if (isNaN(budget) || isNaN(period) || isNaN(downPaymentPercent)) {
    alert("Пожалуйста, введите корректные данные");
    return;
  }

  const downPayment = budget * (downPaymentPercent / 100);

  const creditAmount = budget - downPayment;

  const monthlyPayment = creditAmount / period;

  const formattedPayment = monthlyPayment
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  document.getElementById("monthlyPayment").textContent =
    formattedPayment + " ₽";
}

window.onload = calculatePayment;

document.getElementById("budget").addEventListener("input", calculatePayment);
document.getElementById("period").addEventListener("change", calculatePayment);
document
  .getElementById("downPayment")
  .addEventListener("input", calculatePayment);

// модуль для слайдера (ошибки др комп)
const mistakesSlider = (function() {
  let autoSlideInterval;
  let isAnimating = false;
  let currentActive = 1;
  
  const init = function() {
    const cards = document.querySelectorAll(".mistake-card");
    const sliderContainer = document.getElementById("sliderContainer");
    const leftArrow = document.querySelector(".left-arrow");
    const rightArrow = document.querySelector(".right-arrow");
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    const activateCard = function(index) {
      if (isAnimating) return;
      isAnimating = true;
      
      cards.forEach(card => card.classList.remove("active"));
      cards[index].classList.add("active");
      currentActive = index;
      
      // на мобилках - плавная прокрутка
      if (isMobile && sliderContainer) {
        const card = cards[index];
        const containerWidth = sliderContainer.offsetWidth;
        const cardLeft = card.offsetLeft;
        const cardWidth = card.offsetWidth;
        const scrollPos = cardLeft - (containerWidth / 2) + (cardWidth / 2);
        
        sliderContainer.scrollTo({
          left: scrollPos,
          behavior: 'smooth'
        });
      }
      
      setTimeout(() => {
        isAnimating = false;
      }, 300);
    };

    const nextCard = function() {
      const nextIndex = (currentActive + 1) % cards.length;
      activateCard(nextIndex);
    };

    const prevCard = function() {
      const prevIndex = (currentActive - 1 + cards.length) % cards.length;
      activateCard(prevIndex);
    };

    const startAutoSlide = function() {
      clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(nextCard, 3000);
    };

    const initSlider = function() {
      activateCard(1);
      
      startAutoSlide();
      
      // для мобилок - дополнительные обработчики
      if (isMobile) {
        // остановка при взаимодействии
        sliderContainer.addEventListener('touchstart', () => {
          clearInterval(autoSlideInterval);
        });
        
        // перезапуск после скролла
        let scrollTimeout;
        sliderContainer.addEventListener('scroll', () => {
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            if (!isAnimating) startAutoSlide();
          }, 1000);
        });
      }
      
      // обработчики стрелок (работают на всех устройствах)
      if (leftArrow && rightArrow) {
        leftArrow.addEventListener('click', () => {
          prevCard();
          startAutoSlide();
        });
        
        rightArrow.addEventListener('click', () => {
          nextCard();
          startAutoSlide();
        });
      }
    };

    const handleResize = function() {
      const newIsMobile = window.matchMedia("(max-width: 768px)").matches;
      if (newIsMobile !== isMobile) {
        // перезапускаем слайдер при изменении типа устройства
        clearInterval(autoSlideInterval);
        initSlider();
      }
    };

    initSlider();
    window.addEventListener('resize', handleResize);
  };
  
  return {
    init: init
  };
})();

document.addEventListener("DOMContentLoaded", function() {
  mistakesSlider.init();});


  // ассистент
document.addEventListener("DOMContentLoaded", function() {
  const chatIcon = document.getElementById('chatIcon');
  const chatWindow = document.getElementById('chatWindow');
  const chatClose = document.querySelector('.chat-close');
  
  chatIcon.style.display = 'none';
  
  // проверка прокрутки
  function checkScroll() {
    const firstBlock = document.querySelector('.hero-section, header, section');
    if (firstBlock && window.scrollY > firstBlock.offsetHeight) {
      chatIcon.style.display = 'flex';
    } else {
      chatIcon.style.display = 'none';
      chatWindow.classList.remove('active');
    }
  }
  
  chatIcon.addEventListener('click', () => chatWindow.classList.toggle('active'));
  chatClose.addEventListener('click', () => chatWindow.classList.remove('active'));
  window.addEventListener('scroll', checkScroll);
  
  checkScroll();
});