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
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Algorithm, Asset } from '../types';
import { cn } from '../lib/utils';

interface AssetsPanelProps {
  algorithm: Algorithm;
}

export default function AssetsPanel({ algorithm }: AssetsPanelProps) {
  const assets = algorithm.assets || [];

  if (assets.length === 0) {
    return (
      <Card variant="glass" className="p-20 text-center flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mb-8 text-slate-600 border border-white/10 shadow-2xl">
          <File size={48} />
        </div>
        <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tighter">No Neural Assets</h3>
        <p className="text-sm text-slate-500 max-w-xs mx-auto font-medium leading-relaxed">
          This algorithm matrix currently lacks attached documentation or media reference points.
        </p>
      </Card>
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
    <Card variant="glass" className="p-10 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] -z-10 group-hover:bg-amber-500/10 transition-colors" />
      
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
          <FileText size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-black tracking-tighter text-white uppercase">Reference Library</h3>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Neural Documentation & Media Matrix</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset) => (
          <div 
            key={asset.id}
            className="group/asset relative bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-indigo-500/50 transition-all hover:shadow-2xl hover:shadow-indigo-500/10"
          >
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-slate-400 group-hover/asset:text-indigo-400 group-hover/asset:border-indigo-500/30 transition-all">
                {asset.type === 'pdf' && <FileText size={28} />}
                {asset.type === 'text' && <File size={28} />}
                {asset.type === 'image' && <ImageIcon size={28} />}
                {asset.type === 'video' && <FileVideo size={28} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-white truncate pr-10 uppercase tracking-tight">{asset.name}</p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1.5">{asset.type}</p>
              </div>
            </div>

            {/* Preview for images */}
            {asset.type === 'image' && (
              <div className="mt-6 rounded-2xl overflow-hidden border border-white/10 aspect-video bg-black/40 group-hover/asset:border-indigo-500/30 transition-all">
                <img src={asset.data} alt={asset.name} className="w-full h-full object-cover group-hover/asset:scale-110 transition-transform duration-500" />
              </div>
            )}

            {/* Preview for videos */}
            {asset.type === 'video' && (
              <div className="mt-6 rounded-2xl overflow-hidden border border-white/10 aspect-video bg-black/40 group-hover/asset:border-indigo-500/30 transition-all">
                <video src={asset.data} controls className="w-full h-full object-cover" />
              </div>
            )}

            <div className="absolute top-6 right-6 flex gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleDownload(asset)}
                className="w-10 h-10 bg-black/40 border border-white/10 text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 transition-all shadow-xl"
                title="Download Asset"
              >
                <Download size={18} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
