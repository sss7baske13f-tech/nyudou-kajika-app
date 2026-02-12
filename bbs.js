// --- Deep Sea Contact / BBS System ---
// Manages "Footprints" (Ashiato) and random messages from NPC

const bbsState = {
    logs: [] // { id, name, species, message, timestamp }
};

const NPC_MESSAGES = [
    "キリ番ゲット！",
    "カキコありがとう～",
    "また遊びに来たよ！",
    "リンク貼らせてもらいました★",
    "今日の深海、暗すぎない？",
    "お腹すいた...",
    "誰かチャットしよ！",
    "迷子になりました...",
    "通りすがりです♪",
    "ホームページ開設おめでとう！"
];

const NPC_NAMES = [
    "深海ダイバー", "クリオネちゃん", "メンダコ", "リュウグウ",
    "マニア", "通りすがりのイカ", "匿名希望", "管理人代理"
];

function initBBSSystem() {
    console.log("Initializing BBS System...");
    loadBBSState();

    // Chance to generate new footprint on load
    if (Math.random() < 0.3) {
        generateFootprint();
    }

    renderBBS();
}

function loadBBSState() {
    const saved = localStorage.getItem('deepSeaBBS');
    if (saved) {
        bbsState.logs = JSON.parse(saved);
    } else {
        // Initial Dummy Logic
        generateFootprint("管理人", "ようこそ深海へ！");
    }
}

function saveBBSState() {
    // Limit log size
    if (bbsState.logs.length > 10) {
        bbsState.logs = bbsState.logs.slice(0, 10);
    }
    localStorage.setItem('deepSeaBBS', JSON.stringify(bbsState.logs));
}

function generateFootprint(forceName = null, forceMsg = null) {
    const name = forceName || NPC_NAMES[Math.floor(Math.random() * NPC_NAMES.length)];
    const msg = forceMsg || NPC_MESSAGES[Math.floor(Math.random() * NPC_MESSAGES.length)];
    const date = new Date().toLocaleString('ja-JP', {
        month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
    });

    const newLog = {
        id: Date.now(),
        name: name,
        message: msg,
        timestamp: date
    };

    bbsState.logs.unshift(newLog); // Add to top
    saveBBSState();
    renderBBS();
}

function renderBBS() {
    const container = document.getElementById('bbsContainer');
    if (!container) return;

    container.innerHTML = '';

    bbsState.logs.forEach(log => {
        const item = document.createElement('div');
        item.className = 'bbs-item';
        item.innerHTML = `
            <div class="bbs-header">
                <span class="bbs-name">${log.name}</span>
                <span class="bbs-date">${log.timestamp}</span>
            </div>
            <div class="bbs-msg">${log.message}</div>
        `;
        container.appendChild(item);
    });
}
