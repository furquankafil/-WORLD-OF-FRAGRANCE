/* World of Fragrance — boutique interactions */
(function(){
  "use strict";
  var nav = document.getElementById("siteNav");
  var burger = document.getElementById("burger");
  var menu = document.getElementById("mobileMenu");
  var pre = document.getElementById("preloader");
  var wm = document.getElementById("gs-watermark");

  window.addEventListener("load", function(){
    if(pre){ setTimeout(function(){ pre.classList.add("done"); }, 450); }
  });
  setTimeout(function(){ if(pre) pre.classList.add("done"); }, 2500);

  function onScroll(){
    if(nav){
      if(window.scrollY > 24) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    }
    adaptWatermark();
  }
  var ticking = false;
  window.addEventListener("scroll", function(){
    if(!ticking){ window.requestAnimationFrame(function(){ onScroll(); ticking = false; }); ticking = true; }
  }, {passive:true});
  window.addEventListener("resize", adaptWatermark);
  onScroll();

  /* Adaptive watermark: light pill on dark sections, dark pill on light */
  function adaptWatermark(){
    if(!wm) return;
    var x = window.innerWidth - 30, y = window.innerHeight - 110;
    var el = null;
    try { el = document.elementFromPoint(x, y); } catch(e){ el = null; }
    var dark = !!(el && el.closest && el.closest("footer, .bg-dark, .sig-dark"));
    wm.classList.toggle("on-dark", dark);
  }

  if(burger && menu){
    burger.addEventListener("click", function(){
      var open = menu.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click", function(){
        menu.classList.remove("open");
        burger.classList.remove("open");
        burger.setAttribute("aria-expanded","false");
      });
    });
  }

  /* scroll reveal */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var els = document.querySelectorAll(".reveal");
  if(reduce || !("IntersectionObserver" in window)){
    els.forEach(function(e){ e.classList.add("visible"); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ en.target.classList.add("visible"); io.unobserve(en.target); }
      });
    }, {threshold:.12, rootMargin:"0px 0px -6% 0px"});
    els.forEach(function(e){ io.observe(e); });
  }

  /* gentle hero parallax: layers drift 3–8px at different rates */
  var heroArt = document.getElementById("heroArt");
  if(heroArt && !reduce && window.matchMedia("(pointer:fine)").matches){
    var hero = document.getElementById("hero");
    var layers = heroArt.querySelectorAll("[data-depth]");
    if(hero && layers.length){
      hero.addEventListener("mousemove", function(ev){
        var r = hero.getBoundingClientRect();
        var x = (ev.clientX - r.left) / r.width - .5;
        var y = (ev.clientY - r.top) / r.height - .5;
        layers.forEach(function(l){
          var d = parseFloat(l.getAttribute("data-depth")) || 5;
          l.style.translate = (x * d).toFixed(1) + "px " + (y * d).toFixed(1) + "px";
        });
      });
      hero.addEventListener("mouseleave", function(){
        layers.forEach(function(l){ l.style.translate = "0px 0px"; });
      });
    }
  }

  /* faq */
  document.querySelectorAll(".faq button").forEach(function(btn){
    btn.addEventListener("click", function(){
      var item = btn.closest(".faq");
      var wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq.open").forEach(function(f){
        f.classList.remove("open");
        var b = f.querySelector("button"); if(b) b.setAttribute("aria-expanded","false");
      });
      if(!wasOpen){ item.classList.add("open"); btn.setAttribute("aria-expanded","true"); }
    });
  });
})();
