import {
  initLanguage,
  updateInstallmentPlaceholders,
  updateGalleryButton,
} from "./translate.js";

// Бургер-меню
function initBurgerMenu() {
  const burgerMenu = document.getElementById("burgerMenu");
  const menuBar = document.getElementById("menuBar");

  burgerMenu.addEventListener("click", () => {
    burgerMenu.classList.toggle("active");
    menuBar.classList.toggle("active");
    document.body.classList.toggle("no-scroll");
  });
}

// Галерея работ
function initGallery() {
  const btn = document.querySelector(".work-card__btn");
  const cards = document.querySelectorAll(".work-card");
  const initialShow = 6;
  const step = 3;

  if (!btn || !cards.length) return;

  cards.forEach((card, index) => {
    card.classList.toggle("hidden", index >= initialShow);
  });

  btn.addEventListener("click", () => {
    const hiddenCards = document.querySelectorAll(".work-card.hidden");

    if (hiddenCards.length > 0) {
      const showCount = Math.min(step, hiddenCards.length);
      for (let i = 0; i < showCount; i++) {
        hiddenCards[i].classList.remove("hidden");
      }
    } else {
      cards.forEach((card, index) => {
        if (index >= initialShow) card.classList.add("hidden");
      });
      window.scrollTo({
        top: btn.offsetTop - 100,
        behavior: "smooth",
      });
    }

    updateGalleryButton();
  });

  updateGalleryButton();
}

// Таймер акции
function initPromoTimer() {
  let days = parseInt(document.querySelector(".days").textContent);
  let hours = parseInt(document.querySelector(".hours").textContent);
  let minutes = parseInt(document.querySelector(".minutes").textContent);
  let seconds = parseInt(document.querySelector(".seconds").textContent);

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
}

// Фиксированная шапка при скролле
function initHeaderScroll() {
  const headerWrapper = document.getElementById("headerWrapper");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      headerWrapper.style.background = "white";
      headerWrapper.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    } else {
      headerWrapper.style.background = "transparent";
      headerWrapper.style.boxShadow = "none";
    }
  });
}

// Форматирование телефона
function initPhoneMask() {
  const phoneInputs = document.querySelectorAll(".phone-input");

  const formatPhoneInput = (input) => {
    let currentValue = input.value.replace(/\D/g, "");

    if (currentValue.length > 0 && currentValue[0] !== "7") {
      currentValue = "7" + currentValue;
    }

    if (currentValue.length > 11) {
      currentValue = currentValue.substring(0, 11);
    }

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
  };

  phoneInputs.forEach((input) => {
    let previousValue = "";

    input.addEventListener("input", function () {
      formatPhoneInput(this);
      previousValue = this.value;
    });

    input.addEventListener("focus", function () {
      if (this.value === "") {
        this.value = "+7 ";
      }
    });

    input.addEventListener("blur", function () {
      if (this.value === "+7 ") {
        this.value = "";
      }
    });

    input.addEventListener("keydown", function (e) {
      if (
        [46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
        (e.keyCode === 65 && e.ctrlKey === true) ||
        (e.keyCode === 67 && e.ctrlKey === true) ||
        (e.keyCode === 86 && e.ctrlKey === true) ||
        (e.keyCode === 88 && e.ctrlKey === true) ||
        (e.keyCode >= 35 && e.keyCode <= 39)
      ) {
        return;
      }

      if (
        (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
        (e.keyCode < 96 || e.keyCode > 105)
      ) {
        e.preventDefault();
      }
    });
  });
}

// Калькулятор рассрочки
function initInstallmentCalculator() {
  const form = document.getElementById("installmentForm");
  if (!form) return;

  function calculatePayment() {
    const budget = parseFloat(document.getElementById("budget").value) || 0;
    const period = parseInt(document.getElementById("period").value) || 12;
    const downPaymentPercent =
      parseFloat(document.getElementById("downPayment").value) || 0;

    const downPayment = budget * (downPaymentPercent / 100);
    const creditAmount = budget - downPayment;
    const monthlyPayment = creditAmount / period;

    document.getElementById("monthlyPayment").textContent =
      monthlyPayment.toLocaleString("ru-RU", { maximumFractionDigits: 0 }) +
      " ₽";
  }

  // Обработчики событий
  document.getElementById("budget").addEventListener("input", calculatePayment);
  document
    .getElementById("period")
    .addEventListener("change", calculatePayment);
  document
    .getElementById("downPayment")
    .addEventListener("input", calculatePayment);

  calculatePayment();
}

// Карусель процесса работы
function initProcessCarousel() {
  const carousel = document.querySelector(".process-cards");
  const prevBtn = document.querySelector(".carousel-prev");
  const nextBtn = document.querySelector(".carousel-next");
  const dotsContainer = document.querySelector(".carousel-dots");

  if (!carousel || !prevBtn || !nextBtn) return;

  const cards = Array.from(document.querySelectorAll(".process-card"));
  let currentIndex = 0;

  // Точки навигации
  cards.forEach((_, index) => {
    const dot = document.createElement("div");
    dot.classList.add("carousel-dot");
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".carousel-dot");

  // Переключения слайда
  function goToSlide(index) {
    if (index < 0) index = cards.length - 1;
    if (index >= cards.length) index = 0;

    carousel.scrollTo({
      left: cards[index].offsetLeft - carousel.offsetLeft,
      behavior: "smooth",
    });

    currentIndex = index;
    updateDots();
  }

  // Обновление активной точки
  function updateDots() {
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  }

  prevBtn.addEventListener("click", () => goToSlide(currentIndex - 1));
  nextBtn.addEventListener("click", () => goToSlide(currentIndex + 1));

  // Автоматическое определение текущего слайда при скролле
  carousel.addEventListener("scroll", () => {
    const scrollPos = carousel.scrollLeft + carousel.offsetWidth / 2;

    cards.forEach((card, index) => {
      if (
        card.offsetLeft <= scrollPos &&
        card.offsetLeft + card.offsetWidth > scrollPos
      ) {
        currentIndex = index;
        updateDots();
      }
    });
  });

  // Адаптация к изменению размера окна
  window.addEventListener("resize", () => {
    goToSlide(currentIndex);
  });

  let isDragging = false;
  let startPos = 0;
  let currentScroll = 0;

  carousel.addEventListener("touchstart", (e) => {
    isDragging = true;
    startPos = e.touches[0].clientX;
    currentScroll = carousel.scrollLeft;
  });

  carousel.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    const x = e.touches[0].clientX;
    const walk = (x - startPos) * 2;
    carousel.scrollLeft = currentScroll - walk;
  });

  carousel.addEventListener("touchend", () => {
    isDragging = false;
  });
}

// Карусель ошибок
function initMistakesSlider() {
  const sliderContainer = document.getElementById("sliderContainer");
  const cards = document.querySelectorAll(".mistake-card");
  const prevBtn = document.querySelector(".mistakes-prev");
  const nextBtn = document.querySelector(".mistakes-next");
  
  if (!sliderContainer || !cards.length || !prevBtn || !nextBtn) return;

  let currentIndex = 1;
  let autoSlideInterval;
  let isMobile = window.matchMedia("(max-width: 600px)").matches;

  function activateCard(index) {
    if (index < 0) index = cards.length - 1;
    if (index >= cards.length) index = 0;
    
    cards.forEach((card, i) => {
      card.classList.toggle("active", i === index);
    });
    
    currentIndex = index;
    
    if (isMobile) {
      scrollToCard(index);
    }
  }

  function scrollToCard(index) {
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

  function nextCard() {
    activateCard(currentIndex + 1);
  }

  function prevCard() {
    activateCard(currentIndex - 1);
  }

  // Автопрокрутка (только для десктопа и планшетов)
  function startAutoSlide() {
    clearInterval(autoSlideInterval);
    if (!isMobile) {
      autoSlideInterval = setInterval(nextCard, 3000);
    }
  }

  // Остановка автопрокрутки при наведении (только для десктопа)
  function setupPauseOnHover() {
    if (isMobile) return;
    
    sliderContainer.addEventListener('mouseenter', () => {
      clearInterval(autoSlideInterval);
    });
    
    sliderContainer.addEventListener('mouseleave', startAutoSlide);
  }

  // Обработчики событий для мобильных
  function setupMobileEvents() {
    if (!isMobile) return;
    
    // Обработчики для тач-событий
    let startPosX = 0;
    let isDragging = false;
    
    sliderContainer.addEventListener('touchstart', (e) => {
      isDragging = true;
      startPosX = e.touches[0].clientX;
    }, { passive: true });
    
    sliderContainer.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      
      const threshold = 50;
      const containerScroll = sliderContainer.scrollLeft;
      const containerWidth = sliderContainer.offsetWidth;
      const cardWidth = cards[0].offsetWidth + 20;
      
      const newIndex = Math.round(containerScroll / cardWidth);
      activateCard(Math.min(Math.max(newIndex, 0), cards.length - 1));
    }, { passive: true });
    
    sliderContainer.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const currentPosition = e.touches[0].clientX;
      const diff = currentPosition - startPosX;
      sliderContainer.scrollLeft -= diff;
      startPosX = currentPosition;
    }, { passive: true });
    
    prevBtn.addEventListener('click', () => {
      prevCard();
    });
    
    nextBtn.addEventListener('click', () => {
      nextCard();
    });
  }

  // Проверка изменения размера
  function handleResize() {
    const newIsMobile = window.matchMedia("(max-width: 600px)").matches;
    if (newIsMobile !== isMobile) {
      isMobile = newIsMobile;
      clearInterval(autoSlideInterval);
      
      if (!isMobile) {
        startAutoSlide();
      } else {
        activateCard(0);
      }
    }
  }

  function init() {
    activateCard(0);
    
    if (!isMobile) {
      startAutoSlide();
      setupPauseOnHover();
    }
    
    setupMobileEvents();
    window.addEventListener('resize', handleResize);
  }

  init();
}

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


document.addEventListener("DOMContentLoaded", async () => {
  await initLanguage();
  updateInstallmentPlaceholders();
  initBurgerMenu();
  initGallery();
  initPromoTimer();
  initHeaderScroll();
  initPhoneMask();
  initInstallmentCalculator();
  initProcessCarousel();
  initMistakesSlider(); 
});
