// --- Deco / Purikura System ---
// Allows placing images/emoji on the book view

const decoState = {
    stickers: [], // { id, type, x, y, rotation, scale }
    activeSticker: null,
    isDragging: false,
    dragOffset: { x: 0, y: 0 }
};

// Sticker Data (Mock for now, can be images later)
const STICKER_ASSETS = [
    { type: 'emoji', content: '🌺' },
    { type: 'emoji', content: '✨' },
    { type: 'emoji', content: '💖' },
    { type: 'emoji', content: '🦋' },
    { type: 'emoji', content: '🌈' },
    { type: 'emoji', content: '🍒' },
    { type: 'emoji', content: '🐬' },
    { type: 'emoji', content: '🌊' },
    { type: 'emoji', content: '⭐' },
    { type: 'emoji', content: '🎀' }
];

const decoLayer = document.getElementById('decoLayer');
const decoPanel = document.getElementById('decoPanel');
const toggleDecoBtn = document.getElementById('toggleDecoBtn');

function initDecoSystem() {
    console.log("Initializing Deco System...");
    loadDecoState();
    renderDecoPanel();
    renderStickers(); // Restore saved stickers

    if (toggleDecoBtn) {
        toggleDecoBtn.addEventListener('click', toggleDecoPanel);
    }

    // Global Drag Events
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('mouseup', onDragEnd);

    // Touch support
    window.addEventListener('touchmove', onDragMove, { passive: false });
    window.addEventListener('touchend', onDragEnd);
}

function toggleDecoPanel() {
    decoPanel.classList.toggle('hidden');
}

function renderDecoPanel() {
    const container = document.getElementById('stickerList');
    if (!container) return;
    container.innerHTML = '';

    STICKER_ASSETS.forEach(asset => {
        const btn = document.createElement('div');
        btn.className = 'sticker-option';
        btn.innerText = asset.content;
        btn.onclick = () => addSticker(asset);
        container.appendChild(btn);
    });
}

function addSticker(asset) {
    const id = Date.now();
    const newSticker = {
        id: id,
        content: asset.content,
        x: 100 + Math.random() * 50,
        y: 100 + Math.random() * 50,
        rotation: (Math.random() * 20) - 10,
        scale: 1.0
    };
    decoState.stickers.push(newSticker);
    renderSingleSticker(newSticker);
    saveDecoState();
}

function renderStickers() {
    decoLayer.innerHTML = '';
    decoState.stickers.forEach(renderSingleSticker);
}

function renderSingleSticker(stickerData) {
    const el = document.createElement('div');
    el.className = 'deco-item';
    el.innerText = stickerData.content;
    el.id = `sticker-${stickerData.id}`;
    el.style.left = stickerData.x + 'px';
    el.style.top = stickerData.y + 'px';
    el.style.transform = `rotate(${stickerData.rotation}deg) scale(${stickerData.scale})`;
    el.style.position = 'absolute';
    el.style.cursor = 'grab';
    el.style.fontSize = '2rem';
    el.style.userSelect = 'none';
    el.style.zIndex = 100; // Above book content

    // Interaction
    el.addEventListener('mousedown', (e) => onDragStart(e, stickerData.id));
    el.addEventListener('touchstart', (e) => onDragStart(e, stickerData.id), { passive: false });

    // Double click to remove
    el.addEventListener('dblclick', () => removeSticker(stickerData.id));

    decoLayer.appendChild(el);
}

function onDragStart(e, id) {
    e.preventDefault();
    const sticker = decoState.stickers.find(s => s.id === id);
    if (!sticker) return;

    decoState.activeSticker = sticker;
    decoState.isDragging = true;

    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;

    decoState.dragOffset = {
        x: clientX - sticker.x,
        y: clientY - sticker.y
    };

    // Bring to front
    const el = document.getElementById(`sticker-${id}`);
    if (el) el.style.zIndex = 101;
}

function onDragMove(e) {
    if (!decoState.isDragging || !decoState.activeSticker) return;

    e.preventDefault(); // Prevent scrolling on touch

    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;

    decoState.activeSticker.x = clientX - decoState.dragOffset.x;
    decoState.activeSticker.y = clientY - decoState.dragOffset.y;

    updateStickerVisual(decoState.activeSticker);
}

function onDragEnd() {
    if (decoState.isDragging && decoState.activeSticker) {
        // Reset z-index
        const el = document.getElementById(`sticker-${decoState.activeSticker.id}`);
        if (el) el.style.zIndex = 100;

        saveDecoState();
    }
    decoState.isDragging = false;
    decoState.activeSticker = null;
}

function updateStickerVisual(sticker) {
    const el = document.getElementById(`sticker-${sticker.id}`);
    if (el) {
        el.style.left = sticker.x + 'px';
        el.style.top = sticker.y + 'px';
    }
}

function removeSticker(id) {
    decoState.stickers = decoState.stickers.filter(s => s.id !== id);
    const el = document.getElementById(`sticker-${id}`);
    if (el) el.remove();
    saveDecoState();
}

function saveDecoState() {
    localStorage.setItem('deepSeaDeco', JSON.stringify(decoState.stickers));
}

function loadDecoState() {
    const saved = localStorage.getItem('deepSeaDeco');
    if (saved) {
        decoState.stickers = JSON.parse(saved);
    }
}
