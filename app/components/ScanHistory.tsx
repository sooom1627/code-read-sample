'use client';

import { useEffect, useState, useRef } from 'react';

interface ScanRecord {
  code: string;
  timestamp: Date;
  id: string;
}

interface ScanHistoryProps {
  scanHistory: ScanRecord[];
  onClearHistory: () => void;
  onDeleteRecord: (id: string) => void;
}

export default function ScanHistory({ scanHistory, onClearHistory, onDeleteRecord }: ScanHistoryProps) {
  const [showNotification, setShowNotification] = useState(false);
  const prevLengthRef = useRef(0);

  useEffect(() => {
    if (scanHistory.length > prevLengthRef.current) {
      prevLengthRef.current = scanHistory.length;
      // queueMicrotaskを使用して次のティックで通知を表示
      queueMicrotask(() => {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      });
    }
  }, [scanHistory.length]);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('クリップボードにコピーしました！');
  };

  const latestRecord = scanHistory[0];

  return (
    <div className="w-full space-y-6">
      {/* 成功通知 */}
      {showNotification && latestRecord && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top duration-300">
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl border-2 border-green-500 p-6 max-w-md">
            <div className="flex items-center gap-4">
              <div className="shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">スキャン成功！</p>
                <p className="text-2xl font-bold font-mono text-gray-900 dark:text-white break-all">
                  {latestRecord.code}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 現在の値（最新） */}
      {latestRecord && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-8 border-2 border-blue-500">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              最新のスキャン結果
            </h2>
          </div>
          <div className="bg-linear-to-br from-blue-50 to-purple-50 dark:from-zinc-800 dark:to-zinc-800 rounded-2xl p-6 mb-4">
            <p className="text-4xl md:text-5xl font-bold font-mono text-center text-gray-900 dark:text-white break-all">
              {latestRecord.code}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => copyToClipboard(latestRecord.code)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              コピー
            </button>
          </div>
        </div>
      )}

      {/* スキャン履歴 */}
      {scanHistory.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              スキャン履歴
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                ({scanHistory.length}件)
              </span>
            </h3>
            <button
              onClick={onClearHistory}
              className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              全て削除
            </button>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {scanHistory.map((record, index) => (
              <div
                key={record.id}
                className="group bg-gray-50 dark:bg-zinc-800 rounded-xl p-5 hover:bg-gray-100 dark:hover:bg-zinc-750 transition-all duration-200 border border-transparent hover:border-blue-300 dark:hover:border-blue-700"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <p className="text-2xl font-mono font-bold text-gray-900 dark:text-white break-all">
                        {record.code}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 ml-11">
                      {record.timestamp.toLocaleString('ja-JP')}
                    </p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => copyToClipboard(record.code)}
                      className="p-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-300 rounded-lg transition-colors"
                      title="コピー"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDeleteRecord(record.id)}
                      className="p-2 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-600 dark:text-red-300 rounded-lg transition-colors"
                      title="削除"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 空の状態 */}
      {scanHistory.length === 0 && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl p-16 text-center">
          <div className="w-24 h-24 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            まだスキャンされていません
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            上の「スキャナーを起動」ボタンからバーコードをスキャンしてください
          </p>
        </div>
      )}
    </div>
  );
}
