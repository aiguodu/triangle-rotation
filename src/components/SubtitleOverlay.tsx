import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Loader2 } from 'lucide-react';

interface SubtitleOverlayProps {
  text: string;
  isPlaying: boolean;
  isLoading?: boolean;
}

export default function SubtitleOverlay({ text, isPlaying, isLoading = false }: SubtitleOverlayProps) {
  return (
    <AnimatePresence>
      {(isPlaying || isLoading || text) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg z-50"
        >
          <div className="bg-slate-900/70 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/10 flex items-start gap-3">
            <div className="mt-1 shrink-0 text-blue-400">
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isPlaying ? (
                <Volume2 className="w-5 h-5 animate-pulse" />
              ) : (
                <Volume2 className="w-5 h-5 opacity-50" />
              )}
            </div>
            <div className="flex-1 max-h-[100px] overflow-y-auto pr-2 custom-scrollbar">
              <p className="text-white text-base leading-relaxed font-medium tracking-wide">
                {text}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
