import React from 'react';
import { Monster } from '../../types/models';
import './MonsterDetailModal.css';

interface MonsterDetailModalProps {
  monster: Monster | null;
  onClose: () => void;
}

const MonsterDetailModal: React.FC<MonsterDetailModalProps> = ({ monster, onClose }) => {
  if (!monster) return null;

  return (
    <div className="monster-modal-overlay" onClick={onClose}>
      <div className="monster-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="monster-modal-close" onClick={onClose}>×</button>
        
        <div className="monster-modal-header">
          <h3>{monster.name}</h3>
          <div className="monster-modal-level">Lv.{monster.level}</div>
        </div>
        
        <div className="monster-modal-stats">
          <div className="monster-modal-stat">
            <span className="stat-label">HP:</span>
            <span className="stat-value">{monster.hp.toLocaleString()}</span>
          </div>
          <div className="monster-modal-stat">
            <span className="stat-label">ステータス防御:</span>
            <span className="stat-value">{monster.defense.toLocaleString()}</span>
          </div>
          <div className="monster-modal-stat">
            <span className="stat-label">固定防御:</span>
            <span className="stat-value">{monster.fixed_defense.toLocaleString()}</span>
          </div>
          <div className="monster-modal-stat">
            <span className="stat-label">固定減少:</span>
            <span className="stat-value">{monster.fixed_reduction.toLocaleString()}</span>
          </div>
          <div className="monster-modal-stat">
            <span className="stat-label">カット率:</span>
            <span className="stat-value">{(monster.cut_rate * 100).toFixed(1)}%</span>
          </div>
          {monster.element_resistance && (
            <>
              {monster.element_resistance > 0 && (
                <div className="monster-modal-stat">
                  <span className="stat-label">属性耐性:</span>
                  <span className="stat-value">{monster.element_resistance}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonsterDetailModal;
