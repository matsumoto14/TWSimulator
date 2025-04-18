import React from 'react';
import { Monster } from '../../types/models';
import './DamageResult.css';

interface DamageResultProps {
  monsters: Monster[];
  attackPower: number;
  criticalRate: number;
  elementType: string;
  elementValue: number;
}

const DamageResult = ({
  monsters,
  attackPower,
  criticalRate,
  elementType,
  elementValue,
}: DamageResultProps) => {
  // ダメージ計算関数
  const calculateDamage = (monster: Monster): number => {
    // 基本ダメージ計算
    const statDefense = monster.defense;
    const fixedDefense = monster.fixed_defense;
    const fixedReduction = monster.fixed_reduction;
    const cutRate = monster.cut_rate;

    // ステータス防御によるダメージ減少率
    const defenseReduction = statDefense / (statDefense + 100);
    
    // 基本ダメージ
    let damage = attackPower * (1 - defenseReduction);
    
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

  return (
    <div className="damage-result">
      <h2>ダメージ計算結果</h2>
      
      <div className="damage-stats">
        <div className="damage-stat">
          <span className="stat-label">攻撃力:</span>
          <span className="stat-value">{attackPower}</span>
        </div>
        <div className="damage-stat">
          <span className="stat-label">クリティカル率:</span>
          <span className="stat-value">{(criticalRate * 100).toFixed(1)}%</span>
        </div>
        {elementType && elementValue > 0 && (
          <>
            <div className="damage-stat">
              <span className="stat-label">属性:</span>
              <span className="stat-value">{elementType}</span>
            </div>
            <div className="damage-stat">
              <span className="stat-label">属性値:</span>
              <span className="stat-value">{elementValue}</span>
            </div>
          </>
        )}
      </div>

      {monsters.length === 0 ? (
        <div className="no-monsters">モンスターが選択されていません</div>
      ) : (
        <div className="damage-results-container">
          {monsters.map(monster => {
            const normalDamage = calculateDamage(monster);
            const criticalDamage = calculateCriticalDamage(normalDamage);
            
            // 平均DPS計算 (1秒あたり1回攻撃と仮定)
            const averageDamage = normalDamage * (1 - criticalRate) + criticalDamage * criticalRate;
            
            return (
              <div key={monster.id} className="damage-result-card">
                <div className="monster-info">
                  <div className="monster-name">{monster.name}</div>
                  <div className="monster-level">Lv.{monster.level}</div>
                </div>
                <div className="damage-info">
                  <div className="damage-item">
                    <span className="damage-label">通常ダメージ:</span>
                    <span className="damage-value">{normalDamage.toLocaleString()}</span>
                  </div>
                  <div className="damage-item">
                    <span className="damage-label">クリティカル:</span>
                    <span className="damage-value">{criticalDamage.toLocaleString()}</span>
                  </div>
                  <div className="damage-item">
                    <span className="damage-label">DPS (推定):</span>
                    <span className="damage-value">{Math.floor(averageDamage).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="damage-notes">
        <p>※ ダメージ計算は近似値です。実際のゲーム内の数値とは異なる場合があります。</p>
        <p>※ DPSは1秒あたり1回攻撃した場合の理論値です。</p>
      </div>
    </div>
  );
};

export default DamageResult;
