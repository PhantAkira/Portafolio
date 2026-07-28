/* =========================================================
   HIRAKI WORKS — script.js
   ========================================================= */

(function(){
  'use strict';

  /* ---------- clase loaded al iniciar ---------- */
  window.addEventListener('load', function(){
    requestAnimationFrame(function(){
      document.body.classList.add('loaded');
      setTimeout(function(){
        document.querySelectorAll('nav.menu a').forEach(function(a){
          a.classList.add('animate-float');
        });
      }, 3600);
    });
  });

  /* ---------- toggle animaciones ---------- */
  var btn = document.getElementById('toggle-animations');
  var root = document.documentElement;
  var prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var saved = localStorage.getItem('user-animations-enabled');
  var animEnabled = saved !== null ? saved === 'true' : !prefersReduced;

  updateAnimations(animEnabled);

  btn.addEventListener('click', function(){
    animEnabled = !animEnabled;
    localStorage.setItem('user-animations-enabled', animEnabled);
    updateAnimations(animEnabled);
  });

  function updateAnimations(enabled){
    if(enabled){
      root.classList.remove('reduce-motion');
      btn.textContent = 'Animaciones: ON';
      btn.setAttribute('aria-pressed', 'true');
    } else {
      root.classList.add('reduce-motion');
      btn.textContent = 'Animaciones: OFF';
      btn.setAttribute('aria-pressed', 'false');
    }
  }

  /* ---------- selector de personaje (Quienes somos) — ARIA tabs ---------- */
  var tabs = document.querySelectorAll('.member-card[role="tab"]');
  var panels = document.querySelectorAll('.bio-panel[role="tabpanel"]');

  function activateTab(targetTab){
    tabs.forEach(function(t){
      var isSelected = t === targetTab;
      t.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      t.setAttribute('tabindex', isSelected ? '0' : '-1');
    });
    var target = targetTab.dataset.member;
    panels.forEach(function(p){
      var isTarget = p.dataset.member === target;
      p.classList.toggle('active', isTarget);
      p.setAttribute('aria-hidden', isTarget ? 'false' : 'true');
    });
    targetTab.focus();
  }

  tabs.forEach(function(tab){
    tab.addEventListener('click', function(){
      activateTab(tab);
    });
    tab.addEventListener('keydown', function(e){
      var tabsArray = Array.from(tabs);
      var currentIndex = tabsArray.indexOf(tab);
      var newIndex = -1;

      switch(e.key){
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          newIndex = (currentIndex + 1) % tabsArray.length;
          activateTab(tabsArray[newIndex]);
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          newIndex = (currentIndex - 1 + tabsArray.length) % tabsArray.length;
          activateTab(tabsArray[newIndex]);
          break;
        case 'Home':
          e.preventDefault();
          activateTab(tabsArray[0]);
          break;
        case 'End':
          e.preventDefault();
          activateTab(tabsArray[tabsArray.length - 1]);
          break;
      }
    });
  });

  /* ---------- revelado al hacer scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: .15 });
    revealEls.forEach(function(el, i){
      el.style.transitionDelay = (i % 6 * 70) + 'ms';
      io.observe(el);
    });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in-view'); });
  }

  /* ---------- nav activo segun seccion visible ---------- */
  var spySections = document.querySelectorAll('main .section[id]');
  var navLinks = document.querySelectorAll('nav.menu a');
  function onScrollSpy(){
    var pos = window.scrollY + window.innerHeight * 0.35;
    var current = '';
    spySections.forEach(function(sec){
      if(pos >= sec.offsetTop){ current = sec.id; }
    });
    navLinks.forEach(function(a){
      a.classList.toggle('current', a.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', onScrollSpy, { passive: true });
  onScrollSpy();

})();
