import { useState } from 'react';
import { Folder, FileText, Image, Music, Video, Box, Search, Filter, Grid, List } from 'lucide-react';
import { useAssets } from '@/hooks/useAssets';

export interface AssetBrowserProps {
  projectId: string;
  onAssetSelect?: (assetId: string) => void;
}

export function AssetBrowser({ projectId, onAssetSelect }: AssetBrowserProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  const handleAssetClick = (assetId: string) => {
    setSelectedAsset(assetId);
    onAssetSelect?.(assetId);
  };

  return (
    <div className="flex h-full bg-slate-950">
      <div className="flex-1 flex flex-col">
        <BrowserToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        <div className="flex-1 overflow-auto p-4">
          {viewMode === 'grid' ? (
            <GridView projectId={projectId} onAssetClick={handleAssetClick} />
          ) : (
            <ListView projectId={projectId} onAssetClick={handleAssetClick} />
          )}
        </div>
      </div>
      {selectedAsset && (
        <AssetPreviewPanel assetId={selectedAsset} onClose={() => setSelectedAsset(null)} />
      )}
    </div>
  );
}

interface BrowserToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

function BrowserToolbar({ searchQuery, onSearchChange, viewMode, onViewModeChange }: BrowserToolbarProps) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 bg-slate-900 border-b border-slate-800">
      <div className="flex-1 relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search assets..."
          className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>
      <button className="p-2 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors">
        <Filter size={16} />
      </button>
      <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
        <button
          onClick={() => onViewModeChange('grid')}
          className={`p-1.5 rounded transition-colors ${
            viewMode === 'grid' ? 'bg-slate-700 text-slate-100' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Grid size={16} />
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          className={`p-1.5 rounded transition-colors ${
            viewMode === 'list' ? 'bg-slate-700 text-slate-100' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <List size={16} />
        </button>
      </div>
    </div>
  );
}

function GridView({ projectId, onAssetClick }: { projectId: string; onAssetClick: (id: string) => void }) {
  const mockAssets = [
    { id: '1', name: 'PlayerController.cs', type: 'script', size: '2.4 KB' },
    { id: '2', name: 'Character.prefab', type: 'prefab', size: '156 KB' },
    { id: '3', name: 'MainTexture.png', type: 'texture', size: '4.2 MB' },
    { id: '4', name: 'Background.mp3', type: 'audio', size: '3.8 MB' },
    { id: '5', name: 'Intro.mp4', type: 'video', size: '24.1 MB' },
    { id: '6', name: 'Environment.fbx', type: 'model', size: '12.5 MB' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {mockAssets.map((asset) => (
        <button
          key={asset.id}
          onClick={() => onAssetClick(asset.id)}
          className="flex flex-col items-center gap-2 p-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-blue-500 rounded-lg transition-all"
        >
          <div className="w-16 h-16 flex items-center justify-center bg-slate-800 rounded-lg">
            {getAssetIcon(asset.type)}
          </div>
          <div className="w-full text-center">
            <p className="text-sm font-medium text-slate-100 truncate">{asset.name}</p>
            <p className="text-xs text-slate-500 mt-0.5">{asset.size}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

function ListView({ projectId, onAssetClick }: { projectId: string; onAssetClick: (id: string) => void }) {
  const mockAssets = [
    { id: '1', name: 'PlayerController.cs', type: 'script', size: '2.4 KB', modified: '2 hours ago' },
    { id: '2', name: 'Character.prefab', type: 'prefab', size: '156 KB', modified: '5 hours ago' },
    { id: '3', name: 'MainTexture.png', type: 'texture', size: '4.2 MB', modified: '1 day ago' },
    { id: '4', name: 'Background.mp3', type: 'audio', size: '3.8 MB', modified: '2 days ago' },
    { id: '5', name: 'Intro.mp4', type: 'video', size: '24.1 MB', modified: '3 days ago' },
    { id: '6', name: 'Environment.fbx', type: 'model', size: '12.5 MB', modified: '1 week ago' },
  ];

  return (
    <div className="space-y-1">
      {mockAssets.map((asset) => (
        <button
          key={asset.id}
          onClick={() => onAssetClick(asset.id)}
          className="w-full flex items-center gap-4 p-3 bg-slate-900 hover:bg-slate-800 border border-transparent hover:border-blue-500 rounded-lg transition-all"
        >
          <div className="w-10 h-10 flex items-center justify-center bg-slate-800 rounded">
            {getAssetIcon(asset.type, 20)}
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-slate-100">{asset.name}</p>
            <p className="text-xs text-slate-500">{asset.type}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-300">{asset.size}</p>
            <p className="text-xs text-slate-500">{asset.modified}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

function AssetPreviewPanel({ assetId, onClose }: { assetId: string; onClose: () => void }) {
  return (
    <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <h3 className="text-sm font-semibold text-slate-100">Asset Preview</h3>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 transition-colors"
        >
          ×
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-4">
        <div className="bg-slate-800 rounded-lg aspect-square flex items-center justify-center">
          <Image size={48} className="text-slate-600" />
        </div>
        <div className="space-y-2">
          <DetailRow label="Name" value="MainTexture.png" />
          <DetailRow label="Type" value="Texture" />
          <DetailRow label="Size" value="4.2 MB" />
          <DetailRow label="Resolution" value="2048 × 2048" />
          <DetailRow label="Format" value="PNG" />
          <DetailRow label="Modified" value="1 day ago" />
        </div>
        <div className="pt-4 space-y-2">
          <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
            Open in Editor
          </button>
          <button className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg text-sm font-medium transition-colors">
            Show in Explorer
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-100 font-medium">{value}</span>
    </div>
  );
}

function getAssetIcon(type: string, size = 24) {
  switch (type) {
    case 'script':
      return <FileText size={size} className="text-blue-400" />;
    case 'texture':
      return <Image size={size} className="text-purple-400" />;
    case 'audio':
      return <Music size={size} className="text-green-400" />;
    case 'video':
      return <Video size={size} className="text-red-400" />;
    case 'model':
    case 'prefab':
      return <Box size={size} className="text-orange-400" />;
    default:
      return <FileText size={size} className="text-slate-400" />;
  }
}
