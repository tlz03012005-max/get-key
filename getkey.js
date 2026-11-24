// Dán danh sách key lấy từ keys.json (mục "available") vào mảng dưới đây
const KEY_POOL = [
  "TLZ4K9M2",
  "TLZ7P3X8",
  "TLZ2R6V5",
  "TLZ9H4C7",
  "TLZ5N8Q3",
  "TLZ3W7F6",
  "TLZ8B2Y9",
  "TLZ6D5T4",
  "TLZ4J9S2",
  "TLZ7M3K8",
  "TLZ2X6P5",
  "TLZ9V4R7",
  "TLZ5C8H3",
  "TLZ3Q7N6",
  "TLZ8F2W9",
  "TLZ6Y5B4",
  "TLZ4T9D2",
  "TLZ7S3J8",
  "TLZ2K6M5",
  "TLZ9P4X7",
  "TLZ5R8V3",
  "TLZ3H7C6",
  "TLZ8N2Q9",
  "TLZ6W5F4",
  "TLZ4B9Y2",
  "TLZ7D3T8",
  "TLZ2J6S5",
  "TLZ9M4K7",
  "TLZ5X8P3",
  "TLZ3V7R6",
  "TLZ8C2H9",
  "TLZ6Q5N4",
  "TLZ4F9W2",
  "TLZ7Y3B8",
  "TLZ2T6D5",
  "TLZ9S4J7",
  "TLZ5K8M3",
  "TLZ3P7X6",
  "TLZ8R2V9",
  "TLZ6H5C4",
  "TLZ4N9Q2",
  "TLZ7W3F8",
  "TLZ2B6Y5",
  "TLZ9D4T7",
  "TLZ5J8S3",
  "TLZ3M7K6",
  "TLZ8X2P9",
  "TLZ6V5R4",
  "TLZ4C9H2",
  "TLZ7Q3N8"
];

const STORAGE_KEY = "tlz_assigned_keys_v1";
let currentAssignedKey = "";

function getAssignedKeys() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveAssignedKeys(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {}
}

function pickKeyForUser() {
  const cleanPool = KEY_POOL
    .map((k) => String(k || "").trim())
    .filter(Boolean);

  if (cleanPool.length === 0) {
    return { ok: false, message: "Kho key trên trang chưa được cấu hình." };
  }

  const assigned = getAssignedKeys();
  const availableForBrowser = cleanPool.filter((k) => !assigned.includes(k));

  if (availableForBrowser.length === 0) {
    return {
      ok: false,
      message: "Bạn đã nhận hết key khả dụng trên trình duyệt này.",
    };
  }

  const idx = Math.floor(Math.random() * availableForBrowser.length);
  const chosenKey = availableForBrowser[idx];

  assigned.push(chosenKey);
  saveAssignedKeys(assigned);

  return { ok: true, key: chosenKey };
}

function copyKey() {
  if (!currentAssignedKey) return;
  const statusBox = document.getElementById("statusMsg");
  const copyBtn = document.getElementById("copyBtn");

  const onDone = () => {
    if (statusBox) {
      statusBox.textContent = `Đã sao chép key: ${currentAssignedKey}`;
    }
    if (copyBtn) {
      const oldText = copyBtn.textContent;
      copyBtn.textContent = "✅ Đã Copy Key";
      setTimeout(() => {
        copyBtn.textContent = oldText;
      }, 1500);
    }
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(currentAssignedKey).then(onDone).catch(() => fallbackCopy(currentAssignedKey, onDone));
  } else {
    fallbackCopy(currentAssignedKey, onDone);
  }
}

function fallbackCopy(text, onDone) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
    onDone();
  } catch (e) {}
  document.body.removeChild(ta);
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const isDone = params.get("done") === "1";

  const keyBox = document.getElementById("keyBox");
  const copyBtn = document.getElementById("copyBtn");
  const statusBox = document.getElementById("statusMsg");
  const descText = document.getElementById("descText");

  if (!isDone) {
    if (keyBox) keyBox.textContent = "CHƯA HOÀN THÀNH";
    if (copyBtn) copyBtn.disabled = true;
    if (descText) descText.textContent = "Bạn chưa hoàn tất bước vượt link.";
    if (statusBox) {
      statusBox.textContent = "Hãy hoàn thành nhiệm vụ vượt link để mở khóa key.";
    }
    return;
  }

  const res = pickKeyForUser();
  if (!res.ok) {
    if (keyBox) keyBox.textContent = "HẾT KEY";
    if (copyBtn) copyBtn.disabled = true;
    if (statusBox) statusBox.textContent = res.message;
    return;
  }

  currentAssignedKey = res.key;
  if (keyBox) keyBox.textContent = res.key;
  if (copyBtn) copyBtn.disabled = false;
  if (statusBox) {
    statusBox.textContent = `Dùng lệnh /nhapkey ${res.key} trong bot Telegram để nhận coin.`;
  }
});