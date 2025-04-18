use serde::{Deserialize, Serialize};
use serde_wasm_bindgen::to_value;
use wasm_bindgen::prelude::*;

/// モンスターの情報を簡略化
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Monster {
    pub id: String,
    pub name: String,
    pub level: u32,
    pub hp: u32,
    pub defense: u32,            // ステータス防御
    pub fixed_defense: u32,      // 固定防御
    pub fixed_reduction: u32,    // 固定減少
    pub cut_rate: f32,           // カット率 (0.0 ~ 1.0)
    pub element_resistance: u32, // 属性耐性値
    pub image_url: Option<String>,
}

impl Monster {
    /// 新しいモンスターを作成
    pub fn new(
        id: impl Into<String>,
        name: impl Into<String>,
        level: u32,
        hp: u32,
        defense: u32,
        fixed_defense: u32,
        fixed_reduction: u32,
        cut_rate: f32,
        element_resistance: u32,
    ) -> Self {
        Self {
            id: id.into(),
            name: name.into(),
            level,
            hp,
            defense,
            fixed_defense,
            fixed_reduction,
            cut_rate,
            element_resistance,
            image_url: None,
        }
    }

    /// 画像URLを設定
    pub fn with_image(mut self, image_url: impl Into<String>) -> Self {
        self.image_url = Some(image_url.into());
        self
    }
}

/// モンスターのデータベース
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MonsterDatabase {
    pub monsters: Vec<Monster>,
}

impl MonsterDatabase {
    /// 新しいモンスターデータベースを作成
    pub fn new() -> Self {
        Self {
            monsters: Vec::new(),
        }
    }

    /// モンスターを追加
    pub fn add_monster(&mut self, monster: Monster) {
        self.monsters.push(monster);
    }

    /// IDでモンスターを検索
    pub fn find_by_id(&self, id: &str) -> Option<&Monster> {
        self.monsters.iter().find(|m| m.id == id)
    }

    /// 名前でモンスターを検索
    pub fn find_by_name(&self, name: &str) -> Option<&Monster> {
        self.monsters.iter().find(|m| m.name == name)
    }
}

/// デフォルトのモンスターデータを生成
pub fn create_default_monsters() -> MonsterDatabase {
    let mut db = MonsterDatabase::new();

    // 画像から取得したモンスターデータを追加
    db.add_monster(
        Monster::new(
            "appleboss",
            "りんごボス",
            30,
            1000,
            1500, // ステータス防御
            7200, // 固定防御
            0,    // 固定減少
            0.48, // カット率 (48%)
            120,  // 属性値
        )
        .with_image("https://example.com/lizpos.png"),
    );

    db.add_monster(
        Monster::new(
            "abysshell",
            "アビスヘル",
            35,
            1200,
            1500, // ステータス防御
            8100, // 固定防御
            0,    // 固定減少
            0.75, // カット率 (75%)
            120,  // 属性値
        )
        .with_image("https://example.com/abysshell.png"),
    );

    db.add_monster(
        Monster::new(
            "abyssamas",
            "アビスコアマス",
            35,
            1200,
            1500, // ステータス防御
            8700, // 固定防御
            0,    // 固定減少
            0.75, // カット率 (75%)
            120,  // 属性値
        )
        .with_image("https://example.com/abyssamas.png"),
    );

    db.add_monster(
        Monster::new(
            "eclipse1",
            "エクリプス（ロカゴス/エートス/チェリア)",
            40,
            1500,
            1500,  // ステータス防御
            39720, // 固定防御
            9285,  // 固定減少
            0.51,  // カット率 (51%)
            125,   // 属性値
        )
        .with_image("https://example.com/eclipsexi.png"),
    );

    db.add_monster(
        Monster::new(
            "eclipse2",
            "エクリプス（ライコス/マティア/ティロロス）",
            40,
            1500,
            1500,  // ステータス防御
            41220, // 固定防御
            9285,  // 固定減少
            0.51,  // カット率 (51%)
            125,   // 属性値
        )
        .with_image("https://example.com/eclipsex3.png"),
    );

    db.add_monster(
        Monster::new(
            "eclipse3",
            "エクリプス（アフェティリア）",
            40,
            1500,
            1500,  // ステータス防御
            41220, // 固定防御
            9285,  // 固定減少
            0.51,  // カット率 (51%)
            125,   // 属性値
        )
        .with_image("https://example.com/eclipsex3.png"),
    );

    db.add_monster(
        Monster::new(
            "siokanboss",
            "シオカンボス",
            40,
            1500,
            1500,  // ステータス防御
            33720, // 固定防御
            9285,  // 固定減少
            0.51,  // カット率 (51%)
            125,   // 属性値
        )
        .with_image("https://example.com/diaocanpos.png"),
    );

    db.add_monster(
        Monster::new(
            "odein",
            "オーディン",
            30,
            1000,
            1500,  // ステータス防御
            51720, // 固定防御
            9285,  // 固定減少
            0.51,  // カット率 (51%)
            120,   // 属性値
        )
        .with_image("https://example.com/oasis.png"),
    );

    db.add_monster(
        Monster::new(
            "kimaira",
            "キマイラ",
            30,
            1000,
            900,   // ステータス防御
            2985,  // 固定減少
            0,     // 固定減少
            0.993, // カット率 (99.3%)
            120,   // 属性値
        )
        .with_image("https://example.com/kimaira.png"),
    );

    db
}
