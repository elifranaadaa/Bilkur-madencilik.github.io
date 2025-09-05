document.querySelectorAll('.hero-video').forEach(el => el.style.transform = 'none');

// ==== SLIDER (HTML kaynaklı metin) ====
let currentSlide = 0;
const slidesDOM = document.querySelectorAll('.slide');
const totalSlides = slidesDOM.length;

// Sayacı güncelle
document.querySelector('.carousel-counter .total').textContent = String(totalSlides).padStart(2, '0');

function applyTextsFromHTML(i){
  const s = slidesDOM[i];
  const title = s.dataset.title || '';
  const desc  = s.dataset.desc  || '';
  document.querySelector('.hero-title').textContent = title;
  document.querySelector('.hero-description').textContent = desc;
  document.querySelector('.carousel-counter .current').textContent = String(i+1).padStart(2,'0');
}

function showSlide(i){
  slidesDOM.forEach((el, idx)=>el.classList.toggle('active', idx===i));
  applyTextsFromHTML(i);
}

function nextSlide(){
  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
}
function prevSlide(){
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  showSlide(currentSlide);
}

// ilk yüklemede metinleri HTML'den çek
showSlide(0);

// butonlar
document.getElementById('nextBtn').addEventListener('click', nextSlide);
document.getElementById('prevBtn').addEventListener('click', prevSlide);

// === Video davranışı: ilk slayttaki video biterse ve kullanıcı geçmediyse tekrar başlasın
const firstVideo = slidesDOM[0].querySelector('video');
if (firstVideo){
  firstVideo.loop = false; // manuel döngü
  firstVideo.addEventListener('ended', () => {
    if (currentSlide === 0){
      firstVideo.currentTime = 0;
      firstVideo.play();
    }
  });
}

// === Otomatik geçiş sadece resim slaytlarında çalışsın (video slaytında otomatik geçiş yok)
let autoTimer = setInterval(()=>{
  if (currentSlide !== 0) nextSlide(); // 0 (video) ise bekle
}, 5000);

// başka bir slayta gidince timer devam etsin (kullanıcı etkileşimi sonrası)
['click','touchstart'].forEach(evt=>{
  document.addEventListener(evt, ()=>{
    clearInterval(autoTimer);
    autoTimer = setInterval(()=>{
      if (currentSlide !== 0) nextSlide();
    }, 5000);
  }, { once:true });
});



// Scroll-indicator’a basılınca “hakkımızda” section’a git
const scrollInd = document.querySelector('.scroll-indicator');

if (scrollInd) {
  // Kaybolma efektine scroll-indicator’u da ekle
  window.addEventListener('scroll', () => {
    const fadeStart = 50;
    const fadeEnd = window.innerHeight / 2;
    const scrollTop = window.scrollY;

    let opacity = 1 - (scrollTop - fadeStart) / (fadeEnd - fadeStart);
    opacity = Math.max(0, Math.min(1, opacity));

    scrollInd.style.opacity = opacity;
  });

  // Tıklandığında Hakkımızda bölümüne kaydır
  scrollInd.addEventListener('click', () => {
    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}


// Parallax for hero video
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const rate = scrolled * -0.5;
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo && scrolled < window.innerHeight) {
    heroVideo.style.transform = `translate3d(0, ${rate}px, 0)`;
  }
});

// ===== Bottom dock interactions (tablet & phone) =====
const bbMenuBtn = document.getElementById('bbMenuBtn');
const menuOverlay = document.getElementById('menuOverlay');
const menuClose = document.getElementById('menuClose');
const bbLangBtn = document.getElementById('bbLangBtn');
const bbLangPopup = document.getElementById('bbLangPopup');
const bbToTop = document.getElementById('bbToTop');

if (bbMenuBtn && menuOverlay) {
  const toggleSheet = (force) => {
    const active = typeof force === 'boolean' ? force : !menuOverlay.classList.contains('active');
    menuOverlay.classList.toggle('active', active);
    bbMenuBtn.classList.toggle('active', active);
    menuOverlay.setAttribute('aria-hidden', !active);
    document.body.classList.toggle('menu-open', active);   // << EKLENDİ
  };
  bbMenuBtn.addEventListener('click', () => toggleSheet());
  if (menuClose) menuClose.addEventListener('click', () => toggleSheet(false));
  menuOverlay.addEventListener('click', (e) => {
    if (e.target === menuOverlay) toggleSheet(false);
  });
}


// Language popover
if (bbLangBtn && bbLangPopup) {
  bbLangBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = bbLangPopup.style.opacity === '1';
    bbLangPopup.style.opacity = open ? '0' : '1';
    bbLangPopup.style.visibility = open ? 'hidden' : 'visible';
    bbLangPopup.style.transform = open ? 'translateX(-50%) translateY(10px)' : 'translateX(-50%) translateY(0)';
  });
  document.addEventListener('click', () => {
    bbLangPopup.style.opacity = '0';
    bbLangPopup.style.visibility = 'hidden';
    bbLangPopup.style.transform = 'translateX(-50%) translateY(10px)';
  });
}

// Accordion in overlay menu
document.querySelectorAll('.menu-accordion').forEach(btn => {
  btn.addEventListener('click', () => {
    const sub = btn.parentElement.querySelector('.menu-sub');
    const open = sub.style.maxHeight && sub.style.maxHeight !== '0px';
    sub.style.maxHeight = open ? '0' : `${sub.scrollHeight}px`;
    btn.querySelector('span').textContent = open ? '▾' : '▴';
  });
});

// To top
if (bbToTop) {
  bbToTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
}

document.querySelectorAll('.about-content > *, .about-image').forEach(el => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        el.style.animationPlayState = 'running';
      }
    });
  }, { threshold: 0.1 });
  observer.observe(el);
});


// Scroll oldukça sayaç kaybolsun (dikey kalacak)
window.addEventListener('scroll', () => {
  const fadeStart = 50;                   // 50px scroll sonrası başlasın
  const fadeEnd = window.innerHeight / 2; // ekranın yarısında tamamen kaybolsun
  const scrollTop = window.scrollY;

  let opacity = 1 - (scrollTop - fadeStart) / (fadeEnd - fadeStart);
  opacity = Math.max(0, Math.min(1, opacity));

  const counter = document.querySelector('.carousel-counter');
  if(counter){
    counter.style.opacity = opacity;
  }
});

// Scroll oldukça sayaç, sosyal ikonlar ve scroll-indicator kaybolsun
window.addEventListener('scroll', () => {
  const fadeStart = 50;
  const fadeEnd = window.innerHeight / 2;
  const scrollTop = window.scrollY;

  let opacity = 1 - (scrollTop - fadeStart) / (fadeEnd - fadeStart);
  opacity = Math.max(0, Math.min(1, opacity));

  document.querySelectorAll('.carousel-counter, .scroll-indicator').forEach(el => {
    if(el){
      el.style.opacity = opacity;
    }
  });
});

/* === Header scroll state === */
const headerEl = document.getElementById('header');

function updateHeaderOnScroll() {
  if (!headerEl) return;
  // Aşağı inerken (en ufak scroll’da) scrolled aktif olsun
  if (window.scrollY > 0) {
    headerEl.classList.add('scrolled');
  } else {
    headerEl.classList.remove('scrolled');
  }
}

// Sayfa ilk yüklenişi ve her scroll’da kontrol et
window.addEventListener('load', updateHeaderOnScroll, { passive: true });
window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });



// Stat number animasyonu
function animateValue(el, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    el.textContent = `+${value}`;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Observer: sadece görünür olunca çalışsın
const statNumbers = document.querySelectorAll('.stat-number');
if (statNumbers.length) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetValue = parseInt(el.textContent.replace(/\D/g, ''), 10); // sayıyı al
        animateValue(el, 0, targetValue, 2000); // 2sn içinde artış
        observer.unobserve(el); // her biri 1 kere çalışsın
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
}



(() => {
  // DOM Elementleri
  const slides = Array.from(document.querySelectorAll('.uretim-slide'));
  const backgroundImage = document.querySelector('.uretim-background-image');
  const prevBtn = document.getElementById('uretim-prev-btn');
  const nextBtn = document.getElementById('uretim-next-btn');

  // Steps Elementleri
  const stepsNav = document.querySelector('.uretim-steps-navigation');
  const stepsContainer = stepsNav ? stepsNav.querySelector('.uretim-steps-container') : null;
  const stepsList = stepsContainer ? stepsContainer.querySelector('.uretim-steps-list') : null;
  const stepItems = stepsList ? Array.from(stepsList.querySelectorAll('.uretim-step-item')) : [];
  const stepLinks = stepItems.map(li => li.querySelector('.uretim-step-link'));

  // Değişkenler
  let currentStep = 0;
  const STEP_HEIGHT = 150;
  const VISIBLE_AREA_TOP = 280;

  // Arkaplan Güncelleme Fonksiyonu
  function updateBackgroundImage(slideIndex) {
    const slide = slides[slideIndex];
    if (!slide) return;
    
    const nextBgUrl = slide.dataset.bg || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200';
    backgroundImage.style.backgroundImage = `linear-gradient(180deg,rgba(0,0,0,.85),rgba(0,0,0,.65)), url('${nextBgUrl}')`;
  }

  // Aktif Slide Ayarlama Fonksiyonu
  function setActiveSlide(slideIndex) {
    // Eski aktif slide'ı kaldır
    const activeSlide = slides.find(s => s.classList.contains('uretim-slide-active'));
    if (activeSlide) {
      activeSlide.classList.remove('uretim-slide-active');
      activeSlide.classList.add('uretim-slide-exit');
      setTimeout(() => activeSlide.classList.remove('uretim-slide-exit'), 450);
    }

    // Yeni slide'ı aktif et
    const newSlide = slides[slideIndex];
    if (newSlide) newSlide.classList.add('uretim-slide-active');

    updateBackgroundImage(slideIndex);
  }

  // Steps Pozisyon Güncelleme Fonksiyonu
  function updateStepsPosition() {
    if (!stepsContainer) return;
    
    const windowHeight = window.innerHeight;
    const targetY = (windowHeight / 2) - (STEP_HEIGHT / 2);
    const activeStepCurrentY = VISIBLE_AREA_TOP + (currentStep * STEP_HEIGHT);
    const offset = targetY - activeStepCurrentY;
    
    stepsContainer.style.transform = `translateY(${VISIBLE_AREA_TOP + offset}px)`;
  }

  // Ana Step Değiştirme Fonksiyonu
  function setCurrentStep(stepIndex) {
    const stepCount = stepItems.length || 1;
    currentStep = ((stepIndex % stepCount) + stepCount) % stepCount;
    
    // Slide'ı değiştir
    setActiveSlide(currentStep);
    
    // Step görsellerini güncelle
    stepItems.forEach((li, index) => {
      li.classList.toggle('uretim-step-active', index === currentStep);
    });
    
    // Steps pozisyonunu güncelle
    updateStepsPosition();
  }

  // Başlangıç Ayarları
  setCurrentStep(0);

  // Event Listeners
  
  // Step Link Tıklamaları
  stepLinks.forEach((button, index) => {
    if (button) {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        setCurrentStep(index);
      });
    }
  });

  // Navigasyon Butonları
  if (prevBtn) {
    prevBtn.addEventListener('click', () => setCurrentStep(currentStep - 1));
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => setCurrentStep(currentStep + 1));
  }

  // Klavye Kontrolleri
  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setCurrentStep(currentStep - 1);
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setCurrentStep(currentStep + 1);
    }
  });

  // Pencere Yeniden Boyutlandırma
  window.addEventListener('resize', () => {
    updateStepsPosition();
  });
})();


// ==== Üretim Swipe Kontrolleri (telefon için) ====
(() => {
  const slides = document.querySelectorAll(".uretim-slide");
  let startX = 0;
  let currentX = 0;
  let isSwiping = false;

  function goToSlide(index) {
    const total = slides.length;
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    slides.forEach((s, i) => {
      s.classList.toggle("uretim-slide-active", i === index);
    });
    currentSlide = index;
  }

  let currentSlide = 0;

  document.querySelectorAll(".uretim-slide").forEach((slide) => {
    slide.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      isSwiping = true;
    });

    slide.addEventListener("touchmove", (e) => {
      if (!isSwiping) return;
      currentX = e.touches[0].clientX;
    });

    slide.addEventListener("touchend", () => {
      if (!isSwiping) return;
      let diffX = currentX - startX;
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          // sağa kaydır → önceki
          goToSlide(currentSlide - 1);
        } else {
          // sola kaydır → sonraki
          goToSlide(currentSlide + 1);
        }
      }
      isSwiping = false;
    });
  });
})();
