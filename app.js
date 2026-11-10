(() => {
  "use strict";

  const STORAGE_KEY = "qinglist.state.v1";
  const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];
  const LIST_COLOR_OPTIONS = {
    blue: { color: "#4b69ef", bg: "#eef2ff", label: "蓝" },
    orange: { color: "#d98932", bg: "#fff4e7", label: "橙" },
    green: { color: "#139b75", bg: "#e9f9f3", label: "绿" },
    purple: { color: "#8059e8", bg: "#f2edff", label: "紫" },
    cyan: { color: "#2f7ecb", bg: "#eaf4ff", label: "青" },
    pink: { color: "#d65f91", bg: "#fff0f6", label: "粉" },
  };
  const LIST_COLOR_KEYS = Object.keys(LIST_COLOR_OPTIONS);
  const HABIT_COLOR_KEYS = ["blue", "orange", "green", "purple", "cyan"];
  const GOAL_COLOR_KEYS = ["blue", "orange", "green", "purple", "cyan"];
  const DEFAULT_LISTS = [
    { id: "list_work", name: "工作", color: "blue" },
    { id: "list_life", name: "生活", color: "orange" },
    { id: "list_growth", name: "成长", color: "purple" },
    { id: "list_health", name: "健康", color: "green" },
    { id: "list_goal", name: "目标", color: "cyan" },
  ];
  const FONT_SCALE_DEFAULT = 1.12;
  const FONT_SCALE_OPTIONS = [
    { value: 1.06, label: "小紧凑", hint: "更小" },
    { value: 1.12, label: "标准", hint: "默认" },
    { value: 1.18, label: "特大", hint: "更大" },
  ];
  const DEFAULT_SETTINGS = {
    fontScale: FONT_SCALE_DEFAULT,
    fontScaleRev: 2,
    themeMode: "system",
    darkMode: false,
    subtasksEnabled: false,
  };
  const GOAL_COLORS = [
    ["#6e88ff", "#4563ec", "rgba(69, 99, 236, 0.24)"],
    ["#ffb072", "#f07c51", "rgba(240, 124, 81, 0.23)"],
    ["#65c7a2", "#20a47c", "rgba(32, 164, 124, 0.2)"],
    ["#a68cff", "#7357f0", "rgba(115, 87, 240, 0.22)"],
    ["#61b8f0", "#2b8fd4", "rgba(43, 143, 212, 0.2)"],
  ];
  const UNIT_CONFIG = {
    day: { unitLabel: "天", presets: [7, 14, 21, 30], min: 1, max: 365 },
    week: { unitLabel: "周", presets: [2, 4, 8, 12], min: 1, max: 52 },
    month: { unitLabel: "个月", presets: [1, 3, 6, 12], min: 1, max: 24 },
  };

  const ICONS = {
    close:
      '<svg viewBox="0 0 24 24" fill="none"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    plus:
      '<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    check:
      '<svg viewBox="0 0 24 24" fill="none"><path d="M6.4 12.5l3.5 3.5 7.7-8.3" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    dots:
      '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.55"/><circle cx="12" cy="12" r="1.55"/><circle cx="19" cy="12" r="1.55"/></svg>',
    calendar:
      '<svg viewBox="0 0 24 24" fill="none"><path d="M7 3.5v3M17 3.5v3M4.5 9.5h15M6 5.5h12a1.5 1.5 0 011.5 1.5v12A1.5 1.5 0 0118 20.5H6A1.5 1.5 0 014.5 19V7A1.5 1.5 0 016 5.5z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M8 13h3v3H8z" fill="currentColor"/></svg>',
    calendarNext:
      '<svg viewBox="0 0 24 24" fill="none"><path d="M7 3.5v3M17 3.5v3M4.5 9.5h15M6 5.5h12a1.5 1.5 0 011.5 1.5v12A1.5 1.5 0 0118 20.5H6A1.5 1.5 0 014.5 19V7A1.5 1.5 0 016 5.5z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M9 15.2h5.5M12.5 13l2.5 2.2-2.5 2.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    clock:
      '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.7"/><path d="M12 7.8V12l2.8 1.7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    note:
      '<svg viewBox="0 0 24 24" fill="none"><path d="M6 4.5h9.5L19 8v11.5H6V4.5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M15 4.8V8h3.2M8.8 12h6.5M8.8 15.2h4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
    trash:
      '<svg viewBox="0 0 24 24" fill="none"><path d="M5 7h14M9 7V4.5h6V7M7.3 7l.8 12.2h7.8L16.7 7M10 10.5v5M14 10.5v5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevron:
      '<svg viewBox="0 0 24 24" fill="none"><path d="M9.5 6.5L15 12l-5.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevronDown:
      '<svg viewBox="0 0 24 24" fill="none"><path d="M6.5 9.5L12 15l5.5-5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    arrowLeft:
      '<svg viewBox="0 0 24 24" fill="none"><path d="M14.5 6.5L9 12l5.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    arrowRight:
      '<svg viewBox="0 0 24 24" fill="none"><path d="M9.5 6.5L15 12l-5.5 5.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    sparkle:
      '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3.6l1.7 4.8 4.8 1.7-4.8 1.7-1.7 4.8-1.7-4.8-4.8-1.7 4.8-1.7L12 3.6z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M18.4 15.2l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2z" fill="currentColor"/></svg>',
    sun:
      '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.7"/><path d="M12 2.8v2.1M12 19.1v2.1M2.8 12h2.1M19.1 12h2.1M5.5 5.5l1.5 1.5M17 17l1.5 1.5M18.5 5.5L17 7M7 17l-1.5 1.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    target:
      '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="7.5" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="3.3" stroke="currentColor" stroke-width="1.7"/><path d="M12 2.5v3M21.5 12h-3M12 21.5v-3M2.5 12h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    flag:
      '<svg viewBox="0 0 24 24" fill="none"><path d="M6 21V4M6 5h11.2l-2.3 4 2.3 4H6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    layers:
      '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3.5L21 8l-9 4.5L3 8l9-4.5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M4.5 12L12 15.8l7.5-3.8M4.5 16l7.5 3.8 7.5-3.8" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    info:
      '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.6"/><path d="M12 11v5M12 7.8v.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    link:
      '<svg viewBox="0 0 24 24" fill="none"><path d="M9.5 14.5l5-5M8 16.5l-1.2 1.2a3.6 3.6 0 01-5-5l3.4-3.4a3.6 3.6 0 015 0M16 7.5l1.2-1.2a3.6 3.6 0 015 5l-3.4 3.4a3.6 3.6 0 01-5 0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    pen:
      '<svg viewBox="0 0 24 24" fill="none"><path d="M4.5 19.5l.9-4 10.9-10.9 3.1 3.1L8.5 18.6l-4 .9zM14.4 6.5l3.1 3.1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chart:
      '<svg viewBox="0 0 24 24" fill="none"><path d="M4.5 19.5h15M6.5 19V13h3v6M10.5 19V9h3v10M14.5 19V5.5h3V19" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    download:
      '<svg viewBox="0 0 24 24" fill="none"><path d="M12 4v10M8.2 10.4L12 14.2l3.8-3.8M5 16.5V18a2 2 0 002 2h10a2 2 0 002-2v-1.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    upload:
      '<svg viewBox="0 0 24 24" fill="none"><path d="M12 15V5M8.2 8.6L12 4.8l3.8 3.8M5 16.5V18a2 2 0 002 2h10a2 2 0 002-2v-1.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    list:
      '<svg viewBox="0 0 24 24" fill="none"><path d="M8 6.5h11M8 12h11M8 17.5h11" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="4.6" cy="6.5" r="1.1" fill="currentColor"/><circle cx="4.6" cy="12" r="1.1" fill="currentColor"/><circle cx="4.6" cy="17.5" r="1.1" fill="currentColor"/></svg>',
  };

  const GOAL_ICONS = {
    day: ICONS.sun,
    week: ICONS.calendar,
    month: ICONS.flag,
  };

  // ---------- Helpers ----------
  const pad2 = (value) => String(value).padStart(2, "0");

  function todayKey() {
    return keyOf(new Date());
  }

  function keyOf(date) {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
  }

  function parseKey(key) {
    const [year, month, day] = String(key).split("-").map(Number);
    return new Date(year, month - 1, day, 12, 0, 0, 0);
  }

  function addDaysDate(date, amount) {
    const next = new Date(date);
    next.setDate(next.getDate() + amount);
    return next;
  }

  function addDaysKey(key, amount) {
    return keyOf(addDaysDate(parseKey(key), amount));
  }

  function addMonthsKey(key, amount) {
    const date = parseKey(key);
    const day = date.getDate();
    const next = new Date(date.getFullYear(), date.getMonth() + amount, 1, 12);
    const last = new Date(next.getFullYear(), next.getMonth() + 1, 0, 12).getDate();
    next.setDate(Math.min(day, last));
    return keyOf(next);
  }

  function nextRepeatKey(key, type) {
    if (type === "weekly") return addDaysKey(key, 7);
    if (type === "monthly") return addMonthsKey(key, 1);
    return addDaysKey(key, 1);
  }

  function diffDays(startKey, endKey) {
    return Math.round((parseKey(endKey) - parseKey(startKey)) / 86400000);
  }

  function startOfWeekKey(key = todayKey()) {
    const date = parseKey(key);
    const offset = (date.getDay() + 6) % 7;
    return addDaysKey(key, -offset);
  }

  function percentOf(done, total) {
    return total ? Math.round((done / total) * 100) : 0;
  }

  function isNativeApp() {
    return Boolean(window.Capacitor?.isNativePlatform?.());
  }

  function nativePlugins() {
    return window.Capacitor?.Plugins || {};
  }

  function applyFontScale() {
    const value = Number(state.settings?.fontScale);
    const scale = FONT_SCALE_OPTIONS.some((option) => option.value === value)
      ? value
      : FONT_SCALE_DEFAULT;
    document.documentElement.style.setProperty(
      "--font-scale",
      String(scale * 1.055)
    );
  }

  function effectiveThemeIsDark() {
    const mode = state.settings?.themeMode || "system";
    if (mode === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return mode === "dark";
  }

  function applyTheme() {
    const dark = effectiveThemeIsDark();
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    const statusBar = nativePlugins().StatusBar;
    if (!statusBar) return;
    Promise.resolve(
      statusBar.setBackgroundColor({ color: dark ? "#11151d" : "#f4f6fb" })
    ).catch(() => {});
    Promise.resolve(
      statusBar.setStyle({ style: dark ? "DARK" : "LIGHT" })
    ).catch(() => {});
  }

  function setupThemeWatcher() {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener?.("change", () => {
      if ((state.settings?.themeMode || "system") === "system") {
        applyTheme();
      }
    });
  }

  function findScrollParent(element) {
    let parent = element.parentElement;
    while (parent && parent !== document.body) {
      const style = window.getComputedStyle(parent);
      const scrollable = /(auto|scroll)/.test(style.overflowY);
      if (scrollable && parent.scrollHeight > parent.clientHeight + 1) {
        return parent;
      }
      parent = parent.parentElement;
    }
    return null;
  }

  function ensureFocusedVisible(target) {
    if (!(target instanceof HTMLElement)) return;
    if (!target.matches("input, textarea, [contenteditable='true']")) return;
    const viewport = window.visualViewport;
    const viewportTop = viewport?.offsetTop || 0;
    const viewportBottom =
      viewportTop + (viewport?.height || window.innerHeight);
    const rect = target.getBoundingClientRect();
    const margin = 18;
    if (
      rect.top >= viewportTop + margin &&
      rect.bottom <= viewportBottom - margin
    ) {
      return;
    }
    const scroller = findScrollParent(target);
    if (!scroller) return;
    const delta =
      rect.bottom > viewportBottom - margin
        ? rect.bottom - (viewportBottom - margin)
        : rect.top - (viewportTop + margin);
    scroller.scrollBy({ top: delta, behavior: "smooth" });
  }

  function syncKeyboardViewport() {
    const viewport = window.visualViewport;
    const viewportHeight = viewport?.height || window.innerHeight;
    const viewportTop = viewport?.offsetTop || 0;
    const offset = Math.max(
      0,
      window.innerHeight - viewportHeight - viewportTop
    );
    document.documentElement.style.setProperty(
      "--keyboard-offset",
      `${Math.round(offset)}px`
    );
    document.body.classList.toggle("keyboard-open", offset > 60);
    if (offset > 0) {
      const active = document.activeElement;
      if (active instanceof HTMLElement && active.closest(".sheet")) {
        requestAnimationFrame(() => ensureFocusedVisible(active));
      }
    }
  }

  function setupKeyboardViewport() {
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", syncKeyboardViewport);
      window.visualViewport.addEventListener("scroll", syncKeyboardViewport);
    }
    window.addEventListener("resize", syncKeyboardViewport);
    document.addEventListener("focusin", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (!target.matches("input, textarea, [contenteditable='true']")) return;
      if (!target.closest(".sheet")) return;
      const reveal = () => {
        syncKeyboardViewport();
        if (document.activeElement === target) {
          ensureFocusedVisible(target);
        }
      };
      window.setTimeout(reveal, 260);
      window.setTimeout(reveal, 480);
    });
    document.addEventListener("focusout", () => {
      window.setTimeout(syncKeyboardViewport, 120);
    });
    syncKeyboardViewport();
  }

  function endOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 12);
  }

  function minDate(a, b) {
    return a <= b ? a : b;
  }

  function formatRange(startKey, endKey) {
    const start = parseKey(startKey);
    const end = parseKey(endKey);
    if (start.getFullYear() !== end.getFullYear()) {
      return `${start.getFullYear()}年${start.getMonth() + 1}月${start.getDate()}日 – ${end.getFullYear()}年${end.getMonth() + 1}月${end.getDate()}日`;
    }
    return `${start.getMonth() + 1}月${start.getDate()}日 – ${end.getMonth() + 1}月${end.getDate()}日`;
  }

  function formatShortDate(key) {
    const date = parseKey(key);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }

  function formatDayLabel(key) {
    const date = parseKey(key);
    return `周${WEEKDAYS[date.getDay()]}`;
  }

  function relativeDayLabel(key) {
    const delta = diffDays(todayKey(), key);
    if (delta === 0) return "今天";
    if (delta === 1) return "明天";
    if (delta === 2) return "后天";
    if (delta === -1) return "昨天";
    return `${parseKey(key).getMonth() + 1}月${parseKey(key).getDate()}日`;
  }

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      }[character];
    });
  }

  let idSeed = 0;
  function uid(prefix) {
    idSeed += 1;
    return `${prefix}_${Date.now().toString(36)}_${idSeed.toString(36)}`;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function dateInputValue(key) {
    return key || "";
  }

  function makeDefaultLists() {
    return DEFAULT_LISTS.map((list) => ({ ...list }));
  }

  function getList(listId) {
    const lists = state?.lists?.length ? state.lists : DEFAULT_LISTS;
    return (
      lists.find((list) => list.id === listId) ||
      lists.find((list) => list.name === "目标") ||
      lists[0]
    );
  }

  function listColorOption(colorId) {
    return LIST_COLOR_OPTIONS[colorId] || LIST_COLOR_OPTIONS.blue;
  }

  function randomHabitColor() {
    return HABIT_COLOR_KEYS[Math.floor(Math.random() * HABIT_COLOR_KEYS.length)];
  }

  function stableHabitColor(id) {
    const text = String(id || "");
    let hash = 0;
    for (let index = 0; index < text.length; index += 1) {
      hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
    }
    return HABIT_COLOR_KEYS[hash % HABIT_COLOR_KEYS.length];
  }

  function listTagHTML(listId, extraClass = "") {
    const list = getList(listId);
    const color = listColorOption(list.color);
    return `<span class="tag ${extraClass}" style="color:${color.color};background:${color.bg}">${esc(
      list.name
    )}</span>`;
  }

  function listChoiceStyle(list) {
    const color = listColorOption(list.color);
    return `style="--list-color:${color.color};--list-bg:${color.bg}"`;
  }

  function defaultGoalListId() {
    const lists = state?.lists?.length ? state.lists : DEFAULT_LISTS;
    return (lists.find((list) => list.name === "目标") || lists[lists.length - 1]).id;
  }

  function goalColorStyle(index) {
    const color = GOAL_COLORS[index % GOAL_COLORS.length];
    return `background:linear-gradient(145deg, ${color[0]} 0%, ${color[1]} 100%);box-shadow:0 7px 14px ${color[2]}, inset 0 1px 0 rgba(255,255,255,.25);`;
  }

  // ---------- Inline calendar ----------
  function monthKeyOf(date) {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`;
  }

  function parseMonthKey(key) {
    const [year, month] = String(key).split("-").map(Number);
    return new Date(year, month - 1, 1, 12);
  }

  function shiftMonthKey(key, amount) {
    const date = parseMonthKey(key);
    return monthKeyOf(
      new Date(date.getFullYear(), date.getMonth() + amount, 1, 12)
    );
  }

  function calendarDateLabel(key) {
    const date = parseKey(key);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 · 周${
      WEEKDAYS[date.getDay()]
    }`;
  }

  function calendarMarkup(selectedKey, viewMonthKey) {
    const view = parseMonthKey(viewMonthKey);
    const firstDay = new Date(view.getFullYear(), view.getMonth(), 1, 12);
    const offset = (firstDay.getDay() + 6) % 7;
    const gridStart = addDaysDate(firstDay, -offset);
    const today = todayKey();
    const weekdayLabels = ["一", "二", "三", "四", "五", "六", "日"];
    let cells = "";

    for (let index = 0; index < 42; index += 1) {
      const date = addDaysDate(gridStart, index);
      const key = keyOf(date);
      const selected = key === selectedKey;
      const isToday = key === today;
      const outside = date.getMonth() !== view.getMonth();
      cells += `<button class="cal-day ${outside ? "is-outside" : ""} ${
        selected ? "is-selected" : ""
      } ${isToday ? "is-today" : ""}" type="button" data-cal-date="${key}"
        aria-label="${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 周${
          WEEKDAYS[date.getDay()]
        }" aria-pressed="${selected}" ${isToday ? 'aria-current="date"' : ""}>
        <span>${date.getDate()}</span>
      </button>`;
    }

    return `<div class="cal-head">
      <button class="cal-nav" type="button" data-cal-prev aria-label="上个月">${ICONS.arrowLeft}</button>
      <strong>${view.getFullYear()}年${view.getMonth() + 1}月</strong>
      <button class="cal-nav" type="button" data-cal-next aria-label="下个月">${ICONS.arrowRight}</button>
    </div>
    <div class="cal-weekdays">${weekdayLabels
      .map((label) => `<span>${label}</span>`)
      .join("")}</div>
    <div class="cal-grid">${cells}</div>
    <div class="cal-footer">
      <span>已选 <b>${formatShortDate(selectedKey)}</b></span>
      <button class="cal-today-btn" type="button" data-cal-today>今天</button>
    </div>`;
  }

  function setupInlineCalendar(panel, initialKey, onSelect) {
    const state = {
      selected: initialKey,
      view: monthKeyOf(parseKey(initialKey)),
    };

    const render = () => {
      panel.innerHTML = calendarMarkup(state.selected, state.view);
    };
    render();

    let swipeStart = null;
    let swiped = false;
    panel.addEventListener("pointerdown", (event) => {
      swipeStart = { x: event.clientX, y: event.clientY };
      swiped = false;
    }, { passive: true });
    panel.addEventListener("pointermove", (event) => {
      if (!swipeStart) return;
      const dx = event.clientX - swipeStart.x;
      const dy = event.clientY - swipeStart.y;
      if (Math.abs(dx) < 44 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
      state.view = shiftMonthKey(state.view, dx < 0 ? 1 : -1);
      swipeStart = null;
      swiped = true;
      render();
    }, { passive: true });
    panel.addEventListener("pointerup", () => {
      swipeStart = null;
    }, { passive: true });
    panel.addEventListener("pointercancel", () => {
      swipeStart = null;
    }, { passive: true });

    panel.onclick = (event) => {
      if (swiped) {
        swiped = false;
        return;
      }
      if (event.target.closest("[data-cal-prev]")) {
        state.view = shiftMonthKey(state.view, -1);
        render();
        return;
      }
      if (event.target.closest("[data-cal-next]")) {
        state.view = shiftMonthKey(state.view, 1);
        render();
        return;
      }
      if (event.target.closest("[data-cal-today]")) {
        state.selected = todayKey();
        state.view = monthKeyOf(parseKey(state.selected));
        render();
        onSelect?.(state.selected);
        return;
      }
      const dayButton = event.target.closest("[data-cal-date]");
      if (!dayButton) return;
      state.selected = dayButton.dataset.calDate;
      state.view = monthKeyOf(parseKey(state.selected));
      render();
      onSelect?.(state.selected);
    };

    return {
      setSelected(key) {
        state.selected = key;
        state.view = monthKeyOf(parseKey(key));
        render();
      },
    };
  }

  function openCalendarPicker(initialKey, onSelect, trigger, title = "选择日期") {
    window.clearTimeout(calendarCloseTimer);
    calendarLayer.hidden = false;
    calendarLayer.classList.remove("is-closing");
    calendarLayer.classList.add("is-open");
    calendarOpenTrigger = trigger || null;
    calendarSelectionHandler = onSelect || null;
    if (calendarDialogTitle) calendarDialogTitle.textContent = title;
    calendarHost.innerHTML = "";

    setupInlineCalendar(calendarHost, initialKey, (key) => {
      const handler = calendarSelectionHandler;
      closeCalendarPicker();
      handler?.(key);
    });

    if (trigger) trigger.setAttribute("aria-expanded", "true");
  }

  function openHabitMonthlyPicker(initial, onApply, trigger = null) {
    window.clearTimeout(calendarCloseTimer);
    calendarLayer.hidden = false;
    calendarLayer.classList.remove("is-closing");
    calendarLayer.classList.add("is-open");
    calendarOpenTrigger = trigger;
    calendarSelectionHandler = onApply;
    if (trigger) trigger.setAttribute("aria-expanded", "true");
    if (calendarDialogTitle) calendarDialogTitle.textContent = "设置每月重复";
    let monthDays = Array.isArray(initial?.monthDays) ? [...initial.monthDays] : [];
    let mode = initial?.mode === "count" ? "count" : "days";
    let monthlyTarget = Math.max(1, Math.min(31, Number(initial?.monthlyTarget) || 8));
    let monthCursor = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
      12
    );
    const render = () => {
      const year = monthCursor.getFullYear();
      const month = monthCursor.getMonth();
      const first = new Date(year, month, 1, 12);
      const offset = (first.getDay() + 6) % 7;
      let day = addDaysDate(first, -offset);
      const cells = [];
      for (let index = 0; index < 42; index += 1) {
        const inMonth = day.getMonth() === month;
        const dateNumber = day.getDate();
        cells.push(
          inMonth
            ? `<button class="habit-month-day ${
                monthDays.includes(dateNumber) ? "is-selected" : ""
              }" type="button" data-monthly-day="${dateNumber}">${dateNumber}</button>`
            : `<span class="habit-month-day is-empty"></span>`
        );
        day = addDaysDate(day, 1);
      }
      const targetButtons = Array.from({ length: 31 }, (_, index) => {
        const value = index + 1;
        return `<button class="${value === monthlyTarget ? "is-selected" : ""}" type="button" data-monthly-target="${value}">${value}</button>`;
      }).join("");
      const calendarHtml =
        mode === "count"
          ? `<div class="monthly-count-only">已切换为按每月次数，选择每月需要完成的次数。</div>`
          : `<div class="monthly-picker-head">
              <button type="button" data-monthly-prev aria-label="上个月">‹</button>
              <strong>${year}年${month + 1}月</strong>
              <button type="button" data-monthly-next aria-label="下个月">›</button>
            </div>
            <div class="habit-month-weekdays"><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>日</span></div>
            <div class="habit-month-grid monthly-picker-grid">${cells.join("")}</div>`;
      calendarHost.innerHTML = `<div class="monthly-picker-popup">
        ${calendarHtml}
        <button class="habit-count-toggle ${mode === "count" ? "is-on" : ""}" type="button" id="monthlyCountToggle" aria-pressed="${mode === "count"}">
          <span class="habit-count-check">${mode === "count" ? ICONS.check : ""}</span>
          <span>按每月次数</span>
        </button>
        <div class="monthly-target-panel" ${mode === "count" ? "" : "hidden"}>
          <p class="time-picker-tip">每月完成次数</p>
          <div class="monthly-target-chips">${targetButtons}</div>
        </div>
        <button class="time-confirm" type="button" id="monthlyPickerDone">确定</button>
      </div>`;
      bind();
    };
    const bind = () => {
      calendarHost.querySelectorAll("[data-monthly-prev]").forEach((button) => {
        button.addEventListener("click", () => {
          monthCursor = new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1, 12);
          render();
        });
      });
      calendarHost.querySelectorAll("[data-monthly-next]").forEach((button) => {
        button.addEventListener("click", () => {
          monthCursor = new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1, 12);
          render();
        });
      });
      calendarHost.querySelectorAll("[data-monthly-day]").forEach((button) => {
        button.addEventListener("click", () => {
          const value = Number(button.dataset.monthlyDay);
          if (monthDays.includes(value)) {
            if (monthDays.length === 1) return;
            monthDays = monthDays.filter((day) => day !== value);
          } else {
            monthDays = [...monthDays, value];
          }
          render();
        });
      });
      calendarHost.querySelector("#monthlyCountToggle")?.addEventListener("click", () => {
        mode = mode === "count" ? "days" : "count";
        render();
      });
      calendarHost.querySelectorAll("[data-monthly-target]").forEach((button) => {
        button.addEventListener("click", () => {
          monthlyTarget = Number(button.dataset.monthlyTarget);
          render();
        });
      });
      calendarHost.querySelector("#monthlyPickerDone")?.addEventListener("click", () => {
        const handler = calendarSelectionHandler;
        closeCalendarPicker();
        handler?.({
          monthDays: [...monthDays],
          mode,
          monthlyTarget,
        });
      });
    };
    render();
  }

  function closeCalendarPicker() {
    if (calendarLayer.hidden || calendarLayer.classList.contains("is-closing")) {
      return;
    }
    calendarLayer.classList.remove("is-open");
    calendarLayer.classList.add("is-closing");
    if (calendarOpenTrigger) {
      calendarOpenTrigger.setAttribute("aria-expanded", "false");
      calendarOpenTrigger = null;
    }
    calendarSelectionHandler = null;
    window.clearTimeout(calendarCloseTimer);
    calendarCloseTimer = window.setTimeout(() => {
      calendarLayer.hidden = true;
      calendarLayer.classList.remove("is-closing");
      calendarHost.innerHTML = "";
    }, 240);
  }

  // ---------- Persisted state ----------
  function seedState() {
    const today = todayKey();
    const tomorrow = addDaysKey(today, 1);
    const afterTomorrow = addDaysKey(today, 2);
    const yesterday = addDaysKey(today, -1);
    const now = Date.now();

    const tasks = [
      {
        id: "seed_task_1",
        title: "完成产品需求文档初稿",
        note: "补齐核心流程和验收标准",
        date: today,
        listId: "list_work",
        done: false,
        createdAt: now - 8000,
      },
      {
        id: "seed_task_2",
        title: "力量训练 45 分钟",
        note: "肩背 + 核心",
        date: today,
        listId: "list_health",
        done: false,
        createdAt: now - 7000,
      },
      {
        id: "seed_task_3",
        title: "给妈妈打个电话",
        note: "",
        date: today,
        listId: "list_life",
        done: false,
        createdAt: now - 6000,
      },
      {
        id: "seed_task_4",
        title: "晨间冥想 10 分钟",
        note: "",
        date: today,
        listId: "list_health",
        done: true,
        completedAt: now - 3600000,
        createdAt: now - 9000,
      },
      {
        id: "seed_task_5",
        title: "整理本周复盘笔记",
        note: "记录本周的三个关键决定",
        date: tomorrow,
        listId: "list_growth",
        done: false,
        createdAt: now - 5000,
      },
      {
        id: "seed_task_6",
        title: "预约下个月的牙医",
        note: "",
        date: tomorrow,
        listId: "list_life",
        done: false,
        createdAt: now - 4000,
      },
      {
        id: "seed_task_7",
        title: "准备周会分享材料",
        note: "",
        date: afterTomorrow,
        listId: "list_work",
        done: false,
        createdAt: now - 3000,
      },
      {
        id: "seed_task_8",
        title: "同步项目周报",
        note: "",
        date: yesterday,
        listId: "list_work",
        done: true,
        completedAt: now - 86400000,
        createdAt: now - 10000,
      },
    ];

    return {
      tasks: tasks.map((task) => ({ ...task, isSample: true })),
      goals: [],
      habits: [],
      habitSkips: [],
      lists: makeDefaultLists(),
      settings: { ...DEFAULT_SETTINGS },
      trash: [],
    };
  }

  function normalizeSettings(input) {
    const settings = { ...DEFAULT_SETTINGS };
    const rawScale = Number(input?.fontScale);
    if (input?.fontScaleRev !== 2) {
      const oldIndex = [1, 1.06, 1.12].indexOf(rawScale);
      settings.fontScale =
        oldIndex >= 0 ? [1.06, 1.12, 1.18][oldIndex] : FONT_SCALE_DEFAULT;
      settings.fontScaleRev = 2;
    } else {
      settings.fontScale = FONT_SCALE_OPTIONS.some(
        (option) => option.value === rawScale
      )
        ? rawScale
        : FONT_SCALE_DEFAULT;
      settings.fontScaleRev = 2;
    }
    settings.themeMode = ["system", "light", "dark"].includes(input?.themeMode)
      ? input.themeMode
      : input?.darkMode === true
        ? "dark"
        : "system";
    settings.darkMode = settings.themeMode === "dark";
    settings.subtasksEnabled = input?.subtasksEnabled === true;
    return settings;
  }

  function normalizeLists(input) {
    const source = Array.isArray(input) ? input : [];
    const lists = [];
    const seenIds = new Set();

    source.forEach((item, index) => {
      if (!item || typeof item.name !== "string" || !item.name.trim()) return;
      let id = typeof item.id === "string" && item.id ? item.id : uid("list");
      if (seenIds.has(id)) id = uid("list");
      seenIds.add(id);
      lists.push({
        id,
        name: item.name.trim().slice(0, 16),
        color: LIST_COLOR_OPTIONS[item.color] ? item.color : LIST_COLOR_KEYS[index % LIST_COLOR_KEYS.length],
      });
    });

    return lists.length ? lists : makeDefaultLists();
  }

  function normalizeStateData(raw) {
    const lists = normalizeLists(raw?.lists);
    const validListIds = new Set(lists.map((list) => list.id));
    const listByName = new Map(lists.map((list) => [list.name, list.id]));
    const fallbackListId = lists[0].id;
    const fallbackGoalListId =
      listByName.get("目标") ||
      (lists[lists.length - 1] ? lists[lists.length - 1].id : fallbackListId);

    const tasks = (Array.isArray(raw?.tasks) ? raw.tasks : [])
      .filter((task) => task && typeof task.title === "string" && task.date)
      .map((task) => {
        const { time, tag, ...rest } = task;
        const subtasks = (Array.isArray(task.subtasks) ? task.subtasks : [])
          .filter((item) => item && typeof item.title === "string")
          .map((item) => ({
            id: typeof item.id === "string" && item.id ? item.id : uid("subtask"),
            title: item.title.trim().slice(0, 80),
            done: item.done === true,
          }))
          .filter((item) => item.title);
        return {
          ...rest,
          repeat:
            task.repeat && ["daily", "weekly", "monthly"].includes(task.repeat.type)
              ? {
                  type: task.repeat.type,
                  endDate: /^\d{4}-\d{2}-\d{2}$/.test(task.repeat.endDate || "")
                    ? task.repeat.endDate
                    : "",
                  seriesId:
                    typeof task.repeat.seriesId === "string"
                      ? task.repeat.seriesId
                      : uid("series"),
                }
              : null,
          subtasks,
          order:
            typeof task.order === "number" && Number.isFinite(task.order)
              ? task.order
              : null,
          listId: validListIds.has(task.listId)
            ? task.listId
            : listByName.get(tag) || fallbackListId,
        };
      })
      .filter(
        (() => {
          const seenTaskIds = new Set();
          const seenHabitDates = new Set();
          const seenSeriesDates = new Set();
          const seenTitleDates = new Set();
          return (task) => {
            if (task.id && seenTaskIds.has(task.id)) return false;
            if (task.id) seenTaskIds.add(task.id);
            if (task.habitId) {
              const key = `${task.habitId}:${task.date}`;
              if (seenHabitDates.has(key)) return false;
              seenHabitDates.add(key);
            }
            if (task.repeat?.seriesId) {
              const key = `${task.repeat.seriesId}:${task.date}`;
              if (seenSeriesDates.has(key)) return false;
              seenSeriesDates.add(key);
            }
            if (!task.goalId && !task.habitId && !task.repeat) {
              const key = `${task.title.trim()}:${task.date}:${task.listId}`;
              if (seenTitleDates.has(key)) return false;
              seenTitleDates.add(key);
            }
            return true;
          };
        })()
      );

    const goals = (Array.isArray(raw?.goals) ? raw.goals : [])
      .filter((goal) => goal && typeof goal.title === "string")
      .map((goal) => ({
        ...goal,
        paused: goal.paused === true,
        listId: validListIds.has(goal.listId)
          ? goal.listId
          : fallbackGoalListId,
      }));

    const habits = (Array.isArray(raw?.habits) ? raw.habits : [])
      .filter((habit) => habit && typeof habit.title === "string")
      .map((habit) => ({
        ...habit,
        color: HABIT_COLOR_KEYS.includes(habit.color)
          ? habit.color
          : stableHabitColor(habit.id),
        repeat: {
          type: ["daily", "weekly", "monthly"].includes(habit.repeat?.type)
            ? habit.repeat.type
            : "daily",
          weekdays: Array.isArray(habit.repeat?.weekdays)
            ? habit.repeat.weekdays.filter((day) => Number.isInteger(day) && day >= 0 && day <= 6)
            : [],
          monthDays: Array.isArray(habit.repeat?.monthDays)
            ? habit.repeat.monthDays.filter((day) => Number.isInteger(day) && day >= 1 && day <= 31)
            : [],
          mode: habit.repeat?.mode === "count" ? "count" : "days",
          weeklyTarget: Math.max(1, Math.min(7, Number(habit.repeat?.weeklyTarget) || 3)),
          monthlyTarget: Math.max(1, Math.min(31, Number(habit.repeat?.monthlyTarget) || 8)),
          endDate: /^\d{4}-\d{2}-\d{2}$/.test(habit.repeat?.endDate || "")
            ? habit.repeat.endDate
            : "",
        },
        listId: validListIds.has(habit.listId)
          ? habit.listId
          : fallbackListId,
      }));
    const habitSkips = (Array.isArray(raw?.habitSkips) ? raw.habitSkips : [])
      .filter((key) => typeof key === "string")
      .slice(-500);

    const trash = (Array.isArray(raw?.trash) ? raw.trash : [])
      .filter((entry) => entry && typeof entry.type === "string" && entry.item)
      .slice(0, 100);

    return {
      tasks,
      goals,
      habits,
      habitSkips,
      lists,
      settings: normalizeSettings(raw?.settings),
      trash,
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.tasks) && Array.isArray(parsed.goals)) {
          const normalized = normalizeStateData(parsed);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
          return normalized;
        }
      }
    } catch (error) {
      console.warn("读取本地数据失败，将使用初始数据。", error);
    }
    return seedState();
  }

  function consumeResetRequest() {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("reset") !== "1") return;
      localStorage.removeItem(STORAGE_KEY);
      params.delete("reset");
      const query = params.toString();
      const cleanUrl = `${window.location.pathname}${query ? `?${query}` : ""}`;
      window.history.replaceState(null, "", cleanUrl);
    } catch (error) {
      console.warn("重置数据失败。", error);
    }
  }

  consumeResetRequest();
  const state = loadState();

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn("保存本地数据失败。", error);
    }
  }

  function habitSkipKey(habitId, dateKey) {
    return `${habitId}:${dateKey}`;
  }

  function habitRepeat(habit) {
    return habit?.repeat || { type: "daily" };
  }

  function habitMatchesDate(habit, dateKey) {
    const repeat = habitRepeat(habit);
    if (repeat.endDate && dateKey > repeat.endDate) return false;
    if (repeat.type === "weekly") {
      if (repeat.mode === "count") return true;
      const day = parseKey(dateKey).getDay();
      return (repeat.weekdays || [day]).includes(day);
    }
    if (repeat.type === "monthly") {
      if (repeat.mode === "count") return true;
      const day = parseKey(dateKey).getDate();
      return (repeat.monthDays || [day]).includes(day);
    }
    return true;
  }

  function habitPeriodDone(habitId, dateKey = todayKey(), type = "weekly") {
    let start;
    let end;
    if (type === "monthly") {
      const date = parseKey(dateKey);
      start = keyOf(new Date(date.getFullYear(), date.getMonth(), 1, 12));
      end = keyOf(new Date(date.getFullYear(), date.getMonth() + 1, 0, 12));
    } else {
      start = startOfWeekKey(dateKey);
      end = addDaysKey(start, 6);
    }
    return state.tasks.filter(
      (task) =>
        task.habitId === habitId &&
        task.done &&
        task.date >= start &&
        task.date <= end
    ).length;
  }

  function habitWeeklyDone(habitId, dateKey = todayKey()) {
    return habitPeriodDone(habitId, dateKey, "weekly");
  }

  function habitTarget(habit) {
    const repeat = habitRepeat(habit);
    return repeat.type === "monthly"
      ? Math.max(1, Number(repeat.monthlyTarget) || 8)
      : Math.max(1, Number(repeat.weeklyTarget) || 3);
  }

  function pruneHabitPeriodTasks(habit) {
    if (!habit) return false;
    const repeat = habitRepeat(habit);
    if (repeat.mode !== "count" || !["weekly", "monthly"].includes(repeat.type)) {
      return false;
    }
    const today = todayKey();
    if (habitPeriodDone(habit.id, today, repeat.type) < habitTarget(habit)) {
      return false;
    }
    let start;
    let end;
    if (repeat.type === "monthly") {
      const date = parseKey(today);
      start = keyOf(new Date(date.getFullYear(), date.getMonth(), 1, 12));
      end = keyOf(new Date(date.getFullYear(), date.getMonth() + 1, 0, 12));
    } else {
      start = startOfWeekKey(today);
      end = addDaysKey(start, 6);
    }
    const removed = state.tasks.filter(
      (task) =>
        task.habitId === habit.id &&
        !task.done &&
        task.date > today &&
        task.date >= start &&
        task.date <= end
    );
    if (!removed.length) return false;
    state.tasks = state.tasks.filter((task) => !removed.includes(task));
    saveState();
    return true;
  }

  function habitRepeatLabel(habit) {
    const repeat = habitRepeat(habit);
    if (repeat.type === "weekly") {
      if (repeat.mode === "count") return `每周 ${habitTarget(habit)} 次`;
      const names = ["日", "一", "二", "三", "四", "五", "六"];
      const days = [...(repeat.weekdays || [])]
        .sort((a, b) => a - b)
        .map((day) => `周${names[day]}`)
        .join("、");
      return days ? `每${days}` : "每周";
    }
    if (repeat.type === "monthly") {
      if (repeat.mode === "count") return `每月 ${habitTarget(habit)} 次`;
      const days = [...(repeat.monthDays || [])]
        .sort((a, b) => a - b)
        .map((day) => `${day}日`)
        .join("、");
      return days ? `每月 ${days}` : "每月";
    }
    return "每天";
  }

  function ensureHabitTasks(dateKey) {
    if (!state.habits?.length || !dateKey || dateKey < todayKey()) {
      return false;
    }
    const skipped = new Set(state.habitSkips || []);
    let changed = false;
    state.habits.forEach((habit, index) => {
      if (!habitMatchesDate(habit, dateKey)) return;
      if (skipped.has(habitSkipKey(habit.id, dateKey))) return;
      const repeat = habitRepeat(habit);
      if (
        repeat.mode === "count" &&
        ["weekly", "monthly"].includes(repeat.type) &&
        habitPeriodDone(habit.id, dateKey, repeat.type) >= habitTarget(habit)
      ) {
        return;
      }
      const exists = state.tasks.some(
        (task) => task.habitId === habit.id && task.date === dateKey
      );
      if (exists) return;
      state.tasks.push({
        id: uid("habit_task"),
        title: habit.title,
        note: "",
        date: dateKey,
        listId: habit.listId,
        done: false,
        createdAt: Date.now() + index,
        habitId: habit.id,
      });
      changed = true;
    });
    if (changed) saveState();
    return changed;
  }

  function habitTaskFor(habitId, dateKey = todayKey()) {
    return state.tasks.find(
      (task) => task.habitId === habitId && task.date === dateKey
    );
  }

  function habitStreak(habitId) {
    let streak = 0;
    let cursor = todayKey();
    const todayTask = habitTaskFor(habitId, cursor);
    if (!todayTask?.done) cursor = addDaysKey(cursor, -1);
    for (let index = 0; index < 365; index += 1) {
      const task = habitTaskFor(habitId, cursor);
      if (!task?.done) break;
      streak += 1;
      cursor = addDaysKey(cursor, -1);
    }
    return streak;
  }

  function isSampleTask(task) {
    return Boolean(
      task &&
        (task.isSample === true || /^seed_task_\d+$/.test(task.id || ""))
    );
  }

  function overdueTasks() {
    const today = todayKey();
    if (ui.selectedDate < today) return [];
    return state.tasks
      .filter((task) => !task.done && task.date < today)
      .sort(
        (a, b) =>
          a.date.localeCompare(b.date) ||
          (a.createdAt || 0) - (b.createdAt || 0)
      );
  }

  function renderOverdueTasks() {
    if (!overdueList) return;
    const tasks = overdueTasks();
    if (!tasks.length) {
      overdueList.hidden = true;
      overdueList.innerHTML = "";
      return;
    }
    overdueList.hidden = false;
    overdueList.innerHTML = `<div class="overdue-head">
      <div><span class="overdue-kicker">OVERDUE</span><strong>逾期 ${tasks.length} 项</strong></div>
      <button type="button" data-overdue-all>全部移到今天</button>
    </div>
    <div class="overdue-items">
      ${tasks
        .map((task) => {
          const list = getList(task.listId);
          return `<div class="overdue-item" data-overdue-id="${task.id}">
            <div class="overdue-copy">
              <strong>${esc(task.title)}</strong>
              <small>${formatShortDate(task.date)} · ${esc(list.name)}</small>
            </div>
            <button type="button" data-overdue-move="${task.id}">移到今天</button>
          </div>`;
        })
        .join("")}
    </div>`;
  }

  function moveOverdueTask(taskId) {
    const task = state.tasks.find((item) => item.id === taskId);
    if (!task) return;
    task.date = todayKey();
    saveState();
    ui.expandedTaskId = null;
    refreshTasksView({ animate: false });
    showToast("已移到今天");
  }

  function moveAllOverdueTasks() {
    const tasks = overdueTasks();
    if (!tasks.length) return;
    const today = todayKey();
    tasks.forEach((task) => {
      task.date = today;
    });
    saveState();
    ui.expandedTaskId = null;
    refreshTasksView({ animate: false });
    showToast(`已移动 ${tasks.length} 项到今天我`);
  }

  // ---------- UI state ----------
  const initialTab = ["tasks", "create", "profile"].includes(
    window.location.hash.replace("#", "")
  )
    ? window.location.hash.replace("#", "")
    : "tasks";

  const ui = {
    activeTab: initialTab,
    selectedDate: todayKey(),
    completedOpen: false,
    expandedTaskId: null,
    activeListId: null,
    listSelected: new Set(),
    searchSelected: new Set(),
    listQuery: "",
    rangeStart: addDaysKey(todayKey(), -45),
    rangeEnd: addDaysKey(todayKey(), 45),
    monthExpanded: false,
    monthCursor: todayKey(),
  };

  let goalDraft = null;
  let editingGoalId = null;
  let toastTimer = 0;
  let sheetClosingTimer = 0;
  let sheetOpenedAt = 0;
  let taskMorphState = null;
  let calendarOpenTrigger = null;
  let calendarSelectionHandler = null;
  let calendarCloseTimer = 0;
  let suppressTaskClickUntil = 0;
  let suppressTabClickUntil = 0;
  let taskDragState = null;

  // ---------- DOM ----------
  const screen = document.querySelector("#screen");
  const tabbar = document.querySelector(".tabbar");
  const overlay = document.querySelector("#overlay");
  const sheet = document.querySelector("#sheet");
  const dateStrip = document.querySelector("#dateStrip");
  const dateStripShell = document.querySelector(".date-strip-shell");
  const monthView = document.querySelector("#monthView");
  const monthGrid = document.querySelector("#monthGrid");
  const monthViewLabel = document.querySelector("#monthViewLabel");
  const monthPullHandle = document.querySelector("#monthPullHandle");
  const taskContent = document.querySelector("#taskContent");
  const taskList = document.querySelector("#taskList");
  const overdueList = document.querySelector("#overdueList");
  const toast = document.querySelector("#toast");
  const goalList = document.querySelector("#goalList");
  const habitList = document.querySelector("#habitList");
  const globalSearchInput = document.querySelector("#globalSearchInput");
  const globalSearchResults = document.querySelector("#globalSearchResults");
  const clearGlobalSearch = document.querySelector("#clearGlobalSearch");
  const habitsPage = document.querySelector("#page-habits");
  const listsPage = document.querySelector("#page-lists");
  const listDetailPage = document.querySelector("#page-list-detail");
  const goalPage = document.querySelector("#page-goal");
  const statsPage = document.querySelector("#page-stats");
  const statsDetailPage = document.querySelector("#page-stats-detail");
  const dataPage = document.querySelector("#page-data");
  const archivePage = document.querySelector("#page-archive");
  const trashPage = document.querySelector("#page-trash");
  const settingsPage = document.querySelector("#page-settings");
  const guidePage = document.querySelector("#page-guide");
  const listManagerContent = document.querySelector("#listManagerContent");
  const listSearchInput = document.querySelector("#listSearchInput");
  const clearListSearch = document.querySelector("#clearListSearch");
  const listDetailTitle = document.querySelector("#listDetailTitle");
  const listDetailIntro = document.querySelector("#listDetailIntro");
  const listDetailContent = document.querySelector("#listDetailContent");
  const listSelectAll = document.querySelector("#listSelectAll");
  const listDeleteSelected = document.querySelector("#listDeleteSelected");
  const calendarLayer = document.querySelector("#calendarLayer");
  const calendarHost = document.querySelector("#calendarHost");
  const calendarDialogTitle = document.querySelector("#calendarDialogTitle");

  // ---------- Date strip ----------
  function renderDateStrip() {
    const dates = [];
    let cursor = parseKey(ui.rangeStart);
    const end = parseKey(ui.rangeEnd);
    while (cursor <= end) {
      dates.push(keyOf(cursor));
      cursor = addDaysDate(cursor, 1);
    }

    const today = todayKey();
    dateStrip.innerHTML = dates
      .map((key) => {
        const date = parseKey(key);
        const selected = key === ui.selectedDate;
        const hasTasks = state.tasks.some((task) => task.date === key);
        return `<button class="date-chip ${selected ? "is-selected" : ""} ${
          key === today ? "is-today" : ""
        } ${hasTasks ? "has-tasks" : ""}" type="button" role="option" data-date="${key}"
          aria-label="${date.getMonth() + 1}月${date.getDate()}日 周${WEEKDAYS[date.getDay()]}"
          aria-selected="${selected}" tabindex="${selected ? "0" : "-1"}">
          <span class="chip-week">${WEEKDAYS[date.getDay()]}</span>
          <span class="chip-day">${date.getDate()}</span>
          <span class="date-dot" aria-hidden="true"></span>
        </button>`;
      })
      .join("");

    requestAnimationFrame(() => {
      scrollSelectedDate(false);
    });
  }

  function updateDateStripSelection() {
    const today = todayKey();
    dateStrip.querySelectorAll(".date-chip").forEach((chip) => {
      const selected = chip.dataset.date === ui.selectedDate;
      chip.classList.toggle("is-selected", selected);
      chip.classList.toggle("is-today", chip.dataset.date === today);
      chip.setAttribute("aria-selected", String(selected));
      chip.tabIndex = selected ? 0 : -1;
    });
  }

  function updateDateStripDots() {
    dateStrip.querySelectorAll(".date-chip").forEach((chip) => {
      chip.classList.toggle(
        "has-tasks",
        state.tasks.some((task) => task.date === chip.dataset.date)
      );
    });
  }

  function renderMonthView() {
    if (!monthView || !monthGrid) return;
    const cursor = parseKey(ui.monthCursor || ui.selectedDate);
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1, 12);
    const offset = (first.getDay() + 6) % 7;
    let day = addDaysDate(first, -offset);
    const today = todayKey();
    const cells = [];
    for (let index = 0; index < 42; index += 1) {
      const key = keyOf(day);
      const dateTasks = state.tasks.filter((task) => task.date === key);
      const open = dateTasks.filter((task) => !task.done).length;
      const complete = dateTasks.length > 0 && open === 0;
      cells.push(
        `<button class="month-day ${
          day.getMonth() === month ? "" : "is-outside"
        } ${key === ui.selectedDate ? "is-selected" : ""} ${
          key === today ? "is-today" : ""
        } ${dateTasks.length ? "has-tasks" : ""} ${
          complete ? "is-complete" : ""
        }" type="button" data-month-date="${key}" aria-label="${day.getMonth() + 1}月${day.getDate()}日，${
          complete ? "已完成" : `${open} 项待办`
        }">
          <span>${day.getDate()}</span>
          ${dateTasks.length ? `<i class="month-dot" aria-hidden="true"></i>` : ""}
        </button>`
      );
      day = addDaysDate(day, 1);
    }
    monthViewLabel.textContent = `${year}年${month + 1}月`;
    monthGrid.innerHTML = cells.join("");
  }

  function setMonthExpanded(expanded) {
    if (!monthView || !taskContent) return;
    ui.monthExpanded = Boolean(expanded);
    if (ui.monthExpanded) {
      ui.monthCursor = ui.selectedDate;
      renderMonthView();
    }
    monthView.hidden = !ui.monthExpanded;
    taskContent.hidden = ui.monthExpanded;
    document.querySelector("#page-tasks")?.classList.toggle(
      "is-month-expanded",
      ui.monthExpanded
    );
    if (monthPullHandle) {
      monthPullHandle.setAttribute("aria-expanded", String(ui.monthExpanded));
      monthPullHandle.querySelector(".month-pull-text").textContent =
        ui.monthExpanded ? "上拉收起月视图" : "下拉展开月视图";
    }
  }

  function bindMonthView() {
    if (!monthView || !monthGrid || !monthPullHandle) return;
    monthPullHandle.addEventListener("click", () => {
      setMonthExpanded(!ui.monthExpanded);
    });
    monthPullHandle.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setMonthExpanded(!ui.monthExpanded);
      }
    });

    document.querySelector("#monthPrev")?.addEventListener("click", () => {
      ui.monthCursor = addMonthsKey(ui.monthCursor, -1);
      renderMonthView();
    });
    document.querySelector("#monthNext")?.addEventListener("click", () => {
      ui.monthCursor = addMonthsKey(ui.monthCursor, 1);
      renderMonthView();
    });
    monthGrid.addEventListener("click", (event) => {
      const button = event.target.closest("[data-month-date]");
      if (!button) return;
      selectDate(button.dataset.monthDate, { force: true });
      setMonthExpanded(false);
    });

    let start = null;
    const onDown = (event) => {
      start = { x: event.clientX, y: event.clientY };
    };
    const onMove = (event) => {
      if (!start) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (Math.abs(dy) < 38 || Math.abs(dy) < Math.abs(dx)) return;
      if (dy > 0 && !ui.monthExpanded) {
        start = null;
        setMonthExpanded(true);
      }
    };
    const onUp = () => {
      start = null;
    };
    dateStripShell?.addEventListener("pointerdown", onDown, { passive: true });
    dateStripShell?.addEventListener("pointermove", onMove, { passive: true });
    dateStripShell?.addEventListener("pointerup", onUp, { passive: true });
    dateStripShell?.addEventListener("pointercancel", onUp, { passive: true });

    let monthStart = null;
    monthView.addEventListener("pointerdown", (event) => {
      monthStart = { x: event.clientX, y: event.clientY };
    }, { passive: true });
    monthView.addEventListener("pointermove", (event) => {
      if (!monthStart) return;
      const dx = event.clientX - monthStart.x;
      const dy = event.clientY - monthStart.y;
      if (dy < -38 && Math.abs(dy) > Math.abs(dx)) {
        monthStart = null;
        setMonthExpanded(false);
      }
    }, { passive: true });
    monthView.addEventListener("pointerup", () => {
      monthStart = null;
    }, { passive: true });
  }

  function scrollSelectedDate(smooth = true) {
    const selected = dateStrip.querySelector(".date-chip.is-selected");
    if (!selected) return;
    const stripRect = dateStrip.getBoundingClientRect();
    const chipRect = selected.getBoundingClientRect();
    const delta =
      chipRect.left -
      stripRect.left -
      (dateStrip.clientWidth - chipRect.width) / 2;
    if (Math.abs(delta) < 1) return;
    if (!smooth) {
      dateStrip.scrollLeft += delta;
      return;
    }
    dateStrip.scrollTo({
      left: dateStrip.scrollLeft + delta,
      behavior: "smooth",
    });
  }

  function ensureDateInRange(key) {
    const date = parseKey(key);
    const start = parseKey(ui.rangeStart);
    const end = parseKey(ui.rangeEnd);
    if (date < start || date > end) {
      ui.rangeStart = addDaysKey(key, -45);
      ui.rangeEnd = addDaysKey(key, 45);
      renderDateStrip();
    }
  }

  function selectDate(key, options = {}) {
    if (!key) return;
    if (key === ui.selectedDate && !options.force) return;
    ui.selectedDate = key;
    ui.completedOpen = false;
    ui.expandedTaskId = null;
    ensureHabitTasks(key);
    ensureDateInRange(key);
    updateDateStripSelection();
    renderTaskHeader();
    renderTaskList({ animate: false });
    if (options.scroll !== false) scrollSelectedDate(true);
    updateTodayJump();
  }

  function updateTodayJump() {
    const button = document.querySelector("#todayJump");
    const isToday = ui.selectedDate === todayKey();
    button.hidden = isToday;
    button.classList.toggle("is-visible", !isToday);
  }

  // ---------- Task rendering ----------
  function tasksForSelectedDate() {
    return state.tasks.filter((task) => task.date === ui.selectedDate);
  }

  function sortOpenTasks(tasks) {
    return [...tasks].sort((a, b) => {
      const aOrder = Number.isFinite(a.order) ? a.order : null;
      const bOrder = Number.isFinite(b.order) ? b.order : null;
      if (aOrder !== null && bOrder !== null) return aOrder - bOrder;
      if (aOrder !== null) return -1;
      if (bOrder !== null) return 1;
      return (a.createdAt || 0) - (b.createdAt || 0);
    });
  }

  function sortDoneTasks(tasks) {
    return [...tasks].sort(
      (a, b) => (b.completedAt || b.createdAt || 0) - (a.completedAt || a.createdAt || 0)
    );
  }

  function taskRepeatLabel(task) {
    if (!task?.repeat) return "";
    if (task.repeat.type === "daily") return "每天";
    if (task.repeat.type === "weekly") return "每周";
    if (task.repeat.type === "monthly") return "每月";
    return "";
  }

  function taskMetaHTML(task) {
    const parts = [];
    if (task.listId) {
      parts.push(listTagHTML(task.listId));
    }
    if (task.habitId) {
      parts.push(`<span class="tag tag--habit">每日</span>`);
    }
    if (task.repeat) {
      parts.push(`<span class="tag tag--repeat">${taskRepeatLabel(task)}</span>`);
    }
    if (state.settings?.subtasksEnabled && task.subtasks?.length) {
      const done = task.subtasks.filter((item) => item.done).length;
      parts.push(
        `<span class="meta-subtasks">${ICONS.check}<span>${done}/${task.subtasks.length}</span></span>`
      );
    }
    if (task.note) {
      parts.push(`<span class="meta-note" title="${esc(task.note)}">${ICONS.note}<span>备注</span></span>`);
    }
    return parts.join('<span class="meta-dot" aria-hidden="true"></span>');
  }

  function subtaskListHTML(task) {
    if (!state.settings?.subtasksEnabled || !task.subtasks?.length) return "";
    return `<div class="task-subtasks">
      ${task.subtasks
        .map(
          (item) => `<button class="subtask-row ${item.done ? "is-done" : ""}" type="button" data-action="subtask-toggle" data-subtask-id="${item.id}" aria-pressed="${item.done}" ${task.done ? "disabled" : ""}>
            <span class="subtask-check">${item.done ? ICONS.check : ""}</span>
            <span class="subtask-title">${esc(item.title)}</span>
          </button>`
        )
        .join("")}
    </div>`;
  }

  function taskInlineDetailHTML(task, expanded) {
    const note = task.note
      ? esc(task.note).replace(/\n/g, "<br>")
      : "暂无备注";
    return `<div class="task-inline-detail ${expanded ? "is-open" : ""}" ${
      expanded ? "" : 'inert aria-hidden="true"'
    }>
      <div class="task-inline-detail-inner">
        <div class="task-inline-detail-body">
          <div class="task-inline-detail-head">
            <span>任务详情</span>
            <button class="task-inline-close" type="button" data-action="collapse" aria-label="收起任务详情">${ICONS.close}</button>
          </div>
          ${subtaskListHTML(task)}
          <div class="task-detail-note">${note}</div>
        </div>
      </div>
    </div>`;
  }

  function taskCardHTML(task, completed = false) {
    const meta = completed ? "" : taskMetaHTML(task);
    const expanded = ui.expandedTaskId === task.id;
    const actions = `<button class="task-menu" type="button" data-action="menu" aria-label="任务操作 ${esc(
      task.title
    )}">${ICONS.dots}</button>`;
    return `<article class="task-card ${completed || task.done ? "is-done" : ""} ${
      expanded ? "is-expanded" : ""
    }" data-task-id="${task.id}">
      <div class="task-card-summary">
        <button class="task-check" type="button" data-action="toggle" aria-label="${
          task.done ? "恢复任务" : "完成任务"
        }：${esc(task.title)}" aria-pressed="${task.done ? "true" : "false"}">
          ${ICONS.check}
        </button>
        <div class="task-main">
          <p class="task-title">${esc(task.title)}</p>
          ${meta ? `<div class="task-meta">${meta}</div>` : ""}
        </div>
        ${actions}
      </div>
      ${taskInlineDetailHTML(task, expanded)}
    </article>`;
  }

  function setTaskDetailOpen(taskId, open, card = null) {
    const targetCard =
      card || taskList.querySelector(`[data-task-id="${taskId}"]`);
    if (!targetCard) return;
    const detail = targetCard.querySelector(".task-inline-detail");
    if (!detail) return;

    if (!open) {
      targetCard.classList.remove("is-expanded");
      detail.classList.remove("is-open");
      detail.setAttribute("inert", "");
      detail.setAttribute("aria-hidden", "true");
      if (ui.expandedTaskId === taskId) ui.expandedTaskId = null;
      return;
    }

    taskList.querySelectorAll(".task-card.is-expanded").forEach((other) => {
      if (other === targetCard) return;
      other.classList.remove("is-expanded");
      const otherDetail = other.querySelector(".task-inline-detail");
      otherDetail?.classList.remove("is-open");
      otherDetail?.setAttribute("inert", "");
      otherDetail?.setAttribute("aria-hidden", "true");
    });

    ui.expandedTaskId = taskId;
    targetCard.classList.add("is-expanded");
    detail.classList.add("is-open");
    detail.removeAttribute("inert");
    detail.setAttribute("aria-hidden", "false");
    window.setTimeout(() => {
      if (ui.expandedTaskId !== taskId) return;
      targetCard.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }, 80);
  }

  function toggleTaskDetails(taskId, card = null) {
    const targetCard =
      card || taskList.querySelector(`[data-task-id="${taskId}"]`);
    if (!targetCard) return;
    const detail = targetCard.querySelector(".task-inline-detail");
    setTaskDetailOpen(
      taskId,
      !detail?.classList.contains("is-open"),
      targetCard
    );
  }

  function openTaskActionMenu(taskId) {
    const task = state.tasks.find((item) => item.id === taskId);
    if (!task) return;
    const list = getList(task.listId);
    const color = listColorOption(list.color);
    openSheet(
      `<div class="goal-action-sheet">
        <div class="sheet-grab"></div>
        <div class="goal-action-head">
          <div class="goal-action-icon" style="background:${color.bg};color:${color.color}">${ICONS.check}</div>
          <h2>${esc(task.title)}</h2>
          <p>${formatShortDate(task.date)} · ${esc(list.name)}</p>
        </div>
        <div class="goal-action-list">
          ${
            task.done
              ? ""
              : `<button class="goal-action-item" type="button" id="taskActionEdit">${ICONS.pen}<span>编辑任务</span></button>
                 <button class="goal-action-item" type="button" id="taskActionPostpone">${ICONS.calendarNext}<span>顺延到明天</span></button>`
          }
          ${
            task.repeat
              ? `<button class="goal-action-item" type="button" id="taskActionStopRepeat">${ICONS.close}<span>停止重复</span></button>`
              : ""
          }
          <button class="goal-action-item goal-action-item--danger" type="button" id="taskActionDelete">${ICONS.trash}<span>删除任务</span></button>
        </div>
        <button class="confirm-cancel" type="button" data-close-sheet style="margin-top:10px">取消</button>
      </div>`,
      { className: "sheet--action", label: "任务操作" }
    );
    document.querySelector("#taskActionEdit")?.addEventListener("click", () => {
      openTaskForm(taskId);
    });
    document
      .querySelector("#taskActionPostpone")
      ?.addEventListener("click", () => {
        task.date = addDaysKey(task.date, 1);
        saveState();
        closeSheet();
        ui.expandedTaskId = null;
        refreshTasksView({ animate: false });
        showToast(`已顺延到 ${formatShortDate(task.date)}`);
      });
    document.querySelector("#taskActionDelete").addEventListener("click", () => {
      openDeleteTaskConfirm(taskId);
    });
    document.querySelector("#taskActionStopRepeat")?.addEventListener("click", () => {
      task.repeat = null;
      saveState();
      closeSheet();
      refreshTasksView({ animate: false });
      showToast("已停止重复");
    });
  }

  function emptyTaskHTML(hasDone) {
    return `<div class="empty-task-card">
      <div class="empty-task-icon">${hasDone ? ICONS.check : ICONS.sun}</div>
      <h3>${hasDone ? "这一天的任务都完成了" : "这一天还没有安排"}</h3>
      <p>${hasDone ? "做得很好，留一点空白给晚风。" : "从一件很小的事开始，也算向前。"}</p>
      <button class="empty-cta" type="button" data-action="add">${ICONS.plus}<span>添加任务</span></button>
    </div>`;
  }

  function completedSectionHTML(doneTasks) {
    const open = ui.completedOpen;
    return `<section class="completed-block">
      <button class="completed-toggle" type="button" data-action="toggle-completed" aria-expanded="${open}">
        <span>已完成</span>
        <span class="completed-count">${doneTasks.length}</span>
        <span class="collapse-arrow">${ICONS.chevronDown}</span>
      </button>
      <div class="completed-list" ${open ? "" : "hidden"}>
        ${doneTasks.map((task) => taskCardHTML(task, true)).join("")}
      </div>
    </section>`;
  }

  function renderTaskList(options = {}) {
    const tasks = tasksForSelectedDate();
    const openTasks = sortOpenTasks(tasks.filter((task) => !task.done));
    const doneTasks = sortDoneTasks(tasks.filter((task) => task.done));
    taskList.classList.toggle("no-motion", options.animate === false);

    let html = "";
    if (openTasks.length > 0) {
      html += `<div class="task-stack">${openTasks
        .map((task) => taskCardHTML(task, false))
        .join("")}</div>`;
      html += `<button class="add-task-row" type="button" data-action="add">${ICONS.plus}<span>添加任务</span></button>`;
    } else {
      html += emptyTaskHTML(doneTasks.length > 0);
    }

    if (doneTasks.length > 0) {
      html += completedSectionHTML(doneTasks);
    }

    taskList.innerHTML = html;
  }

  function renderTaskHeader() {
    const date = parseKey(ui.selectedDate);
    const tasks = tasksForSelectedDate();
    const openCount = tasks.filter((task) => !task.done).length;
    const doneCount = tasks.length - openCount;
    const percent = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

    document.querySelector("#monthEyebrow").textContent = `${
      date.getFullYear()
    }年${date.getMonth() + 1}月`;
    document.querySelector("#dayTitle").textContent = relativeDayLabel(ui.selectedDate);
    document.querySelector("#daySub").textContent = `${
      date.getMonth() + 1
    }月${date.getDate()}日 周${WEEKDAYS[date.getDay()]} · ${openCount} 项待办${
      doneCount ? ` · ${doneCount} 已完成` : ""
    }`;
    document.querySelector("#openCount").textContent = String(openCount);

    const orbit = document.querySelector("#progressOrbit");
    orbit.style.setProperty("--progress", String(percent));
    document.querySelector("#progressPercent").textContent = `${percent}%`;
    document.querySelector("#progressOrbit .progress-orbit-inner span").textContent =
      ui.selectedDate === todayKey() ? "今日" : "完成";

    updateTodayJump();
    updateNavBadge();
  }

  function updateNavBadge() {
    const badge = document.querySelector("#taskBadge");
    const todayOpen = state.tasks.filter(
      (task) => task.date === todayKey() && !task.done
    ).length;
    if (todayOpen > 0) {
      badge.hidden = false;
      badge.textContent = todayOpen > 9 ? "9+" : String(todayOpen);
    } else {
      badge.hidden = true;
    }
  }

  function refreshTasksView(options = {}) {
    renderTaskHeader();
    renderOverdueTasks();
    renderTaskList(options);
    updateDateStripDots();
    updateDateStripSelection();
    if (ui.monthExpanded) renderMonthView();
  }

  // ---------- Task completion ----------
  function createNextRepeatTask(task) {
    if (!task?.repeat || task.habitId || task.goalId) return null;
    const seriesId = task.repeat.seriesId || uid("series");
    task.repeat.seriesId = seriesId;
    let nextDate = nextRepeatKey(task.date, task.repeat.type);
    const today = todayKey();
    while (nextDate < today) {
      nextDate = nextRepeatKey(nextDate, task.repeat.type);
    }
    if (task.repeat.endDate && nextDate > task.repeat.endDate) return null;
    const exists = state.tasks.some(
      (item) =>
        item.repeat?.seriesId === seriesId &&
        item.date === nextDate &&
        !item.done
    );
    if (exists) return null;

    const next = {
      ...task,
      id: uid("task"),
      date: nextDate,
      done: false,
      completedAt: null,
      createdAt: Date.now(),
      isSample: false,
      repeat: { ...task.repeat, seriesId },
      subtasks: (task.subtasks || []).map((item) => ({
        ...item,
        id: uid("subtask"),
        done: false,
      })),
    };
    state.tasks.push(next);
    return next;
  }

  function toggleTask(taskId, card) {
    const task = state.tasks.find((item) => item.id === taskId);
    if (!task) return;
    if (card?.dataset.busy === "1") return;
    ui.expandedTaskId = null;
    if (card) setTaskDetailOpen(taskId, false, card);

    if (task.done) {
      task.done = false;
      task.completedAt = null;
      saveState();
      refreshTasksView({ animate: false });
      showToast("任务已恢复");
      return;
    }

    if (!card) return;
    card.dataset.busy = "1";
    card.style.maxHeight = `${card.offsetHeight}px`;
    card.classList.add("is-completing");
    if (navigator.vibrate) navigator.vibrate(12);

    window.setTimeout(() => {
      card.classList.add("is-collapsing");
    }, 330);

    window.setTimeout(() => {
      task.done = true;
      task.completedAt = Date.now();
      ui.completedOpen = false;
      if (task.habitId) {
        const habit = state.habits.find((item) => item.id === task.habitId);
        if (habit) pruneHabitPeriodTasks(habit);
      }
      const next = createNextRepeatTask(task);
      saveState();
      refreshTasksView({ animate: false });
      showToast(next ? "完成，已生成下一次" : "完成得漂亮");
    }, 680);
  }

  // ---------- Task form ----------
  function cancelTaskMorph() {
    const state = taskMorphState;
    taskMorphState = null;
    overlay.classList.remove("is-task-morph");
    if (!state) return;
    if (state.frame) cancelAnimationFrame(state.frame);
    state.ghost?.remove();
    state.cover?.remove();
    if (state.sourceCard?.isConnected) {
      state.sourceCard.style.visibility = state.originalVisibility || "";
    }
  }

  function playTaskMorph(sourceCard) {
    const hero = document.querySelector("#taskDetailHero");
    if (!hero || !sourceCard?.isConnected) {
      overlay.classList.remove("is-task-morph");
      return;
    }
    const sourceRect = sourceCard.getBoundingClientRect();
    const overlayRect = overlay.getBoundingClientRect();
    const sheetRect = sheet.getBoundingClientRect();
    const heroRect = hero.getBoundingClientRect();
    const finalSheetTop = overlayRect.bottom - sheet.offsetHeight;
    const target = {
      left: heroRect.left,
      top: heroRect.top + (finalSheetTop - sheetRect.top),
      width: heroRect.width,
      height: heroRect.height,
    };
    if (
      sourceRect.width <= 0 ||
      sourceRect.height <= 0 ||
      target.width <= 0 ||
      target.height <= 0
    ) {
      overlay.classList.remove("is-task-morph");
      return;
    }

    const ghost = hero.cloneNode(true);
    ghost.removeAttribute("id");
    ghost.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
    ghost.classList.add("task-morph-ghost");
    ghost.setAttribute("aria-hidden", "true");
    ghost.style.left = `${target.left}px`;
    ghost.style.top = `${target.top}px`;
    ghost.style.width = `${target.width}px`;
    ghost.style.height = `${target.height}px`;
    document.body.appendChild(ghost);

    // Keep the real hero painted from the first frame, under an opaque cover.
    // Removing the cover at landing therefore does not force a fresh first paint.
    const cover = document.createElement("div");
    cover.className = "task-morph-cover";
    cover.setAttribute("aria-hidden", "true");
    hero.appendChild(cover);

    const originalVisibility = sourceCard.style.visibility;
    sourceCard.style.visibility = "hidden";
    const state = {
      ghost,
      cover,
      sourceCard,
      originalVisibility,
      frame: 0,
      start: 0,
    };
    taskMorphState = state;

    const startScaleX = sourceRect.width / target.width;
    const startScaleY = sourceRect.height / target.height;
    ghost.style.transformOrigin = "top left";
    ghost.style.transform = `translate3d(${sourceRect.left - target.left}px, ${
      sourceRect.top - target.top
    }px, 0) scale(${startScaleX}, ${startScaleY})`;

    const sx = sourceRect.left + sourceRect.width / 2;
    const sy = sourceRect.top + sourceRect.height / 2;
    const tx = target.left + target.width / 2;
    const ty = target.top + target.height / 2;
    const dx = tx - sx;
    const dy = ty - sy;
    const distance = Math.max(1, Math.hypot(dx, dy));
    const bend = Math.min(distance * 0.12, 84) * (dx >= 0 ? 1 : -1);
    const controlX = (sx + tx) / 2 + (-dy / distance) * bend;
    const controlY = (sy + ty) / 2 + (dx / distance) * bend;

    const response = 0.38;
    const damping = 0.8;
    const omega = (Math.PI * 2) / response;
    let value = 0;
    let velocity = 0;
    let last = performance.now();
    state.start = last;

    const finish = () => {
      if (taskMorphState !== state) return;
      taskMorphState = null;
      if (state.frame) cancelAnimationFrame(state.frame);
      ghost.remove();
      cover.remove();
      overlay.classList.remove("is-task-morph");
      if (sourceCard.isConnected) {
        sourceCard.style.visibility = originalVisibility || "";
      }
    };

    const frame = (now) => {
      if (taskMorphState !== state) return;
      const dt = Math.min(0.032, Math.max(0.001, (now - last) / 1000));
      last = now;
      const force = omega * omega * (1 - value) - 2 * damping * omega * velocity;
      velocity += force * dt;
      value += velocity * dt;
      const t = Math.max(0, Math.min(1, value));
      const oneMinus = 1 - t;
      const centerX =
        oneMinus * oneMinus * sx +
        2 * oneMinus * t * controlX +
        t * t * tx;
      const centerY =
        oneMinus * oneMinus * sy +
        2 * oneMinus * t * controlY +
        t * t * ty;
      const widthScale =
        startScaleX + (1 - startScaleX) * t;
      const heightScale =
        startScaleY + (1 - startScaleY) * t;
      const left =
        centerX - (target.width * widthScale) / 2;
      const top =
        centerY - (target.height * heightScale) / 2;
      ghost.style.transform = `translate3d(${left - target.left}px, ${
        top - target.top
      }px, 0) scale(${widthScale}, ${heightScale})`;
      const settled =
        Math.abs(1 - value) < 0.002 && Math.abs(velocity) < 0.02;
      if (settled || now - state.start > 1100) {
        finish();
        return;
      }
      state.frame = requestAnimationFrame(frame);
    };

    state.frame = requestAnimationFrame(frame);
  }

  function openTaskDetails(taskId, sourceCard = null) {
    const task = state.tasks.find((item) => item.id === taskId);
    if (!task) return;
    const list = getList(task.listId);
    const color = listColorOption(list.color);
    const note = task.note
      ? esc(task.note).replace(/\n/g, "<br>")
      : "暂无备注";
    const shouldMorph =
      Boolean(sourceCard?.isConnected) &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    cancelTaskMorph();
    if (shouldMorph) {
      overlay.classList.add("is-task-morph");
    }

    openSheet(
      `<div class="task-detail-sheet">
        <div class="sheet-grab"></div>
        <div class="task-detail-hero" id="taskDetailHero">
          <div class="task-detail-top">
            <span class="tag" style="color:${color.color};background:${color.bg}">${esc(
              list.name
            )}</span>
            <button class="round-close" type="button" data-close-sheet aria-label="关闭">${
              ICONS.close
            }</button>
          </div>
          <h2 class="task-detail-title">${esc(task.title)}</h2>
          <div class="task-detail-meta">
            <span>${ICONS.calendar}<span>${formatShortDate(
              task.date
            )} ${formatDayLabel(task.date)}</span></span>
            <span class="task-detail-status ${
              task.done ? "is-done" : ""
            }">${task.done ? "已完成" : "未完成"}</span>
          </div>
        </div>
        <div class="task-detail-note">${note}</div>
        ${
          task.done
            ? `<p class="task-detail-locked">已完成任务不可编辑</p>`
            : ""
        }
        <div class="goal-action-list task-detail-actions">
          ${
            task.done
              ? ""
              : `<button class="goal-action-item" type="button" id="editTaskAction">${ICONS.pen}<span>编辑任务</span></button>
                 <button class="goal-action-item" type="button" id="postponeTaskAction">${ICONS.calendarNext}<span>顺延到明天</span></button>`
          }
          <button class="goal-action-item goal-action-item--danger" type="button" id="deleteTaskFromDetail">${ICONS.trash}<span>删除任务</span></button>
        </div>
      </div>`,
      { className: "sheet--action", label: "任务详情" }
    );

    if (shouldMorph) {
      playTaskMorph(sourceCard);
    }

    if (!task.done) {
      document.querySelector("#editTaskAction").addEventListener("click", () => {
        openTaskForm(taskId);
      });
      document.querySelector("#postponeTaskAction").addEventListener("click", () => {
        task.date = addDaysKey(task.date, 1);
        saveState();
        closeSheet();
        refreshTasksView({ animate: false });
        showToast(`已顺延到 ${formatShortDate(task.date)}`);
      });
    }
    document
      .querySelector("#deleteTaskFromDetail")
      .addEventListener("click", () => {
        openDeleteTaskConfirm(taskId);
      });
  }

  function openDeleteTaskConfirm(taskId) {
    const task = state.tasks.find((item) => item.id === taskId);
    if (!task) return;
    openSheet(
      `<div class="confirm-sheet">
        <div class="sheet-grab"></div>
        <div class="confirm-icon">${ICONS.trash}</div>
        <h2>删除这个任务？</h2>
        <p>「${esc(task.title)}」会移入回收站，5 秒内可撤销，也可以稍后恢复。</p>
        <div class="confirm-actions">
          <button class="btn-danger" type="button" id="confirmDeleteTask">${ICONS.trash}<span>确认删除</span></button>
          <button class="confirm-cancel" type="button" data-close-sheet>先留着</button>
        </div>
      </div>`,
      { className: "sheet--action", label: "确认删除任务" }
    );

    document.querySelector("#confirmDeleteTask").addEventListener("click", () => {
      if (task.habitId) {
        state.habitSkips = [
          ...(state.habitSkips || []),
          habitSkipKey(task.habitId, task.date),
        ];
      }
      if (ui.expandedTaskId === taskId) ui.expandedTaskId = null;
      const record = pushTrash({
        type: "task",
        title: task.title,
        item: task,
      });
      state.tasks = state.tasks.filter((item) => item.id !== taskId);
      saveState();
      closeSheet();
      refreshTasksView({ animate: false });
      renderGoalList();
      if (!listsPage.hidden) renderListManagerPage();
      showToast("任务已移入回收站", {
        undo: true,
        onUndo: () => restoreTrashEntry(record.id),
      });
    });
  }

  function openTaskForm(taskId = null) {
    const existing = taskId
      ? state.tasks.find((task) => task.id === taskId)
      : null;
    if (existing?.done) return;
    const editing = Boolean(existing);
    let selectedListId =
      existing?.listId || state.lists[0]?.id || "list_work";
    let formDate = existing?.date || ui.selectedDate;

    openSheet(
      `<div class="form-sheet">
        <div class="sheet-grab"></div>
        <header class="sheet-head">
          <button class="round-close" type="button" data-close-sheet aria-label="关闭">${ICONS.close}</button>
          <h2>${editing ? "编辑任务" : "新建任务"}</h2>
          <button class="head-action" type="button" id="saveTaskAction">保存</button>
        </header>
        <div class="sheet-body">
          <div class="task-form-title">
            <textarea class="task-title-input" id="taskTitleInput" rows="1" maxlength="120" placeholder="准备做点什么？">${esc(
              existing?.title || ""
            )}</textarea>
            <textarea class="note-input" id="taskNoteInput" rows="3" placeholder="补充一点细节（可选）">${esc(
              existing?.note || ""
            )}</textarea>
            <p class="form-error" id="taskFormError" hidden>给任务起个名字吧</p>
          </div>
          ${
            state.settings?.subtasksEnabled
              ? `<div class="subtask-editor" id="subtaskEditor">
                  <div class="subtask-editor-head">
                    <span class="tag-picker-label">子任务</span>
                    <button type="button" id="addSubtaskBtn">＋ 添加</button>
                  </div>
                  <div class="subtask-edit-list" id="subtaskEditList"></div>
                </div>`
              : ""
          }
          <div class="form-divider"></div>
          <div class="field-block field-block--date" id="taskDateRow">
            <span class="field-icon">${ICONS.calendar}</span>
            <div class="field-copy">
              <label>日期</label>
              <button class="date-trigger" type="button" id="taskDateTrigger" aria-expanded="false">
                <span id="taskDateDisplay">${calendarDateLabel(formDate)}</span>
                <span class="date-trigger-chevron">${ICONS.chevronDown}</span>
              </button>
            </div>
          </div>
          <div class="tag-picker-block">
            <p class="tag-picker-label">放入哪一个清单</p>
            <div class="list-picker" id="taskListPicker">
              ${state.lists
                .map(
                  (list) =>
                    `<button class="list-choice ${
                      list.id === selectedListId ? "is-selected" : ""
                    }" type="button" data-list-id="${list.id}" ${listChoiceStyle(
                      list
                    )}><span class="list-dot"></span><span>${esc(
                      list.name
                    )}</span></button>`
                )
                .join("")}
            </div>
          </div>
          ${
            editing
              ? `<button class="btn-danger" type="button" id="deleteTaskAction" style="margin-top:18px">${ICONS.trash}<span>删除任务</span></button>`
              : ""
          }
        </div>
      </div>`,
      { className: "sheet--form", label: editing ? "编辑任务" : "新建任务" }
    );

    const titleInput = document.querySelector("#taskTitleInput");
    const noteInput = document.querySelector("#taskNoteInput");
    const error = document.querySelector("#taskFormError");
    const taskListPicker = document.querySelector("#taskListPicker");
    const taskDateRow = document.querySelector("#taskDateRow");
    const dateTrigger = document.querySelector("#taskDateTrigger");
    const dateDisplay = document.querySelector("#taskDateDisplay");
    const subtaskEditList = document.querySelector("#subtaskEditList");
    let subtaskDrafts = (existing?.subtasks || []).map((item) => ({
      id: item.id || uid("subtask"),
      title: item.title,
      done: item.done === true,
    }));

    const renderSubtaskDrafts = () => {
      if (!subtaskEditList) return;
      subtaskEditList.innerHTML = subtaskDrafts
        .map(
          (item, index) => `<div class="subtask-edit-row" data-subtask-index="${index}">
            <button class="subtask-edit-check ${item.done ? "is-done" : ""}" type="button" data-subtask-done="${index}" aria-pressed="${item.done}">${item.done ? ICONS.check : ""}</button>
            <input class="subtask-input" type="text" maxlength="80" value="${esc(item.title)}" placeholder="子任务 ${index + 1}" data-subtask-input="${index}">
            <button class="subtask-remove" type="button" data-subtask-remove="${index}" aria-label="删除子任务">${ICONS.close}</button>
          </div>`
        )
        .join("");
    };
    renderSubtaskDrafts();

    if (subtaskEditList) {
      document.querySelector("#addSubtaskBtn").addEventListener("click", () => {
        subtaskDrafts.push({ id: uid("subtask"), title: "", done: false });
        renderSubtaskDrafts();
        const inputs = subtaskEditList.querySelectorAll(".subtask-input");
        inputs[inputs.length - 1]?.focus();
      });
      subtaskEditList.addEventListener("pointerdown", (event) => {
        if (event.target.closest("[data-subtask-remove]")) {
          event.preventDefault();
        }
      });
      subtaskEditList.addEventListener("input", (event) => {
        const input = event.target.closest("[data-subtask-input]");
        if (!input) return;
        const index = Number(input.dataset.subtaskInput);
        if (subtaskDrafts[index]) subtaskDrafts[index].title = input.value;
      });
      subtaskEditList.addEventListener("click", (event) => {
        const doneButton = event.target.closest("[data-subtask-done]");
        if (doneButton) {
          const index = Number(doneButton.dataset.subtaskDone);
          if (subtaskDrafts[index]) {
            subtaskDrafts[index].done = !subtaskDrafts[index].done;
            renderSubtaskDrafts();
          }
          return;
        }
        const removeButton = event.target.closest("[data-subtask-remove]");
        if (removeButton) {
          const index = Number(removeButton.dataset.subtaskRemove);
          subtaskDrafts.splice(index, 1);
          renderSubtaskDrafts();
          const inputs = subtaskEditList.querySelectorAll(".subtask-input");
          inputs[Math.min(index, inputs.length - 1)]?.focus();
        }
      });
    }

    const resizeTitle = () => {
      titleInput.style.height = "auto";
      titleInput.style.height = `${Math.min(titleInput.scrollHeight + 2, 132)}px`;
    };
    resizeTitle();
    titleInput.addEventListener("input", () => {
      resizeTitle();
      error.hidden = true;
    });
    if (!editing && window.matchMedia("(pointer: fine)").matches) {
      window.setTimeout(() => titleInput.focus(), 280);
    }

    taskDateRow.addEventListener("click", () => {
      openCalendarPicker(
        formDate,
        (key) => {
          formDate = key;
          dateDisplay.textContent = calendarDateLabel(key);
        },
        dateTrigger,
        "选择任务日期"
      );
    });

    taskListPicker.addEventListener("click", (event) => {
      const button = event.target.closest("[data-list-id]");
      if (!button) return;
      selectedListId = button.dataset.listId;
      taskListPicker.querySelectorAll("[data-list-id]").forEach((listButton) => {
        listButton.classList.toggle(
          "is-selected",
          listButton.dataset.listId === selectedListId
        );
      });
    });

    const save = () => {
      const title = titleInput.value.trim();
      if (!title) {
        error.hidden = false;
        document.querySelector(".task-form-title").classList.add("shake");
        window.setTimeout(
          () => document.querySelector(".task-form-title")?.classList.remove("shake"),
          340
        );
        titleInput.focus();
        return;
      }

      const date = formDate || ui.selectedDate;
      const repeatValue = existing?.repeat || null;
      const cleanSubtasks = state.settings.subtasksEnabled
        ? subtaskDrafts
            .map((item) => ({
              id: item.id,
              title: item.title.trim(),
              done: item.done === true,
            }))
            .filter((item) => item.title)
        : existing?.subtasks || [];
        if (existing) {
        existing.title = title;
        existing.note = noteInput.value.trim();
        existing.date = date;
        existing.listId = selectedListId;
        existing.repeat = repeatValue;
        if (state.settings.subtasksEnabled) {
          existing.subtasks = cleanSubtasks;
        }
      } else {
        state.tasks.push({
          id: uid("task"),
          title,
          note: noteInput.value.trim(),
          date,
          listId: selectedListId,
          done: false,
          createdAt: Date.now(),
          subtasks: cleanSubtasks,
          repeat: repeatValue,
        });
      }
      saveState();
      closeSheet();
      selectDate(date, { force: true });
      if (!listsPage.hidden) renderListManagerPage();
      showToast(existing ? "任务已更新" : "任务已添加");
    };

    document
      .querySelector("#saveTaskAction")
      .addEventListener("click", save);
    titleInput.addEventListener("keydown", (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") save();
    });

    const deleteButton = document.querySelector("#deleteTaskAction");
    if (deleteButton) {
      deleteButton.addEventListener("click", () => {
        openDeleteTaskConfirm(existing.id);
      });
    }
  }

  // ---------- Create / goals ----------
  function getGoalStats(goal) {
    const tasks = state.tasks.filter((task) => task.goalId === goal.id);
    const done = tasks.filter((task) => task.done).length;
    const percent = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
    return { tasks, done, percent };
  }

  function getWeekTaskProgress(goal, week) {
    const dayIds = new Set(week.days.map((day) => day.id));
    const tasks = state.tasks.filter(
      (task) =>
        task.goalId === goal.id &&
        task.planDayId &&
        dayIds.has(task.planDayId)
    );
    const done = tasks.filter((task) => task.done).length;
    return {
      total: tasks.length,
      done,
      complete: tasks.length > 0 && done === tasks.length,
    };
  }

  function weekCheckHTML(goal, week) {
    const progress = getWeekTaskProgress(goal, week);
    const label = progress.complete
      ? "本周已完成"
      : progress.total
      ? `本周已完成 ${progress.done}/${progress.total}`
      : "本周暂无行动";
    return `<span class="plan-week-check ${
      progress.complete ? "is-complete" : ""
    }" role="img" aria-label="${label}" title="${label}">${ICONS.check}</span>`;
  }

  function goalPlanStats(goal) {
    if (goal.plan?.months?.length) {
      const weeks = goal.plan.months.reduce(
        (total, month) => total + month.weeks.length,
        0
      );
      const days = goal.plan.months.reduce(
        (total, month) =>
          total +
          month.weeks.reduce((weekTotal, week) => weekTotal + week.days.length, 0),
        0
      );
      return {
        months: goal.plan.months.length,
        weeks,
        days,
      };
    }
    if (goal.plan?.weeks?.length) {
      const days = goal.plan.weeks.reduce(
        (total, week) => total + week.days.length,
        0
      );
      return {
        months: 0,
        weeks: goal.plan.weeks.length,
        days,
      };
    }
    if (goal.plan?.days?.length) {
      return {
        months: 0,
        weeks: 0,
        days: goal.plan.days.length,
      };
    }
    return null;
  }

  function createEmptyHTML() {
    return `<div class="create-empty">
      <div class="empty-visual">
        <svg viewBox="0 0 240 120" fill="none" aria-hidden="true">
          <defs>
            <linearGradient id="empty-line" x1="20" y1="97" x2="220" y2="28" gradientUnits="userSpaceOnUse">
              <stop stop-color="#b9c7ff" stop-opacity=".2"/>
              <stop offset=".48" stop-color="#7f95ff" stop-opacity=".8"/>
              <stop offset="1" stop-color="#6f5bff"/>
            </linearGradient>
            <linearGradient id="empty-flag" x1="206" y1="16" x2="232" y2="42" gradientUnits="userSpaceOnUse">
              <stop stop-color="#8b73ff"/>
              <stop offset="1" stop-color="#4d6cf5"/>
            </linearGradient>
            <filter id="empty-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="#6078e6" flood-opacity=".18"/>
            </filter>
          </defs>
          <circle cx="215" cy="90" r="29" fill="#f2f4ff"/>
          <circle cx="42" cy="34" r="17" fill="#f6f7ff"/>
          <circle cx="42" cy="34" r="2.4" fill="#c3cff8"/>
          <circle cx="70" cy="25" r="1.8" fill="#d4dcf7"/>
          <circle cx="222" cy="49" r="1.6" fill="#c7d0f2"/>
          <path d="M20 96C48 95 55 71 82 73c25 2 31 23 54 20 24-3 34-27 56-42 11-8 22-8 32-7" stroke="url(#empty-line)" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 7"/>
          <circle cx="20" cy="96" r="9" fill="#fff" stroke="#cbd6ff" stroke-width="1.5"/>
          <circle cx="20" cy="96" r="3.6" fill="#b6c5ff"/>
          <circle cx="82" cy="73" r="6.5" fill="#fff" stroke="#c4d0ff" stroke-width="1.5"/>
          <circle cx="82" cy="73" r="2.3" fill="#8ea3ff"/>
          <circle cx="136" cy="93" r="6.5" fill="#fff" stroke="#c4d0ff" stroke-width="1.5"/>
          <circle cx="136" cy="93" r="2.3" fill="#9f8dff"/>
          <g filter="url(#empty-shadow)">
            <rect x="201" y="13" width="4" height="44" rx="2" fill="#586fd1"/>
            <path d="M205 18h25l-6 8 6 8h-25V18z" fill="url(#empty-flag)"/>
            <circle cx="203" cy="16" r="3" fill="#8e9eff"/>
          </g>
          <path d="M188 58c7-4 14-5 22-3" stroke="#dfe5ff" stroke-width="2" stroke-linecap="round"/>
          <path d="M34 108h30M169 108h37" stroke="#e8ebf5" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <h2>把想法，种成日常</h2>
      <p>定下一个目标周期，再慢慢拆到每月、每周、每天。你的行动会自动出现在任务清单里。</p>
      <div class="how-steps">
        <span class="how-step"><b>01</b>选择周期</span>
        <span class="how-divider"></span>
        <span class="how-step"><b>02</b>逐层拆解</span>
        <span class="how-divider"></span>
        <span class="how-step"><b>03</b>同步每日</span>
      </div>
    </div>`;
  }

  function goalCardHTML(goal) {
    const stats = goalPlanStats(goal);
    const progress = getGoalStats(goal);
    const totalActions = stats?.days || progress.tasks.length || goal.actionCount || 0;
    const weekCount = stats?.weeks || (goal.unit === "week" ? goal.count : 0);
    const monthCount = stats?.months || (goal.unit === "month" ? goal.count : 0);
    const unitText = UNIT_CONFIG[goal.unit]?.unitLabel || "天";
    const summaryParts = [];
    if (monthCount) {
      summaryParts.push(`<span class="summary-chip"><b>${monthCount}</b> 个月</span>`);
    }
    if (weekCount) {
      summaryParts.push(`<span class="summary-chip"><b>${weekCount}</b> 周</span>`);
    }
    if (goal.unit === "day") {
      summaryParts.push(
        `<span class="summary-chip"><b>${goal.count}</b> 天</span>`
      );
    }
    summaryParts.push(
      `<span class="summary-chip"><b>${totalActions}</b> 个行动</span>`
    );

    let planHTML = "";
    if (goal.plan?.months?.length) {
      planHTML = goal.plan.months
        .map((month, index) => {
          return `<details class="plan-month">
            <summary>
              <span class="plan-index">M${index + 1}</span>
              <span class="plan-month-copy">
                <strong>${esc(month.label)}</strong>
                <span class="plan-goal-text">${esc(month.goal || goal.title)}</span>
              </span>
              <span style="color:#aab3c2;font-size:calc(8.5px * var(--font-scale))">${month.weeks.length} 周</span>
              ${ICONS.chevronDown}
            </summary>
            <div class="plan-month-body">
              ${month.weeks
                .map(
                  (week) => `<div class="plan-week">
                    <div class="plan-week-line">
                      <span>${esc(week.label)}</span>
                      <span class="plan-week-goal">${esc(
                        week.goal || "沿用本月目标"
                      )}</span>
                      ${weekCheckHTML(goal, week)}
                    </div>
                    <div class="plan-week-days">${week.days.length} 天 · ${formatShortDate(
                      week.start
                    )} – ${formatShortDate(week.end)}</div>
                  </div>`
                )
                .join("")}
            </div>
          </details>`;
        })
        .join("");
    } else if (goal.plan?.weeks?.length) {
      planHTML = `<div class="goal-plan-simple">已拆成 ${
        goal.plan.weeks.length
      } 周，共 ${progress.tasks.length} 个每日行动同步到清单。</div>
        <div class="goal-week-list">
          ${goal.plan.weeks
            .map(
              (week) => `<div class="plan-week">
                <div class="plan-week-line">
                  <span>${esc(week.label)}</span>
                  <span class="plan-week-goal">${esc(week.goal || goal.title)}</span>
                  ${weekCheckHTML(goal, week)}
                </div>
                <div class="plan-week-days">${week.days.length} 天 · ${formatShortDate(
                  week.start
                )} – ${formatShortDate(week.end)}</div>
              </div>`
            )
            .join("")}
        </div>`;
    } else if (goal.plan?.days?.length) {
      const previewDays = goal.plan.days.slice(0, 8);
      planHTML = `<div class="goal-plan-simple">每天一个行动，共 ${
        goal.plan.days.length
      } 天已同步到清单。</div>
        <div class="goal-day-list">
          ${previewDays
            .map(
              (day) => `<div class="goal-day-row">
                <span>${formatShortDate(day.date)} ${day.label}</span>
                <b>${esc(day.action || goal.title)}</b>
              </div>`
            )
            .join("")}
          ${
            goal.plan.days.length > previewDays.length
              ? `<div class="goal-day-more">还有 ${
                  goal.plan.days.length - previewDays.length
                } 天的行动</div>`
              : ""
          }
        </div>`;
    } else {
      planHTML = `<div class="goal-plan-simple">
        已同步 ${progress.tasks.length} 个行动到任务清单。
      </div>`;
    }

    return `<article class="goal-card ${
      progress.percent === 100 && progress.tasks.length ? "is-complete" : ""
    } ${goal.paused ? "is-paused" : ""}" data-goal-id="${goal.id}">
      <div class="goal-top">
        <button class="goal-icon goal-color-trigger" type="button" data-action="goal-color" data-goal-color="${goal.id}" aria-label="选择目标颜色" style="${goalColorStyle(goal.color || 0)}">${
          GOAL_ICONS[goal.unit] || ICONS.flag
        }</button>
        <div class="goal-title-wrap">
          <h3 class="goal-title">${esc(goal.title)}</h3>
          <div class="goal-meta">
            ${listTagHTML(goal.listId || defaultGoalListId())}
            <span class="meta-dot"></span>
            <span>${formatRange(goal.startDate, goal.endDate)}</span>
            <span class="meta-dot"></span>
            <span>${goal.count} ${unitText}</span>
            ${
              progress.percent === 100 && progress.tasks.length
                ? `<span class="meta-dot"></span><span style="color:var(--success);font-weight:700">已完成</span>`
                : ""
            }
            ${
              goal.paused
                ? `<span class="meta-dot"></span><span class="goal-paused-badge">已暂停</span>`
                : ""
            }
          </div>
        </div>
        <button class="goal-menu" type="button" data-action="goal-menu" aria-label="目标操作">${
          ICONS.dots
        }</button>
      </div>
      <div class="goal-progress-row">
        <div class="goal-progress-track"><div class="goal-progress-fill" style="width:${
          progress.percent
        }%"></div></div>
        <span class="goal-progress-value">${progress.percent}%</span>
      </div>
      <div class="goal-summary">${summaryParts.join("")}</div>
      <div class="goal-footer">
        <span class="sync-state">${ICONS.link}<span>已同步任务清单</span></span>
        <button class="plan-toggle" type="button" data-action="goal-plan" aria-expanded="false">查看拆解 ${
          ICONS.chevronDown
        }</button>
      </div>
      <div class="goal-plan" hidden>${planHTML}</div>
    </article>`;
  }

  function renderGlobalSearch() {
    if (!globalSearchInput || !globalSearchResults) return;
    const query = globalSearchInput.value.trim().toLowerCase();
    clearGlobalSearch.hidden = !query;
    if (!query) {
      globalSearchResults.hidden = true;
      globalSearchResults.innerHTML = "";
      return;
    }
    const groups = [
      {
        type: "task",
        title: "任务",
        items: state.tasks
          .filter(
            (task) =>
              task.title.toLowerCase().includes(query) ||
              (task.note || "").toLowerCase().includes(query)
          )
          .slice(0, 8),
      },
      {
        type: "goal",
        title: "目标",
        items: state.goals
          .filter((goal) => goal.title.toLowerCase().includes(query))
          .slice(0, 5),
      },
      {
        type: "habit",
        title: "习惯",
        items: state.habits
          .filter((habit) => habit.title.toLowerCase().includes(query))
          .slice(0, 5),
      },
      {
        type: "list",
        title: "清单",
        items: state.lists
          .filter((list) => list.name.toLowerCase().includes(query))
          .slice(0, 5),
      },
    ].filter((group) => group.items.length);

    if (!groups.length) {
      globalSearchResults.hidden = false;
      globalSearchResults.innerHTML = `<div class="search-empty">没有找到「${esc(
        globalSearchInput.value.trim()
      )}」</div>`;
      return;
    }

    globalSearchResults.hidden = false;
    globalSearchResults.innerHTML = groups
      .map(
        (group) => `<div class="search-group">
          <div class="search-group-title">${group.title}</div>
          ${group.items
            .map((item) => {
              if (group.type === "task") {
                return `<button class="search-result" type="button" data-search-type="task" data-search-id="${item.id}">
                  <span class="search-result-main"><strong>${esc(item.title)}</strong><small>${formatShortDate(item.date)} · ${esc(getList(item.listId).name)}${item.done ? " · 已完成" : ""}</small></span>
                  ${ICONS.chevron}
                </button>`;
              }
              if (group.type === "goal") {
                return `<button class="search-result" type="button" data-search-type="goal" data-search-id="${item.id}">
                  <span class="search-result-main"><strong>${esc(item.title)}</strong><small>${formatRange(item.startDate, item.endDate)}</small></span>
                  ${ICONS.chevron}
                </button>`;
              }
              if (group.type === "habit") {
                return `<button class="search-result" type="button" data-search-type="habit" data-search-id="${item.id}">
                  <span class="search-result-main"><strong>${esc(item.title)}</strong><small>${esc(getList(item.listId).name)}</small></span>
                  ${ICONS.chevron}
                </button>`;
              }
              return `<button class="search-result" type="button" data-search-type="list" data-search-id="${item.id}">
                <span class="search-result-main"><strong>${esc(item.name)}</strong><small>清单</small></span>
                ${ICONS.chevron}
              </button>`;
            })
            .join("")}
        </div>`
      )
      .join("");
  }

  function openSearchResult(type, id) {
    if (type === "task") {
      const task = state.tasks.find((item) => item.id === id);
      if (!task) return;
      ui.expandedTaskId = task.id;
      selectDate(task.date, { force: true, scroll: false });
      switchTab("tasks");
    } else if (type === "goal") {
      switchTab("create");
      window.setTimeout(() => {
        document
          .querySelector(`[data-goal-id="${id}"]`)
          ?.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 120);
    } else if (type === "habit") {
      openHabitsPage();
    } else if (type === "list") {
      openListManager();
    }
    globalSearchInput.value = "";
    globalSearchInput.blur();
    renderGlobalSearch();
  }

  function renderHabitList() {
    if (!habitList) return;
    ensureHabitTasks(todayKey());
    const visibleHabits = state.habits.filter((habit) =>
      habitMatchesDate(habit, todayKey())
    );
    if (!visibleHabits.length) {
      habitList.innerHTML = `<div class="habit-empty">
        <span class="habit-empty-icon">${ICONS.sun}</span>
        <span><strong>今天没有需要重复的习惯</strong><small>重复的时候会重新出现在这里</small></span>
      </div>`;
      return;
    }
    habitList.innerHTML = visibleHabits
      .map((habit) => {
        const todayTask = habitTaskFor(habit.id);
        const scheduledToday = habitMatchesDate(habit, todayKey());
        const done = Boolean(scheduledToday && todayTask?.done);
        const streak = habitStreak(habit.id);
        const list = getList(habit.listId);
        const habitColor = listColorOption(habit.color || stableHabitColor(habit.id));
        const repeatLabel = habitRepeatLabel(habit);
        const countMode =
          ["weekly", "monthly"].includes(habitRepeat(habit).type) &&
          habitRepeat(habit).mode === "count";
        const target = habitTarget(habit);
        const periodDone = countMode
          ? habitPeriodDone(habit.id, todayKey(), habitRepeat(habit).type)
          : 0;
        const periodLabel = habitRepeat(habit).type === "monthly" ? "本月" : "本周";
        const weeklyReached = countMode && periodDone >= target;
        return `<article class="habit-card ${done ? "is-done" : ""}" data-habit-id="${habit.id}">
          <button class="habit-state habit-color-trigger ${done ? "is-done" : ""}" type="button" data-habit-color="${habit.id}" aria-label="选择习惯颜色" style="color:${habitColor.color};background:${habitColor.bg}">${
          done ? ICONS.check : ICONS.sun
        }</button>
          <div class="habit-copy">
            <strong>${esc(habit.title)}</strong>
            <small>${esc(list.name)} · ${repeatLabel}${
          countMode ? ` · ${periodLabel} ${periodDone}/${target}` : ""
        } · ${
          !scheduledToday
            ? "今天不重复"
            : weeklyReached
              ? `${periodLabel}已完成`
              : done
                ? "今天已完成"
                : "今天待完成"
        }${
          habitRepeat(habit).type === "daily" && streak > 0
            ? ` · 连续 ${streak} 天`
            : ""
        }</small>
          </div>
          <button class="habit-menu" type="button" data-habit-menu="${habit.id}" aria-label="习惯操作">${ICONS.dots}</button>
        </article>`;
      })
      .join("");
  }

  function openHabitForm(habitId = null) {
    const existing = habitId
      ? state.habits.find((habit) => habit.id === habitId)
      : null;
    let selectedListId =
      existing?.listId || state.lists[0]?.id || "list_work";
    const today = parseKey(todayKey());
    let repeat = {
      type: existing?.repeat?.type || "daily",
      weekdays:
        existing?.repeat?.weekdays?.length
          ? [...existing.repeat.weekdays]
          : [today.getDay()],
      monthDays:
        existing?.repeat?.monthDays?.length
          ? [...existing.repeat.monthDays]
          : [today.getDate()],
      mode: existing?.repeat?.mode === "count" ? "count" : "days",
      weeklyTarget: Math.max(
        1,
        Math.min(7, Number(existing?.repeat?.weeklyTarget) || 3)
      ),
      monthlyTarget: Math.max(
        1,
        Math.min(31, Number(existing?.repeat?.monthlyTarget) || 8)
      ),
      endDate: existing?.repeat?.endDate || "",
    };
    openSheet(
      `<div class="form-sheet">
        <div class="sheet-grab"></div>
        <header class="sheet-head">
          <button class="round-close" type="button" data-close-sheet aria-label="关闭">${ICONS.close}</button>
          <h2>${existing ? "编辑重复任务" : "新建重复任务"}</h2>
          <button class="head-action" type="button" id="saveHabitAction">保存</button>
        </header>
        <div class="sheet-body">
          <div class="task-form-title">
            <label class="tag-picker-label" for="habitNameInput">习惯名称</label>
            <input class="task-title-input" id="habitNameInput" type="text" maxlength="60"
              value="${esc(existing?.title || "")}" placeholder="例如：阅读 20 分钟">
          </div>
          <div class="tag-picker-block">
            <p class="tag-picker-label">放入哪一个清单</p>
            <div class="list-picker" id="habitListPicker">
              ${state.lists
                .map(
                  (list) =>
                    `<button class="list-choice ${
                      list.id === selectedListId ? "is-selected" : ""
                    }" type="button" data-list-id="${list.id}" ${listChoiceStyle(
                      list
                    )}><span class="list-dot"></span><span>${esc(
                      list.name
                    )}</span></button>`
                )
                .join("")}
            </div>
          </div>
          <div class="habit-repeat-block">
            <p class="tag-picker-label">重复方式</p>
            <div class="segmented habit-repeat-segment" id="habitRepeatType">
              <button type="button" data-repeat-type="daily" class="${repeat.type === "daily" ? "is-active" : ""}">每天</button>
              <button type="button" data-repeat-type="weekly" class="${repeat.type === "weekly" ? "is-active" : ""}">每周</button>
              <button type="button" data-repeat-type="monthly" class="${repeat.type === "monthly" ? "is-active" : ""}">每月</button>
            </div>
            <div class="habit-weekday-picker" id="habitWeekdayPicker">
              ${["日", "一", "二", "三", "四", "五", "六"]
                .map(
                  (label, day) =>
                    `<button class="habit-weekday ${repeat.weekdays.includes(day) ? "is-selected" : ""}" type="button" data-weekday="${day}">${label}</button>`
                )
                .join("")}
            </div>
            <button class="habit-month-trigger" type="button" id="habitMonthTrigger" hidden>
              ${ICONS.calendar}<span id="habitMonthTriggerLabel">选择每月日期</span>${ICONS.chevron}
            </button>
            <div class="habit-count-row" id="habitCountRow" hidden>
              <button class="habit-count-toggle" type="button" id="habitCountMode" aria-pressed="${repeat.mode === "count"}">
                <span class="habit-count-check">${repeat.mode === "count" ? ICONS.check : ""}</span>
                <span id="habitCountModeLabel">按每周次数</span>
              </button>
              <div class="habit-target-chips" id="habitTargetChips"></div>
            </div>
            <button class="habit-end-date" type="button" id="habitEndDateBtn">${repeat.endDate ? `结束于 ${formatShortDate(repeat.endDate)}` : "不设结束日期"}</button>
            <button class="habit-end-clear" type="button" id="habitEndDateClear" ${repeat.endDate ? "" : "hidden"}>清除结束日期</button>
          </div>
          <p class="habit-form-note">到日期时会自动生成一条任务；完成入口仍在任务清单。</p>
        </div>
      </div>`,
      { className: "sheet--form", label: existing ? "编辑重复任务" : "新建重复任务" }
    );

    const nameInput = document.querySelector("#habitNameInput");
    const picker = document.querySelector("#habitListPicker");
    const repeatType = document.querySelector("#habitRepeatType");
    const weekdayPicker = document.querySelector("#habitWeekdayPicker");
    const monthTrigger = document.querySelector("#habitMonthTrigger");
    const monthTriggerLabel = document.querySelector("#habitMonthTriggerLabel");
    const countRow = document.querySelector("#habitCountRow");
    const countMode = document.querySelector("#habitCountMode");
    const countModeLabel = document.querySelector("#habitCountModeLabel");
    const targetChips = document.querySelector("#habitTargetChips");

    const updateMonthTrigger = () => {
      if (!monthTriggerLabel) return;
      if (repeat.mode === "count") {
        monthTriggerLabel.textContent = `每月 ${repeat.monthlyTarget} 次`;
      } else {
        const days = [...repeat.monthDays].sort((a, b) => a - b);
        monthTriggerLabel.textContent = days.length
          ? `每月 ${days.map((day) => `${day}日`).join("、")}`
          : "选择每月日期";
      }
    };

    const renderTargetChips = () => {
      const target = repeat.weeklyTarget;
      targetChips.innerHTML = Array.from({ length: 7 }, (_, index) => {
        const value = index + 1;
        return `<button class="${value === target ? "is-selected" : ""}" type="button" data-habit-target="${value}">${value}</button>`;
      }).join("");
      targetChips.hidden = repeat.mode !== "count";
    };

    const syncRepeatControls = () => {
      const weekly = repeat.type === "weekly";
      const monthly = repeat.type === "monthly";
      weekdayPicker.hidden = !weekly || repeat.mode === "count";
      monthTrigger.hidden = !monthly;
      countRow.hidden = !weekly;
      countMode.classList.toggle("is-on", repeat.mode === "count");
      countMode.setAttribute("aria-pressed", String(repeat.mode === "count"));
      countModeLabel.textContent = "按每周次数";
      repeatType.querySelectorAll("[data-repeat-type]").forEach((button) => {
        button.classList.toggle(
          "is-active",
          button.dataset.repeatType === repeat.type
        );
      });
      renderTargetChips();
      updateMonthTrigger();
    };
    syncRepeatControls();

    repeatType.addEventListener("pointerdown", (event) => {
      if (event.target.closest("button")) event.preventDefault();
    });
    weekdayPicker.addEventListener("pointerdown", (event) => {
      if (event.target.closest("button")) event.preventDefault();
    });
    countRow.addEventListener("pointerdown", (event) => {
      if (event.target.closest("button")) event.preventDefault();
    });

    repeatType.addEventListener("click", (event) => {
      const button = event.target.closest("[data-repeat-type]");
      if (!button) return;
      repeat.type = button.dataset.repeatType;
      syncRepeatControls();
      nameInput.focus({ preventScroll: true });
    });
    monthTrigger.addEventListener("click", () => {
      nameInput.blur();
      openHabitMonthlyPicker(
        {
          monthDays: repeat.monthDays,
          mode: repeat.mode,
          monthlyTarget: repeat.monthlyTarget,
        },
        (value) => {
          repeat.monthDays = value.monthDays;
          repeat.mode = value.mode;
          repeat.monthlyTarget = value.monthlyTarget;
          syncRepeatControls();
          nameInput.blur();
        },
        monthTrigger
      );
    });
    weekdayPicker.addEventListener("click", (event) => {
      const button = event.target.closest("[data-weekday]");
      if (!button) return;
      const day = Number(button.dataset.weekday);
      if (repeat.weekdays.includes(day)) {
        if (repeat.weekdays.length === 1) return;
        repeat.weekdays = repeat.weekdays.filter((item) => item !== day);
      } else {
        repeat.weekdays = [...repeat.weekdays, day];
      }
      button.classList.toggle("is-selected");
      nameInput.focus({ preventScroll: true });
    });
    countMode.addEventListener("click", () => {
      repeat.mode = repeat.mode === "count" ? "days" : "count";
      syncRepeatControls();
      nameInput.focus({ preventScroll: true });
    });
    targetChips.addEventListener("click", (event) => {
      const button = event.target.closest("[data-habit-target]");
      if (!button) return;
      const value = Number(button.dataset.habitTarget);
      repeat.weeklyTarget = value;
      renderTargetChips();
      nameInput.focus({ preventScroll: true });
    });
    document
      .querySelector("#habitEndDateBtn")
      .addEventListener("click", () => {
        openCalendarPicker(
          repeat.endDate || todayKey(),
          (key) => {
            repeat.endDate = key;
            document.querySelector("#habitEndDateBtn").textContent =
              `结束于 ${formatShortDate(key)}`;
            document.querySelector("#habitEndDateClear").hidden = false;
          },
          null,
          "选择重复结束日期"
        );
      });
    document
      .querySelector("#habitEndDateClear")
      .addEventListener("click", () => {
        repeat.endDate = "";
        document.querySelector("#habitEndDateBtn").textContent =
          "不设结束日期";
        document.querySelector("#habitEndDateClear").hidden = true;
      });

    picker.addEventListener("click", (event) => {
      const button = event.target.closest("[data-list-id]");
      if (!button) return;
      selectedListId = button.dataset.listId;
      picker.querySelectorAll("[data-list-id]").forEach((choice) => {
        choice.classList.toggle(
          "is-selected",
          choice.dataset.listId === selectedListId
        );
      });
      if (document.activeElement !== nameInput) {
        nameInput.focus({ preventScroll: true });
      }
    });
    window.setTimeout(() => {
      nameInput.focus({ preventScroll: true });
      nameInput.setSelectionRange(nameInput.value.length, nameInput.value.length);
    }, 180);

    document.querySelector("#saveHabitAction").addEventListener("click", () => {
      const title = nameInput.value.trim();
      if (!title) {
        nameInput.focus();
        return;
      }
      const repeatValue = {
        type: repeat.type,
        weekdays: [...repeat.weekdays],
        monthDays: [...repeat.monthDays],
        mode: repeat.mode,
        weeklyTarget: repeat.weeklyTarget,
        monthlyTarget: repeat.monthlyTarget,
        endDate: repeat.endDate,
      };
      if (existing) {
        existing.title = title;
        existing.listId = selectedListId;
        existing.repeat = repeatValue;
        state.tasks.forEach((task) => {
          if (task.habitId === existing.id && !task.done) {
            task.title = title;
            task.listId = selectedListId;
          }
        });
      } else {
        state.habits.push({
          id: uid("habit"),
          title,
          listId: selectedListId,
          color: randomHabitColor(),
          repeat: repeatValue,
          createdAt: Date.now(),
        });
      }
      saveState();
      ensureHabitTasks(todayKey());
      const savedHabit = existing || state.habits[state.habits.length - 1];
      if (savedHabit) pruneHabitPeriodTasks(savedHabit);
      closeSheet();
      renderGoalList();
      refreshTasksView({ animate: false });
      showToast(existing ? "重复任务已更新" : "重复任务已创建");
    });
  }

  function openColorPicker(title, options, selectedIndex, onSelect, icon = ICONS.check) {
    const selected = options[selectedIndex] || options[0];
    openSheet(
      `<div class="color-sheet">
        <div class="sheet-grab"></div>
        <div class="color-current-icon" style="background:${selected.color}">${icon}</div>
        <h2>${title}</h2>
        <p>选择后会立即应用到这个项目。</p>
        <div class="color-picker color-picker--cards">
          ${options
            .map(
              (option, index) =>
                `<button class="color-card ${
                  index === selectedIndex ? "is-selected" : ""
                }" type="button" data-picker-color="${index}" aria-label="${
                  option.label
                }色" style="--swatch:${option.color};--card-color:${option.color}">
                  <span class="color-card-dot"></span>
                  <span class="color-card-label">${option.label}</span>
                  <span class="color-card-check">${ICONS.check}</span>
                </button>`
            )
            .join("")}
        </div>
        <button class="confirm-cancel" type="button" data-close-sheet style="margin-top:14px">取消</button>
      </div>`,
      { className: "sheet--action sheet--color", label: title }
    );
    document.querySelectorAll("[data-picker-color]").forEach((button) => {
      button.addEventListener("click", () => {
        onSelect(Number(button.dataset.pickerColor));
        closeSheet();
      });
    });
  }

  function openGoalColorPicker(goalId) {
    const goal = state.goals.find((item) => item.id === goalId);
    if (!goal) return;
    const options = GOAL_COLOR_KEYS.map((key, index) => ({
      key,
      color: GOAL_COLORS[index][1],
      label: ["蓝", "橙", "绿", "紫", "青"][index],
    }));
    openColorPicker(
      "选择目标颜色",
      options,
      Math.max(0, Math.min(GOAL_COLOR_KEYS.length - 1, Number(goal.color) || 0)),
      (index) => {
        goal.color = index;
        saveState();
        renderGoalList();
        showToast("目标颜色已更新");
      },
      GOAL_ICONS[goal.unit] || ICONS.flag
    );
  }

  function openHabitColorPicker(habitId) {
    const habit = state.habits.find((item) => item.id === habitId);
    if (!habit) return;
    const options = HABIT_COLOR_KEYS.map((key) => ({
      key,
      ...LIST_COLOR_OPTIONS[key],
    }));
    const selectedIndex = Math.max(
      0,
      HABIT_COLOR_KEYS.indexOf(habit.color || stableHabitColor(habit.id))
    );
    openColorPicker(
      "选择习惯颜色",
      options,
      selectedIndex,
      (index) => {
        habit.color = HABIT_COLOR_KEYS[index];
        saveState();
        renderHabitList();
        showToast("习惯颜色已更新");
      },
      ICONS.sun
    );
  }

  function openHabitActions(habitId) {
    const habit = state.habits.find((item) => item.id === habitId);
    if (!habit) return;
    const task = habitTaskFor(habit.id);
    openSheet(
      `<div class="goal-action-sheet">
        <div class="sheet-grab"></div>
        <div class="goal-action-head">
          <div class="goal-action-icon" style="background:var(--accent-soft);color:var(--accent)">${ICONS.sun}</div>
          <h2>${esc(habit.title)}</h2>
          <p>${habitRepeatLabel(habit)} · ${esc(getList(habit.listId).name)} · 连续 ${habitStreak(
        habit.id
      )} 天</p>
        </div>
        <div class="goal-action-list">
          <button class="goal-action-item" type="button" id="editHabitAction">${ICONS.pen}<span>编辑习惯</span></button>
          <button class="goal-action-item goal-action-item--danger" type="button" id="deleteHabitAction">${ICONS.trash}<span>删除习惯</span></button>
        </div>
        <button class="confirm-cancel" type="button" data-close-sheet style="margin-top:10px">取消</button>
      </div>`,
      { className: "sheet--action", label: "习惯操作" }
    );
    document.querySelector("#editHabitAction").addEventListener("click", () => {
      openHabitForm(habitId);
    });
    document.querySelector("#deleteHabitAction").addEventListener("click", () => {
      openHabitDeleteConfirm(habitId);
    });
  }

  function openHabitDeleteConfirm(habitId) {
    const habit = state.habits.find((item) => item.id === habitId);
    if (!habit) return;
    openSheet(
      `<div class="confirm-sheet">
        <div class="sheet-grab"></div>
        <div class="confirm-icon">${ICONS.trash}</div>
        <h2>删除这个习惯？</h2>
        <p>「${esc(habit.title)}」以及它生成的每日任务会移入回收站，5 秒内可撤销。</p>
        <div class="confirm-actions">
          <button class="btn-danger" type="button" id="confirmDeleteHabit">${ICONS.trash}<span>确认删除</span></button>
          <button class="confirm-cancel" type="button" data-close-sheet>先留着</button>
        </div>
      </div>`,
      { className: "sheet--action", label: "确认删除习惯" }
    );
    document.querySelector("#confirmDeleteHabit").addEventListener("click", () => {
      const relatedTasks = state.tasks.filter((task) => task.habitId === habitId);
      const relatedSkips = (state.habitSkips || []).filter((key) =>
        key.startsWith(`${habitId}:`)
      );
      const record = pushTrash({
        type: "habit",
        title: habit.title,
        item: habit,
        tasks: relatedTasks,
        habitSkips: relatedSkips,
      });
      state.habits = state.habits.filter((item) => item.id !== habitId);
      state.tasks = state.tasks.filter((task) => task.habitId !== habitId);
      state.habitSkips = (state.habitSkips || []).filter(
        (key) => !key.startsWith(`${habitId}:`)
      );
      saveState();
      closeSheet();
      renderGoalList();
      refreshTasksView({ animate: false });
      showToast("习惯已移入回收站", {
        undo: true,
        onUndo: () => restoreTrashEntry(record.id),
      });
    });
  }

  function renderGoalList() {
    const activeGoals = state.goals.filter((goal) => !goal.paused);
    if (!activeGoals.length) {
      goalList.innerHTML = createEmptyHTML();
    } else {
      goalList.innerHTML = activeGoals.map((goal) => goalCardHTML(goal)).join("");
    }
    renderHabitList();
    renderProfileMenuHints();
  }

  function toggleGoalPlan(goalId, forceOpen = null) {
    const card = goalList.querySelector(`[data-goal-id="${goalId}"]`);
    if (!card) return;
    const plan = card.querySelector(".goal-plan");
    const button = card.querySelector('[data-action="goal-plan"]');
    const currentlyOpen = !plan.hidden;
    const shouldOpen = forceOpen === null ? !currentlyOpen : forceOpen;
    plan.hidden = !shouldOpen;
    card.classList.toggle("is-open", shouldOpen);
    button.setAttribute("aria-expanded", String(shouldOpen));
  }

  function openGoalActions(goalId) {
    const goal = state.goals.find((item) => item.id === goalId);
    if (!goal) return;
    const unitText = UNIT_CONFIG[goal.unit]?.unitLabel || "天";
    openSheet(
      `<div class="goal-action-sheet">
        <div class="sheet-grab"></div>
        <div class="goal-action-head">
          <div class="goal-action-icon" style="${goalColorStyle(goal.color || 0)}">${
            GOAL_ICONS[goal.unit] || ICONS.flag
          }</div>
          <h2>${esc(goal.title)}</h2>
          <p>${formatRange(goal.startDate, goal.endDate)} · ${goal.count} ${unitText}</p>
        </div>
        <div class="goal-action-list">
          <button class="goal-action-item" type="button" id="editGoalAction">${ICONS.pen}<span>编辑目标</span></button>
          <button class="goal-action-item" type="button" id="goalPauseAction">${ICONS.clock}<span>${goal.paused ? "继续目标" : "暂停目标"}</span></button>
          <button class="goal-action-item" type="button" id="goalCatchUpAction">${ICONS.calendarNext}<span>追赶未完成行动</span></button>
          <button class="goal-action-item goal-action-item--danger" type="button" id="deleteGoalAction">${ICONS.trash}<span>删除目标及关联任务</span></button>
        </div>
        <button class="confirm-cancel" type="button" data-close-sheet style="margin-top:10px">取消</button>
      </div>`,
      { className: "sheet--action", label: "目标操作" }
    );

    document.querySelector("#editGoalAction").addEventListener("click", () => {
      closeSheet({ immediate: true });
      openGoalEditor(goalId);
    });

    document.querySelector("#goalPauseAction").addEventListener("click", () => {
      goal.paused = !goal.paused;
      saveState();
      closeSheet();
      renderProfileMenuHints();
      renderGoalList();
      showToast(goal.paused ? "目标已暂停" : "目标已继续");
    });

    document.querySelector("#goalCatchUpAction").addEventListener("click", () => {
      const today = todayKey();
      const missed = state.tasks
        .filter(
          (task) => task.goalId === goalId && !task.done && task.date < today
        )
        .sort((a, b) => a.date.localeCompare(b.date));
      if (!missed.length) {
        closeSheet();
        showToast("没有需要追赶的行动");
        return;
      }
      missed.forEach((task, index) => {
        task.date = addDaysKey(today, Math.min(index, 30));
      });
      goal.paused = false;
      saveState();
      closeSheet();
      renderGoalList();
      refreshTasksView({ animate: false });
      showToast(`已追赶 ${missed.length} 个行动`);
    });

    document.querySelector("#deleteGoalAction").addEventListener("click", () => {
      openDeleteGoalConfirm(goalId);
    });
  }

  function forEachPlanDay(plan, callback) {
    if (!plan) return;
    if (plan.months) {
      plan.months.forEach((month) => {
        month.weeks.forEach((week) => {
          week.days.forEach((day) => callback(day, week, month));
        });
      });
    } else if (plan.weeks) {
      plan.weeks.forEach((week) => {
        week.days.forEach((day) => callback(day, week, null));
      });
    } else if (plan.days) {
      plan.days.forEach((day) => callback(day, null, null));
    }
  }

  function resizeWeekPlan(plan, targetCount) {
    const count = clamp(targetCount, 1, 52);
    if (plan.weeks.length > count) {
      plan.weeks = plan.weeks.slice(0, count);
    } else if (plan.weeks.length < count) {
      let previousEnd =
        plan.weeks.length > 0
          ? parseKey(plan.weeks[plan.weeks.length - 1].end)
          : addDaysDate(parseKey(plan.startDate), -1);

      for (let index = plan.weeks.length; index < count; index += 1) {
        const weekStart = addDaysDate(previousEnd, 1);
        const weekEnd = addDaysDate(weekStart, 6);
        const days = [];
        for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
          const day = addDaysDate(weekStart, dayIndex);
          days.push({
            id: uid("day"),
            date: keyOf(day),
            label: `周${WEEKDAYS[day.getDay()]}`,
            action: "",
          });
        }
        plan.weeks.push({
          id: uid("week"),
          label: `第 ${index + 1} 周`,
          start: keyOf(weekStart),
          end: keyOf(weekEnd),
          days,
          goal: "",
        });
        previousEnd = weekEnd;
      }
    }

    plan.weekCount = plan.weeks.length;
    plan.dayCount = plan.weeks.reduce(
      (total, week) => total + week.days.length,
      0
    );
    plan.endDate = plan.weeks[plan.weeks.length - 1].end;
    return plan;
  }

  function openGoalEditor(goalId) {
    const goal = state.goals.find((item) => item.id === goalId);
    if (!goal) return;

    if (!goal.plan) {
      openLegacyGoalTitleEditor(goal);
      return;
    }

    editingGoalId = goal.id;
    goalDraft = {
      title: goal.title,
      unit: goal.unit,
      count: goal.count,
      counts: {
        day: goal.unit === "day" ? goal.count : 7,
        week: goal.unit === "week" ? goal.count : 4,
        month: goal.unit === "month" ? goal.count : 3,
      },
      startDate: goal.startDate,
      color: goal.color,
      listId: goal.listId || defaultGoalListId(),
      plan: JSON.parse(JSON.stringify(goal.plan)),
    };
    openFullPage("page-goal", "create", () =>
      renderGoalWizardStep2({ focusTitle: true })
    );
  }

  function openLegacyGoalTitleEditor(goal) {
    openSheet(
      `<div class="form-sheet">
        <div class="sheet-grab"></div>
        <header class="sheet-head">
          <button class="round-close" type="button" data-close-sheet aria-label="关闭">${ICONS.close}</button>
          <h2>编辑目标</h2>
          <button class="head-action" type="button" id="saveLegacyGoalTitle">保存</button>
        </header>
        <div class="sheet-body">
          <div class="task-form-title">
            <label class="tag-picker-label" for="legacyGoalTitleInput">目标名称</label>
            <input class="task-title-input" id="legacyGoalTitleInput" type="text" maxlength="40"
              value="${esc(goal.title)}" placeholder="目标名称">
          </div>
          <p class="plan-tip" style="margin-top:16px">
            ${ICONS.info}
            <span>这是较早创建的目标，当前只能修改名称；新建的目标可以编辑每周和每日的拆解。</span>
          </p>
        </div>
      </div>`,
      { className: "sheet--form", label: "编辑目标" }
    );

    const input = document.querySelector("#legacyGoalTitleInput");
    window.setTimeout(() => {
      input.focus();
      input.select();
    }, 250);

    document
      .querySelector("#saveLegacyGoalTitle")
      .addEventListener("click", () => {
        const title = input.value.trim();
        if (!title) {
          showToast("目标名称不能为空");
          input.focus();
          return;
        }
        goal.title = title;
        saveState();
        closeSheet();
        renderGoalList();
        refreshTasksView({ animate: false });
        showToast("目标名称已更新");
      });
  }

  function saveGoalChanges() {
    const goalId = editingGoalId;
    const goal = state.goals.find((item) => item.id === goalId);
    const plan = goalDraft?.plan;
    const title = goalDraft?.title.trim() || "";

    if (!goal || !plan) return;
    if (!title) {
      showToast("目标名称不能为空");
      document.querySelector("#editGoalTitleInput")?.focus();
      return;
    }

    const oldDayIds = new Set();
    forEachPlanDay(goal.plan, (day) => oldDayIds.add(day.id));

    const nodes = new Map();
    forEachPlanDay(plan, (day, week, month) => {
      let taskTitle = "";
      let note = "";
      if (month) {
        taskTitle = day.action || week.goal || month.goal || title;
        note = `目标「${title}」· ${month.label} · ${week.label}`;
      } else if (week) {
        taskTitle = day.action || week.goal || title;
        note = `目标「${title}」· ${week.label}`;
      } else {
        taskTitle = day.action || title;
        note = `目标「${title}」· ${day.label}`;
      }
      nodes.set(day.id, {
        title: taskTitle,
        note,
        date: day.date,
      });
    });

    const existingGoalTasks = state.tasks.filter(
      (task) => task.goalId === goal.id
    );
    const existingDayIds = new Set(
      existingGoalTasks.map((task) => task.planDayId).filter(Boolean)
    );

    state.tasks = state.tasks.filter((task) => {
      if (task.goalId !== goal.id) return true;
      if (task.planDayId && !nodes.has(task.planDayId)) return false;
      return true;
    });

    state.tasks.forEach((task) => {
      if (task.goalId !== goal.id || task.done) return;
      const node = nodes.get(task.planDayId);
      if (!node) return;
      task.title = node.title;
      task.note = node.note;
    });

    goal.listId = goalDraft.listId || goal.listId || defaultGoalListId();
    state.tasks.forEach((task) => {
      if (task.goalId === goal.id && !task.done) {
        task.listId = goal.listId;
      }
    });

    const newTasks = [];
    nodes.forEach((node, dayId) => {
      if (existingDayIds.has(dayId)) return;
      if (oldDayIds.has(dayId)) return;
      newTasks.push({
        id: uid("task"),
        title: node.title,
        note: node.note,
        date: node.date,
        listId: goal.listId || defaultGoalListId(),
        done: false,
        createdAt: Date.now() + newTasks.length,
        goalId: goal.id,
        planDayId: dayId,
      });
    });
    state.tasks.push(...newTasks);

    goal.title = title;
    goal.plan = plan;
    goal.endDate = plan.endDate;
    if (plan.weeks) goal.count = plan.weeks.length;
    else if (plan.months) goal.count = plan.months.length;
    else if (plan.days) goal.count = plan.days.length;
    goal.actionCount = nodes.size;

    saveState();
    closeFullPageTo("create");
    renderGoalList();
    refreshTasksView({ animate: false });
    showToast(
      newTasks.length
        ? `目标已更新，并新增 ${newTasks.length} 个行动`
        : "目标已更新，行动已同步"
    );
  }

  function openDeleteGoalConfirm(goalId) {
    const goal = state.goals.find((item) => item.id === goalId);
    if (!goal) return;
    const taskCount = state.tasks.filter((task) => task.goalId === goal.id).length;
    openSheet(
      `<div class="confirm-sheet">
        <div class="sheet-grab"></div>
        <div class="confirm-icon">${ICONS.trash}</div>
        <h2>删除这个目标？</h2>
        <p>「${esc(goal.title)}」以及它同步到任务清单的 ${taskCount} 个行动会移入回收站，5 秒内可撤销。</p>
        <div class="confirm-actions">
          <button class="btn-danger" type="button" id="confirmDeleteGoal">${ICONS.trash}<span>确认删除</span></button>
          <button class="confirm-cancel" type="button" data-close-sheet>先留着</button>
        </div>
      </div>`,
      { className: "sheet--action", label: "确认删除目标" }
    );

    document.querySelector("#confirmDeleteGoal").addEventListener("click", () => {
      const relatedTasks = state.tasks.filter((task) => task.goalId === goalId);
      const record = pushTrash({
        type: "goal",
        title: goal.title,
        item: goal,
        tasks: relatedTasks,
      });
      state.goals = state.goals.filter((item) => item.id !== goalId);
      state.tasks = state.tasks.filter((task) => task.goalId !== goalId);
      saveState();
      closeSheet();
      renderGoalList();
      refreshTasksView({ animate: false });
      showToast("目标已移入回收站", {
        undo: true,
        onUndo: () => restoreTrashEntry(record.id),
      });
    });
  }

  // ---------- Goal builder ----------
  function unitAmountText(count, unit) {
    return `${count} ${UNIT_CONFIG[unit].unitLabel}`;
  }

  function buildMonthPlan(title, startKey, monthCount) {
    const start = parseKey(startKey);
    const months = [];
    let weekCounter = 0;

    for (let monthOffset = 0; monthOffset < monthCount; monthOffset += 1) {
      const monthAnchor = new Date(
        start.getFullYear(),
        start.getMonth() + monthOffset,
        1,
        12
      );
      const monthStart =
        monthOffset === 0
          ? new Date(start)
          : new Date(monthAnchor.getFullYear(), monthAnchor.getMonth(), 1, 12);
      const monthEnd = endOfMonth(monthAnchor);
      const weeks = [];
      let cursor = new Date(monthStart);
      let weekNumber = 0;

      while (cursor <= monthEnd) {
        weekNumber += 1;
        const weekStart = new Date(cursor);
        const daysToSunday = (7 - weekStart.getDay()) % 7;
        const weekEnd = minDate(addDaysDate(weekStart, daysToSunday), monthEnd);
        const days = [];
        let dayCursor = new Date(weekStart);
        while (dayCursor <= weekEnd) {
          days.push({
            id: uid("day"),
            date: keyOf(dayCursor),
            label: `周${WEEKDAYS[dayCursor.getDay()]}`,
            action: "",
          });
          dayCursor = addDaysDate(dayCursor, 1);
        }
        weeks.push({
          id: uid("week"),
          label: `第 ${weekNumber} 周`,
          start: keyOf(weekStart),
          end: keyOf(weekEnd),
          days,
          goal: "",
        });
        weekCounter += 1;
        cursor = addDaysDate(weekEnd, 1);
      }

      const label =
        monthAnchor.getFullYear() !== start.getFullYear()
          ? `${monthAnchor.getFullYear()}年${monthAnchor.getMonth() + 1}月`
          : `${monthAnchor.getMonth() + 1}月`;

      months.push({
        id: uid("month"),
        label,
        start: keyOf(monthStart),
        end: keyOf(monthEnd),
        goal: title,
        weeks,
      });
    }

    const lastMonth = months[months.length - 1];
    return {
      months,
      startDate: startKey,
      endDate: lastMonth.end,
      weekCount: weekCounter,
      dayCount: months.reduce(
        (total, month) =>
          total +
          month.weeks.reduce((weekTotal, week) => weekTotal + week.days.length, 0),
        0
      ),
    };
  }

  function buildWeekPlan(title, startKey, weekCount) {
    const start = parseKey(startKey);
    const weeks = [];

    for (let weekIndex = 0; weekIndex < weekCount; weekIndex += 1) {
      const weekStart = addDaysDate(start, weekIndex * 7);
      const weekEnd = addDaysDate(weekStart, 6);
      const days = [];
      for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
        const day = addDaysDate(weekStart, dayIndex);
        days.push({
          id: uid("day"),
          date: keyOf(day),
          label: `周${WEEKDAYS[day.getDay()]}`,
          action: "",
        });
      }
      weeks.push({
        id: uid("week"),
        label: `第 ${weekIndex + 1} 周`,
        start: keyOf(weekStart),
        end: keyOf(weekEnd),
        days,
        goal: "",
      });
    }

    return {
      weeks,
      startDate: startKey,
      endDate: keyOf(addDaysDate(start, weekCount * 7 - 1)),
      weekCount,
      dayCount: weekCount * 7,
    };
  }

  function buildDayPlan(title, startKey, dayCount) {
    const start = parseKey(startKey);
    const days = [];
    for (let index = 0; index < dayCount; index += 1) {
      const day = addDaysDate(start, index);
      days.push({
        id: uid("day"),
        date: keyOf(day),
        label: `周${WEEKDAYS[day.getDay()]}`,
        action: "",
      });
    }
    return {
      days,
      startDate: startKey,
      endDate: keyOf(addDaysDate(start, dayCount - 1)),
      weekCount: 0,
      dayCount,
    };
  }

  function goalPreview(draft) {
    const startKey = draft.startDate || todayKey();
    const start = parseKey(startKey);
    const unit = draft.unit;
    if (unit === "month") {
      const plan =
        draft.plan ||
        buildMonthPlan(
          draft.title.trim() || "我的目标",
          startKey,
          draft.count
        );
      const endKey = plan.endDate;
      return {
        main: `${formatRange(startKey, endKey)} · 共 ${plan.dayCount} 天`,
        sub: `${draft.count} 个月 · ${plan.weekCount} 周 · ${plan.dayCount} 个每日行动`,
      };
    }
    if (unit === "week") {
      const end = addDaysDate(start, draft.count * 7 - 1);
      return {
        main: `${formatRange(startKey, keyOf(end))} · 共 ${draft.count * 7} 天`,
        sub: `${draft.count} 周 · ${draft.count * 7} 个每日行动`,
      };
    }
    const end = addDaysDate(start, draft.count - 1);
    return {
      main: `${formatRange(startKey, keyOf(end))} · 共 ${draft.count} 天`,
      sub: `${draft.count} 个每日行动`,
    };
  }

  function openGoalWizard() {
    editingGoalId = null;
    goalDraft = {
      title: "",
      unit: "week",
      count: 4,
      counts: { day: 7, week: 4, month: 3 },
      startDate: ui.selectedDate,
      color: state.goals.length % GOAL_COLORS.length,
      listId: defaultGoalListId(),
      plan: null,
    };
    openFullPage("page-goal", "create", renderGoalWizardStep1);
  }

  function wizardHeader(title, subtitle, progress, backButton = false) {
    return `<header class="wizard-head">
      ${
        backButton
          ? `<button class="icon-button--bare wizard-close-back" type="button" id="wizardBack" aria-label="返回">${ICONS.arrowLeft}</button>`
          : `<button class="icon-button--bare wizard-close-back" type="button" data-close-fullpage aria-label="返回">${ICONS.arrowLeft}</button>`
      }
      <div class="wizard-head-center">
        <strong>${title}</strong>
        <small>${subtitle}</small>
      </div>
      ${
        backButton
          ? `<button class="icon-button--bare" type="button" data-close-fullpage aria-label="关闭">${ICONS.close}</button>`
          : "<span></span>"
      }
    </header>
    <div class="wizard-progress"><i style="width:${progress}%"></i></div>`;
  }

  function renderAmountArea() {
    const config = UNIT_CONFIG[goalDraft.unit];
    return `<div class="amount-chips">
        ${config.presets
          .map(
            (amount) =>
              `<button class="amount-chip ${
                amount === goalDraft.count ? "is-active" : ""
              }" type="button" data-amount="${amount}">${amount} ${config.unitLabel}</button>`
          )
          .join("")}
      </div>
      <div class="amount-stepper">
        <div class="amount-stepper-label">自定义 <b>${goalDraft.count}</b> ${
          config.unitLabel
        }</div>
        <div class="stepper-controls">
          <button class="stepper-btn" type="button" data-step="-1" aria-label="减少" ${
            goalDraft.count <= config.min ? "disabled" : ""
          }>−</button>
          <button class="stepper-btn" type="button" data-step="1" aria-label="增加" ${
            goalDraft.count >= config.max ? "disabled" : ""
          }>+</button>
        </div>
      </div>`;
  }

  function bindAmountArea() {
    const area = document.querySelector("#amountArea");
    if (!area) return;
    area.querySelectorAll("[data-amount]").forEach((button) => {
      button.addEventListener("click", () => {
        setGoalDraftCount(Number(button.dataset.amount));
      });
    });
    area.querySelectorAll("[data-step]").forEach((button) => {
      button.addEventListener("click", () => {
        setGoalDraftCount(goalDraft.count + Number(button.dataset.step));
      });
    });
  }

  function setGoalDraftCount(nextCount) {
    const config = UNIT_CONFIG[goalDraft.unit];
    goalDraft.count = clamp(nextCount, config.min, config.max);
    goalDraft.counts[goalDraft.unit] = goalDraft.count;
    goalDraft.plan = null;
    const area = document.querySelector("#amountArea");
    if (area) {
      area.innerHTML = renderAmountArea();
      bindAmountArea();
    }
    refreshWizardPreview();
  }

  function refreshWizardPreview() {
    const preview = goalPreview(goalDraft);
    const previewMain = document.querySelector("#previewMain");
    const previewSub = document.querySelector("#previewSub");
    if (previewMain) previewMain.textContent = preview.main;
    if (previewSub) previewSub.textContent = preview.sub;
  }

  function updateWizardPrimary() {
    const button = document.querySelector("#wizardPrimary");
    if (!button) return;
    const hasTitle = Boolean(goalDraft.title.trim());
    button.disabled = !hasTitle;
    button.innerHTML = `继续，拆解任务 ${ICONS.arrowRight}`;
    const footerNote = document.querySelector("#wizardFooterNote");
    if (footerNote) {
      footerNote.textContent =
        goalDraft.unit === "month"
          ? "下一步编辑每月目标、每周目标和每日行动"
          : goalDraft.unit === "week"
          ? "下一步编辑每周目标和每日行动"
          : "下一步编辑每一天的具体行动";
    }
  }

  function renderGoalWizardStep1() {
    const preview = goalPreview(goalDraft);
    const ideas = ["读完 12 本书", "跑完半程马拉松", "连续早起 30 天"];

    goalPage.innerHTML = `<div class="wizard">
      ${wizardHeader("新建目标", "CREATE A GOAL", 50)}
      <div class="wizard-scroll">
        <p class="wizard-kicker">01 · 命名</p>
        <h2 class="wizard-question">你想完成什么？</h2>
        <div class="goal-name-field">
          <input id="goalTitleInput" type="text" maxlength="40" autocomplete="off"
            placeholder="例如：读完 12 本书" value="${esc(goalDraft.title)}">
          <span class="char-count"><span id="goalCharCount">${goalDraft.title.length}</span>/40</span>
        </div>
        <div class="idea-chips">
          ${ideas
            .map(
              (idea) =>
                `<button class="idea-chip" type="button" data-idea="${esc(idea)}">${idea}</button>`
            )
            .join("")}
        </div>

        <section class="wizard-block">
          <div class="wizard-kicker">02 · 周期</div>
          <div class="segmented" id="unitSegment">
            <button type="button" data-unit="day" class="${
              goalDraft.unit === "day" ? "is-active" : ""
            }">按天</button>
            <button type="button" data-unit="week" class="${
              goalDraft.unit === "week" ? "is-active" : ""
            }">按周</button>
            <button type="button" data-unit="month" class="${
              goalDraft.unit === "month" ? "is-active" : ""
            }">按月</button>
          </div>
          <div class="amount-panel" id="amountArea">${renderAmountArea()}</div>
        </section>

        <section class="wizard-block">
          <div class="wizard-kicker">03 · 清单</div>
          <div class="list-picker" id="goalListPicker">
            ${state.lists
              .map(
                (list) =>
                  `<button class="list-choice ${
                    list.id === goalDraft.listId ? "is-selected" : ""
                  }" type="button" data-list-id="${list.id}" ${listChoiceStyle(
                    list
                  )}><span class="list-dot"></span><span>${esc(
                    list.name
                  )}</span></button>`
              )
              .join("")}
          </div>
        </section>

        <section class="wizard-block">
          <div class="wizard-kicker">04 · 起点</div>
          <button class="date-field date-field--button" type="button" id="goalDateTrigger" aria-expanded="false">
            ${ICONS.calendar}
            <span>开始日期</span>
            <strong id="goalDateDisplay">${calendarDateLabel(goalDraft.startDate)}</strong>
            <span class="date-trigger-chevron">${ICONS.chevronDown}</span>
          </button>
        </section>

        <div class="range-preview">
          <div class="range-preview-top">${ICONS.sparkle}<span>时间预览</span></div>
          <div class="range-preview-main" id="previewMain">${preview.main}</div>
          <div class="range-preview-sub" id="previewSub">${preview.sub}</div>
        </div>
      </div>
      <footer class="wizard-footer">
        <button class="btn-primary" type="button" id="wizardPrimary" ${
          goalDraft.title.trim() ? "" : "disabled"
        }>继续，拆解任务 ${ICONS.arrowRight}</button>
        <p class="wizard-footer-note" id="wizardFooterNote">${
          goalDraft.unit === "month"
            ? "下一步编辑每月目标、每周目标和每日行动"
            : goalDraft.unit === "week"
            ? "下一步编辑每周目标和每日行动"
            : "下一步编辑每一天的具体行动"
        }</p>
      </footer>
    </div>`;

    bindAmountArea();

    const titleInput = document.querySelector("#goalTitleInput");
    const charCount = document.querySelector("#goalCharCount");
    titleInput.addEventListener("input", () => {
      if (titleInput.value !== goalDraft.title) goalDraft.plan = null;
      goalDraft.title = titleInput.value;
      charCount.textContent = String(titleInput.value.length);
      updateWizardPrimary();
    });
    if (window.matchMedia("(pointer: fine)").matches) {
      window.setTimeout(() => titleInput.focus(), 280);
    }

    document.querySelectorAll("[data-idea]").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.idea !== goalDraft.title) goalDraft.plan = null;
        titleInput.value = button.dataset.idea;
        goalDraft.title = button.dataset.idea;
        charCount.textContent = String(button.dataset.idea.length);
        updateWizardPrimary();
      });
    });

    goalPage.querySelectorAll("[data-unit]").forEach((button) => {
      button.addEventListener("click", () => {
        const nextUnit = button.dataset.unit;
        if (nextUnit === goalDraft.unit) return;
        goalDraft.counts[goalDraft.unit] = goalDraft.count;
        goalDraft.unit = nextUnit;
        goalDraft.count =
          goalDraft.counts[nextUnit] || UNIT_CONFIG[nextUnit].presets[0];
        goalDraft.plan = null;
        goalPage.querySelectorAll("[data-unit]").forEach((unitButton) => {
          unitButton.classList.toggle(
            "is-active",
            unitButton.dataset.unit === nextUnit
          );
        });
        const amountArea = document.querySelector("#amountArea");
        amountArea.innerHTML = renderAmountArea();
        bindAmountArea();
        refreshWizardPreview();
        updateWizardPrimary();
      });
    });

    const goalDateTrigger = document.querySelector("#goalDateTrigger");
    const goalDateDisplay = document.querySelector("#goalDateDisplay");
    const goalListPicker = document.querySelector("#goalListPicker");

    goalListPicker.addEventListener("click", (event) => {
      const button = event.target.closest("[data-list-id]");
      if (!button) return;
      goalDraft.listId = button.dataset.listId;
      goalListPicker.querySelectorAll("[data-list-id]").forEach((listButton) => {
        listButton.classList.toggle(
          "is-selected",
          listButton.dataset.listId === goalDraft.listId
        );
      });
    });

    goalDateTrigger.addEventListener("click", () => {
      openCalendarPicker(
        goalDraft.startDate,
        (key) => {
          goalDraft.startDate = key;
          goalDraft.plan = null;
          goalDateDisplay.textContent = calendarDateLabel(key);
          refreshWizardPreview();
        },
        goalDateTrigger,
        "选择目标开始日期"
      );
    });

    document.querySelector("#wizardPrimary").addEventListener("click", () => {
      goalDraft.title = titleInput.value.trim();
      if (!goalDraft.title) {
        titleInput.focus();
        return;
      }
      renderGoalWizardStep2();
    });

    updateWizardPrimary();
    goalPage.scrollTo({ top: 0, behavior: "auto" });
  }

  function planDayFieldHTML(day, placeholder) {
    const shortDate = formatShortDate(day.date)
      .replace("月", "/")
      .replace("日", "");
    return `<label class="day-field">
      <span>${day.label} <b>${shortDate}</b></span>
      <input type="text" data-day-id="${day.id}" value="${esc(
        day.action
      )}" placeholder="${placeholder}" maxlength="80">
    </label>`;
  }

  function weekPanelHTML(week, open, fallbackLabel) {
    const placeholder =
      fallbackLabel === "沿用本月目标"
        ? "留空则沿用本月目标"
        : "留空则沿用目标名称";
    return `<details class="week-panel" ${open ? "open" : ""}>
      <summary>
        <span class="week-summary-main">
          <b>${esc(week.label)}</b>
          <span>${formatShortDate(week.start)} – ${formatShortDate(
            week.end
          )} · ${week.days.length}天</span>
        </span>
        <span class="week-summary-goal" data-week-preview="${week.id}">${
          week.goal ? esc(week.goal) : fallbackLabel
        }</span>
        <span>${ICONS.chevronDown}</span>
      </summary>
      <div class="week-panel-body">
        <label class="plan-field-label" for="week-${week.id}">本周目标 <span>可选</span></label>
        <input class="plan-input" id="week-${week.id}" data-week-id="${
          week.id
        }" value="${esc(week.goal)}" placeholder="${placeholder}">
        <div class="day-grid">
          ${week.days
            .map((day) =>
              planDayFieldHTML(day, "每日行动（留空沿用本周目标）")
            )
            .join("")}
        </div>
      </div>
    </details>`;
  }

  function collectWeekFromSheet(week) {
    const weekInput = goalPage.querySelector(`[data-week-id="${week.id}"]`);
    if (weekInput) week.goal = weekInput.value.trim();
    week.days.forEach((day) => {
      const dayInput = goalPage.querySelector(`[data-day-id="${day.id}"]`);
      if (dayInput) day.action = dayInput.value.trim();
    });
  }

  function collectPlanFromSheet(plan) {
    if (plan.months) {
      plan.months.forEach((month) => {
        const monthInput = goalPage.querySelector(`[data-month-id="${month.id}"]`);
        if (monthInput) month.goal = monthInput.value.trim();
        month.weeks.forEach(collectWeekFromSheet);
      });
    }
    if (plan.weeks) {
      plan.weeks.forEach(collectWeekFromSheet);
    }
    if (plan.days) {
      plan.days.forEach((day) => {
        const dayInput = goalPage.querySelector(`[data-day-id="${day.id}"]`);
        if (dayInput) day.action = dayInput.value.trim();
      });
    }
    return plan;
  }

  function renderGoalWizardStep2(options = {}) {
    goalDraft.title = goalDraft.title.trim();
    const isEditing = Boolean(editingGoalId);
    const shouldFocusTitle = isEditing && options.focusTitle === true;
    if (!goalDraft.plan) {
      if (goalDraft.unit === "month") {
        goalDraft.plan = buildMonthPlan(
          goalDraft.title,
          goalDraft.startDate,
          goalDraft.count
        );
      } else if (goalDraft.unit === "week") {
        goalDraft.plan = buildWeekPlan(
          goalDraft.title,
          goalDraft.startDate,
          goalDraft.count
        );
      } else {
        goalDraft.plan = buildDayPlan(
          goalDraft.title,
          goalDraft.startDate,
          goalDraft.count
        );
      }
    }

    const plan = goalDraft.plan;
    let plannerHTML = "";
    let tipText = "";
    let sectionLabel = "逐层拆解";
    let sectionHint = "点击展开 · 都可编辑";

    if (goalDraft.unit === "month") {
      const monthsHTML = plan.months
        .map((month, monthIndex) => {
          return `<details class="month-panel" ${monthIndex === 0 ? "open" : ""}>
            <summary>
              <span class="month-index">M${monthIndex + 1}</span>
              <span class="month-summary-copy">
                <strong>${esc(month.label)}</strong>
                <span>${formatRange(month.start, month.end)} · ${month.weeks.length} 周</span>
              </span>
              <span class="month-summary-chevron">${ICONS.chevronDown}</span>
            </summary>
            <div class="month-panel-body">
              <label class="plan-field-label" for="month-${month.id}">本月目标 <span>编辑这一层</span></label>
              <input class="plan-input" id="month-${month.id}" data-month-id="${
                month.id
              }" value="${esc(month.goal)}" placeholder="这个月想推进到哪里？">
              <div class="week-stack">
                ${month.weeks
                  .map((week, weekIndex) =>
                    weekPanelHTML(
                      week,
                      monthIndex === 0 && weekIndex === 0,
                      "沿用本月目标"
                    )
                  )
                  .join("")}
              </div>
            </div>
          </details>`;
        })
        .join("");
      plannerHTML = `<div class="month-stack">${monthsHTML}</div>`;
      tipText =
        "先从「本月目标」开始。每周、每日留空时会自动沿用上一层的目标，之后也可以单独修改。";
    } else if (goalDraft.unit === "week") {
      const weeksHTML = plan.weeks
        .map((week, weekIndex) =>
          weekPanelHTML(week, weekIndex === 0, "沿用目标名称")
        )
        .join("");
      plannerHTML = `<section class="planner-card">
        <div class="planner-card-head">
          <div>
            <strong>每周目标</strong>
            <span>先定一周方向，再落到每天</span>
          </div>
          <span class="planner-card-count">${plan.weekCount} 周</span>
        </div>
        <div class="week-stack">${weeksHTML}</div>
      </section>`;
      tipText =
        "先写每周目标，再展开一周填写每日行动。留空时会自动沿用目标名称，之后也可以单独修改。";
      sectionLabel = "每周拆解";
      sectionHint = "每周 7 天";
    } else {
      const daysHTML = plan.days
        .map((day) => planDayFieldHTML(day, "写下一个具体行动"))
        .join("");
      plannerHTML = `<section class="planner-card">
        <div class="planner-card-head">
          <div>
            <strong>每日行动</strong>
            <span>写下今天能完成的一小步</span>
          </div>
          <span class="planner-card-count">${plan.dayCount} 天</span>
        </div>
        <div class="day-grid day-grid--planner">${daysHTML}</div>
      </section>`;
      tipText = "为每一天写下一个具体、能完成的行动。留空时会自动沿用目标名称。";
      sectionLabel = "每日拆解";
      sectionHint = "共 " + plan.dayCount + " 天";
    }

    const heroStats = [];
    if (plan.months) {
      heroStats.push(
        `<span class="plan-hero-stat"><b>${plan.months.length}</b> 个月</span>`
      );
    }
    if (plan.weekCount) {
      heroStats.push(
        `<span class="plan-hero-stat"><b>${plan.weekCount}</b> 周</span>`
      );
    }
    heroStats.push(
      `<span class="plan-hero-stat"><b>${plan.dayCount}</b> 个行动</span>`
    );

    goalPage.innerHTML = `<div class="wizard">
      ${
        isEditing
          ? wizardHeader("编辑目标", "EDIT YOUR GOAL", 100, false)
          : wizardHeader("编辑任务拆解", "BUILD YOUR PLAN", 100, true)
      }
      <div class="wizard-scroll">
        <div class="plan-hero">
          <p class="eyebrow">YOUR BLUEPRINT</p>
          ${
            isEditing
              ? `<input class="plan-hero-edit-title" id="editGoalTitleInput" type="text" maxlength="40"
                  value="${esc(goalDraft.title)}" aria-label="目标名称" placeholder="目标名称">`
              : `<h2>${esc(goalDraft.title)}</h2>`
          }
          <p>${formatRange(plan.startDate, plan.endDate)}</p>
          <div class="plan-hero-stats">${heroStats.join("")}</div>
          ${
            isEditing && goalDraft.unit === "week"
              ? `<div class="plan-duration-edit">
                  <span class="plan-duration-label">总周数</span>
                  <div class="plan-duration-controls">
                    <button type="button" data-week-count="-1" aria-label="减少一周" ${
                      plan.weeks.length <= 1 ? "disabled" : ""
                    }>−</button>
                    <b>${plan.weeks.length} 周</b>
                    <button type="button" data-week-count="1" aria-label="增加一周" ${
                      plan.weeks.length >= 52 ? "disabled" : ""
                    }>+</button>
                  </div>
                </div>`
              : ""
          }
        </div>
        ${
          isEditing
            ? `<div class="edit-list-block">
                <span class="edit-list-label">清单</span>
                <div class="list-picker" id="editGoalListPicker">
                  ${state.lists
                    .map(
                      (list) =>
                        `<button class="list-choice ${
                          list.id === goalDraft.listId ? "is-selected" : ""
                        }" type="button" data-list-id="${
                          list.id
                        }" ${listChoiceStyle(list)}><span class="list-dot"></span><span>${esc(
                          list.name
                        )}</span></button>`
                    )
                    .join("")}
                </div>
              </div>`
            : ""
        }
        <div class="plan-tip">
          ${ICONS.info}
          <span>${tipText}</span>
        </div>
        <div class="plan-section-label">
          <span>${sectionLabel}</span>
          <span>${sectionHint}</span>
        </div>
        ${plannerHTML}
      </div>
      <footer class="wizard-footer">
        <div class="plan-footer-summary">${
          isEditing
            ? "保存后会更新未完成的每日行动"
            : `将同步 <b>${plan.dayCount}</b> 个每日行动到任务清单`
        }</div>
        <button class="btn-primary" type="button" id="${
          isEditing ? "saveGoalEdits" : "createGoalFromPlan"
        }">${isEditing ? "保存修改" : "完成编辑并同步"} ${ICONS.arrowRight}</button>
      </footer>
    </div>`;

    if (isEditing) {
      const editTitleInput = document.querySelector("#editGoalTitleInput");
      editTitleInput?.addEventListener("input", () => {
        goalDraft.title = editTitleInput.value;
      });
      const editGoalListPicker = document.querySelector("#editGoalListPicker");
      editGoalListPicker?.addEventListener("click", (event) => {
        const button = event.target.closest("[data-list-id]");
        if (!button) return;
        goalDraft.listId = button.dataset.listId;
        editGoalListPicker.querySelectorAll("[data-list-id]").forEach((listButton) => {
          listButton.classList.toggle(
            "is-selected",
            listButton.dataset.listId === goalDraft.listId
          );
        });
      });
      if (shouldFocusTitle) {
        window.setTimeout(() => {
          editTitleInput?.focus();
          editTitleInput?.select();
        }, 220);
      }
      document
        .querySelector("#saveGoalEdits")
        .addEventListener("click", () => {
          if (editTitleInput) goalDraft.title = editTitleInput.value;
          collectPlanFromSheet(goalDraft.plan);
          saveGoalChanges();
        });

      if (goalDraft.unit === "week") {
        goalPage.querySelectorAll("[data-week-count]").forEach((button) => {
          button.addEventListener("click", () => {
            collectPlanFromSheet(goalDraft.plan);
            const currentCount = goalDraft.plan.weeks.length;
            const nextCount = clamp(
              currentCount + Number(button.dataset.weekCount),
              1,
              52
            );
            if (nextCount === currentCount) return;
            const scrollTop = goalPage.scrollTop;
            resizeWeekPlan(goalDraft.plan, nextCount);
            goalDraft.count = nextCount;
            renderGoalWizardStep2();
            requestAnimationFrame(() => {
              goalPage.scrollTop = scrollTop;
            });
          });
        });
      }
    } else {
      document.querySelector("#wizardBack").addEventListener("click", () => {
        collectPlanFromSheet(goalDraft.plan);
        renderGoalWizardStep1();
      });
      document
        .querySelector("#createGoalFromPlan")
        .addEventListener("click", () => {
          collectPlanFromSheet(goalDraft.plan);
          createGoalFromPlan();
        });
    }

    document.querySelectorAll("[data-week-id]").forEach((input) => {
      input.addEventListener("input", () => {
        const preview = document.querySelector(
          `[data-week-preview="${input.dataset.weekId}"]`
        );
        if (preview) {
          preview.textContent =
            input.value.trim() ||
            (goalDraft.unit === "month" ? "沿用本月目标" : "沿用目标名称");
        }
      });
    });
    goalPage.scrollTo({ top: 0, behavior: "auto" });
  }

  function addSyncedTasks(goal, specs) {
    const now = Date.now();
    const tasks = specs.map((spec, index) => ({
      id: uid("task"),
      title: spec.title,
      note: spec.note || "",
      date: spec.date,
      listId: goal.listId || defaultGoalListId(),
      done: false,
      createdAt: now + index,
      goalId: goal.id,
      planDayId: spec.planDayId || null,
    }));
    goal.actionCount = tasks.length;
    state.goals.unshift(goal);
    state.tasks.push(...tasks);
    saveState();
    updateDateStripDots();
  }

  function finishGoalCreation(goal, specs) {
    addSyncedTasks(goal, specs);
    closeFullPageTo("create");
    showToast(
      specs.length
        ? `拆解完成，已同步 ${specs.length} 个每日行动`
        : "目标已创建"
    );
  }

  function createGoalFromPlan() {
    const plan = goalDraft.plan;
    const title = goalDraft.title.trim();
    if (!plan || !title) return;

    const goal = {
      id: uid("goal"),
      title,
      unit: goalDraft.unit,
      count: goalDraft.count,
      startDate: goalDraft.startDate,
      endDate: plan.endDate,
      color: goalDraft.color,
      listId: goalDraft.listId || defaultGoalListId(),
      createdAt: Date.now(),
      plan,
      actionCount: plan.dayCount,
    };
    const specs = [];

    if (plan.months) {
      plan.months.forEach((month) => {
        month.weeks.forEach((week) => {
          week.days.forEach((day) => {
            specs.push({
              title: day.action || week.goal || month.goal || title,
              date: day.date,
              note: `目标「${title}」· ${month.label} · ${week.label}`,
              planDayId: day.id,
            });
          });
        });
      });
    } else if (plan.weeks) {
      plan.weeks.forEach((week) => {
        week.days.forEach((day) => {
          specs.push({
            title: day.action || week.goal || title,
            date: day.date,
            note: `目标「${title}」· ${week.label}`,
            planDayId: day.id,
          });
        });
      });
    } else if (plan.days) {
      plan.days.forEach((day) => {
        specs.push({
          title: day.action || title,
          date: day.date,
          note: `目标「${title}」· ${day.label}`,
          planDayId: day.id,
        });
      });
    }

    finishGoalCreation(goal, specs);
  }

  function getListUsage(listId) {
    return {
      tasks: state.tasks.filter((task) => task.listId === listId).length,
      goals: state.goals.filter((goal) => goal.listId === listId).length,
      habits: state.habits.filter((habit) => habit.listId === listId).length,
    };
  }

  function renderListManagerPage() {
    if (!listManagerContent) return;
    const query = (ui.listQuery || "").trim().toLowerCase();
    const addListButton = document.querySelector("#addListPageBtn");
    if (addListButton) addListButton.hidden = Boolean(query);
    if (query) {
      const tasks = state.tasks
        .filter(
          (task) =>
            task.title.toLowerCase().includes(query) ||
            (task.note || "").toLowerCase().includes(query)
        )
        .sort(
          (a, b) =>
            a.date.localeCompare(b.date) ||
            Number(a.done) - Number(b.done) ||
            (a.createdAt || 0) - (b.createdAt || 0)
        );
      if (!tasks.length) {
        listManagerContent.innerHTML = `<div class="list-search-empty">没有匹配的待办任务</div>`;
        return;
      }
      const allSelected =
        tasks.length > 0 && tasks.every((task) => ui.searchSelected.has(task.id));
      listManagerContent.innerHTML = `<div class="list-search-toolbar">
        <button type="button" id="listSearchSelectAll">${allSelected ? "取消全选" : "全选"}</button>
        <button type="button" id="listSearchDeleteSelected" ${ui.searchSelected.size ? "" : "disabled"}>删除所选${ui.searchSelected.size ? ` (${ui.searchSelected.size})` : ""}</button>
      </div>` + tasks
        .map((task) => {
          const list = getList(task.listId);
          const color = listColorOption(list.color);
          const selected = ui.searchSelected.has(task.id);
          return `<div class="list-manage-row list-task-result ${task.done ? "is-done" : ""} ${selected ? "is-selected" : ""}">
            <button class="search-select-box ${selected ? "is-selected" : ""}" type="button" data-search-select="${task.id}" aria-label="${selected ? "取消选择" : "选择"}任务 ${esc(task.title)}" aria-pressed="${selected}">${selected ? ICONS.check : ""}</button>
            <button class="list-manage-main" type="button" data-list-task-open="${task.id}">
              <span class="list-manage-dot" style="background:${color.color}"></span>
              <span class="list-manage-copy">
                <strong>${esc(task.title)}</strong>
                <small>${esc(list.name)} · ${formatShortDate(task.date)}${
                  task.done ? " · 已完成" : ""
                }</small>
              </span>
            </button>
            ${
              task.done
                ? ""
                : `<button class="list-manage-edit-button" type="button" data-list-task-edit="${task.id}" aria-label="编辑任务 ${esc(task.title)}">${ICONS.pen}</button>`
            }
            <button class="list-manage-delete" type="button" data-list-task-delete="${task.id}" aria-label="删除任务 ${esc(task.title)}">${ICONS.trash}</button>
          </div>`;
        })
        .join("");
      listManagerContent.querySelector("#listSearchSelectAll")?.addEventListener("click", () => {
        if (allSelected) {
          tasks.forEach((task) => ui.searchSelected.delete(task.id));
        } else {
          tasks.forEach((task) => ui.searchSelected.add(task.id));
        }
        renderListManagerPage();
      });
      listManagerContent.querySelector("#listSearchDeleteSelected")?.addEventListener("click", () => {
        openDeleteSearchTasksConfirm();
      });
      listManagerContent.querySelectorAll("[data-search-select]").forEach((button) => {
        button.addEventListener("click", () => {
          const taskId = button.dataset.searchSelect;
          if (ui.searchSelected.has(taskId)) ui.searchSelected.delete(taskId);
          else ui.searchSelected.add(taskId);
          renderListManagerPage();
        });
      });
      listManagerContent.querySelectorAll("[data-list-task-open]").forEach((button) => {
        button.addEventListener("click", () => {
          openSearchResult("task", button.dataset.listTaskOpen);
        });
      });
      listManagerContent.querySelectorAll("[data-list-task-edit]").forEach((button) => {
        button.addEventListener("click", () => {
          openTaskForm(button.dataset.listTaskEdit);
        });
      });
      listManagerContent.querySelectorAll("[data-list-task-delete]").forEach((button) => {
        button.addEventListener("click", (event) => {
          event.stopPropagation();
          ui.searchSelected.delete(button.dataset.listTaskDelete);
          openDeleteTaskConfirm(button.dataset.listTaskDelete);
        });
      });
      return;
    }
    const lists = state.lists;
    if (!lists.length) {
      listManagerContent.innerHTML = `<div class="list-search-empty">没有匹配的清单</div>`;
      return;
    }
    listManagerContent.innerHTML = lists
      .map((list) => {
        const color = listColorOption(list.color);
        const usage = getListUsage(list.id);
        return `<div class="list-manage-row">
          <button class="list-manage-main" type="button" data-list-open="${list.id}">
            <span class="list-manage-dot" style="background:${color.color}"></span>
            <span class="list-manage-copy">
              <strong>${esc(list.name)}</strong>
              <small>${usage.tasks} 个任务 · ${usage.goals} 个目标</small>
            </span>
          </button>
          <button class="list-manage-edit-button" type="button" data-list-edit="${list.id}" aria-label="编辑清单 ${esc(list.name)}">${ICONS.pen}</button>
          ${
            state.lists.length > 1
              ? `<button class="list-manage-delete" type="button" data-list-delete="${list.id}" aria-label="删除清单 ${esc(
                  list.name
                )}">${ICONS.trash}</button>`
              : ""
          }
        </div>`;
      })
      .join("");

    listManagerContent.querySelectorAll("[data-list-open]").forEach((button) => {
      button.addEventListener("click", () => {
        openListDetail(button.dataset.listOpen);
      });
    });
    listManagerContent
      .querySelectorAll("[data-list-edit]")
      .forEach((button) => {
        button.addEventListener("click", () => {
          openListEditor(button.dataset.listEdit);
        });
      });
    listManagerContent
      .querySelectorAll("[data-list-delete]")
      .forEach((button) => {
        button.addEventListener("click", (event) => {
          event.stopPropagation();
          const list = state.lists.find(
            (item) => item.id === button.dataset.listDelete
          );
          if (list) openDeleteListConfirm(list);
        });
      });
  }

  function openListManager() {
    if (listsPage.hidden) resetListSearch();
    renderListManagerPage();
    if (!overlay.hidden) closeSheet();
    showSubPage("page-lists", "profile");
  }

  function resetListSearch() {
    ui.listQuery = "";
    ui.searchSelected.clear();
    if (listSearchInput) listSearchInput.value = "";
    if (clearListSearch) clearListSearch.hidden = true;
    const addListButton = document.querySelector("#addListPageBtn");
    if (addListButton) addListButton.hidden = false;
  }

  function renderListDetailPage() {
    const list = state.lists.find((item) => item.id === ui.activeListId);
    if (!list) return;
    const tasks = state.tasks
      .filter((task) => task.listId === list.id)
      .sort(
        (a, b) =>
          a.date.localeCompare(b.date) ||
          Number(a.done) - Number(b.done) ||
          (a.createdAt || 0) - (b.createdAt || 0)
      );
    listDetailTitle.textContent = list.name;
    listDetailIntro.textContent = `${tasks.length} 个任务 · 可勾选后批量删除`;
    const selected = ui.listSelected;
    listDetailContent.innerHTML = tasks.length
      ? tasks
          .map(
            (task) => `<div class="list-detail-task ${task.done ? "is-done" : ""}">
              <label class="list-detail-select">
                <input type="checkbox" data-list-task-select="${task.id}" ${selected.has(task.id) ? "checked" : ""}>
                <span></span>
              </label>
              <div class="list-detail-task-main">
                <strong>${esc(task.title)}</strong>
                <small>${formatShortDate(task.date)}${task.done ? " · 已完成" : ""}</small>
                ${task.subtasks?.length ? `<div class="list-detail-subtasks">${task.subtasks.map((item) => `<span class="${item.done ? "is-done" : ""}">${item.done ? "✓" : "○"} ${esc(item.title)}</span>`).join("")}</div>` : ""}
              </div>
            </div>`
          )
          .join("")
      : `<div class="list-detail-empty">这个清单还没有任务。</div>`;
    const allSelected = tasks.length > 0 && tasks.every((task) => selected.has(task.id));
    listSelectAll.textContent = allSelected ? "取消全选" : "全选";
    listDeleteSelected.disabled = selected.size === 0;
    listDeleteSelected.textContent = selected.size
      ? `删除所选 (${selected.size})`
      : "删除所选";
  }

  function openListDetail(listId) {
    const list = state.lists.find((item) => item.id === listId);
    if (!list) return;
    ui.activeListId = listId;
    ui.listSelected = new Set();
    renderListDetailPage();
    showSubPage("page-list-detail", "profile");
  }

  function openDeleteListTasksConfirm() {
    const ids = [...ui.listSelected];
    if (!ids.length) return;
    openSheet(
      `<div class="confirm-sheet">
        <div class="sheet-grab"></div>
        <div class="confirm-icon">${ICONS.trash}</div>
        <h2>删除 ${ids.length} 个任务？</h2>
        <p>这些任务会移入回收站，5 秒内可撤销。</p>
        <div class="confirm-actions">
          <button class="btn-danger" type="button" id="confirmDeleteListTasks">${ICONS.trash}<span>确认删除</span></button>
          <button class="confirm-cancel" type="button" data-close-sheet>取消</button>
        </div>
      </div>`,
      { className: "sheet--action", label: "确认批量删除任务" }
    );
    document.querySelector("#confirmDeleteListTasks").addEventListener("click", () => {
      const removed = state.tasks.filter((task) => ids.includes(task.id));
      removed.forEach((task) => {
        if (task.habitId) {
          state.habitSkips = [
            ...(state.habitSkips || []),
            habitSkipKey(task.habitId, task.date),
          ];
        }
      });
      const record = pushTrash({
        type: "tasks",
        title: `${removed.length} 个任务`,
        tasks: removed,
      });
      state.tasks = state.tasks.filter((task) => !ids.includes(task.id));
      ui.listSelected = new Set();
      if (ui.expandedTaskId && ids.includes(ui.expandedTaskId)) {
        ui.expandedTaskId = null;
      }
      saveState();
      closeSheet();
      renderListDetailPage();
      renderListManagerPage();
      refreshTasksView({ animate: false });
      showToast(`已将 ${ids.length} 个任务移入回收站`, {
        undo: true,
        onUndo: () => restoreTrashEntry(record.id),
      });
    });
  }

  function openDeleteSearchTasksConfirm() {
    const ids = [...ui.searchSelected].filter((id) =>
      state.tasks.some((task) => task.id === id)
    );
    if (!ids.length) return;
    openSheet(
      `<div class="confirm-sheet">
        <div class="sheet-grab"></div>
        <div class="confirm-icon">${ICONS.trash}</div>
        <h2>删除所选 ${ids.length} 个任务？</h2>
        <p>这些任务会移入回收站，5 秒内可撤销。</p>
        <div class="confirm-actions">
          <button class="btn-danger" type="button" id="confirmDeleteSearchTasks">${ICONS.trash}<span>确认删除</span></button>
          <button class="confirm-cancel" type="button" data-close-sheet>取消</button>
        </div>
      </div>`,
      { className: "sheet--action", label: "确认批量删除搜索结果" }
    );
    document.querySelector("#confirmDeleteSearchTasks").addEventListener("click", () => {
      const removed = state.tasks.filter((task) => ids.includes(task.id));
      removed.forEach((task) => {
        if (task.habitId) {
          state.habitSkips = [
            ...(state.habitSkips || []),
            habitSkipKey(task.habitId, task.date),
          ];
        }
      });
      const record = pushTrash({
        type: "tasks",
        title: `${removed.length} 个任务`,
        tasks: removed,
      });
      state.tasks = state.tasks.filter((task) => !ids.includes(task.id));
      ui.searchSelected.clear();
      saveState();
      closeSheet();
      renderListManagerPage();
      refreshTasksView({ animate: false });
      showToast(`已将 ${ids.length} 个任务移入回收站`, {
        undo: true,
        onUndo: () => restoreTrashEntry(record.id),
      });
    });
  }

  listDetailBack.addEventListener("click", () => {
    closePageTo("page-lists", "profile");
  });
  listSelectAll.addEventListener("click", () => {
    const tasks = state.tasks.filter(
      (task) => task.listId === ui.activeListId
    );
    const all = tasks.length > 0 && tasks.every((task) => ui.listSelected.has(task.id));
    ui.listSelected = new Set(all ? [] : tasks.map((task) => task.id));
    renderListDetailPage();
  });
  listDeleteSelected.addEventListener("click", openDeleteListTasksConfirm);
  listDetailContent.addEventListener("change", (event) => {
    const input = event.target.closest("[data-list-task-select]");
    if (!input) return;
    const id = input.dataset.listTaskSelect;
    if (input.checked) ui.listSelected.add(id);
    else ui.listSelected.delete(id);
    renderListDetailPage();
  });

  function openListEditor(listId = null) {
    const existing = listId
      ? state.lists.find((list) => list.id === listId)
      : null;
    let selectedColor =
      existing?.color ||
      LIST_COLOR_KEYS[state.lists.length % LIST_COLOR_KEYS.length];

    openSheet(
      `<div class="form-sheet">
        <div class="sheet-grab"></div>
        <header class="sheet-head">
          <button class="round-close" type="button" data-close-sheet aria-label="关闭">${ICONS.close}</button>
          <h2>${existing ? "编辑清单" : "新建清单"}</h2>
          <button class="head-action" type="button" id="saveListAction">保存</button>
        </header>
        <div class="sheet-body">
          <div class="task-form-title">
            <label class="tag-picker-label" for="listNameInput">清单名称</label>
            <input class="list-name-input" id="listNameInput" type="text" maxlength="16"
              value="${esc(existing?.name || "")}" placeholder="给清单起个名字">
          </div>
          <div class="list-color-block">
            <p class="tag-picker-label">清单颜色</p>
            <div class="color-picker" id="colorPicker">
              ${LIST_COLOR_KEYS.map(
                (colorId) =>
                  `<button class="color-choice ${
                    colorId === selectedColor ? "is-selected" : ""
                  }" type="button" data-color-id="${colorId}" aria-label="${
                    LIST_COLOR_OPTIONS[colorId].label
                  }色" style="--swatch:${LIST_COLOR_OPTIONS[colorId].color}"></button>`
              ).join("")}
            </div>
          </div>
          ${
            existing && state.lists.length > 1
              ? `<button class="btn-danger" type="button" id="deleteListBtn" style="margin-top:22px">${ICONS.trash}<span>删除清单</span></button>`
              : ""
          }
        </div>
      </div>`,
      { className: "sheet--form", label: existing ? "编辑清单" : "新建清单" }
    );

    const nameInput = document.querySelector("#listNameInput");
    const colorPicker = document.querySelector("#colorPicker");
    window.setTimeout(() => {
      nameInput.focus();
      nameInput.setSelectionRange(nameInput.value.length, nameInput.value.length);
    }, 240);

    colorPicker.addEventListener("pointerdown", (event) => {
      if (event.target.closest("[data-color-id]")) event.preventDefault();
    });
    colorPicker.addEventListener("mousedown", (event) => {
      if (event.target.closest("[data-color-id]")) event.preventDefault();
    });

    colorPicker.addEventListener("click", (event) => {
      const button = event.target.closest("[data-color-id]");
      if (!button) return;
      selectedColor = button.dataset.colorId;
      colorPicker.querySelectorAll("[data-color-id]").forEach((choice) => {
        choice.classList.toggle(
          "is-selected",
          choice.dataset.colorId === selectedColor
        );
      });
      if (document.activeElement !== nameInput) {
        nameInput.focus({ preventScroll: true });
      }
    });

    document.querySelector("#saveListAction").addEventListener("click", () => {
      const name = nameInput.value.trim();
      if (!name) {
        showToast("清单名称不能为空");
        nameInput.focus();
        return;
      }
      if (
        state.lists.some(
          (list) =>
            list.name === name && (!existing || list.id !== existing.id)
        )
      ) {
        showToast("已经有同名清单了");
        nameInput.focus();
        return;
      }

      if (existing) {
        existing.name = name;
        existing.color = selectedColor;
      } else {
        state.lists.push({
          id: uid("list"),
          name,
          color: selectedColor,
        });
      }
      saveState();
      refreshTasksView({ animate: false });
      renderGoalList();
      openListManager();
      showToast(existing ? "清单已更新" : "清单已创建");
    });

    const deleteButton = document.querySelector("#deleteListBtn");
    if (deleteButton) {
      deleteButton.addEventListener("click", () => {
        openDeleteListConfirm(existing);
      });
    }
  }

  function openDeleteListConfirm(list) {
    const fallback = state.lists.find((item) => item.id !== list.id);
    if (!fallback) {
      showToast("至少保留一个清单");
      return;
    }
    const usage = getListUsage(list.id);

    openSheet(
      `<div class="confirm-sheet">
        <div class="sheet-grab"></div>
        <div class="confirm-icon">${ICONS.trash}</div>
        <h2>删除「${esc(list.name)}」？</h2>
        <p>这个清单下的 ${
          usage.tasks
        } 个任务、${usage.goals} 个目标${
          usage.habits ? `和 ${usage.habits} 个习惯` : ""
        }会移动到「${esc(fallback.name)}」。清单会进入回收站，5 秒内可撤销。</p>
        <div class="confirm-actions">
          <button class="btn-danger" type="button" id="confirmDeleteList">${ICONS.trash}<span>删除并移动</span></button>
          <button class="confirm-cancel" type="button" data-close-sheet>取消</button>
        </div>
      </div>`,
      { className: "sheet--action", label: "确认删除清单" }
    );

    document.querySelector("#confirmDeleteList").addEventListener("click", () => {
      state.tasks.forEach((task) => {
        if (task.listId === list.id) task.listId = fallback.id;
      });
      state.goals.forEach((goal) => {
        if (goal.listId === list.id) goal.listId = fallback.id;
      });
      state.habits.forEach((habit) => {
        if (habit.listId === list.id) habit.listId = fallback.id;
      });
      const record = pushTrash({
        type: "list",
        title: list.name,
        item: list,
      });
      state.lists = state.lists.filter((item) => item.id !== list.id);
      saveState();
      refreshTasksView({ animate: false });
      renderGoalList();
      openListManager();
      showToast("清单已删除并移入回收站", {
        undo: true,
        onUndo: () => restoreTrashEntry(record.id),
      });
    });
  }

  function goalStatsRows() {
    return state.goals.map((goal) => ({ goal, ...getGoalStats(goal) }));
  }

  function goalStatsRowsHTML(goalRows) {
    if (!goalRows.length) {
      return `<div class="stats-empty">还没有创建目标，去「创造」里添加一个吧。</div>`;
    }
    return goalRows
      .map(({ goal, tasks, percent }) => {
        const color = listColorOption(getList(goal.listId).color);
        return `<div class="stats-goal-row">
          <div class="stats-goal-head">
            <span class="list-manage-dot" style="background:${color.color}"></span>
            <span>${esc(goal.title)}</span>
            <b>${percent}%</b>
          </div>
          <div class="stats-goal-track"><i style="width:${percent}%"></i></div>
          <small>${tasks.filter((task) => task.done).length}/${tasks.length} 个行动 · ${formatRange(
            goal.startDate,
            goal.endDate
          )}${goal.paused ? " · 已暂停" : ""}</small>
        </div>`;
      })
      .join("");
  }

  function getHabitStats() {
    ensureHabitTasks(todayKey());
    const today = todayKey();
    const todayTasks = state.tasks.filter(
      (task) => task.habitId && task.date === today
    );
    const done = todayTasks.filter((task) => task.done).length;
    const habits = state.habits
      .filter((habit) => habitMatchesDate(habit, today))
      .map((habit) => {
      const task = habitTaskFor(habit.id, today);
      const repeat = habitRepeat(habit);
      const countMode =
        ["weekly", "monthly"].includes(repeat.type) && repeat.mode === "count";
      const periodDone = countMode
        ? habitPeriodDone(habit.id, today, repeat.type)
        : 0;
      const target = habitTarget(habit);
      const periodLabel = repeat.type === "monthly" ? "本月" : "本周";
      let status = "今天待完成";
      if (task?.done) status = "今天已完成";
      else if (task) status = "今天待完成";
      else if (countMode && periodDone >= target) status = `${periodLabel}已完成`;
      else if (!habitMatchesDate(habit, today)) status = "今天不重复";
      return {
        habit,
        task,
        repeat,
        countMode,
        periodDone,
        target,
        periodLabel,
        status,
        streak: habitStreak(habit.id),
        color: listColorOption(habit.color || stableHabitColor(habit.id)),
      };
    });
    return {
      total: todayTasks.length,
      done,
      percent: percentOf(done, todayTasks.length),
      habits,
    };
  }

  function openStatsPage(returnTab = "profile") {
    ensureHabitTasks(todayKey());
    const today = todayKey();
    const todayTasks = state.tasks.filter((task) => task.date === today);
    const todayDone = todayTasks.filter((task) => task.done).length;
    const todayPercent = percentOf(todayDone, todayTasks.length);

    const weekStart = startOfWeekKey(today);
    const weekEnd = addDaysKey(weekStart, 6);
    const weekTasks = state.tasks.filter(
      (task) => task.date >= weekStart && task.date <= weekEnd
    );
    const weekDone = weekTasks.filter((task) => task.done).length;
    const weekPercent = percentOf(weekDone, weekTasks.length);

    const goalRows = goalStatsRows();
    const goalPercent = goalRows.length
      ? Math.round(
          goalRows.reduce((total, item) => total + item.percent, 0) /
            goalRows.length
        )
      : 0;
    const completedGoals = goalRows.filter(
      (item) => item.tasks.length > 0 && item.percent === 100
    ).length;
    const habitStats = getHabitStats();

    const days = [];
    for (let offset = 6; offset >= 0; offset -= 1) {
      const key = addDaysKey(today, -offset);
      const tasks = state.tasks.filter((task) => task.date === key);
      const done = tasks.filter((task) => task.done).length;
      const date = parseKey(key);
      days.push({
        key,
        label: offset === 0 ? "今天" : `周${WEEKDAYS[date.getDay()]}`,
        day: date.getDate(),
        percent: percentOf(done, tasks.length),
      });
    }

    statsPage.innerHTML = `<div class="wizard">
        ${wizardHeader("统计", "INSIGHTS", 100, false)}
        <div class="wizard-scroll">
          <div class="stats-hero">
            <div class="stats-ring" style="--stat:${todayPercent}">
              <div><b>${todayPercent}%</b><span>今日</span></div>
            </div>
            <div class="stats-hero-copy">
              <p class="eyebrow">日完成度</p>
              <h2>${todayDone}/${todayTasks.length} 已完成</h2>
              <p>${
                todayTasks.length
                  ? "每完成一件，今天就轻一点。"
                  : "今天还没有安排任务。"
              }</p>
            </div>
          </div>

          <div class="stats-cards">
            <button class="stats-card" type="button" data-stats-detail="week">
              <span>本周完成度</span>
              <strong>${weekPercent}%</strong>
              <p>${weekDone}/${weekTasks.length} 个任务</p>
              <div class="stats-card-track"><i style="width:${weekPercent}%"></i></div>
              <small>${formatShortDate(weekStart)} – ${formatShortDate(weekEnd)}</small>
            </button>
            <button class="stats-card" type="button" data-stats-detail="goals">
              <span>目标完成度</span>
              <strong>${goalPercent}%</strong>
              <p>${completedGoals}/${goalRows.length} 个目标完成</p>
              <div class="stats-card-track"><i style="width:${goalPercent}%"></i></div>
              <small>所有进行中的目标</small>
            </button>
            <button class="stats-card stats-card--habit" type="button" data-stats-detail="habits">
              <span>习惯完成度</span>
              <strong>${habitStats.percent}%</strong>
              <p>${habitStats.done}/${habitStats.total} 个今日习惯任务完成</p>
              <div class="stats-card-track"><i style="width:${habitStats.percent}%"></i></div>
              <small>${habitStats.habits.length} 个习惯</small>
            </button>
          </div>

          <div class="stats-section-head"><span>最近 7 天</span><small>完成度</small></div>
          <div class="stats-bars">
            ${days
              .map(
                (day) => `<div class="stats-bar-col">
                  <div class="stats-bar-track"><i style="height:${Math.max(
                    4,
                    day.percent
                  )}%; opacity:${day.percent ? 1 : 0.22}"></i></div>
                  <b>${day.percent}%</b>
                  <span>${day.label}</span>
                  <small>${day.day}</small>
                </div>`
              )
              .join("")}
          </div>
        </div>
      </div>`;

    statsPage.dataset.returnTab = returnTab;
    statsPage.querySelectorAll("[data-stats-detail]").forEach((button) => {
      button.addEventListener("click", () => {
        openStatsDetail(button.dataset.statsDetail);
      });
    });
    openFullPage("page-stats", returnTab);
  }

  function openStatsDetail(type) {
    ensureHabitTasks(todayKey());
    const today = todayKey();
    statsDetailPage.dataset.returnTab = "stats";
    let title = "统计详情";
    let eyebrow = "DETAIL";
    let body = "";

    if (type === "week") {
      title = "本周完成度";
      eyebrow = "THIS WEEK";
      const weekStart = startOfWeekKey(today);
      const weekEnd = addDaysKey(weekStart, 6);
      const weekTasks = state.tasks.filter(
        (task) => task.date >= weekStart && task.date <= weekEnd
      );
      const weekDone = weekTasks.filter((task) => task.done).length;
      const weekPercent = percentOf(weekDone, weekTasks.length);
      const rows = [];
      for (let offset = 0; offset < 7; offset += 1) {
        const key = addDaysKey(weekStart, offset);
        const tasks = state.tasks.filter((task) => task.date === key);
        const done = tasks.filter((task) => task.done).length;
        const percent = percentOf(done, tasks.length);
        rows.push(
          `<div class="stats-detail-row">
            <div class="stats-detail-row-head"><b>${formatShortDate(key)}</b><span>${done}/${tasks.length}</span></div>
            <div class="stats-detail-track"><i style="width:${percent}%"></i></div>
          </div>`
        );
      }
      body = `<div class="stats-detail-summary">
          <strong>${weekPercent}%</strong>
          <span>${weekDone}/${weekTasks.length} 个任务完成</span>
          <small>${formatShortDate(weekStart)} – ${formatShortDate(weekEnd)}</small>
        </div>
        <div class="stats-detail-list">${rows.join("")}</div>`;
    } else if (type === "goals") {
      title = "目标完成度";
      eyebrow = "GOALS";
      const goalRows = goalStatsRows();
      const goalPercent = goalRows.length
        ? Math.round(
            goalRows.reduce((total, item) => total + item.percent, 0) /
              goalRows.length
          )
        : 0;
      const completed = goalRows.filter(
        (item) => item.tasks.length > 0 && item.percent === 100
      ).length;
      body = `<div class="stats-detail-summary">
          <strong>${goalPercent}%</strong>
          <span>${completed}/${goalRows.length} 个目标完成</span>
          <small>所有目标</small>
        </div>
        <div class="stats-goal-list">${goalStatsRowsHTML(goalRows)}</div>`;
    } else {
      title = "每日习惯完成度";
      eyebrow = "HABITS";
      const habitStats = getHabitStats();
      body = `<div class="stats-detail-summary">
          <strong>${habitStats.percent}%</strong>
          <span>${habitStats.done}/${habitStats.total} 个今日习惯任务完成</span>
          <small>${habitStats.habits.length} 个习惯</small>
        </div>
        ${
          habitStats.habits.length
            ? `<div class="stats-habit-list">${habitStats.habits
                .map(
                  (item) => `<div class="stats-habit-row">
                    <span class="habit-state" style="color:${item.color.color};background:${item.color.bg}">${
                      item.task?.done ? ICONS.check : ICONS.sun
                    }</span>
                    <div class="stats-habit-copy">
                      <strong>${esc(item.habit.title)}</strong>
                      <small>${habitRepeatLabel(item.habit)} · ${item.status}${
                        item.streak > 0 ? ` · 连续 ${item.streak} 天` : ""
                      }${item.countMode ? ` · ${item.periodLabel} ${item.periodDone}/${item.target}` : ""}</small>
                    </div>
                  </div>`
                )
                .join("")}</div>`
            : `<div class="stats-empty">${
                state.habits.length
                  ? "今天没有需要重复的习惯"
                  : "还没有每日习惯，去创造页添加一个吧。"
              }</div>`
        }`;
    }

    statsDetailPage.innerHTML = `<div class="wizard">
      ${wizardHeader(title, eyebrow, 100, false)}
      <div class="wizard-scroll stats-detail-content">${body}</div>
    </div>`;
    openFullPage("page-stats-detail", "profile");
  }

  async function exportData() {
    const payload = {
      app: "qinglist",
      version: 1,
      exportedAt: new Date().toISOString(),
      lists: state.lists,
      tasks: state.tasks,
      goals: state.goals,
      habits: state.habits,
      habitSkips: state.habitSkips,
      settings: state.settings,
      trash: state.trash,
    };
    const json = JSON.stringify(payload, null, 2);
    const fileName = `qinglist-backup-${todayKey()}.json`;

    if (isNativeApp()) {
      const { Filesystem, Share } = nativePlugins();
      if (Filesystem && Share) {
        try {
          await Filesystem.writeFile({
            path: fileName,
            data: json,
            directory: "CACHE",
            encoding: "utf8",
          });
          const { uri } = await Filesystem.getUri({
            path: fileName,
            directory: "CACHE",
          });
          await Share.share({
            title: "轻清单备份",
            text: "轻清单数据备份",
            url: uri,
            dialogTitle: "保存或分享备份",
          });
          showToast("备份已生成");
          return;
        } catch (error) {
          console.warn("原生导出失败，尝试浏览器下载。", error);
        }
      }
    }

    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1200);
    showToast("备份已导出");
  }

  function openImportConfirm(imported) {
    openSheet(
      `<div class="confirm-sheet">
        <div class="sheet-grab"></div>
        <div class="confirm-icon confirm-icon--import">${ICONS.upload}</div>
        <h2>导入这份备份？</h2>
        <p>备份包含 ${imported.tasks.length} 个任务、${
        imported.goals.length
      } 个目标和 ${
        imported.lists.length
      } 个清单。导入后会替换当前数据，这个操作不能撤销。</p>
        <div class="confirm-actions">
          <button class="btn-primary" type="button" id="confirmImportData">导入并替换</button>
          <button class="confirm-cancel" type="button" data-close-sheet>取消</button>
        </div>
      </div>`,
      { className: "sheet--action", label: "确认导入数据" }
    );

    document.querySelector("#confirmImportData").addEventListener("click", () => {
      state.tasks = imported.tasks;
      state.goals = imported.goals;
      state.habits = imported.habits;
      state.habitSkips = imported.habitSkips;
      state.lists = imported.lists;
      state.settings = imported.settings;
      saveState();
      closeSheet();
      window.location.reload();
    });
  }

  function handleImportFile(file) {
    if (!file) return;
    file
      .text()
      .then((text) => {
        const parsed = JSON.parse(text);
        if (
          !parsed ||
          !Array.isArray(parsed.tasks) ||
          !Array.isArray(parsed.goals)
        ) {
          throw new Error("invalid");
        }
        const imported = normalizeStateData(parsed);
        openImportConfirm(imported);
      })
      .catch(() => {
        showToast("导入失败：文件格式不正确");
      });
  }

  function sampleTaskCount() {
    return state.tasks.filter(isSampleTask).length;
  }

  function openClearSamplesConfirm() {
    const count = sampleTaskCount();
    if (!count) {
      showToast("当前没有示例任务");
      return;
    }
    openSheet(
      `<div class="confirm-sheet">
        <div class="sheet-grab"></div>
        <div class="confirm-icon">${ICONS.trash}</div>
        <h2>清空示例任务？</h2>
        <p>将删除 ${count} 条示例任务，真实任务、目标、习惯和清单不会受影响。此操作不能撤销。</p>
        <div class="confirm-actions">
          <button class="btn-danger" type="button" id="confirmClearSamples">${ICONS.trash}<span>确认清空</span></button>
          <button class="confirm-cancel" type="button" data-close-sheet>取消</button>
        </div>
      </div>`,
      { className: "sheet--action", label: "确认清空示例任务" }
    );
    document.querySelector("#confirmClearSamples").addEventListener("click", () => {
      const sampleHabitIds = new Set(
        state.habits.filter((habit) => habit.isSample === true).map((habit) => habit.id)
      );
      state.tasks = state.tasks.filter((task) => !isSampleTask(task));
      state.goals = state.goals.filter((goal) => goal.isSample !== true);
      state.habits = state.habits.filter((habit) => habit.isSample !== true);
      state.habitSkips = (state.habitSkips || []).filter(
        (key) => ![...sampleHabitIds].some((id) => key.startsWith(`${id}:`))
      );
      saveState();
      closeSheet();
      ui.expandedTaskId = null;
      refreshTasksView({ animate: false });
      renderGoalList();
      renderHabitList();
      if (!dataPage.hidden) openDataPage();
      showToast("示例任务已清空");
    });
  }

  function openDataPage() {
    const samples = sampleTaskCount();
    dataPage.innerHTML = `<div class="wizard">
        ${wizardHeader("数据", "DATA", 100, false)}
        <div class="wizard-scroll">
          <div class="data-summary">
            <b>${state.tasks.length}</b> 个任务
            <span>·</span>
            <b>${state.goals.length}</b> 个目标
            <span>·</span>
            <b>${state.lists.length}</b> 个清单
          </div>
          <div class="data-actions">
            <button class="data-action" type="button" id="exportDataBtn">
              <span class="data-action-icon data-action-icon--export">${ICONS.download}</span>
              <span class="data-action-copy"><strong>导出备份</strong><small>保存为 JSON 文件</small></span>
              ${ICONS.chevron}
            </button>
            <button class="data-action" type="button" id="importDataBtn">
              <span class="data-action-icon data-action-icon--import">${ICONS.upload}</span>
              <span class="data-action-copy"><strong>导入备份</strong><small>用 JSON 文件恢复数据</small></span>
              ${ICONS.chevron}
            </button>
            <button class="data-action" type="button" id="dataArchiveBtn">
              <span class="data-action-icon data-action-icon--archive">${ICONS.archive || ICONS.flag}</span>
              <span class="data-action-copy"><strong>已归档</strong><small>${state.goals.filter((goal) => goal.paused).length} 个暂停目标</small></span>
              ${ICONS.chevron}
            </button>
            <button class="data-action" type="button" id="dataTrashBtn">
              <span class="data-action-icon data-action-icon--trash">${ICONS.trash}</span>
              <span class="data-action-copy"><strong>回收站</strong><small>${(state.trash || []).length} 项删除记录</small></span>
              ${ICONS.chevron}
            </button>
            <input type="file" id="importDataInput" accept=".json,application/json" hidden>
          </div>
          <div class="data-sample-card">
            <div>
              <strong>示例任务</strong>
              <span>${samples ? `当前有 ${samples} 条首次启动示例` : "当前没有示例任务"}</span>
            </div>
            <button type="button" id="clearSamplesBtn" ${samples ? "" : "disabled"}>清空示例</button>
          </div>
          <p class="data-note">备份包含任务、目标、清单和完成记录。导入会替换当前数据。</p>
        </div>
      </div>`;

    document.querySelector("#exportDataBtn").addEventListener("click", exportData);
    document.querySelector("#importDataBtn").addEventListener("click", () => {
      document.querySelector("#importDataInput").click();
    });
    document
      .querySelector("#importDataInput")
      .addEventListener("change", (event) => {
        const input = event.target;
        const file = input.files?.[0];
        handleImportFile(file);
        input.value = "";
      });
    document
      .querySelector("#clearSamplesBtn")
      .addEventListener("click", openClearSamplesConfirm);
    document.querySelector("#dataArchiveBtn").addEventListener("click", openArchivePage);
    document.querySelector("#dataTrashBtn").addEventListener("click", openTrashPage);
    openFullPage("page-data", "profile");
  }

  function renderProfileMenuHints() {
    const archived = state.goals.filter((goal) => goal.paused).length;
    const trash = (state.trash || []).length;
    const archiveHint = document.querySelector("#archiveMenuHint");
    const trashHint = document.querySelector("#trashMenuHint");
    if (archiveHint) {
      archiveHint.textContent = archived
        ? `${archived} 个暂停的目标`
        : "暂停的目标会放在这里";
    }
    if (trashHint) {
      trashHint.textContent = trash ? `${trash} 项删除记录` : "删除的项目会保留在这里";
    }
  }

  function openArchivePage() {
    const goals = state.goals.filter((goal) => goal.paused);
    archivePage.innerHTML = `<div class="wizard">
        ${wizardHeader("已归档", "ARCHIVE", 100, false)}
        <div class="wizard-scroll">
          <p class="archive-intro">暂停的目标会离开「创造」页，放在这里保留进度和拆解。</p>
          ${
            goals.length
              ? `<div class="archive-list">${goals
                  .map(
                    (goal) => `<div class="archive-row" data-archived-goal="${goal.id}">
                      <span class="archive-icon" style="${goalColorStyle(goal.color || 0)}">${
                        GOAL_ICONS[goal.unit] || ICONS.flag
                      }</span>
                      <div class="archive-copy">
                        <strong>${esc(goal.title)}</strong>
                        <span>${formatRange(goal.startDate, goal.endDate)} · 已暂停</span>
                      </div>
                      <button type="button" data-archive-restore="${goal.id}">继续</button>
                    </div>`
                  )
                  .join("")}</div>`
              : `<div class="archive-empty">${ICONS.archive || ICONS.flag}<strong>没有已归档目标</strong><span>暂停的目标会出现在这里。</span></div>`
          }
        </div>
      </div>`;
    archivePage.querySelectorAll("[data-archive-restore]").forEach((button) => {
      button.addEventListener("click", () => {
        const goal = state.goals.find((item) => item.id === button.dataset.archiveRestore);
        if (!goal) return;
        goal.paused = false;
        saveState();
        renderGoalList();
        renderProfileMenuHints();
        openArchivePage();
        showToast("目标已恢复");
      });
    });
    archivePage.dataset.returnTab = "data";
    openFullPage("page-archive", "data");
  }

  function trashTypeLabel(type) {
    return (
      {
        task: "任务",
        tasks: "批量任务",
        goal: "目标",
        habit: "习惯",
        list: "清单",
      }[type] || "项目"
    );
  }

  function openTrashPage() {
    const trash = state.trash || [];
    trashPage.innerHTML = `<div class="wizard">
        ${wizardHeader("回收站", "TRASH", 100, false)}
        <div class="wizard-scroll">
          <p class="archive-intro">删除的任务、目标、习惯和清单会保留在这里，可以随时恢复。</p>
          ${
            trash.length
              ? `<div class="trash-card">
                  <div class="trash-head">
                    <div><strong>${trash.length} 项删除记录</strong><span>永久删除后无法恢复</span></div>
                    <button type="button" id="clearTrashBtn">清空</button>
                  </div>
                  <div class="trash-list">
                    ${trash
                      .map(
                        (entry) => `<div class="trash-row">
                          <div class="trash-row-copy">
                            <strong>${esc(entry.title || entry.item?.name || "未命名")}</strong>
                            <span>${trashTypeLabel(entry.type)} · ${formatShortDate(
                              keyOf(new Date(entry.deletedAt || Date.now()))
                            )}</span>
                          </div>
                          <button type="button" data-trash-restore="${entry.id}">恢复</button>
                          <button class="trash-purge" type="button" data-trash-purge="${entry.id}">永久删除</button>
                        </div>`
                      )
                      .join("")}
                  </div>
                </div>`
              : `<div class="archive-empty">${ICONS.trash}<strong>回收站是空的</strong><span>删除的项目会出现在这里。</span></div>`
          }
        </div>
      </div>`;

    document.querySelector("#clearTrashBtn")?.addEventListener("click", () => {
      openSheet(
        `<div class="confirm-sheet">
          <div class="sheet-grab"></div>
          <div class="confirm-icon">${ICONS.trash}</div>
          <h2>清空回收站？</h2>
          <p>回收站里的所有项目会被永久删除，无法恢复。</p>
          <div class="confirm-actions">
            <button class="btn-danger" type="button" id="confirmClearTrash">${ICONS.trash}<span>确认清空</span></button>
            <button class="confirm-cancel" type="button" data-close-sheet>取消</button>
          </div>
        </div>`,
        { className: "sheet--action", label: "清空回收站" }
      );
      document.querySelector("#confirmClearTrash").addEventListener("click", () => {
        state.trash = [];
        saveState();
        closeSheet();
        renderProfileMenuHints();
        openTrashPage();
        showToast("回收站已清空");
      });
    });
    trashPage.querySelectorAll("[data-trash-restore]").forEach((button) => {
      button.addEventListener("click", () => {
        restoreTrashEntry(button.dataset.trashRestore);
        openTrashPage();
        renderProfileMenuHints();
      });
    });
    trashPage.querySelectorAll("[data-trash-purge]").forEach((button) => {
      button.addEventListener("click", () => {
        const record = (state.trash || []).find(
          (entry) => entry.id === button.dataset.trashPurge
        );
        if (!record) return;
        openSheet(
          `<div class="confirm-sheet">
            <div class="sheet-grab"></div>
            <div class="confirm-icon">${ICONS.trash}</div>
            <h2>永久删除？</h2>
            <p>「${esc(record.title || "这个项目")}」将从回收站永久移除，无法恢复。</p>
            <div class="confirm-actions">
              <button class="btn-danger" type="button" id="confirmPurgeTrash">${ICONS.trash}<span>永久删除</span></button>
              <button class="confirm-cancel" type="button" data-close-sheet>取消</button>
            </div>
          </div>`,
          { className: "sheet--action", label: "永久删除" }
        );
        document.querySelector("#confirmPurgeTrash").addEventListener("click", () => {
          purgeTrashEntry(record.id);
          closeSheet();
          renderProfileMenuHints();
          openTrashPage();
          showToast("已永久删除");
        });
      });
    });
    trashPage.dataset.returnTab = "data";
    openFullPage("page-trash", "data");
  }

  function openGuidePage() {
    guidePage.dataset.returnTab = "settings";
    guidePage.innerHTML = `<div class="wizard">
      ${wizardHeader("使用说明", "GUIDE", 100, false)}
      <div class="wizard-scroll guide-content">
        <p class="guide-lead">轻清单是一款离线优先的任务、目标和每日习惯管理工具。所有数据保存在本机，不需要登录。</p>

        <section class="guide-section">
          <h2>快速开始</h2>
          <p>底部有三个主页面：</p>
          <ul>
            <li><b>任务</b>：按日期查看和完成待办</li>
            <li><b>创造</b>：创建目标和每日习惯</li>
            <li><b>我的</b>：统计、清单、数据和设置</li>
          </ul>
          <p>三个主页面可以直接左右滑动切换。</p>
        </section>

        <section class="guide-section">
          <h2>任务</h2>
          <ul>
            <li>顶部日期条左右滑动选择日期，圆点表示当天有任务。</li>
            <li>点击「添加任务」输入标题、备注、日期和清单。</li>
            <li>点击任务卡可以原地展开详情和子任务。</li>
            <li>子任务全部完成后，母任务会自动完成。</li>
            <li>长按任务右侧三点可以拖动排序。</li>
            <li>逾期任务会单独显示，可以单条或一键顺延到今天。</li>
            <li>删除任务会进入回收站，并在底部提供 5 秒撤销。</li>
          </ul>
        </section>

        <section class="guide-section">
          <h2>目标</h2>
          <ul>
            <li>目标支持按天、周、月创建，可选择开始日期和周期。</li>
            <li>系统会把目标拆成每日行动，并同步到任务清单。</li>
            <li>点击目标卡片的日历图标可以修改目标颜色。</li>
            <li>点击「查看拆解」查看每周或每天的行动。</li>
            <li>目标菜单支持编辑、暂停、追赶未完成行动和删除。</li>
            <li>暂停的目标会进入「数据 → 已归档」，不会占用创造页空间。</li>
            <li>追赶会把逾期未完成的行动重新排期。</li>
          </ul>
        </section>

        <section class="guide-section">
          <h2>每日习惯</h2>
          <ul>
            <li>从创造页进入「每日习惯」。</li>
            <li>习惯支持每天、每周和每月重复。</li>
            <li>每周可以固定星期，也可以设置每周完成次数。</li>
            <li>每月可以选择具体日期，也可以设置每月完成次数。</li>
            <li>选择每月后，「选择每月日期」会打开月历弹窗。</li>
            <li>月历弹窗中可以切换「按每月次数」并选择次数。</li>
            <li>达到每周或每月次数后，后续未完成习惯任务会自动清理。</li>
            <li>点击太阳图标可以修改习惯颜色。</li>
          </ul>
        </section>

        <section class="guide-section">
          <h2>清单与搜索</h2>
          <ul>
            <li>清单支持新建、改名、改色和删除。</li>
            <li>清单页顶部搜索框搜索的是待办任务，不是清单名称。</li>
            <li>搜索结果可以直接编辑或删除任务。</li>
            <li>「我的」页面顶部还有全局搜索，可搜索任务、目标、习惯和清单。</li>
          </ul>
        </section>

        <section class="guide-section">
          <h2>数据、归档与回收站</h2>
          <ul>
            <li>数据页支持导出 JSON 备份和导入恢复。</li>
            <li>导入会替换当前数据，建议先导出备份。</li>
            <li>已归档页面保存暂停的目标。</li>
            <li>回收站保存删除的任务、目标、习惯和清单，可恢复或永久删除。</li>
            <li>清空回收站后无法恢复。</li>
          </ul>
        </section>

        <section class="guide-section">
          <h2>手势与外观</h2>
          <ul>
            <li>日期条可以左右拖动。</li>
            <li>日期选择日历可以左右滑动切换月份。</li>
            <li>任务三点长按拖动排序。</li>
            <li>页面已禁用双指缩放，避免误触。</li>
            <li>设置中可以调整字体大小、深色模式和子任务开关。</li>
            <li>深色模式默认跟随系统，也可以手动切换。</li>
          </ul>
        </section>

        <section class="guide-section">
          <h2>注意事项</h2>
          <ul>
            <li>卸载应用或清除应用数据会丢失本地内容。</li>
            <li>重要数据请定期导出 JSON 备份。</li>
            <li>Android 覆盖安装不会清除应用数据。</li>
          </ul>
        </section>
      </div>
    </div>`;
    openFullPage("page-guide", "profile");
  }

  function openSettingsPage() {
    const currentScale = state.settings?.fontScale ?? FONT_SCALE_DEFAULT;
    const darkNow = effectiveThemeIsDark();
    const themeMode = state.settings?.themeMode || "system";

    settingsPage.innerHTML = `<div class="wizard">
        ${wizardHeader("设置", "SETTINGS", 100, false)}
        <div class="wizard-scroll">
          <div class="settings-section-label">字体大小</div>
          <div class="font-preview">
            <strong>把目标拆成今天</strong>
            <span>轻清单 · 2026 · Aa 123</span>
          </div>
          <div class="font-size-options">
            ${FONT_SCALE_OPTIONS.map(
              (option) => `<button class="font-size-option ${
                option.value === currentScale ? "is-selected" : ""
              }" type="button" data-font-scale="${option.value}" aria-pressed="${
                option.value === currentScale
              }">
                <strong>${option.label}</strong>
                <small>${option.hint}</small>
              </button>`
            ).join("")}
          </div>
          <p class="font-note">默认使用「标准」。调整后会立即应用到任务、目标、清单、统计等全部页面。</p>
          <div class="settings-section-label" style="margin-top:22px">显示与行为</div>
          <div class="settings-toggle-list">
            <button class="settings-toggle-row" type="button" id="darkModeToggle" aria-pressed="${darkNow}">
              <span class="settings-toggle-copy"><strong>深色模式</strong><small>${themeMode === "system" ? "跟随系统" : themeMode === "dark" ? "已手动开启" : "已手动关闭"}</small></span>
              <span class="settings-switch ${darkNow ? "is-on" : ""}" aria-hidden="true"></span>
            </button>
            ${themeMode !== "system" ? `<button class="settings-system-reset" type="button" id="themeSystemReset">恢复跟随系统</button>` : ""}
            <button class="settings-toggle-row" type="button" id="subtasksToggle" aria-pressed="${state.settings.subtasksEnabled === true}">
              <span class="settings-toggle-copy"><strong>子任务</strong><small>在任务里添加可勾选的步骤</small></span>
              <span class="settings-switch ${state.settings.subtasksEnabled ? "is-on" : ""}" aria-hidden="true"></span>
            </button>
            <button class="settings-toggle-row" type="button" id="openGuideBtn">
              <span class="settings-toggle-copy"><strong>使用说明</strong><small>查看任务、目标、习惯和数据的完整说明</small></span>
              <span class="settings-toggle-chevron">${ICONS.chevron}</span>
            </button>
          </div>
          <div class="settings-about">轻清单 1.13.10</div>
        </div>
      </div>`;

    settingsPage.querySelectorAll("[data-font-scale]").forEach((button) => {
      button.addEventListener("click", () => {
        const nextScale = Number(button.dataset.fontScale);
        if (!FONT_SCALE_OPTIONS.some((option) => option.value === nextScale)) {
          return;
        }
        state.settings.fontScale = nextScale;
        state.settings.fontScaleRev = 2;
        saveState();
        applyFontScale();
        openSettingsPage();
      });
    });

    document.querySelector("#darkModeToggle").addEventListener("click", () => {
      state.settings.themeMode = effectiveThemeIsDark() ? "light" : "dark";
      state.settings.darkMode = state.settings.themeMode === "dark";
      saveState();
      applyTheme();
      openSettingsPage();
    });

    document
      .querySelector("#themeSystemReset")
      ?.addEventListener("click", () => {
        state.settings.themeMode = "system";
        state.settings.darkMode = false;
        saveState();
        applyTheme();
        openSettingsPage();
      });

    document
      .querySelector("#subtasksToggle")
      .addEventListener("click", () => {
        state.settings.subtasksEnabled =
          state.settings.subtasksEnabled !== true;
        saveState();
        openSettingsPage();
      });

    document
      .querySelector("#openGuideBtn")
      .addEventListener("click", openGuidePage);
    openFullPage("page-settings", "profile");
  }

  // ---------- Sheet / overlay ----------
  function openSheet(content, options = {}) {
    window.clearTimeout(sheetClosingTimer);
    window.clearTimeout(toastTimer);
    toast.classList.remove("is-showing");
    const wasOpen = !overlay.hidden && overlay.classList.contains("is-open");
    sheetOpenedAt = Date.now();
    overlay.hidden = false;
    overlay.classList.remove("is-closing");
    sheet.className = `sheet ${options.className || ""}`.trim();
    sheet.setAttribute("aria-label", options.label || "操作面板");
    sheet.innerHTML = content;
    document.body.classList.add("sheet-open");
    if (wasOpen) {
      overlay.classList.add("is-open");
    } else {
      overlay.classList.remove("is-open");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => overlay.classList.add("is-open"));
      });
    }
  }

  function closeSheet(options = {}) {
    closeCalendarPicker();
    cancelTaskMorph();
    if (overlay.hidden) return;
    if (options.immediate) {
      window.clearTimeout(sheetClosingTimer);
      overlay.hidden = true;
      overlay.classList.remove("is-open", "is-closing");
      sheet.innerHTML = "";
      sheet.className = "sheet";
      document.body.classList.remove("sheet-open");
      return;
    }
    overlay.classList.remove("is-open");
    overlay.classList.add("is-closing");
    window.clearTimeout(sheetClosingTimer);
    sheetClosingTimer = window.setTimeout(() => {
      overlay.hidden = true;
      overlay.classList.remove("is-closing");
      sheet.innerHTML = "";
      sheet.className = "sheet";
      document.body.classList.remove("sheet-open");
    }, 260);
  }

  // ---------- Trash / undo ----------
  function pushTrash(entry) {
    const record = {
      id: uid("trash"),
      deletedAt: Date.now(),
      ...entry,
    };
    state.trash = [record, ...(state.trash || [])].slice(0, 100);
    saveState();
    return record;
  }

  function removeTrashRecord(recordId) {
    state.trash = (state.trash || []).filter((entry) => entry.id !== recordId);
  }

  function restoreTasksFromTrash(tasks) {
    const restored = [];
    (tasks || []).forEach((task) => {
      const copy = { ...task };
      if (state.tasks.some((item) => item.id === copy.id)) {
        copy.id = uid("task");
      }
      state.tasks.push(copy);
      restored.push(copy);
    });
    return restored;
  }

  function undoRestoredTrash(record) {
    if (!record) return;
    const taskIds = new Set();
    if (record.type === "task" && record.item?.id) taskIds.add(record.item.id);
    (record.tasks || []).forEach((task) => {
      if (task.id) taskIds.add(task.id);
    });
    state.tasks = state.tasks.filter((task) => !taskIds.has(task.id));
    if (record.type === "goal") {
      state.goals = state.goals.filter((goal) => goal.id !== record.item.id);
    }
    if (record.type === "habit") {
      state.habits = state.habits.filter((habit) => habit.id !== record.item.id);
      state.habitSkips = (state.habitSkips || []).filter(
        (key) => !key.startsWith(`${record.item.id}:`)
      );
    }
    if (record.type === "list") {
      state.lists = state.lists.filter((list) => list.id !== record.item.id);
    }
    state.trash = [record, ...(state.trash || [])].slice(0, 100);
    saveState();
    renderGoalList();
    refreshTasksView({ animate: false });
    if (!listsPage.hidden) renderListManagerPage();
    if (!listDetailPage.hidden) renderListDetailPage();
    if (!trashPage.hidden) openTrashPage();
    showToast("已重新移入回收站");
  }

  function restoreTrashEntry(recordId, options = {}) {
    const record = (state.trash || []).find((entry) => entry.id === recordId);
    if (!record) return false;
    if (record.type === "task") {
      restoreTasksFromTrash([record.item]);
    } else if (record.type === "tasks") {
      restoreTasksFromTrash(record.tasks);
    } else if (record.type === "goal") {
      if (state.goals.some((goal) => goal.id === record.item.id)) {
        record.item.id = uid("goal");
      }
      state.goals.push(record.item);
      restoreTasksFromTrash(record.tasks);
    } else if (record.type === "habit") {
      if (state.habits.some((habit) => habit.id === record.item.id)) {
        record.item.id = uid("habit");
      }
      state.habits.push(record.item);
      restoreTasksFromTrash(record.tasks);
      state.habitSkips = [
        ...new Set([...(state.habitSkips || []), ...(record.habitSkips || [])]),
      ];
    } else if (record.type === "list") {
      if (state.lists.some((list) => list.id === record.item.id)) {
        record.item.id = uid("list");
      }
      state.lists.push(record.item);
    }
    removeTrashRecord(recordId);
    saveState();
    renderGoalList();
    refreshTasksView({ animate: false });
    if (!listsPage.hidden) renderListManagerPage();
    if (!listDetailPage.hidden) renderListDetailPage();
    if (!dataPage.hidden) openDataPage();
    if (!trashPage.hidden) openTrashPage();
    renderProfileMenuHints();
    if (!options.silent) {
      showToast("已从回收站恢复", {
        undo: true,
        onUndo: () => undoRestoredTrash(record),
      });
    }
    return true;
  }

  function purgeTrashEntry(recordId) {
    const record = (state.trash || []).find((entry) => entry.id === recordId);
    if (!record) return;
    removeTrashRecord(recordId);
    saveState();
    renderProfileMenuHints();
    if (!trashPage.hidden) openTrashPage();
  }

  // ---------- Toast ----------
  function showToast(message, options = {}) {
    window.clearTimeout(toastTimer);
    toast.innerHTML = `<span class="toast-message">${esc(message)}</span>${
      options.undo ? '<button class="toast-undo" type="button">撤销</button>' : ""
    }`;
    const undoButton = toast.querySelector(".toast-undo");
    if (undoButton) {
      undoButton.addEventListener("click", () => {
        window.clearTimeout(toastTimer);
        toast.classList.remove("is-showing");
        options.onUndo?.();
      });
    }
    toast.classList.add("is-showing");
    toastTimer = window.setTimeout(
      () => {
        toast.classList.remove("is-showing");
      },
      options.undo ? 5000 : 1900
    );
  }

  // ---------- Navigation ----------
  let pageTransitionTimer = 0;
  let pageTransitionToken = 0;
  let pageSettleTimer = 0;
  const pageScrollPositions = new Map();

  function currentPage() {
    return document.querySelector(".page.is-active:not([hidden])");
  }

  function scrollPageToTop(page = currentPage(), behavior = "auto") {
    if (!page) return;
    page.scrollTo({ top: 0, behavior });
  }

  function setTabButtons(tab) {
    document.querySelectorAll("[data-tab]").forEach((button) => {
      const active = button.dataset.tab === tab;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });
  }

  function resetPageTransition() {
    window.clearTimeout(pageTransitionTimer);
    window.clearTimeout(pageSettleTimer);
    pageTransitionToken += 1;
    document.querySelectorAll(".page").forEach((page) => {
      page.classList.remove(
        "is-underlay",
        "is-fading",
        "is-fade-out",
        "no-page-anim",
        "is-tab-entering",
        "is-page-settling"
      );
    });
  }

  function transitionPage(target, tab, options = {}) {
    if (!target) return;
    const source = document.querySelector(".page.is-active:not([hidden])");
    if (source === target) {
      ui.activeTab = tab;
      setTabButtons(tab);
      return;
    }
    const targetScroll = options.restoreScroll
      ? pageScrollPositions.get(target.id) || 0
      : 0;

    window.clearTimeout(pageTransitionTimer);
    window.clearTimeout(pageSettleTimer);
    const token = ++pageTransitionToken;

    document.querySelectorAll(".page").forEach((page) => {
      if (page !== source && page !== target) {
        page.hidden = true;
        page.classList.remove(
          "is-active",
          "is-leaving",
          "is-underlay",
          "is-fading",
          "is-fade-out",
          "no-page-anim",
          "is-tab-entering"
        );
      }
    });

    if (source) {
      pageScrollPositions.set(source.id, source.scrollTop);
    }

    target.hidden = false;
    target.scrollTop = targetScroll;
    pageScrollPositions.set(target.id, targetScroll);
    target.classList.remove(
      "is-active",
      "is-leaving",
      "is-fading",
      "is-fade-out",
      "is-tab-entering",
      "is-page-settling"
    );
    target.classList.add("no-page-anim", "is-underlay");

    if (!source) {
      target.classList.remove("is-underlay", "no-page-anim");
      target.classList.add("is-active");
      ui.activeTab = tab;
      setTabButtons(tab);
      return;
    }

    source.hidden = false;
    source.classList.remove("is-underlay", "no-page-anim");
    source.classList.add("is-fading");
    source.classList.remove("is-fade-out");

    ui.activeTab = tab;
    setTabButtons(tab);

    // Let the destination paint underneath before fading the current page.
    requestAnimationFrame(() => {
      if (token !== pageTransitionToken) return;
      target.classList.add("is-page-settling");
      requestAnimationFrame(() => {
        if (token !== pageTransitionToken) return;
        source.classList.add("is-fade-out");
      });
    });

    pageTransitionTimer = window.setTimeout(() => {
      if (token !== pageTransitionToken) return;
      source.hidden = true;
      source.classList.remove(
        "is-active",
        "is-fading",
        "is-fade-out",
        "is-underlay",
        "no-page-anim",
        "is-page-settling"
      );
      target.classList.remove("is-underlay", "no-page-anim");
      target.classList.add("is-active");
      pageSettleTimer = window.setTimeout(() => {
        if (token !== pageTransitionToken) return;
        target.classList.remove("is-page-settling");
      }, 120);
    }, 260);
  }

  function openFullPage(pageId, tab, render) {
    const target = document.getElementById(pageId);
    if (!target) return;
    if (typeof render === "function") render();
    if (!target.hidden && target.classList.contains("is-active")) {
      ui.activeTab = tab;
      setTabButtons(tab);
      return;
    }
    transitionPage(target, tab);
  }

  function closeFullPageTo(tab) {
    const source = document.querySelector(".page--fullpage.is-active");
    if (!source) {
      switchTab(tab);
      return;
    }
    editingGoalId = null;
    if (tab === "create") renderGoalList();
    const target = document.querySelector(`.page[data-page="${tab}"]`);
    transitionPage(target, tab, { restoreScroll: true });
  }

  function showSubPage(pageId, tab) {
    const target = document.getElementById(pageId);
    if (!target) return;
    transitionPage(target, tab);
  }

  function closeSubPage(tab) {
    const target = document.querySelector(`.page[data-page="${tab}"]`);
    if (!target) return;
    transitionPage(target, tab, { restoreScroll: true });
  }

  function closePageTo(pageId, tab) {
    const target = document.getElementById(pageId);
    if (!target) return;
    transitionPage(target, tab, { restoreScroll: true });
  }

  function openHabitsPage() {
    ensureHabitTasks(todayKey());
    renderHabitList();
    showSubPage("page-habits", "create");
  }

  function showListsPage() {
    renderListManagerPage();
    showSubPage("page-lists", "profile");
  }

  function showTabImmediate(tab) {
    resetPageTransition();
    editingGoalId = null;
    ui.activeTab = tab;
    document.querySelectorAll(".page").forEach((page) => {
      const active = page.dataset.page === tab;
      page.hidden = !active;
      page.classList.remove(
        "is-leaving",
        "is-underlay",
        "is-fading",
        "is-fade-out",
        "no-page-anim",
        "is-tab-entering",
        "is-page-settling"
      );
      page.classList.toggle("is-active", active);
    });
    setTabButtons(tab);
    const active = document.querySelector(".page.is-active");
    scrollPageToTop(active);
    if (active) pageScrollPositions.set(active.id, 0);
  }

  function renderTabRoot(tab) {
    if (tab === "tasks") refreshTasksView({ animate: false });
    if (tab === "create") renderGoalList();
  }

  function switchTab(tab, options = {}) {
    if (!["tasks", "create", "profile"].includes(tab)) tab = "tasks";
    const target = document.querySelector(`.page[data-page="${tab}"]`);
    const current = document.querySelector(".page.is-active:not([hidden])");

    if (
      !options.initial &&
      ui.activeTab === tab &&
      current === target
    ) {
      return;
    }
    if (
      !options.initial &&
      target &&
      !target.hidden &&
      !target.classList.contains("is-active")
    ) {
      return;
    }

    editingGoalId = null;
    renderTabRoot(tab);

    if (options.initial || !current) {
      showTabImmediate(tab);
    } else {
      transitionPage(target, tab);
    }

    if (options.scroll !== false && (options.initial || !current)) {
      scrollPageToTop(target, "smooth");
    }
    if (options.updateHash !== false) {
      try {
        history.replaceState(null, "", `#${tab}`);
      } catch (error) {
        window.location.hash = tab;
      }
    }
  }

  // ---------- Events ----------
  function bindGlobalEvents() {
    document.querySelectorAll("[data-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        if (Date.now() < suppressTabClickUntil) return;
        switchTab(button.dataset.tab);
      });
    });

    const progressOrbit = document.querySelector("#progressOrbit");
    progressOrbit.addEventListener("click", () => openStatsPage("tasks"));
    progressOrbit.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openStatsPage("tasks");
      }
    });

    document
      .querySelectorAll("#todayJump")
      .forEach((button) =>
        button.addEventListener("click", () => selectDate(todayKey()))
      );
    document
      .querySelector("#prevDates")
      .addEventListener("click", () => dateStrip.scrollBy({ left: -250, behavior: "smooth" }));
    document
      .querySelector("#nextDates")
      .addEventListener("click", () => dateStrip.scrollBy({ left: 250, behavior: "smooth" }));

    dateStrip.addEventListener("click", (event) => {
      const chip = event.target.closest("[data-date]");
      if (!chip) return;
      if (Number(dateStrip.dataset.suppressClick || 0) > Date.now()) return;
      if (chip.dataset.date === ui.selectedDate) return;
      selectDate(chip.dataset.date, { scroll: false });
    });

    // Mouse / trackpad drag for the horizontal date strip.
    let dragState = null;
    dateStrip.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "touch" || event.button !== 0) return;
      dragState = {
        startX: event.clientX,
        scrollLeft: dateStrip.scrollLeft,
        moved: false,
        pointerId: event.pointerId,
      };
    });
    dateStrip.addEventListener("pointermove", (event) => {
      if (!dragState || dragState.pointerId !== event.pointerId) return;
      const delta = event.clientX - dragState.startX;
      if (Math.abs(delta) > 2.5) {
        if (!dragState.moved) {
          dragState.moved = true;
          dateStrip.classList.add("is-dragging");
          try {
            dateStrip.setPointerCapture(event.pointerId);
          } catch (error) {
            /* Pointer capture is best-effort. */
          }
        }
        dateStrip.scrollLeft = dragState.scrollLeft - delta * 1.3;
      }
    });
    const endDateDrag = (event) => {
      if (!dragState || dragState.pointerId !== event.pointerId) return;
      if (dragState.moved) {
        dateStrip.dataset.suppressClick = String(Date.now() + 180);
      }
      dateStrip.classList.remove("is-dragging");
      dragState = null;
    };
    dateStrip.addEventListener("pointerup", endDateDrag);
    dateStrip.addEventListener("pointercancel", endDateDrag);
    window.addEventListener("pointerup", endDateDrag);
    dateStrip.addEventListener("pointerleave", (event) => {
      if (dragState && !dragState.moved && event.buttons === 0) endDateDrag(event);
    });

    overdueList.addEventListener("click", (event) => {
      if (event.target.closest("[data-overdue-all]")) {
        moveAllOverdueTasks();
        return;
      }
      const move = event.target.closest("[data-overdue-move]");
      if (move) moveOverdueTask(move.dataset.overdueMove);
    });

    let pendingTaskDrag = null;
    let taskPressTimer = 0;

    function captureTaskRects(stack) {
      const rects = new Map();
      stack.querySelectorAll(".task-card").forEach((card) => {
        rects.set(card, card.getBoundingClientRect());
      });
      return rects;
    }

    function animateTaskShift(previousRects, stack, draggedCard) {
      stack.querySelectorAll(".task-card").forEach((card) => {
        if (card === draggedCard) return;
        const previous = previousRects.get(card);
        if (!previous) return;
        const current = card.getBoundingClientRect();
        const deltaY = previous.top - current.top;
        if (Math.abs(deltaY) < 0.5) return;
        card.classList.remove("is-sort-shifting");
        card.style.transition = "none";
        card.style.transform = `translateY(${deltaY}px)`;
        // Force the inverted position to paint before releasing it.
        void card.offsetHeight;
        card.classList.add("is-sort-shifting");
        card.style.transition = "";
        card.style.transform = "";
        window.setTimeout(() => {
          card.classList.remove("is-sort-shifting");
        }, 220);
      });
    }

    taskList.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      const menuButton = event.target.closest(".task-menu");
      if (!menuButton) return;
      const card = menuButton.closest(".task-card");
      if (!card || card.classList.contains("is-done")) return;
      const stack = card.closest(".task-stack");
      if (!stack) return;
      pendingTaskDrag = {
        card,
        stack,
        x: event.clientX,
        y: event.clientY,
        pointerId: event.pointerId,
      };
      window.clearTimeout(taskPressTimer);
      taskPressTimer = window.setTimeout(() => {
        if (!pendingTaskDrag) return;
        const drag = pendingTaskDrag;
        pendingTaskDrag = null;
        const rect = drag.card.getBoundingClientRect();
        drag.baseX = rect.left;
        drag.baseY = rect.top;
        drag.offsetX = drag.x - rect.left;
        drag.offsetY = drag.y - rect.top;
        const ghost = drag.card.cloneNode(true);
        ghost.classList.remove("is-dragging", "is-sort-shifting");
        ghost.classList.add("task-drag-ghost");
        ghost.setAttribute("aria-hidden", "true");
        ghost.inert = true;
        ghost.style.width = `${rect.width}px`;
        ghost.style.height = `${rect.height}px`;
        ghost.style.left = `${rect.left}px`;
        ghost.style.top = `${rect.top}px`;
        document.body.appendChild(ghost);
        drag.ghost = ghost;
        taskDragState = drag;
        suppressTaskClickUntil = Date.now() + 900;
        drag.card.classList.add("is-dragging");
        if (navigator.vibrate) navigator.vibrate(12);
        try {
          drag.card.setPointerCapture(drag.pointerId);
        } catch (error) {
          // Pointer capture is best-effort.
        }
      }, 430);
    });

    document.addEventListener("pointermove", (event) => {
      if (
        pendingTaskDrag &&
        event.pointerId === pendingTaskDrag.pointerId &&
        (Math.abs(event.clientX - pendingTaskDrag.x) > 8 ||
          Math.abs(event.clientY - pendingTaskDrag.y) > 8)
      ) {
        window.clearTimeout(taskPressTimer);
        pendingTaskDrag = null;
      }
      if (!taskDragState || event.pointerId !== taskDragState.pointerId) {
        return;
      }
      const { card, stack, ghost, baseX, baseY, offsetX, offsetY } =
        taskDragState;
      if (ghost) {
        const dx = event.clientX - offsetX - baseX;
        const dy = event.clientY - offsetY - baseY;
        ghost.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(1.02)`;
      }
      const cards = [...stack.querySelectorAll(".task-card")].filter(
        (item) => item !== card
      );
      const target = cards.find((item) => {
        const rect = item.getBoundingClientRect();
        return event.clientY < rect.top + rect.height / 2;
      });
      const previousRects = captureTaskRects(stack);
      if (target) {
        stack.insertBefore(card, target);
      } else {
        stack.appendChild(card);
      }
      animateTaskShift(previousRects, stack, card);
    });

    const finishTaskDrag = () => {
      window.clearTimeout(taskPressTimer);
      pendingTaskDrag = null;
      if (!taskDragState) return;
      const { card, stack, ghost, baseX, baseY } = taskDragState;
      card.classList.remove("is-dragging");
      taskDragState = null;
      [...stack.querySelectorAll(".task-card")].forEach((item, index) => {
        const task = state.tasks.find(
          (candidate) => candidate.id === item.dataset.taskId
        );
        if (task) task.order = index;
      });
      saveState();
      suppressTaskClickUntil = Date.now() + 350;

      if (ghost) {
        const finalRect = card.getBoundingClientRect();
        const currentRect = ghost.getBoundingClientRect();
        const fromX = currentRect.left - baseX;
        const fromY = currentRect.top - baseY;
        const toX = finalRect.left - baseX;
        const toY = finalRect.top - baseY;
        const animation = ghost.animate(
          [
            {
              transform: `translate3d(${fromX}px, ${fromY}px, 0) scale(1.02)`,
              opacity: 1,
            },
            {
              transform: `translate3d(${toX}px, ${toY}px, 0) scale(1)`,
              opacity: 0,
            },
          ],
          {
            duration: 200,
            easing: "cubic-bezier(0.34, 1.18, 0.64, 1)",
            fill: "forwards",
          }
        );
        animation.addEventListener("finish", () => ghost.remove(), {
          once: true,
        });
        window.setTimeout(() => ghost.remove(), 240);
      }
    };
    document.addEventListener("pointerup", finishTaskDrag);
    document.addEventListener("pointercancel", finishTaskDrag);

    taskList.addEventListener("click", (event) => {
      if (Date.now() < suppressTaskClickUntil) return;
      const action = event.target.closest("[data-action]");
      const card = event.target.closest(".task-card");
      if (!action) {
        if (event.target.closest(".task-inline-detail")) return;
        if (card) toggleTaskDetails(card.dataset.taskId, card);
        return;
      }
      if (action.dataset.action === "toggle") {
        if (card) toggleTask(card.dataset.taskId, card);
        return;
      }
      if (action.dataset.action === "menu") {
        if (card) openTaskActionMenu(card.dataset.taskId);
        return;
      }
      if (action.dataset.action === "collapse") {
        if (card) setTaskDetailOpen(card.dataset.taskId, false, card);
        return;
      }
      if (action.dataset.action === "edit") {
        if (card) openTaskForm(card.dataset.taskId);
        return;
      }
      if (action.dataset.action === "postpone") {
        if (!card) return;
        const task = state.tasks.find(
          (item) => item.id === card.dataset.taskId
        );
        if (!task) return;
        task.date = addDaysKey(task.date, 1);
        ui.expandedTaskId = null;
        saveState();
        refreshTasksView({ animate: false });
        showToast(`已顺延到 ${formatShortDate(task.date)}`);
        return;
      }
      if (action.dataset.action === "delete") {
        if (card) openDeleteTaskConfirm(card.dataset.taskId);
        return;
      }
      if (action.dataset.action === "subtask-toggle") {
        if (!card) return;
        const task = state.tasks.find(
          (item) => item.id === card.dataset.taskId
        );
        const subtask = task?.subtasks?.find(
          (item) => item.id === action.dataset.subtaskId
        );
        if (task && subtask) {
          subtask.done = !subtask.done;
          const allDone =
            task.subtasks.length > 0 &&
            task.subtasks.every((item) => item.done);
          if (allDone && !task.done) {
            saveState();
            toggleTask(task.id, card);
          } else {
            saveState();
            refreshTasksView({ animate: false });
          }
        }
        return;
      }
      if (action.dataset.action === "add") {
        openTaskForm();
        return;
      }
      if (action.dataset.action === "toggle-completed") {
        ui.completedOpen = !ui.completedOpen;
        ui.expandedTaskId = null;
        renderTaskList({ animate: false });
      }
    });

    taskList.addEventListener("contextmenu", (event) => {
      if (taskDragState || pendingTaskDrag) return;
      if (event.target.closest(".task-menu")) {
        event.preventDefault();
        return;
      }
      const card = event.target.closest(".task-card");
      if (!card || card.classList.contains("is-done")) return;
      event.preventDefault();
      if (!overlay.hidden) return;
      openTaskForm(card.dataset.taskId);
    });

    goalList.addEventListener("click", (event) => {
      const action = event.target.closest("[data-action]");
      if (!action) return;
      const goalCard = action.closest("[data-goal-id]");
      if (!goalCard) return;
      if (action.dataset.action === "goal-menu") {
        openGoalActions(goalCard.dataset.goalId);
      }
      if (action.dataset.action === "goal-color") {
        openGoalColorPicker(goalCard.dataset.goalId);
      }
      if (action.dataset.action === "goal-plan") {
        toggleGoalPlan(goalCard.dataset.goalId);
      }
    });

    document
      .querySelector("#newGoalBtn")
      .addEventListener("click", openHabitsPage);
    document
      .querySelector("#addHabitPageBtn")
      .addEventListener("click", () => openHabitForm());
    document
      .querySelector("#habitBack")
      .addEventListener("click", () => closeSubPage("create"));
    document
      .querySelector("#newListPage")
      .addEventListener("click", () => openListEditor());
    document
      .querySelector("#listsBack")
      .addEventListener("click", () => {
        resetListSearch();
        closeSubPage("profile");
      });
    document
      .querySelector("#addListPageBtn")
      .addEventListener("click", () => openListEditor());
    document
      .querySelector("#newGoalInline")
      .addEventListener("click", openGoalWizard);

    habitList.addEventListener("click", (event) => {
      const color = event.target.closest("[data-habit-color]");
      if (color) {
        openHabitColorPicker(color.dataset.habitColor);
        return;
      }
      const menu = event.target.closest("[data-habit-menu]");
      if (menu) {
        openHabitActions(menu.dataset.habitMenu);
      }
    });

    document.querySelectorAll("[data-profile-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.profileAction;
        if (action === "stats") openStatsPage("profile");
        if (action === "lists") openListManager();
        if (action === "archive") openArchivePage();
        if (action === "trash") openTrashPage();
        if (action === "data") openDataPage();
        if (action === "settings") openSettingsPage();
      });
    });

    globalSearchInput.addEventListener("input", renderGlobalSearch);
    listSearchInput?.addEventListener("input", () => {
      ui.listQuery = listSearchInput.value;
      ui.searchSelected.clear();
      clearListSearch.hidden = !ui.listQuery;
      renderListManagerPage();
    });
    clearListSearch?.addEventListener("click", () => {
      ui.listQuery = "";
      ui.searchSelected.clear();
      listSearchInput.value = "";
      clearListSearch.hidden = true;
      renderListManagerPage();
      listSearchInput.focus();
    });
    clearGlobalSearch.addEventListener("click", () => {
      globalSearchInput.value = "";
      renderGlobalSearch();
      globalSearchInput.focus();
    });
    globalSearchResults.addEventListener("click", (event) => {
      const result = event.target.closest("[data-search-type]");
      if (result) {
        openSearchResult(result.dataset.searchType, result.dataset.searchId);
      }
    });

    overlay.addEventListener("click", (event) => {
      if (Date.now() - sheetOpenedAt < 280) return;
      if (event.target.closest("[data-close-sheet]")) closeSheet();
    });

    document.addEventListener("click", (event) => {
      if (!event.target.closest("[data-close-fullpage]")) return;
      const page = event.target.closest(".page--fullpage");
      if (!page) return;
      if (page.id === "page-stats-detail") {
        closePageTo("page-stats", "profile");
        return;
      }
      const tab =
        page.id === "page-goal"
          ? "create"
          : page.dataset.returnTab || "profile";
      closeFullPageTo(tab);
    });

    calendarLayer.addEventListener("click", (event) => {
      if (event.target.closest("[data-calendar-close]")) closeCalendarPicker();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      if (!calendarLayer.hidden) {
        closeCalendarPicker();
        return;
      }
      if (!overlay.hidden) closeSheet();
    });

    window.addEventListener("hashchange", () => {
      const tab = window.location.hash.replace("#", "");
      if (["tasks", "create", "profile"].includes(tab) && tab !== ui.activeTab) {
        switchTab(tab, { updateHash: false });
      }
    });
  }

  function setupNativeShell() {
    if (!isNativeApp()) return;
    const { App, StatusBar } = nativePlugins();

    if (StatusBar) {
      // Capacitor's naming is counter-intuitive: Style.Light = dark icons
      // for light backgrounds. The app is always light, so keep icons dark.
      const applyStatusBar = () => {
        const dark = effectiveThemeIsDark();
        Promise.resolve(
          StatusBar.setOverlaysWebView({ overlay: false })
        ).catch(() => {});
        Promise.resolve(
          StatusBar.setBackgroundColor({ color: dark ? "#11151d" : "#f4f6fb" })
        ).catch(() => {});
        Promise.resolve(
          StatusBar.setStyle({ style: dark ? "DARK" : "LIGHT" })
        ).catch(() => {});
      };
      applyStatusBar();
      if (App) {
        App.addListener("resume", applyStatusBar);
      }
    }

    if (App) {
      App.addListener("backButton", () => {
        if (!calendarLayer.hidden) {
          closeCalendarPicker();
          return;
        }
        if (!overlay.hidden) {
          closeSheet();
          return;
        }
        if (ui.expandedTaskId) {
          setTaskDetailOpen(ui.expandedTaskId, false);
          return;
        }
        const fullPage = document.querySelector(
          ".page--fullpage.is-active:not([hidden])"
        );
        if (fullPage) {
          if (fullPage.id === "page-stats-detail") {
            closePageTo("page-stats", "profile");
            return;
          }
          const tab =
            fullPage.id === "page-goal"
              ? "create"
              : fullPage.id === "page-stats"
                ? fullPage.dataset.returnTab || "profile"
                : "profile";
          closeFullPageTo(tab);
          return;
        }
        if (!habitsPage.hidden) {
          closeSubPage("create");
          return;
        }
        if (!listsPage.hidden) {
          closeSubPage("profile");
          return;
        }
        if (!listDetailPage.hidden) {
          closePageTo("page-lists", "profile");
          return;
        }
        if (ui.activeTab !== "tasks") {
          switchTab("tasks");
          return;
        }
        App.exitApp();
      });
    }
  }

  function setupTabSwipe() {
    let start = null;
    const canStart = (target) => {
      if (document.body.classList.contains("keyboard-open")) return false;
      if (!overlay.hidden || !calendarLayer.hidden) return false;
      const page = target.closest?.(".page");
      if (!page || !["tasks", "create", "profile"].includes(page.dataset.page)) {
        return false;
      }
      if (
        target.closest(
          "input, textarea, select, button, .date-strip, .task-card, .segmented, .sheet, .calendar-layer"
        )
      ) {
        return false;
      }
      return true;
    };
    screen.addEventListener(
      "touchstart",
      (event) => {
        if (event.touches.length !== 1 || !canStart(event.target)) {
          start = null;
          return;
        }
        start = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
          horizontal: false,
        };
      },
      { passive: true }
    );
    screen.addEventListener(
      "touchmove",
      (event) => {
        if (!start || event.touches.length !== 1) return;
        const dx = event.touches[0].clientX - start.x;
        const dy = event.touches[0].clientY - start.y;
        if (!start.horizontal && Math.abs(dx) > 28 && Math.abs(dx) > Math.abs(dy) * 1.25) {
          start.horizontal = true;
        }
        if (start.horizontal) event.preventDefault();
      },
      { passive: false }
    );
    screen.addEventListener(
      "touchend",
      (event) => {
        if (!start) return;
        const touch = event.changedTouches[0];
        const dx = touch.clientX - start.x;
        const horizontal = start.horizontal;
        start = null;
        if (!horizontal || Math.abs(dx) < 52) return;
        const tabs = ["tasks", "create", "profile"];
        const index = tabs.indexOf(ui.activeTab);
        if (index < 0) return;
        if (dx < 0 && index < tabs.length - 1) switchTab(tabs[index + 1]);
        if (dx > 0 && index > 0) switchTab(tabs[index - 1]);
      },
      { passive: true }
    );

    let tabStart = null;
    tabbar?.addEventListener(
      "touchstart",
      (event) => {
        if (
          event.touches.length !== 1 ||
          !overlay.hidden ||
          !calendarLayer.hidden ||
          document.body.classList.contains("keyboard-open")
        ) {
          tabStart = null;
          return;
        }
        tabStart = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
          horizontal: false,
        };
      },
      { passive: true }
    );
    tabbar?.addEventListener(
      "touchmove",
      (event) => {
        if (!tabStart || event.touches.length !== 1) return;
        const dx = event.touches[0].clientX - tabStart.x;
        const dy = event.touches[0].clientY - tabStart.y;
        if (
          !tabStart.horizontal &&
          Math.abs(dx) > 24 &&
          Math.abs(dx) > Math.abs(dy) * 1.2
        ) {
          tabStart.horizontal = true;
        }
        if (tabStart.horizontal) event.preventDefault();
      },
      { passive: false }
    );
    tabbar?.addEventListener(
      "touchend",
      (event) => {
        if (!tabStart) return;
        const touch = event.changedTouches[0];
        const dx = touch.clientX - tabStart.x;
        const horizontal = tabStart.horizontal;
        tabStart = null;
        if (!horizontal || Math.abs(dx) < 48) return;
        suppressTabClickUntil = Date.now() + 350;
        const tabs = ["tasks", "create", "profile"];
        const index = tabs.indexOf(ui.activeTab);
        if (index < 0) return;
        if (dx < 0 && index > 0) switchTab(tabs[index - 1]);
        if (dx > 0 && index < tabs.length - 1) switchTab(tabs[index + 1]);
      },
      { passive: true }
    );
  }

  function init() {
    applyFontScale();
    applyTheme();
    setupThemeWatcher();
    setupKeyboardViewport();
    setupTabSwipe();
    document.addEventListener("gesturestart", (event) => event.preventDefault(), {
      passive: false,
    });
    document.addEventListener(
      "touchmove",
      (event) => {
        if (event.touches.length > 1) event.preventDefault();
      },
      { passive: false }
    );
    ensureHabitTasks(ui.selectedDate);
    renderDateStrip();
    updateDateStripSelection();
    renderTaskHeader();
    renderTaskList({ animate: true });
    bindMonthView();
    bindGlobalEvents();
    renderProfileMenuHints();
    switchTab(initialTab, { initial: true, updateHash: false, scroll: false });
    setupNativeShell();
    requestAnimationFrame(() => {
      scrollSelectedDate(false);
    });
  }

  init();
})();
