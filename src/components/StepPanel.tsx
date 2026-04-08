import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Lightbulb, Target, CheckCircle2, XCircle, Calculator } from 'lucide-react';
import { StepData } from '../data/steps';

interface StepPanelProps {
  step: number;
  data: StepData[];
}

const icons = [Lightbulb, Target, Calculator, Calculator, XCircle, CheckCircle2];

export default function StepPanel({ step, data }: StepPanelProps) {
  const currentData = data[step];
  const Icon = icons[step] || ChevronRight;

  return (
    <div className="h-full flex flex-col p-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
      
      <div className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full flex flex-col"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold w-fit mb-6">
              <Icon className="w-4 h-4" />
              <span>步骤 {step + 1} / {data.length}</span>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">
              {currentData.title}
            </h2>
            
            <p className="text-slate-600 text-lg mb-8 font-medium leading-relaxed">
              {currentData.desc}
            </p>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex-1 overflow-y-auto">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                推导过程
              </h3>
              <div className="max-w-none">
                {currentData.detail.split('\n').map((line, i) => (
                  <p key={i} className="text-slate-700 font-serif mb-3 last:mb-0 leading-loose">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
