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

        // 背面カメラを優先的に選択（複数の条件でチェック）
        let selectedDevice = videoInputDevices.find(device => {
          const label = device.label.toLowerCase();
          return label.includes('back') || 
                 label.includes('rear') || 
                 label.includes('environment') ||
                 label.includes('背面');
        });

        // 見つからない場合は最後のデバイスを選択（通常、背面カメラは後方にリストされる）
        if (!selectedDevice && videoInputDevices.length > 1) {
          selectedDevice = videoInputDevices[videoInputDevices.length - 1];
        }
        
        // それでもなければ最初のデバイス
        if (!selectedDevice) {
          selectedDevice = videoInputDevices[0];
        }

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
    <div className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden border-2 border-zinc-800 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)]">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
      />
      
      {/* スキャンエリアのオーバーレイ */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* 暗いオーバーレイ */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* バーコードスキャンエリア - 横長 */}
        <div className="relative z-10 w-[85%] h-32">
          {/* メインスキャンエリア */}
          <div className="absolute inset-0 border-2 border-blue-400 rounded-xl bg-blue-500/5 backdrop-blur-sm">
            {/* コーナーマーカー */}
            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-blue-400 rounded-tl-lg"></div>
            <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-blue-400 rounded-tr-lg"></div>
            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-blue-400 rounded-bl-lg"></div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-blue-400 rounded-br-lg"></div>
          </div>
          
          {/* アニメーションスキャンライン */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-blue-400 shadow-[0_0_10px_2px_rgba(59,130,246,0.8)] animate-scan-line"></div>
          
          {/* バーコードのガイドライン */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-1 opacity-20">
            <div className="w-1 h-20 bg-white rounded-full"></div>
            <div className="w-0.5 h-20 bg-white rounded-full"></div>
            <div className="w-1.5 h-20 bg-white rounded-full"></div>
            <div className="w-0.5 h-20 bg-white rounded-full"></div>
            <div className="w-2 h-20 bg-white rounded-full"></div>
            <div className="w-1 h-20 bg-white rounded-full"></div>
            <div className="w-0.5 h-20 bg-white rounded-full"></div>
            <div className="w-1.5 h-20 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      {/* ローディング表示 */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500/30 border-t-blue-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full"></div>
              </div>
            </div>
            <p className="text-zinc-300 font-semibold text-lg">カメラを起動中...</p>
          </div>
        </div>
      )}

      {/* エラー表示 */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-red-500/10 border-2 border-red-500 text-red-300 px-8 py-6 rounded-2xl shadow-2xl max-w-sm mx-4 text-center backdrop-blur-xl">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-semibold">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}

