const SHINRI_TESTS = [
    {
        id: 1,
        question: "深海で宝箱を見つけました。中身は何？",
        options: [
            { text: "真珠 (Pearl)", result: "あなたは「ロマンチスト」タイプ！恋に夢見がちかも？" },
            { text: "古銭 (Old Coin)", result: "あなたは「リアリスト」タイプ！堅実な将来設計家。" },
            { text: "手紙 (Letter)", result: "あなたは「情熱家」タイプ！人との絆を大切にします。" },
            { text: "空っぽ (Empty)", result: "あなたは「自由人」タイプ！縛られるのが嫌いかも。" }
        ]
    },
    {
        id: 2,
        question: "目の前にダイオウイカが現れた！どうする？",
        options: [
            { text: "戦う (Fight)", result: "あなたは「リーダー」タイプ！困難に立ち向かう勇気があります。" },
            { text: "逃げる (Run)", result: "あなたは「慎重派」タイプ！危機管理能力が高いです。" },
            { text: "観察する (Observe)", result: "あなたは「知性派」タイプ！冷静に状況を分析します。" },
            { text: "仲良くなる (Friend)", result: "あなたは「カリスマ」タイプ！誰とでも仲良くなれる才能が！" }
        ]
    },
    {
        id: 3,
        question: "新しいサンゴの家。何色にする？",
        options: [
            { text: "ピンク (Pink)", result: "今のあなたは「愛されたい」モード。甘えてみては？" },
            { text: "ブルー (Blue)", result: "今のあなたは「癒されたい」モード。一人の時間を大切に。" },
            { text: "イエロー (Yellow)", result: "今のあなたは「遊びたい」モード。新しいことに挑戦！" },
            { text: "ホワイト (White)", result: "今のあなたは「リセット」モード。心機一転のチャンス。" }
        ]
    }
];


const DEEP_SEA_MAPPING = { //... existing code ...
    // Analysts
    'INTJ': { species: 'デメニギス (Barrel Eye)', image: 'assets/demenigisu.png', desc: '頭が透明で脳みそ（実は目）丸見え。常に上を見上げて考え事をしている冷静な分析家。', traits: ['calm', 'weird'] },
    'INTP': { species: 'ダイオウグソクムシ (Giant Isopod)', image: 'assets/gusokumushi.png', desc: '絶食しても生きられる省エネの達人。じっとしているのが好きだけど、たまに急に動く。', traits: ['lonely', 'philosophical'] },
    'ENTJ': { species: 'ミツクリザメ (Goblin Shark)', image: 'assets/mitsukurizame.png', desc: '獲物を捕るときだけ顎が飛び出す。普段は穏やかだけど、ここぞという時の瞬発力と支配力がすごい。', traits: ['ambitious', 'scary'] },
    'ENTP': { species: 'ホウライエソ (Viperfish)', image: 'assets/houraieso.png', desc: '牙が大きすぎて口が閉じられない。常に何か言いたげな顔をしている、議論好きな深海の暴れん坊。', traits: ['chatty', 'aggressive'] },

    // Diplomats
    'INFJ': { species: 'リュウグウノツカイ (Oarfish)', image: 'assets/ryugu.png', desc: '神出鬼没の伝説の魚。ミステリアスすぎて誰も本当の姿を知らない。実は繊細で傷つきやすい。', traits: ['mysterious', 'delicate'] },
    'INFP': { species: 'メンダコ (Flapjack Octopus)', image: 'assets/mendako.png', desc: '耳をパタパタさせて深海を漂うアイドル。強く触ると溶けちゃうくらい繊細。妄想の中で生きている。', traits: ['dreamy', 'shy'] },
    'ENFJ': { species: 'ヒカリキンメダイ (Flashlight Fish)', image: 'assets/hikarikinme.png', desc: '目の下の発光器で仲間と会話する。周りを照らすリーダー気質だけど、たまに眩しすぎてウザがられる。', traits: ['leader', 'bright'] },
    'ENFP': { species: 'クリオネ (Sea Angel)', image: 'assets/clione.png', desc: '見た目は天使、捕食時は悪魔（バッカルコーン）。二面性があるけど、基本は愛されキャラ。', traits: ['cute', 'scary'] },

    // Sentinels
    'ISTJ': { species: 'オウムガイ (Nautilus)', image: 'assets/oumugai.png', desc: '生きた化石。何億年も変わらないスタイルを貫く頑固者。ルールと伝統を重んじる。', traits: ['stubborn', 'classic'] },
    'ISFJ': { species: ' センジュナマコ (Sea Pig)', image: 'assets/senju.png', desc: '海底の掃除屋さん。みんなが嫌がることを黙々とこなす縁の下の力持ち。プニプニしてて癒やし系。', traits: ['kind', 'helper'] },
    'ESTJ': { species: 'タカアシガニ (Spider Crab)', image: 'assets/takaashigani.png', desc: '世界最大のカニ。長い手足で広範囲を管理する。ハサミで規律を乱すやつは許さない委員長タイプ。', traits: ['strict', 'big'] },
    'ESFJ': { species: 'サクラエビ (Sakura Shrimp)', image: 'assets/sakuraebi.png', desc: '常に群れで行動するパーティピーポー。一匹だと不安になっちゃう。みんなで光れば怖くない！', traits: ['social', 'follower'] },

    // Explorers
    'ISTP': { species: 'ラブカ (Frilled Shark)', image: 'assets/rabuka.png', desc: '深海の生きた化石その２。蛇のような体で獲物を絞め殺…いや、ハグする。職人気質の孤高のサメ。', traits: ['cool', 'skillful'] },
    'ISFP': { species: 'ウミウシ (Nudibranch)', image: 'assets/umiushi.png', desc: '深海の宝石。毒を持っているけど、見た目の美しさにこだわっているアーティスト。マイペースに這う。', traits: ['artistic', 'poison'] },
    'ESTP': { species: 'チョウチンアンコウ (Anglerfish)', image: 'assets/chochin.png', desc: '提灯で獲物をおびき寄せる策士でありハンター。オスはメスに吸収される運命を受け入れる潔さも。', traits: ['bold', 'strategic'] },
    'ESFP': { species: 'ブロブフィッシュ (Blobfish)', image: 'assets/nyudou_kajika_character.png', desc: '世界一醜い魚と言われるけど、水圧がなくなるとダルダルになるだけ。本当は愛嬌たっぷりの人気者。', traits: ['optimistic', 'funny'] }
};

const ROLE_MAP = {
    leader: "リーダー (赤)",
    idol: "アイドル (ピンク)",
    healer: "癒やし係 (緑)",
    brain: "参謀 (青)",
    joker: "道化師 (黄)",
    shadow: "裏ボス (黒)"
};

const MOOD_MAP = {
    fine: "絶好調！",
    sleepy: "ねむい...",
    hungry: "お腹すいた",
    floating: "漂流中",
    crushed: "水圧につぶされそう"
};

const RELATION_BADGES = {
    friend: "友",
    lover: "愛",
    family: "家",
    rival: "敵"
};

const RELATION_COLORS = {
    friend: "#50fa7b",
    lover: "#ff79c6",
    family: "#f1fa8c",
    rival: "#ff5555"
};

const HANDWRITING_QUESTIONS = [
    {
        question: "深海の白い砂浜に文字を書くなら、どう書く？",
        options: [
            { text: "細く丁寧に、きっちりと", scores: { klee: 2, zen: 2, standard: 1 } },
            { text: "大きく元気に、丸っこく", scores: { hachi: 3, potta: 1, yomogi: 1 } },
            { text: "さらさらと、流れるように", scores: { yomogi: 3, klee: 1, zen: 1 } }
        ]
    },
    {
        question: "プロフ帳にシールを貼るなら？",
        options: [
            { text: "真ん中に1枚、きれいに貼る", scores: { zen: 3, standard: 2, klee: 1 } },
            { text: "隙間にいっぱい、デコっちゃう！", scores: { hachi: 2, yomogi: 2, potta: 1 } },
            { text: "あえて端っこに、ひっそりと", scores: { potta: 3, yomogi: 1, klee: 1 } }
        ]
    },
    {
        question: "学校のノートの取り方は？",
        options: [
            { text: "5色ペンでカラフルにデコる", scores: { hachi: 2, yomogi: 3, potta: 1 } },
            { text: "黒ペン1本でシンプルにまとめる", scores: { zen: 2, klee: 3, standard: 1 } },
            { text: "隅っこに落書きがいっぱい", scores: { potta: 3, hachi: 1, yomogi: 1 } }
        ]
    }
];
