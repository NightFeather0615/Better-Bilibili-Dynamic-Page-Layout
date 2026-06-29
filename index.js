// ==UserScript==
// @name         Bilibili 動態套用 YouTube 排版
// @namespace    https://github.com/NightFeather0615
// @version      1.1
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
    + " display:flex !important; flex-direction:row !important;"
    + " margin:0 auto; padding:16px 24px; gap:24px;"
    + "}"
    // Background
    + "html.bili_dark #app {"
    + " background-color: var(--bg1) !important;"
    + "}"
    // Left sidebar
    + "aside.left {"
    + " width:240px !important; flex-shrink:0 !important;"
    + " display:flex !important; flex-direction:column !important; gap:12px;"
    + "}"
    // Hide user info (first section in aside.left)
    + "aside.left > section:first-child { display:none !important; }"
    // Main feed area
    + "main {"
    + " flex:1 !important; min-width:0 !important;"
    + " display:block !important; width:auto !important;"
    + "}"
    // Hide right sidebar
    + "aside.right { display:none !important; }"
    // Feed grid in main
    + "main .bili-dyn-list__items {"
    + " display:grid !important;"
    + " grid-template-columns:repeat(auto-fill,minmax(498px,1fr)) !important;"
    + " gap:20px !important;"
    + "}"
    + "main .bili-dyn-list__item {"
    + " background:transparent; border-radius:10px;"
    + " overflow:hidden; transition:transform .12s ease; list-style:none;"
    + "}"
    + "main .bili-dyn-list__item:hover { transform:translateY(-2px); }"
    + "main .bili-dyn-list-tabs { margin-bottom:12px; }"
    + "main .bili-dyn-publishing { display:none !important; }"
    // Sidebar items
    + ".yt-sidebar-title {"
    + " font-size:15px; font-weight:600;"
    + " color:var(--text1,#222); padding:12px 12px;"
    + "}"
    + ".yt-sidebar-item {"
    + " display:flex; align-items:center; gap:10px;"
    + " padding:6px 12px; cursor:pointer; border-radius:8px;"
    + " text-decoration:none; color:var(--text1,#222); font-size:14px;"
    + "}"
    + ".yt-sidebar-item:hover { background:var(--bg2,#f0f0f0); }"
    + ".yt-sidebar-avatar {"
    + " width:28px; height:28px; border-radius:50%; flex-shrink:0;"
    + " background:var(--bg3,#e0e0e0); overflow:hidden;"
    + "}"
    + ".yt-sidebar-avatar img { width:100%; height:100%; object-fit:cover; }"
    + ".yt-sidebar-name {"
    + " white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"
    + "}"
    // Card styles
    + ".yt-card-link {"
    + " display:block; text-decoration:none; color:var(--text1,#222);"
    + "}"
    + ".yt-thumb {"
    + " position:relative; width:100%; aspect-ratio:16/9;"
    + " overflow:hidden; background:#000; border-radius:10px;"
    + "}"
    + ".yt-thumb img { width:100%; height:100%; object-fit:cover; }"
    + ".yt-duration {"
    + " position:absolute; bottom:6px; right:6px;"
    + " background:rgba(0,0,0,.8); color:#fff;"
    + " padding:1px 6px; border-radius:4px;"
    + " font-size:12px; font-weight:500; line-height:1.4;"
    + " pointer-events:none;"
    + "}"
    + ".yt-info { padding:10px 12px 14px; }"
    + ".yt-title {"
    + " font-size:1.04rem; font-weight:500; line-height:1.4; text-overflow: ellipsis;"
    + " margin:0 0 4px; display:-webkit-box;"
    + " -webkit-line-clamp:2; -webkit-box-orient:vertical;"
    + " overflow:hidden; color:var(--text1,#222);"
    + "}"
    + ".yt-meta-line {"
    + " font-size:0.88rem; color:var(--text2,#666);"
    + " display:flex; align-items:center; flex-wrap:wrap;"
    + " gap:4px; margin-top:4px;"
    + "}"
  );

  function buildSidebar(upList) {
    var content = upList.querySelector('.bili-dyn-up-list__content');
    if (!content) return;
    if (upList.querySelector('.yt-sidebar')) return;

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

    upList.innerHTML = '';
    upList.appendChild(sidebar);
  }

  function transformCard(item) {
    if (item.dataset.yt) return;

    var link = item.querySelector('a.bili-dyn-card-video');
    if (!link) {
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
      img.src = thumbSrc;
      img.alt = titleText;
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
    if (titleText) {
      var titleDiv = document.createElement('div');
      titleDiv.className = 'yt-title';
      titleDiv.textContent = titleText;
      info.appendChild(titleDiv);
    }
    var metaParts = [];
    if (channelName) metaParts.push(channelName);
    if (viewCount) metaParts.push(viewCount + "次观看");
    if (timeText) metaParts.push(timeText);
    if (metaParts.length) {
      var meta = document.createElement('div');
      meta.className = 'yt-meta-line';
      meta.textContent = metaParts.join(' · ');
      info.appendChild(meta);
    }
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

  function clickVideoTab() {
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

    // Live users: remove sticky, keep in aside.left
    var liveUsers = asideLeft.querySelector('.bili-dyn-live-users');
    if (liveUsers) {
      liveUsers.style.position = 'static';
    }

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

    // Build sidebar (now inside aside.left)
    var upListAgain = asideLeft.querySelector('.bili-dyn-up-list');
    if (upListAgain) {
      var upSec = upListAgain.closest('section');
      if (upSec) upSec.style.border = 'none';
      buildSidebar(upListAgain);
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

    var isVideo = location.href.indexOf('tab=video') > -1;
    if (!isVideo) {
      clickVideoTab();
    }

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
