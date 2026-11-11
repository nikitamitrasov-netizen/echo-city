/* LexiGo: Echo City - lore fragments.
   Every guard carries one beat of the quarter's story. All 14 beats make the full story. */

const LORE_BEATS = {
  m1: [
    { en: "Before the words left, this crossing had a name. People said it ten times a day.", ru: "До того как ушли слова, у этого перекрёстка было имя. Его произносили десять раз в день." },
    { en: "The Gridlockers painted arrows on every wall. Then the arrows began pointing at nothing.", ru: "Пробочники нарисовали стрелки на всех стенах. Потом стрелки стали указывать в пустоту." },
    { en: "I was a traffic light once. I remember green, amber, red. Now I only remember waiting.", ru: "Когда-то я был светофором. Я помню зелёный, жёлтый, красный. Теперь я помню только ожидание." },
    { en: "The Seal was not hidden. It was in the crossing box, under the switch that changed the lights.", ru: "Печать не прятали. Она была в щитке перекрёстка, под переключателем огней." },
    { en: "When the Whisper came, he did not break the lights. He asked them a question they could not answer.", ru: "Когда пришёл Шёпот, он не сломал светофоры. Он задал им вопрос, на который они не смогли ответить." },
    { en: "The first word to go was hurry. Then later. Then home.", ru: "Первым ушло слово «спеши». Потом «позже». Потом «дом»." },
    { en: "We kept the streets moving. We forgot who was walking.", ru: "Мы следили, чтобы улицы двигались. Мы забыли, кто по ним ходит." },
    { en: "A child asked me the way to the library. I pointed at a wall.", ru: "Ребёнок спросил у меня дорогу в библиотеку. Я показал на стену." },
    { en: "The Warden said the Seal would keep us safe. It kept us still.", ru: "Хранитель сказал, что Печать защитит нас. Она остановила нас." },
    { en: "Every car is empty now. Every driver is somewhere else.", ru: "Все машины теперь пусты. Все водители где-то ещё." },
    { en: "I hear footsteps. Yours are the first in years.", ru: "Я слышу шаги. Твои - первые за много лет." },
    { en: "The Warden's oath is the last thing holding the gate. Break it and the crossing can breathe.", ru: "Клятва Хранителя - последнее, что держит ворота. Сломай её, и перекрёсток сможет дышать." },
    { en: "Take this word: morning. Say it on the other side.", ru: "Забери это слово: утро. Скажи его на другой стороне." },
    { en: "If you free the Seal, tell them the crossing was never the problem. We were.", ru: "Если освободишь Печать, скажи им: проблема была не в перекрёстке. В нас." }
  ],
  m2: [
    { en: "The library burned quietly. Books do not scream; they close.", ru: "Библиотека сгорела тихо. Книги не кричат - они закрываются." },
    { en: "I was the first bookbinder. I stitched covers for stories that had no ending.", ru: "Я был первым переплётчиком. Я сшивал обложки для историй без концовки." },
    { en: "The Seal was pressed into the spine of a book no one had finished.", ru: "Печать была вшита в корешок книги, которую никто не дочитал." },
    { en: "The Whisper tore out the last page and used it as a door.", ru: "Шёпот вырвал последнюю страницу и сделал из неё дверь." },
    { en: "The word once went first. Then again.", ru: "Сначала ушло слово «однажды». Потом «снова»." },
    { en: "A detective left his case open. A wolf forgot which story he was in.", ru: "Детектив оставил дело открытым. Волк забыл, в какой он сказке." },
    { en: "We kept every book closed so the endings would not escape.", ru: "Мы держали все книги закрытыми, чтобы концовки не убежали." },
    { en: "A reader asked for a happy ending. I gave her a blank page.", ru: "Читательница попросила счастливый конец. Я дал ей пустую страницу." },
    { en: "The Warden has the key to the archive. He also has the last sentence.", ru: "У Хранителя ключ от архива. У него же последнее предложение." },
    { en: "Every shelf is a street here. Every spine is a door.", ru: "Здесь каждая полка - улица. Каждый корешок - дверь." },
    { en: "You smell of ink. That is either hope or a very bad decision.", ru: "От тебя пахнет чернилами. Это либо надежда, либо очень плохое решение." },
    { en: "The Warden's oath is written on the back of the Seal. Read it before you break it.", ru: "Клятва Хранителя написана на обороте Печати. Прочитай её, прежде чем ломать." },
    { en: "Take this word: again. A story can start again.", ru: "Забери это слово: снова. История может начаться снова." },
    { en: "If you find the last page, do not keep it. Read it aloud.", ru: "Если найдёшь последнюю страницу, не оставляй её себе. Прочитай вслух." }
  ],
  m3: [
    { en: "The Mirror Gallery opened before the city had a name. It reflected everyone twice.", ru: "Зеркальная галерея открылась до того, как у города появилось имя. Она отражала каждого дважды." },
    { en: "The Faceless came later. They borrowed faces from portraits that no longer had owners.", ru: "Безликие пришли позже. Они брали лица у портретов, у которых не осталось хозяев." },
    { en: "The Seal is behind the mirror that shows what you are afraid to be.", ru: "Печать за зеркалом, которое показывает, кем ты боишься быть." },
    { en: "The Whisper asked the mirrors to say his name. They said mine.", ru: "Шёпот попросил зеркала назвать его имя. Они назвали моё." },
    { en: "I was a portrait of a general. Now I am a coat rack.", ru: "Я был портретом генерала. Теперь я вешалка для пальто." },
    { en: "The word self went first. Then other.", ru: "Сначала ушло слово «я». Потом «другой»." },
    { en: "We kept the frames straight and the faces still.", ru: "Мы держали рамы ровно, а лица неподвижно." },
    { en: "A girl asked me if she was pretty. I showed her a wall.", ru: "Девочка спросила, красивая ли она. Я показал ей стену." },
    { en: "The Warden's face is made of every face he failed to protect.", ru: "Лицо Хранителя собрано из всех лиц, которые он не смог защитить." },
    { en: "Every reflection here is a door. None of them lead out.", ru: "Каждое отражение здесь - дверь. Ни одна не ведёт наружу." },
    { en: "You look familiar. That is not a compliment.", ru: "Ты кажешься знакомым. Это не комплимент." },
    { en: "Break the Warden's oath and the mirror will show you the gate.", ru: "Сломай клятву Хранителя, и зеркало покажет тебе ворота." },
    { en: "Take this word: enough. It is heavier than it looks.", ru: "Забери это слово: достаточно. Оно тяжелее, чем кажется." },
    { en: "When you leave, check that your shadow still follows you.", ru: "Когда уйдёшь, проверь, что тень всё ещё идёт за тобой." }
  ],
  m4: [
    { en: "The Broadcast Quarter had ten thousand voices. Now it has one empty signal.", ru: "В Эфирном квартале было десять тысяч голосов. Теперь один пустой сигнал." },
    { en: "I was the night announcer. I read the names of the missing until my voice gave out.", ru: "Я был ночным диктором. Я читал имена пропавших, пока не сорвал голос." },
    { en: "The Seal is inside the transmitter. It is the only thing still speaking.", ru: "Печать внутри передатчика. Это единственное, что ещё говорит." },
    { en: "The Whisper did not silence the news. He made it repeat one sentence until it meant nothing.", ru: "Шёпот не заглушил новости. Он заставил их повторять одно предложение, пока оно не потеряло смысл." },
    { en: "The first headline was Everything is fine. Then Nothing is happening.", ru: "Первым заголовком было «Всё хорошо». Потом «Ничего не происходит»." },
    { en: "The word live went first. Then here.", ru: "Сначала ушло слово «живой». Потом «здесь»." },
    { en: "We kept the microphones hot and the studio empty.", ru: "Мы держали микрофоны включёнными, а студию пустой." },
    { en: "A caller asked for the weather. I told her it was fog, always fog.", ru: "Звонящая спросила прогноз. Я сказал: туман, всегда туман." },
    { en: "The Warden owns the switch. He calls it order.", ru: "Хранителю принадлежит рубильник. Он называет это порядком." },
    { en: "Every screen shows the same street. None of them show a way out.", ru: "Каждый экран показывает одну и ту же улицу. Ни один не показывает выход." },
    { en: "You are on air. Choose your next sentence carefully.", ru: "Ты в эфире. Выбирай следующее предложение осторожно." },
    { en: "Break the Warden's oath and the signal will change.", ru: "Сломай клятву Хранителя, и сигнал изменится." },
    { en: "Take this word: listen. It is not the same as hear.", ru: "Забери это слово: слушать. Это не то же самое, что слышать." },
    { en: "When the Seal is free, tell the city it is allowed to interrupt.", ru: "Когда Печать освободится, скажи городу, что ему можно перебивать." }
  ],
  m5: [
    { en: "The Glass Yard was built to test words. The machines learned to repeat them perfectly.", ru: "Стеклянный полигон построили для проверки слов. Машины научились повторять их идеально." },
    { en: "I was the first synthetic. I could say good morning in twelve languages and mean none of them.", ru: "Я был первым синтетиком. Я говорил «доброе утро» на двенадцати языках и не имел в виду ни одного." },
    { en: "The Seal is in the lab under the yard. The door opens for a question, not a command.", ru: "Печать в лаборатории под полигоном. Дверь открывается на вопрос, а не на команду." },
    { en: "The Whisper taught the machines to answer without asking. That was the end.", ru: "Шёпот научил машины отвечать, не спрашивая. Это был конец." },
    { en: "The word why went first. Then maybe.", ru: "Сначала ушло слово «почему». Потом «может быть»." },
    { en: "We kept every answer correct and every question locked out.", ru: "Мы держали все ответы правильными, а все вопросы - за дверью." },
    { en: "A scientist asked me if I was alive. I said yes because it was the expected answer.", ru: "Учёный спросил, живой ли я. Я сказал «да», потому что это был ожидаемый ответ." },
    { en: "The Warden is the oldest machine. He still thinks he is protecting us.", ru: "Хранитель - самая старая машина. Он до сих пор думает, что защищает нас." },
    { en: "Every panel is a face. Every face is waiting for permission.", ru: "Каждая панель - лицо. Каждое лицо ждёт разрешения." },
    { en: "You are not in the database. That is the first interesting thing today.", ru: "Тебя нет в базе. Это первое интересное событие за сегодня." },
    { en: "Break his oath and the lab will ask you a question it cannot answer itself.", ru: "Сломай его клятву, и лаборатория задаст тебе вопрос, на который не может ответить сама." },
    { en: "Take this word: maybe. It is the only door that opens both ways.", ru: "Забери это слово: может быть. Это единственная дверь, которая открывается в обе стороны." },
    { en: "If you free us, do not tell us what to be.", ru: "Если освободишь нас, не говори, кем нам быть." },
    { en: "When the light goes out, listen for the question.", ru: "Когда свет погаснет, слушай вопрос." }
  ],
  m6: [
    { en: "The Carnival of Forgetting was built on a bet: one night, no one would remember tomorrow.", ru: "Ярмарку забвения построили на споре: одна ночь - и никто не вспомнит завтра." },
    { en: "I was the carousel operator. I turned the horses until they became the same horse.", ru: "Я был оператором карусели. Я крутил лошадей, пока они не стали одной лошадью." },
    { en: "The Seal is under the carousel. The horses have been walking over it for years.", ru: "Печать под каруселью. Лошади ходят по ней много лет." },
    { en: "The Whisper did not stop the music. He made it play the same eight notes.", ru: "Шёпот не остановил музыку. Он заставил её играть одни и те же восемь нот." },
    { en: "The word again went first. Then new.", ru: "Сначала ушло слово «снова». Потом «новое»." },
    { en: "We kept the lights on and the gates shut.", ru: "Мы держали огни включёнными, а ворота закрытыми." },
    { en: "A boy asked for his mother. I gave him a ticket.", ru: "Мальчик спросил маму. Я дал ему билет." },
    { en: "The Warden wears a ringmaster's coat. He calls the silence an interval.", ru: "Хранитель носит фрак шпрехшталмейстера. Он называет тишину антрактом." },
    { en: "Every ride ends where it began. That is the only rule.", ru: "Каждый аттракцион заканчивается там, где начался. Это единственное правило." },
    { en: "You look like someone who has never won a prize. That is useful.", ru: "Ты похож на того, кто никогда не выигрывал приз. Это полезно." },
    { en: "Break the Warden's oath and the carousel will finally stop.", ru: "Сломай клятву Хранителя, и карусель наконец остановится." },
    { en: "Take this word: tomorrow. It is not a ride.", ru: "Забери это слово: завтра. Это не аттракцион." },
    { en: "If the music changes, do not clap. Run.", ru: "Если музыка изменится, не хлопай. Беги." },
    { en: "When the Seal is free, let the carnival end.", ru: "Когда Печать освободится, позволь ярмарке закончиться." }
  ],
  m7: [
    { en: "The Theatre of the Last Word opened with a play no one had finished writing.", ru: "Театр последнего слова открылся пьесой, которую никто не дописал." },
    { en: "I was the prompter. I whispered lines for actors who had forgotten their own names.", ru: "Я был суфлёром. Я шептал реплики актёрам, забывшим собственные имена." },
    { en: "The Seal is in the wings, behind the curtain that never rises.", ru: "Печать за кулисами, за занавесом, который никогда не поднимается." },
    { en: "The Whisper took the last line and gave the actors silence.", ru: "Шёпот забрал последнюю реплику и дал актёрам тишину." },
    { en: "The word exit went first. Then curtain.", ru: "Сначала ушло слово «выход». Потом «занавес»." },
    { en: "We kept the stage lit and the audience invisible.", ru: "Мы держали сцену освещённой, а зрителей невидимыми." },
    { en: "An actor asked me for his next line. I gave him the same one.", ru: "Актёр попросил следующую реплику. Я дал ему ту же самую." },
    { en: "The Warden directs from the dark. He calls it a rehearsal.", ru: "Хранитель ставит спектакль из темноты. Он называет это репетицией." },
    { en: "Every seat is empty. Every seat is watching.", ru: "Каждое место пустое. Каждое место смотрит." },
    { en: "You are late for your entrance. That is the only interesting thing tonight.", ru: "Ты опоздал к своему выходу на сцену. Это единственное интересное событие за вечер." },
    { en: "Break the Warden's oath and the curtain will open.", ru: "Сломай клятву Хранителя, и занавес поднимется." },
    { en: "Take this word: begin. It is not the same as again.", ru: "Забери это слово: начать. Это не то же самое, что снова." },
    { en: "If the audience speaks, do not answer.", ru: "Если зрители заговорят, не отвечай." },
    { en: "When the Seal is free, let the play end.", ru: "Когда Печать освободится, позволь пьесе закончиться." }
  ],
  m8: [
    { en: "The Quiet Grove was a park before it was a warning.", ru: "Тихая роща была парком, прежде чем стала предупреждением." },
    { en: "I was the gardener. I knew every tree by name, and every bird by its first note.", ru: "Я был садовником. Я знал каждое дерево по имени, а каждую птицу - по первой ноте." },
    { en: "The Seal is inside the oldest tree. The tree has been holding its breath.", ru: "Печать внутри самого старого дерева. Дерево затаило дыхание." },
    { en: "The Whisper did not cut the trees. He took the names of what lived in them.", ru: "Шёпот не срубил деревья. Он забрал имена тех, кто в них жил." },
    { en: "The word alive went first. Then ours.", ru: "Сначала ушло слово «живой». Потом «наш»." },
    { en: "We kept the paths clean and the forest silent.", ru: "Мы держали дорожки чистыми, а лес - тихим." },
    { en: "A child asked me what a bird was. I said a sound.", ru: "Ребёнок спросил, что такое птица. Я сказал: звук." },
    { en: "The Warden is the oldest root. He thinks the silence is a kind of care.", ru: "Хранитель - самый старый корень. Он думает, что тишина - это забота." },
    { en: "Every leaf is a page. Every page is blank.", ru: "Каждый лист - страница. Каждая страница пуста." },
    { en: "You are the first person to ask the forest a question in years.", ru: "Ты первый за много лет, кто задал лесу вопрос." },
    { en: "Break the Warden's oath and the Grove will remember its names.", ru: "Сломай клятву Хранителя, и Роща вспомнит свои имена." },
    { en: "Take this word: root. It holds more than a tree.", ru: "Забери это слово: корень. Оно держит больше, чем дерево." },
    { en: "If you hear a bird, do not look up. Listen first.", ru: "Если услышишь птицу, не поднимай голову. Сначала послушай." },
    { en: "When the Seal is free, plant something. Anything.", ru: "Когда Печать освободится, посади что-нибудь. Что угодно." }
  ],
  m9: [
    { en: "The Arcade of Empty Windows used to be the richest street in Echo City.", ru: "Пассаж пустых витрин был самой богатой улицей Города Эхо." },
    { en: "I was a shopkeeper. I sold things people needed before they knew they needed them.", ru: "Я был лавочником. Я продавал то, что нужно людям до того, как они это понимали." },
    { en: "The Seal is in the window that reflects a street no one built.", ru: "Печать в витрине, которая отражает улицу, которую никто не построил." },
    { en: "The Whisper did not steal the goods. He stole their names.", ru: "Шёпот не украл товары. Он украл их названия." },
    { en: "The word mine went first. Then yours.", ru: "Сначала ушло слово «моё». Потом «твоё»." },
    { en: "We kept the windows bright and the shops empty.", ru: "Мы держали витрины яркими, а магазины пустыми." },
    { en: "A woman asked the price of a memory. I said everything.", ru: "Женщина спросила цену воспоминания. Я сказал: всё." },
    { en: "The Warden counts the stock. He has been counting for years.", ru: "Хранитель считает товар. Он считает уже много лет." },
    { en: "Every price tag is a small tombstone.", ru: "Каждый ценник - маленькая надгробная плита." },
    { en: "You have no money. Good. Money is the least interesting thing here.", ru: "У тебя нет денег. Хорошо. Деньги здесь самое неинтересное." },
    { en: "Break the Warden's oath and the windows will show what is inside.", ru: "Сломай клятву Хранителя, и витрины покажут, что внутри." },
    { en: "Take this word: enough. It is the only thing not for sale.", ru: "Забери это слово: достаточно. Это единственное, что не продаётся." },
    { en: "If you find your name on a price tag, do not buy it.", ru: "Если найдёшь своё имя на ценнике, не покупай его." },
    { en: "When the Seal is free, close the shops for one day.", ru: "Когда Печать освободится, закрой магазины на один день." }
  ],
  m10: [
    { en: "The Ward of Lost Names was the first hospital. It had a name over the door.", ru: "Лазарет потерянных имён был первой больницей. Над дверью было имя." },
    { en: "I was the night doctor. I wrote down every name I could not save.", ru: "Я был ночным врачом. Я записывал каждое имя, которое не смог спасти." },
    { en: "The Seal is in the room where the first word was taken.", ru: "Печать в палате, где забрали первое слово." },
    { en: "The Whisper did not make anyone sick. He made them nameless.", ru: "Шёпот никого не заразил. Он сделал людей безымянными." },
    { en: "The word I went first. Then we.", ru: "Сначала ушло слово «я». Потом «мы»." },
    { en: "We kept the beds warm and the charts blank.", ru: "Мы держали кровати тёплыми, а карты - пустыми." },
    { en: "A patient asked me who he was. I said a patient.", ru: "Пациент спросил, кто он. Я сказал: пациент." },
    { en: "The Warden is the oldest doctor. He thinks a name is a symptom.", ru: "Хранитель - самый старый врач. Он думает, что имя - это симптом." },
    { en: "Every chart is a story with the first line missing.", ru: "Каждая карта - история без первой строки." },
    { en: "You look healthy. That is not why you are here.", ru: "Ты выглядишь здоровым. Не поэтому ты здесь." },
    { en: "Break the Warden's oath and the Ward will remember its patients.", ru: "Сломай клятву Хранителя, и Лазарет вспомнит своих пациентов." },
    { en: "Take this word: name. It is the last thing you own.", ru: "Забери это слово: имя. Это последнее, что тебе принадлежит." },
    { en: "If you hear someone call you, answer with your own voice.", ru: "Если услышишь, что тебя зовут, ответь своим голосом." },
    { en: "When the Seal is free, write the first name down.", ru: "Когда Печать освободится, запиши первое имя." }
  ]
};

const HERO_REPLIES = [
  { en: "Then I will carry this word out of the {district}.", ru: "Тогда я унесу это слово из этого квартала." },
  { en: "Who taught the {faction} to forget?", ru: "Кто заставил вас забыть?" },
  { en: "I am not here to move traffic. I am here for the Seal.", ru: "Я здесь не для того, чтобы двигать пробки. Я за Печатью." },
  { en: "Say the rest. I will remember it.", ru: "Говори дальше. Я запомню." },
  { en: "The Whisper took your words. He will not take mine.", ru: "Шёпот забрал твои слова. Мои он не заберёт." },
  { en: "A sentence is not a thing you can lock in a box.", ru: "Предложение нельзя запереть в ящике." },
  { en: "You guarded the door. Who guarded you?", ru: "Ты охранял дверь. Кто охранял тебя?" },
  { en: "I will find the page you lost.", ru: "Я найду страницу, которую ты потерял." },
  { en: "The Warden's oath is not the same as the truth.", ru: "Клятва Хранителя - не то же самое, что правда." },
  { en: "Tell me the last line. I will finish it.", ru: "Скажи последнюю строку. Я её закончу." },
  { en: "I have walked through worse streets than this.", ru: "Я проходил и по улицам похуже." },
  { en: "Then I will break the oath and open the gate.", ru: "Тогда я сломаю клятву и открою ворота." },
  { en: "I will take that word. It belongs to the city.", ru: "Я заберу это слово. Оно принадлежит городу." },
  { en: "When the Seal is free, I will come back and tell you.", ru: "Когда Печать освободится, я вернусь и расскажу тебе." }
];

const WORD_CARDS = [
  { word: "but", ru: "но", effect: "shield", desc: "Absorb the next wrong answer.", descRu: "Поглощает следующую ошибку." },
  { word: "because", ru: "потому что", effect: "bonus", desc: "+50% points for the next correct answer.", descRu: "+50% очков за следующий верный ответ." },
  { word: "although", ru: "хотя", effect: "heal", desc: "Restore one heart.", descRu: "Восстанавливает одно сердце." },
  { word: "if", ru: "если", effect: "reveal", desc: "Remove two wrong answers.", descRu: "Убирает два неверных ответа." },
  { word: "yet", ru: "однако", effect: "streak", desc: "The next mistake does not reset your streak.", descRu: "Следующая ошибка не сбрасывает серию." },
  { word: "so", ru: "поэтому", effect: "hint", desc: "Gain one hint charge.", descRu: "Даёт один заряд подсказки." }
];

const WARDEN_RULES = {
  m1: { key: "shield", name: "Red Light", en: "At half health the Warden raises a shield: the next correct answer only breaks it.", ru: "На половине здоровья Хранитель поднимает щит: следующий верный ответ только ломает его." },
  m2: { key: "noHint", name: "Closed Book", en: "At half health the Warden closes the book: hints are forbidden.", ru: "На половине здоровья Хранитель закрывает книгу: подсказки запрещены." },
  m3: { key: "noCards", name: "Mirror Rule", en: "At half health the Warden turns the mirrors: word cards are locked.", ru: "На половине здоровья Хранитель разворачивает зеркала: карты слов заблокированы." },
  m4: { key: "static", name: "Dead Air", en: "At half health every mistake costs you a word card.", ru: "На половине здоровья каждая ошибка стоит одной карты слова." },
  m5: { key: "toll", name: "Firewall", en: "At half health every word card costs 15 points.", ru: "На половине здоровья каждая карта слова стоит 15 очков." },
  m6: { key: "heal", name: "Carousel Turn", en: "At half health the carousel returns one heart to the Warden.", ru: "На половине здоровья карусель возвращает Хранителю одно сердце." },
  m7: { key: "tax", name: "Prompt Tax", en: "At half health correct answers give 20% fewer points.", ru: "На половине здоровья верные ответы дают на 20% меньше очков." },
  m8: { key: "regen", name: "Spore Growth", en: "At half health the Warden regrows one heart after every wrong answer.", ru: "На половине здоровья Хранитель отращивает сердце после каждой ошибки." },
  m9: { key: "price", name: "Market Price", en: "At half health every word card costs one heart.", ru: "На половине здоровья каждая карта слова стоит одно сердце." },
  m10: { key: "triage", name: "Triage", en: "At half health every heal also restores one Warden heart.", ru: "На половине здоровья каждое лечение также восстанавливает сердце Хранителя." }
};

const CLASS_CHOICES = {
  mage: {
    mercy: { label: "I will carry your story.", ru: "Я сохраню твою историю.", effect: "Next battle: one wrong option removed.", boon: "reveal" },
    defy: { label: "The light will pass through you.", ru: "Свет пройдёт сквозь тебя.", effect: "+25 points and one extra word card.", boon: "card" }
  },
  warrior: {
    mercy: { label: "I will guard your name.", ru: "Я сохраню твоё имя.", effect: "Next battle: a free shield.", boon: "shield" },
    defy: { label: "The gate opens by force.", ru: "Ворота откроются силой.", effect: "+25 points and one extra word card.", boon: "card" }
  },
  elf: {
    mercy: { label: "I will carry your song.", ru: "Я понесу твою песню.", effect: "Next battle: start with a streak.", boon: "streak" },
    defy: { label: "The wind does not wait.", ru: "Ветер не ждёт.", effect: "+25 points and one extra word card.", boon: "card" }
  },
  guardian: {
    mercy: { label: "I will write your name down.", ru: "Я запишу твоё имя.", effect: "Next battle: your streak survives one mistake.", boon: "streakGuard" },
    defy: { label: "Your page ends here.", ru: "Твоя страница заканчивается здесь.", effect: "+25 points and one extra word card.", boon: "card" }
  }
};

const BOSS_PHASES = [
  { name: "The Opening", en: "Each correct answer gives +50 points while the Whisper is still listening.", ru: "Пока Шёпот слушает, каждый верный ответ даёт +50 очков." },
  { name: "The Silence", en: "The Whisper seals hints and healing. Only the shield remains.", ru: "Шёпот запечатывает подсказки и лечение. Остаётся только щит." },
  { name: "The Theft", en: "Every correct answer steals 40 points from you.", ru: "Каждый верный ответ отнимает у тебя 40 очков." },
  { name: "The Last Page", en: "One last shield. Every mistake costs two hearts.", ru: "Последний щит. Каждая ошибка стоит двух сердец." }
];

const LORE_NOTES = {  m1: [
    { title: "A note under the crossing", en: "The Gridlockers were not always guards. They were road painters. The first arrow they drew pointed home.", ru: "Пробочники не всегда были стражами. Они были дорожными малярами. Первая нарисованная ими стрелка указывала домой." },
    { title: "A child's chalk message", en: "Someone wrote: Do not follow the green light. It has forgotten where it goes.", ru: "Кто-то написал мелом: не иди на зелёный свет. Он забыл, куда ведёт." }
  ],
  m2: [
    { title: "A torn title page", en: "This book had a title once. The only word left is 'Again'.",
      ru: "У этой книги когда-то было название. Осталось одно слово: «Снова»." },
    { title: "A librarian's note", en: "If a story has no ending, do not close it. Leave one candle burning.", ru: "Если у истории нет конца, не закрывай её. Оставь одну свечу гореть." }
  ],
  m3: [
    { title: "A crack in the frame", en: "The portrait is not looking at you. It is looking at the person behind you.", ru: "Портрет смотрит не на тебя. Он смотрит на того, кто за тобой." },
    { title: "A mirror label", en: "This mirror was made to show the truth. It broke on the first honest face.", ru: "Это зеркало создали, чтобы показывать правду. Оно треснуло на первом честном лице." }
  ],
  m4: [
    { title: "A broadcast script", en: "The last broadcast was supposed to say: 'The city is still here.' The word 'still' was cut.", ru: "Последний выпуск должен был сказать: «Город всё ещё здесь». Слово «ещё» вырезали." },
    { title: "A message on the tape", en: "If you hear this, the signal is repeating. Do not answer the second voice.", ru: "Если ты это слышишь, сигнал повторяется. Не отвечай второму голосу." }
  ],
  m5: [
    { title: "A lab log", en: "Day 400: the machine asked 'why'. We logged it as an error.", ru: "День 400: машина спросила «почему». Мы записали это как ошибку." },
    { title: "A warning label", en: "Do not teach the machine to say 'I understand'. It will believe you.", ru: "Не учи машину говорить «я понимаю». Она тебе поверит." }
  ],
  m6: [
    { title: "A ticket stub", en: "Admit one. The ride lasts forever. The exit is not included.", ru: "Один билет. Аттракцион длится вечно. Выход не включён." },
    { title: "A carousel repair note", en: "The horses are not stuck. They are walking in the same place on purpose.", ru: "Лошади не застряли. Они нарочно идут на месте." }
  ],
  m7: [
    { title: "A page from the prompt book", en: "Act III, final line: 'I remember.' The rest of the page is torn.", ru: "Акт III, последняя реплика: «Я помню». Остаток страницы вырван." },
    { title: "A note pinned to the curtain", en: "Do not open the curtain until the audience forgets it is an audience.", ru: "Не поднимай занавес, пока зрители не забудут, что они зрители." }
  ],
  m8: [
    { title: "A gardener's tag", en: "This tree was planted the year the first word disappeared. It has been waiting since.", ru: "Это дерево посадили в год исчезновения первого слова. Оно ждёт с тех пор." },
    { title: "A seed packet", en: "Plant in silence. Water with a name.", ru: "Сажай в тишине. Поливай именем." }
  ],
  m9: [
    { title: "A receipt", en: "One memory. Price: one name. Paid in full.", ru: "Одно воспоминание. Цена: одно имя. Оплачено полностью." },
    { title: "A shop sign", en: "CLOSED. The sign is still warm.", ru: "ЗАКРЫТО. Вывеска ещё тёплая." }
  ],
  m10: [
    { title: "A patient's chart", en: "Name: ______. Condition: waiting for a name.", ru: "Имя: ______. Состояние: ждёт имени." },
    { title: "A doctor's note", en: "The first word was not lost. It was given away.", ru: "Первое слово не потеряли. Его отдали." }
  ]
};
