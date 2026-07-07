// ==UserScript==
// @name         Bilibili 動態套用 YouTube 排版
// @namespace    https://github.com/NightFeather0615
// @version      1.6
// @license      MPL-2.0
// @description  將 Bilibili 動態頁面排版轉換為 YouTube 訂閱內容排版
// @author       NightFeather
// @match        *://t.bilibili.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// ==/UserScript==

(function () {
  "use strict";

  GM_addStyle(
    ".bili-dyn-home--member {"
    + " display: flex !important;"
    + " flex-direction: row !important;"
    + " margin: 0 auto;"
    + " padding: 16px 24px;"
    + " gap: 24px;"
    + "}"

    // Hide top bar
    + "section: has(.bili-dyn-publishing) {"
    + " display: none !important;"
    + "}"

    // Background
    + "html.bili_dark #app {"
    + " background-color: var(--bg1) !important;"
    + "}"

    // Left sidebar
    + "aside.left {"
    + " width: 240px !important;"
    + " flex-shrink: 0 !important;"
    + " display: flex !important;"
    + " flex-direction: column !important;"
    + " gap: 12px;"
    + " position: sticky;"
    + " top: 0;"
    + " align-self: flex-start;"
    + " height: 100vh;"
    + " overflow-y: auto;"
    + "}"

    // Hide user info (first section in aside.left)
    + "aside.left > section: first-child {"
    + " display: none !important;"
    + "}"

    // Main feed area
    + "main {"
    + " flex: 1 !important;"
    + " min-width: 0 !important;"
    + " display: block !important;"
    + " width: auto !important;"
    + "}"

    // Hide right sidebar
    + "aside.right {"
    + " display: none !important;"
    + "}"

    // Feed grid in main
    + "main .bili-dyn-list {"
    + " margin-top: 0px !important;"
    + "}"

    + "main .bili-dyn-list__items {"
    + " display: grid !important;"
    + " grid-template-columns: repeat(auto-fill,minmax(498px,1fr)) !important;"
    + " gap: 20px !important;"
    + "}"
    + "main .bili-dyn-list__item {"
    + " background: transparent;"
    + " border-radius: 10px;"
    + " list-style: none;"
    + "}"

    // Dynamic color glow (--hover-color set by JS)
    + ".yt-card-link {"
    + " position: relative;"
    + " overflow: visible;"
    + "}"

    + ".yt-card-link::before {"
    + " content: '';"
    + " position: absolute;"
    + " inset: -8px;"
    + " border-radius: 16px;"
    + " background: var(--hover-color,transparent);"
    + " opacity: 0;"
    + " transition: opacity .18s ease-in-out;"
    + " z-index: -1;"
    + " pointer-events: none;"
    + "}"

    + ".yt-card-link:hover::before {"
    + " opacity: 0.35;"
    + "}"

    + "main .bili-dyn-list-tabs {"
    + " margin-bottom: 12px;"
    + " display: none;"
    + "}"

    + "main .bili-dyn-publishing {"
    + " display: none !important;"
    + "}"

    // Sidebar items
    + ".yt-sidebar-title {"
    + " position: sticky;"
    + " top: 0;"
    + " z-index: 1;"
    + " font-size: 15px;"
    + " font-weight: 600;"
    + " color: var(--text1,#222);"
    + " padding: 12px 12px;"
    + " background: var(--bg2,#f0f0f0);"
    + " border-bottom: 1px solid var(--line1, rgba(0,0,0,.06));"
    + "}"

    + ".yt-sidebar-item {"
    + " display: flex;"
    + " align-items: center;"
    + " gap: 10px;"
    + " padding: 6px 12px;"
    + " cursor: pointer;"
    + " border-radius: 8px;"
    + " text-decoration: none;"
    + " color: var(--text1,#222);"
    + " font-size: 14px;"
    + "}"

    + ".yt-sidebar-item:hover {"
    + " background: var(--bg2,#f0f0f0);"
    + "}"

    + ".yt-sidebar-avatar {"
    + " width: 28px;"
    + " height: 28px;"
    + " border-radius: 50%;"
    + " flex-shrink: 0;"
    + " background: var(--bg3,#e0e0e0);"
    + " overflow: hidden;"
    + "}"

    + ".yt-sidebar-avatar img {"
    + " width: 100%;"
    + " height: 100%;"
    + " object-fit: cover;"
    + "}"

    + ".yt-sidebar-name {"
    + " white-space: nowrap;"
    + " overflow: hidden;"
    + " text-overflow: ellipsis;"
    + "}"

    + ".yt-live-users,"
    + ".yt-sidebar {"
    + " flex-shrink: 0;"
    + "}"

    // Card styles
    + ".yt-card-link {"
    + " display: block;"
    + " text-decoration: none;"
    + " color: var(--text1,#222);"
    + "}"

    + ".yt-thumb {"
    + " position: relative;"
    + " width: 100%;"
    + " aspect-ratio: 16/9;"
    + " overflow: hidden;"
    + " background: #000;"
    + " border-radius: 10px;"
    + "}"

    + ".yt-thumb img {"
    + " width: 100%;"
    + " height: 100%;"
    + " object-fit: cover;"
    + "}"

    + ".yt-duration {"
    + " position: absolute;"
    + " bottom: 6px;"
    + " right: 6px;"
    + " background: rgba(0,0,0,.8);"
    + " color: #fff;"
    + " padding: 1px 6px;"
    + " border-radius: 4px;"
    + " font-size: 12px;"
    + " font-weight: 500;"
    + " line-height: 1.4;"
    + " pointer-events: none;"
    + "}"

    + ".yt-info {"
    + " display: flex;"
    + " gap: 10px;"
    + " padding: 10px 6px 10px 6px;"
    + "}"

    + ".yt-avatar {"
    + " width: 36px;"
    + " height: 36px;"
    + " border-radius: 50%;"
    + " flex-shrink: 0;"
    + " overflow: hidden;"
    + " background: var(--bg2,#e0e0e0);"
    + "}"

    + ".yt-avatar img { width: 100%;"
    + " height: 100%;"
    + " object-fit: cover;"
    + " }"

    + ".yt-info-body { flex: 1;"
    + " min-width: 0;"
    + " }"

    + ".yt-title {"
    + " font-size: 1.04rem;"
    + " font-weight: 500;"
    + " line-height: 1.4;"
    + " text-overflow: ellipsis;"
    + " margin: 0 0 4px;"
    + " display: -webkit-box;"
    + " -webkit-line-clamp: 2;"
    + " -webkit-box-orient: vertical;"
    + " overflow: hidden;"
    + " color: var(--text1,#222);"
    + "}"

    + ".yt-meta-line {"
    + " font-size: 0.88rem;"
    + " color: var(--text2,#666);"
    + " display: flex;"
    + " align-items: center;"
    + " flex-wrap: wrap;"
    + " gap: 4px;"
    + " margin-top: 4px;"
    + "}"
  );

  var avatarMap = {};

  function buildSidebar(upList, asideLeft) {
    var content = upList.querySelector('.bili-dyn-up-list__content');
    if (!content) return;
    if (asideLeft.querySelector('.yt-sidebar')) return;

    var sidebar = document.createElement('div');
    sidebar.className = 'yt-sidebar';

    var title = document.createElement('div');
    title.className = 'yt-sidebar-title';
    title.textContent = '订阅';
    sidebar.appendChild(title);

    var items = content.querySelectorAll(':scope > .bili-dyn-up-list__item');
    for (var i = 1; i < items.length; i++) {
      var entry = items[i];
      var nameEl = entry.querySelector('.bili-dyn-up-list__item__name');
      var name = nameEl ? nameEl.textContent.trim() : '';
      if (!name) continue;

      var imgWrapper = entry.querySelector('.bili-dyn-up-list__item__face__img');
      var avatarSrc = '';
      if (imgWrapper) {
        var img = imgWrapper.querySelector('img');
        if (img) avatarSrc = img.getAttribute('src') || img.src || '';
      }

      if (avatarSrc) avatarMap[name] = avatarSrc;

      var a = document.createElement('a');
      a.className = 'yt-sidebar-item';
      a.href = '#';
      a.title = name;

      var avatarDiv = document.createElement('div');
      avatarDiv.className = 'yt-sidebar-avatar';
      if (avatarSrc) {
        var aImg = document.createElement('img');
        aImg.src = avatarSrc;
        aImg.alt = '';
        avatarDiv.appendChild(aImg);
      }
      a.appendChild(avatarDiv);

      var nameSpan = document.createElement('span');
      nameSpan.className = 'yt-sidebar-name';
      nameSpan.textContent = name;
      a.appendChild(nameSpan);

      sidebar.appendChild(a);
    }

    // Insert sidebar as direct child of aside.left, then remove the old up-list wrapper
    var liveUsers = asideLeft.querySelector('.yt-live-users');
    if (liveUsers) {
      asideLeft.insertBefore(sidebar, liveUsers.nextSibling);
    } else {
      asideLeft.appendChild(sidebar);
    }
    var upSection = upList.closest('section');
    if (upSection) upSection.remove();
  }

  function buildLiveUsers() {
    var container = document.querySelector('aside.left .bili-dyn-live-users');
    if (!container) return null;
    if (document.querySelector('.yt-live-users')) return null;

    var items = container.querySelectorAll('.bili-dyn-live-users__item');

    var section = document.createElement('div');
    section.className = 'yt-live-users';

    var title = document.createElement('div');
    title.className = 'yt-sidebar-title';
    var titleSpan = container.querySelector('.bili-dyn-live-users__title');
    title.textContent = titleSpan ? titleSpan.textContent.trim() : '直播';
    section.appendChild(title);

    for (var i = 0; i < items.length; i++) {
      var entry = items[i];
      var nameEl = entry.querySelector('.bili-dyn-live-users__item__uname');
      var name = nameEl ? nameEl.textContent.trim() : '';
      if (!name) continue;

      var img = entry.querySelector('picture > img');
      var avatarSrc = img ? (img.getAttribute('src') || '') : '';

      var a = document.createElement('a');
      a.className = 'yt-sidebar-item';
      a.href = '#';
      a.title = name;

      var avatarDiv = document.createElement('div');
      avatarDiv.className = 'yt-sidebar-avatar';
      if (avatarSrc) {
        var aImg = document.createElement('img');
        aImg.src = avatarSrc.indexOf('//') === 0 ? 'https:' + avatarSrc : avatarSrc;
        aImg.alt = '';
        avatarDiv.appendChild(aImg);
      }
      a.appendChild(avatarDiv);

      var nameSpan = document.createElement('span');
      nameSpan.className = 'yt-sidebar-name';
      nameSpan.textContent = name;
      a.appendChild(nameSpan);

      section.appendChild(a);
    }

    container.parentNode.replaceChild(section, container);
    return section;
  }

  function getDominantColor(img) {
    try {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var w = img.naturalWidth || 320;
      var h = img.naturalHeight || 180;
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
      var data = ctx.getImageData(0, 0, w, h).data;
      var r = 0, g = 0, b = 0, count = 0;
      for (var i = 0; i < data.length; i += 40) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }
      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);
      // Darken if too bright so glow stays visible and text readable
      var brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      if (brightness > 100) {
        var scale = 100 / brightness;
        r = Math.round(r * scale);
        g = Math.round(g * scale);
        b = Math.round(b * scale);
      }
      if (brightness < 50) {
        var scale = 50 / brightness;
        r = Math.round(r * scale);
        g = Math.round(g * scale);
        b = Math.round(b * scale);
      }
      return 'rgb(' + r + ',' + g + ',' + b + ')';
    } catch (e) {
      return '';
    }
  }

  function transformCard(item) {
    if (item.dataset.yt) return;

    var badgeText = item.querySelector('.bili-dyn-card-video__badge')?.textContent;

    var link = item.querySelector('a.bili-dyn-card-video');
    if (!link || badgeText === "充电专属") {
      item.style.display = 'none';
      item.dataset.yt = '1';
      return;
    }

    var videoUrl = link.href;
    if (!videoUrl.startsWith('http')) videoUrl = 'https:' + videoUrl;

    var coverImg = link.querySelector('.bili-dyn-card-video__cover img');
    var thumbSrc = coverImg ? (coverImg.getAttribute('src') || coverImg.src || '') : '';

    var durationEl = link.querySelector('.duration-time');
    var duration = durationEl ? durationEl.textContent.trim() : '';

    var titleEl = link.querySelector('.bili-dyn-card-video__title');
    var titleText = titleEl ? titleEl.textContent.trim() : '';

    var statItem = link.querySelector('.bili-dyn-card-video__stat__item');
    var viewCount = statItem ? statItem.textContent.trim() : '';

    var nameEl = item.querySelector('.bili-dyn-title__text');
    var channelName = nameEl ? nameEl.textContent.trim() : '';

    var timeEl = item.querySelector('.bili-dyn-time');
    var timeText = timeEl ? timeEl.textContent.trim() : '';

    for (var i = item.children.length - 1; i >= 0; i--) {
      item.children[i].style.display = 'none';
    }

    var cardLink = document.createElement('a');
    cardLink.className = 'yt-card-link';
    cardLink.href = videoUrl;
    cardLink.target = '_blank';

    var thumb = document.createElement('div');
    thumb.className = 'yt-thumb';
    if (thumbSrc) {
      var img = document.createElement('img');
      img.crossOrigin = 'anonymous';
      img.src = thumbSrc;
      img.alt = titleText;
      img.addEventListener('load', function () {
        var color = getDominantColor(img);
        if (color) {
          cardLink.style.setProperty('--hover-color', color);
        }
      });
      img.addEventListener('error', function () {
        // Retry without crossOrigin (CORS might fail)
        img.crossOrigin = '';
        img.src = thumbSrc;
      });
      thumb.appendChild(img);
    }
    if (duration) {
      var dur = document.createElement('span');
      dur.className = 'yt-duration';
      dur.textContent = duration;
      thumb.appendChild(dur);
    }
    cardLink.appendChild(thumb);

    var info = document.createElement('div');
    info.className = 'yt-info';

    // Avatar
    var avatarDiv = document.createElement('div');
    avatarDiv.className = 'yt-avatar';
    info.appendChild(avatarDiv);

    function fillAvatar(url) {
      if (!url || avatarDiv.querySelector('img')) return;
      if (url.indexOf('//') === 0) url = 'https:' + url;
      url = url.replace(/@\d+w_\d+h.*$/, '');
      if (url.indexOf('https:') !== 0 && url.indexOf('http:') !== 0) return;
      var aImg = document.createElement('img');
      aImg.crossOrigin = 'anonymous';
      aImg.src = url;
      aImg.alt = '';
      aImg.loading = 'lazy';
      aImg.addEventListener('error', function () {
        aImg.crossOrigin = '';
        aImg.src = url;
      });
      avatarDiv.appendChild(aImg);
    }

    var src = avatarMap[channelName] || '';
    fillAvatar(src);

    // Watch for lazy-loaded avatar: inner img appears after transform
    var avatarContainer = item.querySelector('.bili-dyn-item__avatar');
    if (avatarContainer && !avatarDiv.querySelector('img')) {
      var obs = new MutationObserver(function () {
        var img = avatarContainer.querySelector('img[src]');
        if (img && img.src && img.src.indexOf('data:') !== 0) {
          fillAvatar(img.src);
          avatarMap[channelName] = img.src;
          obs.disconnect();
        }
      });
      obs.observe(avatarContainer, { childList: true, subtree: true });
    }

    // Body (title + meta)
    var bodyDiv = document.createElement('div');
    bodyDiv.className = 'yt-info-body';
    if (titleText) {
      var titleDiv = document.createElement('div');
      titleDiv.className = 'yt-title';
      titleDiv.textContent = titleText;
      bodyDiv.appendChild(titleDiv);
    }
    var metaParts = [];
    if (channelName) metaParts.push(channelName);
    if (viewCount) metaParts.push(viewCount + "次观看");
    if (timeText) metaParts.push(timeText);
    if (metaParts.length) {
      var meta = document.createElement('div');
      meta.className = 'yt-meta-line';
      meta.textContent = metaParts.join(' · ');
      bodyDiv.appendChild(meta);
    }
    info.appendChild(bodyDiv);

    cardLink.appendChild(info);

    item.appendChild(cardLink);
    item.dataset.yt = '1';
  }

  function transformAll() {
    var items = document.querySelectorAll('.bili-dyn-list__item:not([data-yt])');
    for (var i = 0; i < items.length; i++) {
      transformCard(items[i]);
    }
  }

  function checkVideoTab() {
    var isVideo = location.href.indexOf('tab=video') > -1;

    if (isVideo) return true;

    var tabs = document.querySelectorAll('.bili-dyn-list-tabs__item');

    for (var i = 0; i < tabs.length; i++) {
      if (tabs[i].textContent.trim() === '视频投稿') {
        if (!tabs[i].classList.contains('active')) {
          tabs[i].click();
          return true;
        }

        return false;
      }
    }

    return false;
  }

  function applyStructure() {
    var container = document.querySelector('.bili-dyn-home--member');
    if (!container) return;

    var asideLeft = container.querySelector('aside.left');
    if (!asideLeft) return;

    // Hide user info section (inline fallback for SPA)
    var myInfoSection = asideLeft.querySelector('section .bili-dyn-my-info');
    if (myInfoSection) {
      myInfoSection.closest('section').style.display = 'none';
    }

    // Replace live users with custom list (no JS scroll behavior)
    var liveUsers = buildLiveUsers();

    // Move up-list from main into aside.left (after live-users)
    var upList = container.querySelector('.bili-dyn-up-list');
    if (upList && !asideLeft.contains(upList)) {
      var upSection = upList.closest('section');
      if (upSection) {
        if (liveUsers && liveUsers.parentNode === asideLeft) {
          asideLeft.insertBefore(upSection, liveUsers.nextSibling);
        } else {
          asideLeft.appendChild(upSection);
        }
      }
    }

    // Build sidebar as direct child of aside.left
    var upListAgain = asideLeft.querySelector('.bili-dyn-up-list');
    if (upListAgain) {
      buildSidebar(upListAgain, asideLeft);
    }

    // Hide aside.right (inline fallback)
    var asideRight = container.querySelector('aside.right');
    if (asideRight) {
      asideRight.style.display = 'none';
    }

    // Hide publishing forms
    var publishingForms = container.querySelectorAll('.bili-dyn-publishing');
    for (var i = 0; i < publishingForms.length; i++) {
      publishingForms[i].style.display = 'none';
    }

    // Hide non-video feed items in aside.left (if any)
    var asideItems = asideLeft.querySelectorAll('.bili-dyn-list__item:not([data-yt])');
    for (var i = 0; i < asideItems.length; i++) {
      var link = asideItems[i].querySelector('a.bili-dyn-card-video');

      if (!link) {
        asideItems[i].style.display = 'none';
        asideItems[i].dataset.yt = '1';
      }
    }

    fixSidebar();
  }

  function fixSidebar() {
    var sidebar = document.querySelector('aside.left');
    if (!sidebar || sidebar.dataset.ytFixed) return;
    var rect = sidebar.getBoundingClientRect();
    var nav = document.querySelector('.bili-header__channel, .international-header, .bili-header__bar, .bili-header');
    var navH = nav ? nav.getBoundingClientRect().bottom : 0;

    sidebar.dataset.ytFixed = '1';
    sidebar.style.position = 'fixed';
    sidebar.style.top = Math.max(0, navH) + 'px';
    sidebar.style.left = rect.left - 6 + 'px';
    sidebar.style.width = rect.width + 'px';
    sidebar.style.height = (window.innerHeight - Math.max(0, navH)) + 'px';
    sidebar.style.zIndex = '100';

    // Shift main content so it doesn't go under the fixed sidebar
    var main = document.querySelector('main');
    if (main) main.style.marginLeft = '264px';
  }

  function removeRedundantElements() {
    let fBtn = document.querySelector('div.bili-dyn-sidebar');
    if (fBtn) fBtn.remove();

    let bg = document.querySelector('div.bg');
    if (bg) bg.remove();
  }

  function setup() {
    var html = document.documentElement;
    if (html.classList.contains('yt-active')) return;
    html.classList.add('yt-active');

    applyStructure();
    removeRedundantElements();
    transformAll();
    checkVideoTab();

    // Observe main's feed for new items
    var mainFeed = document.querySelector('main .bili-dyn-list__items');
    if (mainFeed) {
      new MutationObserver(function () {
        transformAll();
      }).observe(mainFeed, { childList: true, subtree: true });
    }

    // Observe page for any structural changes (SPA re-renders)
    new MutationObserver(function () {
      applyStructure();
      removeRedundantElements();
      transformAll();
      checkVideoTab();
    }).observe(document.querySelector('.bili-dyn-home--member') || document.body, {
      childList: true, subtree: true, attributes: false
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
})();
