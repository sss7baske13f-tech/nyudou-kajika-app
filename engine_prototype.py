import json
import random
from datetime import datetime

class DiaryEngine:
    def __init__(self, templates_path):
        with open(templates_path, 'r', encoding='utf-8') as f:
            self.templates = json.load(f)

    def generate(self, character):
        # フィルターロジック: 種族または性格が一致するテンプレートを選択
        possible_templates = []
        for t in self.templates:
            species_match = t['species_tag'] == 'any' or t['species_tag'] == character['species_tag']
            trait_match = any(trait in character['traits'] for trait in t['traits'])
            if species_match and trait_match:
                possible_templates.append(t)

        if not possible_templates:
            return "今日は特に何もなかった。深海は今日も静かだ。"

        # ランダムに1つ選択
        selected = random.choice(possible_templates)
        
        # プレースホルダー置換
        content = selected['template'].replace("{name}", character['name'])

        return {
            "date": datetime.now().strftime("%Y/%m/%d"),
            "character": character['name'],
            "content": content,
            "species": character['species_tag']
        }

if __name__ == "__main__":
    # 実行テスト
    with open('mock_characters.json', 'r', encoding='utf-8') as f:
        characters = json.load(f)
    
    engine = DiaryEngine('templates.json')

    print("=== ニュウドウカジカ日記 自動生成テスト (Python) ===")
    for char in characters:
        diary = engine.generate(char)
        print(f"\n[{diary['date']}] {diary['character']} ({diary['species']})")
        print(f"本文: {diary['content']}")
        print("-" * 41)
