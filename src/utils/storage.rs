use anyhow::{anyhow, Result};
use serde::{Deserialize, Serialize};
use web_sys::Storage;

/// ローカルストレージへのアクセスを提供するユーティリティ
pub struct LocalStorage;

impl LocalStorage {
    /// ローカルストレージを取得
    fn get_storage() -> Result<Storage> {
        let window = web_sys::window().ok_or_else(|| anyhow!("ウィンドウが見つかりません"))?;
        window
            .local_storage()
            .map_err(|_| anyhow!("ローカルストレージへのアクセスに失敗しました"))?
            .ok_or_else(|| anyhow!("ローカルストレージが利用できません"))
    }

    /// 値を保存
    pub fn set_item<T: Serialize>(key: &str, value: &T) -> Result<()> {
        let storage = Self::get_storage()?;
        let json =
            serde_json::to_string(value).map_err(|e| anyhow!("JSONへの変換に失敗: {}", e))?;

        storage
            .set_item(key, &json)
            .map_err(|_| anyhow!("ローカルストレージへの保存に失敗しました"))?;

        Ok(())
    }

    /// 値を取得
    pub fn get_item<T: for<'de> Deserialize<'de>>(key: &str) -> Result<Option<T>> {
        let storage = Self::get_storage()?;

        if let Ok(Some(json)) = storage.get_item(key) {
            let value =
                serde_json::from_str(&json).map_err(|e| anyhow!("JSONからの変換に失敗: {}", e))?;

            Ok(Some(value))
        } else {
            Ok(None)
        }
    }

    /// 項目を削除
    pub fn remove_item(key: &str) -> Result<()> {
        let storage = Self::get_storage()?;

        storage
            .remove_item(key)
            .map_err(|_| anyhow!("ローカルストレージからの削除に失敗しました"))?;

        Ok(())
    }

    /// ストレージをクリア
    pub fn clear() -> Result<()> {
        let storage = Self::get_storage()?;

        storage
            .clear()
            .map_err(|_| anyhow!("ローカルストレージのクリアに失敗しました"))?;

        Ok(())
    }
}

/// セッションストレージへのアクセスを提供するユーティリティ
pub struct SessionStorage;

impl SessionStorage {
    /// セッションストレージを取得
    fn get_storage() -> Result<Storage> {
        let window = web_sys::window().ok_or_else(|| anyhow!("ウィンドウが見つかりません"))?;
        window
            .session_storage()
            .map_err(|_| anyhow!("セッションストレージへのアクセスに失敗しました"))?
            .ok_or_else(|| anyhow!("セッションストレージが利用できません"))
    }

    /// 値を保存
    pub fn set_item<T: Serialize>(key: &str, value: &T) -> Result<()> {
        let storage = Self::get_storage()?;
        let json =
            serde_json::to_string(value).map_err(|e| anyhow!("JSONへの変換に失敗: {}", e))?;

        storage
            .set_item(key, &json)
            .map_err(|_| anyhow!("セッションストレージへの保存に失敗しました"))?;

        Ok(())
    }

    /// 値を取得
    pub fn get_item<T: for<'de> Deserialize<'de>>(key: &str) -> Result<Option<T>> {
        let storage = Self::get_storage()?;

        if let Ok(Some(json)) = storage.get_item(key) {
            let value =
                serde_json::from_str(&json).map_err(|e| anyhow!("JSONからの変換に失敗: {}", e))?;

            Ok(Some(value))
        } else {
            Ok(None)
        }
    }

    /// 項目を削除
    pub fn remove_item(key: &str) -> Result<()> {
        let storage = Self::get_storage()?;

        storage
            .remove_item(key)
            .map_err(|_| anyhow!("セッションストレージからの削除に失敗しました"))?;

        Ok(())
    }

    /// ストレージをクリア
    pub fn clear() -> Result<()> {
        let storage = Self::get_storage()?;

        storage
            .clear()
            .map_err(|_| anyhow!("セッションストレージのクリアに失敗しました"))?;

        Ok(())
    }
}
