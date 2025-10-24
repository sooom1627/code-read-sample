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
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top duration-500">
          <div className="bg-zinc-900/90 backdrop-blur-xl border-2 border-green-500/50 rounded-2xl shadow-2xl p-6 max-w-md">
            <div className="flex items-center gap-4">
              <div className="shrink-0 w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-green-400 uppercase tracking-wider mb-1">スキャン成功</p>
                <p className="text-2xl font-bold font-mono text-white break-all">
                  {latestRecord.code}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 現在の値（最新） */}
      {latestRecord && (
        <div className="relative group bg-zinc-900/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-blue-500/30 hover:border-blue-500/50 transition-all duration-300">
          {/* 背景グロー効果 */}
          <div className="absolute -inset-1 bg-blue-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_2px_rgba(34,197,94,0.5)]"></div>
              <h2 className="text-xs font-black text-zinc-500 uppercase tracking-widest">
                Latest Scan
              </h2>
            </div>
            
            {/* バーコード表示エリア */}
            <div className="relative bg-zinc-950/80 rounded-2xl p-8 mb-6 border border-zinc-800">
              {/* バーコードビジュアル */}
              <div className="flex justify-center gap-0.5 mb-6 opacity-20">
                <div className="w-1 h-24 bg-white rounded-full"></div>
                <div className="w-0.5 h-24 bg-white rounded-full"></div>
                <div className="w-2 h-24 bg-white rounded-full"></div>
                <div className="w-0.5 h-24 bg-white rounded-full"></div>
                <div className="w-1.5 h-24 bg-white rounded-full"></div>
                <div className="w-1 h-24 bg-white rounded-full"></div>
                <div className="w-0.5 h-24 bg-white rounded-full"></div>
                <div className="w-2 h-24 bg-white rounded-full"></div>
                <div className="w-1 h-24 bg-white rounded-full"></div>
                <div className="w-0.5 h-24 bg-white rounded-full"></div>
                <div className="w-1.5 h-24 bg-white rounded-full"></div>
              </div>
              
              <p className="text-4xl md:text-5xl font-black font-mono text-center text-white break-all tracking-wider">
                {latestRecord.code}
              </p>
            </div>
            
            <button
              onClick={() => copyToClipboard(latestRecord.code)}
              className="group/btn w-full bg-blue-500/10 hover:bg-blue-500/20 border-2 border-blue-500/50 hover:border-blue-500 text-blue-400 hover:text-blue-300 font-bold py-5 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="tracking-wide">クリップボードにコピー</span>
            </button>
          </div>
        </div>
      )}

      {/* スキャン履歴 */}
      {scanHistory.length > 0 && (
        <div className="bg-zinc-900/30 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-zinc-800/50">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
                <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-black text-white">
                  History
                </h3>
                <p className="text-xs text-zinc-500 font-semibold">
                  {scanHistory.length} items
                </p>
              </div>
            </div>
            <button
              onClick={onClearHistory}
              className="group/clear px-4 py-2 text-sm text-red-400 hover:text-red-300 font-bold transition-colors flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 rounded-xl border border-red-500/20 hover:border-red-500/40"
            >
              <svg className="w-4 h-4 group-hover/clear:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              全削除
            </button>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {scanHistory.map((record, index) => (
              <div
                key={record.id}
                className="group relative bg-zinc-800/30 hover:bg-zinc-800/50 rounded-2xl p-5 transition-all duration-300 border border-zinc-800 hover:border-blue-500/30"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="shrink-0 w-10 h-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center text-sm font-black border border-blue-500/20">
                        {index + 1}
                      </span>
                      <p className="text-xl font-mono font-bold text-white break-all">
                        {record.code}
                      </p>
                    </div>
                    <p className="text-xs text-zinc-500 font-semibold ml-14">
                      {record.timestamp.toLocaleString('ja-JP')}
                    </p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => copyToClipboard(record.code)}
                      className="p-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-all hover:scale-110 border border-blue-500/20 hover:border-blue-500/40"
                      title="コピー"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDeleteRecord(record.id)}
                      className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all hover:scale-110 border border-red-500/20 hover:border-red-500/40"
                      title="削除"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
        <div className="bg-zinc-900/30 backdrop-blur-xl rounded-3xl shadow-xl p-20 text-center border border-zinc-800/50">
          <div className="w-28 h-28 bg-zinc-800/50 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-zinc-700/50">
            {/* バーコードアイコン */}
            <div className="flex gap-1 opacity-30">
              <div className="w-1 h-16 bg-white rounded-full"></div>
              <div className="w-0.5 h-16 bg-white rounded-full"></div>
              <div className="w-1.5 h-16 bg-white rounded-full"></div>
              <div className="w-0.5 h-16 bg-white rounded-full"></div>
              <div className="w-2 h-16 bg-white rounded-full"></div>
            </div>
          </div>
          <h3 className="text-2xl font-black text-white mb-4">
            No Scans Yet
          </h3>
          <p className="text-zinc-500 text-base font-medium">
            スキャナーを起動してバーコードを読み取ってください
          </p>
        </div>
      )}
    </div>
  );
}
