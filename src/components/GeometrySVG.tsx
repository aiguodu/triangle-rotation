import { motion } from 'motion/react';
import { StepData } from '../data/steps';

interface GeometrySVGProps {
  step: number;
  data: StepData[];
}

// 辅助函数：计算直角标记的多边形顶点
function getRightAngleMarker(p1: {x: number, y: number}, p2: {x: number, y: number}, p3: {x: number, y: number}, size = 12) {
  const dx1 = p1.x - p2.x;
  const dy1 = p1.y - p2.y;
  const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
  if (len1 === 0) return "";
  const u1 = { x: dx1 / len1, y: dy1 / len1 };

  const dx2 = p3.x - p2.x;
  const dy2 = p3.y - p2.y;
  const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
  if (len2 === 0) return "";
  const u2 = { x: dx2 / len2, y: dy2 / len2 };

  const pt1 = { x: p2.x + u1.x * size, y: p2.y + u1.y * size };
  const pt2 = { x: pt1.x + u2.x * size, y: pt1.y + u2.y * size };
  const pt3 = { x: p2.x + u2.x * size, y: p2.y + u2.y * size };

  return `${p2.x},${p2.y} ${pt1.x},${pt1.y} ${pt2.x},${pt2.y} ${pt3.x},${pt3.y}`;
}

export default function GeometrySVG({ step, data }: GeometrySVGProps) {
  const currentRotation = data[step].rotation;

  // 坐标系常量 (放大20倍)
  const C = { x: 0, y: 0 };
  const B = { x: 240, y: 0 };
  const A = { x: 0, y: -100 };
  
  // △CDE 的初始位置 (未旋转前)
  const E_init = { x: 160, y: 0 };
  const D_init = { x: 0, y: -120 };

  // 计算旋转后的 E 和 D 绝对坐标
  const rad = (currentRotation * Math.PI) / 180;
  const Ex = E_init.x * Math.cos(rad) - E_init.y * Math.sin(rad);
  const Ey = E_init.x * Math.sin(rad) + E_init.y * Math.cos(rad);
  const Dx = D_init.x * Math.cos(rad) - D_init.y * Math.sin(rad);
  const Dy = D_init.x * Math.sin(rad) + D_init.y * Math.cos(rad);

  const D_current = { x: Dx, y: Dy };
  const E_current = { x: Ex, y: Ey };

  // 计算 C 处的直角标记 (跟随旋转)
  const uCE = { x: Ex / 160, y: Ey / 160 };
  const uCD = { x: Dx / 120, y: Dy / 120 };
  const c_p1 = { x: uCE.x * 10, y: uCE.y * 10 };
  const c_p2 = { x: c_p1.x + uCD.x * 10, y: c_p1.y + uCD.y * 10 };
  const c_p3 = { x: uCD.x * 10, y: uCD.y * 10 };
  const c_marker = `${c_p1.x},${c_p1.y} ${c_p2.x},${c_p2.y} ${c_p3.x},${c_p3.y}`;

  // 计算文本标签位置 (向外偏移)
  const E_text = { x: Ex + uCE.x * 20, y: Ey + uCE.y * 20 };
  const D_text = { x: Dx + uCD.x * 20, y: Dy + uCD.y * 20 };

  const spring = { type: "spring", stiffness: 50, damping: 15 };

  return (
    <div className="w-full h-full flex items-start pt-8 pb-24 justify-center relative overflow-hidden">
      <svg 
        viewBox="-150 -220 450 380" 
        className="w-full h-full max-w-full max-h-full drop-shadow-sm"
      >
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
          </marker>
        </defs>

        {/* 动态高亮三角形 DEB (放在底层) */}
        <motion.polygon
          animate={{ 
            points: `${Dx},${Dy} ${Ex},${Ey} ${B.x},${B.y}`,
            opacity: step >= 2 && step <= 4 ? 1 : 0 
          }}
          transition={{ default: spring, opacity: { duration: 0.3 } }}
          fill="rgba(239, 68, 68, 0.05)"
          initial={{ opacity: 0 }}
        />

        {/* 坐标轴 (Step 1 之后显示) */}
        <motion.g 
          initial={{ opacity: 0 }}
          animate={{ opacity: step >= 1 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="text-slate-400"
        >
          <line x1="-120" y1="0" x2="300" y2="0" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" markerEnd="url(#arrow)" />
          <line x1="0" y1="100" x2="0" y2="-180" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" markerEnd="url(#arrow)" />
          <text x="290" y="-10" fontSize="12" fill="currentColor" className="font-serif italic">x</text>
          <text x="10" y="-170" fontSize="12" fill="currentColor" className="font-serif italic">y</text>
        </motion.g>

        {/* 固定的 △ABC */}
        <g>
          <polygon 
            points={`${C.x},${C.y} ${B.x},${B.y} ${A.x},${A.y}`} 
            fill="rgba(59, 130, 246, 0.05)" 
            stroke="#3b82f6" 
            strokeWidth="2" 
            strokeLinejoin="round"
          />
          {/* 直角标记 C */}
          <polyline points="0,-10 10,-10 10,0" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
          
          <text x={A.x - 15} y={A.y + 5} fontSize="16" fill="#334155" className="font-serif italic font-bold">A</text>
          <text x={B.x + 8} y={B.y + 5} fontSize="16" fill="#334155" className="font-serif italic font-bold">B</text>
          <text x={C.x - 15} y={C.y + 15} fontSize="16" fill="#334155" className="font-serif italic font-bold">C</text>
        </g>

        {/* 旋转的 △CDE */}
        <g>
          <motion.polygon 
            animate={{ points: `${C.x},${C.y} ${Ex},${Ey} ${Dx},${Dy}` }}
            transition={spring}
            fill="rgba(16, 185, 129, 0.05)" 
            stroke="#10b981" 
            strokeWidth="2" 
            strokeLinejoin="round"
          />
          {/* 直角标记 C (跟随旋转) */}
          <motion.polyline 
            animate={{ points: c_marker }}
            transition={spring}
            fill="none" stroke="#10b981" strokeWidth="1.5" 
          />

          {/* 文本标签 */}
          <motion.text 
            animate={{ x: E_text.x, y: E_text.y }} 
            transition={spring}
            textAnchor="middle" dominantBaseline="middle"
            fontSize="16" fill="#334155" className="font-serif italic font-bold"
          >E</motion.text>
          <motion.text 
            animate={{ x: D_text.x, y: D_text.y }} 
            transition={spring}
            textAnchor="middle" dominantBaseline="middle"
            fontSize="16" fill="#334155" className="font-serif italic font-bold"
          >D</motion.text>
        </g>

        {/* 动态直角标记 (在全局坐标系中绘制) */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: step === 2 ? 1 : 0 }}>
          <motion.polygon 
            animate={{ points: getRightAngleMarker(D_current, E_current, B) }} 
            transition={spring}
            fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="1" 
          />
        </motion.g>
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: step === 3 ? 1 : 0 }}>
          <motion.polygon 
            animate={{ points: getRightAngleMarker(E_current, D_current, B) }} 
            transition={spring}
            fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="1" 
          />
        </motion.g>

        {/* 辅助线 EB */}
        <motion.line
          x1={B.x} y1={B.y} 
          animate={{ x2: Ex, y2: Ey, opacity: step >= 2 ? 0.8 : 0 }}
          transition={{ default: spring, opacity: { duration: 0.3 } }}
          stroke="#ef4444" strokeWidth="2" strokeDasharray="6 4"
          initial={{ opacity: 0 }}
        />
        {/* 辅助线 DB */}
        <motion.line
          x1={B.x} y1={B.y} 
          animate={{ x2: Dx, y2: Dy, opacity: step >= 2 ? 0.8 : 0 }}
          transition={{ default: spring, opacity: { duration: 0.3 } }}
          stroke="#ef4444" strokeWidth="2" strokeDasharray="6 4"
          initial={{ opacity: 0 }}
        />
      </svg>
    </div>
  );
}
