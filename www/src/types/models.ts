/**
 * モンスターの情報
 */
export interface Monster {
  id: string;
  name: string;
  level: number;
  hp: number;
  defense: number; // ステータス防御
  fixed_defense: number; // 固定防御
  fixed_reduction: number; // 固定減少
  cut_rate: number; // カット率 (0.0 ~ 1.0)
  element_resistance: number; // 属性耐性値
  image_url?: string; // 画像URL（オプション）
}

/**
 * 装備の種類
 */
export enum EquipmentType {
  Weapon = "Weapon",
  Armor = "Armor",
  Accessory = "Accessory",
  Special = "Special",
}

/**
 * 装備オプション
 */
export interface EquipmentOption {
  name: string;
  value: number;
}

/**
 * 装備アイテム
 */
export interface Equipment {
  name: string;
  attack: number;
  defense: number;
  element_value: number; // 属性値（種類なし）
  critical_rate: number;
}

/**
 * キャラクター装備セット
 */
export interface EquipmentSet {
  weapon?: Equipment;
  armor?: Equipment;
  accessory1?: Equipment;
  accessory2?: Equipment;
  special?: Equipment;
}

/**
 * デフォルトのモンスターデータ
 */
export const DEFAULT_MONSTERS: Monster[] = [
  {
    id: "appleboss",
    name: "りんごボス",
    level: 30,
    hp: 1000,
    defense: 1500,
    fixed_defense: 7200,
    fixed_reduction: 0,
    cut_rate: 0.48,
    element_resistance: 120,
    image_url: "https://example.com/lizpos.png",
  },
  {
    id: "abysshell",
    name: "アビスヘル",
    level: 35,
    hp: 1200,
    defense: 1500,
    fixed_defense: 8100,
    fixed_reduction: 0,
    cut_rate: 0.75,
    element_resistance: 120,
    image_url: "https://example.com/abysshell.png",
  },
  {
    id: "abyssamas",
    name: "アビスコアマス",
    level: 35,
    hp: 1200,
    defense: 1500,
    fixed_defense: 8700,
    fixed_reduction: 0,
    cut_rate: 0.75,
    element_resistance: 120,
    image_url: "https://example.com/abyssamas.png",
  },
  {
    id: "eclipse1",
    name: "エクリプス（ロカゴス/エートス/チェリア)",
    level: 40,
    hp: 1500,
    defense: 1500,
    fixed_defense: 39720,
    fixed_reduction: 9285,
    cut_rate: 0.51,
    element_resistance: 125,
    image_url: "https://example.com/eclipsexi.png",
  },
  {
    id: "eclipse2",
    name: "エクリプス（ライコス/マティア/ティロロス）",
    level: 40,
    hp: 1500,
    defense: 1500,
    fixed_defense: 41220,
    fixed_reduction: 9285,
    cut_rate: 0.51,
    element_resistance: 125,
    image_url: "https://example.com/eclipsex3.png",
  },
  {
    id: "eclipse3",
    name: "エクリプス（アフェティリア）",
    level: 40,
    hp: 1500,
    defense: 1500,
    fixed_defense: 41220,
    fixed_reduction: 9285,
    cut_rate: 0.51,
    element_resistance: 125,
    image_url: "https://example.com/eclipsex3.png",
  },
  {
    id: "siokanboss",
    name: "シオカンボス",
    level: 40,
    hp: 1500,
    defense: 1500,
    fixed_defense: 33720,
    fixed_reduction: 9285,
    cut_rate: 0.51,
    element_resistance: 125,
    image_url: "https://example.com/diaocanpos.png",
  },
  {
    id: "odein",
    name: "オーディン",
    level: 30,
    hp: 1000,
    defense: 1500,
    fixed_defense: 51720,
    fixed_reduction: 9285,
    cut_rate: 0.51,
    element_resistance: 120,
    image_url: "https://example.com/oasis.png",
  },
  {
    id: "kimaira",
    name: "キマイラ",
    level: 30,
    hp: 1000,
    defense: 900,
    fixed_defense: 2985,
    fixed_reduction: 0,
    cut_rate: 0.993,
    element_resistance: 120,
    image_url: "https://example.com/kimaira.png",
  },
];
