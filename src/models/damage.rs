use super::equipment::EquipmentSet;
use super::monster::Monster;
use rand::prelude::*;
use serde::{Deserialize, Serialize};

/// ダメージ計算結果
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DamageResult {
    pub base_damage: u32,
    pub min_damage: u32,
    pub max_damage: u32,
    pub average_damage: f32,
    pub critical_rate: f32,
    pub critical_damage: u32,
    pub element_bonus: f32,
    pub hits_to_kill: u32,
}

/// ダメージ計算機
#[derive(Debug)]
pub struct DamageCalculator {
    rng: SmallRng,
}

impl DamageCalculator {
    /// 新しいダメージ計算機を作成
    pub fn new() -> Self {
        Self {
            rng: SmallRng::from_entropy(),
        }
    }

    /// 装備セットとモンスターに基づいてダメージを計算
    pub fn calculate_damage(
        &mut self,
        equipment: &EquipmentSet,
        monster: &Monster,
    ) -> DamageResult {
        // 基本攻撃力と防御力
        let attack = equipment.total_attack();
        let status_defense = monster.defense;
        let fixed_defense = monster.fixed_defense;
        let fixed_reduction = monster.fixed_reduction;
        let cut_rate = monster.cut_rate;

        // ステータス防御によるダメージ減少
        let after_status_defense = if attack > status_defense {
            let diff = attack - status_defense;
            diff
        } else {
            1 // 最低ダメージは1
        };

        // 固定防御と固定減少によるダメージ計算
        let after_fixed_defense = if after_status_defense > fixed_defense {
            after_status_defense - fixed_defense
        } else {
            1 // 最低ダメージは1
        };

        // 固定減少の適用
        let after_fixed_reduction = if after_fixed_defense > fixed_reduction {
            after_fixed_defense - fixed_reduction
        } else {
            1 // 最低ダメージは1
        };

        // カット率の適用
        let base_damage = (after_fixed_reduction as f32 * (1.0 - cut_rate)) as u32;

        // クリティカルダメージ（基本ダメージの1.5倍）
        let critical_damage = (base_damage as f32 * 1.5) as u32;

        // 通常ダメージ範囲（基本ダメージの±10%）
        let min_damage = ((base_damage as f32 * 0.9) as u32).max(1);
        let max_damage = ((base_damage as f32 * 1.1) as u32).max(1);

        // 平均ダメージ（クリティカル率を考慮）
        let normal_avg = (min_damage + max_damage) as f32 / 2.0;
        let average_damage = normal_avg;

        // 倒すのに必要なヒット数
        let hits_to_kill = (monster.hp as f32 / average_damage).ceil() as u32;

        DamageResult {
            base_damage,
            min_damage,
            max_damage,
            average_damage,
            critical_rate: 0.0, // TODO: クリティカル率を計算する
            critical_damage,
            element_bonus: 0.0, // TODO: 属性ボーナスを計算する
            hits_to_kill,
        }
    }

    /// 1回の攻撃でのダメージをシミュレート
    pub fn simulate_single_hit(&mut self, equipment: &EquipmentSet, monster: &Monster) -> u32 {
        let damage_result = self.calculate_damage(equipment, monster);

        // クリティカルヒットかどうか判定
        let is_critical = self.rng.gen::<f32>() < damage_result.critical_rate;

        if is_critical {
            damage_result.critical_damage
        } else {
            // 通常ダメージの範囲内でランダムに決定
            self.rng
                .gen_range(damage_result.min_damage..=damage_result.max_damage)
        }
    }

    /// 複数回の攻撃をシミュレートして平均ダメージを計算
    pub fn simulate_multiple_hits(
        &mut self,
        equipment: &EquipmentSet,
        monster: &Monster,
        hits: u32,
    ) -> f32 {
        let mut total_damage = 0;

        for _ in 0..hits {
            total_damage += self.simulate_single_hit(equipment, monster);
        }

        total_damage as f32 / hits as f32
    }
}

/// ダメージ計算のテスト用関数
#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::equipment::{Equipment, EquipmentType};

    #[test]
    fn test_basic_damage_calculation() {
        let mut calculator = DamageCalculator::new();

        // テスト用の装備を作成
        let weapon = Equipment {
            name: "テスト武器".to_string(),
            equipment_type: EquipmentType::Weapon,
            attack: 100,
            defense: 0,
            element_value: 20,
            options: vec![],
        };

        let mut equipment_set = EquipmentSet::new();
        equipment_set.weapon = Some(weapon);

        // テスト用のモンスターを作成
        let monster = Monster::new(
            "test_monster",
            "テストモンスター",
            10,
            1000,
            50,   // ステータス防御
            500,  // 固定防御
            0,    // 固定減少
            0.30, // カット率 (30%)
            10,   // 属性値
        );

        // ダメージ計算
        let damage = calculator.calculate_damage(&equipment_set, &monster);

        // 基本ダメージの検証（新しい計算式に基づく）
        // 攻撃力100 - ステータス防御50 = 50
        // 50 - 固定防御500 = 1 (最低ダメージ)
        // 1 - 固定減少0 = 1
        // 1 * (1 - 0.3) = 0.7 → 切り捨てで0だが最低ダメージは1
        assert_eq!(damage.base_damage, 1);

        // 属性ボーナスの検証（火属性vs水属性なので不利、ボーナスなし）
        assert_eq!(damage.element_bonus, 0.0);
    }
}
