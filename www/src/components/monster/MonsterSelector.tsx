import { useState, useEffect } from "react";
import { Monster } from "../../types/models";
import MonsterDetailModal from "./MonsterDetailModal";
import "./MonsterSelector.css";

interface MonsterSelectorProps {
  monsters: Monster[];
  selectedMonsters?: Monster[];
  onSelectMonsters?: (monsters: Monster[]) => void;
  attackPower?: number;
  criticalRate?: number;
  elementValue?: number;
}

const MonsterSelector = ({
  monsters,
  attackPower = 0,
  criticalRate = 0,
  elementValue = 0,
}: MonsterSelectorProps) => {
  const [modalMonster, setModalMonster] = useState<Monster | null>(null);

  // コンポーネントマウント時とpropsの変更時にログを出力
  useEffect(() => {
    console.log("MonsterSelector received props:", {
      monstersLength: monsters?.length || 0,
      monstersData: monsters,
      attackPower,
      criticalRate,
      elementValue,
    });
  }, [monsters, attackPower, criticalRate, elementValue]);

  // ダメージ計算関数
  const calculateDamage = (monster: Monster): number => {
    const statDefense = monster.defense;
    const fixedDefense = monster.fixed_defense;
    const fixedReduction = monster.fixed_reduction;
    const cutRate = monster.cut_rate;

    // ステータス防御によるダメージ減少率
    const defenseReduction = statDefense / (statDefense + 100);

    // 基本ダメージ
    let damage = attackPower * (1 - defenseReduction);

    // 属性値のみを考慮した計算
    if (elementValue > 0 && monster.element_resistance > 0) {
      // プレイヤーの属性値とモンスターの属性耐性値のみで計算
      const elementFactor = elementValue / monster.element_resistance;
      damage = damage * (1 + elementFactor * 0.1); // 例: 属性値の比率に応じてダメージ増加
    }

    // 固定防御による減少
    damage = Math.max(0, damage - fixedDefense);

    // 固定減少
    damage = Math.max(0, damage - fixedReduction);

    // カット率による減少
    damage = damage * (1 - cutRate);

    // 最低ダメージは1
    return Math.max(1, Math.floor(damage));
  };

  // クリティカルダメージ計算
  const calculateCriticalDamage = (baseDamage: number): number => {
    return Math.floor(baseDamage * 1.5); // クリティカル倍率は1.5倍と仮定
  };

  // モンスター詳細モーダルを表示
  const showMonsterDetails = (monster: Monster, event: React.MouseEvent) => {
    event.stopPropagation();
    setModalMonster(monster);
  };

  // モーダルを閉じる
  const closeModal = () => {
    setModalMonster(null);
  };

  // 属性に基づくクラス名を取得
  const getElementClass = (_elementValue: number): string => {
    // 属性値に基づいて色を決定（例：値が高いほど濃い色）
    if (_elementValue > 100) {
      return "element-high";
    } else if (_elementValue > 50) {
      return "element-medium";
    } else if (_elementValue > 0) {
      return "element-low";
    } else {
      return "element-none";
    }
  };

  return (
    <div className="monster-panel">
      <h2>モンスター一覧</h2>

      <div className="monster-list">
        {monsters.length === 0 ? (
          <div className="no-monsters">モンスターがいません</div>
        ) : (
          monsters.map((monster) => {
            // 属性クラスを属性値に基づいて取得
            const elementClass = getElementClass(monster.element_resistance);

            // ダメージ計算（攻撃力が設定されている場合のみ）
            let normalDamage = 0;
            let criticalDamage = 0;
            let averageDamage = 0;

            if (attackPower > 0) {
              normalDamage = calculateDamage(monster);
              criticalDamage = calculateCriticalDamage(normalDamage);
              averageDamage =
                normalDamage * (1 - criticalRate) +
                criticalDamage * criticalRate;
            }

            return (
              <div key={monster.id} className={`monster-item ${elementClass}`}>
                <div className="monster-header">
                  <div className="monster-name">{monster.name}</div>
                  <div className="monster-level">Lv.{monster.level}</div>
                  <button
                    className="monster-details-button"
                    onClick={(e) => showMonsterDetails(monster, e)}
                    title="詳細を表示"
                  >
                    詳細
                  </button>
                </div>

                {attackPower > 0 ? (
                  <div className="monster-damage-info">
                    <div className="damage-item">
                      <span className="damage-label">通常ダメージ:</span>
                      <span className="damage-value">
                        {normalDamage.toLocaleString()}
                      </span>
                    </div>
                    <div className="damage-item">
                      <span className="damage-label">クリティカル:</span>
                      <span className="damage-value">
                        {criticalDamage.toLocaleString()}
                      </span>
                    </div>
                    <div className="damage-item highlight">
                      <span className="damage-label">平均ダメージ:</span>
                      <span className="damage-value">
                        {Math.floor(averageDamage).toLocaleString()}
                      </span>
                    </div>
                    <div className="damage-item">
                      <span className="damage-label">必要ヒット数:</span>
                      <span className="damage-value">
                        {Math.ceil(monster.hp / averageDamage)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="monster-no-damage">
                    <p>
                      装備を設定して「ダメージ計算」ボタンを押すと、ダメージ計算結果が表示されます。
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {modalMonster && (
        <MonsterDetailModal monster={modalMonster} onClose={closeModal} />
      )}
    </div>
  );
};

export default MonsterSelector;
