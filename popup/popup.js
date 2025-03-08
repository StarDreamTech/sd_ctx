import { successAlert, warningAlert } from './alert.js';

document.addEventListener('DOMContentLoaded', () => {
  if (typeof chrome === 'undefined' || !chrome.storage) {
    console.error('Chrome extension API not available');
    return;
  }

  const toggleMousePosBtn = document.getElementById('toggle-mouse-pos');
  const toggleLinksBtn = document.getElementById('toggle-links');
  const toggleCoinPriceBtn = document.getElementById('toggle-coin-price'); // 新增
  const linkContainer = document.getElementById('link-container');
  const coinContainer = document.getElementById('coin-container'); // 新增
  const dogePriceElem = document.getElementById('doge-price'); // 新增
  const pepePriceElem = document.getElementById('pepe-price'); // 新增
  const linkItems = document.querySelectorAll('.link-item');
  const getUaBtn = document.getElementById('get-ua');
  const getCookiesBtn = document.getElementById('get-cookies');
  const result = document.getElementById('result');
  const copyResultBtn = document.getElementById('copy-result');

  if (!toggleMousePosBtn || !toggleLinksBtn || !linkContainer || !toggleCoinPriceBtn || !coinContainer) {
    console.error('One or more required DOM elements not found');
    return;
  }

  // 初始化状态
  chrome.storage.local.get(['mousePosEnabled', 'linksVisible', 'coinPriceVisible'], (data) => {
    const mousePosEnabled = data.mousePosEnabled || false;
    const linksVisible = data.linksVisible !== false;
    const coinPriceVisible = data.coinPriceVisible || false;

    toggleMousePosBtn.classList.toggle('active', mousePosEnabled);
    toggleLinksBtn.classList.toggle('active', linksVisible);
    toggleCoinPriceBtn.classList.toggle('active', coinPriceVisible); // 新增
    linkContainer.style.display = linksVisible ? 'flex' : 'none';
    coinContainer.style.display = coinPriceVisible ? 'flex' : 'none'; // 新增
    if (mousePosEnabled) {
      enableMouseTracking();
    }
    if (coinPriceVisible) {
      fetchCoinPrices(); // 新增：显示时获取价格
    }
  });

  // 币圈价格按钮事件
  toggleCoinPriceBtn.addEventListener('click', () => {
    const isActive = !toggleCoinPriceBtn.classList.contains('active');
    toggleCoinPriceBtn.classList.toggle('active');
    coinContainer.style.display = isActive ? 'flex' : 'none';
    chrome.storage.local.set({ coinPriceVisible: isActive });
    if (isActive) {
      fetchCoinPrices(); // 显示时获取价格
    }
  });

  // 其他已有事件监听器保持不变
  linkItems.forEach(item => {
    item.addEventListener('click', () => {
      const url = item.getAttribute('data-url');
      chrome.tabs.create({ url });
    });
  });

  toggleMousePosBtn.addEventListener('click', () => {
    const isActive = !toggleMousePosBtn.classList.contains('active');
    toggleMousePosBtn.classList.toggle('active');
    chrome.storage.local.set({ mousePosEnabled: isActive });
    if (isActive) {
      enableMouseTracking();
    } else {
      disableMouseTracking();
    }
  });

  toggleLinksBtn.addEventListener('click', () => {
    const isActive = !toggleLinksBtn.classList.contains('active');
    toggleLinksBtn.classList.toggle('active');
    linkContainer.style.display = isActive ? 'flex' : 'none';
    chrome.storage.local.set({ linksVisible: isActive });
  });

  getUaBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        const url = tabs[0].url;
        if (url.startsWith('chrome://') || url.startsWith('about:')) {
          warningAlert('无法在 Chrome 内部页面上执行操作');
          return;
        }
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: () => navigator.userAgent
        }, (results) => {
          if (results && results[0]) {
            result.value = results[0].result;
          }
        });
      }
    });
  });

  getCookiesBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        const url = tabs[0].url;
        if (url.startsWith('chrome://') || url.startsWith('about:')) {
          warningAlert('无法在 Chrome 内部页面上获取 Cookie');
          return;
        }
        chrome.cookies.getAll({ url: tabs[0].url }, (cookies) => {
          if (cookies) {
            const cookieString = cookies.map(c => `${c.name}=${c.value}`).join('; ');
            result.value = cookieString;
          }
        });
      }
    });
  });

  copyResultBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(result.value)
      .then(() => successAlert('复制成功'))
      .catch(err => console.error('Copy failed:', err));
  });

  // 获取币价函数
  function fetchCoinPrices() {
    const apiUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=dogecoin,pepe&vs_currencies=usd'; // 示例API
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        dogePriceElem.textContent = `$${data.dogecoin.usd}`;
        pepePriceElem.textContent = `$${data.pepe.usd}`;
      })
      .catch(error => {
        console.error('获取币价失败:', error);
        dogePriceElem.textContent = '获取失败';
        pepePriceElem.textContent = '获取失败';
      });
  }

  function enableMouseTracking() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        const url = tabs[0].url;
        if (url.startsWith('chrome://') || url.startsWith('about:')) {
          toggleMousePosBtn.classList.remove('active');
          chrome.storage.local.set({ mousePosEnabled: false });
          warningAlert('无法在 Chrome 内部页面上显示鼠标位置');
          return;
        }
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ['content.js']
        }).then(() => {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'enableMouseTracking' });
        }).catch(err => console.error('Script injection failed:', err));
      }
    });
  }

  function disableMouseTracking() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'disableMouseTracking' });
      }
    });
  }
});