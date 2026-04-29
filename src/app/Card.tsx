import React, { useState, useRef, useCallback, useEffect } from 'react';
import * as htmlToImage from 'html-to-image';
import { Download, Upload } from 'lucide-react';

export default function CardGenerator() {
  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const [headline, setHeadline] = useState("Reps approve Tinubu's $516m loan request");
  const [prefix, setPrefix] = useState('JUST IN:');
  const [highlights, setHighlights] = useState('Reps, $516m');
  const [category, setCategory] = useState('Nigeria');
  const [overlay, setOverlay] = useState(50);
  const [scale, setScale] = useState(0.46);

  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setScale(containerRef.current.clientWidth / 1080);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = useCallback(() => {
    if (cardRef.current === null) {
      return;
    }

    htmlToImage.toPng(cardRef.current, {
      cacheBust: true,
      width: 1080,
      height: 1080,
      pixelRatio: 1
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `onyeakuko-${category.toLowerCase()}-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Oops, something went wrong!', err);
      });
  }, [category]);

  const highlightWords = highlights.split(',').map(s => s.trim()).filter(Boolean);

  const isHighlight = (word: string) => {
    const clean = word.replace(/['']/g, "'").replace(/[^\w$%.'-]/g, '').toLowerCase();
    return highlightWords.some(h => {
      const hc = h.trim().replace(/['']/g, "'").toLowerCase();
      return hc && (clean === hc || clean.startsWith(hc));
    });
  };

  const renderHeadline = () => {
    const words = headline.split(/(\s+)/);
    return words.map((word, i) => {
      if (word.trim() === '') {
        return <span key={i}>{word}</span>;
      }
      return (
        <span key={i} style={{ color: isHighlight(word) ? '#E59C6A' : '#FFFFFF' }}>
          {word}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#F2EDE8] flex flex-col items-center py-8 px-4" style={{ fontFamily: "'Satoshi', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@900&display=swap');
      `}</style>

      <div className="w-full max-w-5xl flex items-center justify-between mb-10 pb-5 border-b border-[#2A2A2A]">
        <div className="font-black text-[22px] tracking-[-0.02em]">
          onyeakuko<span className="text-[#E59C6A]">.</span>
        </div>
        <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#E59C6A] bg-[rgba(229,156,106,0.12)] border border-[rgba(229,156,106,0.25)] rounded-full px-3 py-1">
          Card Generator
        </div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-[1fr_420px] gap-8 items-start">
        <div className="flex flex-col gap-5">
          <div className="bg-[#161616] border border-[#2A2A2A] rounded-[14px] p-5 flex flex-col gap-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#666] pb-3 border-b border-[#2A2A2A]">Photo</div>

            <label className="relative border-2 border-dashed border-[#2A2A2A] hover:border-[#E59C6A] hover:bg-[rgba(229,156,106,0.05)] transition-colors rounded-[10px] p-5 text-center cursor-pointer flex flex-col items-center justify-center">
              <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
              <Upload className="w-5 h-5 text-[#666] mb-2" />
              <div className="text-[13px] text-[#666]"><strong className="text-[#E59C6A]">Upload photo</strong> or drag & drop</div>
              {imageName && <div className="text-[11px] text-[#E59C6A] mt-2">{imageName}</div>}
            </label>

            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-[12px] font-medium text-[#666]">Overlay darkness</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0" max="92"
                  value={overlay}
                  onChange={(e) => setOverlay(Number(e.target.value))}
                  className="flex-1 accent-[#E59C6A]"
                />
                <span className="text-[12px] font-bold text-[#E59C6A] min-w-[34px] text-right">{overlay}%</span>
              </div>
            </div>
          </div>

          <div className="bg-[#161616] border border-[#2A2A2A] rounded-[14px] p-5 flex flex-col gap-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#666] pb-3 border-b border-[#2A2A2A]">Headline</div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-[#666]">Prefix</label>
              <div className="flex flex-wrap gap-1.5">
                {['JUST IN:', 'BREAKING:', 'EXCLUSIVE:', 'DEVELOPING:', 'OPINION:', ''].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPrefix(p)}
                    className={`px-3 py-1.5 text-[11px] font-bold tracking-[0.06em] uppercase rounded-md border transition-all ${prefix === p ? 'bg-[#E59C6A] border-[#E59C6A] text-[#1A0D00]' : 'bg-[#1E1E1E] border-[#2A2A2A] text-[#666] hover:border-[#E59C6A] hover:text-[#E59C6A]'}`}
                  >
                    {p || 'None'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-[#666]">Headline text</label>
              <textarea
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg text-[#F2EDE8] text-[14px] p-3 outline-none focus:border-[#E59C6A] min-h-[80px] resize-y"
                placeholder="Reps approve Tinubu's $516m loan request for superhighway"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-[#666]">Highlight words <span className="text-[#E59C6A]">(comma separated)</span></label>
              <input
                type="text"
                value={highlights}
                onChange={(e) => setHighlights(e.target.value)}
                className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg text-[#F2EDE8] text-[14px] p-3 outline-none focus:border-[#E59C6A]"
                placeholder="Reps, $516m"
              />
              <div className="text-[11px] text-[#666] leading-relaxed">Words appear in <strong className="text-[#E59C6A]">#E59C6A</strong> — use for names, numbers, key terms</div>
            </div>
          </div>

          <div className="bg-[#161616] border border-[#2A2A2A] rounded-[14px] p-5 flex flex-col gap-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#666] pb-3 border-b border-[#2A2A2A]">Category</div>
            <div className="flex flex-wrap gap-1.5">
              {['Nigeria', 'Africa', 'Politics', 'Business', 'Technology', 'Crime', 'Sports', 'World', 'Culture', 'Health'].map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 text-[11px] font-bold tracking-[0.06em] uppercase rounded-md border transition-all ${category === c ? 'bg-[#E59C6A] border-[#E59C6A] text-[#1A0D00]' : 'bg-[#1E1E1E] border-[#2A2A2A] text-[#666] hover:border-[#E59C6A] hover:text-[#E59C6A]'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky top-6 flex flex-col gap-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#666]">Preview</div>

          <div
            ref={containerRef}
            className="relative w-full aspect-square border border-[#2A2A2A] rounded-[10px] bg-black overflow-hidden flex items-start justify-start"
          >
            <div
              style={{
                width: '1080px',
                height: '1080px',
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            >
              <div
                ref={cardRef}
                className="absolute bg-black flex-shrink-0"
                style={{
                  width: '1080px',
                  height: '1080px',
                }}
              >
                {image && (
                  <img
                    src={image}
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}

                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to bottom, 
                    rgba(0,0,0,${Math.max(0, overlay / 100 - 0.3).toFixed(2)}) 20%, 
                    rgba(0,0,0,${(overlay / 100 * 0.8).toFixed(2)}) 55%, 
                    rgba(0,0,0,${Math.min(0.96, overlay / 100 + 0.3).toFixed(2)}) 100%)`
                  }}
                />

                <div
                  className="absolute"
                  style={{
                    top: '55px',
                    left: '55px',
                    right: '55px',
                    bottom: '55px',
                    border: '12px solid #E59C6A',
                    borderRadius: '0px',
                  }}
                />

                {/* Additional bottom gradient for text readability, placed after border so it sits on top */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[60%]"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 100%)',
                    pointerEvents: 'none'
                  }}
                />

                <div
                  className="absolute"
                  style={{
                    top: '104px',
                    left: '104px',
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '44px',
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    color: '#FFFFFF',
                    lineHeight: 1
                  }}
                >
                  onyeakuko<span style={{ color: '#E59C6A' }}>.</span>
                </div>

                <div
                  className="absolute"
                  style={{
                    top: '113px',
                    right: '104px',
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '30px',
                    fontWeight: 500,
                    color: '#E59C6A',
                    lineHeight: 1
                  }}
                >
                  {category}
                </div>

                <div
                  className="absolute flex flex-col justify-end"
                  style={{
                    bottom: '120px',
                    right: '80px',
                    left: '90px',
                    fontFamily: "'Satoshi', sans-serif",
                    textAlign: 'right'
                  }}
                >
                  {prefix && (
                    <div
                      style={{
                        fontSize: '61px',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        marginBottom: '16px'
                      }}
                    >
                      {prefix}
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: '64px',
                      fontWeight: 900,
                      lineHeight: '1.2',
                      color: '#FFFFFF'
                    }}
                  >
                    {renderHeadline()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="w-full bg-[#E59C6A] text-[#1A0D00] font-black text-[15px] py-3.5 rounded-[10px] flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <Download className="w-5 h-5" />
            Download Card
          </button>
        </div>
      </div>
    </div>
  );
}
