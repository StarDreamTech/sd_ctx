// content.js
let mouseDiv = null;

function createMouseDiv() {
  if (!mouseDiv) {
    mouseDiv = document.createElement('div');
    mouseDiv.style.position = 'fixed'; // 固定在视口
    mouseDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    mouseDiv.style.color = '#fff';
    mouseDiv.style.fontSize = '12px';
    mouseDiv.style.padding = '2px 5px';
    mouseDiv.style.borderRadius = '3px';
    mouseDiv.style.pointerEvents = 'none';
    mouseDiv.style.zIndex = '999999';
    document.body.appendChild(mouseDiv);
  }
}

function updateMousePosition(e) {
  if (mouseDiv) {
    // 使用 clientX 和 clientY，相对于视口坐标
    const offsetX = 10; // 水平偏移
    const offsetY = 10; // 垂直偏移
    mouseDiv.style.left = `${e.clientX + offsetX}px`;
    mouseDiv.style.top = `${e.clientY + offsetY}px`;
    mouseDiv.textContent = `X: ${e.clientX}, Y: ${e.clientY}`;
    mouseDiv.style.display = 'block';

    // 防止提示框超出视口
    const rect = mouseDiv.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    if (rect.right > viewportWidth) {
      mouseDiv.style.left = `${e.clientX - rect.width - offsetX}px`;
    }
    if (rect.bottom > viewportHeight) {
      mouseDiv.style.top = `${e.clientY - rect.height - offsetY}px`;
    }
  }
}

function enableMouseTracking() {
  createMouseDiv();
  document.addEventListener('mousemove', updateMousePosition);
}

function disableMouseTracking() {
  if (mouseDiv) {
    document.removeEventListener('mousemove', updateMousePosition);
    mouseDiv.style.display = 'none';
  }
}

if (!window.mouseTrackingInitialized) {
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'enableMouseTracking') {
      enableMouseTracking();
    } else if (message.action === 'disableMouseTracking') {
      disableMouseTracking();
    }
  });
  window.mouseTrackingInitialized = true;
}