/* LexiGo: Город Эхо - лор, кварталы и диалоги Безголосых.
   Тексты специально короткие: их читают перед боем, а не вместо урока. */

const STORY = {
  world: "Echo City",
  title: "Echo City",
  intro: "Echo City is waking up without words. The signs are blank and every conversation stops halfway. Ten quarters hold the Word Seals, but the Voiceless have forgotten what they guard. You are a Wordcatcher. One whole sentence still burns in your lantern. Carry it to the House of Voices.",
  introRu: "Город Эхо просыпается без слов. На вывесках пусто, в разговорах паузы. Десять кварталов держат Печати Слова, но Безголосые забыли, зачем их охраняют. В твоём фонаре горит последняя целая фраза. Донеси её до Дома Голосов.",
  guide: {
    name: "Shoro",
    role: "a paper moth in the lantern",
    line: "I eat mistakes. Do not feed me too often.",
    lineRu: "Я ем ошибки. Не корми меня слишком часто."
  },
  modules: {
    m1: {
      district: "The Asphalt Quarter", districtRu: "Квартал Асфальта", sigil: "assets/props/city.svg",
      faction: "The Gridlockers", factionRu: "Пробочники",
      hook: "Words get stuck in traffic here.", hookRu: "Здесь слова застревают в пробках.",
      lore: "The Gridlockers keep the streets in order, but they have forgotten that order is for people, not for traffic lights. Their Seal is buried under a crossing that no one has crossed in years.",
      loreRu: "Пробочники следят за порядком, но забыли, что порядок нужен людям, а не светофорам. Их Печать лежит под перекрёстком, который давно никто не переходил.",
      outro: "The Asphalt Seal is back. At the crossing, people can say good morning to each other again.",
      outroRu: "Печать Асфальта возвращена. На перекрёстке снова слышно, как люди говорят друг другу «доброе утро»."
    },
    m2: {
      district: "Binding Lane", districtRu: "Переплётный переулок", sigil: "assets/props/story.svg",
      faction: "The Bookbinders", factionRu: "Переплётчики",
      hook: "The books have closed and will not give up their endings.", hookRu: "Книги закрылись и не отдают концовки.",
      lore: "The Bookbinders guard stories whose last page was torn out. They do not want to hurt you. They want someone to finish the sentence they have been holding for years.",
      loreRu: "Переплётчики охраняют истории, у которых вырвали последнюю страницу. Они не хотят тебе зла. Они хотят, чтобы кто-то закончил фразу, которую держат годами.",
      outro: "The Binding Seal is back. A librarian read an old tale aloud, and the tale became whole.",
      outroRu: "Печать Переплёта возвращена. Библиотекарь дочитал вслух старую сказку, и она снова стала целой."
    },
    m3: {
      district: "The Mirror Gallery", districtRu: "Зеркальная галерея", sigil: "assets/props/portrait.svg",
      faction: "The Faceless", factionRu: "Безликие",
      hook: "Every portrait remembers someone else's name.", hookRu: "Каждый портрет помнит чужое имя.",
      lore: "The Faceless wear other people's faces because their own names were the first to go. In the Gallery, a reflection can answer before you do.",
      loreRu: "Безликие примеряют чужие лица, потому что своё имя стёрлось первым. В галерее отражение может ответить раньше тебя.",
      outro: "The Mirror Seal is back. In the gallery, you can recognise yourself again.",
      outroRu: "Печать Зеркал возвращена. В галерее снова можно узнать себя в отражении."
    },
    m4: {
      district: "The Broadcast Quarter", districtRu: "Эфирный квартал", sigil: "assets/props/media.svg",
      faction: "The Heralds", factionRu: "Глашатаи",
      hook: "The news keeps repeating one empty line.", hookRu: "Новости повторяют одну пустую строку.",
      lore: "The Heralds speak loudly and quickly so no one notices they have nothing left to say. Their Seal is inside a transmitter that broadcasts a single unfinished headline.",
      loreRu: "Глашатаи говорят громко и быстро, чтобы никто не заметил, что им нечего сказать. Их Печать внутри передатчика, который повторяет один незаконченный заголовок.",
      outro: "The Broadcast Seal is back. The radio carries voices again, not only static.",
      outroRu: "Печать Эфира возвращена. Радио снова передаёт не только шум, но и голоса."
    },
    m5: {
      district: "The Glass Yard", districtRu: "Стеклянный полигон", sigil: "assets/props/future.svg",
      faction: "The Synthetics", factionRu: "Синтетики",
      hook: "The machines learned the words but not the meaning.", hookRu: "Машины выучили слова, но не смысл.",
      lore: "The Synthetics are built from borrowed phrases. They answer correctly and understand nothing. The Seal is locked in a lab that only opens for a question, not a command.",
      loreRu: "Синтетики собраны из чужих фраз. Они отвечают правильно и не понимают ни слова. Печать заперта в лаборатории, которая открывается на вопрос, а не на команду.",
      outro: "The Glass Seal is back. For the first time, a machine asked a question instead of giving an order.",
      outroRu: "Печать Полигона возвращена. Машины впервые задали вопрос, а не произнесли команду."
    },
    m6: {
      district: "The Carnival of Forgetting", districtRu: "Ярмарка забвения", sigil: "assets/props/fun.svg",
      faction: "The Carnival Folk", factionRu: "Ярмарочные",
      hook: "The laughter is recorded. The joy is not.", hookRu: "Смех записан, веселье - нет.",
      lore: "The Carnival Folk keep the carousel turning so no one leaves and asks where the words went. The Seal is under the carousel, and the carousel does not stop for polite requests.",
      loreRu: "Ярмарочные крутят карусель, чтобы никто не ушёл и не спросил, куда делись слова. Печать под каруселью, а карусель не останавливается по вежливой просьбе.",
      outro: "The Carnival Seal is back. On the stage, someone laughs without being prompted.",
      outroRu: "Печать Ярмарки возвращена. На сцене снова смеются без подсказки."
    },
    m7: {
      district: "The Theatre of the Last Word", districtRu: "Театр последнего слова", sigil: "assets/props/stage.svg",
      faction: "The Prompters", factionRu: "Суфлёры",
      hook: "The actors have forgotten their lines.", hookRu: "Актёры забыли реплики.",
      lore: "The Prompters whisper other people's lines. If an actor stumbles, they take his voice. The Seal is in the wings, behind a curtain that has not opened in years.",
      loreRu: "Суфлёры шепчут чужие строки. Если актёр собьётся, они забирают его голос. Печать за кулисами, за занавесом, который не открывался много лет.",
      outro: "The Theatre Seal is back. The curtain rose, and an actor said the first line himself.",
      outroRu: "Печать Театра возвращена. Занавес поднялся, и актёр сам сказал первую реплику."
    },
    m8: {
      district: "The Quiet Grove", districtRu: "Тихая роща", sigil: "assets/props/green.svg",
      faction: "The Spores", factionRu: "Споры",
      hook: "The forest whispers, but it does not speak.", hookRu: "Лес шепчет, но не говорит.",
      lore: "The Spores grew where people stopped naming plants and animals. The Seal is in the oldest tree, and the tree remembers every name it has lost.",
      loreRu: "Споры выросли там, где люди перестали называть растения и животных. Печать в самом старом дереве, и дерево помнит каждое потерянное имя.",
      outro: "The Grove Seal is back. In the forest, people can tell one bird's voice from another.",
      outroRu: "Печать Рощи возвращена. В лесу снова различают голоса птиц, а не один шум."
    },
    m9: {
      district: "The Arcade of Empty Windows", districtRu: "Пассаж пустых витрин", sigil: "assets/props/shop.svg",
      faction: "The Merchants", factionRu: "Купцы",
      hook: "The price tags are here. The names are gone.", hookRu: "Ценники есть, названия стёрты.",
      lore: "The Merchants sell things without names. A customer pays and cannot remember what he bought. The Seal is in a shop window that reflects a different street.",
      loreRu: "Купцы продают вещи без имён. Покупатель платит и не помнит, что купил. Печать в витрине, которая отражает другую улицу.",
      outro: "The Arcade Seal is back. The windows say what is inside again.",
      outroRu: "Печать Пассажа возвращена. На витринах снова написано, что внутри."
    },
    m10: {
      district: "The Ward of Lost Names", districtRu: "Лазарет потерянных имён", sigil: "assets/props/health.svg",
      faction: "The Medics", factionRu: "Медики",
      hook: "They heal bodies, but not memory.", hookRu: "Здесь лечат тела, но не память.",
      lore: "The Medics know every symptom and no names. They are waiting for you to name yourself. The last Seal is in the ward where the first word was taken.",
      loreRu: "Медики знают все симптомы и ни одного имени. Они ждут, когда ты назовёшь себя. Последняя Печать в палате, где забрали первое слово.",
      outro: "The Ward Seal is back. Patients remember their names, and a doctor writes one down.",
      outroRu: "Печать Лазарета возвращена. Пациенты вспомнили, как их зовут, и врач впервые записал имя."
    }
  },
  classes: {
    mage: {
      name: "Lamplighter", title: "The Last Lantern",
      story: "Your brother Ilya was a Lamplighter. He went into the fog with the city's last whole sentence and never came back. The sentence is still in your lantern. Every quarter you enter is a step toward the place where he lost it.",
      storyRu: "Твой брат Илья был фонарщиком. Он ушёл в туман с последней целой фразой города и не вернулся. Эта фраза до сих пор в твоём фонаре. Каждый квартал - шаг к месту, где он её потерял.",
      goal: "Find the sentence that can bring your brother back.",
      goalRu: "Найди фразу, которая сможет вернуть брата.",
      ending: "The sentence in your lantern was Ilya's last line. You read it aloud, and for a moment the fog had his voice.",
      endingRu: "Фраза в твоём фонаре была последней строкой Ильи. Ты прочитал её вслух, и на мгновение туман заговорил его голосом."
    },
    warrior: {
      name: "Shieldbearer", title: "The North Gate",
      story: "You guarded the North Gate of the old library. When the Grey Whisper came, you held the door while others ran. The library is gone, but your shield still remembers the weight of every name inside it.",
      storyRu: "Ты охранял Северные ворота старой библиотеки. Когда пришёл Серый Шёпот, ты держал дверь, пока другие бежали. Библиотеки больше нет, но твой щит помнит вес каждого имени, которое было внутри.",
      goal: "Carry the names that were left behind.",
      goalRu: "Донеси имена, которые остались позади.",
      ending: "The library did not come back. But every name on your shield was read aloud, and none of them were lost.",
      endingRu: "Библиотека не вернулась. Но каждое имя на твоём щите было прочитано вслух, и ни одно не потерялось."
    },
    elf: {
      name: "Windcatcher", title: "A Song in the Fog",
      story: "You heard a song coming from the House of Voices. It had no words, only a melody that turned into a sentence when the wind changed. You have followed it for three winters. The song is still ahead of you.",
      storyRu: "Ты услышал песню из Дома Голосов. В ней не было слов, только мелодия, которая превращалась в фразу, когда менялся ветер. Ты идёшь за ней три зимы. Песня всё ещё впереди.",
      goal: "Catch the song before the fog does.",
      goalRu: "Поймай песню раньше, чем туман.",
      ending: "The song had one word in it: home. You sang it back, and the wind carried it through every open window.",
      endingRu: "В песне было одно слово: дом. Ты спел его в ответ, и ветер понёс его в каждое открытое окно."
    },
    guardian: {
      name: "Keeper", title: "The Blank Page",
      story: "You keep the names of everyone who disappeared. Your book has one blank page left, and the page has your own name on it. You do not remember writing it. The Grey Whisper may know why.",
      storyRu: "Ты хранишь имена всех, кто исчез. В твоей книге осталась одна пустая страница, и на ней твоё собственное имя. Ты не помнишь, как его написал. Серый Шёпот может знать почему.",
      goal: "Find out whose name is on the last page.",
      goalRu: "Узнай, чьё имя на последней странице.",
      ending: "The blank page filled with your own name. This time you wrote it yourself.",
      endingRu: "Пустая страница заполнилась твоим именем. На этот раз ты написал его сам."
    }
  },
  boss: {
    name: "The Grey Whisper",
    role: "a dragon of unfinished sentences",
    line: "You brought me the last sentence? Leave it here. Unfinished things are safer.",
    ru: "Ты принёс мне последнюю фразу? Оставь её здесь. Недосказанное безопаснее.",
    options: [
      "I came to finish the sentence.",
      "I came finish the sentence.",
      "I am come to finish the sentence."
    ],
    correct: "I came to finish the sentence.",
    explain: "Past Simple: came. After came we use to + infinitive: came to finish.",
    outro: "The Whisper breathed out every stolen word. The city spoke again. The dragon stayed in the House of Voices - no longer a dragon, but a library.",
    outroRu: "Шёпот выдохнул все украденные слова. Город заговорил. Дракон остался в Доме Голосов - уже не драконом, а библиотекой."
  }
};

const TAUNTS = [
  { en: "Another wordcatcher? This street eats the polite ones.", ru: "Ещё один ловец слов? Эта улица ест вежливых." },
  { en: "You carry a lantern. I carry a grudge.", ru: "Ты несёшь фонарь. Я несу обиду." },
  { en: "The Seal stays with me. Show me you understand this place.", ru: "Печать останется у меня. Покажи, что понимаешь это место." },
  { en: "I have heard your footsteps since the gate.", ru: "Я слышал твои шаги ещё от ворот." },
  { en: "Words are cheap. Meaning is expensive.", ru: "Слова дешёвые. Смысл дорогой." },
  { en: "You want to pass? Translate what I say, and don't blink.", ru: "Хочешь пройти? Переведи мои слова и не моргай." },
  { en: "The city forgot my name. Maybe you can remember this sentence.", ru: "Город забыл моё имя. Может, ты запомнишь это предложение." },
  { en: "I guard a door that no longer exists.", ru: "Я охраняю дверь, которой больше нет." },
  { en: "You smell of fresh ink. That won't help you here.", ru: "От тебя пахнет свежими чернилами. Здесь это не поможет." },
  { en: "Everyone who passes me leaves a word behind.", ru: "Каждый, кто проходит мимо, оставляет здесь слово." },
  { en: "I don't need your name. I need your answer.", ru: "Мне не нужно твоё имя. Мне нужен твой ответ." },
  { en: "The fog is listening. Speak clearly.", ru: "Туман слушает. Говори чётко." },
  { en: "You are late. The silence started without you.", ru: "Ты опоздал. Тишина началась без тебя." },
  { en: "One last step. One last sentence.", ru: "Последний шаг. Последнее предложение." }
];

const RANDOM_EVENTS = [
  {
    title: "A Loose Page",
    text: "A page slips out of a broken sign and lands at your feet. There is one clean sentence on it, still warm.",
    ru: "Из сломанной вывески выпадает страница и падает тебе под ноги. На ней одна чистая фраза, ещё тёплая.",
    button: "Take the page",
    reward: "hint"
  },
  {
    title: "The Ink Puddle",
    text: "A black puddle reflects a street that is not here. For a second you see the sentence you are carrying.",
    ru: "Чёрная лужа отражает улицу, которой здесь нет. На секунду ты видишь фразу, которую несёшь.",
    button: "Look closer",
    reward: "score"
  },
  {
    title: "A Child's Shoe",
    text: "A small shoe lies by the wall. The name inside has worn away, but the leather is still warm.",
    ru: "У стены лежит маленький ботинок. Имя внутри стёрлось, но кожа ещё тёплая.",
    button: "Leave it in the light",
    reward: "heart"
  },
  {
    title: "The Vendor's Lantern",
    text: "A vendor offers you a lantern with no flame. 'Take it,' she says. 'You already have the fire.'",
    ru: "Торговка протягивает фонарь без огня. «Возьми, — говорит она. — Огонь у тебя уже есть».",
    button: "Accept the lantern",
    reward: "heal"
  },
  {
    title: "A Voice in the Wall",
    text: "Someone is reciting a list of names behind the bricks. You catch one before the wall goes quiet.",
    ru: "Кто-то читает за кирпичами список имён. Ты успеваешь поймать одно, прежде чем стена замолкает.",
    button: "Remember the name",
    reward: "hint"
  },
  {
    title: "The Empty Kiosk",
    text: "The kiosk sells nothing but old receipts. One of them has your handwriting on the back.",
    ru: "В киоске продаются только старые чеки. На обороте одного из них твой почерк.",
    button: "Read the receipt",
    reward: "score"
  }
];

const OPENERS = [
  { en: "The {faction} do not open this street for strangers.", ru: "{factionRu} не открывают эту улицу чужакам." },
  { en: "In the {district}, even the quiet has a price.", ru: "В {districtRu} даже тишина имеет цену." },
  { en: "I have watched the {district} since before the words left.", ru: "Я слежу за {districtRu} с тех пор, как ушли слова." },
  { en: "You carry a lantern into the {district}. Bold.", ru: "Ты несёшь фонарь в {districtRu}. Смело." },
  { en: "The {faction} remember every face. I don't remember yours.", ru: "{factionRu} помнят каждое лицо. Твоё я не помню." },
  { en: "Another wordcatcher at my gate. The {district} is full of them today.", ru: "Ещё один ловец слов у моих ворот. Сегодня {districtRu} ими полон." },
  { en: "The fog sent you to the {district}? Then the fog can pay your toll.", ru: "Тебя прислал туман в {districtRu}? Пусть туман и платит за проход." },
  { en: "I guard the {district} against people who forget sentences.", ru: "Я охраняю {districtRu} от тех, кто забывает предложения." },
  { en: "You want passage? The {faction} want a reason.", ru: "Хочешь пройти? {factionRu} хотят причину." },
  { en: "This street of the {district} has been silent since the Seal cracked.", ru: "Эта улица в {districtRu} молчит с тех пор, как треснула Печать." },
  { en: "I don't know your name. I know you are not from the {district}.", ru: "Я не знаю твоего имени. Знаю только, что ты не из {districtRu}." },
  { en: "The {faction} do not bargain. We listen.", ru: "{factionRu} не торгуются. Мы слушаем." },
  { en: "You are late. The {district} closed its doors at dusk.", ru: "Ты опоздал. {districtRu} закрыл двери с наступлением темноты." },
  { en: "One sentence. Then the {faction} will let you pass.", ru: "Одно предложение. И {factionRu} тебя пропустят." }
];

/* Диалоги перед боем. correct - точная строка, её ищем после перемешивания. */
const DIALOGUES = {
  m1: [
    {
      line: "Halt! Where are you going?",
      ru: "Стой! Куда ты идёшь?",
      options: ["I am looking for the House of Voices.", "I look for House Voices.", "I looking for the House of Voices."],
      correct: "I am looking for the House of Voices.",
      explain: "Present Continuous: am + looking. Действие происходит сейчас, пока стражник тебя остановил.",
      reward: 40
    },
    {
      line: "Do you live in the city?",
      ru: "Ты живёшь в городе?",
      options: ["No, I live in a small village.", "No, I living in a small village.", "No, I am live in a small village."],
      correct: "No, I live in a small village.",
      explain: "Present Simple: live. Постоянный факт, а не действие в момент речи.",
      reward: 40
    },
    {
      line: "The traffic is terrible today, isn't it?",
      ru: "Сегодня ужасное движение, правда?",
      options: ["Yes, it is always crowded during rush hour.", "Yes, it always crowded during rush hour.", "Yes, it is always crowd during rush hour."],
      correct: "Yes, it is always crowded during rush hour.",
      explain: "После is нужно прилагательное: is crowded. Always указывает на Present Simple.",
      reward: 40
    },
    {
      line: "Why are you walking?",
      ru: "Почему ты идёшь пешком?",
      options: ["Because my bike is broken.", "Because my bike broken.", "Because my bike is break."],
      correct: "Because my bike is broken.",
      explain: "Пассивное состояние: is broken. Причастие broken, а не break.",
      reward: 40
    }
  ],
  m2: [
    {
      line: "Have you read this novel?",
      ru: "Ты читал этот роман?",
      options: ["I read the first chapter last night.", "I have read it last night.", "I read it tomorrow."],
      correct: "I read the first chapter last night.",
      explain: "last night - Past Simple, поэтому read (вторая форма), а не have read.",
      reward: 40
    },
    {
      line: "The ghost appeared here, didn't it?",
      ru: "Привидение появилось здесь, да?",
      options: ["Yes, it appeared in the old castle.", "Yes, it appears in the old castle.", "Yes, it is appearing in the old castle."],
      correct: "Yes, it appeared in the old castle.",
      explain: "Past Simple: appeared. Разговор о конкретном случае в прошлом.",
      reward: 40
    },
    {
      line: "What did you use to read as a child?",
      ru: "Что ты читал в детстве?",
      options: ["I used to read fairy tales.", "I use to read fairy tales.", "I used read fairy tales."],
      correct: "I used to read fairy tales.",
      explain: "Конструкция used to + инфинитив: привычка в прошлом.",
      reward: 40
    },
    {
      line: "Who wrote this story?",
      ru: "Кто написал эту историю?",
      options: ["The author wrote it in 1998.", "The author writes it in 1998.", "The author has wrote it in 1998."],
      correct: "The author wrote it in 1998.",
      explain: "Год в прошлом требует Past Simple: wrote. Формы has wrote не существует.",
      reward: 40
    }
  ],
  m3: [
    {
      line: "Who is that girl?",
      ru: "Кто эта девочка?",
      options: ["She is the girl who won the contest.", "She is the girl which won the contest.", "She is the girl what won the contest."],
      correct: "She is the girl who won the contest.",
      explain: "Для человека используем who, а не which или what.",
      reward: 40
    },
    {
      line: "Is your brother taller than you?",
      ru: "Твой брат выше тебя?",
      options: ["Yes, he is taller than me.", "Yes, he is more tall than me.", "Yes, he is the tallest than me."],
      correct: "Yes, he is taller than me.",
      explain: "Короткое прилагательное tall образует сравнение: taller. More tall - ошибка.",
      reward: 40
    },
    {
      line: "What does your friend look like?",
      ru: "Как выглядит твой друг?",
      options: ["He has short dark hair.", "He have short dark hair.", "He is have short dark hair."],
      correct: "He has short dark hair.",
      explain: "Внешность: have got / has. Для he - has, без лишнего is.",
      reward: 40
    },
    {
      line: "Is this your portrait?",
      ru: "Это твой портрет?",
      options: ["No, it isn't mine.", "No, it isn't my.", "No, it is no mine."],
      correct: "No, it isn't mine.",
      explain: "Mine - притяжательное местоимение, заменяет my portrait.",
      reward: 40
    }
  ],
  m4: [
    {
      line: "What were you doing at eight?",
      ru: "Что ты делал в восемь?",
      options: ["I was watching the news.", "I watched the news at eight every day.", "I were watching the news."],
      correct: "I was watching the news.",
      explain: "Past Continuous: was + watching. Для I нужен was, не were.",
      reward: 40
    },
    {
      line: "Did you see the headline?",
      ru: "Ты видел заголовок?",
      options: ["Yes, I saw it yesterday.", "Yes, I seen it yesterday.", "Yes, I have saw it yesterday."],
      correct: "Yes, I saw it yesterday.",
      explain: "После did в ответе используется Past Simple: saw. Seen - третья форма, без have не ставится.",
      reward: 40
    },
    {
      line: "Who is the report about?",
      ru: "О ком этот репортаж?",
      options: ["It is about a famous singer.", "It is about famous singer.", "It about a famous singer."],
      correct: "It is about a famous singer.",
      explain: "Перед исчисляемым существительным в единственном числе нужен артикль a.",
      reward: 40
    },
    {
      line: "Are you listening to me?",
      ru: "Ты меня слушаешь?",
      options: ["Yes, I am listening.", "Yes, I listen now.", "Yes, I am listen."],
      correct: "Yes, I am listening.",
      explain: "Present Continuous: am + listening. Now подразумевается вопросом.",
      reward: 40
    }
  ],
  m5: [
    {
      line: "What will you do tomorrow?",
      ru: "Что ты будешь делать завтра?",
      options: ["I will visit the laboratory.", "I will to visit the laboratory.", "I visit will the laboratory."],
      correct: "I will visit the laboratory.",
      explain: "После will - инфинитив без to: will visit.",
      reward: 40
    },
    {
      line: "If robots can think, what will happen?",
      ru: "Если роботы смогут думать, что будет?",
      options: ["They will help people.", "They help will people.", "They will helping people."],
      correct: "They will help people.",
      explain: "First Conditional: if + Present, will + инфинитив.",
      reward: 40
    },
    {
      line: "Is this device yours?",
      ru: "Это устройство твоё?",
      options: ["Yes, it belongs to me.", "Yes, it is belong to me.", "Yes, it belonging to me."],
      correct: "Yes, it belongs to me.",
      explain: "Belong - обычный глагол: he/she/it belongs. Is belong - ошибка.",
      reward: 40
    },
    {
      line: "What are you working on?",
      ru: "Над чем ты работаешь?",
      options: ["I am building a small robot.", "I build a small robot now.", "I am build a small robot."],
      correct: "I am building a small robot.",
      explain: "Действие сейчас: am + building. Форма am build невозможна.",
      reward: 40
    }
  ],
  m6: [
    {
      line: "Have you ever been to a carnival?",
      ru: "Ты когда-нибудь был на карнавале?",
      options: ["Yes, I have been to one.", "Yes, I have went to one.", "Yes, I was been to one."],
      correct: "Yes, I have been to one.",
      explain: "Have been - опыт к настоящему моменту. Went не ставится после have.",
      reward: 40
    },
    {
      line: "When did you arrive?",
      ru: "Когда ты приехал?",
      options: ["I arrived two hours ago.", "I have arrived two hours ago.", "I arrive two hours ago."],
      correct: "I arrived two hours ago.",
      explain: "ago - маркер Past Simple, поэтому arrived, а не have arrived.",
      reward: 40
    },
    {
      line: "What are you doing tonight?",
      ru: "Что ты делаешь сегодня вечером?",
      options: ["I am going to the concert.", "I go to the concert tonight.", "I am go to the concert."],
      correct: "I am going to the concert.",
      explain: "Запланированное действие: Present Continuous с tonight.",
      reward: 40
    },
    {
      line: "Did you enjoy the show?",
      ru: "Тебе понравилось представление?",
      options: ["Yes, it was amazing.", "Yes, it were amazing.", "Yes, it is amazing yesterday."],
      correct: "Yes, it was amazing.",
      explain: "Единственное число: it was. Yesterday требует прошедшего времени.",
      reward: 40
    }
  ],
  m7: [
    {
      line: "Who was the film directed by?",
      ru: "Кем был снят фильм?",
      options: ["It was directed by a young director.", "It directed by a young director.", "It was direct by a young director."],
      correct: "It was directed by a young director.",
      explain: "Passive Voice: was + directed (третья форма).",
      reward: 40
    },
    {
      line: "Was the soundtrack recorded live?",
      ru: "Саундтрек записали вживую?",
      options: ["Yes, it was recorded in London.", "Yes, it recorded in London.", "Yes, it was record in London."],
      correct: "Yes, it was recorded in London.",
      explain: "Пассив: was recorded. Record в третьей форме - recorded.",
      reward: 40
    },
    {
      line: "How did the audience react?",
      ru: "Как отреагировала публика?",
      options: ["They were excited by the performance.", "They was excited by the performance.", "They excited by the performance."],
      correct: "They were excited by the performance.",
      explain: "They + were. Excited - прилагательное от причастия.",
      reward: 40
    },
    {
      line: "Is the actor interested in the role?",
      ru: "Актёру интересна эта роль?",
      options: ["Yes, he is interested in it.", "Yes, he is interesting in it.", "Yes, he interests in it."],
      correct: "Yes, he is interested in it.",
      explain: "Человеку интересно: is interested. Interesting описывает сам предмет.",
      reward: 40
    }
  ],
  m8: [
    {
      line: "What should we do about the rubbish?",
      ru: "Что нам делать с мусором?",
      options: ["We should recycle it.", "We should to recycle it.", "We should recycling it."],
      correct: "We should recycle it.",
      explain: "После should - инфинитив без to: should recycle.",
      reward: 40
    },
    {
      line: "Have you ever planted a tree?",
      ru: "Ты когда-нибудь сажал дерево?",
      options: ["Yes, I have planted three.", "Yes, I have plant three.", "Yes, I am planted three."],
      correct: "Yes, I have planted three.",
      explain: "Present Perfect: have + planted. Форма have plant неверна.",
      reward: 40
    },
    {
      line: "How long have you been working here?",
      ru: "Как долго ты здесь работаешь?",
      options: ["I have been working here for two years.", "I work here since two years.", "I am working here two years."],
      correct: "I have been working here for two years.",
      explain: "Present Perfect Continuous + for: действие началось раньше и продолжается.",
      reward: 40
    },
    {
      line: "Do we have to sort the waste?",
      ru: "Нам обязательно сортировать мусор?",
      options: ["Yes, we have to.", "Yes, we must to.", "Yes, we have."],
      correct: "Yes, we have to.",
      explain: "have to - модальная конструкция. После must не ставится to.",
      reward: 40
    }
  ],
  m9: [
    {
      line: "Have you bought the tickets yet?",
      ru: "Ты уже купил билеты?",
      options: ["Yes, I have already bought them.", "Yes, I have already buy them.", "Yes, I am already bought them."],
      correct: "Yes, I have already bought them.",
      explain: "Present Perfect: have + bought (третья форма buy).",
      reward: 40
    },
    {
      line: "How long have you been waiting?",
      ru: "Как долго ты ждёшь?",
      options: ["I have been waiting for ten minutes.", "I wait for ten minutes.", "I am waiting since ten minutes."],
      correct: "I have been waiting for ten minutes.",
      explain: "Present Perfect Continuous + for. Since ставится перед моментом, а не длительностью.",
      reward: 40
    },
    {
      line: "How much does this cost?",
      ru: "Сколько это стоит?",
      options: ["It costs twenty pounds.", "It cost twenty pounds.", "It is cost twenty pounds."],
      correct: "It costs twenty pounds.",
      explain: "It + costs: окончание -s в Present Simple.",
      reward: 40
    },
    {
      line: "Would you like to try it on?",
      ru: "Хочешь примерить?",
      options: ["Yes, I would.", "Yes, I like.", "Yes, I would like try it on."],
      correct: "Yes, I would.",
      explain: "Короткий ответ на would you like: Yes, I would. После would like нужен to.",
      reward: 40
    }
  ],
  m10: [
    {
      line: "You should see a doctor.",
      ru: "Тебе стоит показаться врачу.",
      options: ["I have already seen a doctor.", "I have already saw a doctor.", "I already have see a doctor."],
      correct: "I have already seen a doctor.",
      explain: "Present Perfect: have + seen. Saw - вторая форма, с have не используется.",
      reward: 40
    },
    {
      line: "How are you feeling?",
      ru: "Как ты себя чувствуешь?",
      options: ["I feel much better today.", "I am feel much better today.", "I feeling much better today."],
      correct: "I feel much better today.",
      explain: "Feel - глагол состояния; am feel и feeling без am неверны.",
      reward: 40
    },
    {
      line: "Have you taken your medicine?",
      ru: "Ты принял лекарство?",
      options: ["Yes, I took it an hour ago.", "Yes, I have took it an hour ago.", "Yes, I take it an hour ago."],
      correct: "Yes, I took it an hour ago.",
      explain: "ago - Past Simple: took. Have took - неверная форма.",
      reward: 40
    },
    {
      line: "What happened to your leg?",
      ru: "Что случилось с твоей ногой?",
      options: ["I hurt it while playing football.", "I hurted it while playing football.", "I am hurt it while playing football."],
      correct: "I hurt it while playing football.",
      explain: "Hurt - неправильный глагол, форма не меняется: hurt - hurt - hurt.",
      reward: 40
    }
  ]
};
