/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useState } from 'react';
import { BookOpenIcon, BeakerIcon, AcademicCapIcon, ClipboardDocumentListIcon, LightBulbIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { CheckBadgeIcon, BoltIcon, StarIcon } from '@heroicons/react/24/solid';

// Component that simulates converting raw info into mastered knowledge
const KnowledgeTransformation = ({ 
  initialIcon: InitialIcon, 
  finalIcon: FinalIcon, 
  label,
  delay, 
  x, 
  y,
  rotation = 0
}: { 
  initialIcon: React.ElementType, 
  finalIcon: React.ElementType, 
  label: string,
  delay: number,
  x: string,
  y: string,
  rotation?: number
}) => {
  const [stage, setStage] = useState(0); // 0: Hidden, 1: Reading, 2: Mastered

  useEffect(() => {
    const cycle = () => {
      setStage(0);
      setTimeout(() => setStage(1), 500); // Start processing
      setTimeout(() => setStage(2), 3500); // Mastery achieved
    };

    const startTimeout = setTimeout(() => {
      cycle();
      const interval = setInterval(cycle, 9000);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay]);

  return (
    <div 
      className="absolute transition-all duration-1000 ease-in-out z-0 pointer-events-none"
      style={{ top: y, left: x, transform: `rotate(${rotation}deg)` }}
    >
      <div className={`relative w-20 h-28 md:w-28 md:h-40 rounded-lg backdrop-blur-md transition-all duration-1000 ${stage === 2 ? 'bg-emerald-900/30 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)] scale-110 -translate-y-4' : 'bg-zinc-900/10 border-zinc-800 scale-100 border border-dashed'}`}>
        
        {/* Label tag */}
        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 bg-zinc-950 text-zinc-400 border border-zinc-800 text-[8px] md:text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm transition-all duration-500 ${stage === 2 ? 'text-emerald-400 border-emerald-500/50' : ''}`}>
            {stage === 2 ? 'EXPLAINED' : label}
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Stage 1: Raw Data */}
          <div className={`absolute transition-all duration-1000 ${stage === 1 ? 'opacity-100' : 'opacity-0'}`}>
             <InitialIcon className="w-8 h-8 md:w-12 md:h-12 text-zinc-600" />
             <div className="mt-2 w-12 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 animate-[loading_2s_ease-in-out_infinite]"></div>
             </div>
          </div>

          {/* Stage 2: Knowledge Acquired */}
          <div className={`absolute transition-all duration-700 flex flex-col items-center ${stage === 2 ? 'opacity-100 scale-110 blur-0' : 'opacity-0 scale-75 blur-sm'}`}>
             <FinalIcon className="w-10 h-10 md:w-14 md:h-14 text-emerald-400 drop-shadow-lg" />
             {stage === 2 && (
                 <div className="absolute -right-2 -top-2 text-yellow-400 animate-bounce">
                    <StarIcon className="w-4 h-4" />
                 </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Hero: React.FC = () => {
  return (
    <>
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Top Left: Book -> Knowledge */}
        <div className="hidden lg:block">
            <KnowledgeTransformation 
            initialIcon={BookOpenIcon} 
            finalIcon={ChatBubbleLeftRightIcon} 
            label="TEXT"
            delay={0} 
            x="8%" 
            y="12%"
            rotation={-3} 
            />
        </div>

        {/* Bottom Right: Process -> Optimized */}
        <div className="hidden md:block">
            <KnowledgeTransformation 
            initialIcon={ClipboardDocumentListIcon} 
            finalIcon={CheckBadgeIcon} 
            label="DIAGRAM"
            delay={3000} 
            x="85%" 
            y="70%"
            rotation={2} 
            />
        </div>

        {/* Top Right: Idea -> Solution */}
        <div className="hidden lg:block">
            <KnowledgeTransformation 
            initialIcon={LightBulbIcon} 
            finalIcon={BoltIcon} 
            label="CONCEPT"
            delay={5500} 
            x="82%" 
            y="15%"
            rotation={4} 
            />
        </div>

        {/* Bottom Left: Experiment -> Result */}
        <div className="hidden md:block">
            <KnowledgeTransformation 
            initialIcon={BeakerIcon} 
            finalIcon={StarIcon} 
            label="EXAM"
            delay={4000} 
            x="6%" 
            y="65%"
            rotation={-2} 
            />
        </div>
      </div>

      <div className="text-center relative z-10 max-w-6xl mx-auto px-4 pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            AI TUTOR ENGINE
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-6 leading-[1.1]">
          Your Personal <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">PMBOK Tutor</span>.
        </h1>
        <p className="text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light">
          Upload any page. Gemini will generate an <b>interactive app with an AI Assistant</b> that quizzes you, explains the answers, and reinforces your retention through active recall.
        </p>
      </div>
    </>
  );
};