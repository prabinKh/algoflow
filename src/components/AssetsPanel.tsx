import React from 'react';
import { 
  FileText, 
  FileVideo, 
  Image as ImageIcon, 
  File, 
  Download,
  ExternalLink,
  Eye
} from 'lucide-react';
import { Algorithm, Asset } from '../types';
import { cn } from '../lib/utils';

interface AssetsPanelProps {
  algorithm: Algorithm;
}

export default function AssetsPanel({ algorithm }: AssetsPanelProps) {
  const assets = algorithm.assets || [];

  if (assets.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-12 text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
          <File size={32} />
        </div>
        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">No Reference Assets</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
          This algorithm doesn't have any attached documents or media files yet.
        </p>
      </div>
    );
  }

  const handleDownload = (asset: Asset) => {
    const link = document.createElement('a');
    link.href = asset.data;
    link.download = asset.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <FileText size={20} />
          </div>
          <div>
            <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Reference Library</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Attached Documentation & Media</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {assets.map((asset) => (
            <div 
              key={asset.id}
              className="group relative bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 hover:border-indigo-500/50 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 group-hover:text-indigo-500 transition-colors">
                  {asset.type === 'pdf' && <FileText size={24} />}
                  {asset.type === 'text' && <File size={24} />}
                  {asset.type === 'image' && <ImageIcon size={24} />}
                  {asset.type === 'video' && <FileVideo size={24} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate pr-8">{asset.name}</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{asset.type}</p>
                </div>
              </div>

              {/* Preview for images */}
              {asset.type === 'image' && (
                <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 aspect-video bg-slate-100 dark:bg-slate-900">
                  <img src={asset.data} alt={asset.name} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Preview for videos */}
              {asset.type === 'video' && (
                <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 aspect-video bg-slate-100 dark:bg-slate-900">
                  <video src={asset.data} controls className="w-full h-full object-cover" />
                </div>
              )}

              <div className="absolute top-4 right-4 flex gap-2">
                <button 
                  onClick={() => handleDownload(asset)}
                  className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:text-indigo-500 hover:border-indigo-500/50 transition-all shadow-sm"
                  title="Download Asset"
                >
                  <Download size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
