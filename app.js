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
  const DEFAULT_LISTS = [
    { id: "list_work", name: "工作", color: "blue" },
    { id: "list_life", name: "生活", color: "orange" },
    { id: "list_growth", name: "成长", color: "purple" },
    { id: "list_health", name: "健康", color: "green" },
    { id: "list_goal", name: "目标", color: "cyan" },
  ];
  const FONT_SCALE_DEFAULT = 1.06;
  const FONT_SCALE_OPTIONS = [
    { value: 1, label: "标准", hint: "紧凑" },
    { value: 1.06, label: "大", hint: "默认" },
    { value: 1.12, label: "特大", hint: "更大" },
  ];
  const DEFAULT_SETTINGS = {
    fontScale: FONT_SCALE_DEFAULT,
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
    document.documentElement.style.setProperty("--font-scale", String(scale));
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

    panel.onclick = (event) => {
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
    calendarLayer.hidden = false;
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

  function closeCalendarPicker() {
    if (calendarLayer.hidden) return;
    calendarLayer.hidden = true;
    calendarLayer.classList.remove("is-open");
    if (calendarOpenTrigger) {
      calendarOpenTrigger.setAttribute("aria-expanded", "false");
      calendarOpenTrigger = null;
    }
    calendarSelectionHandler = null;
    calendarHost.innerHTML = "";
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
      tasks,
      goals: [],
      habits: [],
      habitSkips: [],
      lists: makeDefaultLists(),
      settings: { ...DEFAULT_SETTINGS },
    };
  }

  function normalizeSettings(input) {
    const settings = { ...DEFAULT_SETTINGS };
    const scale = Number(input?.fontScale);
    settings.fontScale = FONT_SCALE_OPTIONS.some(
      (option) => option.value === scale
    )
      ? scale
      : FONT_SCALE_DEFAULT;
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
        return {
          ...rest,
          listId: validListIds.has(task.listId)
            ? task.listId
            : listByName.get(tag) || fallbackListId,
        };
      });

    const goals = (Array.isArray(raw?.goals) ? raw.goals : [])
      .filter((goal) => goal && typeof goal.title === "string")
      .map((goal) => ({
        ...goal,
        listId: validListIds.has(goal.listId)
          ? goal.listId
          : fallbackGoalListId,
      }));

    const habits = (Array.isArray(raw?.habits) ? raw.habits : [])
      .filter((habit) => habit && typeof habit.title === "string")
      .map((habit) => ({
        ...habit,
        listId: validListIds.has(habit.listId)
          ? habit.listId
          : fallbackListId,
      }));
    const habitSkips = (Array.isArray(raw?.habitSkips) ? raw.habitSkips : [])
      .filter((key) => typeof key === "string")
      .slice(-500);

    return {
      tasks,
      goals,
      habits,
      habitSkips,
      lists,
      settings: normalizeSettings(raw?.settings),
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.tasks) && Array.isArray(parsed.goals)) {
          return normalizeStateData(parsed);
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

  function ensureHabitTasks(dateKey) {
    if (!state.habits?.length || !dateKey || dateKey < todayKey()) {
      return false;
    }
    const skipped = new Set(state.habitSkips || []);
    let changed = false;
    state.habits.forEach((habit, index) => {
      if (skipped.has(habitSkipKey(habit.id, dateKey))) return;
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
    rangeStart: addDaysKey(todayKey(), -45),
    rangeEnd: addDaysKey(todayKey(), 45),
  };

  let goalDraft = null;
  let editingGoalId = null;
  let toastTimer = 0;
  let sheetClosingTimer = 0;
  let sheetOpenedAt = 0;
  let taskMorphState = null;
  let calendarOpenTrigger = null;
  let calendarSelectionHandler = null;
  let suppressTaskClickUntil = 0;

  // ---------- DOM ----------
  const screen = document.querySelector("#screen");
  const overlay = document.querySelector("#overlay");
  const sheet = document.querySelector("#sheet");
  const dateStrip = document.querySelector("#dateStrip");
  const taskList = document.querySelector("#taskList");
  const toast = document.querySelector("#toast");
  const goalList = document.querySelector("#goalList");
  const habitList = document.querySelector("#habitList");
  const habitsPage = document.querySelector("#page-habits");
  const listsPage = document.querySelector("#page-lists");
  const listManagerContent = document.querySelector("#listManagerContent");
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
    return [...tasks].sort(
      (a, b) => (a.createdAt || 0) - (b.createdAt || 0)
    );
  }

  function sortDoneTasks(tasks) {
    return [...tasks].sort(
      (a, b) => (b.completedAt || b.createdAt || 0) - (a.completedAt || a.createdAt || 0)
    );
  }

  function taskMetaHTML(task) {
    const parts = [];
    if (task.listId) {
      parts.push(listTagHTML(task.listId));
    }
    if (task.habitId) {
      parts.push(`<span class="tag tag--habit">每日</span>`);
    }
    if (task.note) {
      parts.push(`<span class="meta-note" title="${esc(task.note)}">${ICONS.note}<span>备注</span></span>`);
    }
    return parts.join('<span class="meta-dot" aria-hidden="true"></span>');
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
                : `<button class="goal-action-item" type="button" data-action="edit">${ICONS.pen}<span>编辑任务</span></button>
                   <button class="goal-action-item" type="button" data-action="postpone">${ICONS.calendarNext}<span>顺延到明天</span></button>`
            }
            <button class="goal-action-item goal-action-item--danger" type="button" data-action="delete">${ICONS.trash}<span>删除任务</span></button>
          </div>
        </div>
      </div>
    </div>`;
  }

  function taskCardHTML(task, completed = false) {
    const meta = completed ? "" : taskMetaHTML(task);
    const expanded = ui.expandedTaskId === task.id;
    const actions =
      completed || task.done
        ? ""
        : `<button class="task-menu" type="button" data-action="menu" aria-label="任务操作 ${esc(
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
    renderTaskList(options);
    updateDateStripDots();
    updateDateStripSelection();
  }

  // ---------- Task completion ----------
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
      saveState();
      refreshTasksView({ animate: false });
      showToast("完成得漂亮");
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
        <p>「${esc(task.title)}」会被移除，这个操作不能撤销。</p>
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
      state.tasks = state.tasks.filter((item) => item.id !== taskId);
      saveState();
      closeSheet();
      refreshTasksView({ animate: false });
      renderGoalList();
      showToast("任务已删除");
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
      if (existing) {
        existing.title = title;
        existing.note = noteInput.value.trim();
        existing.date = date;
        existing.listId = selectedListId;
      } else {
        state.tasks.push({
          id: uid("task"),
          title,
          note: noteInput.value.trim(),
          date,
          listId: selectedListId,
          done: false,
          createdAt: Date.now(),
        });
      }
      saveState();
      closeSheet();
      selectDate(date, { force: true });
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
    }" data-goal-id="${goal.id}">
      <div class="goal-top">
        <div class="goal-icon" style="${goalColorStyle(goal.color || 0)}">${
          GOAL_ICONS[goal.unit] || ICONS.flag
        }</div>
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

  function renderHabitList() {
    if (!habitList) return;
    ensureHabitTasks(todayKey());
    if (!state.habits.length) {
      habitList.innerHTML = `<div class="habit-empty">
        <span class="habit-empty-icon">${ICONS.sun}</span>
        <span><strong>还没有每日习惯</strong><small>从一件每天都能做到的小事开始</small></span>
      </div>`;
      return;
    }
    habitList.innerHTML = state.habits
      .map((habit) => {
        const todayTask = habitTaskFor(habit.id);
        const done = Boolean(todayTask?.done);
        const streak = habitStreak(habit.id);
        const list = getList(habit.listId);
        return `<article class="habit-card ${done ? "is-done" : ""}" data-habit-id="${habit.id}">
          <span class="habit-state ${done ? "is-done" : ""}" aria-hidden="true">${
          done ? ICONS.check : ICONS.sun
        }</span>
          <div class="habit-copy">
            <strong>${esc(habit.title)}</strong>
            <small>${esc(list.name)} · ${
          done ? "今天已完成" : "今天待完成"
        }${streak > 0 ? ` · 连续 ${streak} 天` : ""}</small>
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
    openSheet(
      `<div class="form-sheet">
        <div class="sheet-grab"></div>
        <header class="sheet-head">
          <button class="round-close" type="button" data-close-sheet aria-label="关闭">${ICONS.close}</button>
          <h2>${existing ? "编辑每日习惯" : "新建每日习惯"}</h2>
          <button class="head-action" type="button" id="saveHabitAction">保存</button>
        </header>
        <div class="sheet-body">
          <div class="task-form-title">
            <label class="tag-picker-label" for="habitNameInput">习惯名称</label>
            <input class="task-title-input" id="habitNameInput" type="text" maxlength="60"
              value="${esc(existing?.title || "")}" placeholder="例如：阅读 20 分钟">
          </div>
          <div class="tag-picker-block">
            <p class="tag-picker-label">每天放入哪一个清单</p>
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
          <p class="habit-form-note">每天打开轻清单时，会自动生成一条当天的习惯任务。</p>
        </div>
      </div>`,
      { className: "sheet--form", label: existing ? "编辑每日习惯" : "新建每日习惯" }
    );

    const nameInput = document.querySelector("#habitNameInput");
    const picker = document.querySelector("#habitListPicker");
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
      if (existing) {
        existing.title = title;
        existing.listId = selectedListId;
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
          createdAt: Date.now(),
        });
      }
      saveState();
      ensureHabitTasks(todayKey());
      closeSheet();
      renderGoalList();
      refreshTasksView({ animate: false });
      showToast(existing ? "习惯已更新" : "每日习惯已创建");
    });
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
          <p>每日习惯 · ${esc(getList(habit.listId).name)} · 连续 ${habitStreak(
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
        <p>「${esc(habit.title)}」以及它生成的每日任务都会被移除，这个操作不能撤销。</p>
        <div class="confirm-actions">
          <button class="btn-danger" type="button" id="confirmDeleteHabit">${ICONS.trash}<span>确认删除</span></button>
          <button class="confirm-cancel" type="button" data-close-sheet>先留着</button>
        </div>
      </div>`,
      { className: "sheet--action", label: "确认删除习惯" }
    );
    document.querySelector("#confirmDeleteHabit").addEventListener("click", () => {
      state.habits = state.habits.filter((item) => item.id !== habitId);
      state.tasks = state.tasks.filter((task) => task.habitId !== habitId);
      state.habitSkips = (state.habitSkips || []).filter(
        (key) => !key.startsWith(`${habitId}:`)
      );
      saveState();
      closeSheet();
      renderGoalList();
      refreshTasksView({ animate: false });
      showToast("习惯已删除");
    });
  }

  function renderGoalList() {
    if (!state.goals.length) {
      goalList.innerHTML = createEmptyHTML();
    } else {
      goalList.innerHTML = state.goals.map((goal) => goalCardHTML(goal)).join("");
    }
    renderHabitList();
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
          <button class="goal-action-item goal-action-item--danger" type="button" id="deleteGoalAction">${ICONS.trash}<span>删除目标及关联任务</span></button>
        </div>
        <button class="confirm-cancel" type="button" data-close-sheet style="margin-top:10px">取消</button>
      </div>`,
      { className: "sheet--action", label: "目标操作" }
    );

    document.querySelector("#editGoalAction").addEventListener("click", () => {
      openGoalEditor(goalId);
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
    openSheet("", { className: "sheet--wizard", label: "编辑目标" });
    renderGoalWizardStep2({ focusTitle: true });
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
    closeSheet();
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
        <p>「${esc(goal.title)}」以及它同步到任务清单的 ${taskCount} 个行动都会被移除，这个操作不能撤销。</p>
        <div class="confirm-actions">
          <button class="btn-danger" type="button" id="confirmDeleteGoal">${ICONS.trash}<span>确认删除</span></button>
          <button class="confirm-cancel" type="button" data-close-sheet>先留着</button>
        </div>
      </div>`,
      { className: "sheet--action", label: "确认删除目标" }
    );

    document.querySelector("#confirmDeleteGoal").addEventListener("click", () => {
      state.goals = state.goals.filter((item) => item.id !== goalId);
      state.tasks = state.tasks.filter((task) => task.goalId !== goalId);
      saveState();
      closeSheet();
      renderGoalList();
      refreshTasksView({ animate: false });
      showToast("目标已删除");
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
    openSheet("", { className: "sheet--wizard", label: "新建目标" });
    renderGoalWizardStep1();
  }

  function wizardHeader(title, subtitle, progress, backButton = false) {
    return `<header class="wizard-head">
      ${
        backButton
          ? `<button class="icon-button--bare" type="button" id="wizardBack" aria-label="返回">${ICONS.arrowLeft}</button>`
          : `<button class="icon-button--bare" type="button" data-close-sheet aria-label="关闭">${ICONS.close}</button>`
      }
      <div class="wizard-head-center">
        <strong>${title}</strong>
        <small>${subtitle}</small>
      </div>
      ${
        backButton
          ? `<button class="icon-button--bare" type="button" data-close-sheet aria-label="关闭">${ICONS.close}</button>`
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

    sheet.innerHTML = `<div class="wizard">
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

    sheet.querySelectorAll("[data-unit]").forEach((button) => {
      button.addEventListener("click", () => {
        const nextUnit = button.dataset.unit;
        if (nextUnit === goalDraft.unit) return;
        goalDraft.counts[goalDraft.unit] = goalDraft.count;
        goalDraft.unit = nextUnit;
        goalDraft.count =
          goalDraft.counts[nextUnit] || UNIT_CONFIG[nextUnit].presets[0];
        goalDraft.plan = null;
        sheet.querySelectorAll("[data-unit]").forEach((unitButton) => {
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
    const weekInput = sheet.querySelector(`[data-week-id="${week.id}"]`);
    if (weekInput) week.goal = weekInput.value.trim();
    week.days.forEach((day) => {
      const dayInput = sheet.querySelector(`[data-day-id="${day.id}"]`);
      if (dayInput) day.action = dayInput.value.trim();
    });
  }

  function collectPlanFromSheet(plan) {
    if (plan.months) {
      plan.months.forEach((month) => {
        const monthInput = sheet.querySelector(`[data-month-id="${month.id}"]`);
        if (monthInput) month.goal = monthInput.value.trim();
        month.weeks.forEach(collectWeekFromSheet);
      });
    }
    if (plan.weeks) {
      plan.weeks.forEach(collectWeekFromSheet);
    }
    if (plan.days) {
      plan.days.forEach((day) => {
        const dayInput = sheet.querySelector(`[data-day-id="${day.id}"]`);
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

    sheet.innerHTML = `<div class="wizard">
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
        sheet.querySelectorAll("[data-week-count]").forEach((button) => {
          button.addEventListener("click", () => {
            collectPlanFromSheet(goalDraft.plan);
            const currentCount = goalDraft.plan.weeks.length;
            const nextCount = clamp(
              currentCount + Number(button.dataset.weekCount),
              1,
              52
            );
            if (nextCount === currentCount) return;
            const scrollTop =
              document.querySelector(".wizard-scroll")?.scrollTop || 0;
            resizeWeekPlan(goalDraft.plan, nextCount);
            goalDraft.count = nextCount;
            renderGoalWizardStep2();
            requestAnimationFrame(() => {
              const scroller = document.querySelector(".wizard-scroll");
              if (scroller) scroller.scrollTop = scrollTop;
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
    closeSheet();
    switchTab("create");
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
    listManagerContent.innerHTML = state.lists
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
            <span class="list-manage-edit">${ICONS.pen}</span>
          </button>
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
        openListEditor(button.dataset.listOpen);
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
    renderListManagerPage();
    if (!overlay.hidden) closeSheet();
    showSubPage("page-lists", "profile");
  }

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
        }会移动到「${esc(fallback.name)}」。这个操作不能撤销。</p>
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
      state.lists = state.lists.filter((item) => item.id !== list.id);
      saveState();
      refreshTasksView({ animate: false });
      renderGoalList();
      openListManager();
      showToast("清单已删除，内容已移动");
    });
  }

  function openStatsSheet() {
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

    const goalRows = state.goals.map((goal) => {
      const stats = getGoalStats(goal);
      return { goal, ...stats };
    });
    const goalPercent = goalRows.length
      ? Math.round(
          goalRows.reduce((total, item) => total + item.percent, 0) /
            goalRows.length
        )
      : 0;
    const completedGoals = goalRows.filter(
      (item) => item.tasks.length > 0 && item.percent === 100
    ).length;

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

    const goalList = goalRows.length
      ? goalRows
          .map(({ goal, tasks, percent }) => {
            const color = listColorOption(getList(goal.listId).color);
            return `<div class="stats-goal-row">
              <div class="stats-goal-head">
                <span class="list-manage-dot" style="background:${color.color}"></span>
                <span>${esc(goal.title)}</span>
                <b>${percent}%</b>
              </div>
              <div class="stats-goal-track"><i style="width:${percent}%"></i></div>
              <small>${tasks.filter((task) => task.done).length}/${
              tasks.length
            } 个行动</small>
            </div>`;
          })
          .join("")
      : `<div class="stats-empty">还没有创建目标，去「创造」里添加一个吧。</div>`;

    openSheet(
      `<div class="wizard">
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
            <div class="stats-card">
              <span>本周完成度</span>
              <strong>${weekPercent}%</strong>
              <p>${weekDone}/${weekTasks.length} 个任务</p>
              <div class="stats-card-track"><i style="width:${weekPercent}%"></i></div>
              <small>${formatShortDate(weekStart)} – ${formatShortDate(weekEnd)}</small>
            </div>
            <div class="stats-card">
              <span>目标完成度</span>
              <strong>${goalPercent}%</strong>
              <p>${completedGoals}/${goalRows.length} 个目标完成</p>
              <div class="stats-card-track"><i style="width:${goalPercent}%"></i></div>
              <small>所有进行中的目标</small>
            </div>
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

          <div class="stats-section-head"><span>目标进度</span><small>${
            goalRows.length
          } 个目标</small></div>
          <div class="stats-goal-list">${goalList}</div>
        </div>
      </div>`,
      { className: "sheet--wizard", label: "统计" }
    );
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

  function openDataSheet() {
    openSheet(
      `<div class="wizard">
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
            <input type="file" id="importDataInput" accept=".json,application/json" hidden>
          </div>
          <div class="data-danger-card">
            <div>
              <strong>清空并恢复默认</strong>
              <span>删除本机所有任务、目标和清单</span>
            </div>
            <button type="button" id="resetDataFromSheet">清空</button>
          </div>
          <p class="data-note">备份包含任务、目标、清单和完成记录。导入会替换当前数据。</p>
        </div>
      </div>`,
      { className: "sheet--wizard", label: "数据" }
    );

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
      .querySelector("#resetDataFromSheet")
      .addEventListener("click", openResetDataConfirm);
  }

  function openSettingsSheet() {
    const currentScale = state.settings?.fontScale ?? FONT_SCALE_DEFAULT;

    openSheet(
      `<div class="wizard">
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
          <p class="font-note">默认使用「大」。调整后会立即应用到任务、目标、清单、统计等全部页面。</p>
          <div class="settings-about">轻清单 1.10.2 · 离线自用版</div>
        </div>
      </div>`,
      { className: "sheet--wizard", label: "设置" }
    );

    sheet.querySelectorAll("[data-font-scale]").forEach((button) => {
      button.addEventListener("click", () => {
        const nextScale = Number(button.dataset.fontScale);
        if (!FONT_SCALE_OPTIONS.some((option) => option.value === nextScale)) {
          return;
        }
        state.settings.fontScale = nextScale;
        saveState();
        applyFontScale();
        openSettingsSheet();
      });
    });
  }

  function openResetDataConfirm() {
    openSheet(
      `<div class="confirm-sheet">
        <div class="sheet-grab"></div>
        <div class="confirm-icon">${ICONS.trash}</div>
        <h2>清空所有数据？</h2>
        <p>所有任务、目标、完成记录都会被清除，页面会恢复到最初的默认状态。这个操作不能撤销。</p>
        <div class="confirm-actions">
          <button class="btn-danger" type="button" id="confirmResetData">${ICONS.trash}<span>清空并恢复默认</span></button>
          <button class="confirm-cancel" type="button" data-close-sheet>取消</button>
        </div>
      </div>`,
      { className: "sheet--action", label: "确认清空数据" }
    );

    document.querySelector("#confirmResetData").addEventListener("click", () => {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.warn("清空本地数据失败。", error);
      }
      const url = new URL(window.location.href);
      url.searchParams.delete("reset");
      url.hash = "";
      window.location.replace(url.toString());
    });
  }

  // ---------- Sheet / overlay ----------
  function openSheet(content, options = {}) {
    window.clearTimeout(sheetClosingTimer);
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

  function closeSheet() {
    closeCalendarPicker();
    cancelTaskMorph();
    editingGoalId = null;
    if (overlay.hidden) return;
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

  // ---------- Toast ----------
  function showToast(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-showing");
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-showing");
    }, 1900);
  }

  // ---------- Navigation ----------
  function showSubPage(pageId, tab) {
    ui.activeTab = tab;
    document.querySelectorAll(".page").forEach((page) => {
      const active = page.id === pageId;
      page.hidden = !active;
      page.classList.toggle("is-active", active);
    });
    document.querySelectorAll("[data-tab]").forEach((button) => {
      const active = button.dataset.tab === tab;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });
    screen.scrollTo({ top: 0, behavior: "auto" });
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

  function switchTab(tab, options = {}) {
    if (!["tasks", "create", "profile"].includes(tab)) tab = "tasks";
    ui.activeTab = tab;

    document.querySelectorAll(".page").forEach((page) => {
      const active = page.dataset.page === tab;
      page.hidden = !active;
      page.classList.toggle("is-active", active);
    });
    document.querySelectorAll("[data-tab]").forEach((button) => {
      const active = button.dataset.tab === tab;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });

    if (tab === "tasks") {
      refreshTasksView({ animate: false });
    }
    if (tab === "create") {
      renderGoalList();
    }
    if (options.scroll !== false) {
      screen.scrollTo({ top: 0, behavior: "smooth" });
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
        switchTab(button.dataset.tab);
      });
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
        if (card) toggleTaskDetails(card.dataset.taskId, card);
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

    // Long press a task to edit it.
    let pressTimer = 0;
    let pressState = null;
    const clearPress = () => {
      if (pressTimer) {
        window.clearTimeout(pressTimer);
        pressTimer = 0;
      }
      pressState = null;
    };

    taskList.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      const card = event.target.closest(".task-card");
      if (!card || card.classList.contains("is-done") || event.target.closest("button")) {
        return;
      }
      pressState = {
        x: event.clientX,
        y: event.clientY,
        id: card.dataset.taskId,
      };
      pressTimer = window.setTimeout(() => {
        if (!pressState) return;
        if (navigator.vibrate) navigator.vibrate(14);
        suppressTaskClickUntil = Date.now() + 700;
        openTaskForm(pressState.id);
        pressTimer = 0;
        pressState = null;
      }, 520);
    });

    window.addEventListener("pointermove", (event) => {
      if (!pressState) return;
      if (
        Math.abs(event.clientX - pressState.x) > 9 ||
        Math.abs(event.clientY - pressState.y) > 9
      ) {
        clearPress();
      }
    });
    window.addEventListener("pointerup", clearPress);
    window.addEventListener("pointercancel", clearPress);

    taskList.addEventListener("contextmenu", (event) => {
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
      .addEventListener("click", () => switchTab("create"));
    document
      .querySelector("#newListPage")
      .addEventListener("click", () => openListEditor());
    document
      .querySelector("#listsBack")
      .addEventListener("click", () => switchTab("profile"));
    document
      .querySelector("#addListPageBtn")
      .addEventListener("click", () => openListEditor());
    document
      .querySelector("#newGoalInline")
      .addEventListener("click", openGoalWizard);

    habitList.addEventListener("click", (event) => {
      const menu = event.target.closest("[data-habit-menu]");
      if (menu) {
        openHabitActions(menu.dataset.habitMenu);
      }
    });

    document.querySelectorAll("[data-profile-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.profileAction;
        if (action === "stats") openStatsSheet();
        if (action === "lists") openListManager();
        if (action === "data") openDataSheet();
        if (action === "settings") openSettingsSheet();
      });
    });

    overlay.addEventListener("click", (event) => {
      if (Date.now() - sheetOpenedAt < 280) return;
      if (event.target.closest("[data-close-sheet]")) closeSheet();
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
        Promise.resolve(
          StatusBar.setOverlaysWebView({ overlay: false })
        ).catch(() => {});
        Promise.resolve(
          StatusBar.setBackgroundColor({ color: "#f4f6fb" })
        ).catch(() => {});
        Promise.resolve(StatusBar.setStyle({ style: "LIGHT" })).catch(
          () => {}
        );
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
        if (!habitsPage.hidden) {
          switchTab("create");
          return;
        }
        if (!listsPage.hidden) {
          switchTab("profile");
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

  function init() {
    applyFontScale();
    setupKeyboardViewport();
    ensureHabitTasks(ui.selectedDate);
    renderDateStrip();
    updateDateStripSelection();
    renderTaskHeader();
    renderTaskList({ animate: true });
    bindGlobalEvents();
    switchTab(initialTab, { updateHash: false, scroll: false });
    setupNativeShell();
    requestAnimationFrame(() => {
      scrollSelectedDate(false);
    });
  }

  init();
})();
