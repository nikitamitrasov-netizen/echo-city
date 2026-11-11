/* LexiGo — тренажёр английского A1–A2.
   Чистый JS без сборки: достаточно открыть index.html в браузере. */

(function () {
  "use strict";

  var STORAGE_KEY = "lexigo.v1";
  var SESSION_LEN = 10;
  var XP_PER_LEVEL = 150;
  var MAX_COMBO_BONUS = 5;
  var PERFECT_BONUS = 25;

  /* --------------------------------------------------------------- утилиты */
  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $$(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function rand(n) {
    return Math.floor(Math.random() * n);
  }

  function pick(list) {
    return list[rand(list.length)];
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  var ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return ESCAPES[ch];
    });
  }

  function shuffle(list) {
    var arr = list.slice();
    for (var i = arr.length - 1; i > 0; i--) {
      var j = rand(i + 1);
      var tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  function setText(selector, value) {
    var node = $(selector);
    if (node) node.textContent = value;
  }

  function plural(n, one, few, many) {
    var mod10 = n % 10;
    var mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
    return many;
  }

  /* -------------------------------------------------------------- прогресс */
  var DEFAULT_SAVE = {
    xp: 0,
    sound: true,
    sessions: 0,
    best: { words: 0, sentences: 0, listening: 0, mixed: 0 }
  };

  function loadSave() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return clone(DEFAULT_SAVE);
      var data = JSON.parse(raw) || {};
      return Object.assign(clone(DEFAULT_SAVE), data, {
        best: Object.assign(clone(DEFAULT_SAVE.best), data.best || {})
      });
    } catch (err) {
      return clone(DEFAULT_SAVE);
    }
  }

  var save = loadSave();

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
    } catch (err) {
      /* приватный режим браузера — играем без сохранения */
    }
  }

  function levelOf(xp) {
    return Math.floor(xp / XP_PER_LEVEL) + 1;
  }

  function xpInLevel(xp) {
    return xp % XP_PER_LEVEL;
  }

  /* ----------------------------------------------------------------- звуки */
  var audioCtx = null;

  function tone(freq, duration, type, gain, delay) {
    if (!save.sound) return;
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!audioCtx) audioCtx = new Ctx();
      if (audioCtx.state === "suspended") audioCtx.resume();
      var start = audioCtx.currentTime + (delay || 0);
      var osc = audioCtx.createOscillator();
      var amp = audioCtx.createGain();
      osc.type = type || "sine";
      osc.frequency.setValueAtTime(freq, start);
      amp.gain.setValueAtTime(0.0001, start);
      amp.gain.exponentialRampToValueAtTime(gain || 0.05, start + 0.012);
      amp.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.connect(amp);
      amp.connect(audioCtx.destination);
      osc.start(start);
      osc.stop(start + duration + 0.03);
    } catch (err) {
      /* звук не критичен */
    }
  }

  function sfxGood() {
    tone(660, 0.1, "sine", 0.05);
    tone(990, 0.16, "sine", 0.045, 0.075);
  }

  function sfxBad() {
    tone(210, 0.18, "triangle", 0.06);
    tone(150, 0.24, "triangle", 0.05, 0.1);
  }

  function sfxTap() {
    tone(520, 0.04, "sine", 0.022);
  }

  function sfxWin() {
    [523, 659, 784, 1047].forEach(function (freq, i) {
      tone(freq, 0.18, "sine", 0.045, i * 0.09);
    });
  }

  /* ------------------------------------------------------------------- речь */
  var voices = [];

  function refreshVoices() {
    if (!("speechSynthesis" in window)) return;
    try {
      voices = window.speechSynthesis.getVoices() || [];
    } catch (err) {
      voices = [];
    }
  }

  refreshVoices();
  if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = refreshVoices;
  }

  function englishVoice() {
    var en = voices.filter(function (voice) {
      return /^en/i.test(voice.lang || "");
    });
    return (
      en.filter(function (v) { return /en[-_]US/i.test(v.lang) && v.localService; })[0] ||
      en.filter(function (v) { return /en[-_]US/i.test(v.lang); })[0] ||
      en.filter(function (v) { return /en[-_]GB/i.test(v.lang); })[0] ||
      en[0] ||
      null
    );
  }

  function speak(text, rate) {
    if (!save.sound || !("speechSynthesis" in window) || !text) return;
    try {
      window.speechSynthesis.cancel();
      var utter = new SpeechSynthesisUtterance(text);
      utter.lang = "en-US";
      utter.rate = rate || 0.92;
      utter.pitch = 1;
      var voice = englishVoice();
      if (voice) utter.voice = voice;
      window.speechSynthesis.speak(utter);
    } catch (err) {
      /* браузер без синтеза речи — играем без аудио */
    }
  }

  /* --------------------------------------------------------------- состояние */
  var state = {
    screen: "home",
    session: null,
    answered: false,
    current: null
  };

  var els = {
    screens: {
      home: $("#screen-home"),
      game: $("#screen-game"),
      result: $("#screen-result")
    },
    zone: $("#questionZone"),
    resultZone: $("#resultZone"),
    progFill: $("#progFill"),
    hudIdx: $("#hudIdx"),
    hudTotal: $("#hudTotal"),
    hudScore: $("#hudScore"),
    comboPill: $("#comboPill"),
    hudCombo: $("#hudCombo"),
    soundBtn: $("#soundBtn")
  };

  /* ----------------------------------------------------------------- экраны */
  function showScreen(name) {
    state.screen = name;
    Object.keys(els.screens).forEach(function (key) {
      var node = els.screens[key];
      if (node) node.hidden = key !== name;
    });
    document.body.setAttribute("data-screen", name);
    if (name === "home") renderHome();
    window.scrollTo(0, 0);
  }

  function goHome() {
    if ("speechSynthesis" in window) {
      try { window.speechSynthesis.cancel(); } catch (err) {}
    }
    state.session = null;
    state.answered = false;
    state.current = null;
    els.zone.innerHTML = "";
    showScreen("home");
  }

  /* ------------------------------------------------------------- главный экран */
  function renderHome() {
    var level = levelOf(save.xp);
    var progress = xpInLevel(save.xp) / XP_PER_LEVEL;

    setText("#levelBig", level);
    setText("#lvlNum", level);
    setText("#xpInLevel", xpInLevel(save.xp));
    setText("#statSessions", save.sessions);
    setText("#statXp", save.xp);

    var bests = Object.keys(save.best)
      .map(function (key) { return save.best[key]; })
      .filter(function (value) { return value > 0; });
    setText("#statBest", bests.length ? Math.max.apply(null, bests) : "—");

    var ring = $("#ringFg");
    if (ring) {
      var radius = 52;
      var circumference = 2 * Math.PI * radius;
      ring.style.strokeDasharray = String(circumference);
      ring.style.strokeDashoffset = String(circumference * (1 - progress));
    }

    $$("[data-best]").forEach(function (node) {
      var value = save.best[node.dataset.best] || 0;
      node.textContent = value ? "Рекорд: " + value : "Ещё не играли";
      node.classList.toggle("has-best", value > 0);
    });

    updateSoundButton();
  }

  function updateSoundButton() {
    if (!els.soundBtn) return;
    els.soundBtn.textContent = save.sound ? "🔊" : "🔇";
    els.soundBtn.setAttribute("aria-pressed", save.sound ? "true" : "false");
    els.soundBtn.title = save.sound ? "Звук включён" : "Звук выключен";
  }

  /* ------------------------------------------------------------ сборка сессии */
  function buildQueue(mode) {
    function asWord(word) {
      return { kind: "word", en: word.en, ru: word.ru, cat: word.cat, ex: word.ex, exRu: word.exRu };
    }
    function asSentence(item) {
      return { kind: "sentence", en: item.en, ru: item.ru };
    }
    function asListen(item) {
      return { kind: "listen", en: item.en, ru: item.ru };
    }

    if (mode === "words") return shuffle(WORDS).slice(0, SESSION_LEN).map(asWord);
    if (mode === "sentences") return shuffle(SENTENCES).slice(0, SESSION_LEN).map(asSentence);
    if (mode === "listening") return shuffle(LISTENING).slice(0, SESSION_LEN).map(asListen);

    return shuffle(
      shuffle(WORDS).slice(0, 4).map(asWord).concat(
        shuffle(SENTENCES).slice(0, 3).map(asSentence),
        shuffle(LISTENING).slice(0, 3).map(asListen)
      )
    );
  }

  function start(mode, items) {
    state.session = {
      mode: mode,
      items: items && items.length ? items : buildQueue(mode),
      index: 0,
      score: 0,
      correct: 0,
      combo: 0,
      maxCombo: 0,
      mistakes: []
    };
    state.answered = false;
    state.current = null;
    showScreen("game");
    renderQuestion();
  }

  /* ------------------------------------------------------------------- HUD */
  function updateHud() {
    var session = state.session;
    if (!session) return;

    els.hudIdx.textContent = session.index + 1;
    els.hudTotal.textContent = session.items.length;
    els.hudScore.textContent = session.score;

    var done = session.index + (state.answered ? 1 : 0);
    var percent = Math.round((done / session.items.length) * 100);
    els.progFill.style.width = percent + "%";
    var bar = $("#progBar");
    if (bar) bar.setAttribute("aria-valuenow", String(percent));

    var showCombo = session.combo > 1;
    els.comboPill.hidden = !showCombo;
    if (showCombo) els.hudCombo.textContent = "×" + session.combo;
  }

  /* --------------------------------------------------------------- вопросы */
  function optionsFor(correct, all, preferred) {
    var samePool = shuffle((preferred || []).filter(function (x) { return x !== correct; }));
    var restPool = shuffle(all.filter(function (x) { return x !== correct; }));
    var picks = [];

    samePool.slice(0, 2).forEach(function (value) { picks.push(value); });
    for (var i = 0; i < restPool.length && picks.length < 3; i++) {
      if (picks.indexOf(restPool[i]) === -1) picks.push(restPool[i]);
    }

    return shuffle([correct].concat(picks.slice(0, 3)));
  }

  function renderQuestion() {
    var session = state.session;
    if (!session || !session.items.length) return;

    var question = session.items[session.index];
    state.answered = false;
    state.current = null;
    if ("speechSynthesis" in window) {
      try { window.speechSynthesis.cancel(); } catch (err) {}
    }
    els.zone.innerHTML = "";
    updateHud();

    if (question.kind === "sentence") {
      renderSentence(question);
    } else if (question.kind === "listen") {
      renderListen(question);
    } else {
      renderWord(question);
    }
  }

  /* ---------------------------------------------------------------- слово */
  function renderWord(question) {
    var sameCategory = WORDS.filter(function (word) {
      return word.cat === question.cat && word.ru !== question.ru;
    }).map(function (word) { return word.ru; });

    var options = optionsFor(
      question.ru,
      WORDS.map(function (word) { return word.ru; }),
      sameCategory
    );

    els.zone.innerHTML =
      '<article class="qcard">' +
        '<div class="qhead"><span class="chip">' + esc(question.cat) + '</span>' +
          '<span class="qkind">Слово</span></div>' +
        '<h2 class="qword">' + esc(question.en) +
          '<button class="speak" type="button" data-say="' + esc(question.en) + '" aria-label="Прослушать слово">🔊</button>' +
        '</h2>' +
        '<p class="qhint">Выбери правильный перевод</p>' +
        '<div class="options">' +
          options.map(function (value, index) {
            return (
              '<button class="option" type="button" data-val="' + esc(value) + '">' +
                '<span class="key">' + "ABCD"[index] + '</span>' +
                '<span class="val">' + esc(value) + '</span>' +
                '<span class="mark" aria-hidden="true"></span>' +
              '</button>'
            );
          }).join("") +
        '</div>' +
      '</article>' +
      '<div class="fb-slot"></div>';

    $$(".option", els.zone).forEach(function (button) {
      button.addEventListener("click", function () {
        if (state.answered) return;

        var ok = button.dataset.val === question.ru;
        $$(".option", els.zone).forEach(function (other) {
          other.disabled = true;
          if (other.dataset.val === question.ru) other.classList.add("correct");
        });
        if (!ok) button.classList.add("wrong");

        settle(ok, {
          say: ok ? question.en : null,
          html:
            '<p class="fb-sub"><b>' + esc(question.en) + " — " + esc(question.ru) + "</b></p>" +
            '<p class="fb-ex"><button class="speak sm" type="button" data-say="' + esc(question.ex) + '" aria-label="Прослушать пример">🔊</button>' +
              esc(question.ex) + " <em>" + esc(question.exRu) + "</em></p>"
        });
      });
    });
  }

  /* ----------------------------------------------------------- предложение */
  function renderSentence(question) {
    var tokens = question.en.split(" ");
    var bank = shuffle(tokens.map(function (word, id) {
      return { word: word, id: id };
    }));

    if (tokens.length > 1 && bank.map(function (t) { return t.word; }).join(" ") === question.en) {
      bank.push(bank.shift());
    }

    state.current = { question: question, tokens: tokens, bank: bank, placed: [] };

    els.zone.innerHTML =
      '<article class="qcard">' +
        '<div class="qhead"><span class="chip">Предложение</span>' +
          '<span class="qkind">Порядок слов</span></div>' +
        '<p class="qru">' + esc(question.ru) + '</p>' +
        '<p class="qhint">Собери английскую фразу — нажимай на слова</p>' +
        '<div class="builder" id="builder" aria-live="polite"></div>' +
        '<div class="bank" id="bank"></div>' +
        '<div class="row-actions">' +
          '<button class="btn ghost" id="sentenceReset" type="button">Сбросить</button>' +
          '<button class="btn primary" id="checkBtn" type="button" disabled>Проверить <kbd>Enter</kbd></button>' +
        '</div>' +
      '</article>' +
      '<div class="fb-slot"></div>';

    var builder = $("#builder", els.zone);
    var bankEl = $("#bank", els.zone);
    var checkBtn = $("#checkBtn", els.zone);

    paintSentence();

    builder.addEventListener("click", function (event) {
      var button = event.target.closest("[data-placed]");
      if (!button || state.answered) return;
      var moved = state.current.placed.splice(Number(button.dataset.placed), 1)[0];
      state.current.bank.push(moved);
      sfxTap();
      paintSentence();
    });

    bankEl.addEventListener("click", function (event) {
      var button = event.target.closest("[data-bank]");
      if (!button || state.answered) return;
      var moved = state.current.bank.splice(Number(button.dataset.bank), 1)[0];
      state.current.placed.push(moved);
      sfxTap();
      paintSentence();
    });

    $("#sentenceReset", els.zone).addEventListener("click", function () {
      if (state.answered || !state.current) return;
      state.current.bank = state.current.bank.concat(state.current.placed);
      state.current.placed = [];
      paintSentence();
    });

    checkBtn.addEventListener("click", function () {
      checkSentence(question);
    });
  }

  function paintSentence() {
    var current = state.current;
    if (!current) return;

    var builder = $("#builder", els.zone);
    var bankEl = $("#bank", els.zone);
    var checkBtn = $("#checkBtn", els.zone);
    if (!builder || !bankEl) return;

    builder.innerHTML = current.placed.length
      ? current.placed.map(function (tok, index) {
          return '<button class="tok tok-placed" type="button" data-placed="' + index + '">' + esc(tok.word) + "</button>";
        }).join("")
      : '<span class="placeholder">Здесь появится твоё предложение</span>';

    bankEl.innerHTML = current.bank.length
      ? current.bank.map(function (tok, index) {
          return '<button class="tok" type="button" data-bank="' + index + '">' + esc(tok.word) + "</button>";
        }).join("")
      : '<span class="placeholder">Все слова использованы</span>';

    if (checkBtn) checkBtn.disabled = current.placed.length !== current.tokens.length;
  }

  function checkSentence(question) {
    if (state.answered || !state.current || state.current.question !== question) return;

    var placed = state.current.placed;
    if (placed.length !== state.current.tokens.length) return;

    var attempt = placed.map(function (tok) { return tok.word; }).join(" ");
    var ok = attempt === question.en;

    $$(".tok", els.zone).forEach(function (button) { button.disabled = true; });
    if (!ok) {
      $$(".tok-placed", els.zone).forEach(function (button) { button.classList.add("bad"); });
    }

    settle(ok, {
      say: ok ? question.en : null,
      html: ok
        ? '<p class="fb-ex">' + esc(question.ru) + "</p>"
        : '<p class="fb-sub">Правильно: <b>' + esc(question.en) + '</b> ' +
            '<button class="speak sm" type="button" data-say="' + esc(question.en) + '" aria-label="Прослушать">🔊</button></p>' +
          '<p class="fb-ex">' + esc(question.ru) + "</p>"
    });
  }

  /* ------------------------------------------------------------ аудирование */
  function renderListen(question) {
    var hasTts = "speechSynthesis" in window;
    var options = optionsFor(
      question.ru,
      LISTENING.map(function (item) { return item.ru; })
    );

    els.zone.innerHTML =
      '<article class="qcard">' +
        '<div class="qhead"><span class="chip">Аудирование</span>' +
          '<span class="qkind">На слух</span></div>' +
        '<div class="listen-zone">' +
          '<button class="play" id="playBtn" type="button" aria-label="Прослушать фразу">▶</button>' +
          '<button class="btn ghost sm" id="slowBtn" type="button">🐢 Медленнее</button>' +
        '</div>' +
        '<p class="qhint">' +
          (hasTts
            ? "Что ты услышал? Нажми ▶, чтобы повторить."
            : "Синтез речи недоступен в этом браузере — вот фраза:") +
        '</p>' +
        (hasTts ? "" : '<p class="qword small">' + esc(question.en) + "</p>") +
        '<div class="options">' +
          options.map(function (value, index) {
            return (
              '<button class="option" type="button" data-val="' + esc(value) + '">' +
                '<span class="key">' + "ABCD"[index] + '</span>' +
                '<span class="val">' + esc(value) + '</span>' +
                '<span class="mark" aria-hidden="true"></span>' +
              '</button>'
            );
          }).join("") +
        '</div>' +
      '</article>' +
      '<div class="fb-slot"></div>';

    var playBtn = $("#playBtn", els.zone);

    function play(rate) {
      speak(question.en, rate || 0.9);
      playBtn.classList.add("playing");
      window.clearTimeout(playBtn._timer);
      playBtn._timer = window.setTimeout(function () {
        playBtn.classList.remove("playing");
      }, 1900);
    }

    playBtn.addEventListener("click", function () { play(0.9); });
    $("#slowBtn", els.zone).addEventListener("click", function () { play(0.68); });

    if (hasTts) {
      window.setTimeout(function () {
        if (state.session && state.session.items[state.session.index] === question && !state.answered) {
          play(0.9);
        }
      }, 380);
    }

    $$(".option", els.zone).forEach(function (button) {
      button.addEventListener("click", function () {
        if (state.answered) return;

        var ok = button.dataset.val === question.ru;
        $$(".option", els.zone).forEach(function (other) {
          other.disabled = true;
          if (other.dataset.val === question.ru) other.classList.add("correct");
        });
        if (!ok) button.classList.add("wrong");

        settle(ok, {
          say: ok ? question.en : null,
          html:
            '<p class="fb-sub"><b>' + esc(question.ru) + "</b></p>" +
            '<p class="fb-ex">«' + esc(question.en) + '» ' +
              '<button class="speak sm" type="button" data-say="' + esc(question.en) + '" aria-label="Прослушать">🔊</button></p>'
        });
      });
    });
  }

  /* ------------------------------------------------------------- результат */
  function settle(ok, data) {
    state.answered = true;
    var session = state.session;

    if (ok) {
      session.combo += 1;
      session.maxCombo = Math.max(session.maxCombo, session.combo);
      var gain = 10 + Math.min(session.combo - 1, MAX_COMBO_BONUS) * 2;
      session.score += gain;
      session.correct += 1;
      data.gain = gain;
      sfxGood();
      if (data.say && save.sound) {
        window.setTimeout(function () { speak(data.say, 0.9); }, 280);
      }
    } else {
      session.combo = 0;
      session.mistakes.push(session.items[session.index]);
      sfxBad();
    }

    updateHud();
    showFeedback(ok, data);
  }

  function showFeedback(ok, data) {
    var session = state.session;
    var slot = $(".fb-slot", els.zone);
    if (!slot) return;

    var isLast = session.index === session.items.length - 1;
    var title = ok
      ? pick(["Верно!", "Точно!", "Отлично!", "Есть!"])
      : pick(["Не совсем", "Почти!", "Запомним"]);

    slot.innerHTML =
      '<div class="feedback ' + (ok ? "ok" : "bad") + '" role="status">' +
        '<div class="fb-icon" aria-hidden="true">' + (ok ? "✓" : "✕") + "</div>" +
        '<div class="fb-body">' +
          '<p class="fb-title">' + title +
            (ok ? '<span class="fb-gain">+' + data.gain + "</span>" : "") +
          "</p>" +
          (data.html || "") +
        "</div>" +
        '<button class="btn primary" id="nextBtn" type="button">' +
          (isLast ? "Результат" : "Дальше") + " <kbd>Enter</kbd>" +
        "</button>" +
      "</div>";

    var nextBtn = $("#nextBtn", slot);
    nextBtn.addEventListener("click", nextQuestion);
    try {
      nextBtn.focus({ preventScroll: true });
    } catch (err) {
      nextBtn.focus();
    }
  }

  function nextQuestion() {
    var session = state.session;
    if (!session || !state.answered) return;

    if (session.index >= session.items.length - 1) {
      finishSession();
      return;
    }

    session.index += 1;
    state.answered = false;
    renderQuestion();
  }

  function finishSession() {
    var session = state.session;
    var total = session.items.length;
    var accuracy = Math.round((session.correct / total) * 100);
    var bonus = accuracy === 100 ? PERFECT_BONUS : 0;
    var xpGain = session.score + bonus;
    var beforeLevel = levelOf(save.xp);
    var isRecord = session.score > (save.best[session.mode] || 0);

    save.xp += xpGain;
    save.sessions += 1;
    if (isRecord) save.best[session.mode] = session.score;
    persist();
    renderHome();

    showScreen("result");
    renderResult({
      mode: session.mode,
      mistakes: session.mistakes.slice(),
      score: session.score,
      total: total,
      accuracy: accuracy,
      maxCombo: session.maxCombo,
      xpGain: xpGain,
      bonus: bonus,
      beforeLevel: beforeLevel,
      afterLevel: levelOf(save.xp),
      isRecord: isRecord
    });
  }

  function renderResult(result) {
    var modeNames = {
      words: "Слова",
      sentences: "Предложения",
      listening: "Аудирование",
      mixed: "Микс"
    };

    var mood;
    if (result.accuracy >= 90) {
      mood = { emoji: "🏆", title: "Блестяще!" };
    } else if (result.accuracy >= 70) {
      mood = { emoji: "🎉", title: "Отличная сессия" };
    } else if (result.accuracy >= 50) {
      mood = { emoji: "👍", title: "Неплохо!" };
    } else {
      mood = { emoji: "💪", title: "Есть над чем поработать" };
    }

    var summary;
    if (result.accuracy === 100) {
      summary = "Ни одной ошибки — словарь сегодня доволен.";
    } else if (result.accuracy >= 70) {
      summary = "Хороший темп. Ошибки уже ждут повтора.";
    } else if (result.accuracy >= 50) {
      summary = "Половина пути пройдена — закрепи сложные места.";
    } else {
      summary = "Не переживай: трудные задания вернутся в тренировке.";
    }

    var review = result.mistakes.length
      ? '<div class="review"><h3>Повторить <span>' + result.mistakes.length + "</span></h3><ul>" +
        result.mistakes.map(reviewRow).join("") +
        "</ul></div>"
      : '<p class="perfect-note">✨ Идеально — можно переходить к следующей сессии.</p>';

    els.resultZone.innerHTML =
      '<div class="result-card">' +
        '<div class="result-emoji">' + mood.emoji + "</div>" +
        '<p class="eyebrow">' + modeNames[result.mode] + " · " + result.total + " " +
          plural(result.total, "задание", "задания", "заданий") + "</p>" +
        "<h1>" + mood.title + "</h1>" +
        '<p class="lede">' + summary + "</p>" +
        '<div class="stats">' +
          statBlock(result.score, plural(result.score, "очко", "очка", "очков")) +
          statBlock(result.accuracy + "%", "точность") +
          statBlock("×" + result.maxCombo, "лучшая серия") +
          '<div class="stat accent"><b>+' + result.xpGain + "</b><small>XP</small></div>" +
        "</div>" +
        (result.afterLevel > result.beforeLevel
          ? '<p class="levelup">⬆ Новый уровень: ' + result.afterLevel + "</p>"
          : "") +
        (result.bonus ? '<p class="bonus">🎁 Бонус за идеальную сессию: +' + result.bonus + " XP</p>" : "") +
        (result.isRecord ? '<p class="bonus">🏅 Новый рекорд режима</p>' : "") +
        '<div class="result-actions">' +
          '<button class="btn primary lg" id="againBtn" type="button">Ещё раз</button>' +
          (result.mistakes.length
            ? '<button class="btn ghost lg" id="retryBtn" type="button">Повторить ошибки</button>'
            : "") +
          '<button class="btn ghost lg" type="button" data-nav="home">В меню</button>' +
        "</div>" +
        review +
      "</div>";

    var againBtn = $("#againBtn");
    if (againBtn) {
      againBtn.addEventListener("click", function () { start(result.mode); });
    }

    var retryBtn = $("#retryBtn");
    if (retryBtn) {
      retryBtn.addEventListener("click", function () {
        if (!result.mistakes.length) return;
        start(result.mode, shuffle(result.mistakes.map(function (item) { return clone(item); })));
      });
    }

    if (result.accuracy >= 80) {
      sfxWin();
      confetti();
    }
  }

  function statBlock(value, label) {
    return '<div class="stat"><b>' + esc(value) + "</b><small>" + esc(label) + "</small></div>";
  }

  function reviewRow(item) {
    return (
      "<li>" +
        "<div><b>" + esc(item.en) + "</b><span>" + esc(item.ru) + "</span></div>" +
        '<button class="speak sm" type="button" data-say="' + esc(item.en) + '" aria-label="Прослушать">🔊</button>' +
      "</li>"
    );
  }

  /* -------------------------------------------------------------- конфетти */
  function confetti() {
    var host = $("#confetti");
    if (!host) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var colors = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"];

    for (var i = 0; i < 70; i++) {
      var piece = document.createElement("i");
      piece.className = "confetti-piece";
      piece.style.left = Math.random() * 100 + "%";
      piece.style.background = colors[i % colors.length];
      piece.style.animationDelay = Math.random() * 0.4 + "s";
      piece.style.setProperty("--dx", Math.random() * 200 - 100 + "px");
      piece.style.setProperty("--rot", Math.random() * 900 - 450 + "deg");
      piece.style.width = piece.style.height = 6 + Math.random() * 7 + "px";
      host.appendChild(piece);
      (function (node) {
        window.setTimeout(function () { node.remove(); }, 3000);
      })(piece);
    }
  }

  /* ------------------------------------------------------------- управление */
  document.addEventListener("click", function (event) {
    var sayBtn = event.target.closest("[data-say]");
    if (sayBtn) {
      event.preventDefault();
      speak(sayBtn.dataset.say, 0.92);
      return;
    }

    var navBtn = event.target.closest("[data-nav]");
    if (navBtn) {
      event.preventDefault();
      goHome();
      return;
    }

    var modeBtn = event.target.closest("[data-mode]");
    if (modeBtn) {
      event.preventDefault();
      start(modeBtn.dataset.mode);
    }
  });

  document.addEventListener("keydown", function (event) {
    var tag = (event.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea") return;

    if (event.key === "Escape") {
      if (state.screen !== "home") {
        event.preventDefault();
        goHome();
      }
      return;
    }

    if (state.screen !== "game") return;

    var onButton = document.activeElement && document.activeElement.tagName === "BUTTON";

    if (state.answered) {
      if ((event.key === "Enter" || event.key === " ") && !onButton) {
        event.preventDefault();
        nextQuestion();
      }
      return;
    }

    if (/^[1-4]$/.test(event.key)) {
      var options = $$(".option", els.zone);
      var target = options[Number(event.key) - 1];
      if (target && !target.disabled) {
        event.preventDefault();
        target.click();
      }
      return;
    }

    if (event.key === "Backspace" && state.current && state.current.placed) {
      if (state.current.placed.length) {
        event.preventDefault();
        state.current.bank.push(state.current.placed.pop());
        paintSentence();
      }
      return;
    }

    if (event.key === "Enter" && !onButton) {
      var check = $("#checkBtn", els.zone);
      if (check && !check.disabled) {
        event.preventDefault();
        check.click();
      }
    }
  });

  if (els.soundBtn) {
    els.soundBtn.addEventListener("click", function () {
      save.sound = !save.sound;
      persist();
      updateSoundButton();
      if (save.sound) sfxTap();
    });
  }

  var resetBtn = $("#resetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      if (!window.confirm("Сбросить прогресс: уровень, XP, рекорды и счётчик сессий?")) return;
      save = clone(DEFAULT_SAVE);
      persist();
      goHome();
    });
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden && "speechSynthesis" in window) {
      try { window.speechSynthesis.cancel(); } catch (err) {}
    }
  });

  /* ------------------------------------------------------------------ старт */
  renderHome();
})();
