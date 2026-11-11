/* LexiGo: Spotlight 7 - игровой движок.
   10 уровней по модулям, бонусы, баффы, способности, босс и финал. */

(() => {
  "use strict";

  const SAVE_KEY = "lexigo.echo.v3";
  const MAP_COLS = 15;
  const MAP_ROWS = 11;
  const MAIN_ENEMIES = 14;
  const SEALS_REQUIRED = 10;
  const BOSS_HP = 20;
  const BOSS_HEARTS = 5;

  const MODULES = SPOTLIGHT;

  /* ---------------------------------------------------------------- утилиты */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const rand = (n) => Math.floor(Math.random() * n);
  const pick = (list) => list[rand(list.length)];
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  function shuffle(list) {
    const arr = list.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = rand(i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  const esc = (v) => String(v).replace(/[&<>"']/g, (c) => ESCAPES[c]);

  function plural(n, one, few, many) {
    const m10 = n % 10;
    const m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  }

  function hash(x, y) {
    let h = (x * 374761393 + y * 668265263) ^ 0x5bf03635;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }

  const ENEMY_NAMES = {
    m1: ["Street Warden", "Traffic Jam", "Grey Smog", "Tram Spirit", "Outskirts Guard", "Noisy Neighbour", "Concrete Golem", "Parking Attendant", "Street Magician", "Metro Keeper"],
    m2: ["Book Spirit", "Library Warden", "Castle Ghost", "Author's Shadow", "Fairy-tale Wolf", "Plot Thief", "Ink Monster", "Old Binding", "Detective Ghost", "Story Keeper"],
    m3: ["Mirror Warden", "Mask Master", "Portrait Shadow", "Character Guard", "Stranger in a Hat", "Gallery Keeper", "Liar", "Double", "Portrait Keeper", "Mysterious Guest"],
    m4: ["Ghost Anchor", "Broadcast Warden", "Headline Shadow", "Newspaper Golem", "Radio Wolf", "Editor Tyrant", "Paparazzo", "Archive Keeper", "TV Spirit", "News Voice"],
    m5: ["Robot Warden", "Scout Drone", "Cyber Wolf", "Lab Warden", "Hologram", "Virus", "Mechanical Dragon", "Nano Swarm", "Future Warden", "AI Sphinx"],
    m6: ["Ride Warden", "Ghost Clown", "Carousel Spirit", "Camp Keeper", "Concert Shadow", "Ticket Monster", "Queue King", "Stage Keeper", "Holiday Spirit", "Souvenir Master"],
    m7: ["Director's Shadow", "Stage Ghost", "Star Warden", "Critic", "Understudy", "Award Keeper", "Fan Zombie", "Master of Ceremonies", "Spotlight Shadow", "Airwave King"],
    m8: ["Smog", "Acid Spirit", "Dump Warden", "Plastic Monster", "Forest Shadow", "Vanishing Beast", "Oil Slime", "Water Keeper", "Rubbish Golem", "Planet Spirit"],
    m9: ["Cashier Warden", "Mannequin", "Discount Shadow", "Shopper Zombie", "Warehouse Keeper", "Coin Dragon", "Illusion Seller", "Thief", "Window Warden", "Sale King"],
    m10: ["Virus", "Gym Warden", "Stress Shadow", "Bone Warden", "Ghost Doctor", "Microbe", "Cast Golem", "Pharmacy Keeper", "Insomnia", "Illness Shadow"]
  };

  const ENEMY_PORTRAITS = {
    m1: ["assets/enemies/m1-1.svg", "assets/enemies/m1-2.svg", "assets/enemies/m1-3.svg"],
    m2: ["assets/enemies/m2-1.svg", "assets/enemies/m2-2.svg", "assets/enemies/m2-3.svg"],
    m3: ["assets/enemies/m3-1.svg", "assets/enemies/m3-2.svg", "assets/enemies/m3-3.svg"],
    m4: ["assets/enemies/m4-1.svg", "assets/enemies/m4-2.svg", "assets/enemies/m4-3.svg"],
    m5: ["assets/enemies/m5-1.svg", "assets/enemies/m5-2.svg", "assets/enemies/m5-3.svg"],
    m6: ["assets/enemies/m6-1.svg", "assets/enemies/m6-2.svg", "assets/enemies/m6-3.svg"],
    m7: ["assets/enemies/m7-1.svg", "assets/enemies/m7-2.svg", "assets/enemies/m7-3.svg"],
    m8: ["assets/enemies/m8-1.svg", "assets/enemies/m8-2.svg", "assets/enemies/m8-3.svg"],
    m9: ["assets/enemies/m9-1.svg", "assets/enemies/m9-2.svg", "assets/enemies/m9-3.svg"],
    m10: ["assets/enemies/m10-1.svg", "assets/enemies/m10-2.svg", "assets/enemies/m10-3.svg"]
  };

  const ELITE_PORTRAIT = "assets/enemies/elite.svg";
  const BOSS_PORTRAIT = "assets/enemies/boss.svg";
  const GUIDE_PORTRAIT = "assets/enemies/guide.svg";

  /* ------------------------------------------------------------------ звук */
  const audio = {
    ctx: null,
    master: null,
    musicGain: null,
    timer: null,
    mode: null,
    theme: "city",
    step: 0,
    unlocked: false,

    init() {
      if (this.ctx) return;
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      try {
        this.ctx = new Ctx();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.9;
        this.master.connect(this.ctx.destination);
        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.value = 0.35;
        this.musicGain.connect(this.master);
      } catch (err) {
        this.ctx = null;
      }
    },

    unlock() {
      this.init();
      this.unlocked = true;
      if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
      if (this.mode) this.playMusic(this.mode);
    },

    tone(freq, dur, type = "sine", gain = 0.05, delay = 0, dest) {
      if (!this.ctx) return;
      try {
        const t0 = this.ctx.currentTime + delay;
        const osc = this.ctx.createOscillator();
        const amp = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, t0);
        amp.gain.setValueAtTime(0.0001, t0);
        amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
        amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        osc.connect(amp);
        amp.connect(dest || this.master);
        osc.start(t0);
        osc.stop(t0 + dur + 0.03);
      } catch (err) {}
    },

    sfx(name) {
      if (!save.sound) return;
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume();
      const map = {
        click: [[520, 0.05, "sine", 0.03]],
        correct: [[660, 0.09, "sine", 0.05], [990, 0.14, "sine", 0.045, 0.07]],
        wrong: [[190, 0.16, "triangle", 0.06], [130, 0.22, "triangle", 0.05, 0.1]],
        hit: [[90, 0.16, "square", 0.07], [60, 0.2, "square", 0.05, 0.06]],
        victory: [[523, 0.18, "sine", 0.05, 0], [659, 0.18, "sine", 0.05, 0.09], [784, 0.18, "sine", 0.05, 0.18], [1047, 0.3, "sine", 0.05, 0.27]],
        defeat: [[330, 0.2, "sawtooth", 0.04], [220, 0.25, "sawtooth", 0.04, 0.18], [165, 0.4, "sawtooth", 0.04, 0.36]],
        levelup: [[440, 0.1, "sine", 0.05], [660, 0.1, "sine", 0.05, 0.1], [880, 0.2, "sine", 0.05, 0.2]],
        card: [[740, 0.07, "triangle", 0.04], [988, 0.12, "sine", 0.035, 0.05]],
        choice: [[392, 0.08, "sine", 0.04], [523, 0.12, "sine", 0.04, 0.07]],
        note: [[880, 0.09, "sine", 0.04], [1174, 0.16, "sine", 0.035, 0.08]],
        phase: [[110, 0.25, "sawtooth", 0.05], [82, 0.4, "triangle", 0.05, 0.15]]
      };
      (map[name] || map.click).forEach((n) => this.tone(n[0], n[1], n[2], n[3], n[4] || 0));
    },

    playMusic(mode) {
      this.mode = mode;
      if (!save.music) {
        this.stopMusic();
        return;
      }
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume();
      if (this.timer) window.clearInterval(this.timer);
      const patterns = {
        menu: { notes: [0, 7, 12, 7, 5, 12, 7, 5], tempo: 520, base: 220, type: "sine" },
        battle: { notes: [0, 3, 7, 10, 7, 3, 0, -2], tempo: 320, base: 196, type: "triangle" },
        boss: { notes: [0, 1, 5, 1, 0, -2, 1, 5], tempo: 260, base: 110, type: "sawtooth" }
      };
      const themePatterns = {
        city: { notes: [0, 3, 7, 10, 7, 3], tempo: 330, base: 196, type: "triangle" },
        story: { notes: [0, 2, 5, 7, 5, 2], tempo: 500, base: 174, type: "sine" },
        portrait: { notes: [0, 3, 5, 7, 10, 7], tempo: 420, base: 185, type: "triangle" },
        media: { notes: [0, 7, 10, 12, 10, 7], tempo: 300, base: 220, type: "triangle" },
        future: { notes: [0, 2, 7, 9, 7, 2], tempo: 280, base: 164, type: "sawtooth" },
        fun: { notes: [0, 4, 7, 12, 7, 4], tempo: 360, base: 246, type: "triangle" },
        stage: { notes: [0, 3, 7, 8, 7, 3], tempo: 440, base: 174, type: "sine" },
        green: { notes: [0, 2, 4, 7, 4, 2], tempo: 520, base: 196, type: "sine" },
        shop: { notes: [0, 5, 7, 12, 7, 5], tempo: 380, base: 220, type: "triangle" },
        health: { notes: [0, 2, 5, 9, 5, 2], tempo: 480, base: 164, type: "sine" }
      };
      const p = mode === "battle"
        ? (themePatterns[this.theme] || patterns.battle)
        : (patterns[mode] || patterns.menu);
      this.step = 0;
      const tick = () => {
        if (!save.music || !this.ctx) return;
        const semitone = p.notes[this.step % p.notes.length];
        const freq = p.base * Math.pow(2, semitone / 12);
        this.tone(freq, (p.tempo / 1000) * 0.8, p.type, 0.05, 0, this.musicGain);
        if (this.step % 4 === 0) {
          this.tone(freq / 2, (p.tempo / 1000) * 1.6, "sine", 0.06, 0, this.musicGain);
        }
        this.step++;
      };
      tick();
      this.timer = window.setInterval(tick, p.tempo);
    },

    setTheme(theme) {
      this.theme = theme || "city";
      if (this.mode === "battle") this.playMusic("battle");
    },

    stopMusic() {
      if (this.timer) window.clearInterval(this.timer);
      this.timer = null;
      this.mode = null;
    }
  };

  /* ------------------------------------------------------------------ речь */
  let voices = [];
  function refreshVoices() {
    if (!("speechSynthesis" in window)) return;
    try { voices = window.speechSynthesis.getVoices() || []; } catch (err) { voices = []; }
  }
  refreshVoices();
  if ("speechSynthesis" in window) window.speechSynthesis.onvoiceschanged = refreshVoices;

  function speak(text, rate = 0.92) {
    if (!save.sound || !("speechSynthesis" in window) || !text) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.rate = rate;
      const en = voices.filter((v) => /^en/i.test(v.lang || ""));
      const voice = en.find((v) => /en[-_]US/i.test(v.lang)) || en[0];
      if (voice) u.voice = voice;
      window.speechSynthesis.speak(u);
    } catch (err) {}
  }

  /* --------------------------------------------------------------- прогресс */
  const DEFAULT_SAVE = {
    name: "",
    avatar: AVATARS[0],
    heroClass: "mage",
    unlocked: 1,
    stars: {},
    best: {},
    totalScore: 0,
    completed: false,
    sound: true,
    music: true,
    storySeen: {},
    lore: {},
    loreNotes: {},
    echo: { mercy: 0, defiance: 0 },
    lastMistakes: []
  };

  function loadSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY) || localStorage.getItem("lexigo.spotlight.v2");
      if (!raw) return JSON.parse(JSON.stringify(DEFAULT_SAVE));
      const data = JSON.parse(raw) || {};
      return {
        ...JSON.parse(JSON.stringify(DEFAULT_SAVE)),
        ...data,
        stars: { ...(data.stars || {}) },
        best: { ...(data.best || {}) },
        storySeen: { ...(data.storySeen || {}) },
        lore: { ...(data.lore || {}) },
        loreNotes: { ...(data.loreNotes || {}) },
        echo: { ...(DEFAULT_SAVE.echo || {}), ...(data.echo || {}) },
        lastMistakes: Array.isArray(data.lastMistakes) ? data.lastMistakes : []
      };
    } catch (err) {
      return JSON.parse(JSON.stringify(DEFAULT_SAVE));
    }
  }

  let save = loadSave();

  function persist() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (err) {}
  }

  /* -------------------------------------------------------------- состояние */
  const state = {
    screen: "menu",
    module: null,
    level: null,
    hero: { x: 1, y: 9 },
    hearts: 3,
    maxHearts: 3,
    score: 0,
    streak: 0,
    bestStreak: 0,
    seals: 0,
    sealsRequired: 10,
    nextBoon: null,
    eventCooldown: 0,
    ambushCooldown: 0,
    fog: 0,
    hintCharges: 1,
    healCharges: 1,
    shield: 0,
    mistakes: [],
    battle: null,
    dialogue: null,
    boss: null,
    tile: 40,
    hintTimer: 0
  };

  const els = {
    screens: {
      menu: $("#screen-menu"),
      game: $("#screen-game"),
      boss: $("#screen-boss"),
      result: $("#screen-result"),
      ending: $("#screen-ending"),
      review: $("#screen-review")
    },
    map: $("#map"),
    mapWindow: $("#mapWindow"),
    stage: $("#stage"),
    levelTitle: $("#levelTitle"),
    levelSub: $("#levelSub"),
    hearts: $("#hearts"),
    scoreVal: $("#scoreVal"),
    streakVal: $("#streakVal"),
    buffs: $("#buffRow"),
    hint: $("#hint"),
    battleLayer: $("#battleLayer"),
    battleCard: $("#battleCard"),
    resultZone: $("#resultZone"),
    endingZone: $("#endingZone"),
    reviewZone: $("#reviewZone"),
    levelPath: $("#levelPath"),
    heroPortrait: $("#heroPortrait"),
    heroName: $("#heroName"),
    heroClass: $("#heroClass"),
    classStory: $("#classStory"),
    nameInput: $("#playerName"),
    classPicker: $("#classPicker"),
    sealVal: $("#sealVal"),
    mapLegend: $("#mapLegend"),
    mapCaption: $("#mapCaption"),
    dialogueLayer: $("#dialogueLayer"),
    dialogueCard: $("#dialogueCard"),
    storyLayer: $("#storyLayer"),
    storyCard: $("#storyCard"),
    journalLayer: $("#journalLayer"),
    journalCard: $("#journalCard"),
    journalBtn: $("#journalBtn"),
    menuJournal: $("#menuJournal"),
    statStars: $("#statStars"),
    statScore: $("#statScore"),
    continueBtn: $("#continueBtn"),
    reviewBtn: $("#reviewBtn"),
    musicBtn: $("#musicBtn"),
    soundBtn: $("#soundBtn"),
    bossCard: $("#bossCard"),
    bossHpFill: $("#bossHpFill"),
    bossHpText: $("#bossHpText"),
    bossPhase: $("#bossPhase"),
    bossHearts: $("#bossHearts"),
    bossScore: $("#bossScore"),
    bossQuestion: $("#bossQuestion"),
    bossAbilities: $("#bossAbilities"),
    bossSprite: $("#bossSprite"),
    bossName: $("#bossName"),
    bossLog: $("#bossLog")
  };

  /* ---------------------------------------------------------------- экраны */
  function showScreen(name) {
    state.screen = name;
    Object.entries(els.screens).forEach(([key, node]) => {
      if (node) node.hidden = key !== name;
    });
    document.body.dataset.screen = name;
    window.scrollTo(0, 0);
  }

  function goMenu() {
    closeBattle();
    closeDialogue();
    if (els.storyLayer) els.storyLayer.hidden = true;
    if (els.journalLayer) els.journalLayer.hidden = true;
    document.body.classList.remove("dialogue-open");
    state.level = null;
    state.battle = null;
    state.boss = null;
    audio.playMusic("menu");
    renderMenu();
    showScreen("menu");
  }

  /* ------------------------------------------------------------------ меню */
  function classOf(key) {
    return CLASSES[key] || CLASSES.mage;
  }

  function renderMenu() {
    const totalStars = Object.values(save.stars).reduce((a, b) => a + b, 0);
    els.statStars.textContent = totalStars;
    els.statScore.textContent = save.totalScore || 0;

    const cls = classOf(save.heroClass);
    if (els.heroPortrait) els.heroPortrait.src = cls.portrait || "assets/hero/mage.svg";
    els.heroName.textContent = save.name || "Wordcatcher";
    els.heroClass.textContent = cls.name;
    if (els.classStory) {
      const lore = STORY.classes[save.heroClass] || STORY.classes.mage;
      els.classStory.innerHTML = "<b>" + esc(lore.title) + "</b><br>" + esc(lore.story) +
        "<em>" + esc(lore.storyRu) + "</em>";
    }

    if (els.nameInput.value !== save.name) els.nameInput.value = save.name || "";

    $$("[data-class]", els.classPicker).forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.class === save.heroClass);
    });

    const continueIndex = clamp(save.unlocked - 1, 0, 10);
    els.continueBtn.textContent = save.completed
      ? "Play Echo again"
      : continueIndex === 0 && !Object.keys(save.stars).length
        ? "Enter the quarter"
        : "Continue";

    els.levelPath.innerHTML = MODULES.map((mod, i) => {
      const unlocked = i + 1 <= save.unlocked;
      const stars = save.stars[mod.id] || 0;
      const best = save.best[mod.id] || 0;
      const story = STORY.modules[mod.id] || {};
      return (
        '<button class="node' + (unlocked ? "" : " locked") + (i === continueIndex ? " current" : "") + '" type="button" data-level="' + i + '"' +
          (unlocked ? "" : " disabled") + ' style="--accent:' + themeAccent(mod.theme) + '">' +
          '<span class="node-sigil"><img src="' + (story.sigil || "assets/props/city.svg") + '" alt=""></span>' +
          '<span class="node-body">' +
            '<span class="node-num">Quarter ' + String(mod.num).padStart(2, "0") + " · " + esc(story.faction || "") + "</span>" +
            '<span class="node-title">' + esc(story.district || mod.title) + "</span>" +
            '<span class="node-grammar">' + esc(mod.grammar) + "</span>" +
            '<span class="node-stars">' + starsRow(stars) +
              (best ? '<span class="node-best">' + best + "</span>" : "") +
            "</span>" +
          "</span>" +
          '<span class="node-state">' + (unlocked ? "→" : "×") + "</span>" +
        "</button>"
      );
    }).join("") +
      '<button class="node boss-node' + (save.unlocked >= 11 ? "" : " locked") + '" type="button" data-boss="1"' +
        (save.unlocked >= 11 ? "" : " disabled") + ' style="--accent:#fb7185">' +
        '<span class="node-sigil boss-sigil"><img src="assets/enemies/boss-icon.svg" alt=""></span>' +
        '<span class="node-body">' +
          '<span class="node-num">House of Voices</span>' +
          '<span class="node-title">' + esc(STORY.boss.name) + '</span>' +
          '<span class="node-grammar">20 HP · 5 hearts · all modules</span>' +
          '<span class="node-stars">' + (save.completed ? "Completed" : save.unlocked >= 11 ? "Open" : "Locked") + "</span>" +
        "</span>" +
        '<span class="node-state">' + (save.unlocked >= 11 ? "→" : "×") + "</span>" +
      "</button>";

    if (els.reviewBtn) {
      els.reviewBtn.disabled = !(save.lastMistakes && save.lastMistakes.length);
      els.reviewBtn.textContent = save.lastMistakes && save.lastMistakes.length
        ? "Review mistakes (" + save.lastMistakes.length + ")"
        : "Review mistakes";
    }
  }

  function themeAccent(theme) {
    const map = {
      city: "#38bdf8", story: "#a78bfa", portrait: "#f472b6", media: "#22d3ee",
      future: "#818cf8", fun: "#f59e0b", stage: "#e879f9", green: "#34d399",
      shop: "#fbbf24", health: "#fb7185"
    };
    return map[theme] || "#a78bfa";
  }

  function starsRow(stars) {
    return [1, 2, 3].map((i) => '<span class="star' + (i <= stars ? " on" : "") + '">★</span>').join("");
  }

  /* ---------------------------------------------------------------- карта */
  function seeded(seed) {
    let t = seed >>> 0;
    return () => {
      t += 0x6d2b79f5;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  function buildHandcraftedLevel(module, index) {
    const layout = HANDCRAFTED[index];
    if (!layout) return null;
    const grid = Array.from({ length: MAP_ROWS }, () => Array(MAP_COLS).fill("#"));
    const carve = (x1, y1, x2, y2) => {
      for (let y = y1; y <= y2; y++) for (let x = x1; x <= x2; x++) grid[y][x] = ".";
    };
    layout.areas.forEach((r) => carve(r[0], r[1], r[2], r[3]));

    const start = layout.start;
    const castle = layout.castle;
    const wardenPos = layout.warden;
    grid[start[1]][start[0]] = "S";
    grid[castle[1]][castle[0]] = "C";

    const names = ENEMY_NAMES[module.id] || ENEMY_NAMES.m1;
    const portraits = ENEMY_PORTRAITS[module.id] || ENEMY_PORTRAITS.m1;
    const stories = makeLevelStories(module);
    const guardTalks = makeGuardDialogues(module);
    const enemies = layout.spots.map((pos, i) => ({
      id: "e" + i, x: pos[0], y: pos[1], dead: false, elite: false,
      name: names[i % names.length], portrait: portraits[i % portraits.length],
      hue: (i * 43) % 360, dialogue: guardTalks[i], story: stories[i], kind: null
    }));
    enemies.push({
      id: "elite", x: wardenPos[0], y: wardenPos[1], dead: false, elite: true, warden: true,
      wardenHp: 5 + Math.round(index * 5 / 9), name: "Quarter Warden", portrait: ELITE_PORTRAIT, hue: 0,
      rule: WARDEN_RULES[module.id],
      dialogue: makeWardenDialogue(module, STORY.modules[module.id] || {}),
      story: makeWardenStory(module), kind: null
    });

    const shrines = layout.shrines.map(([x, y, kind]) => ({ x, y, taken: false, kind }));
    const notes = (LORE_NOTES[module.id] || []).map((n, i) => ({
      id: "n" + i, x: layout.notes[i][0], y: layout.notes[i][1],
      title: n.title, en: n.en, ru: n.ru, taken: false
    }));

    return {
      module, index, cols: MAP_COLS, rows: MAP_ROWS, grid, start, castle,
      branch: wardenPos, enemies, shrines, notes, wardenDefeated: false,
      sealsRequired: SEALS_REQUIRED, handcrafted: true
    };
  }

  function buildLevel(module, index) {
    if (HANDCRAFTED[index]) return buildHandcraftedLevel(module, index);
    const random = seeded(7331 + index * 977);
    const grid = Array.from({ length: MAP_ROWS }, () => new Array(MAP_COLS).fill("#"));
    const carve = (x, y) => {
      if (x > 0 && y > 0 && x < MAP_COLS - 1 && y < MAP_ROWS - 1) grid[y][x] = ".";
    };

    // Лабиринт по клеткам 2×2: у каждого quarterа свой рисунок.
    const cellsX = 7;
    const cellsY = 5;
    const visited = Array.from({ length: cellsY }, () => new Array(cellsX).fill(false));
    const stack = [[0, cellsY - 1]];
    visited[cellsY - 1][0] = true;
    carve(1, 9);
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    while (stack.length) {
      const [cx, cy] = stack[stack.length - 1];
      const options = [];
      for (const [dx, dy] of dirs) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx >= 0 && ny >= 0 && nx < cellsX && ny < cellsY && !visited[ny][nx]) options.push([nx, ny, dx, dy]);
      }
      if (!options.length) {
        stack.pop();
        continue;
      }
      const [nx, ny, dx, dy] = options[Math.floor(random() * options.length)];
      visited[ny][nx] = true;
      const x1 = 1 + cx * 2;
      const y1 = 1 + cy * 2;
      const x2 = 1 + nx * 2;
      const y2 = 1 + ny * 2;
      carve(x1, y1);
      carve(x2, y2);
      carve(x1 + dx, y1 + dy);
      stack.push([nx, ny]);
    }

    // Кольца и обходные пути: у каждого модуля своя доля открытых стен.
    const braid = [0.34, 0.18, 0.26, 0.12, 0.22, 0.4, 0.16, 0.3, 0.38, 0.2][index] || 0.2;
    for (let cy = 0; cy < cellsY; cy++) {
      for (let cx = 0; cx < cellsX; cx++) {
        if (cx + 1 < cellsX && random() < braid) {
          const x = 1 + cx * 2 + 1;
          const y = 1 + cy * 2;
          if (grid[y][x] === "#") carve(x, y);
        }
        if (cy + 1 < cellsY && random() < braid) {
          const x = 1 + cx * 2;
          const y = 1 + cy * 2 + 1;
          if (grid[y][x] === "#") carve(x, y);
        }
      }
    }

    // Площади: редкие широкие места, чтобы карта не была только коридорами.
    const rooms = 2 + (index % 2);
    for (let r = 0; r < rooms; r++) {
      const w = 2 + Math.floor(random() * 2);
      const h = 2 + Math.floor(random() * 2);
      const x = 2 + Math.floor(random() * (MAP_COLS - w - 4));
      const y = 2 + Math.floor(random() * (MAP_ROWS - h - 4));
      for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) carve(xx, yy);
    }

    // Стартовая площадь и арена Хранителя: два читаемых ориентира на карте.
    for (let yy = 8; yy <= 10; yy++) for (let xx = 1; xx <= 3; xx++) carve(xx, yy);
    for (let yy = 2; yy <= 4; yy++) for (let xx = 9; xx <= 11; xx++) carve(xx, yy);

    const start = [1, 9];
    const castle = [13, 1];
    grid[start[1]][start[0]] = "S";
    grid[castle[1]][castle[0]] = "C";

    // Убираем комнаты-карманы, до которых нельзя дойти.
    const seen = new Set([start.join(",")]);
    const queue = [start];
    while (queue.length) {
      const [x, y] = queue.shift();
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 1 || ny < 1 || nx >= MAP_COLS - 1 || ny >= MAP_ROWS - 1) continue;
        if (grid[ny][nx] === "#") continue;
        const key = nx + "," + ny;
        if (seen.has(key)) continue;
        seen.add(key);
        queue.push([nx, ny]);
      }
    }
    for (let y = 1; y < MAP_ROWS - 1; y++) {
      for (let x = 1; x < MAP_COLS - 1; x++) {
        if (grid[y][x] !== "#" && !seen.has(x + "," + y)) grid[y][x] = "#";
      }
    }

    const floor = [];
    for (let y = 1; y < MAP_ROWS - 1; y++) {
      for (let x = 1; x < MAP_COLS - 1; x++) {
        if (grid[y][x] === ".") floor.push([x, y]);
      }
    }
    const manhattan = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
    const farFromStart = floor
      .filter(([x, y]) => manhattan([x, y], start) > 3)
      .sort((a, b) => manhattan(b, start) - manhattan(a, start));

    const chosen = [];
    const nearest = (tx, ty) => floor
      .filter(([x, y]) => manhattan([x, y], start) > 2 && manhattan([x, y], castle) > 1)
      .sort((a, b) => manhattan(a, [tx, ty]) - manhattan(b, [tx, ty]))[0];
    for (const corner of [[1, 1], [MAP_COLS - 2, 1], [1, MAP_ROWS - 2], [MAP_COLS - 2, MAP_ROWS - 2]]) {
      const tile = nearest(corner[0], corner[1]);
      if (tile && !chosen.some((p) => p[0] === tile[0] && p[1] === tile[1])) chosen.push(tile);
    }
    const bands = [[], [], [], []];
    for (const tile of floor) {
      if (manhattan(tile, start) <= 3) continue;
      if (manhattan(tile, castle) <= 1) continue;
      const band = tile[1] < 3 ? 0 : tile[1] < 6 ? 1 : tile[1] < 9 ? 2 : 3;
      bands[band].push(tile);
    }
    const quotas = [2, 3, 3, 2];
    for (let b = 0; b < 4; b++) {
      bands[b].sort((a, c) => (a[1] - c[1]) || (a[0] - c[0]));
      let added = 0;
      const step = Math.max(1, Math.floor(bands[b].length / Math.max(1, quotas[b])));
      for (let k = 0; k < quotas[b] && k * step < bands[b].length; k++) {
        const tile = bands[b][k * step];
        if (tile && !chosen.some((p) => p[0] === tile[0] && p[1] === tile[1])) {
          chosen.push(tile);
          added++;
        }
      }
      for (const tile of bands[b]) {
        if (added >= quotas[b]) break;
        if (!chosen.some((p) => p[0] === tile[0] && p[1] === tile[1])) {
          chosen.push(tile);
          added++;
        }
      }
    }
    for (const tile of farFromStart) {
      if (chosen.length >= MAIN_ENEMIES) break;
      if (!chosen.some((p) => p[0] === tile[0] && p[1] === tile[1])) chosen.push(tile);
    }
    if (chosen.length < MAIN_ENEMIES) {
      for (const tile of floor) {
        if (chosen.length >= MAIN_ENEMIES) break;
        if (!chosen.some((p) => p[0] === tile[0] && p[1] === tile[1])) chosen.push(tile);
      }
    }

    const names = ENEMY_NAMES[module.id] || ENEMY_NAMES.m1;
    const portraits = ENEMY_PORTRAITS[module.id] || ENEMY_PORTRAITS.m1;
    const guardTalks = makeGuardDialogues(module);
    const guardStories = makeLevelStories(module);
    const wardenStory = makeWardenStory(module);
    const wardenTalk = makeWardenDialogue(module, STORY.modules[module.id] || {});
    const enemies = chosen.slice(0, MAIN_ENEMIES).map((pos, i) => ({
      id: "e" + i,
      x: pos[0],
      y: pos[1],
      dead: false,
      elite: false,
      name: names[i % names.length],
      portrait: portraits[i % portraits.length],
      hue: (i * 43) % 360,
      dialogue: guardTalks[i],
      story: guardStories[i],
      kind: null
    }));

    // Elite - в тупике или дальнем углу, который не занят стражей.
    const neighbours = (x, y) => [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]
      .filter(([nx, ny]) => nx > 0 && ny > 0 && nx < MAP_COLS - 1 && ny < MAP_ROWS - 1 && grid[ny][nx] !== "#").length;
    const deadEnds = floor.filter((p) => neighbours(p[0], p[1]) === 1);
    const free = (p) => !enemies.some((e) => e.x === p[0] && e.y === p[1]);
    const wardenSpot = floor
      .filter((p) => free(p) && !(p[0] === castle[0] && p[1] === castle[1]) &&
        manhattan(p, castle) <= 3 && manhattan(p, start) > 4)
      .sort((a, b) => manhattan(a, castle) - manhattan(b, castle))[0]
      || farFromStart.find(free)
      || floor[floor.length - 1];
    enemies.push({
      id: "elite",
      x: wardenSpot[0],
      y: wardenSpot[1],
      dead: false,
      elite: true,
      warden: true,
      wardenHp: 5 + Math.round(index * 5 / 9),
      name: "Quarter Warden",
      portrait: ELITE_PORTRAIT,
      hue: 0,
      rule: WARDEN_RULES[module.id],
      dialogue: wardenTalk,
      story: wardenStory,
      kind: null
    });

    const shrineSpots = deadEnds
      .filter((p) => free(p) && !(p[0] === wardenSpot[0] && p[1] === wardenSpot[1]))
      .slice(0, 3);
    for (const tile of farFromStart) {
      if (shrineSpots.length >= 3) break;
      if (free(tile) && !(tile[0] === wardenSpot[0] && tile[1] === wardenSpot[1]) &&
          !shrineSpots.some((p) => p[0] === tile[0] && p[1] === tile[1])) {
        shrineSpots.push(tile);
      }
    }
    const shrines = shrineSpots.map((p, i) => ({ x: p[0], y: p[1], taken: false, kind: ["hint", "heal", "heart"][i % 3] }));

    const noteData = LORE_NOTES[module.id] || [];
    const noteSpots = [];
    for (const data of noteData.slice(0, 2)) {
      const spot = floor.filter((p) =>
        !enemies.some((e) => e.x === p[0] && e.y === p[1]) &&
        !shrines.some((s) => s.x === p[0] && s.y === p[1]) &&
        !(p[0] === start[0] && p[1] === start[1]) &&
        !(p[0] === castle[0] && p[1] === castle[1]) &&
        !noteSpots.some((n) => n.x === p[0] && n.y === p[1])
      ).sort((a, b) => manhattan(b, start) - manhattan(a, start))[0];
      if (spot) noteSpots.push({ x: spot[0], y: spot[1], title: data.title, en: data.en, ru: data.ru });
    }

    return {
      module,
      index,
      cols: MAP_COLS,
      rows: MAP_ROWS,
      grid,
      start,
      castle,
      branch: wardenSpot,
      enemies,
      shrines,
      notes: noteSpots.map((n, i) => ({ ...n, id: "n" + i, taken: false })),
      wardenDefeated: false,
      sealsRequired: SEALS_REQUIRED
    };
  }

  function isWalkable(level, x, y) {
    if (x < 0 || y < 0 || x >= level.cols || y >= level.rows) return false;
    return level.grid[y][x] !== "#";
  }

  function renderMap() {
    const level = state.level;
    const map = els.map;
    map.dataset.theme = level.module.theme;
    map.style.gridTemplateColumns = `repeat(${level.cols}, var(--tile))`;
    const story = STORY.modules[level.module.id] || {};
    const prop = story.sigil || "assets/props/city.svg";
    const shrineAt = (x, y) => level.shrines ? level.shrines.find((s) => !s.taken && s.x === x && s.y === y) : null;

    let html = "";
    for (let y = 0; y < level.rows; y++) {
      for (let x = 0; x < level.cols; x++) {
        const ch = level.grid[y][x];
        const variant = Math.floor(hash(x * 11 + 5, y * 13 + 7) * 4);
        if (ch === "#") {
          html += `<div class="tile t-wall" data-v="${variant}" style="--prop:url('${prop}')" data-x="${x}" data-y="${y}"></div>`;
        } else if (ch === "C") {
          html += `<div class="tile t-castle" data-x="${x}" data-y="${y}">` +
            `<img src="assets/props/castle.svg" alt=""><span class="gate-seals">${state.seals}/${level.sealsRequired}</span></div>`;
        } else if (ch === "S") {
          html += `<div class="tile t-start" data-x="${x}" data-y="${y}"><span class="start-mark"></span></div>`;
        } else {
          const shrine = shrineAt(x, y);
          const note = (level.notes || []).find((n) => !n.taken && n.x === x && n.y === y);
          if (shrine) {
            html += `<div class="tile t-shrine" data-shrine="${shrine.kind}" data-x="${x}" data-y="${y}"><img src="assets/props/shrine.svg" alt=""></div>`;
          } else if (note) {
            html += `<div class="tile t-note" data-x="${x}" data-y="${y}" title="${esc(note.title)}"><img src="assets/props/note.svg" alt=""></div>`;
          } else {
            html += `<div class="tile t-floor" data-v="${variant}" data-x="${x}" data-y="${y}"></div>`;
          }
        }
      }
    }

    html += `<div class="sprite hero" id="heroSprite" data-x="${state.hero.x}" data-y="${state.hero.y}">` +
      `<img src="assets/hero/${save.heroClass}.svg" alt=""><i class="shadow"></i></div>`;

    level.enemies.forEach((enemy) => {
      if (enemy.dead) return;
      html += `<div class="sprite enemy${enemy.elite ? " elite" : ""}${enemy.warden ? " warden" : ""}" data-enemy="${enemy.id}" data-x="${enemy.x}" data-y="${enemy.y}" title="${esc(enemy.name)}">` +
        `${enemy.warden ? '<span class="wardenMark">♛</span>' : ""}<img src="${enemy.portrait}" alt="" style="--hue:${enemy.hue || 0}deg"><i class="shadow"></i></div>`;
    });

    map.innerHTML = html;
    paintHero();
    paintEnemies();
    if (state.seals >= level.sealsRequired && level.wardenDefeated) {
      const castle = $(".t-castle", map);
      if (castle) castle.classList.add("open");
    }
  }

  function paintHero() {
    const el = $("#heroSprite");
    if (!el) return;
    el.dataset.x = state.hero.x;
    el.dataset.y = state.hero.y;
    el.style.setProperty("--x", state.hero.x);
    el.style.setProperty("--y", state.hero.y);
  }

  function paintEnemies() {
    state.level.enemies.forEach((enemy) => {
      const el = $(`[data-enemy="${enemy.id}"]`);
      if (!el) return;
      el.style.setProperty("--x", enemy.x);
      el.style.setProperty("--y", enemy.y);
    });
  }

  function fitMap() {
    if (!state.level || !els.map || !els.mapWindow) return;
    const win = els.mapWindow;
    const w = win.clientWidth;
    const h = win.clientHeight;
    if (!w || !h) return;
    const fit = Math.floor(Math.min((w - 20) / state.level.cols, (h - 20) / state.level.rows));
    let tile = fit >= 34 ? Math.min(fit, 64) : Math.round(Math.min(w / 7.2, h / 7.2));
    state.tile = clamp(tile, 28, 64);
    els.map.style.setProperty("--tile", state.tile + "px");
    centerCamera(true);
  }

  function centerCamera(instant) {
    if (!state.level || !els.map || !els.mapWindow) return;
    const border = 9;
    const mapW = state.level.cols * state.tile + border * 2;
    const mapH = state.level.rows * state.tile + border * 2;
    const winW = els.mapWindow.clientWidth;
    const winH = els.mapWindow.clientHeight;
    let x = winW / 2 - border - (state.hero.x + 0.5) * state.tile;
    let y = winH / 2 - border - (state.hero.y + 0.5) * state.tile;
    if (mapW <= winW) x = (winW - mapW) / 2;
    else x = clamp(x, winW - mapW, 0);
    if (mapH <= winH) y = (winH - mapH) / 2;
    else y = clamp(y, winH - mapH, 0);
    if (instant) els.map.style.transition = "none";
    els.map.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
    if (instant && window.requestAnimationFrame) {
      window.requestAnimationFrame(() => { els.map.style.transition = ""; });
    }
  }

  /* --------------------------------------------------------------- уровень */
  function showStory(data) {
    if (!els.storyLayer || !els.storyCard) return;
    const cls = STORY.classes[save.heroClass] || STORY.classes.mage;
    els.storyCard.innerHTML =
      '<p class="story-kicker">' + esc(data.kicker) + "</p>" +
      "<h2>" + esc(data.title) + "</h2>" +
      '<p class="story-text">' + esc(data.text) + "</p>" +
      '<p class="story-ru">' + esc(data.ru) + "</p>" +
      (data.showGoal === false ? "" : '<div class="story-goal"><b>' + esc(cls.goal) + "</b><em>" + esc(cls.goalRu) + "</em></div>") +
      '<div class="story-actions"><button class="btn primary" type="button" id="storyNext">' + esc(data.button || "Continue") + " →</button></div>";
    els.storyLayer.hidden = false;
    document.body.classList.add("dialogue-open");
    const next = $("#storyNext", els.storyCard);
    if (next) {
      next.onclick = () => {
        els.storyLayer.hidden = true;
        document.body.classList.remove("dialogue-open");
        if (data.onDone) data.onDone();
      };
    }
  }

  function openJournal() {
    if (!els.journalLayer || !els.journalCard) return;
    const id = state.module ? state.module.id : MODULES[clamp(save.unlocked - 1, 0, 9)].id;
    const module = MODULES.find((m) => m.id === id) || MODULES[0];
    const story = STORY.modules[id] || {};
    const beats = LORE_BEATS[id] || [];
    const found = save.lore[id] || [];
    const notes = save.loreNotes[id] || [];
    const echo = save.echo || { mercy: 0, defiance: 0 };
    els.journalCard.innerHTML =
      '<button class="journal-x" id="journalX" type="button" aria-label="Close journal">×</button>' +
      '<h2>Journal</h2>' +
      '<p class="journal-sub">' + esc(story.district || module.title) + " · " + found.length + " / " + beats.length + " story fragments · " + notes.length + " notes · mercy " + echo.mercy + " / defiance " + echo.defiance + "</p>" +
      '<div class="journal-section"><h3>The story of the quarter</h3>' +
        beats.map((beat, i) => {
          const open = found.includes(i);
          return '<article class="journal-fragment' + (open ? "" : " locked") + '">' +
            "<b>" + (open ? "Fragment " + (i + 1) : "Fragment " + (i + 1) + " · locked") + "</b>" +
            "<p>" + (open ? esc(beat.en) : "Defeat another Voiceless to recover this part of the story.") + "</p>" +
            (open ? "<em>" + esc(beat.ru) + "</em>" : "") +
          "</article>";
        }).join("") +
      "</div>" +
      (notes.length ? '<div class="journal-section"><h3>Lore notes</h3>' +
        notes.map((note) => '<article class="journal-fragment"><b>' + esc(note.title) + "</b><p>" + esc(note.en) + "</p><em>" + esc(note.ru) + "</em></article>").join("") +
      "</div>" : "") +
      '<div class="journal-close"><button class="btn primary" id="journalClose" type="button">Close</button></div>';
    els.journalLayer.hidden = false;
    document.body.classList.add("dialogue-open");
    $("#journalClose").onclick = () => {
      els.journalLayer.hidden = true;
      document.body.classList.remove("dialogue-open");
    };
    const journalX = $("#journalX");
    if (journalX) journalX.onclick = () => {
      els.journalLayer.hidden = true;
      document.body.classList.remove("dialogue-open");
    };
  }

  function showChapter(index) {
    if (!state.level || state.screen !== "game") return;
    const module = MODULES[index];
    if (!module) return;
    if (save.storySeen[module.id]) return;
    const story = STORY.modules[module.id] || {};
    showStory({
      kicker: "Quarter " + String(module.num).padStart(2, "0") + " · " + (story.faction || ""),
      title: story.district || module.title,
      text: (story.lore || story.hook || "") + " A Quarter Warden holds the gate. Defeat it before you enter the House of Voices.",
      ru: (story.loreRu || "") + " Ворота держит Хранитель квартала. Победи его, прежде чем войти в Дом Голосов.",
      button: "Enter the quarter",
      onDone: () => {
        save.storySeen[module.id] = true;
        persist();
      }
    });
  }

  function startLevel(index) {
    const module = MODULES[index];
    if (!module) return;

    state.module = module;
    state.level = buildLevel(module, index);
    state.hero = { x: state.level.start[0], y: state.level.start[1] };
    state.maxHearts = 3 + classOf(save.heroClass).heartBonus;
    state.hearts = state.maxHearts;
    state.score = 0;
    state.streak = 0;
    state.bestStreak = 0;
    state.seals = 0;
    state.sealsRequired = state.level.sealsRequired;
    state.eventCooldown = 0;
    state.ambushCooldown = 0;
    state.nextBoon = null;
    state.fog = 0;
    state.hintCharges = 1 + classOf(save.heroClass).hintBonus;
    state.healCharges = 1;
    state.shield = classOf(save.heroClass).shield;
    state.mistakes = [];
    state.battle = null;
    state.pool = buildLessonPool(module);

    closeBattle();
    closeDialogue();
    if (els.storyLayer) els.storyLayer.hidden = true;
    if (els.journalLayer) els.journalLayer.hidden = true;
    document.body.classList.remove("dialogue-open");
    audio.setTheme(module.theme);
    audio.playMusic("battle");
    showScreen("game");
    renderMap();
    updateHud();
    fitMap();
    if (window.requestAnimationFrame) window.requestAnimationFrame(fitMap);
    showHint(((STORY.modules[module.id] || {}).hook || "Find the House of Voices") + " · 10 seals needed", 3400);
    window.setTimeout(() => showChapter(index), 450);
  }

  function updateHud() {
    if (!state.level) return;
    const story = STORY.modules[state.module.id] || {};
    els.levelTitle.textContent = story.district || state.module.title;
    els.levelSub.textContent = "Module " + state.module.num + " · " + (story.faction || "") + " · " + state.module.grammar;
    if (els.sealVal) els.sealVal.textContent = state.seals;
    els.scoreVal.textContent = state.score;
    els.streakVal.textContent = state.streak;
    if (els.mapLegend) {
      els.mapLegend.innerHTML = '<span><b>' + state.seals + "</b> / " + state.sealsRequired + " seals</span>" +
        "<span>Warden: " + (state.level.enemies.find((e) => e.warden && !e.dead) ? "alive" : "defeated") + "</span>" +
        "<span>Lore: " + ((save.lore[state.module.id] || []).length) + " / 14</span>";
    }
    if (els.mapCaption) {
      els.mapCaption.innerHTML = "<b>" + esc(story.district || state.module.title) + "</b><span>" + esc(story.hook || "") + "</span>";
    }
    renderHearts();
    renderBuffs();
  }

  function renderHearts() {
    const html = Array.from({ length: state.maxHearts }, (_, i) =>
      `<span class="heart${i < state.hearts ? "" : " lost"}">♥</span>`
    ).join("");
    if (els.hearts) els.hearts.innerHTML = html;
    if (els.bossHearts) els.bossHearts.innerHTML = html;
    const battleHearts = $("#bHearts");
    if (battleHearts) battleHearts.innerHTML = html;
    const wardenHearts = $("#bWardenHearts");
    if (wardenHearts) wardenHearts.innerHTML = wardenHeartsHtml();
    const wardenLabel = $("#bWardenLabel");
    if (wardenLabel && state.battle && state.battle.warden) {
      wardenLabel.textContent = state.battle.wardenPhase2 ? "OATH BROKEN" : "WARDEN";
    }
  }

  function renderBuffs() {
    if (!els.buffs) return;
    const chips = [];
    if (state.streak > 0) chips.push('<span class="buff streak">streak ' + state.streak + "</span>");
    if (state.streak >= classOf(save.heroClass).streakAt) {
      chips.push('<span class="buff good">inspiration +50%</span>');
    }
    if (state.fog > 0) chips.push('<span class="buff bad">fog -25% · ' + state.fog + "</span>");
    if (state.shield > 0) chips.push('<span class="buff shield">shield</span>');
    els.buffs.innerHTML = chips.join("");
  }

  function showHint(text, ms = 2400) {
    if (!els.hint) return;
    els.hint.textContent = text;
    els.hint.classList.add("visible");
    window.clearTimeout(state.hintTimer);
    state.hintTimer = window.setTimeout(() => els.hint.classList.remove("visible"), ms);
  }

  function bump() {
    const hero = $("#heroSprite");
    if (hero) {
      hero.classList.remove("bump");
      void hero.offsetWidth;
      hero.classList.add("bump");
      window.setTimeout(() => hero.classList.remove("bump"), 260);
    }
    audio.sfx("click");
  }

  function freeTile(x, y) {
    const level = state.level;
    if (x < 0 || y < 0 || x >= level.cols || y >= level.rows) return false;
    if (x === state.hero.x && y === state.hero.y) return false;
    if (level.grid[y][x] === "#" || level.grid[y][x] === "S" || level.grid[y][x] === "C") return false;
    if (level.enemies.some((e) => !e.dead && e.x === x && e.y === y)) return false;
    if (level.shrines.some((s) => !s.taken && s.x === x && s.y === y)) return false;
    return true;
  }

  function enemyTurn() {
    // Guards are static. A fight starts only when the player walks into one.
    return;
  }

  function maybeRandomEvent() {
    if (!state.level || state.battle || state.dialogue) return;
    if (state.eventCooldown > 0) {
      state.eventCooldown--;
      return;
    }
    if (Math.random() > 0.13) return;
    const event = pick(RANDOM_EVENTS);
    state.eventCooldown = 9;
    showStory({
      kicker: "A random event",
      title: event.title,
      text: event.text,
      ru: event.ru,
      button: event.button || "Continue",
      showGoal: false,
      onDone: () => applyEvent(event)
    });
  }

  function applyEvent(event) {
    if (!event.reward) return;
    if (event.reward === "heart") {
      state.hearts = Math.min(state.maxHearts, state.hearts + 1);
      showHint("A small mercy: +1 heart", 1800);
    } else if (event.reward === "hint") {
      state.hintCharges++;
      showHint("A useful page: +1 hint", 1800);
    } else if (event.reward === "heal") {
      state.healCharges++;
      showHint("A kind word: +1 heal", 1800);
    } else if (event.reward === "score") {
      state.score += 60;
      showHint("A remembered phrase: +60 points", 1800);
    }
    updateHud();
  }

  function collectLoreNote(note) {
    const id = state.module.id;
    if (!save.loreNotes[id]) save.loreNotes[id] = [];
    if (!save.loreNotes[id].some((n) => n.title === note.title)) {
      save.loreNotes[id].push({ title: note.title, en: note.en, ru: note.ru });
      persist();
    }
  }

  function collectLore(enemy) {
    if (!enemy.story || typeof enemy.story.index !== "number") return;
    const id = state.module.id;
    if (!save.lore[id]) save.lore[id] = [];
    if (!save.lore[id].includes(enemy.story.index)) {
      save.lore[id].push(enemy.story.index);
      persist();
    }
    if (save.lore[id].length >= MAIN_ENEMIES) {
      showHint("The quarter's story is complete. Open the Journal.", 3200);
    }
  }

  function tryMove(dx, dy) {
    if (state.screen !== "game" || state.battle || state.dialogue || !state.level) return;
    if (els.storyLayer && !els.storyLayer.hidden) return;
    if (els.journalLayer && !els.journalLayer.hidden) return;
    const level = state.level;
    const nx = state.hero.x + dx;
    const ny = state.hero.y + dy;
    if (!isWalkable(level, nx, ny)) return bump();

    const enemy = level.enemies.find((e) => !e.dead && e.x === nx && e.y === ny);
    if (enemy) {
      startBattle(enemy);
      return;
    }

    const note = (level.notes || []).find((n) => !n.taken && n.x === nx && n.y === ny);
    if (note) {
      note.taken = true;
      state.hero.x = nx;
      state.hero.y = ny;
      collectLoreNote(note);
      audio.sfx("note");
      renderMap();
      centerCamera();
      showHint("Lore note added to the Journal.", 2200);
      return;
    }

    const shrine = (level.shrines || []).find((s) => !s.taken && s.x === nx && s.y === ny);
    if (shrine) {
      shrine.taken = true;
      if (shrine.kind === "heart" && state.hearts < state.maxHearts) {
        state.hearts++;
        showHint("Name shard: +1 heart", 2400);
      } else if (shrine.kind === "hint") {
        state.hintCharges++;
        showHint("Echo hint: +1 hint", 2400);
      } else {
        state.healCharges++;
        showHint("Warm trail: +1 heal", 2400);
      }
      state.hero.x = nx;
      state.hero.y = ny;
      renderMap();
      updateHud();
      centerCamera();
      audio.sfx("levelup");
      enemyTurn();
      return;
    }

    if (level.grid[ny][nx] === "C" && state.seals < level.sealsRequired) {
      showHint("Seals missing: " + state.seals + "  of " + level.sealsRequired, 2200);
      return bump();
    }
    if (level.grid[ny][nx] === "C" && !level.wardenDefeated) {
      showHint("The Quarter Warden still holds the gate.", 2200);
      return bump();
    }

    state.hero.x = nx;
    state.hero.y = ny;
    paintHero();
    centerCamera();
    audio.tone(320, 0.04, "sine", 0.02);

    if (level.grid[ny][nx] === "C") {
      completeLevel();
      return;
    }
    enemyTurn();
    if (state.battle || state.dialogue) return;
  }

  /* -------------------------------------------------------------- вопросы */
  function makeVocabQuestion(module, word, type) {
    const others = module.words.filter((w) => w.en !== word.en);
    if (type === "reverse") {
      return {
        kind: "reverse",
        word,
        prompt: "How do you say this in English?",
        options: buildOptions(word.en, others.map((w) => w.en)),
        answer: word.en
      };
    }
    if (type === "gap") {
      return {
        kind: "gap",
        word,
        prompt: word.ex,
        options: buildOptions(word.en, others.map((w) => w.en)),
        answer: word.en
      };
    }
    return {
      kind: "meaning",
      word,
      prompt: "What does this word mean?",
      options: buildOptions(word.ru, others.map((w) => w.ru)),
      answer: word.ru
    };
  }

  function makeGrammarQuestion(task) {
    return {
      kind: "grammar",
      task,
      prompt: task.text,
      options: shuffle(task.options.slice()),
      answer: task.answer,
      rule: task.rule
    };
  }

  function makeBuildQuestion(entry) {
    const tokens = entry.en.split(" ");
    let bank = shuffle(tokens.map((word, id) => ({ word, id })));
    if (tokens.length > 1 && bank.map((t) => t.word).join(" ") === entry.en) bank.push(bank.shift());
    return { kind: "build", entry, tokens, bank, placed: [], prompt: entry.ru };
  }

  function makeListenQuestion(module, item) {
    const pool = module.listen.filter((l) => l.ru !== item.ru).map((l) => l.ru);
    return {
      kind: "listen",
      word: { en: item.en, ru: item.ru },
      prompt: "Listen and choose the translation",
      options: buildOptions(item.ru, pool),
      answer: item.ru
    };
  }

  function buildQuestionPool(module) {
    const pool = [];
    const types = ["meaning", "reverse", "gap"];
    shuffle(module.words).forEach((word) => {
      pool.push(makeVocabQuestion(module, word, pick(types)));
    });
    module.grammarTasks.forEach((task) => pool.push(makeGrammarQuestion(task)));
    module.build.forEach((entry) => pool.push(makeBuildQuestion(entry)));
    const canListen = save.sound && "speechSynthesis" in window;
    if (canListen) {
      module.listen.forEach((item) => pool.push(makeListenQuestion(module, item)));
    }
    pool.forEach((q) => { q.module = module; });
    return shuffle(pool);
  }

  function buildLessonPool(module) {
    const rest = buildQuestionPool(module);
    const lesson = [];
    const take = (kinds, count) => {
      for (let i = rest.length - 1; i >= 0 && count > 0; i--) {
        if (kinds.includes(rest[i].kind)) {
          lesson.push(rest.splice(i, 1)[0]);
          count--;
        }
      }
    };
    take(["build"], 3);
    take(["listen"], 3);
    take(["grammar"], 4);
    take(["meaning", "reverse", "gap"], 4);
    while (lesson.length < 14 && rest.length) lesson.push(rest.pop());
    return shuffle(rest).concat(shuffle(lesson));
  }
  function makeLevelStories(module) {
    const story = STORY.modules[module.id] || {};
    return (LORE_BEATS[module.id] || []).slice(0, MAIN_ENEMIES).map((beat, i) => {
      const hero = HERO_REPLIES[i % HERO_REPLIES.length];
      return {
        index: i,
        mobEn: beat.en,
        mobRu: beat.ru,
        heroEn: hero.en
          .replace("{district}", (story.district || "quarter").replace(/^The /, ""))
          .replace("{faction}", (story.faction || "Voiceless").replace(/^The /, "")),
        heroRu: hero.ru
          .replace("{districtRu}", story.districtRu || "квартал")
          .replace("{factionRu}", (story.factionRu || "Безголосые").replace(/^The /, ""))
      };
    });
  }

  function makeWardenStory(module) {
    const story = STORY.modules[module.id] || {};
    return {
      mobEn: "I am the Warden of the " + (story.district || "quarter").replace(/^The /, "") + ". I have kept this gate since the first word was lost.",
      mobRu: "Я Хранитель этого квартала. Я держу эти ворота с тех пор, как потерялось первое слово.",
      heroEn: "Then open them. The city has waited long enough.",
      heroRu: "Тогда открой их. Город ждал достаточно долго."
    };
  }

  function makeGuardDialogues(module) {
    const story = STORY.modules[module.id] || {};
    const source = [
      ...(module.build || []).map((x) => ({ ...x, type: "build" })),
      ...(module.listen || []).map((x) => ({ ...x, type: "listen" }))
    ];
    const unique = [];
    const seen = new Set();
    source.forEach((item) => {
      if (!item.en || seen.has(item.en)) return;
      seen.add(item.en);
      unique.push(item);
    });
    const chosen = shuffle(unique).slice(0, MAIN_ENEMIES);
    return chosen.map((item, i) => {
      const others = shuffle(unique.filter((x) => x.ru !== item.ru).map((x) => x.ru)).slice(0, 3);
      const opener = OPENERS[i % OPENERS.length];
      const line = opener.en
        .replace("{faction}", story.faction || "Voiceless")
        .replace("{district}", story.district || "quarter");
      const ru = opener.ru
        .replace("{factionRu}", story.factionRu || "Безголосые")
        .replace("{districtRu}", story.districtRu || "квартал");
      return {
        line: line + " " + item.en,
        ru: ru + " " + item.ru,
        options: shuffle([item.ru, ...others]),
        correct: item.ru,
        explain: "Translate the whole sentence, not one word. The guard will not repeat it.",
        reward: 40
      };
    });
  }

  function makeWardenDialogue(module, story) {
    const task = (module.grammarTasks || [])[0] || { text: "The Warden waits for one correct sentence.", options: ["Wait", "Waits", "Waiting"], answer: "Waits", rule: "" };
    return {
      line: "I am the Warden of the " + (story.district || "quarter").replace(/^The /, "") + ". Finish my sentence: " + task.text,
      ru: "Я Хранитель этого квартала. Закончи моё предложение.",
      options: shuffle([...task.options]),
      correct: task.answer,
      explain: "The Warden uses the grammar of this quarter: " + module.grammar + ".",
      reward: 80
    };
  }

  function buildOptions(correct, pool) {    const distract = shuffle(pool).slice(0, 3);
    return shuffle([correct, ...distract]);
  }

  function correctText(question) {
    if (question.kind === "build") return question.entry.en;
    if (question.kind === "grammar") return question.answer;
    return question.answer;
  }

  function promptHtml(question) {
    if (question.kind === "meaning") {
      return '<p class="q-lead">What does</p><h3 class="q-word">' + esc(question.word.en) +
        '<button class="speak" type="button" data-say="' + esc(question.word.en) + '" aria-label="Listen"><svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9H4Zm12-1a5 5 0 0 1 0 8"/></svg></button></h3>';
    }
    if (question.kind === "reverse") {
      return '<p class="q-lead">How do you say it in English?</p><h3 class="q-word ru">' + esc(question.word.ru) + "</h3>";
    }
    if (question.kind === "gap") {
      return '<p class="q-lead">Fill in the missing word</p><p class="q-sentence">' +
        esc(question.word.ex).replace("___", '<span class="q-gap">…</span>') + "</p>";
    }
    if (question.kind === "grammar") {
      return '<p class="q-lead">Choose the correct form</p><p class="q-sentence">' +
        esc(question.task.text).replace("___", '<span class="q-gap">…</span>') + "</p>";
    }
    if (question.kind === "listen") {
      return '<p class="q-lead">Listen and choose the translation</p>' +
        '<div class="q-listen"><button class="play" type="button" data-play="1">▶</button>' +
        '<button class="play slow" type="button" data-play="slow">🐢</button></div>';
    }
    return '<p class="q-lead">Build the English sentence</p><p class="q-sentence ru">«' + esc(question.entry.ru) + "»</p>";
  }

  function questionBodyHtml(question) {
    if (question.kind === "build") {
      return (
        promptHtml(question) +
        '<div class="build-slots" id="buildSlots"></div>' +
        '<div class="build-bank" id="buildBank"></div>' +
        '<div class="build-actions"><button class="btn primary" id="buildCheck" type="button" disabled>Check</button></div>'
      );
    }
    return (
      promptHtml(question) +
      '<div class="options" id="options">' +
        question.options.map((opt, i) =>
          '<button class="option" type="button" data-opt="' + i + '">' +
            '<span class="key">' + "ABCD"[i] + "</span><span class=\"val\">" + esc(opt) + "</span>" +
          "</button>"
        ).join("") +
      "</div>"
    );
  }

  /* --------------------------------------------------------------- диалог */
  function startBattle(enemy, ambush = false) {
    if (!enemy) return;
    const story = enemy.story || {
      mobEn: "You are not from this quarter.",
      mobRu: "Ты не из этого квартала.",
      heroEn: "No. But I am going through it.",
      heroRu: "Нет. Но я иду через него."
    };
    state.dialogue = { enemy, story, ambush };
    els.dialogueLayer.hidden = false;
    document.body.classList.add("dialogue-open");
    renderDialogue();
    audio.sfx("click");
  }

  function renderDialogue() {
    const d = state.dialogue;
    if (!d) return;
    const enemy = d.enemy;
    const quarter = d.boss ? { faction: "House of Voices" } : (state.module ? (STORY.modules[state.module.id] || {}) : {});
    const story = d.story || {};
    const choiceSet = CLASS_CHOICES[save.heroClass] || CLASS_CHOICES.mage;
    const chosenChoice = d.choice ? choiceSet[d.choice] : null;
    els.dialogueCard.innerHTML =
      '<div class="dlgScene">' +
        '<div class="dlgPortrait' + (enemy.elite ? " elite" : "") + '">' +
          '<img src="' + enemy.portrait + '" alt="' + esc(enemy.name) + '">' +
          '<span class="dlgStamp">' + (enemy.warden ? "Warden" : enemy.elite ? "Elite" : "Voiceless") + "</span>" +
        "</div>" +
        '<div class="dlgTalk">' +
          '<div class="dlgTop"><span class="dlgName">' + esc(enemy.name) + "</span>" +
            '<span class="dlgFaction">' + esc(quarter.faction || "Quarter") + "</span></div>" +
          (d.ambush ? '<p class="dlgAmbush">AMBUSH</p>' : "") +
          '<p class="dlgLine">' + esc(story.mobEn || "") +
            ' <button class="dlgSpeak" type="button" data-sayline="' + esc(story.mobEn || "") + '" aria-label="Listen to the phrase">' +
              '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9H4Zm12-1a5 5 0 0 1 0 8"/></svg>' +
            "</button></p>" +
          '<p class="dlgRu">' + esc(story.mobRu || "") + "</p>" +
          '<div class="dlgHeroLine"><span>You</span><p>' + esc(story.heroEn || "") + "</p></div>" +
          '<p class="dlgRu">' + esc(story.heroRu || "") + "</p>" +
          (d.choice
            ? '<div class="dlgHeroLine"><span>Your answer</span><p>' +
                esc(chosenChoice.label) + "</p></div>" +
              '<p class="dlgRu">' + esc(chosenChoice.ru) + "</p>"
            : '<div class="dlgChoices">' +
                '<button type="button" data-choice="mercy"><b>' + esc(choiceSet.mercy.label) + "</b><small>" + esc(choiceSet.mercy.effect) + "</small></button>" +
                '<button type="button" data-choice="defy"><b>' + esc(choiceSet.defy.label) + "</b><small>" + esc(choiceSet.defy.effect) + "</small></button>" +
              "</div>") +
          '<div class="dlgFeedback" id="dlgFeedback">' +
            (d.choice ? '<button class="btn primary" type="button" data-go="1">' + (enemy.warden ? "Challenge the Warden →" : "Fight →") + "</button>" : "") +
          "</div>" +
        "</div>" +
      "</div>";
  }

  function chooseDialogue(choice) {
    const d = state.dialogue;
    if (!d || d.choice) return;
    d.choice = choice;
    if (!save.echo) save.echo = { mercy: 0, defiance: 0 };
    const set = CLASS_CHOICES[save.heroClass] || CLASS_CHOICES.mage;
    const picked = set[choice] || set.mercy;
    if (choice === "mercy") {
      save.echo.mercy++;
      state.score += 15;
    } else {
      save.echo.defiance++;
      state.score += 25;
    }
    state.nextBoon = picked.boon;
    persist();
    audio.sfx("choice");
    renderDialogue();
    updateHud();
  }

  function closeDialogue() {
    state.dialogue = null;
    if (els.dialogueLayer) els.dialogueLayer.hidden = true;
    document.body.classList.remove("dialogue-open");
  }

  function applyBoon(battle, boon) {
    if (!battle || !boon) return;
    if (boon === "reveal") battle.freeReveal = true;
    else if (boon === "shield") state.shield = Math.max(state.shield, 1);
    else if (boon === "streak") state.streak = Math.max(state.streak, 1);
    else if (boon === "streakGuard") battle.streakGuard = true;
    else if (boon === "card") battle.cards.push(pick(WORD_CARDS));
    state.nextBoon = null;
  }

  function beginBattle(enemy) {
    closeDialogue();
    const echo = save.echo || { mercy: 0, defiance: 0 };
    const echoShift = echo.mercy > echo.defiance ? -1 : echo.defiance > echo.mercy ? 1 : 0;
    const wardenHp = enemy.warden ? Math.max(3, enemy.wardenHp + echoShift) : 0;
    state.battle = {
      enemy,
      question: null,
      locked: false,
      wrong: 0,
      warden: !!enemy.warden,
      wardenHp,
      wardenMax: wardenHp,
      wardenPhase2: false,
      wardenRule: enemy.rule || null,
      wardenShield: 0,
      cardsLocked: false,
      noHint: false,
      cardToll: 0,
      scoreTax: 1,
      regen: false,
      cardPrice: false,
      triage: false,
      wrongDiscard: false,
      cards: dealCards(enemy.warden && echo.defiance > echo.mercy ? 4 : 3),
      cardBonus: 0,
      streakGuard: false
    };
    applyBoon(state.battle, state.nextBoon);
    audio.setTheme(state.module.theme);
    audio.playMusic(enemy.elite ? "boss" : "battle");
    if (els.battleCard) els.battleCard.classList.remove("wardenPhase2");
    els.battleLayer.hidden = false;
    document.body.classList.add("battle-open");
    audio.sfx("click");
    renderBattleCard();
    nextBattleQuestion();
  }

  function renderBattleCard() {
    const enemy = state.battle.enemy;
    const story = STORY.modules[state.module.id] || {};
    if (els.battleLayer) els.battleLayer.dataset.theme = state.module.theme || "city";
    els.battleCard.innerHTML =
      '<div class="bHead">' +
        '<div class="bPortrait' + (enemy.elite ? " elite" : "") + '"><img src="' + enemy.portrait + '" alt=""></div>' +
        '<div class="bMeta"><p class="bName">' + esc(enemy.name) + "</p>" +
          '<p class="bKind">' + (enemy.warden ? "Quarter Warden · gatekeeper" : enemy.elite ? "Seal Keeper · reward" : "Voiceless · " + esc(story.faction || "quarter")) + "</p></div>" +
        '<div class="bHearts" id="bHearts">' + heartsHtml() + "</div>" +
      "</div>" +
      (enemy.warden ? '<div class="bWarden"><span id="bWardenLabel">WARDEN</span><div class="bWardenHearts" id="bWardenHearts">' + wardenHeartsHtml() + "</div></div>" : "") +
      (enemy.warden && enemy.rule ? '<div class="bWardenRule"><b>' + esc(enemy.rule.name) + "</b> " + esc(enemy.rule.en) + "<em>" + esc(enemy.rule.ru || "") + "</em></div>" : "") +
      '<div class="bAbilities" id="bAbilities"></div>' +
      '<div class="bCards" id="bCards"></div>' +
      '<div class="bBody" id="bBody"></div>' +
      '<div class="bFoot" id="bFoot"></div>';
    renderHearts();
    renderAbilities();
    renderCards();
    els.battleCard.onclick = onBattleClick;
  }

  function heartsHtml() {
    return Array.from({ length: state.maxHearts }, (_, i) =>
      '<span class="heart' + (i < state.hearts ? "" : " lost") + '">♥</span>'
    ).join("");
  }

  function wardenHeartsHtml() {
    const battle = state.battle;
    if (!battle || !battle.warden) return "";
    return Array.from({ length: battle.wardenMax }, (_, i) =>
      '<span class="heart' + (i < battle.wardenHp ? "" : " lost") + '">♥</span>'
    ).join("");
  }

  function renderAbilities() {
    const box = $("#bAbilities", els.battleCard);
    if (!box) return;
    const parts = [];
    const battle = state.battle;
    if (state.hintCharges > 0 && !(battle && battle.noHint)) {
      parts.push('<button class="ability" type="button" data-ability="hint">Hint <b>' + state.hintCharges + "</b></button>");
    } else if (battle && battle.noHint) {
      parts.push('<span class="ability-empty">Hints sealed</span>');
    }
    if (state.healCharges > 0) {
      parts.push('<button class="ability" type="button" data-ability="heal">Heal <b>' + state.healCharges + "</b></button>");
    }
    if (state.shield > 0) {
      parts.push('<button class="ability" type="button" data-ability="shield">Shield <b>' + state.shield + "</b></button>");
    }
    box.innerHTML = parts.length ? parts.join("") : '<span class="ability-empty">No abilities left</span>';
  }

  function dealCards(count) {
    return shuffle([...WORD_CARDS]).slice(0, count);
  }

  function drawCard(battle) {
    if (!battle || battle.cards.length >= 3) return;
    battle.cards.push(pick(WORD_CARDS));
  }

  function renderCards() {
    const box = $("#bCards");
    const battle = state.battle;
    if (!box || !battle) return;
    if (battle.cardsLocked) {
      box.innerHTML = '<span class="bCardsLabel">Word cards sealed by the Warden</span>';
      return;
    }
    box.innerHTML = battle.cards.length
      ? '<span class="bCardsLabel">Word cards</span>' + battle.cards.map((card, i) =>
          '<button class="wordCard" type="button" data-card="' + i + '" title="' + esc(card.desc) + '">' +
            "<b>" + esc(card.word) + "</b><small>" + esc(card.ru) + "</small>" +
          "</button>"
        ).join("")
      : '<span class="bCardsLabel">No word cards left</span>';
  }

  function useCard(index) {
    const battle = state.battle;
    if (!battle || battle.locked) return;
    const card = battle.cards[index];
    if (!card) return;
    if (battle.cardsLocked) {
      showHint("The Warden has sealed your word cards.", 1600);
      return;
    }
    if (battle.cardPrice && state.hearts <= 1) {
      showHint("The price is too high: one heart left.", 1700);
      return;
    }
    if (card.effect === "heal" && state.hearts >= state.maxHearts) {
      showHint("You are already at full health.", 1400);
      return;
    }
    if (battle.cardPrice) {
      state.hearts = Math.max(0, state.hearts - 1);
      renderHearts();
    }
    if (battle.cardToll) state.score = Math.max(0, state.score - battle.cardToll);
    battle.cards.splice(index, 1);
    if (card.effect === "shield") {
      state.shield = Math.max(state.shield, 1);
      showHint("but: the next mistake is absorbed.", 1700);
    } else if (card.effect === "bonus") {
      battle.cardBonus = 0.5;
      showHint("because: +50% points on the next answer.", 1700);
    } else if (card.effect === "heal") {
      state.hearts = Math.min(state.maxHearts, state.hearts + 1);
      if (battle.triage && battle.warden) {
        battle.wardenHp = Math.min(battle.wardenMax, battle.wardenHp + 1);
      }
      renderHearts();
      showHint("although: one heart restored" + (battle.triage ? ", and the Warden takes one too." : "."), 1900);
    } else if (card.effect === "reveal") {
      const question = battle.question;
      if (question.kind === "build") {
        showHint('if: the first word is "' + question.tokens[0] + '".', 1900);
      } else {
        const wrongs = $$(".option", $("#bBody")).filter((btn) => {
          const val = btn.textContent.replace(/^[A-D]/, "").trim();
          return val !== question.answer && !btn.disabled;
        });
        shuffle(wrongs).slice(0, 2).forEach((btn) => {
          btn.disabled = true;
          btn.classList.add("dim");
        });
        showHint("if: two wrong answers removed.", 1700);
      }
    } else if (card.effect === "streak") {
      battle.streakGuard = true;
      showHint("yet: the next mistake will not reset your streak.", 1900);
    } else if (card.effect === "hint") {
      state.hintCharges++;
      showHint("so: one hint charge gained.", 1700);
    }
    audio.sfx("card");
    renderCards();
    renderAbilities();
  }

  function nextBattleQuestion() {
    const battle = state.battle;
    if (!battle) return;
    battle.locked = false;
    battle.wrong += 0;
    if (!state.pool || !state.pool.length) state.pool = buildQuestionPool(state.module);
    battle.question = state.pool.pop();
    drawCard(battle);
    renderQuestion(battle.question);
    if (battle.freeReveal) {
      const q = battle.question;
      if (q.kind === "build" && q.tokens) {
        showHint('Lamplighter: the first word is "' + q.tokens[0] + '".', 1800);
      } else {
        const wrongs = $$(".option", $("#bBody")).filter((btn) => {
          const val = btn.textContent.replace(/^[A-D]/, "").trim();
          return val !== q.answer && !btn.disabled;
        });
        if (wrongs.length) {
          wrongs[0].disabled = true;
          wrongs[0].classList.add("dim");
          showHint("Lamplighter: one wrong answer removed.", 1500);
        }
      }
      battle.freeReveal = false;
    }
    renderCards();
    setFoot('<p class="bHint">A correct answer opens the path.</p>');
  }

  function renderQuestion(question) {
    const body = $("#bBody");
    if (!body) return;
    body.innerHTML = questionBodyHtml(question);
    if (question.kind === "listen") {
      window.setTimeout(() => {
        if (state.battle && state.battle.question === question) speak(question.word.en, 0.9);
      }, 250);
    }
    if (question.kind === "build") paintBuild(question);
  }

  function paintBuild(question) {
    const slots = $("#buildSlots");
    const bank = $("#buildBank");
    const check = $("#buildCheck");
    if (!slots || !bank || !check) return;
    slots.innerHTML = question.placed.length
      ? question.placed.map((t, i) => '<button class="tok placed" type="button" data-slot="' + i + '">' + esc(t.word) + "</button>").join("")
      : '<span class="placeholder">Tap the words below</span>';
    bank.innerHTML = question.bank.length
      ? question.bank.map((t, i) => '<button class="tok" type="button" data-bank="' + i + '">' + esc(t.word) + "</button>").join("")
      : '<span class="placeholder">All words used</span>';
    check.disabled = question.placed.length !== question.tokens.length;
  }

  function onBattleClick(event) {
    const battle = state.battle;
    if (!battle || battle.locked) return;

    const say = event.target.closest("[data-say]");
    if (say) {
      speak(say.dataset.say);
      return;
    }
    const play = event.target.closest("[data-play]");
    if (play && battle.question.kind === "listen") {
      speak(battle.question.word.en, play.dataset.play === "slow" ? 0.65 : 0.92);
      return;
    }
    const ability = event.target.closest("[data-ability]");
    if (ability) {
      useAbility(ability.dataset.ability);
      return;
    }
    const card = event.target.closest("[data-card]");
    if (card) {
      useCard(Number(card.dataset.card));
      return;
    }

    const option = event.target.closest("[data-opt]");
    if (option && battle.question.kind !== "build") {
      const idx = Number(option.dataset.opt);
      answerOption(idx);
      return;
    }

    if (battle.question.kind === "build") {
      const bankBtn = event.target.closest("[data-bank]");
      if (bankBtn) {
        battle.question.placed.push(battle.question.bank.splice(Number(bankBtn.dataset.bank), 1)[0]);
        paintBuild(battle.question);
        return;
      }
      const slotBtn = event.target.closest("[data-slot]");
      if (slotBtn) {
        battle.question.bank.push(battle.question.placed.splice(Number(slotBtn.dataset.slot), 1)[0]);
        paintBuild(battle.question);
        return;
      }
      const check = event.target.closest("#buildCheck");
      if (check && !check.disabled) {
        const attempt = battle.question.placed.map((t) => t.word).join(" ");
        finishAnswer(attempt === battle.question.entry.en, attempt);
      }
    }
  }

  function answerOption(idx) {
    const battle = state.battle;
    if (!battle || battle.locked) return;
    const question = battle.question;
    const chosen = question.options[idx];
    const ok = chosen === question.answer;
    $$(".option", $("#bBody")).forEach((btn) => {
      btn.disabled = true;
      const val = btn.textContent.replace(/^[A-D]/, "").trim();
      if (val === question.answer) btn.classList.add("correct");
    });
    if (!ok) {
      const clicked = $$(".option", $("#bBody"))[idx];
      if (clicked) clicked.classList.add("wrong");
    }
    finishAnswer(ok, chosen);
  }

  function applyWardenRule(battle) {
    const rule = battle && battle.wardenRule;
    if (!rule) return "";
    if (rule.key === "shield") battle.wardenShield = 1;
    else if (rule.key === "noHint") battle.noHint = true;
    else if (rule.key === "noCards") battle.cardsLocked = true;
    else if (rule.key === "static") battle.wrongDiscard = true;
    else if (rule.key === "toll") battle.cardToll = 15;
    else if (rule.key === "heal") battle.wardenHp = Math.min(battle.wardenMax, battle.wardenHp + 1);
    else if (rule.key === "tax") battle.scoreTax = 0.8;
    else if (rule.key === "regen") battle.regen = true;
    else if (rule.key === "price") battle.cardPrice = true;
    else if (rule.key === "triage") battle.triage = true;
    return rule.en;
  }

  function flashBattle(kind) {
    if (!els.battleLayer) return;
    els.battleLayer.classList.remove("flash-good", "flash-bad");
    void els.battleLayer.offsetWidth;
    els.battleLayer.classList.add(kind === "good" ? "flash-good" : "flash-bad");
    window.setTimeout(() => els.battleLayer.classList.remove("flash-good", "flash-bad"), 360);
  }

  function shakeBattle() {
    if (!els.battleCard) return;
    els.battleCard.classList.remove("shake");
    void els.battleCard.offsetWidth;
    els.battleCard.classList.add("shake");
    window.setTimeout(() => els.battleCard.classList.remove("shake"), 340);
  }

  function finishAnswer(ok, chosen) {
    const battle = state.battle;
    if (!battle || battle.locked) return;
    battle.locked = true;
    const question = battle.question;

    if (ok) {
      state.streak += 1;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
      const gain = scoreFor(question);
      if (state.fog > 0) state.fog--;
      state.score += gain;
      battle.cardBonus = 0;
      audio.sfx("correct");
      flashBattle("good");
      const bonus = state.streak >= classOf(save.heroClass).streakAt ? " · inspiration" : "";
      if (battle.warden) {
        if (battle.wardenShield > 0) {
          battle.wardenShield = 0;
          renderHearts();
          setFoot(
            '<div class="verdict good">✓ The Warden\'s shield breaks. No heart lost.</div>' +
            '<button class="btn primary" id="winBtn" type="button">Strike again →</button>'
          );
          $("#winBtn").onclick = nextBattleQuestion;
          updateHud();
          return;
        }
        battle.wardenHp = Math.max(0, battle.wardenHp - 1);
        renderHearts();
        if (battle.wardenHp <= 0) {
          setFoot(
            '<div class="verdict good">✓ The Warden falls. +' + gain + " points" + bonus + "</div>" +
            '<button class="btn primary" id="winBtn" type="button">Take the gate →</button>'
          );
          $("#winBtn").onclick = winBattle;
        } else if (!battle.wardenPhase2 && battle.wardenHp <= Math.ceil(battle.wardenMax / 2)) {
          battle.wardenPhase2 = true;
          audio.sfx("phase");
          const ruleText = applyWardenRule(battle);
          renderHearts();
          renderCards();
          renderAbilities();
          els.battleCard.classList.add("wardenPhase2");
          setFoot(
            '<div class="verdict good">✓ The Warden\'s oath cracks. ' + battle.wardenHp + " / " + battle.wardenMax + " hearts left.</div>" +
            '<p class="bPhase">' + esc(ruleText || "The gate shudders. The Warden changes the rules.") + "</p>" +
            '<button class="btn primary" id="winBtn" type="button">Continue →</button>'
          );
          $("#winBtn").onclick = nextBattleQuestion;
        } else {
          setFoot(
            '<div class="verdict good">✓ Warden heart broken: ' + battle.wardenHp + " / " + battle.wardenMax +
            " left" + bonus + "</div>" +
            '<button class="btn primary" id="winBtn" type="button">Strike again →</button>'
          );
          $("#winBtn").onclick = nextBattleQuestion;
        }
        updateHud();
        return;
      }
      setFoot(
        '<div class="verdict good">✓ Correct! +' + gain + " points" + bonus + "</div>" +
        '<button class="btn primary" id="winBtn" type="button">Next →</button>'
      );
      $("#winBtn").onclick = winBattle;
    } else {
      state.mistakes.push(mistakeOf(question, chosen));
      if (battle.streakGuard) {
        battle.streakGuard = false;
        showHint("yet: your streak survives this mistake.", 1600);
      } else {
        state.streak = 0;
      }
      state.fog = 2;
      if (battle.wrongDiscard && battle.cards.length) {
        battle.cards.splice(Math.floor(Math.random() * battle.cards.length), 1);
        renderCards();
        showHint("The Warden's silence burns one of your cards.", 1800);
      }
      if (battle.regen && battle.warden && battle.wardenPhase2) {
        battle.wardenHp = Math.min(battle.wardenMax, battle.wardenHp + 1);
        renderHearts();
        showHint("The Warden regrows a heart.", 1600);
      }
      audio.sfx("wrong");
      flashBattle("bad");
      shakeBattle();
      if (state.shield > 0) {
        state.shield = 0;
        setFoot(
          '<div class="verdict shield">Shield absorbed the hit</div>' +
          '<button class="btn primary" id="battleRetry" type="button">Try again</button>'
        );
        $("#battleRetry").onclick = nextBattleQuestion;
      } else {
        state.hearts = Math.max(0, state.hearts - 1);
        if (state.hearts <= 0) {
          setFoot(
            '<div class="verdict bad">× No hearts left. Correct: ' + esc(correctText(question)) + "</div>" +
            '<button class="btn danger" id="loseBtn" type="button">See result</button>'
          );
          $("#loseBtn").onclick = () => {
            closeBattle();
            finishLevel(false);
          };
        } else {
          setFoot(
            '<div class="verdict bad">× Not quite. Correct: <b>' + esc(correctText(question)) + "</b>" +
            (question.module ? "<small>" + esc(question.module.grammar) + "</small>" : "") + "</div>" +
            '<button class="btn primary" id="battleRetry" type="button">Try again</button>'
          );
          $("#battleRetry").onclick = nextBattleQuestion;
        }
      }
      renderHearts();
      renderBuffs();
    }
    updateHud();
  }

  function scoreFor(question) {
    let base = question.kind === "build" || question.kind === "grammar" ? 120 : 100;
    if (state.streak >= classOf(save.heroClass).streakAt) base = Math.round(base * 1.5);
    if (state.fog > 0) base = Math.round(base * 0.75);
    if (state.battle && state.battle.cardBonus) base = Math.round(base * 1.5);
    if (state.battle && state.battle.scoreTax && state.battle.scoreTax < 1) base = Math.round(base * state.battle.scoreTax);
    if (state.battle && state.battle.enemy.elite) base *= 3;
    return base;
  }

  function mistakeOf(question, chosen) {
    const q = question;
    let prompt = "";
    if (q.kind === "meaning") prompt = q.word.en + " - translation";
    else if (q.kind === "reverse") prompt = q.word.ru + " - in English";
    else if (q.kind === "gap") prompt = q.word.ex.replace("___", "…");
    else if (q.kind === "grammar") prompt = q.task.text.replace("___", "…");
    else if (q.kind === "build") prompt = "Build: " + q.entry.ru;
    else prompt = "Listening: " + q.word.en;
    return {
      module: state.module.num + ". " + state.module.title,
      prompt,
      chosen: String(chosen || ""),
      correct: correctText(q),
      rule: q.module ? q.module.grammar : (q.word ? "Translation: " + q.word.ru : "")
    };
  }

  function useAbility(kind) {
    const battle = state.battle;
    if (!battle || battle.locked) return;
    if (kind === "hint" && state.hintCharges > 0) {
      const question = battle.question;
      if (question.kind === "build") {
        showHint('Hint: first word - "' + question.tokens[0] + '"', 1800);
        state.hintCharges--;
      } else {
        const wrongs = $$(".option", $("#bBody")).filter((btn) => {
          const val = btn.textContent.replace(/^[A-D]/, "").trim();
          return val !== question.answer && !btn.disabled;
        });
        shuffle(wrongs).slice(0, 2).forEach((btn) => {
          btn.disabled = true;
          btn.classList.add("dim");
        });
        state.hintCharges--;
      }
      audio.sfx("click");
      renderAbilities();
    } else if (kind === "heal" && state.healCharges > 0) {
      if (state.hearts < state.maxHearts) {
        state.hearts++;
        if (battle.triage && battle.warden) {
          battle.wardenHp = Math.min(battle.wardenMax, battle.wardenHp + 1);
        }
        state.healCharges--;
        renderHearts();
        renderAbilities();
        audio.sfx("levelup");
      }
    } else if (kind === "shield") {
      showHint("Shield is already active", 1200);
    }
  }

  function setFoot(html) {
    const foot = $("#bFoot");
    if (foot) foot.innerHTML = html;
  }

  function winBattle() {
    const battle = state.battle;
    if (!battle) return;
    const enemy = battle.enemy;
    enemy.dead = true;
    const el = $(`[data-enemy="${enemy.id}"]`);
    if (el) {
      el.classList.add("defeated");
      window.setTimeout(() => el.remove(), 500);
    }
    closeBattle();
    if (enemy.warden) {
      state.level.wardenDefeated = true;
      showHint("Quarter Warden defeated. The gate can open.", 2800);
    } else if (!enemy.elite || state.seals < state.sealsRequired) {
      state.seals = Math.min(state.sealsRequired, state.seals + 1);
    }
    state.hero.x = enemy.x;
    state.hero.y = enemy.y;
    paintHero();
    centerCamera();
    if (enemy.elite) {
      grantEliteReward(enemy);
    } else {
      collectLore(enemy);
    }
    updateHud();
    if (state.seals >= state.sealsRequired && state.level.wardenDefeated) {
      const castle = $(".t-castle");
      if (castle) castle.classList.add("open");
      showHint("Ten seals and the Warden. The House of Voices is open.", 3000);
    } else if (!state.level.wardenDefeated) {
      showHint("The Quarter Warden still holds the gate.", 2400);
    } else {
      showHint("Seal " + state.seals + "  of " + state.sealsRequired + " · look for another route", 2000);
    }
  }

  function grantEliteReward(enemy) {
    const reward = pick(["heart", "hint", "heal"]);
    const label = enemy && enemy.warden ? "Warden" : "Elite";
    if (reward === "heart" && state.hearts < state.maxHearts) {
      state.hearts++;
      showHint(label + " defeated: +1 heart", 2600);
    } else if (reward === "hint") {
      state.hintCharges++;
      showHint(label + " defeated: +1 hint", 2600);
    } else {
      state.healCharges++;
      showHint(label + " defeated: +1 heal", 2600);
    }
    audio.sfx("levelup");
  }

  function closeBattle() {
    state.battle = null;
    if (els.battleLayer) els.battleLayer.hidden = true;
    document.body.classList.remove("battle-open");
  }

  /* -------------------------------------------------------------- результат */
  function completeLevel() {
    finishLevel(true);
  }

  function finishLevel(won) {
    if (!state.level) return;
    const module = state.module;
    let stars = 0;

    if (won) {
      stars = state.mistakes.length === 0 ? 3 : state.mistakes.length <= 2 ? 2 : 1;
      save.stars[module.id] = Math.max(save.stars[module.id] || 0, stars);
      save.best[module.id] = Math.max(save.best[module.id] || 0, state.score);
      save.unlocked = Math.max(save.unlocked, Math.min(11, state.level.index + 2));
      save.totalScore = (save.totalScore || 0) + state.score;
      save.lastMistakes = state.mistakes.slice(0, 40);
      persist();
      audio.setTheme("city");
      audio.playMusic("menu");
      audio.sfx("victory");
    } else {
      save.lastMistakes = state.mistakes.slice(0, 40);
      persist();
      audio.sfx("defeat");
    }

    const story = STORY.modules[module.id] || {};
    els.resultZone.innerHTML =
      '<div class="result-card ' + (won ? "win" : "lose") + '">' +
        '<img class="result-seal" src="assets/props/shrine.svg" alt="">' +
        '<p class="kicker">Quarter ' + module.num + " · " + esc(story.faction || module.title) + "</p>" +
        "<h1>" + (won ? "Seal returned" : "Not enough words") + "</h1>" +
        '<p class="result-text">' + (won
          ? esc(story.outro || "The quarter can hear words again.")
          : "No hearts left. The Voiceless keep the Seal. Review your mistakes and return.") + "</p>" +
        (won && story.outroRu ? '<p class="result-ru">' + esc(story.outroRu) + "</p>" : "") +
        (won ? '<div class="stars-row">' + starsRow(stars) + "</div>" : "") +
        '<div class="result-stats">' +
          "<div><b>" + state.score + "</b><small>points</small></div>" +
          "<div><b>" + state.seals + "</b><small>seals</small></div>" +
          "<div><b>" + state.bestStreak + "</b><small>best streak</small></div>" +
        "</div>" +
        '<div class="result-actions">' +
          (won
            ? '<button class="btn primary" type="button" id="nextBtn">' + (state.level.index >= 9 ? "To the Grey Whisper →" : "Next quarter →") + "</button>"
            : '<button class="btn primary" type="button" id="retryBtn">Try again</button>') +
          '<button class="btn ghost" type="button" id="reviewBtn2">Review mistakes' + (state.mistakes.length ? " (" + state.mistakes.length + ")" : "") + "</button>" +
          '<button class="btn ghost" type="button" id="mapBtn">Menu</button>' +
        "</div>" +
      "</div>";
    showScreen("result");
    if (els.reviewBtn) els.reviewBtn.disabled = !save.lastMistakes.length;

    const next = $("#nextBtn");
    if (next) next.onclick = () => {
      if (state.level.index >= 9) startBoss();
      else startLevel(state.level.index + 1);
    };
    const retry = $("#retryBtn");
    if (retry) retry.onclick = () => startLevel(state.level.index);
    const map = $("#mapBtn");
    if (map) map.onclick = goMenu;
    const review = $("#reviewBtn2");
    if (review) review.onclick = () => openReview(state.mistakes, won ? "Module mistakes" : "Review mistakes");
  }

  /* ------------------------------------------------------------------ босс */
  function startBoss() {
    if (save.unlocked < 11) return;
    const talk = STORY.boss;
    state.dialogue = {
      boss: true,
      enemy: { id: "boss", name: talk.name, portrait: BOSS_PORTRAIT, elite: true },
      story: {
        mobEn: talk.line,
        mobRu: talk.ru,
        heroEn: "I came to finish the sentence.",
        heroRu: "Я пришёл закончить предложение."
      }
    };
    els.dialogueLayer.hidden = false;
    document.body.classList.add("dialogue-open");
    renderDialogue();
  }

  function startBossBattle() {
    const echo = save.echo || { mercy: 0, defiance: 0 };
    const bossHp = BOSS_HP + (echo.defiance > echo.mercy ? 2 : echo.mercy > echo.defiance ? -2 : 0);
    state.boss = {
      hp: bossHp,
      maxHp: bossHp,
      hearts: 5,
      maxHearts: 5,
      streak: 0,
      question: null,
      locked: false,
      phase: 0,
      opening: true,
      silenced: false,
      theft: false,
      lastPage: false,
      lastShield: 0,
      lastShieldApplied: false,
      doubleDamage: false,
      streakGuard: false,
      freeReveal: false,
      mistakes: []
    };
    const boon = state.nextBoon;
    state.nextBoon = null;
    state.hearts = 5;
    state.maxHearts = 5;
    state.score = 0;
    state.streak = 0;
    state.fog = 0;
    state.hintCharges = 2;
    state.healCharges = 1;
    state.shield = classOf(save.heroClass).shield;
    if (boon === "shield") state.shield = Math.max(state.shield, 1);
    if (boon === "streak") state.streak = 1;
    if (boon === "streakGuard") state.boss.streakGuard = true;
    if (boon === "reveal") state.boss.freeReveal = true;
    if (boon === "card") state.hintCharges = 3;
    state.bossPool = shuffle(MODULES.flatMap((m) => buildQuestionPool(m)));
    applyBossPhase(state.boss, 0);
    audio.playMusic("boss");
    showScreen("boss");
    renderBoss();
    nextBossQuestion();
  }

  function applyBossPhase(boss, phase) {
    boss.phase = phase;
    boss.opening = phase === 0;
    boss.silenced = phase === 1;
    boss.theft = phase === 2;
    boss.lastPage = phase === 3;
    if (phase === 3 && !boss.lastShieldApplied) {
      boss.lastShield = 1;
      boss.lastShieldApplied = true;
      boss.doubleDamage = true;
    }
  }

  function renderBoss() {
    const boss = state.boss;
    if (!boss) return;
    els.bossHearts.innerHTML = Array.from({ length: boss.maxHearts }, (_, i) =>
      '<span class="heart' + (i < boss.hearts ? "" : " lost") + '">♥</span>'
    ).join("");
    els.bossScore.textContent = state.score;
    const pct = (boss.hp / boss.maxHp) * 100;
    els.bossHpFill.style.width = pct + "%";
    els.bossHpText.textContent = boss.hp + " / " + boss.maxHp;
    els.bossCard.dataset.phase = boss.phase;
    els.bossCard.classList.toggle("bossSilenced", !!boss.silenced);
    els.bossCard.classList.toggle("bossLastPage", !!boss.lastPage);
    if (els.bossPhase) {
      const numeral = ["I", "II", "III", "IV"][boss.phase] || "I";
      els.bossPhase.textContent = "Phase " + numeral + " · " + (BOSS_PHASES[boss.phase] || BOSS_PHASES[0]).name;
    }
    renderBossAbilities();
  }

  function renderBossAbilities() {
    if (!els.bossAbilities) return;
    const boss = state.boss;
    const parts = [];
    if (boss && boss.silenced) {
      parts.push('<span class="ability-empty">Silence: hints and heals sealed</span>');
    } else {
      if (state.hintCharges > 0) {
        parts.push('<button class="ability" type="button" data-ability="hint">Hint <b>' + state.hintCharges + "</b></button>");
      }
      if (state.healCharges > 0) {
        parts.push('<button class="ability" type="button" data-ability="heal">Heal <b>' + state.healCharges + "</b></button>");
      }
    }
    if (state.shield > 0) {
      parts.push('<button class="ability" type="button" data-ability="shield">Shield <b>' + state.shield + "</b></button>");
    }
    els.bossAbilities.innerHTML = parts.join("");
  }

  function useBossAbility(kind) {
    const boss = state.boss;
    if (!boss || boss.locked) return;
    if (boss.silenced && (kind === "hint" || kind === "heal")) {
      showHint("The Silence seals that ability.", 1500);
      return;
    }
    if (kind === "hint" && state.hintCharges > 0) {
      const q = boss.question;
      if (q.kind === "build") {
        showHint('Hint: first word - "' + q.tokens[0] + '"', 1800);
      } else {
        const wrongs = $$(".option", els.bossQuestion).filter((btn) => {
          const val = btn.textContent.replace(/^[A-D]/, "").trim();
          return val !== q.answer && !btn.disabled;
        });
        shuffle(wrongs).slice(0, 2).forEach((btn) => {
          btn.disabled = true;
          btn.classList.add("dim");
        });
      }
      state.hintCharges--;
      audio.sfx("click");
      renderBossAbilities();
    } else if (kind === "heal" && state.healCharges > 0) {
      if (boss.hearts < boss.maxHearts) {
        boss.hearts++;
        state.hearts = boss.hearts;
        state.healCharges--;
        renderBoss();
        audio.sfx("levelup");
      }
    } else if (kind === "shield") {
      showHint("Shield is already active", 1200);
    }
  }

  function nextBossQuestion() {
    const boss = state.boss;
    if (!boss) return;
    boss.locked = false;
    if (!state.bossPool || !state.bossPool.length) {
      state.bossPool = shuffle(MODULES.flatMap((m) => buildQuestionPool(m)));
    }
    const question = state.bossPool.pop();
    boss.question = question;
    boss.module = question.module || MODULES[0];
    renderBossQuestion();
    if (boss.freeReveal) {
      if (question.kind === "build" && question.tokens) {
        showHint('Lamplighter: the first word is "' + question.tokens[0] + '".', 1800);
      } else {
        const wrongs = $$(".option", els.bossQuestion).filter((btn) => {
          const val = btn.textContent.replace(/^[A-D]/, "").trim();
          return val !== question.answer && !btn.disabled;
        });
        if (wrongs.length) {
          wrongs[0].disabled = true;
          wrongs[0].classList.add("dim");
          showHint("Lamplighter: one wrong answer removed.", 1500);
        }
      }
      boss.freeReveal = false;
    }
  }

  function renderBossQuestion() {
    const boss = state.boss;
    const q = boss.question;
    const phase = BOSS_PHASES[boss.phase] || BOSS_PHASES[0];
    els.bossQuestion.innerHTML =
      '<div class="bossPhaseHint"><b>' + esc(phase.name) + "</b> " + esc(phase.en) + "<em>" + esc(phase.ru || "") + "</em></div>" +
      '<div class="boss-q-head"><span class="chip">Module ' + boss.module.num + "</span>" +
        '<span class="boss-q-kind">' + kindLabel(q.kind) + "</span></div>" +
      questionBodyHtml(q);
    if (q.kind === "listen") {
      window.setTimeout(() => { if (state.boss && state.boss.question === q) speak(q.word.en, 0.9); }, 250);
    }
    if (q.kind === "build") paintBossBuild(q);
    els.bossQuestion.onclick = onBossClick;
  }

  function kindLabel(kind) {
    return { grammar: "Grammar", gap: "Vocabulary", meaning: "Translation", reverse: "English", build: "Sentence", listen: "Listening" }[kind] || "";
  }

  function paintBossBuild(q) {
    const slots = $("#buildSlots", els.bossQuestion);
    const bank = $("#buildBank", els.bossQuestion);
    const check = $("#buildCheck", els.bossQuestion);
    if (!slots || !bank || !check) return;
    slots.innerHTML = q.placed.length
      ? q.placed.map((t, i) => '<button class="tok placed" type="button" data-slot="' + i + '">' + esc(t.word) + "</button>").join("")
      : '<span class="placeholder">Tap the words below</span>';
    bank.innerHTML = q.bank.length
      ? q.bank.map((t, i) => '<button class="tok" type="button" data-bank="' + i + '">' + esc(t.word) + "</button>").join("")
      : '<span class="placeholder">All words used</span>';
    check.disabled = q.placed.length !== q.tokens.length;
  }

  function onBossClick(event) {
    const boss = state.boss;
    if (!boss || boss.locked) return;
    const q = boss.question;

    const say = event.target.closest("[data-say]");
    if (say) { speak(say.dataset.say); return; }
    const play = event.target.closest("[data-play]");
    if (play && q.kind === "listen") { speak(q.word.en, play.dataset.play === "slow" ? 0.65 : 0.92); return; }

    if (q.kind === "build") {
      const bankBtn = event.target.closest("[data-bank]");
      if (bankBtn) { q.placed.push(q.bank.splice(Number(bankBtn.dataset.bank), 1)[0]); paintBossBuild(q); return; }
      const slotBtn = event.target.closest("[data-slot]");
      if (slotBtn) { q.bank.push(q.placed.splice(Number(slotBtn.dataset.slot), 1)[0]); paintBossBuild(q); return; }
      const check = event.target.closest("#buildCheck");
      if (check && !check.disabled) {
        const attempt = q.placed.map((t) => t.word).join(" ");
        bossAnswer(attempt === q.entry.en, attempt);
      }
      return;
    }

    const option = event.target.closest("[data-opt]");
    if (!option) return;
    const idx = Number(option.dataset.opt);
    const chosen = q.options[idx];
    const ok = chosen === q.answer;
    $$(".option", els.bossQuestion).forEach((btn) => {
      btn.disabled = true;
      const val = btn.textContent.replace(/^[A-D]/, "").trim();
      if (val === q.answer) btn.classList.add("correct");
    });
    if (!ok) {
      const clicked = $$(".option", els.bossQuestion)[idx];
      if (clicked) clicked.classList.add("wrong");
    }
    bossAnswer(ok, chosen);
  }

  function bossAnswer(ok, chosen) {
    const boss = state.boss;
    if (!boss || boss.locked) return;
    boss.locked = true;
    const q = boss.question;

    if (ok) {
      if (boss.lastPage && boss.lastShield > 0) {
        boss.lastShield = 0;
        state.score += 100;
        renderBoss();
        els.bossQuestion.innerHTML =
          '<div class="boss-hit good">The last page turns. The shield breaks. +100 points</div>' +
          '<p class="boss-rule">' + esc(q.module ? q.module.grammar : "") + "</p>" +
          '<button class="btn primary" id="bossNext" type="button">Now finish it →</button>';
        $("#bossNext").onclick = nextBossQuestion;
        updateHud();
        return;
      }
      state.streak++;
      boss.streak = state.streak;
      const dmg = 1 + (state.streak >= 3 ? 1 : 0);
      boss.hp = Math.max(0, boss.hp - dmg);
      const oldPhase = boss.phase;
      const newPhase = boss.hp <= 5 ? 3 : boss.hp <= 10 ? 2 : boss.hp <= 15 ? 1 : 0;
      if (newPhase > oldPhase) applyBossPhase(boss, newPhase);
      let gain = 200 * dmg;
      if (boss.opening) gain += 50;
      if (boss.theft) gain -= 40;
      state.score = Math.max(0, state.score + gain);
      audio.sfx("hit");
      renderBoss();
      const phaseText = newPhase > oldPhase ? BOSS_PHASES[newPhase] : null;
      els.bossQuestion.innerHTML =
        '<div class="boss-hit">Damage ' + dmg + ". The Whisper has " + boss.hp + " HP · +" + gain + " points</div>" +
        (phaseText ? '<p class="bossPhaseLine">' + esc(phaseText.name) + ": " + esc(phaseText.en) + "<em>" + esc(phaseText.ru) + "</em></p>" : "") +
        '<p class="boss-rule">' + esc(q.module ? q.module.grammar : "") + "</p>" +
        '<button class="btn primary" id="bossNext" type="button">' + (boss.hp <= 0 ? "Finish the fight" : "Next →") + "</button>";
      $("#bossNext").onclick = () => {
        if (boss.hp <= 0) return finishBoss(true);
        nextBossQuestion();
      };
    } else {
      if (boss.streakGuard) {
        boss.streakGuard = false;
      } else {
        state.streak = 0;
      }
      state.fog = 2;
      boss.mistakes.push(mistakeOfBoss(q, chosen));
      if (state.shield > 0) {
        state.shield = 0;
        els.bossQuestion.innerHTML =
          '<div class="boss-hit good">Shield absorbed the Whisper attack</div>' +
          '<p class="boss-rule">' + esc(q.module ? q.module.grammar : "") + "</p>" +
          '<button class="btn primary" id="bossNext" type="button">Next →</button>';
        $("#bossNext").onclick = nextBossQuestion;
      } else {
        const loss = boss.doubleDamage ? 2 : 1;
        boss.hearts = Math.max(0, boss.hearts - loss);
        state.hearts = boss.hearts;
        boss.hp = Math.min(boss.maxHp, boss.hp + 1);
        audio.sfx("wrong");
        flashBattle("bad");
        shakeBattle();
        renderBoss();
        if (boss.hearts <= 0) {
          els.bossQuestion.innerHTML =
            '<div class="boss-hit bad">× The Whisper won. Correct: <b>' + esc(correctText(q)) + "</b></div>" +
            '<button class="btn danger" id="bossLose" type="button">See result</button>';
          $("#bossLose").onclick = () => finishBoss(false);
        } else {
          els.bossQuestion.innerHTML =
            '<div class="boss-hit bad">× Wrong. The Whisper takes words. Correct: <b>' + esc(correctText(q)) + "</b>" +
            '<small>' + esc(q.module ? q.module.grammar : "") + "</small></div>" +
            '<button class="btn primary" id="bossNext" type="button">Try again</button>';
          $("#bossNext").onclick = nextBossQuestion;
        }
      }
    }
    renderBoss();
  }

  function mistakeOfBoss(q, chosen) {
    return {
      module: "Final · all modules",
      prompt: q.kind === "build" ? "Build: " + q.entry.ru : q.kind === "grammar" ? q.task.text : q.word.ex || q.word.en,
      chosen: String(chosen || ""),
      correct: correctText(q),
      rule: q.module ? q.module.grammar : (q.word ? "Translation: " + q.word.ru : "")
    };
  }

  function finishBoss(won) {
    const boss = state.boss;
    if (!boss) return;
    if (won) {
      save.completed = true;
      save.totalScore = (save.totalScore || 0) + state.score;
      save.lastMistakes = boss.mistakes.slice(0, 40);
      persist();
      audio.sfx("victory");
      renderEnding();
      showScreen("ending");
    } else {
      save.lastMistakes = boss.mistakes.slice(0, 40);
      persist();
      audio.sfx("defeat");
      els.resultZone.innerHTML =
        '<div class="result-card lose">' +
          '<div class="result-seal">◈</div>' +
          '<p class="kicker">House of Voices · ' + esc(STORY.boss.name) + "</p>" +
          "<h1>The Whisper was stronger</h1>" +
          '<p class="result-text">You reached the last page. Review your mistakes and return: the city needs one whole sentence.</p>' +
          '<div class="result-stats"><div><b>' + state.score + "</b><small>points</small></div>" +
            "<div><b>" + boss.hp + "</b><small>Whisper HP left</small></div></div>" +
          '<div class="result-actions">' +
            '<button class="btn primary" id="bossRetry" type="button">Try again</button>' +
            '<button class="btn ghost" id="bossReview" type="button">Review mistakes</button>' +
            '<button class="btn ghost" id="bossMap" type="button">Menu</button>' +
          "</div>" +
        "</div>";
      showScreen("result");
      $("#bossRetry").onclick = startBoss;
      $("#bossReview").onclick = () => openReview(boss.mistakes, "Final mistakes");
      $("#bossMap").onclick = goMenu;
    }
  }

  function renderEnding() {
    const totalStars = Object.values(save.stars).reduce((a, b) => a + b, 0);
    const rank = totalStars >= 26 ? "S" : totalStars >= 20 ? "A" : totalStars >= 12 ? "B" : "C";
    const story = STORY.boss;
    const heroStory = STORY.classes[save.heroClass] || STORY.classes.mage;
    const echo = save.echo || { mercy: 0, defiance: 0 };
    const echoPath = echo.mercy > echo.defiance
      ? { en: "You listened more than you fought. The city remembers your patience.", ru: "Ты слушал больше, чем сражался. Город запомнил твоё терпение." }
      : echo.defiance > echo.mercy
        ? { en: "You took the words back by force. The city remembers your resolve.", ru: "Ты вернул слова силой. Город запомнил твою решимость." }
        : { en: "You walked the middle road. The city remembers both your mercy and your resolve.", ru: "Ты шёл средним путём. Город запомнил и твоё милосердие, и решимость." };
    els.endingZone.innerHTML =
      '<div class="ending-card">' +
        '<div class="ending-glow"></div>' +
        '<img class="ending-avatar" src="assets/hero/' + save.heroClass + '.svg" alt="">' +
        '<p class="kicker">House of Voices · The Whisper breathed out the words</p>' +
        "<h1>The city spoke</h1>" +
        '<p class="ending-text">' + esc(save.name || "Wordcatcher") + ", " + esc(story.outro) + "</p>" +
        (story.outroRu ? '<p class="ending-ru">' + esc(story.outroRu) + "</p>" : "") +
        '<p class="ending-class">' + esc(heroStory.ending) + "</p>" +
        '<p class="ending-ru">' + esc(heroStory.endingRu) + "</p>" +
        '<p class="ending-path">' + esc(echoPath.en) + "</p>" +
        '<p class="ending-ru">' + esc(echoPath.ru) + "</p>" +
        '<div class="ending-stars">' + totalStars + " / 30 ★</div>" +
        '<div class="ending-stats">' +
          "<div><b>" + (save.totalScore || 0) + "</b><small>total points</small></div>" +
          "<div><b>" + totalStars + "</b><small>stars</small></div>" +
          "<div><b>" + rank + "</b><small>rank</small></div>" +
        "</div>" +
        '<div class="ending-actions">' +
          '<button class="btn primary" id="endingReview" type="button">Review mistakes</button>' +
          '<button class="btn ghost" id="endingMap" type="button">Menu</button>' +
        "</div>" +
      "</div>";
    $("#endingReview").onclick = () => openReview(save.lastMistakes, "Final review");
    $("#endingMap").onclick = goMenu;
    audio.sfx("victory");
  }

  /* --------------------------------------------------------------- разбор */
  function openReview(list, title) {
    const items = (list || []).slice();
    els.reviewZone.innerHTML =
      '<div class="review-head">' +
        '<button class="icon-btn" id="reviewBack" type="button">←</button>' +
        '<h2>' + esc(title || "Review mistakes") + "</h2>" +
      "</div>" +
      (items.length
        ? '<div class="review-list">' + items.map((m) =>
            '<div class="review-item">' +
              '<p class="review-module">' + esc(m.module) + "</p>" +
              '<p class="review-prompt">' + esc(m.prompt) + "</p>" +
              '<p class="review-correct">Correct: <b>' + esc(m.correct) + "</b></p>" +
              (m.chosen ? '<p class="review-chosen">Your answer: ' + esc(m.chosen) + "</p>" : "") +
              (m.rule ? '<p class="review-rule">' + esc(m.rule) + "</p>" : "") +
            "</div>"
          ).join("") + "</div>"
        : '<p class="review-empty">No mistakes - good work!</p>');
    $("#reviewBack").onclick = () => {
      if (state.screen === "review") goMenu();
    };
    showScreen("review");
  }

  /* -------------------------------------------------------------- события */
  document.addEventListener("pointerdown", () => audio.unlock(), { once: true });
  document.addEventListener("keydown", () => audio.unlock(), { once: true });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (state.screen === "game" && !state.battle) {
        if (state.level && state.level.enemies.some((e) => e.dead)) {
          if (!window.confirm("Leave the level? Progress will not be saved.")) return;
        }
        goMenu();
      } else if (state.screen === "review") {
        goMenu();
      }
      return;
    }
    if (state.screen !== "game" || state.battle) return;
    const moves = {
      arrowup: [0, -1], w: [0, -1], "ц": [0, -1],
      arrowdown: [0, 1], s: [0, 1], "ы": [0, 1],
      arrowleft: [-1, 0], a: [-1, 0], "ф": [-1, 0],
      arrowright: [1, 0], d: [1, 0], "в": [1, 0]
    };
    const dir = moves[event.key.toLowerCase()];
    if (dir) {
      event.preventDefault();
      tryMove(dir[0], dir[1]);
    }
  });

  // меню: уровни
  els.levelPath.addEventListener("click", (event) => {
    const bossBtn = event.target.closest("[data-boss]");
    if (bossBtn) {
      if (save.unlocked >= 11) startBoss();
      return;
    }
    const btn = event.target.closest("[data-level]");
    if (!btn || btn.disabled) return;
    startLevel(Number(btn.dataset.level));
  });

  els.continueBtn.onclick = () => {
    if (save.completed) {
      if (!window.confirm("Start over? Stars remain.")) return;
      startLevel(0);
      return;
    }
    if (save.unlocked >= 11) {
      startBoss();
      return;
    }
    startLevel(clamp(save.unlocked - 1, 0, 9));
  };

  els.reviewBtn.onclick = () => openReview(save.lastMistakes, "Review mistakes");
  if (els.journalBtn) els.journalBtn.onclick = openJournal;
  if (els.menuJournal) els.menuJournal.onclick = openJournal;

  els.nameInput.addEventListener("input", () => {
    save.name = els.nameInput.value.slice(0, 14) || "Wordcatcher";
    persist();
    els.heroName.textContent = save.name;
  });

  if (els.classPicker) {
    els.classPicker.addEventListener("click", (event) => {
      const cls = event.target.closest("[data-class]");
      if (!cls) return;
      save.heroClass = cls.dataset.class;
      persist();
      renderMenu();
      audio.sfx("click");
    });
  }

  els.musicBtn.onclick = () => {
    save.music = !save.music;
    persist();
    updateAudioButtons();
    if (save.music) {
      const mode = state.screen === "game" ? "battle" : state.screen === "boss" ? "boss" : "menu";
      audio.playMusic(mode);
    } else {
      audio.stopMusic();
    }
  };

  els.soundBtn.onclick = () => {
    save.sound = !save.sound;
    persist();
    updateAudioButtons();
    if (save.sound) audio.sfx("click");
  };

  const resetProgress = $("#resetProgress");
  if (resetProgress) {
    resetProgress.onclick = () => {
      if (!window.confirm("Erase progress, stars and mistakes?")) return;
      save = JSON.parse(JSON.stringify(DEFAULT_SAVE));
      persist();
      renderMenu();
    };
  }

  function updateAudioButtons() {
    if (els.musicBtn) {
      els.musicBtn.classList.toggle("muted", !save.music);
      els.musicBtn.setAttribute("aria-pressed", save.music ? "true" : "false");
    }
    if (els.soundBtn) {
      els.soundBtn.classList.toggle("muted", !save.sound);
      els.soundBtn.setAttribute("aria-pressed", save.sound ? "true" : "false");
    }
  }

  $("#quitBtn").onclick = () => {
    if (state.level && state.level.enemies.some((e) => e.dead)) {
      if (!window.confirm("Leave the level? Progress will not be saved.")) return;
    }
    goMenu();
  };

  $("#bossQuit").onclick = () => {
    if (window.confirm("Leave the House of Voices?")) {
      state.boss = null;
      goMenu();
    }
  };

  if (els.dialogueCard) {
    els.dialogueCard.addEventListener("click", (event) => {
      const sayline = event.target.closest("[data-sayline]");
      if (sayline) {
        speak(sayline.dataset.sayline, 0.88);
        return;
      }
      const choice = event.target.closest("[data-choice]");
      if (choice && state.dialogue && !state.dialogue.choice) {
        chooseDialogue(choice.dataset.choice);
        return;
      }
      const go = event.target.closest("[data-go]");
      if (go && state.dialogue) {
        const wasBoss = !!state.dialogue.boss;
        const enemy = state.dialogue.enemy;
        closeDialogue();
        if (wasBoss) startBossBattle();
        else beginBattle(enemy);
      }
    });
  }

  $("#dpad").addEventListener("click", (event) => {
    const btn = event.target.closest("[data-move]");
    if (!btn) return;
    const dirs = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
    const dir = dirs[btn.dataset.move];
    if (dir) tryMove(dir[0], dir[1]);
  });

  if (els.bossAbilities) {
    els.bossAbilities.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-ability]");
      if (btn) useBossAbility(btn.dataset.ability);
    });
  }

  document.addEventListener("click", (event) => {
    const say = event.target.closest("[data-say]");
    if (say) {
      event.preventDefault();
      speak(say.dataset.say, 0.92);
    }
  });

  window.addEventListener("resize", fitMap);
  if (window.ResizeObserver && els.stage) {
    new ResizeObserver(() => fitMap()).observe(els.stage);
  }

  /* ----------------------------------------------------------------- старт */
  window.LexiGo = {
    modules: MODULES,
    buildPool: buildQuestionPool,
    buildLesson: buildLessonPool
  };
  updateAudioButtons();
  renderMenu();
  showScreen("menu");
  audio.playMusic("menu");

  function openBossPreview() {
    const local = window.location.protocol === "file:" ||
      ["localhost", "127.0.0.1"].includes(window.location.hostname);
    if (!local || window.location.hash !== "#bossfight") return;
    save.unlocked = 11;
    startBossBattle();
  }

  window.addEventListener("hashchange", openBossPreview);
  if (window.location.hash === "#bossfight") {
    window.setTimeout(openBossPreview, 250);
  }
})();




