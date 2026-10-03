/* app.js — scroll-scrubbed film, price menu, booking form, reduced motion.
   Business details come from site.js (window.SITE). */
(function () {
  "use strict";

  var SITE = window.SITE;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var money = function (n) { return "$" + n.toLocaleString("en-US"); };

  /* ---------- Fill site details ---------- */
  document.title = SITE.name + " · " + SITE.tagline + " · " + SITE.city;
  $$("[data-site]").forEach(function (el) {
    var key = el.getAttribute("data-site");
    var val = SITE[key];
    if (Array.isArray(val)) val = val.join(" · ");
    el.textContent = val;
  });
  $$("[data-site-href]").forEach(function (el) {
    el.setAttribute("href", SITE[el.getAttribute("data-site-href")]);
  });

  var towns = $("#towns");
  SITE.towns.forEach(function (t) {
    var li = document.createElement("li");
    li.textContent = t;
    towns.appendChild(li);
  });

  var hours = $("#hours");
  SITE.hours.forEach(function (h) {
    var li = document.createElement("li");
    li.innerHTML = "<span></span><span></span>";
    li.children[0].textContent = h.day;
    li.children[1].textContent = h.time;
    hours.appendChild(li);
  });
  var dispatch = document.createElement("li");
  dispatch.innerHTML = '<span>Dispatch</span><a></a>';
  dispatch.querySelector("a").href = SITE.tel;
  dispatch.querySelector("a").textContent = SITE.phone;
  hours.appendChild(dispatch);

  /* ---------- Price menu ---------- */
  function card(item, i, service) {
    var el = document.createElement("article");
    el.className = "card" + (item.featured ? " featured" : "");
    el.style.setProperty("--i", i);
    el.innerHTML =
      '<div class="top"><div class="size"></div>' + (item.featured ? '<span class="tag">Most booked</span>' : "") + '</div>' +
      '<div class="price"><sup>$</sup><span></span></div>' +
      '<p class="fits"></p><ul class="facts"></ul>' +
      '<div class="pick"><a class="btn sm" href="#book" data-book></a></div>';
    $(".size", el).textContent = item.size;
    $(".price span", el).textContent = item.price.toLocaleString("en-US");
    $(".fits", el).textContent = item.fits;
    var facts = [];
    if (item.tons) {
      facts.push(item.tons + " tons included");
      facts.push(money(SITE.overagePerTon) + " a ton over, called before pickup");
    } else if (item.weight) {
      facts.push(item.weight);
    }
    var ul = $(".facts", el);
    if (!facts.length) ul.remove();
    facts.forEach(function (f) { var li = document.createElement("li"); li.textContent = f; ul.appendChild(li); });
    var btn = $(".btn", el);
    btn.textContent = service === "Junk removal" ? "Book the crew" : "Book this can";
    if (!item.featured) btn.classList.add("dark");
    btn.setAttribute("data-service", service);
    btn.setAttribute("data-size", item.size);
    btn.setAttribute("aria-label", btn.textContent + ": " + item.size + ", " + money(item.price));
    return el;
  }

  /* Press (or hover with a mouse) lifts a card, scales it to 1.06 and tilts it
     toward the finger. Release eases it back flat. Touch uses touchstart/touchend
     and never blocks the page from scrolling. */
  var TILT = 10;
  function tiltTo(el, x, y) {
    var r = el.getBoundingClientRect();
    var nx = Math.min(1, Math.max(0, (x - r.left) / r.width)) - 0.5;
    var ny = Math.min(1, Math.max(0, (y - r.top) / r.height)) - 0.5;
    el.style.setProperty("--ry", (nx * TILT).toFixed(2) + "deg");
    el.style.setProperty("--rx", (-ny * TILT).toFixed(2) + "deg");
    el.style.setProperty("--gx", ((nx + 0.5) * 100).toFixed(1) + "%");
    el.style.setProperty("--gy", ((ny + 0.5) * 100).toFixed(1) + "%");
  }
  function press(el, x, y) {
    if (reduceMotion.matches) return;
    el.classList.add("press");
    tiltTo(el, x, y);
  }
  function release(el) {
    el.classList.remove("press");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }
  function bindPress(grid) {
    grid.addEventListener("touchstart", function (e) {
      var el = e.target.closest(".card");
      if (el) press(el, e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    grid.addEventListener("touchmove", function (e) {
      var el = e.target.closest(".card");
      if (el && el.classList.contains("press")) tiltTo(el, e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    ["touchend", "touchcancel"].forEach(function (type) {
      grid.addEventListener(type, function (e) {
        var el = e.target.closest(".card");
        if (el) release(el);
      }, { passive: true });
    });
    // Mouse and pen: hover lifts and tilts, press and release behave the same way.
    grid.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return;
      var el = e.target.closest(".card");
      $$(".card.press", grid).forEach(function (c) { if (c !== el) release(c); });
      if (el) press(el, e.clientX, e.clientY);
    });
    grid.addEventListener("pointerleave", function (e) {
      if (e.pointerType === "touch") return;
      $$(".card.press", grid).forEach(release);
    });
  }

  var rentalGrid = $("#rental-grid");
  var junkGrid = $("#junk-grid");
  SITE.rentals.forEach(function (r, i) { rentalGrid.appendChild(card(r, i, "Dumpster rental")); });
  SITE.junk.forEach(function (j, i) { junkGrid.appendChild(card(j, i, "Junk removal")); });
  bindPress(rentalGrid);
  bindPress(junkGrid);

  if ("IntersectionObserver" in window) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); revealIO.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    $$(".reveal").forEach(function (g) { revealIO.observe(g); });
  } else {
    $$(".reveal").forEach(function (g) { g.classList.add("in"); });
  }

  /* ---------- Scroll story ----------
     The story is pinned for 700vh. Scroll position IS the playhead: each clip
     owns a slice of the scroll (SITE.videos[].to) and is scrubbed from its first
     frame to its last. Headlines own their own slices (data-from / data-to), so
     one clip can carry two lines. Nothing autoplays, one headline at a time. */
  var story = $("#story");
  var reels = $("#reels");
  var lines = $$(".line");
  var ticks = $$(".ticks i");
  var tapBtn = $("#tap");
  var countNow = $("#count-now");
  var cue = $("#cue");
  var clipEnds = SITE.videos.map(function (v) { return v.to; });
  var lineFrom = lines.map(function (l) { return parseFloat(l.getAttribute("data-from")); });
  var lineTo = lines.map(function (l) { return parseFloat(l.getAttribute("data-to")); });
  var clip = -1, line = -1;

  var videos = SITE.videos.map(function (v, i) {
    var el = document.createElement("video");
    el.muted = true;
    el.defaultMuted = true;
    el.playsInline = true;
    el.setAttribute("muted", "");
    el.setAttribute("playsinline", "");
    el.setAttribute("webkit-playsinline", "");
    el.setAttribute("disablepictureinpicture", "");
    el.setAttribute("preload", "auto");
    el.poster = v.poster;
    reels.appendChild(el);
    return el;
  });

  // Load each clip fully into memory and play it from a blob URL. Seeking a blob
  // is instant and works on hosts that don't answer range requests, which scrubbing
  // needs. If fetch is unavailable (opened from file://), fall back to the plain URL.
  function loadClip(i) {
    var v = videos[i], src = SITE.videos[i].src;
    if (!window.fetch || location.protocol === "file:") { v.src = src; return Promise.resolve(); }
    return fetch(src).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.blob();
    }).then(function (b) {
      v.src = URL.createObjectURL(b);
    }).catch(function () { v.src = src; });
  }
  // Current clip first, then the rest in story order.
  var loading = loadClip(0);
  videos.forEach(function (v, i) { if (i) loading = loading.then(function () { return loadClip(i); }); });

  // iOS paints a seeked frame only after the element has been allowed to play
  // once. Prime each clip with a muted play/pause; if that is refused, ask for a tap.
  function primeOne(v) {
    var p = v.play();
    return p && p.then ? p.then(function () { v.pause(); }) : Promise.resolve(v.pause());
  }
  function prime() {
    Promise.all(videos.filter(function (v) { return v.src; }).map(primeOne)).then(function () {
      tapBtn.classList.remove("show");
      draw(true);
    }, function (err) {
      if (err && err.name === "NotAllowedError") tapBtn.classList.add("show");
    });
  }
  tapBtn.addEventListener("click", prime);
  videos.forEach(function (v) {
    v.addEventListener("loadeddata", function () {
      if (!reduceMotion.matches) primeOne(v).catch(function (err) {
        if (err && err.name === "NotAllowedError") tapBtn.classList.add("show");
      });
      draw(true);
    });
  });

  function progress() {
    var travel = story.offsetHeight - window.innerHeight;
    return travel > 0 ? Math.min(1, Math.max(0, -story.getBoundingClientRect().top / travel)) : 0;
  }
  function clipAt(p) {
    for (var i = 0; i < clipEnds.length; i++) if (p < clipEnds[i]) return i;
    return clipEnds.length - 1;
  }
  function lineAt(p) {
    for (var i = 0; i < lines.length; i++) if (p < lineTo[i]) return i;
    return lines.length - 1;
  }

  function setClip(n) {
    if (n === clip) return;
    if (clip >= 0) videos[clip].classList.remove("on");
    clip = n;
    videos[n].classList.add("on");
  }
  var introDone = false;
  function setLine(n) {
    if (n === line) return;
    if (line >= 0) lines[line].classList.remove("on");
    line = n;
    if (introDone) lines[n].classList.add("on");
    countNow.textContent = ("0" + (n + 1)).slice(-2);
  }

  // Smoothed playhead so a flick of the finger glides instead of jumping.
  var shown = 0;
  var target = 0;
  var raf = 0;
  function draw(force) {
    var p = shown;
    var n = clipAt(p);
    setClip(n);
    setLine(lineAt(p));
    var start = n ? clipEnds[n - 1] : 0;
    var local = Math.min(1, Math.max(0, (p - start) / (clipEnds[n] - start)));
    var v = videos[n];
    if (reduceMotion.matches) {
      // No scrub: hold the landed can from the end of the drop clip.
      setClip(0);
      v = videos[0];
      local = 1;
    }
    if (v.duration) {
      var t = Math.min(v.duration - 0.05, local * v.duration);
      if ((force || Math.abs(v.currentTime - t) > 0.02) && !v.seeking) v.currentTime = t;
    }
    for (var i = 0; i < ticks.length; i++) {
      ticks[i].style.setProperty("--p", Math.min(1, Math.max(0, (p - lineFrom[i]) / (lineTo[i] - lineFrom[i]))).toFixed(3));
    }
    cue.classList.toggle("gone", p > 0.02);
  }
  function loop() {
    var d = target - shown;
    shown = Math.abs(d) < 0.0005 || reduceMotion.matches ? target : shown + d * 0.18;
    draw(false);
    raf = shown === target ? 0 : requestAnimationFrame(loop);
  }
  function onScroll() {
    target = progress();
    if (!raf) raf = requestAnimationFrame(loop);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  videos.forEach(function (v) {
    v.addEventListener("seeked", function () { if (!raf) draw(false); });
  });

  target = shown = progress();
  draw(true);

  // Intro: lift the veil, drop the nav, raise the first headline once the type is ready.
  function intro() {
    if (introDone) return;
    introDone = true;
    document.documentElement.classList.remove("pre");
    setTimeout(function () { if (line >= 0) lines[line].classList.add("on"); }, 60);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(intro, intro);
  setTimeout(intro, 1200); // never hold the page hostage to a font

  /* ---------- Photo / video quote ----------
     QUOTE HOOK: set this to a form endpoint that accepts file uploads (Formspree,
     Basin...) to get photos by email. While it is empty, "Send photos" hands the
     files to the phone's share menu so the customer can text them to dispatch. */
  var QUOTE_ENDPOINT = "";

  (function () {
    var qform = $("#qform");
    var input = $("#qfiles");
    var drop = $("#qdrop");
    var thumbs = $("#qthumbs");
    var status = $("#qstatus");
    var sms = $("#qsms");
    var smsNumber = SITE.tel.replace(/^tel:/, "");
    var files = [];
    var MAX = 10;

    var townSel = $("#qtown");
    SITE.towns.concat(["Somewhere else"]).forEach(function (t) {
      var o = document.createElement("option");
      o.textContent = t;
      townSel.appendChild(o);
    });
    $("#faq-towns").textContent = "We cover " + SITE.towns.join(", ") + ". Outside that? Call dispatch and ask.";

    function message() {
      var d = new FormData(qform);
      var parts = ["Hi " + SITE.name + ", I'd like a quote."];
      if (d.get("name")) parts.push("Name: " + d.get("name"));
      if (d.get("phone")) parts.push("Phone: " + d.get("phone"));
      if (d.get("town")) parts.push("Town: " + d.get("town"));
      if (d.get("details")) parts.push("What it is: " + d.get("details"));
      if (files.length) parts.push(files.length > 1 ? "(" + files.length + " photos or videos attached)" : "(1 photo or video attached)");
      return parts.join("\n");
    }
    function updateSms() {
      // iOS reads "&body=", Android "?body="; "?&body=" works on both.
      sms.href = "sms:" + smsNumber + "?&body=" + encodeURIComponent(message());
    }
    function render() {
      thumbs.innerHTML = "";
      files.forEach(function (f, i) {
        var t = document.createElement("div");
        t.className = "thumb";
        var url = URL.createObjectURL(f), m;
        if (f.type.indexOf("video") === 0) {
          m = document.createElement("video");
          m.src = url + "#t=0.5"; m.muted = true; m.playsInline = true; m.preload = "metadata";
          var b = document.createElement("span"); b.className = "vid"; b.textContent = "VIDEO";
          t.appendChild(m); t.appendChild(b);
        } else {
          m = document.createElement("img"); m.src = url; m.alt = "Photo " + (i + 1);
          t.appendChild(m);
        }
        var rm = document.createElement("button");
        rm.type = "button"; rm.className = "rm"; rm.setAttribute("aria-label", "Remove " + f.name);
        rm.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
        rm.addEventListener("click", function () { files.splice(i, 1); render(); });
        t.appendChild(rm);
        thumbs.appendChild(t);
      });
      updateSms();
    }
    function add(list) {
      var over = list.length + files.length > MAX;
      for (var i = 0; i < list.length && files.length < MAX; i++) if (/^(image|video)\//.test(list[i].type)) files.push(list[i]);
      status.textContent = over ? "Up to " + MAX + " files at a time." : "";
      render();
    }
    input.addEventListener("change", function () { add(input.files); input.value = ""; });
    ["dragenter", "dragover"].forEach(function (e) { drop.addEventListener(e, function (ev) { ev.preventDefault(); drop.classList.add("over"); }); });
    ["dragleave", "drop"].forEach(function (e) { drop.addEventListener(e, function (ev) { ev.preventDefault(); drop.classList.remove("over"); }); });
    drop.addEventListener("drop", function (ev) { add(ev.dataTransfer.files); });
    qform.addEventListener("input", updateSms);
    updateSms();

    qform.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var d = new FormData(qform);
      if (!d.get("name") || !d.get("phone")) {
        status.textContent = "Add your name and phone so we can get back to you.";
        (d.get("name") ? qform.phone : qform.name).focus();
        return;
      }
      if (!files.length) { status.textContent = "Add at least one photo or video first."; input.focus(); return; }
      if (QUOTE_ENDPOINT) {
        var body = new FormData(qform);
        files.forEach(function (f) { body.append("attachment", f, f.name); });
        status.textContent = "Sending…";
        fetch(QUOTE_ENDPOINT, { method: "POST", body: body, headers: { Accept: "application/json" } })
          .then(function (r) {
            if (!r.ok) throw new Error("HTTP " + r.status);
            status.textContent = "Got it. We'll get back to you soon.";
            qform.reset(); files = []; render();
          })
          .catch(function () { status.textContent = "That didn't go through. Tap Text us instead, or call " + SITE.phone + "."; });
        return;
      }
      var shareData = { files: files, title: "Quote request for " + SITE.name, text: message() + "\nSend to " + SITE.phone };
      if (navigator.canShare && navigator.canShare({ files: files })) {
        navigator.share(shareData).then(function () { status.textContent = "Thanks! Make sure it went to " + SITE.phone + "."; }, function () {});
      } else {
        status.textContent = "This browser can't send files from here. Opening a text with your details; attach your photos there.";
        location.href = sms.href;
      }
    });
  })();

  /* ---------- Booking form ---------- */
  // FORM HOOK: set this to your form endpoint (Formspree, Basin, a Netlify
  // function, a Cloudflare Worker...). It receives a POST of the form fields.
  // While it is empty the form does not send anything and says so.
  var FORM_ENDPOINT = "";

  var sheet = $("#book");
  var form = $("#book-form");
  var sizeSel = $("#size");
  var sizeLabel = $("#size-label");
  var dateInput = $("#date");

  function fillSizes(service, pick) {
    var list = service === "Junk removal" ? SITE.junk : SITE.rentals;
    sizeLabel.textContent = service === "Junk removal" ? "Load" : "Size";
    sizeSel.innerHTML = "";
    list.forEach(function (item) {
      var o = document.createElement("option");
      o.value = item.size;
      o.textContent = item.size + " · " + money(item.price);
      if (pick ? item.size === pick : item.featured) o.selected = true;
      sizeSel.appendChild(o);
    });
  }

  var today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  dateInput.min = today.toISOString().slice(0, 10);

  function openSheet(service, size) {
    service = service || "Dumpster rental";
    $$('input[name="service"]', form).forEach(function (r) { r.checked = r.value === service; });
    fillSizes(service, size);
    sheet.classList.remove("done");
    if (typeof sheet.showModal === "function") { if (!sheet.open) sheet.showModal(); }
    else sheet.setAttribute("open", "");
    setTimeout(function () { var f = $('input[name="name"]', form); f && f.focus({ preventScroll: true }); }, 60);
  }
  function closeSheet() {
    if (typeof sheet.close === "function" && sheet.open) sheet.close();
    else sheet.removeAttribute("open");
  }

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-book]");
    if (trigger) {
      e.preventDefault();
      openSheet(trigger.getAttribute("data-service"), trigger.getAttribute("data-size"));
      return;
    }
    if (e.target.closest("[data-close]")) closeSheet();
  });
  // Tap on the backdrop closes the sheet.
  sheet.addEventListener("click", function (e) { if (e.target === sheet) closeSheet(); });

  form.addEventListener("change", function (e) {
    if (e.target.name === "service") fillSizes(e.target.value);
  });

  function confirm(title, msg) {
    $("#confirm-h").textContent = title;
    $("#confirm-msg").textContent = msg;
    sheet.classList.add("done");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    var data = new FormData(form);
    var first = String(data.get("name") || "").trim().split(/\s+/)[0];
    var summary = data.get("service") + ", " + data.get("size") + ", " + data.get("address") + ", " + data.get("date");

    if (!FORM_ENDPOINT) {
      confirm("Got it, " + first + ".",
        "This form isn't connected to dispatch yet, so nothing was sent. Call " + SITE.phone +
        " and read us this: " + summary + ".");
      return;
    }

    var btn = $('button[type="submit"]', form);
    btn.disabled = true;
    btn.textContent = "Sending…";
    fetch(FORM_ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        confirm("You're on the list, " + first + ".",
          "We'll call " + data.get("phone") + " to confirm: " + summary + ".");
        form.reset();
      })
      .catch(function () {
        confirm("That didn't go through.", "Nothing was sent. Call " + SITE.phone + " and we'll book it on the phone.");
      })
      .then(function () { btn.disabled = false; btn.textContent = "Reserve it"; });
  });

  if (location.hash === "#book") openSheet();
})();
