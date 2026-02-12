// --- State ---
const state = {
    myProfile: null,
    friends: [],
    diary: [],
    currentFriendIndex: -1, // -1 = Index Page, 0+ = Friend Index
    currentDiaryIndex: 0    // 0 = Latest entry
};

// --- Elements ---
// Views & Tabs
const createView = document.getElementById('createView');
const bookView = document.getElementById('bookView');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

// Forms & Inputs
const profileForm = document.getElementById('profileForm');
const resetBtn = document.getElementById('resetBtn');

// Friend UI
const addFriendBtn = document.getElementById('addFriendBtn');
const friendFormOverlay = document.getElementById('friendFormOverlay');
const cancelFriendBtn = document.getElementById('cancelFriendBtn');
const saveFriendBtn = document.getElementById('saveFriendBtn');
const friendNameInput = document.getElementById('friendName');
const friendMBTISelect = document.getElementById('friendMBTI');

// Friend Book Elements
const friendBookContainer = document.getElementById('friendBookContainer');
const prevFriendBtn = document.getElementById('prevFriendBtn');
const nextFriendBtn = document.getElementById('nextFriendBtn');
const friendIndexPage = document.getElementById('friendIndexPage');
const friendSpread = document.getElementById('friendSpread');

// Friend Spread Elements
const bookImg = document.getElementById('bookImg');
const bookSpecies = document.getElementById('bookSpecies');
const bookName = document.getElementById('bookName');
const bookMBTI = document.getElementById('bookMBTI');
const bookRole = document.getElementById('bookRole');
const bookMood = document.getElementById('bookMood');
const bookRel = document.getElementById('bookRel');
const bookBlood = document.getElementById('bookBlood');
const bookSign = document.getElementById('bookSign');
const bookHobby = document.getElementById('bookHobby');
const bookMessage = document.getElementById('bookMessage');
const bookExchangeBtn = document.getElementById('bookExchangeBtn');
const bookPageNum = document.getElementById('bookPageNum');

// Diary UI
const nextDayBtn = document.getElementById('nextDayBtn');
const prevDiaryBtn = document.getElementById('prevDiaryBtn');
const nextDiaryBtn = document.getElementById('nextDiaryBtn');
const diaryPage = document.getElementById('diaryPage');

// Write Diary UI
const writeDiaryModal = document.getElementById('writeDiaryModal');
const diaryInput = document.getElementById('diaryInput');
const questionPrompt = document.getElementById('questionPrompt');
const cancelDiaryBtn = document.getElementById('cancelDiaryBtn');
const sendDiaryBtn = document.getElementById('sendDiaryBtn');
const stickerBtns = document.querySelectorAll('.sticker-btn');
const fontBtns = document.querySelectorAll('.tool-btn');

// Profile Elements
const resName = document.getElementById('resName');
const resMBTI = document.getElementById('resMBTI');
const resSpeciesName = document.getElementById('resSpeciesName');
const resDesc = document.getElementById('resDesc');
const resMessage = document.getElementById('resMessage');
const resCharImg = document.getElementById('resCharImg');
const creationDate = document.getElementById('creationDate');
// Extended Profile Elements
const resBlood = document.getElementById('resBlood');
const resSign = document.getElementById('resSign');
const resHobby = document.getElementById('resHobby');
const lockBlood = document.getElementById('lockBlood');
const lockHobby = document.getElementById('lockHobby');
const resRole = document.getElementById('resRole');
const resMood = document.getElementById('resMood');

// Exchange Elements
const openExchangeBtn = document.getElementById('openExchangeBtn');
const exchangeModal = document.getElementById('exchangeModal');
const closeExchangeBtn = document.getElementById('closeExchangeBtn');
const tabExport = document.getElementById('tabExport');
const tabImport = document.getElementById('tabImport');
const viewExport = document.getElementById('viewExport');
const viewImport = document.getElementById('viewImport');
const qrcodeDisplay = document.getElementById('exportDataOutput');
const importDataInput = document.getElementById('importDataInput');
const importProfileBtn = document.getElementById('importProfileBtn');

// Shinri Test Elements
const testModal = document.getElementById('testModal');
const closeTestBtn = document.getElementById('closeTestBtn');
const addTestBtn = document.getElementById('addTestBtn');
const testQuestion = document.getElementById('testQuestion');
const testOptions = document.getElementById('testOptions');

// Handwriting Analysis Elements
const analysisQuestionArea = document.getElementById('analysisQuestionArea');
const handwritingQuestionText = document.getElementById('handwritingQuestionText');
const handwritingOptions = document.getElementById('handwritingOptions');
const analysisOptions = document.querySelector('.analysis-options');
const scanText = document.getElementById('scanText');

// Feedback Elements
const feedbackModal = document.getElementById('feedbackModal');
const openFeedbackBtn = document.getElementById('floatingBugBtn');
const closeFeedbackBtn = document.getElementById('closeFeedbackBtn');
const feedbackForm = document.getElementById('feedbackForm');
const debugInfoInput = document.getElementById('debugInfoInput');

// ... (Constants kept same) ...

// --- Render Logic (Book Metaphor) ---

function renderFriendBook() {
    // 1. Navigation Visibility
    const total = state.friends.length;

    if (state.currentFriendIndex === -1) {
        // Show Index, Hide Spread
        friendIndexPage.classList.remove('hidden');
        friendSpread.classList.add('hidden');
        prevFriendBtn.classList.add('hidden'); // No prev from index
        nextFriendBtn.classList.toggle('hidden', total === 0); // Show next if friends exist

        renderFriendIndex();
    } else {
        // Show Spread, Hide Index
        friendIndexPage.classList.add('hidden');
        friendSpread.classList.remove('hidden');
        prevFriendBtn.classList.remove('hidden');
        nextFriendBtn.classList.remove('hidden');

        renderFriendSpread(state.currentFriendIndex);
    }
}

function renderFriendIndex() {
    // Clear lists
    document.querySelector('#indexLover .index-list').innerHTML = '';
    document.querySelector('#indexFamily .index-list').innerHTML = '';
    document.querySelector('#indexFriend .index-list').innerHTML = '';

    if (state.friends.length === 0) {
        document.querySelector('#indexFriend .index-list').innerHTML = '<li>まだ友達がいません...</li>';
        return;
    }

    state.friends.forEach((f, idx) => {
        const li = document.createElement('li');
        li.innerText = `${f.name} (${f.species})`;
        li.onclick = () => {
            state.currentFriendIndex = idx;
            renderFriendBook();
        };

        const rel = f.relation || 'friend';
        if (rel === 'lover') document.querySelector('#indexLover .index-list').appendChild(li);
        else if (rel === 'family') document.querySelector('#indexFamily .index-list').appendChild(li);
        else document.querySelector('#indexFriend .index-list').appendChild(li);
    });
}

function renderFriendSpread(index) {
    const friend = state.friends[index];
    if (!friend) return;

    // Generate random details if missing (Legacy support)
    if (!friend.blood) {
        // Reuse logic from openFriendProfile logic
        generateRandomDetails(friend);
    }

    // Left Page
    bookImg.src = friend.image;
    bookSpecies.innerText = friend.species;
    bookName.innerText = friend.name;
    bookMBTI.innerText = friend.mbti + " Type";
    bookRole.innerText = ROLE_MAP[friend.role] || friend.role;
    bookMood.innerText = MOOD_MAP[friend.mood] || friend.mood;

    // Right Page
    const relText = (RELATION_BADGES[friend.relation] || '友') + ' ' + (friend.relation || 'Friend');
    bookRel.innerText = relText;
    bookRel.style.color = RELATION_COLORS[friend.relation] || '#333';

    bookBlood.innerText = friend.blood + "型";
    bookSign.innerText = friend.sign;
    bookHobby.innerText = friend.hobby;

    // Calc Hearts
    const heartCount = Math.floor(friend.affinity / 20);
    const hearts = '♥'.repeat(heartCount) + '♡'.repeat(5 - heartCount);
    bookMessage.innerText = `Affinity: ${hearts}\n\n${friend.message || "お風呂入りたい..."}`;
    // Note: 'message' field might not exist on friend obj in older versions, defaulting.

    // Page Number
    bookPageNum.innerText = `Page ${index + 1} / ${state.friends.length}`;

    // Action Button
    const todayStr = new Date().toLocaleDateString();
    const canExchange = friend.lastExchanged !== todayStr;
    bookExchangeBtn.innerText = canExchange ? "交換日記する！" : "本日は交換済み";
    bookExchangeBtn.disabled = !canExchange;
    bookExchangeBtn.onclick = () => openWriteDiaryModal(friend.id);
}

function generateRandomDetails(friend) {
    const O_BLOOD = ['A', 'B', 'O', 'AB'];
    const O_SIGN = ['おひつじ座', 'おうし座', 'ふたご座', 'かに座', 'しし座', 'おとめ座', 'てんびん座', 'さそり座', 'いて座', 'やぎ座', 'みずがめ座', 'うお座'];
    const O_HOBBY = ['貝殻集め', '海流サーフィン', '人間観察', '深海クッキング', '寝ること', '光ること'];

    friend.blood = O_BLOOD[Math.floor(Math.random() * O_BLOOD.length)];
    friend.sign = O_SIGN[Math.floor(Math.random() * O_SIGN.length)];
    friend.hobby = O_HOBBY[Math.floor(Math.random() * O_HOBBY.length)];
    friend.role = Object.keys(ROLE_MAP)[Math.floor(Math.random() * 6)];
    friend.mood = Object.keys(MOOD_MAP)[Math.floor(Math.random() * 5)];
    saveState();
}

// --- Missing Functions Implementation ---

function resetProfile() {
    if (confirm("プロフィールを消去して最初からやり直しますか？")) {
        localStorage.removeItem('deepSeaState');
        location.reload();
    }
}

function checkUnlockables() {
    // Optional: add logic to unlock stickers or features
    console.log("Checking unlockables...");
}

function openFriendModal() {
    friendFormOverlay.classList.remove('hidden');
}

function closeFriendModal() {
    friendFormOverlay.classList.add('hidden');
}

function saveFriend() {
    const name = friendNameInput.value;
    const mbti = friendMBTISelect.value;
    if (!name || !mbti) return alert("お名前とMBTIを入力してね！");

    const mapping = DEEP_SEA_MAPPING[mbti];
    const newFriend = {
        id: Date.now(),
        name: name,
        mbti: mbti,
        species: mapping ? mapping.species : "Unknown",
        image: mapping ? mapping.image : "",
        relation: document.getElementById('friendRelation').value,
        affinity: 20,
        blood: "", // Will be randomized if empty later
        sign: "",
        hobby: "",
        role: "healer",
        mood: "fine",
        lastExchanged: null
    };

    generateRandomDetails(newFriend);
    state.friends.push(newFriend);
    saveState();
    closeFriendModal();

    // Reset form
    friendNameInput.value = "";
    friendMBTISelect.value = "";
}

function openWriteDiaryModal(friendId) {
    const friend = state.friends.find(f => f.id === friendId);
    if (!friend) return;

    state.targetFriendId = friendId; // Temporary storage
    writeDiaryModal.classList.remove('hidden');

    // Choose a random question
    const questions = ["好きな深海魚は？", "最近のマイブームは？", "今行きたいところは？", "秘密を教えて！"];
    questionPrompt.innerText = questions[Math.floor(Math.random() * questions.length)];
}

function closeWriteDiaryModal() {
    writeDiaryModal.classList.add('hidden');
    diaryInput.value = "";
}

function sendDiaryEntry() {
    const content = diaryInput.value;
    if (!content) return alert("日記を書いてね！");

    const friend = state.friends.find(f => f.id === state.targetFriendId);
    if (!friend) return;

    const entry = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        content: content,
        chars: [state.myProfile, friend],
        header: {
            weather: document.getElementById('diaryWeather').value,
            event: document.getElementById('diaryEvent').value,
            plan: document.getElementById('diaryPlan').value
        },
        font: state.myProfile.font
    };

    state.diary.unshift(entry);
    if (friend) {
        friend.affinity = Math.min(100, (friend.affinity || 0) + 10);
        friend.lastExchanged = new Date().toLocaleDateString();
    }

    saveState();
    closeWriteDiaryModal();
    renderDiaryBook();
    renderFriendBook();

    // Open Export Modal
    openDiaryExportModal(entry);
}

// --- Diary Logic (One Day per Page) ---
const WEATHER_ICONS = {
    sunny: "☀", cloudy: "☁", rainy: "☔", storm: "⛈", snow: "⛄", current: "〰"
};

function renderDiaryBook() {
    if (state.diary.length === 0) {
        // Empty State
        document.getElementById('diaryContentDisplay').innerText = "まだ日記がありません。\n友達と交換日記を始めよう！";
        document.getElementById('diaryDate').innerText = "----.--.--";
        prevDiaryBtn.classList.add('hidden');
        nextDiaryBtn.classList.add('hidden');
        return;
    }

    // Navigation Bounds
    if (state.currentDiaryIndex < 0) state.currentDiaryIndex = 0;
    if (state.currentDiaryIndex >= state.diary.length) state.currentDiaryIndex = state.diary.length - 1;

    const entry = state.diary[state.currentDiaryIndex];

    // Buttons
    // Prev Entry (Older) -> Index increases
    // Next Entry (Newer) -> Index decreases (since 0 is newest)
    // Wait... usually "Next Page" means moving forward in time? Or backward in the book?
    // Let's say: < Prev (Older/Past) | Next (Newer/Future) >
    // Array: [Newest, ..., Oldest]
    // Index 0 = Newest.
    // Index Max = Oldest.

    // Left Button (<): Go to Older (Index + 1)
    // Right Button (>): Go to Newer (Index - 1)

    prevDiaryBtn.classList.toggle('hidden', state.currentDiaryIndex >= state.diary.length - 1);
    nextDiaryBtn.classList.toggle('hidden', state.currentDiaryIndex <= 0);

    // Render Entry
    document.getElementById('diaryDate').innerText = entry.date;

    // Header
    const wIcon = entry.header && entry.header.weather ? WEATHER_ICONS[entry.header.weather] : "☀";
    document.getElementById('diaryWeatherDisplay').innerHTML = `<span>${wIcon}</span>`;

    document.getElementById('diaryEventDisplay').innerText = (entry.header && entry.header.event) || "特になし";
    document.getElementById('diaryPlanDisplay').innerText = (entry.header && entry.header.plan) || "未定";

    // Content
    const contentBox = document.getElementById('diaryContentDisplay');
    contentBox.innerText = entry.content;
    contentBox.style.fontFamily = entry.font || "'Zen Maru Gothic', sans-serif";

    // Footer
    document.getElementById('diaryChars').innerText = entry.chars.map(c => c.name).join(' & ');
}

// --- Extended Profile Logic ---
function renderProfile() {
    const p = state.myProfile;
    if (!p) return;

    // Basic
    resName.innerText = p.name;
    resMBTI.innerText = p.mbti;
    resSpeciesName.innerText = p.species || DEEP_SEA_MAPPING[p.mbti]?.species || "Unknown";
    resDesc.innerText = p.speciesDesc || DEEP_SEA_MAPPING[p.mbti]?.desc || "---";
    resMessage.innerText = p.message || "";

    const mapping = DEEP_SEA_MAPPING[p.mbti];
    if (mapping) resCharImg.src = mapping.image;

    // Apply Handwriting Font
    if (p.font) {
        document.querySelector('.handwritten-area').style.fontFamily = p.font;
    }

    // Extended
    resBlood.innerText = p.blood ? p.blood + "型" : "?";
    resSign.innerText = p.sign ? p.sign : "?";
    resHobby.innerText = p.hobby ? p.hobby : "?";
    resRole.innerText = p.role ? ROLE_MAP[p.role] : "---";
    resMood.innerText = p.mood ? MOOD_MAP[p.mood] : "---";

    // Privacy Icons
    lockBlood.classList.toggle('hidden', !p.privateBlood);
    lockHobby.classList.toggle('hidden', !p.privateHobby);

    // Heisei: Secret & Ranking
    if (p.secret) {
        document.getElementById('inputSecretCrush').value = p.secret.crush || "";
        document.getElementById('inputSecretWorry').value = p.secret.worry || "";
    }

    // Update Ranking Selects
    updateRankingOptions();
}

// --- Solo/Time Skip Logic ---
const DIARY_TEMPLATES = [
    "{A}は深海を散歩した。誰もいない。静かだ。最高だ。",
    "{A}はマリンスノーを食べようとして、間違えてビニール片を食べそうになった。",
    "{A}は古い沈没船を見つけた。中には誰もいなかった。"
];

function generateSoloEntry() {
    // Reset Limits
    state.friends.forEach(f => f.lastExchanged = null);
    renderFriendBook();

    // Solo Entry
    const template = DIARY_TEMPLATES[Math.floor(Math.random() * DIARY_TEMPLATES.length)];
    const content = template.replace(/{A}/g, state.myProfile.name);

    const entry = {
        id: Date.now(),
        date: "次の日",
        content,
        chars: [state.myProfile],
        type: 'solo'
    };
    state.diary.unshift(entry);
    saveState();
    renderDiaryBook();
    alert("新しい日が始まりました！");
}

// --- Persistence ---
function saveState() {
    localStorage.setItem('deepSeaState', JSON.stringify(state));
}

function loadState() {
    const saved = localStorage.getItem('deepSeaState');
    if (saved) {
        const parsed = JSON.parse(saved);
        state.myProfile = parsed.myProfile;
        state.friends = parsed.friends || [];
        state.diary = parsed.diary || [];
        state.currentFriendIndex = (parsed.friends && parsed.friends.length > 0) ? -1 : -1;
        state.currentDiaryIndex = 0;
        return true;
    }
    return false;
}

// --- Profile Generation ---
let pendingProfile = null; // Temporary storage during handwriting flow

function generateProfile(e) {
    e.preventDefault();
    const mapping = DEEP_SEA_MAPPING[document.getElementById('inputMBTI').value];

    // Store pending profile (font will be added after diagnosis)
    pendingProfile = {
        name: document.getElementById('inputName').value,
        mbti: document.getElementById('inputMBTI').value,
        species: mapping ? mapping.species : "Unknown",
        speciesDesc: mapping ? mapping.desc : "---",
        role: document.getElementById('inputRole').value,
        mood: document.getElementById('inputMood').value,
        message: document.getElementById('inputMessage').value,
        blood: document.getElementById('inputBlood').value,
        sign: document.getElementById('inputSign').value,
        hobby: document.getElementById('inputHobby').value,
        privateBlood: document.getElementById('privateBlood').checked,
        privateHobby: document.getElementById('privateHobby').checked,
        font: "'Zen Maru Gothic', sans-serif" // Default, will be overridden
    };

    // Hide form, show inline handwriting diagnosis
    profileForm.classList.add('hidden');
    const inlineArea = document.getElementById('inlineHandwritingArea');
    inlineArea.classList.remove('hidden');

    // Start inline handwriting questions
    inlineQuestionIndex = 0;
    inlineFontScores = { hachi: 0, klee: 0, yomogi: 0, potta: 0, zen: 0, standard: 0 };
    showInlineQuestion();
}

let inlineQuestionIndex = 0;
let inlineFontScores = { hachi: 0, klee: 0, yomogi: 0, potta: 0, zen: 0, standard: 0 };

function showInlineQuestion() {
    const questionArea = document.getElementById('inlineQuestionArea');
    const questionText = document.getElementById('inlineQuestionText');
    const questionOptions = document.getElementById('inlineQuestionOptions');

    questionArea.classList.remove('hidden');
    const q = HANDWRITING_QUESTIONS[inlineQuestionIndex];
    questionText.innerText = `Q${inlineQuestionIndex + 1}. ${q.question}`;
    questionOptions.innerHTML = "";

    q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn-secondary';
        btn.style.width = "100%";
        btn.style.textAlign = "left";
        btn.innerText = opt.text;
        btn.onclick = () => {
            for (let key in opt.scores) {
                inlineFontScores[key] += opt.scores[key];
            }
            inlineQuestionIndex++;
            if (inlineQuestionIndex < HANDWRITING_QUESTIONS.length) {
                showInlineQuestion();
            } else {
                runInlineAnalysis();
            }
        };
        questionOptions.appendChild(btn);
    });
}

function runInlineAnalysis() {
    document.getElementById('inlineQuestionArea').classList.add('hidden');
    const scanProgress = document.getElementById('inlineScanProgress');
    scanProgress.classList.remove('hidden');
    const bar = scanProgress.querySelector('.scanning-bar');
    bar.style.width = '0%';
    setTimeout(() => { bar.style.width = '100%'; }, 100);

    setTimeout(() => {
        scanProgress.classList.add('hidden');
        const fontResult = document.getElementById('inlineFontResult');
        fontResult.classList.remove('hidden');

        // Decide Best Category
        let bestCat = 'formal';
        let maxScore = -1;
        const catMap = {
            hachi: 'cute', klee: 'elegant', yomogi: 'natural',
            potta: 'unique', zen: 'formal', standard: 'formal'
        };
        for (let key in inlineFontScores) {
            if (inlineFontScores[key] > maxScore) {
                maxScore = inlineFontScores[key];
                bestCat = catMap[key];
            }
        }
        const filteredFonts = HANDWRITING_FONTS.filter(f => f.cat === bestCat);
        const result = filteredFonts[Math.floor(Math.random() * filteredFonts.length)];

        document.getElementById('inlineFontTypeName').innerText = result.name;
        document.getElementById('inlineFontPreview').style.fontFamily = result.font;
        document.getElementById('inlineFontPreview').innerText = `${pendingProfile.name} あいうえお`;

        // Store selected font
        pendingProfile.font = result.font;
    }, 2000);
}

// Finalize profile when "この文字でプロフィール完成！" is clicked
document.getElementById('inlineApplyFontBtn')?.addEventListener('click', () => {
    if (!pendingProfile) return;

    state.myProfile = pendingProfile;
    pendingProfile = null;
    saveState();

    // Reset inline area
    document.getElementById('inlineHandwritingArea').classList.add('hidden');
    profileForm.classList.remove('hidden');

    // Switch View
    createView.classList.add('hidden');
    bookView.classList.remove('hidden');
    renderProfile();
    renderFriendBook();
    renderDiaryBook();
    checkUnlockables();
});

// --- Init & Event Listeners ---


if (profileForm) profileForm.addEventListener('submit', generateProfile);
if (resetBtn) resetBtn.addEventListener('click', resetProfile);

if (addFriendBtn) addFriendBtn.addEventListener('click', openFriendModal);
if (cancelFriendBtn) cancelFriendBtn.addEventListener('click', closeFriendModal);
if (saveFriendBtn) {
    saveFriendBtn.addEventListener('click', () => {
        // Custom wrapper to update view after save
        saveFriend();
        state.currentFriendIndex = state.friends.length - 1; // Jump to new friend? Or just index?
        // Let's stay at index for now + new one
        renderFriendBook();
    });
}

// --- Phase 8: Handwriting Lab Logic ---
const handwritingModal = document.getElementById('handwritingModal');
const openHandwritingBtn = document.getElementById('openHandwritingBtn');
const closeHandwritingBtn = document.getElementById('closeHandwritingBtn');
const optUpload = document.getElementById('optUpload');
const optSelect = document.getElementById('optSelect');
const scanProgress = document.getElementById('scanProgress');
const fontResult = document.getElementById('fontResult');
const fontTypeName = document.getElementById('fontTypeName');
const fontPreview = document.getElementById('fontPreview');
const applyFontBtn = document.getElementById('applyFontBtn');
const inputFont = document.getElementById('inputFont');

const HANDWRITING_FONTS = [
    // --- Cute / Pop ---
    { name: "ゆるふわ丸文字", font: "'Hachi Maru Pop', cursive", cat: "cute" },
    { name: "もちもちポップ", font: "'Mochi iy Pop One', sans-serif", cat: "cute" },
    { name: "キウイ丸", font: "'Kiwi Maru', serif", cat: "cute" },
    { name: "あそび文字", font: "'Stick', sans-serif", cat: "cute" },
    { name: "ドットフォント", font: "'DotGothic16', sans-serif", cat: "cute" },
    { name: "Kawaii Script", font: "'Pacifico', cursive", cat: "cute" },
    { name: "School Bell", font: "'Schoolbell', cursive", cat: "cute" },
    { name: "Gloria", font: "'Gloria Hallelujah', cursive", cat: "cute" },
    { name: "Indie Flower", font: "'Indie Flower', cursive", cat: "cute" },
    { name: "Patrick Hand", font: "'Patrick Hand', cursive", cat: "cute" },

    // --- Elegant / Lady ---
    { name: "お嬢様の手紙", font: "'Klee One', cursive", cat: "elegant" },
    { name: "麗し明朝", font: "'Kaisei Decol', serif", cat: "elegant" },
    { name: "しっぽり明朝", font: "'Shippori Mincho', serif", cat: "elegant" },
    { name: "てごみん", font: "'New Tegomin', serif", cat: "elegant" },
    { name: "さわらび明朝", font: "'Sawarabi Mincho', serif", cat: "elegant" },
    { name: "Great Vibes", font: "'Great Vibes', cursive", cat: "elegant" },
    { name: "Alex Brush", font: "'Alex Brush', cursive", cat: "elegant" },
    { name: "Allura", font: "'Allura', cursive", cat: "elegant" },
    { name: "Dancing Script", font: "'Dancing Script', cursive", cat: "elegant" },
    { name: "Satisfy", font: "'Satisfy', cursive", cat: "elegant" },

    // --- Natural / Relax ---
    { name: "放課後のノート", font: "'Yomogi', cursive", cat: "natural" },
    { name: "小杉丸ゴシック", font: "'Kosugi Maru', sans-serif", cat: "natural" },
    { name: "ゼン紅道", font: "'Zen Kurenaido', sans-serif", cat: "natural" },
    { name: "ペン書き風", font: "'Zen Loop', cursive", cat: "natural" },
    { name: "手書きスケッチ", font: "'Architects Daughter', cursive", cat: "natural" },
    { name: "Caveat", font: "'Caveat', cursive", cat: "natural" },
    { name: "Handlee", font: "'Handlee', cursive", cat: "natural" },
    { name: "Coming Soon", font: "'Coming Soon', cursive", cat: "natural" },
    { name: "Zeyada", font: "'Zeyada', cursive", cat: "natural" },
    { name: "Shadows Into Light", font: "'Shadows Into Light', cursive", cat: "natural" },

    // --- Unique / Retro ---
    { name: "深海の古文書", font: "'Potta One', system-ui", cat: "unique" },
    { name: "ロックンロール", font: "'RocknRoll One', sans-serif", cat: "unique" },
    { name: "油性マジック", font: "'Yusei Magic', sans-serif", cat: "unique" },
    { name: "デラゴシック", font: "'Dela Gothic One', sans-serif", cat: "unique" },
    { name: "レゲエ・ワン", font: "'Reggae One', sans-serif", cat: "unique" },
    { name: "Permanent Marker", font: "'Permanent Marker', cursive", cat: "unique" },
    { name: "Special Elite", font: "'Special Elite', cursive", cat: "unique" },
    { name: "Lobster", font: "'Lobster', cursive", cat: "unique" },
    { name: "Homemade Apple", font: "'Homemade Apple', cursive", cat: "unique" },
    { name: "Reenie Beanie", font: "'Reenie Beanie', cursive", cat: "unique" },

    // --- Formal / Clean ---
    { name: "マジメな筆跡", font: "'Zen Maru Gothic', sans-serif", cat: "formal" },
    { name: "スタンダード", font: "'Zen Maru Gothic', sans-serif", cat: "formal" },
    { name: "Cormorant", font: "'Cormorant Garamond', serif", cat: "formal" },
    { name: "Playfair", font: "'Playfair Display', serif", cat: "formal" },
    { name: "Abril", font: "'Abril Fatface', serif", cat: "formal" },
    { name: "Courgette", font: "'Courgette', cursive", cat: "formal" },
    { name: "Amatic SC", font: "'Amatic SC', cursive", cat: "formal" },
    { name: "Indie Flower", font: "'Indie Flower', cursive", cat: "formal" }, // Duplicated to fill
    { name: "Just Another Hand", font: "'Just Another Hand', cursive", cat: "formal" },
    { name: "Sacramento", font: "'Sacramento', cursive", cat: "formal" }
];

// openHandwritingBtn removed from create form; handwriting modal is now opened from settings re-diagnose
if (openHandwritingBtn) {
    openHandwritingBtn.addEventListener('click', () => {
        handwritingModal.classList.remove('hidden');
        scanProgress.classList.add('hidden');
        fontResult.classList.add('hidden');
        document.querySelector('.analysis-options').classList.remove('hidden');
    });
}

closeHandwritingBtn.addEventListener('click', () => {
    handwritingModal.classList.add('hidden');
});

let tempSelectedFont = "";
let currentQuestionIndex = 0;
let totalFontScores = { hachi: 0, klee: 0, yomogi: 0, potta: 0, zen: 0, standard: 0 };

function simulateAnalysis(type) {
    analysisOptions.classList.add('hidden');

    if (type === 'select') {
        currentQuestionIndex = 0;
        totalFontScores = { hachi: 0, klee: 0, yomogi: 0, potta: 0, zen: 0, standard: 0 };
        showNextHandwritingQuestion();
    } else {
        // Upload path (original mock behavior)
        scanProgress.classList.remove('hidden');
        scanText.innerText = "写真を解析中 (Analysing photo...)";
        setTimeout(() => { document.querySelector('.scanning-bar').style.width = '100%'; }, 100);
        setTimeout(() => {
            scanProgress.classList.add('hidden');
            fontResult.classList.remove('hidden');
            const result = HANDWRITING_FONTS[Math.floor(Math.random() * HANDWRITING_FONTS.length)];
            finishAnalysis(result);
        }, 2500);
    }
}

function showNextHandwritingQuestion() {
    analysisQuestionArea.classList.remove('hidden');
    const questionData = HANDWRITING_QUESTIONS[currentQuestionIndex];
    handwritingQuestionText.innerText = `Q${currentQuestionIndex + 1}. ${questionData.question}`;
    handwritingOptions.innerHTML = "";

    questionData.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn-secondary';
        btn.style.width = "100%";
        btn.style.textAlign = "left";
        btn.style.marginBottom = "5px";
        btn.innerText = opt.text;
        btn.onclick = () => {
            // Add scores
            for (let key in opt.scores) {
                totalFontScores[key] += opt.scores[key];
            }

            currentQuestionIndex++;
            if (currentQuestionIndex < HANDWRITING_QUESTIONS.length) {
                showNextHandwritingQuestion();
            } else {
                startAnalysisAnimation();
            }
        };
        handwritingOptions.appendChild(btn);
    });
}

function startAnalysisAnimation() {
    analysisQuestionArea.classList.add('hidden');
    scanProgress.classList.remove('hidden');
    scanText.innerText = "診断結果を計算中 (Calculating...)";
    const bar = document.querySelector('.scanning-bar');
    bar.style.width = '0%';
    setTimeout(() => { bar.style.width = '100%'; }, 100);

    setTimeout(() => {
        scanProgress.classList.add('hidden');
        fontResult.classList.remove('hidden');

        // Decide Best Category based on scores
        let bestCat = 'formal';
        let maxScore = -1;
        const catMap = {
            hachi: 'cute', klee: 'elegant', yomogi: 'natural',
            potta: 'unique', zen: 'formal', standard: 'formal'
        };

        for (let key in totalFontScores) {
            if (totalFontScores[key] > maxScore) {
                maxScore = totalFontScores[key];
                bestCat = catMap[key];
            }
        }

        // Filter fonts by category
        const filteredFonts = HANDWRITING_FONTS.filter(f => f.cat === bestCat);
        const result = filteredFonts[Math.floor(Math.random() * filteredFonts.length)];

        finishAnalysis(result);
    }, 2000);
}

function finishAnalysis(result) {
    fontTypeName.innerText = result.name;
    fontPreview.style.fontFamily = result.font;
    tempSelectedFont = result.font;
}

if (optUpload) optUpload.addEventListener('click', () => simulateAnalysis('upload'));
if (optSelect) optSelect.addEventListener('click', () => simulateAnalysis('select'));

if (applyFontBtn) {
    applyFontBtn.addEventListener('click', () => {
        // Save font directly to profile state (used from settings re-diagnose)
        if (state.myProfile) {
            state.myProfile.font = tempSelectedFont;
            saveState();
            renderProfile();
        }
        handwritingModal.classList.add('hidden');
        alert("あなたの筆跡が登録されました！\n(Handwriting registered!)");
    });
}


// --- Phase 8: Heisei Ranking & Secret Logic ---
const rank1Select = document.getElementById('rank1Select');
const rank2Select = document.getElementById('rank2Select');
const rank3Select = document.getElementById('rank3Select');
const inputSecretCrush = document.getElementById('inputSecretCrush');
const inputSecretWorry = document.getElementById('inputSecretWorry');
const saveSecretBtn = document.getElementById('saveSecretBtn');
const mySecretTab = document.getElementById('mySecretTab');
const mySecretContent = document.getElementById('mySecretContent');

// Toggle Bag-toji
if (mySecretTab) {
    mySecretTab.addEventListener('click', () => {
        mySecretContent.classList.toggle('hidden');
    });
}

// Save Secret & Ranking
if (saveSecretBtn) {
    saveSecretBtn.addEventListener('click', () => {
        // Save Secret
        if (state.myProfile) {
            state.myProfile.secret = {
                crush: inputSecretCrush ? inputSecretCrush.value : "",
                worry: inputSecretWorry ? inputSecretWorry.value : ""
            };

            // Save Ranking
            state.myProfile.ranking = [
                rank1Select ? rank1Select.value : "",
                rank2Select ? rank2Select.value : "",
                rank3Select ? rank3Select.value : ""
            ];

            saveState();
            alert("ヒミツとランキングを保存しました！\n(Saved Secrets & Ranking!)");
        }
        if (mySecretContent) mySecretContent.classList.add('hidden'); // Close bag
    });
}

// --- Phase 9: Feedback Logic ---
if (openFeedbackBtn) {
    openFeedbackBtn.addEventListener('click', () => {
        feedbackModal.classList.remove('hidden');
        // Set debug info (current state)
        debugInfoInput.value = JSON.stringify(state);
    });
}

if (closeFeedbackBtn) {
    closeFeedbackBtn.addEventListener('click', () => {
        feedbackModal.classList.add('hidden');
    });
}

if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(feedbackForm);
        fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(formData).toString(),
        })
            .then(() => {
                alert("フィードバックを送信しました！ありがとうございます。");
                feedbackForm.reset();
                feedbackModal.classList.add('hidden');
            })
            .catch((error) => alert("送信に失敗しました: " + error));
    });
}

function updateRankingOptions() {
    const selects = [rank1Select, rank2Select, rank3Select];
    selects.forEach((sel, i) => {
        const currentVal = state.myProfile.ranking ? state.myProfile.ranking[i] : "";
        sel.innerHTML = '<option value="">(None)</option>';
        state.friends.forEach(f => {
            const opt = document.createElement('option');
            opt.value = f.id;
            opt.innerText = f.name;
            opt.selected = (f.id == currentVal);
            sel.appendChild(opt);
        });
    });
}

// Update Render Profile to include filling these inputs
const originalRenderProfile = renderProfile;
// We can't easily hook into renderProfile without replacing it. 
// Let's replace the renderProfile function definition in the next step.
// For now, let's just make sure updateRankingOptions is called when opening profile.
// We can add it to the tab click listener? 
// Or just call it in renderProfile.


// --- Init & Event Listeners ---
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-target');

        // Update Tabs UI
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Show Target Content
        tabContents.forEach(tc => {
            if (tc.id === target) tc.classList.add('active');
            else tc.classList.remove('active');
        });

        // Refresh Current View
        if (target === 'tab-profile') renderProfile();
        if (target === 'tab-friends') renderFriendBook();
        if (target === 'tab-diary') renderDiaryBook();
    });
});

// Diary Modal Listeners
cancelDiaryBtn.addEventListener('click', closeWriteDiaryModal);
sendDiaryBtn.addEventListener('click', () => {
    // Logic inside sendDiaryEntry now needs to call renderDiaryBook
    // But since I can't easily change the inside of sendDiaryEntry without huge replace,
    // I already updated it in the previous step? 
    // Wait, I updated the *definition* of sendDiaryEntry in Step 594.
    // So here I just need to bind it.
    sendDiaryEntry();
    // sendDiaryEntry calls renderDiaryFeed... wait.
    // I need to update sendDiaryEntry inside the *definition* to call renderDiaryBook.
    // I did NOT update sendDiaryEntry's internal calls in the previous step? 
    // Ah, I see I replaced `renderFriendList` definition with new logic, 
    // but code might still be calling `renderFriendList()`?
    // In Step 594, I replaced the WHOLE block including `sendDiaryEntry`. 
    // Wait, did I?
    // Yes, I replaced up to `renderDiaryBook`.
    // I need to ensure `sendDiaryEntry` calls `renderFriendBook` and `renderDiaryBook`.
});

nextDayBtn.addEventListener('click', generateSoloEntry);

// Book Navigation Listeners
prevFriendBtn.addEventListener('click', () => {
    if (state.currentFriendIndex > 0) {
        state.currentFriendIndex--;
        renderFriendBook();
    } else {
        state.currentFriendIndex = -1; // Go to Index
        renderFriendBook();
    }
});

nextFriendBtn.addEventListener('click', () => {
    if (state.currentFriendIndex < state.friends.length - 1) {
        state.currentFriendIndex++;
        renderFriendBook();
    }
});

prevDiaryBtn.addEventListener('click', () => {
    // Older (Index increase)
    if (state.currentDiaryIndex < state.diary.length - 1) {
        state.currentDiaryIndex++;
        renderDiaryBook();
    }
});

nextDiaryBtn.addEventListener('click', () => {
    // Newer (Index decrease)
    if (state.currentDiaryIndex > 0) {
        state.currentDiaryIndex--;
        renderDiaryBook();
    }
});

// Helper for "Index Page" clicks (Global delegation or wired in render)
// In renderFriendIndex, I assigned onclick.

// Bubbles
function createBubbles() {
    const bubbleContainer = document.getElementById('bubbleContainer');
    for (let i = 0; i < 15; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        const size = Math.random() * 40 + 10 + 'px';
        bubble.style.width = size;
        bubble.style.height = size;
        bubble.style.left = Math.random() * 100 + 'vw';
        bubble.style.animationDelay = Math.random() * 8 + 's';
        bubble.style.animationDuration = Math.random() * 10 + 5 + 's';
        bubbleContainer.appendChild(bubble);
    }
}

// --- Phase 9: Profile Exchange (V1) ---

if (openExchangeBtn) {
    openExchangeBtn.addEventListener('click', () => {
        exchangeModal.classList.remove('hidden');
        generateShareText(); // Auto generate on open
    });
}

if (closeExchangeBtn) {
    closeExchangeBtn.addEventListener('click', () => {
        exchangeModal.classList.add('hidden');
    });
}

if (tabExport) {
    tabExport.addEventListener('click', () => {
        tabExport.classList.add('active');
        tabImport.classList.remove('active');
        viewExport.classList.remove('hidden');
        viewImport.classList.add('hidden');
    });
}

if (tabImport) {
    tabImport.addEventListener('click', () => {
        tabImport.classList.add('active');
        tabExport.classList.remove('active');
        viewImport.classList.remove('hidden');
        viewExport.classList.add('hidden');
    });
}

function generateShareText() {
    const exportDataOutput = document.getElementById('exportDataOutput');
    if (!exportDataOutput || !state.myProfile) return;

    const exportData = {
        name: state.myProfile.name,
        mbti: state.myProfile.mbti,
        message: state.myProfile.message,
        font: state.myProfile.font,
        id: Date.now().toString()
    };

    exportDataOutput.value = JSON.stringify(exportData);
}

// Copy to clipboard
const copyProfileBtn = document.getElementById('copyProfileBtn');
const shareProfileBtn = document.getElementById('shareProfileBtn');
const copyStatus = document.getElementById('copyStatus');

if (copyProfileBtn) {
    copyProfileBtn.addEventListener('click', async () => {
        const exportDataOutput = document.getElementById('exportDataOutput');
        if (!exportDataOutput) return;
        try {
            await navigator.clipboard.writeText(exportDataOutput.value);
            copyStatus.innerText = '\u2705 \u30b3\u30d4\u30fc\u3057\u307e\u3057\u305f\uff01(Copied!)';
            copyStatus.style.color = '#50fa7b';
            setTimeout(() => { copyStatus.innerText = ''; }, 3000);
        } catch (e) {
            // Fallback: select text
            exportDataOutput.select();
            document.execCommand('copy');
            copyStatus.innerText = '\u2705 \u30b3\u30d4\u30fc\u3057\u307e\u3057\u305f\uff01(Copied!)';
            copyStatus.style.color = '#50fa7b';
            setTimeout(() => { copyStatus.innerText = ''; }, 3000);
        }
    });
}

if (shareProfileBtn) {
    shareProfileBtn.addEventListener('click', async () => {
        const exportDataOutput = document.getElementById('exportDataOutput');
        if (!exportDataOutput) return;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: '\u6df1\u6d77\u30d7\u30ed\u30d5\u30a3\u30fc\u30eb\u5e33',
                    text: '\u79c1\u306e\u30d7\u30ed\u30d5\u30a3\u30fc\u30eb\u3092\u8ffd\u52a0\u3057\u3066\u306d\uff01\n' + exportDataOutput.value
                });
            } catch (e) {
                // User cancelled or error
            }
        } else {
            // Fallback: copy
            copyProfileBtn.click();
            copyStatus.innerText = '\u203b \u5171\u6709\u975e\u5bfe\u5fdc\u306e\u30d6\u30e9\u30a6\u30b6\u3067\u3059\u3002\u30b3\u30d4\u30fc\u3057\u307e\u3057\u305f\u3002';
        }
    });
}

if (importProfileBtn) {
    importProfileBtn.addEventListener('click', () => {
        try {
            const json = importDataInput.value;
            if (!json) return alert("データが空です！(Empty)");

            const friendData = JSON.parse(json);

            // Add as a new Friend
            const newFriend = {
                id: friendData.id || Date.now().toString(),
                name: friendData.name || "Unknown",
                mbti: friendData.mbti || "INFP",
                relation: "friend",
                affinity: 0,
                backgroundImage: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", // Default
                message: friendData.message || "はじめまして！",
                font: friendData.font, // Inherit font preference

                // Generate random details for missing info
                blood: "A",
                sign: "うお座",
                hobby: "不明",
                mood: "happy",
                lastExchanged: null
            };

            // Enhance with Species info
            generateRandomDetails(newFriend); // Fill random blood/hobby

            state.friends.push(newFriend);
            saveState();

            alert(`${newFriend.name}さんが友達に追加されました！\n(Friend Added!)`);
            exchangeModal.classList.add('hidden');
            renderFriendBook();
            importDataInput.value = ""; // Clear

        } catch (e) {
            alert("データの読み込みに失敗しました。\n(Invalid Data)");
            console.error(e);
        }
    });
}


// --- Phase 8: Shinri Test Logic ---

if (addTestBtn) {
    addTestBtn.addEventListener('click', () => {
        testModal.classList.remove('hidden');
        startRandomTest();
    });
}

if (closeTestBtn) {
    closeTestBtn.addEventListener('click', () => {
        testModal.classList.add('hidden');
    });
}

function startRandomTest() {
    // Check if SHINRI_TESTS is defined
    if (typeof SHINRI_TESTS === 'undefined' || SHINRI_TESTS.length === 0) {
        alert("心理テストデータが見つかりません");
        return;
    }

    const test = SHINRI_TESTS[Math.floor(Math.random() * SHINRI_TESTS.length)];
    testQuestion.innerText = `Q. ${test.question}`;
    testOptions.innerHTML = "";

    test.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'btn-secondary';
        btn.innerText = opt.text;
        btn.onclick = () => {
            applyTestResult(test.question, opt);
            testModal.classList.add('hidden');
        };
        testOptions.appendChild(btn);
    });
}

function applyTestResult(question, option) {
    const contentBox = document.getElementById('diaryInput');
    const resultText = `\n\n【心理テスト】\nQ: ${question}\nA: ${option.text}\n→ ${option.result}\n(当たってる？)`;
    contentBox.value += resultText;
}
// --- Settings Logic ---
const settingsModal = document.getElementById('settingsModal');
const openSettingsBtn = document.getElementById('openSettingsBtn');
const closeSettingsBtn = document.getElementById('closeSettingsBtn');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const reDiagnoseBtn = document.getElementById('reDiagnoseBtn');

function populateSettings() {
    if (!state.myProfile) return;
    document.getElementById('settingName').value = state.myProfile.name || '';
    document.getElementById('settingMBTI').value = state.myProfile.mbti || 'INFP';
    document.getElementById('settingBlood').value = state.myProfile.blood || 'A';
    document.getElementById('settingSign').value = state.myProfile.sign || 'aries';
    document.getElementById('settingHobby').value = state.myProfile.hobby || '';
    document.getElementById('settingRole').value = state.myProfile.role || 'leader';
    document.getElementById('settingMood').value = state.myProfile.mood || 'fine';
    document.getElementById('settingMessage').value = state.myProfile.message || '';

    // Show current font name
    const fontName = document.getElementById('settingFontName');
    const currentFont = state.myProfile.font || "'Zen Maru Gothic'";
    const matchedFont = HANDWRITING_FONTS.find(f => f.font === currentFont);
    fontName.innerText = matchedFont ? matchedFont.name : currentFont;
}

if (openSettingsBtn) {
    openSettingsBtn.addEventListener('click', () => {
        populateSettings();
        settingsModal.classList.remove('hidden');
    });
}

if (closeSettingsBtn) {
    closeSettingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
    });
}

if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', () => {
        if (!state.myProfile) return;

        const newMBTI = document.getElementById('settingMBTI').value;
        const mbtiChanged = newMBTI !== state.myProfile.mbti;

        state.myProfile.name = document.getElementById('settingName').value;
        state.myProfile.mbti = newMBTI;
        state.myProfile.blood = document.getElementById('settingBlood').value;
        state.myProfile.sign = document.getElementById('settingSign').value;
        state.myProfile.hobby = document.getElementById('settingHobby').value;
        state.myProfile.role = document.getElementById('settingRole').value;
        state.myProfile.mood = document.getElementById('settingMood').value;
        state.myProfile.message = document.getElementById('settingMessage').value;

        // Update species if MBTI changed
        if (mbtiChanged) {
            const mapping = DEEP_SEA_MAPPING[newMBTI];
            if (mapping) {
                state.myProfile.species = mapping.species;
                state.myProfile.speciesDesc = mapping.desc;
            }
        }

        saveState();
        settingsModal.classList.add('hidden');
        renderProfile();
        alert('設定を保存しました！\n(Settings saved!)');
    });
}

// --- Phase 10: Diary Exchange Logic ---
const diaryExchangeModal = document.getElementById('diaryExchangeModal');
const closeDiaryExchangeBtn = document.getElementById('closeDiaryExchangeBtn');
const importDiaryBtn = document.getElementById('importDiaryBtn');
const diaryImportView = document.getElementById('diaryImportView');
const diaryExportView = document.getElementById('diaryExportView');
const diaryImportInput = document.getElementById('diaryImportInput');
const diaryExportOutput = document.getElementById('diaryExportOutput');
const runImportDiaryBtn = document.getElementById('runImportDiaryBtn');
const copyDiaryDataBtn = document.getElementById('copyDiaryDataBtn');
const diaryCopyStatus = document.getElementById('diaryCopyStatus');

if (closeDiaryExchangeBtn) {
    closeDiaryExchangeBtn.addEventListener('click', () => {
        diaryExchangeModal.classList.add('hidden');
    });
}

if (importDiaryBtn) {
    importDiaryBtn.addEventListener('click', () => {
        diaryExchangeModal.classList.remove('hidden');
        diaryImportView.classList.remove('hidden');
        diaryExportView.classList.add('hidden');
        diaryImportInput.value = ""; // Clear
    });
}

// Function to open export view with data
function openDiaryExportModal(entry) {
    if (!diaryExchangeModal) return;

    diaryExchangeModal.classList.remove('hidden');
    diaryImportView.classList.add('hidden');
    diaryExportView.classList.remove('hidden');

    // Create shareable data package
    const shareData = {
        type: "diary_entry",
        entry: entry,
        sender: state.myProfile ? state.myProfile.name : "Unknown",
        timestamp: Date.now()
    };

    diaryExportOutput.value = JSON.stringify(shareData);
    diaryCopyStatus.innerText = "";
}

// Copy Diary Data
if (copyDiaryDataBtn) {
    copyDiaryDataBtn.addEventListener('click', async () => {
        if (!diaryExportOutput) return;
        try {
            await navigator.clipboard.writeText(diaryExportOutput.value);
            diaryCopyStatus.innerText = "✅ コピーしました！(Copied!)";
            diaryCopyStatus.style.color = "#50fa7b";
        } catch (e) {
            diaryExportOutput.select();
            document.execCommand('copy');
            diaryCopyStatus.innerText = "✅ コピーしました！(Copied!)";
            diaryCopyStatus.style.color = "#50fa7b";
        }
    });
}

// Import Diary Data
if (runImportDiaryBtn) {
    runImportDiaryBtn.addEventListener('click', () => {
        try {
            const json = diaryImportInput.value;
            if (!json) return alert("データが空です！(Empty)");

            const data = JSON.parse(json);

            // Validation
            if (!data.entry || !data.entry.content) {
                return alert("正しい日記データではありません。(Invalid Format)");
            }

            // Add to diary
            // Check for duplicates (by ID)
            const exists = state.diary.some(d => d.id === data.entry.id);
            if (exists) {
                return alert("この日記は既に取り込み済みです。(Already Imported)");
            }

            state.diary.unshift(data.entry);
            // Sort by date new -> old? For now just unshift (newest top)
            state.diary.sort((a, b) => b.id - a.id);

            saveState();
            renderDiaryBook();

            diaryExchangeModal.classList.add('hidden');
            alert(`${data.sender}さんの日記を受け取りました！\n(Diary Received!)`);

        } catch (e) {
            alert("データの読み込みに失敗しました。(Error)");
            console.error(e);
        }
    });
}

// Update settings re-diagnose logic to safer version
if (reDiagnoseBtn) {
    reDiagnoseBtn.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
        handwritingModal.classList.remove('hidden');
        // Reset view
        if (scanProgress) scanProgress.classList.add('hidden');
        if (analysisQuestionArea) analysisQuestionArea.classList.add('hidden');
        if (fontResult) fontResult.classList.add('hidden');
        if (analysisOptions) analysisOptions.classList.remove('hidden');

        // Reset state
        tempSelectedFont = "";
        currentQuestionIndex = 0;
        totalFontScores = { hachi: 0, klee: 0, yomogi: 0, potta: 0, zen: 0, standard: 0 };
    });
}


// --- Phase 11: Data Backup & Restore Logic ---
const backupModal = document.getElementById('backupModal');
const openBackupBtn = document.getElementById('openBackupBtn');
const closeBackupBtn = document.getElementById('closeBackupBtn');
const backupExportOutput = document.getElementById('backupExportOutput');
const copyBackupBtn = document.getElementById('copyBackupBtn');
const backupCopyStatus = document.getElementById('backupCopyStatus');
const backupImportInput = document.getElementById('backupImportInput');
const runRestoreBtn = document.getElementById('runRestoreBtn');

if (openBackupBtn) {
    openBackupBtn.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
        backupModal.classList.remove('hidden');

        // Export Data
        const backupData = JSON.stringify(state);
        backupExportOutput.value = backupData;
        backupCopyStatus.innerText = "";
    });
}

if (closeBackupBtn) {
    closeBackupBtn.addEventListener('click', () => {
        backupModal.classList.add('hidden');
    });
}

if (copyBackupBtn) {
    copyBackupBtn.addEventListener('click', async () => {
        if (!backupExportOutput) return;
        try {
            await navigator.clipboard.writeText(backupExportOutput.value);
            backupCopyStatus.innerText = "✅ コピーしました！(Copied!)";
            backupCopyStatus.style.color = "#50fa7b";
        } catch (e) {
            backupExportOutput.select();
            document.execCommand('copy');
            backupCopyStatus.innerText = "✅ コピーしました！(Copied!)";
            backupCopyStatus.style.color = "#50fa7b";
        }
    });
}

if (runRestoreBtn) {
    runRestoreBtn.addEventListener('click', () => {
        const json = backupImportInput.value;
        if (!json) return alert("データが空です！(Empty)");

        if (!confirm("現在のデータが上書きされます。よろしいですか？\n(Current data will be overwritten. OK?)")) {
            return;
        }

        try {
            const data = JSON.parse(json);

            // Simple Validation
            if (!data.myProfile || !Array.isArray(data.friends)) {
                return alert("データ形式が正しくありません。(Invalid Data)");
            }

            // Restore properties
            state.myProfile = data.myProfile;
            state.friends = data.friends || [];
            state.diary = data.diary || [];
            state.currentFriendIndex = data.currentFriendIndex || -1;
            state.currentDiaryIndex = data.currentDiaryIndex || 0;

            localStorage.setItem('deepSeaDiaryState', JSON.stringify(state));

            alert("データを復元しました！アプリを再起動します。\n(Restored! Reloading app...)");
            location.reload();

        } catch (e) {
            alert("データの読み込みに失敗しました。\n(Error parsing JSON)");
            console.error(e);
        }
    });
}


// --- Init App ---
window.onload = () => {
    loadState();
    if (state.myProfile) {
        // App Mode
        createView.classList.add('hidden');
        bookView.classList.remove('hidden');
        renderProfile();
        renderFriendBook();
        renderDiaryBook();
        checkUnlockables();
    } else {
        // New Game
        createView.classList.remove('hidden');
    }

    createBubbles();
    console.log("Deep Sea App Phase 11 Initialized!");
};
