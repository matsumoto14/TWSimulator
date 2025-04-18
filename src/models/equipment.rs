use serde::{Deserialize, Serialize};

/// 装備の種類
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum EquipmentType {
    Weapon,    // 武器
    Armor,     // 防具
    Accessory, // アクセサリー
    Special,   // 特殊装備
}

/// 装備アイテム
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Equipment {
    pub name: String,
    pub equipment_type: EquipmentType,
    pub attack: u32,
    pub defense: u32,
    pub element_value: u32,
    pub options: Vec<EquipmentOption>,
}

/// 装備オプション
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EquipmentOption {
    pub name: String,
    pub value: f32,
}

/// キャラクター装備セット
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EquipmentSet {
    pub weapon: Option<Equipment>,
    pub armor: Option<Equipment>,
    pub accessory1: Option<Equipment>,
    pub accessory2: Option<Equipment>,
    pub special: Option<Equipment>,
}

impl EquipmentSet {
    /// 新しい空の装備セットを作成
    pub fn new() -> Self {
        Self {
            weapon: None,
            armor: None,
            accessory1: None,
            accessory2: None,
            special: None,
        }
    }

    /// 総合攻撃力を計算
    pub fn total_attack(&self) -> u32 {
        let mut total = 0;

        if let Some(weapon) = &self.weapon {
            total += weapon.attack;
        }
        if let Some(armor) = &self.armor {
            total += armor.attack;
        }
        if let Some(acc1) = &self.accessory1 {
            total += acc1.attack;
        }
        if let Some(acc2) = &self.accessory2 {
            total += acc2.attack;
        }
        if let Some(special) = &self.special {
            total += special.attack;
        }

        total
    }

    /// 総合防御力を計算
    pub fn total_defense(&self) -> u32 {
        if let Some(weapon) = &self.weapon {
            weapon.defense
        } else {
            0
        }
    }

    /// 属性値を取得
    pub fn element_value(&self) -> u32 {
        if let Some(weapon) = &self.weapon {
            weapon.element_value
        } else {
            0
        }
    }
}
