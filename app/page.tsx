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
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* ヘッダー */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            バーコードスキャナー
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            商品バーコードをスキャンして情報を登録
          </p>
        </header>

        {/* スキャナー切り替えボタン */}
        <div className="mb-8">
          <button
            onClick={() => setIsScannerActive(!isScannerActive)}
            className={`w-full py-6 px-8 rounded-2xl font-bold text-lg shadow-xl transform transition-all duration-300 ${
              isScannerActive
                ? 'bg-linear-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white'
                : 'bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
            } hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center gap-3`}
          >
            {isScannerActive ? (
              <>
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                スキャナーを停止
              </>
            ) : (
              <>
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                スキャナーを起動
              </>
            )}
          </button>
        </div>

        {/* スキャナー */}
        {isScannerActive && (
          <div className="mb-8 animate-in fade-in slide-in-from-top duration-500">
            <BarcodeScanner onScan={handleScan} isActive={isScannerActive} />
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
                <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                バーコードをカメラに向けてください
              </p>
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
        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-600">
          <p>対応バーコード形式: EAN-13, UPC-A, Code-128, QRコードなど</p>
        </footer>
      </div>
    </div>
  );
}
