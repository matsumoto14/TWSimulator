import React, { useState } from 'react';
import { EquipmentSet } from '../../types/models';
import './EquipmentPanel.css';

interface EquipmentPanelProps {
  equipmentSet: EquipmentSet;
  onEquipmentChange: (newSet: EquipmentSet) => void;
}

const EquipmentPanel = ({
  equipmentSet,
  onEquipmentChange,
}: EquipmentPanelProps) => {
  const [activeSlot, setActiveSlot] = useState(null as keyof EquipmentSet | null);

  // 装備の総合ステータスを計算
  const calculateTotalStats = () => {
    let totalAttack = 0;
    let totalDefense = 0;
    let criticalRate = 0;
    let elementValue = 0;

    // 武器
    if (equipmentSet.weapon) {
      totalAttack += equipmentSet.weapon.attack;
      totalDefense += equipmentSet.weapon.defense;
      criticalRate += equipmentSet.weapon.critical_rate;
      elementValue += equipmentSet.weapon.element_value;
  }

    // 防具
    if (equipmentSet.armor) {
      totalAttack += equipmentSet.armor.attack;
      totalDefense += equipmentSet.armor.defense;
      criticalRate += equipmentSet.armor.critical_rate;
    }

    // アクセサリー1
    if (equipmentSet.accessory1) {
      totalAttack += equipmentSet.accessory1.attack;
      totalDefense += equipmentSet.accessory1.defense;
      criticalRate += equipmentSet.accessory1.critical_rate;
    }

    // アクセサリー2
    if (equipmentSet.accessory2) {
      totalAttack += equipmentSet.accessory2.attack;
      totalDefense += equipmentSet.accessory2.defense;
      criticalRate += equipmentSet.accessory2.critical_rate;
    }

    // 特殊装備
    if (equipmentSet.special) {
      totalAttack += equipmentSet.special.attack;
      totalDefense += equipmentSet.special.defense;
      criticalRate += equipmentSet.special.critical_rate;
    }

    // クリティカル率は最大100%
    criticalRate = Math.min(criticalRate, 1.0);

    return {
      totalAttack,
      totalDefense,
      criticalRate,
      elementValue,
    };
  };

  const stats = calculateTotalStats();

  // 装備スロットをクリックしたときの処理
  const handleSlotClick = (slot: keyof EquipmentSet) => {
    setActiveSlot(activeSlot === slot ? null : slot);
  };

  // 装備を外す
  const removeEquipment = (slot: keyof EquipmentSet) => {
    const newSet = { ...equipmentSet };
    newSet[slot] = undefined;
    onEquipmentChange(newSet);
  };

  // 装備スロットのコンポーネント
  const EquipmentSlot = ({ type, slot }: { type: string, slot: keyof EquipmentSet }) => {
    const equipment = equipmentSet[slot];
    const isActive = activeSlot === slot;

    return (
      <div 
        className={`equipment-slot ${isActive ? 'active' : ''} ${equipment ? 'equipped' : 'empty'}`}
        onClick={() => handleSlotClick(slot)}
      >
        <div className="slot-type">{type}</div>
        {equipment ? (
          <div className="equipment-info">
            <div className="equipment-name">{equipment.name}</div>
            <div className="equipment-stats">
              {equipment.attack > 0 && (
                <div className="equipment-stat">攻撃: +{equipment.attack}</div>
              )}
              {equipment.defense > 0 && (
                <div className="equipment-stat">防御: +{equipment.defense}</div>
              )}
              {equipment.critical_rate > 0 && (
                <div className="equipment-stat">クリティカル: +{(equipment.critical_rate * 100).toFixed(1)}%</div>
              )}
            </div>
            <button 
              className="remove-button"
              onClick={(e) => {
                e.stopPropagation();
                removeEquipment(slot);
              }}
            >
              外す
            </button>
          </div>
        ) : (
          <div className="empty-slot">装備なし</div>
        )}
      </div>
    );
  };

  return (
    <div className="equipment-panel">
      <h2>装備</h2>
      
      <div className="equipment-slots">
        <EquipmentSlot type="武器" slot="weapon" />
        <EquipmentSlot type="防具" slot="armor" />
        <EquipmentSlot type="アクセサリー1" slot="accessory1" />
        <EquipmentSlot type="アクセサリー2" slot="accessory2" />
        <EquipmentSlot type="特殊" slot="special" />
      </div>
      
      <div className="equipment-stats-summary">
        <h3>総合ステータス</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">攻撃力:</span>
            <span className="stat-value">{stats.totalAttack}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">防御力:</span>
            <span className="stat-value">{stats.totalDefense}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">クリティカル率:</span>
            <span className="stat-value">{(stats.criticalRate * 100).toFixed(1)}%</span>
          </div>
          {stats.elementValue > 0 && (
            <div className="stat-item">
              <span className="stat-value">{stats.elementValue}</span>
            </div>
          )}
        </div>
      </div>
      
      {activeSlot && (
        <div className="equipment-selection">
          <h3>{getSlotName(activeSlot)}を選択</h3>
          <p>※ 実装中: 装備選択機能は今後実装予定です。</p>
        </div>
      )}
    </div>
  );
};

// スロット名を取得
function getSlotName(slot: keyof EquipmentSet): string {
  switch (slot) {
    case 'weapon':
      return '武器';
    case 'armor':
      return '防具';
    case 'accessory1':
      return 'アクセサリー1';
    case 'accessory2':
      return 'アクセサリー2';
    case 'special':
      return '特殊装備';
    default:
      return '';
  }
}

export default EquipmentPanel;
