// インポートを削除
// use console_error_panic_hook;
use log::Level;
use serde::{Deserialize, Serialize};
use serde_wasm_bindgen::{from_value, to_value};
use std::panic;
use wasm_bindgen::prelude::*;

// 既存のモジュールをインポート
mod models;
mod services;
mod utils;

// 初期化関数
#[wasm_bindgen(start)]
pub fn start() {
    // パニックフックを設定
    panic::set_hook(Box::new(console_error_panic_hook::hook));

    // ロガーを初期化
    console_log::init_with_level(Level::Info).expect("ロガーの初期化に失敗しました");

    // WebAssemblyモジュールの初期化処理
    web_sys::console::log_1(&"WebAssembly module initialized".into());
}

// モンスターデータをJavaScriptに公開
#[wasm_bindgen]
pub fn get_default_monsters() -> JsValue {
    // console_log::log!の代わりにweb_sysを使用
    web_sys::console::log_1(&"get_default_monsters".into());
    let monsters = models::monster::create_default_monsters().monsters;
    // 複雑なデータ構造はJSONに変換して出力
    web_sys::console::log_1(&format!("monsters count: {}", monsters.len()).into());
    to_value(&monsters).unwrap()
}

// ダメージ計算関数をJavaScriptに公開
#[wasm_bindgen]
pub fn calculate_damage(monster_json: &JsValue, equipment_json: &JsValue) -> JsValue {
    // JavaScriptからのJSONをRustの型に変換
    let monster: models::monster::Monster = from_value(monster_json.clone()).unwrap();
    let equipment_set: models::equipment::EquipmentSet = equipment_json.into_serde().unwrap();

    // ダメージ計算
    let mut calculator = models::damage::DamageCalculator::new();
    let result = calculator.calculate_damage(&equipment_set, &monster);

    // 結果をJavaScriptに返す
    to_value(&result).unwrap()
}

// 画像処理関数をJavaScriptに公開（簡略化版）
#[wasm_bindgen]
pub async fn process_equipment_image(_image_data_url: &str) -> Result<JsValue, JsValue> {
    // ダミーの装備セットを作成
    let mut equipment_set = models::equipment::EquipmentSet::new();

    // ダミーの武器を追加（属性の種類なし）
    equipment_set.weapon = Some(models::equipment::Equipment {
        name: "テスト武器".to_string(),
        attack: 100,
        defense: 0,
        element_value: 20,
        equipment_type: models::equipment::EquipmentType::Weapon,
        options: vec![],
    });

    // 結果をJavaScriptに返す
    Ok(to_value(&equipment_set).unwrap())
}
