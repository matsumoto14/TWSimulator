import React, { useState, useEffect } from "react";
import "./App.css";
import { Monster, EquipmentSet } from "./types/models";
import MonsterSelector from "./components/monster/MonsterSelector";
import EquipmentPanel from "./components/equipment/EquipmentPanel";
import ImageUploader from "./components/image/ImageUploader";

// Import the WASM module
// Note: The actual path may need to be adjusted based on where the WASM module is located
interface WasmModule {
  // 必要な関数だけを定義し、オプショナルにする
  get_default_monsters?: () => Monster[];
  calculate_damage?: (
    monster: Monster,
    equipment: EquipmentSet
  ) => DamageResult;
  // 非同期関数として定義
  process_equipment_image?: (imageDataUrl: string) => Promise<EquipmentSet>;
  default: () => Promise<void>;
}

// Define the DamageResult interface based on what we expect from the WASM module
interface DamageResult {
  base_damage: number;
  min_damage: number;
  max_damage: number;
  critical_rate: number;
  critical_damage: number;
  element_bonus: number;
  average_damage: number;
  hits_to_kill: number;
}

let wasmModule: WasmModule | null = null;

function App() {
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [selectedMonsters, setSelectedMonsters] = useState<Monster[]>([]);
  const [equipmentSet, setEquipmentSet] = useState<EquipmentSet>({});
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWasm() {
      try {
        console.log("Attempting to load WASM module...");

        // 直接パスを指定してインポート
        const wasm = await import("../pkg/twsimulator.js");
        console.log("WASM module imported:", wasm);

        // 初期化
        await wasm.default();
        console.log("WASM module initialized");

        // 利用可能な関数を確認（深いプロパティも含めて）
        console.log(
          "Available functions in WASM module (top level):",
          Object.keys(wasm)
        );

        // すべてのプロパティを再帰的に表示
        const logAllProperties = (obj, prefix = "") => {
          for (const key of Object.keys(obj)) {
            const value = obj[key];
            console.log(`${prefix}${key}: ${typeof value}`);
            if (typeof value === "object" && value !== null) {
              logAllProperties(value, `${prefix}${key}.`);
            }
          }
        };

        logAllProperties(wasm, "");

        // WASMモジュールを設定
        wasmModule = wasm as unknown as WasmModule;

        // 関数が存在するか確認
        if (wasmModule) {
          if (typeof wasmModule.process_equipment_image === "function") {
            console.log("Found process_equipment_image function directly");
          } else if (
            wasm.process_equipment_image &&
            typeof wasm.process_equipment_image === "function"
          ) {
            console.log("Found process_equipment_image in wasm object");
            // 関数を直接コピー
            wasmModule.process_equipment_image = wasm.process_equipment_image;
          } else {
            console.error(
              "process_equipment_image function not found in any scope"
            );
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to load WASM module:", err);
        setError(
          "Failed to load WASM module. Please make sure the WASM module is built correctly."
        );
        setLoading(false);
      }
    }

    loadWasm();
  }, []);

  const handleMonsterSelect = (selected: Monster[]) => {
    setSelectedMonsters(selected);
  };

  const handleImageUpload = async (imageData: string) => {
    if (!wasmModule) {
      setError("WASM module not loaded");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      let detectedEquipment;

      // 関数が存在するかチェック（Object.keysを使用）
      if (
        wasmModule.process_equipment_image &&
        typeof wasmModule.process_equipment_image === "function"
      ) {
        console.log("Using WASM implementation of process_equipment_image");
        // Process the image using WASM
        detectedEquipment = await wasmModule.process_equipment_image(imageData);
      } else {
        console.warn("Using dummy implementation of process_equipment_image");
        // ダミー実装を直接ここで使用
        detectedEquipment = {
          weapon: {
            name: "ダミー武器",
            attack: 100,
            critical_rate: 10,
            element_value: 20,
            defense: 0,
          },
        };
      }

      setEquipmentSet(detectedEquipment);
    } catch (err) {
      console.error("Error processing image:", err);
      setError(
        "画像処理中にエラーが発生しました。開発者ツールでエラー詳細を確認してください。"
      );

      // エラー発生時にダミーデータを設定（開発用）
      setEquipmentSet({
        weapon: {
          name: "ダミー武器",
          attack: 150,
          critical_rate: 15,
          element_value: 25,
          defense: 0,
        },
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleCalculateDamage = () => {
    if (!wasmModule) {
      setError("WASM module not loaded");
      return;
    }

    if (!equipmentSet.weapon) {
      setError("Please upload an equipment image first");
      return;
    }

    try {
      // We're now using the MonsterSelector component's built-in damage calculation
      // Just trigger a re-render to show the damage calculations
      setError(null);
    } catch (err) {
      console.error("Error calculating damage:", err);
      setError(
        "Error calculating damage. Please check the console for details."
      );
    }
  };

  const handleClearResults = () => {
    // Reset the equipment values to clear the damage calculations
    const resetEquipment = { ...equipmentSet };
    if (resetEquipment.weapon) {
      resetEquipment.weapon = {
        ...resetEquipment.weapon,
        attack: 0,
        critical_rate: 0,
        element_value: 0,
      };
    }
    setEquipmentSet(resetEquipment);
  };

  // モンスターデータを取得する関数を修正
  const fetchMonsters = async () => {
    console.log("fetchMonsters called, wasmModule:", wasmModule);
    console.log(
      "get_default_monsters exists:",
      wasmModule && typeof wasmModule.get_default_monsters === "function"
    );

    try {
      // WASMモジュールからモンスターデータを取得
      if (wasmModule && wasmModule.get_default_monsters) {
        console.log("Using WASM default monsters");
        const monsters = wasmModule.get_default_monsters();
        setMonsters(monsters);
        return;
      }

      // WASMからデータが取得できない場合はダミーデータを使用
      console.log("WASM module not available, using dummy data");
      const dummyMonsters: Monster[] = [
        // ダミーデータ...
      ];
      setMonsters(dummyMonsters);
    } catch (error) {
      console.error("Error in fetchMonsters:", error);
      // エラー時のフォールバック...
    }
  };

  useEffect(() => {
    console.log(
      "Calling fetchMonsters, wasmModule loaded:",
      wasmModule !== null
    );
    fetchMonsters();
  }, [wasmModule]); // wasmModuleが変更されたときに実行

  // MonsterSelectorにデータを渡す前にログ出力
  useEffect(() => {
    console.log("App is passing to MonsterSelector:", {
      monstersCount: monsters.length,
      monstersData: monsters,
    });
  }, [monsters]);

  if (loading) {
    return (
      <div className="app">
        <div className="card">
          <h1>TWSimulator</h1>
          <p>Loading WASM module...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header>
        <h1>TalesWeaver ダメージ計算ツール</h1>
        <p>
          装備画面のスクリーンショットをアップロードして、ダメージを計算します
        </p>
      </header>

      <main>
        <div className="content-wrapper">
          <div className="left-panel">
            <ImageUploader onImageUpload={handleImageUpload} />
            <EquipmentPanel
              equipmentSet={equipmentSet}
              onEquipmentChange={setEquipmentSet}
            />
          </div>

          <div className="right-panel">
            <MonsterSelector
              monsters={monsters}
              selectedMonsters={selectedMonsters}
              onSelectMonsters={handleMonsterSelect}
              attackPower={equipmentSet.weapon?.attack || 0}
              criticalRate={equipmentSet.weapon?.critical_rate || 0}
              elementValue={equipmentSet.weapon?.element_value || 0}
            />

            <div className="actions">
              <button
                onClick={handleCalculateDamage}
                disabled={processing || !equipmentSet.weapon}
              >
                ダメージ計算
              </button>

              <button onClick={handleClearResults} disabled={processing}>
                クリア
              </button>
            </div>

            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
