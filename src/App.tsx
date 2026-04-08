import { useState, useEffect } from 'react';
import { RotateCcw, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import GeometrySVG from './components/GeometrySVG';
import StepPanel from './components/StepPanel';
import SubtitleOverlay from './components/SubtitleOverlay';
import { stepsData } from './data/steps';
import { playTTS, stopTTS } from './services/ttsService';

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 当步骤改变时，自动播放当前步骤的 TTS
  useEffect(() => {
    handlePlayTTS();
    return () => {
      stopTTS();
    };
  }, [currentStep]);

  const handlePlayTTS = () => {
    setIsLoading(true);
    setIsPlaying(false);
    
    // 模拟网络延迟
    setTimeout(() => {
      setIsLoading(false);
      setIsPlaying(true);
      playTTS(stepsData[currentStep].tts, () => {
        setIsPlaying(false);
      });
    }, 300);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopTTS();
      setIsPlaying(false);
    } else {
      handlePlayTTS();
    }
  };

  const nextStep = () => {
    if (currentStep < stepsData.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const reset = () => {
    setCurrentStep(0);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200/60">
        
        {/* Header */}
        <header className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-white/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full tracking-wider">
              几何动点
            </span>
            <h1 className="text-lg font-bold text-slate-800">
              探究旋转中的直角三角形
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={togglePlay}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
              title={isPlaying ? "暂停讲解" : "播放讲解"}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex flex-col md:flex-row h-[570px]">
          {/* Left: Visual/Geometry Area */}
          <div className="w-full md:w-[55%] relative bg-white border-r border-slate-100">
            <GeometrySVG step={currentStep} data={stepsData} />
            <SubtitleOverlay 
              text={stepsData[currentStep].tts} 
              isPlaying={isPlaying} 
              isLoading={isLoading} 
            />
          </div>

          {/* Right: Logic/Explanation Area */}
          <div className="w-full md:w-[45%] bg-slate-50/50">
            <StepPanel step={currentStep} data={stepsData} />
          </div>
        </div>

        {/* Footer Controls */}
        <footer className="h-16 border-t border-slate-100 bg-white flex items-center justify-between px-6">
          <button 
            onClick={reset}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-slate-50"
          >
            <RotateCcw className="w-4 h-4" />
            重新开始
          </button>

          <div className="flex items-center gap-3">
            <button 
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-1 px-5 py-2.5 rounded-xl font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 hover:bg-slate-100 active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
              上一步
            </button>
            <button 
              onClick={nextStep}
              disabled={currentStep === stepsData.length - 1}
              className="flex items-center gap-1 px-6 py-2.5 rounded-xl font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200 active:scale-95"
            >
              下一步
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
}
