
import React, { useState, useCallback, useRef } from 'react';
import { 
  Settings, 
  Image as ImageIcon, 
  Download, 
  Palette, 
  Type, 
  Link as LinkIcon,
  Sparkles,
  Loader2,
  Share2,
  Layout as LayoutIcon,
  Info
} from 'lucide-react';
import { QRCodeComponent } from './components/QRCodeComponent';
import { PosterConfig, ThemeType } from './types';
import { geminiService } from './services/geminiService';

const DEFAULT_CONFIG: PosterConfig = {
  url: 'https://github.com',
  qrColor: '#000000',
  qrBgColor: '#ffffff',
  qrSize: 180,
  qrOpacity: 1,
  qrPosition: 'center',
  backgroundPrompt: 'A futuristic city at night with neon lights',
  backgroundImageUrl: 'https://picsum.photos/800/1200',
  theme: 'cyberpunk',
  title: 'SCAN ME',
  subtitle: 'Discover the future'
};

const THEMES: { id: ThemeType; name: string; icon: any }[] = [
  { id: 'minimal', name: 'Minimal', icon: Palette },
  { id: 'cyberpunk', name: 'Cyberpunk', icon: Sparkles },
  { id: 'vintage', name: 'Vintage', icon: ImageIcon },
  { id: 'nature', name: 'Nature', icon: Info },
  { id: 'abstract', name: 'Abstract', icon: LayoutIcon },
];

export default function App() {
  const [config, setConfig] = useState<PosterConfig>(DEFAULT_CONFIG);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'ai'>('content');
  const posterRef = useRef<HTMLDivElement>(null);

  const handleGenerateAIBackground = async () => {
    setIsGenerating(true);
    try {
      const url = await geminiService.generateBackground(config.backgroundPrompt, config.theme);
      if (url) {
        setConfig(prev => ({ ...prev, backgroundImageUrl: url }));
      }
    } catch (error) {
      alert("Failed to generate AI background. Check your API key or try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPoster = () => {
    // Basic screenshot logic could go here, or we can use a library. 
    // For this prototype, we'll suggest using a print feature or right-click.
    alert("In a production app, we would use html2canvas or a similar library to render this div to a file. For now, try a screenshot!");
  };

  const getThemeStyles = () => {
    switch (config.theme) {
      case 'cyberpunk': return 'font-mono text-cyan-400 uppercase tracking-widest';
      case 'vintage': return 'font-serif text-amber-900 italic';
      case 'minimal': return 'font-sans font-light text-slate-800 tracking-tight';
      case 'nature': return 'font-serif text-emerald-900';
      case 'abstract': return 'font-sans font-black text-white italic';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row overflow-hidden">
      {/* Sidebar Controls */}
      <aside className="w-full lg:w-[400px] bg-slate-900 border-r border-slate-800 p-6 flex flex-col gap-6 overflow-y-auto z-10">
        <header className="flex items-center gap-3 mb-4">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <LayoutIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            ArtQR Poster
          </h1>
        </header>

        {/* Tabs */}
        <div className="flex bg-slate-800/50 p-1 rounded-xl">
          {(['content', 'style', 'ai'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 space-y-6">
          {activeTab === 'content' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase">Target URL</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={config.url}
                    onChange={(e) => setConfig({ ...config, url: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase">Poster Title</label>
                <input
                  type="text"
                  value={config.title}
                  onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Scan Me"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase">Subtitle</label>
                <input
                  type="text"
                  value={config.subtitle}
                  onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="More information..."
                />
              </div>
            </div>
          )}

          {activeTab === 'style' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase">QR Color</label>
                  <input
                    type="color"
                    value={config.qrColor}
                    onChange={(e) => setConfig({ ...config, qrColor: e.target.value })}
                    className="w-full h-10 bg-slate-800 border border-slate-700 rounded-lg p-1 cursor-pointer"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase">QR Background</label>
                  <input
                    type="color"
                    value={config.qrBgColor}
                    onChange={(e) => setConfig({ ...config, qrBgColor: e.target.value })}
                    className="w-full h-10 bg-slate-800 border border-slate-700 rounded-lg p-1 cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase flex justify-between">
                  <span>Size</span>
                  <span className="text-slate-500">{config.qrSize}px</span>
                </label>
                <input
                  type="range"
                  min="100"
                  max="400"
                  value={config.qrSize}
                  onChange={(e) => setConfig({ ...config, qrSize: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase flex justify-between">
                  <span>Opacity</span>
                  <span className="text-slate-500">{Math.round(config.qrOpacity * 100)}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={config.qrOpacity}
                  onChange={(e) => setConfig({ ...config, qrOpacity: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase">Position</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['center', 'top-right', 'bottom-left', 'bottom-right'] as const).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setConfig({ ...config, qrPosition: pos })}
                      className={`py-2 text-xs rounded-lg border transition-all ${
                        config.qrPosition === pos 
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' 
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {pos.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase">Theme Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setConfig({ ...config, theme: t.id })}
                      className={`flex items-center gap-2 px-3 py-2 text-xs rounded-lg border transition-all ${
                        config.theme === t.id 
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' 
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <t.icon className="w-3 h-3" />
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase">Art Prompt</label>
                <textarea
                  value={config.backgroundPrompt}
                  onChange={(e) => setConfig({ ...config, backgroundPrompt: e.target.value })}
                  className="w-full h-24 bg-slate-800 border border-slate-700 rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                  placeholder="Describe your background art..."
                />
              </div>
              <button
                onClick={handleGenerateAIBackground}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Art...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Background
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <button
          onClick={downloadPoster}
          className="w-full bg-slate-100 hover:bg-white text-slate-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all mt-auto"
        >
          <Download className="w-5 h-5" />
          Download Poster
        </button>
      </aside>

      {/* Preview Area */}
      <main className="flex-1 bg-slate-950 p-4 md:p-8 flex items-center justify-center overflow-auto">
        <div 
          ref={posterRef}
          className="relative aspect-[3/4] w-full max-w-[600px] bg-slate-800 rounded-2xl shadow-2xl overflow-hidden group"
          style={{ 
            backgroundImage: config.backgroundImageUrl ? `url(${config.backgroundImageUrl})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Default gradient overlay if no image */}
          {!config.backgroundImageUrl && (
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-indigo-900" />
          )}

          {/* Theme Overlays */}
          <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
          
          {/* Content Layout */}
          <div className="absolute inset-0 p-12 flex flex-col pointer-events-none">
            {/* Header Text */}
            <div className="text-center z-10">
              <h2 className={`text-4xl font-bold mb-2 transition-all drop-shadow-md ${getThemeStyles()}`}>
                {config.title}
              </h2>
              <p className={`text-lg opacity-80 ${getThemeStyles()}`}>
                {config.subtitle}
              </p>
            </div>

            {/* QR Code Container */}
            <div className={`flex-1 flex pointer-events-auto ${
              config.qrPosition === 'center' ? 'items-center justify-center' :
              config.qrPosition === 'top-right' ? 'items-start justify-end' :
              config.qrPosition === 'bottom-left' ? 'items-end justify-start' :
              'items-end justify-end'
            }`}>
              <div 
                className="p-4 bg-white/5 backdrop-blur-sm rounded-2xl shadow-2xl ring-1 ring-white/20 transition-all duration-500 hover:scale-110"
                style={{ 
                  backgroundColor: config.qrBgColor + (Math.round(config.qrOpacity * 255)).toString(16).padStart(2, '0')
                }}
              >
                <QRCodeComponent
                  value={config.url}
                  size={config.qrSize}
                  fgColor={config.qrColor}
                  bgColor="transparent"
                  opacity={config.qrOpacity}
                />
              </div>
            </div>

            {/* Footer decoration */}
            <div className="mt-8 flex justify-center opacity-30">
              <div className="h-1 w-24 bg-white/40 rounded-full" />
            </div>
          </div>

          {/* Artistic Frame / Vignette */}
          <div className="absolute inset-0 pointer-events-none ring-[1px] ring-white/10 ring-inset rounded-2xl" />
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.4)]" />
        </div>
      </main>

      {/* Mobile Actions Overlay (Sticky) */}
      <div className="lg:hidden fixed bottom-6 right-6 flex flex-col gap-3">
        <button 
          onClick={() => setActiveTab('ai')}
          className="bg-indigo-600 p-4 rounded-full shadow-xl text-white hover:scale-110 transition-transform"
        >
          <Sparkles className="w-6 h-6" />
        </button>
        <button 
          onClick={downloadPoster}
          className="bg-white p-4 rounded-full shadow-xl text-slate-900 hover:scale-110 transition-transform"
        >
          <Download className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
