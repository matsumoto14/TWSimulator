import React, { useState, useRef } from 'react';
import './ImageUploader.css';

interface ImageUploaderProps {
  onImageUpload: (imageData: string) => void;
}

const ImageUploader = ({ onImageUpload }: ImageUploaderProps) => {
  const [previewUrl, setPreviewUrl] = useState(null as string | null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null as string | null);
  const fileInputRef = useRef(null as HTMLInputElement | null);

  // ファイル選択ダイアログを開く
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // ファイルが選択されたときの処理
  const handleFileChange = (event: any) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  // ドラッグ&ドロップ関連のイベントハンドラ
  const handleDragEnter = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  // ファイルを処理する
  const processFile = (file: File) => {
    // ファイルタイプをチェック
    if (!file.type.match('image.*')) {
      setError('画像ファイルを選択してください');
      return;
    }

    // ファイルサイズをチェック (5MB以下)
    if (file.size > 5 * 1024 * 1024) {
      setError('ファイルサイズは5MB以下にしてください');
      return;
    }

    setError(null);

    // FileReaderを使用して画像をBase64エンコードする
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        setPreviewUrl(e.target.result);
        onImageUpload(e.target.result);
      }
    };
    reader.onerror = () => {
      setError('ファイルの読み込み中にエラーが発生しました');
    };
    reader.readAsDataURL(file);
  };

  // プレビュー画像をクリア
  const clearPreview = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-uploader">
      <h2>画像アップロード</h2>
      
      <div 
        className={`upload-area ${isDragging ? 'dragging' : ''} ${previewUrl ? 'has-preview' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="preview-container">
            <img src={previewUrl} alt="プレビュー" className="preview-image" />
            <button className="clear-button" onClick={clearPreview}>
              クリア
            </button>
          </div>
        ) : (
          <div className="upload-prompt">
            <div className="upload-icon">📁</div>
            <p>ここに画像をドラッグ&ドロップするか、</p>
            <button className="upload-button" onClick={handleButtonClick}>
              ファイルを選択
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="file-input" 
            />
          </div>
        )}
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="upload-info">
        <p>※ 対応形式: JPG, PNG, GIF</p>
        <p>※ 最大サイズ: 5MB</p>
        <p>※ 装備画像の解析機能は実装中です</p>
      </div>
    </div>
  );
};

export default ImageUploader;
