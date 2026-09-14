/* ============================================
   Alpha — profile feed
   Post database + dynamic rendering + gallery + stopwatch
   ============================================ */

(function () {
  "use strict";

  /* ------------------------------------------------------------
     0. GitHub raw-URL conversion
     GitHub "blob" URLs cannot be used directly as <img src>.
     This converts them to raw.githubusercontent.com automatically,
     so post data can be written with normal GitHub file links.
  ------------------------------------------------------------ */
  function toRaw(url) {
    if (!url) return url;
    if (url.indexOf("raw.githubusercontent.com") !== -1) return url;
    return url
      .replace("https://github.com/", "https://raw.githubusercontent.com/")
      .replace("/blob/", "/");
  }

  var PROFILE_IMAGE =
    "https://github.com/mdimrankhanalpha/Alpha/blob/main/file_0000000012b081fa9718ddb092393a0e.png";

  /* ------------------------------------------------------------
     1. POST DATABASE
     To add a new post, add one object to this array:
       { text: "...", images: ["url1", "url2"] }
     text and images are both optional (a post can be text-only,
     image-only, or both). See README.md for details.
  ------------------------------------------------------------ */
  var POSTS = [
    {
      text: "My wife\u2019s house in my dream.",
      images: [
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/My%20wife%E2%80%99s%20house%20in%20my%20dream/IMG_20260914_194950.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/My%20wife%E2%80%99s%20house%20in%20my%20dream/IMG_20260914_194946.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/My%20wife%E2%80%99s%20house%20in%20my%20dream/IMG_20260914_192341.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/My%20wife%E2%80%99s%20house%20in%20my%20dream/IMG_20260914_195227.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/My%20wife%E2%80%99s%20house%20in%20my%20dream/IMG_20260914_195214.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/My%20wife%E2%80%99s%20house%20in%20my%20dream/IMG_20260914_195017.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/My%20wife%E2%80%99s%20house%20in%20my%20dream/IMG_20260914_195010.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/My%20wife%E2%80%99s%20house%20in%20my%20dream/IMG_20260914_195004.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/My%20wife%E2%80%99s%20house%20in%20my%20dream/IMG_20260914_195000.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/My%20wife%E2%80%99s%20house%20in%20my%20dream/IMG_20260914_194956.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/My%20wife%E2%80%99s%20house%20in%20my%20dream/IMG_20260914_194953.jpg"
      ]
    },
    {
      text: "Car nite celeo jadam Abar ja tex. 15,00,000tk theke 21,00,000tk Hoye Jane. Kena inpossible 8:04"
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/2/ee21ee22e0a5e65d6c28a71749e1651c.jpg"]
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/2/a792c2cc3ed76049ebee70e39d3bc18d.jpg"]
    },
    {
      text: "Mone hy na ami ar fb te continue korbi. Id ban hy aro anek. Ar proton mail otar to kahini alada ja id login chi fb te ta sb lock Hoye geche Abar taka diye kintr hbe. Ar taka to Amar kace Kono kalei nai. Amar mne hy ai line tai Valo. Amar id ami nijei banai. Unique, element design, animation, unique profile, infinite profile ami nij icha nijer moto Kore bo sb Amar control a thakbe. Tai website ar banabo tao GitHub use korbo. Ar amneo Amar infinite profile to achei. 5:54"
    },
    { text: "\u2639\ufe0f\u2639\ufe0f\u2639\ufe0f" },
    { text: "54%" },
    { text: "Wifi nai \ud83e\udd15 5:36" },
    { text: "\ud83d\ude34\ud83e\udd15 5:10" },
    { text: "\ud83e\udda5" },
    { text: "5:09" },
    { text: "\ud83d\udc2f\ud83e\udd81\ud83e\udd96" },
    { text: "\u2639\ufe0f" },
    { text: "\ud83d\udd33\ud83d\udd33\ud83d\udd33\ud83d\udd33\ud83d\udd33\ud83d\udd33" },
    { text: "Rain \ud83c\udf27\ufe0f \u2614\nShe nai\nMne ki pore???\n12:16pm 14 September 2026" },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/66089b20ddc9098089b7986bfd2abfeb.jpg"]
    },
    {
      text: "\u201cEveryone has a story; let your journey speak for itself.\u201d"
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/2dbb66d8ec8df6c2fbe7a96af6018d2e.jpg"]
    },
    {
      text: "So beautiful \u2764\ufe0f",
      images: [
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/1/09ddd3223d3fefce3b0b089618cb617a.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/1/1266e2c78144850c29b5a3118c9c34ef.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/1/24cd7a94f5f14ec3fcf25b33b15ef138.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/1/3c5f0cd09bd97f5ee1f9762f03a4c159.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/1/76480ab1dd9297881bf658bf02a62379.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/1/b3738c444ea22fac91be9214e183582d.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/1/bd57569ce3406a14e580cc983d05b85c.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/1/cd9fa273804243383eb7a726def13381.jpg"
      ]
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/90fa0d7b08629730c2b6210d51503663.jpg"]
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/f003a05f15f495d3bc56a1ecc52fd3a2.jpg"]
    },
    {
      text: "Fust Post OK",
      images: [PROFILE_IMAGE]
    }
  ];

  /* ------------------------------------------------------------
     2. FEED RENDERING
     Posts are built with a document fragment and images use
     native lazy loading, so nothing off-screen is fully decoded
     until it nears the viewport. This scales to thousands of posts.
  ------------------------------------------------------------ */

  var feedEl = document.getElementById("feed");
  var frag = document.createDocumentFragment();

  POSTS.forEach(function (post, index) {
    var postEl = document.createElement("article");
    postEl.className = "post";

    if (post.text) {
      var p = document.createElement("p");
      p.className = "post-text";
      p.textContent = post.text;
      postEl.appendChild(p);
    }

    if (post.images && post.images.length === 1) {
      postEl.appendChild(buildSingleImage(post.images[0], index));
    } else if (post.images && post.images.length > 1) {
      postEl.appendChild(buildGallery(post.images, index));
    }

    frag.appendChild(postEl);
  });

  feedEl.appendChild(frag);

  /* ---------- single image ---------- */

  function buildSingleImage(url, postIndex) {
    var wrap = document.createElement("div");
    wrap.className = "post-image-single";

    var img = document.createElement("img");
    img.src = toRaw(url);
    img.alt = "Photo";
    img.loading = postIndex < 3 ? "eager" : "lazy";
    img.decoding = "async";
    attachFailSafe(img, wrap);

    wrap.appendChild(img);
    return wrap;
  }

  /* ---------- multi-photo horizontal gallery ---------- */

  function buildGallery(urls, postIndex) {
    var gallery = document.createElement("div");
    gallery.className = "gallery";

    var track = document.createElement("div");
    track.className = "gallery-track";
    track.tabIndex = 0;
    track.setAttribute("role", "region");
    track.setAttribute("aria-label", "Photo gallery, " + urls.length + " photos");

    var itemEls = [];

    urls.forEach(function (url, i) {
      var item = document.createElement("div");
      item.className = "gallery-item";

      var img = document.createElement("img");
      img.src = toRaw(url);
      img.alt = "Photo " + (i + 1) + " of " + urls.length;
      img.loading = postIndex < 3 && i === 0 ? "eager" : "lazy";
      img.decoding = "async";
      attachFailSafe(img, item);

      item.appendChild(img);
      track.appendChild(item);
      itemEls.push(item);
    });

    var meta = document.createElement("div");
    meta.className = "gallery-meta";

    var progress = document.createElement("div");
    progress.className = "gallery-progress";
    var progressBar = document.createElement("div");
    progressBar.className = "gallery-progress-bar";
    progress.appendChild(progressBar);

    var count = document.createElement("span");
    count.className = "gallery-count";

    function updateIndicator() {
      var idx = nearestItemIndex(track, itemEls);
      var total = itemEls.length;
      var left = total - (idx + 1);
      count.textContent =
        (idx + 1) + " / " + total + (left > 0 ? " \u00b7 " + left + " left" : " \u00b7 end");
      progressBar.style.width = (((idx + 1) / total) * 100) + "%";
    }

    var ticking = false;
    track.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          updateIndicator();
          ticking = false;
        });
      },
      { passive: true }
    );

    updateIndicator();

    meta.appendChild(count);
    meta.appendChild(progress);

    gallery.appendChild(track);
    gallery.appendChild(meta);
    return gallery;
  }

  function nearestItemIndex(track, itemEls) {
    var trackCenter = track.scrollLeft + track.clientWidth / 2;
    var nearest = 0;
    var nearestDist = Infinity;
    itemEls.forEach(function (item, i) {
      var itemCenter = item.offsetLeft + item.clientWidth / 2;
      var dist = Math.abs(itemCenter - trackCenter);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    });
    return nearest;
  }

  /* ---------- broken-image safety net ---------- */

  function attachFailSafe(img, container) {
    img.addEventListener("error", function () {
      if (container.querySelector(".img-broken")) return;
      img.remove();
      var placeholder = document.createElement("div");
      placeholder.className = "img-broken";
      placeholder.textContent = "Image unavailable";
      container.appendChild(placeholder);
    });
  }

  /* ------------------------------------------------------------
     3. PROFILE AVATAR
  ------------------------------------------------------------ */
  var avatar = document.getElementById("avatar");
  avatar.src = toRaw(PROFILE_IMAGE);
  attachFailSafe(avatar, avatar.parentElement);

  /* ------------------------------------------------------------
     4. STOPWATCH
     Fixed start: 14 September 2026, 00:00:00 Bangladesh time (UTC+06:00).
     Elapsed time is always derived from (now - start), never stored,
     so it survives refreshes and cannot drift or reset.
  ------------------------------------------------------------ */
  var START_MS = Date.UTC(2026, 8, 13, 18, 0, 0); // 2026-09-14T00:00:00+06:00

  var stopwatchEl = document.getElementById("stopwatch");

  function pad(n) {
    return String(n).length < 2 ? "0" + n : String(n);
  }

  function tickStopwatch() {
    var elapsed = Date.now() - START_MS;
    if (elapsed < 0) elapsed = 0;

    var totalSeconds = Math.floor(elapsed / 1000);
    var days = Math.floor(totalSeconds / 86400);
    var hours = Math.floor((totalSeconds % 86400) / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;

    stopwatchEl.textContent =
      pad(days) + "d " + pad(hours) + "h " + pad(minutes) + "m " + pad(seconds) + "s";
  }

  tickStopwatch();
  setInterval(tickStopwatch, 1000);
})();
