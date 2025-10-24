'use client';

import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

interface BarcodeScannerProps {
  onScan: (result: string) => void;
  isActive: boolean;
}

export default function BarcodeScanner({ onScan, isActive }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    if (!isActive) {
      // カメラを停止
      if (readerRef.current) {
        readerRef.current.reset();
      }
      setIsLoading(true);
      return;
    }

    const codeReader = new BrowserMultiFormatReader();
    readerRef.current = codeReader;

    const startScanning = async () => {
      try {
        setError('');
        setIsLoading(true);

        // 利用可能なカメラデバイスを取得
        const videoInputDevices = await codeReader.listVideoInputDevices();
        
        if (videoInputDevices.length === 0) {
          setError('カメラが見つかりません');
          setIsLoading(false);
          return;
        }

        // 背面カメラを優先的に選択
        const selectedDevice = videoInputDevices.find(device => 
          device.label.toLowerCase().includes('back') || 
          device.label.toLowerCase().includes('rear')
        ) || videoInputDevices[0];

        setIsLoading(false);

        // バーコードスキャンを開始
        await codeReader.decodeFromVideoDevice(
          selectedDevice.deviceId,
          videoRef.current!,
          (result, error) => {
            if (result) {
              onScan(result.getText());
              // スキャン成功時の音声フィードバック
              const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZTA0PVqzn77BdGAg+ltryxnUrBSh+zPDZjj0HGmS56uihUBELTKXh8bllHAU2jdXzzn0pBSd6yO/dkUM=');
              audio.play().catch(() => {});
            }
            if (error && !(error instanceof NotFoundException)) {
              console.error(error);
            }
          }
        );

      } catch (err) {
        console.error('カメラの起動に失敗しました:', err);
        setError('カメラへのアクセスを許可してください');
        setIsLoading(false);
      }
    };

    startScanning();

    return () => {
      codeReader.reset();
    };
  }, [isActive, onScan]);

  if (!isActive) {
    return null;
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
      />
      
      {/* スキャンエリアのオーバーレイ */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-4/5 aspect-square max-w-sm">
          {/* コーナーデザイン */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-blue-500 rounded-tl-xl"></div>
          <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-blue-500 rounded-tr-xl"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-blue-500 rounded-bl-xl"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-blue-500 rounded-br-xl"></div>
          
          {/* スキャンライン */}
          <div className="absolute inset-x-0 top-1/2 h-0.5 bg-linear-to-r from-transparent via-blue-400 to-transparent animate-pulse"></div>
        </div>
      </div>

      {/* ローディング表示 */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-white font-medium">カメラを起動中...</p>
          </div>
        </div>
      )}

      {/* エラー表示 */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-red-500 text-white px-6 py-4 rounded-xl shadow-lg max-w-sm mx-4 text-center">
            <p className="font-medium">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}

