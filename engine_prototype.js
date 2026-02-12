const fs = require('fs');

class DiaryEngine {
    constructor(templatesPath) {
        this.templates = JSON.parse(fs.readFileSync(templatesPath, 'utf8'));
    }

    generate(character) {
        // フィルターロジック: 種族または性格が一致するテンプレートを選択
        const possibleTemplates = this.templates.filter(t => {
            const speciesMatch = t.species_tag === 'any' || t.species_tag === character.species_tag;
            const traitMatch = t.traits.some(trait => character.traits.includes(trait));
            return speciesMatch && traitMatch;
        });

        if (possibleTemplates.length === 0) {
            return "今日は特に何もなかった。深海は今日も静かだ。";
        }

        // ランダムに1つ選択
        const selected = possibleTemplates[Math.floor(Math.random() * possibleTemplates.length)];

        // プレースホルダー置換
        let content = selected.template.replace(/{name}/g, character.name);

        return {
            date: new Date().toLocaleDateString('ja-JP'),
            character: character.name,
            content: content,
            species: character.species_tag
        };
    }
}

// 実行テスト
const characters = JSON.parse(fs.readFileSync('mock_characters.json', 'utf8'));
const engine = new DiaryEngine('templates.json');

console.log("=== ニュウドウカジカ日記 自動生成テスト ===");
characters.forEach(char => {
    const diary = engine.generate(char);
    console.log(`\n[${diary.date}] ${diary.character} (${diary.species})`);
    console.log(`本文: ${diary.content}`);
    console.log("-----------------------------------------");
});
