'use client';

import { useState } from 'react';
import BarcodeScanner from './components/BarcodeScanner';
import ScanHistory from './components/ScanHistory';

interface ScanRecord {
  code: string;
  timestamp: Date;
  id: string;
}

export default function Home() {
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
  const [isScannerActive, setIsScannerActive] = useState(false);

  const handleScan = (code: string) => {
    const newRecord: ScanRecord = {
      code,
      timestamp: new Date(),
      id: `${Date.now()}-${Math.random()}`,
    };
    setScanHistory(prev => [newRecord, ...prev]);
    // スキャン後、少し待ってからカメラを停止
    setTimeout(() => {
      setIsScannerActive(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* 背景エフェクト */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-900/20 via-zinc-950 to-zinc-950"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
      
      <div className="relative container mx-auto px-4 py-8 max-w-5xl">
        {/* ヘッダー */}
        <header className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-8">
            {/* バーコードアイコン */}
            <div className="flex gap-1">
              <div className="w-1 h-16 bg-zinc-100 rounded-full"></div>
              <div className="w-0.5 h-16 bg-zinc-400 rounded-full"></div>
              <div className="w-1.5 h-16 bg-zinc-100 rounded-full"></div>
              <div className="w-0.5 h-16 bg-zinc-400 rounded-full"></div>
              <div className="w-1 h-16 bg-zinc-200 rounded-full"></div>
              <div className="w-2 h-16 bg-zinc-100 rounded-full"></div>
              <div className="w-0.5 h-16 bg-zinc-400 rounded-full"></div>
              <div className="w-1 h-16 bg-zinc-100 rounded-full"></div>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight">
            Barcode<span className="text-blue-500">.</span>Scanner
          </h1>
          <p className="text-zinc-400 text-lg font-medium">
            商品バーコードをスキャン
          </p>
        </header>

        {/* スキャナー切り替えボタン */}
        <div className="mb-10">
          <button
            onClick={() => setIsScannerActive(!isScannerActive)}
            className={`group relative w-full py-8 px-8 rounded-3xl font-bold text-xl transition-all duration-500 flex items-center justify-center gap-4 overflow-hidden ${
              isScannerActive
                ? 'bg-red-500/10 border-2 border-red-500 text-red-400 hover:bg-red-500/20'
                : 'bg-blue-500/10 border-2 border-blue-500 text-blue-400 hover:bg-blue-500/20'
            }`}
          >
            {/* ガラスモーフィズム効果 */}
            <div className="absolute inset-0 bg-white/2 backdrop-blur-xl"></div>
            
            <div className="relative flex items-center justify-center gap-4">
              {isScannerActive ? (
                <>
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span className="tracking-wide">スキャナーを停止</span>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    </svg>
                  </div>
                  <span className="tracking-wide">スキャナーを起動</span>
                </>
              )}
            </div>
          </button>
        </div>

        {/* スキャナー */}
        {isScannerActive && (
          <div className="mb-10 animate-in fade-in slide-in-from-top duration-700">
            <BarcodeScanner onScan={handleScan} isActive={isScannerActive} />
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-xl">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <p className="text-sm text-blue-300 font-medium tracking-wide">
                  バーコードをカメラに向けてください
                </p>
              </div>
            </div>
          </div>
        )}

        {/* スキャン履歴 */}
        <div className="animate-in fade-in slide-in-from-bottom duration-700">
          <ScanHistory 
            scanHistory={scanHistory} 
            onClearHistory={() => setScanHistory([])}
            onDeleteRecord={(id) => setScanHistory(prev => prev.filter(r => r.id !== id))}
          />
        </div>

        {/* フッター */}
        <footer className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-zinc-600 font-medium">
            <div className="flex gap-0.5">
              <div className="w-0.5 h-4 bg-zinc-700 rounded-full"></div>
              <div className="w-1 h-4 bg-zinc-700 rounded-full"></div>
              <div className="w-0.5 h-4 bg-zinc-700 rounded-full"></div>
              <div className="w-1.5 h-4 bg-zinc-700 rounded-full"></div>
            </div>
            <span>EAN-13 / UPC-A / Code-128</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
