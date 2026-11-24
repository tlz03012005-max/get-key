const TASKS = [
  { id: "task_1", name: "2KTraffic 1", badge: "2KTraffic", tagClass: "tag-2k", url: "https://2ktraffic.com/vuot-link/94gz7wh" },
  { id: "task_2", name: "2KTraffic 2", badge: "2KTraffic", tagClass: "tag-2k", url: "https://2ktraffic.com/vuot-link/nmrcbtn" },
  { id: "task_3", name: "2KTraffic 3", badge: "2KTraffic", tagClass: "tag-2k", url: "https://2ktraffic.com/vuot-link/5e9ipwh" },
  { id: "task_4", name: "Link4M 1", badge: "Link4M", tagClass: "tag-l4m", url: "https://link4m.net/rXfyq6E" },
  { id: "task_5", name: "Link4M 2", badge: "Link4M", tagClass: "tag-l4m", url: "https://link4m.org/rXfyq6E" },
  { id: "task_6", name: "Phienchoso", badge: "Phienchoso", tagClass: "tag-pcs", url: "https://phienchoso.com/6bb534b34a9fa7a9aa8e.rv" }
];

const STORAGE_KEY = "tlz_done_tasks";

function getDoneTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveDoneTasks(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {}
}

function startTask(taskId, url) {
  const doneList = getDoneTasks();
  if (doneList.includes(taskId)) return;

  doneList.push(taskId);
  saveDoneTasks(doneList);
  renderTasks();
  window.location.href = url;
}

function resetTasks() {
  saveDoneTasks([]);
  renderTasks();
}

function renderTasks() {
  const doneList = getDoneTasks();
  const total = TASKS.length;
  const doneCount = TASKS.filter((t) => doneList.includes(t.id)).length;
  const percent = Math.round((doneCount / total) * 100);

  const progressText = document.getElementById("progressText");
  const percentText = document.getElementById("percentText");
  const progressFill = document.getElementById("progressFill");
  const taskListEl = document.getElementById("taskList");

  if (progressText) progressText.textContent = `Đã làm: ${doneCount}/${total} link`;
  if (percentText) percentText.textContent = `${percent}%`;
  if (progressFill) progressFill.style.width = `${percent}%`;

  if (!taskListEl) return;
  taskListEl.innerHTML = "";

  TASKS.forEach((task) => {
    const isDone = doneList.includes(task.id);

    const row = document.createElement("div");
    row.className = `task-item${isDone ? " is-done" : ""}`;

    const info = document.createElement("div");
    info.className = "task-info";

    const title = document.createElement("div");
    title.className = "task-title";
    title.textContent = task.name;

    const meta = document.createElement("div");
    meta.className = "task-meta";

    const tag = document.createElement("span");
    tag.className = `tag ${task.tagClass}`;
    tag.textContent = task.badge;

    const stateLabel = document.createElement("span");
    stateLabel.textContent = isDone ? "Đã sử dụng lượt" : "Khả dụng (1 lần)";

    meta.appendChild(tag);
    meta.appendChild(stateLabel);
    info.appendChild(title);
    info.appendChild(meta);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-go";
    btn.disabled = isDone;
    btn.textContent = isDone ? "Đã làm" : "Vượt ngay";
    if (!isDone) {
      btn.onclick = () => startTask(task.id, task.url);
    }

    row.appendChild(info);
    row.appendChild(btn);
    taskListEl.appendChild(row);
  });
}

document.addEventListener("DOMContentLoaded", renderTasks);