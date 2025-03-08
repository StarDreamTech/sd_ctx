// alert.js
function showTip(msg, bgColor, borderColor, fontColor) {
  const tipCount = document.querySelectorAll(".tips").length;
  const top = tipCount * 45 + 10;

  const tip = document.createElement("div");
  tip.className = "tips";
  tip.textContent = msg;
  tip.style.position = "fixed";
  tip.style.right = "-200px";
  tip.style.padding = "10px 20px";
  tip.style.boxShadow = "0 10px 10px -10px rgba(0, 0, 0, 0.5)";
  tip.style.borderRadius = "8px";
  tip.style.zIndex = "9999";
  tip.style.border = "1px solid";
  tip.style.display = "flex";
  tip.style.justifyContent = "center";
  tip.style.alignItems = "center";
  tip.style.backgroundColor = bgColor;
  tip.style.borderColor = borderColor;
  tip.style.color = fontColor;
  tip.style.top = `${top}px`;

  document.body.appendChild(tip);

  setTimeout(() => {
    tip.style.transition = "right 0.5s";
    tip.style.right = "10px";
  }, 10);

  setTimeout(() => {
    tip.style.transition = "top 1s";
    tip.style.top = "-100px";
    setTimeout(() => tip.remove(), 1000);
  }, 3000);
}

export function successAlert(msg) {
  showTip(msg, "#d1e7dd", "#a3cfbb", "#146c43");
}

export function warningAlert(msg) {
  showTip(msg, "#fff3cd", "#ffe69c", "#997404");
}
