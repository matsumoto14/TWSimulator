use anyhow::{anyhow, Result};
use base64::{engine::general_purpose, Engine as _};
use image::{DynamicImage, ImageBuffer, Rgba};
use std::io::Cursor;
use wasm_bindgen::prelude::*;
use web_sys::{CanvasRenderingContext2d, HtmlCanvasElement, HtmlImageElement};

/// 画像処理サービス
#[derive(Clone)]
pub struct ImageProcessor {
    // 必要に応じて状態を追加
}

impl ImageProcessor {
    /// 新しい画像処理サービスを作成
    pub fn new() -> Result<Self> {
        Ok(Self {})
    }

    /// Base64エンコードされた画像データをデコード
    pub fn decode_base64_image(&self, data_url: &str) -> Result<DynamicImage> {
        // data:image/png;base64, などのプレフィックスを削除
        let base64_data = if let Some(idx) = data_url.find("base64,") {
            &data_url[idx + 7..]
        } else {
            return Err(anyhow!("Invalid data URL format"));
        };

        // Base64デコード
        let image_data = general_purpose::STANDARD.decode(base64_data)?;

        // 画像データをロード
        let img = image::load_from_memory(&image_data)?;

        Ok(img)
    }

    /// HTMLImageElementから画像データを取得
    pub fn get_image_data(&self, img: &HtmlImageElement) -> Result<ImageBuffer<Rgba<u8>, Vec<u8>>> {
        let width = img.width() as u32;
        let height = img.height() as u32;

        // キャンバスを作成
        let window = web_sys::window().ok_or_else(|| anyhow!("No window found"))?;
        let document = window
            .document()
            .ok_or_else(|| anyhow!("No document found"))?;

        // JsValueエラーを文字列に変換してanyhow::Errorに包む
        let canvas = document
            .create_element("canvas")
            .map_err(|e| anyhow!("Failed to create canvas: {:?}", e))?
            .dyn_into::<HtmlCanvasElement>()
            .map_err(|e| anyhow!("Failed to convert to canvas: {:?}", e))?;

        canvas.set_width(width);
        canvas.set_height(height);

        // 2Dコンテキストを取得
        let context = canvas
            .get_context("2d")
            .map_err(|e| anyhow!("Failed to get context: {:?}", e))?
            .ok_or_else(|| anyhow!("Failed to get 2D context"))?
            .dyn_into::<CanvasRenderingContext2d>()
            .map_err(|e| anyhow!("Failed to convert to 2D context: {:?}", e))?;

        // 画像を描画
        context
            .draw_image_with_html_image_element(img, 0.0, 0.0)
            .map_err(|e| anyhow!("Failed to draw image: {:?}", e))?;

        // ピクセルデータを取得
        let image_data = context
            .get_image_data(0.0, 0.0, width as f64, height as f64)
            .map_err(|e| anyhow!("Failed to get image data: {:?}", e))?;
        let data = image_data.data();

        // ImageBufferに変換
        let mut buffer = ImageBuffer::new(width, height);
        for y in 0..height {
            for x in 0..width {
                let idx = ((y * width + x) * 4) as usize;
                let r = data[idx];
                let g = data[idx + 1];
                let b = data[idx + 2];
                let a = data[idx + 3];
                buffer.put_pixel(x, y, Rgba([r, g, b, a]));
            }
        }

        Ok(buffer)
    }

    /// 画像の特定の領域を切り出す
    pub fn crop_image(
        &self,
        img: &DynamicImage,
        x: u32,
        y: u32,
        width: u32,
        height: u32,
    ) -> DynamicImage {
        img.crop_imm(x, y, width, height)
    }

    /// 画像をグレースケールに変換
    pub fn to_grayscale(&self, img: &DynamicImage) -> DynamicImage {
        img.grayscale()
    }

    /// 画像の明るさを調整
    pub fn adjust_brightness(&self, img: &DynamicImage, factor: f32) -> DynamicImage {
        let mut adjusted = img.clone();
        for pixel in adjusted.as_mut_rgba8().unwrap().pixels_mut() {
            pixel[0] = (pixel[0] as f32 * factor).min(255.0) as u8;
            pixel[1] = (pixel[1] as f32 * factor).min(255.0) as u8;
            pixel[2] = (pixel[2] as f32 * factor).min(255.0) as u8;
        }
        adjusted
    }

    /// 画像のコントラストを調整
    pub fn adjust_contrast(&self, img: &DynamicImage, factor: f32) -> DynamicImage {
        let mut adjusted = img.clone();
        for pixel in adjusted.as_mut_rgba8().unwrap().pixels_mut() {
            pixel[0] =
                (((pixel[0] as f32 / 255.0 - 0.5) * factor + 0.5) * 255.0).clamp(0.0, 255.0) as u8;
            pixel[1] =
                (((pixel[1] as f32 / 255.0 - 0.5) * factor + 0.5) * 255.0).clamp(0.0, 255.0) as u8;
            pixel[2] =
                (((pixel[2] as f32 / 255.0 - 0.5) * factor + 0.5) * 255.0).clamp(0.0, 255.0) as u8;
        }
        adjusted
    }

    /// 画像をBase64エンコード
    pub fn encode_to_base64(&self, img: &DynamicImage, format: &str) -> Result<String> {
        let mut buffer = Vec::new();

        // formatを文字列からenumに変換し、同時にMIMEタイプも決定
        let (format_enum, mime) = match format.to_lowercase().as_str() {
            "png" => (image::ImageOutputFormat::Png, "image/png"),
            "jpeg" | "jpg" => (image::ImageOutputFormat::Jpeg(90), "image/jpeg"),
            _ => return Err(anyhow!("Unsupported format: {}", format)),
        };

        // 画像をバッファに書き込み
        img.write_to(&mut Cursor::new(&mut buffer), format_enum)?;

        // Base64エンコード
        let base64 = general_purpose::STANDARD.encode(&buffer);

        // データURLを返す
        Ok(format!("data:{};base64,{}", mime, base64))
    }
}
