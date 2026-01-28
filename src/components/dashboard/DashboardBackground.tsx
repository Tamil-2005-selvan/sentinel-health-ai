import React from "react";
import { motion } from "framer-motion";

// SVG patterns for the medical/tech background
const ECGPattern: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 400 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <motion.path
      d="M0 50 L40 50 L50 50 L60 20 L70 80 L80 35 L90 65 L100 50 L400 50"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
    />
  </svg>
);

const NeuralNetworkNodes: React.FC = () => {
  const nodes = [
    { x: 10, y: 20, delay: 0 },
    { x: 25, y: 35, delay: 0.2 },
    { x: 15, y: 55, delay: 0.4 },
    { x: 35, y: 15, delay: 0.1 },
    { x: 40, y: 45, delay: 0.3 },
    { x: 30, y: 70, delay: 0.5 },
    { x: 55, y: 25, delay: 0.15 },
    { x: 50, y: 60, delay: 0.35 },
    { x: 65, y: 40, delay: 0.25 },
    { x: 75, y: 20, delay: 0.1 },
    { x: 80, y: 55, delay: 0.4 },
    { x: 70, y: 75, delay: 0.3 },
    { x: 90, y: 35, delay: 0.2 },
    { x: 85, y: 65, delay: 0.45 },
  ];

  const connections = [
    { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 0, to: 3 },
    { from: 3, to: 4 }, { from: 1, to: 4 }, { from: 2, to: 5 },
    { from: 4, to: 5 }, { from: 3, to: 6 }, { from: 4, to: 7 },
    { from: 6, to: 8 }, { from: 7, to: 8 }, { from: 6, to: 9 },
    { from: 8, to: 10 }, { from: 7, to: 11 }, { from: 9, to: 12 },
    { from: 10, to: 12 }, { from: 10, to: 13 }, { from: 11, to: 13 },
  ];

  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.04]" viewBox="0 0 100 100">
      {/* Neural network connection lines */}
      {connections.map((conn, i) => (
        <motion.line
          key={`conn-${i}`}
          x1={`${nodes[conn.from].x}%`}
          y1={`${nodes[conn.from].y}%`}
          x2={`${nodes[conn.to].x}%`}
          y2={`${nodes[conn.to].y}%`}
          stroke="hsl(var(--primary))"
          strokeWidth="0.15"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: 1, pathLength: 1 }}
          transition={{ duration: 1.5, delay: i * 0.05 }}
        />
      ))}
      {/* Neural network nodes */}
      {nodes.map((node, i) => (
        <motion.circle
          key={`node-${i}`}
          cx={`${node.x}%`}
          cy={`${node.y}%`}
          r="0.8"
          fill="hsl(var(--primary))"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: node.delay + 0.5 }}
        />
      ))}
    </svg>
  );
};

const BlockchainNodes: React.FC = () => {
  const blocks = [
    { x: 85, y: 15, size: 8 },
    { x: 92, y: 28, size: 6 },
    { x: 78, y: 25, size: 5 },
    { x: 88, y: 42, size: 7 },
    { x: 82, y: 55, size: 5 },
    { x: 95, y: 60, size: 4 },
  ];

  return (
    <div className="absolute top-0 right-0 w-1/3 h-1/2 opacity-[0.03]">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Blockchain connection lines */}
        <motion.line
          x1="85" y1="15" x2="92" y2="28"
          stroke="hsl(var(--secondary))"
          strokeWidth="0.3"
          strokeDasharray="2 1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
        <motion.line
          x1="85" y1="15" x2="78" y2="25"
          stroke="hsl(var(--secondary))"
          strokeWidth="0.3"
          strokeDasharray="2 1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        />
        <motion.line
          x1="92" y1="28" x2="88" y2="42"
          stroke="hsl(var(--secondary))"
          strokeWidth="0.3"
          strokeDasharray="2 1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        />
        <motion.line
          x1="78" y1="25" x2="82" y2="55"
          stroke="hsl(var(--secondary))"
          strokeWidth="0.3"
          strokeDasharray="2 1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        />
        <motion.line
          x1="88" y1="42" x2="95" y2="60"
          stroke="hsl(var(--secondary))"
          strokeWidth="0.3"
          strokeDasharray="2 1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
        />
        
        {/* Blockchain blocks */}
        {blocks.map((block, i) => (
          <motion.g key={`block-${i}`}>
            <motion.rect
              x={block.x - block.size / 2}
              y={block.y - block.size / 2}
              width={block.size}
              height={block.size}
              rx="1"
              fill="none"
              stroke="hsl(var(--secondary))"
              strokeWidth="0.4"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
            />
            <motion.rect
              x={block.x - block.size / 4}
              y={block.y - block.size / 4}
              width={block.size / 2}
              height={block.size / 2}
              rx="0.5"
              fill="hsl(var(--secondary))"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.5 }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
            />
          </motion.g>
        ))}
      </svg>
    </div>
  );
};

const DataFlowParticles: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full bg-primary/20"
          style={{
            left: `${10 + (i * 6)}%`,
            top: `${20 + (i % 5) * 15}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 10, 0],
            opacity: [0.1, 0.3, 0.1],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 4 + (i % 3),
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const GridPattern: React.FC = () => (
  <div 
    className="absolute inset-0 opacity-[0.015]"
    style={{
      backgroundImage: `
        linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
        linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
      `,
      backgroundSize: '60px 60px',
    }}
  />
);

const MedicalCrossPattern: React.FC = () => (
  <div className="absolute bottom-0 left-0 w-1/4 h-1/3 opacity-[0.02]">
    <svg className="w-full h-full" viewBox="0 0 100 100">
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
      >
        {/* Medical cross */}
        <rect x="42" y="25" width="16" height="50" rx="2" fill="hsl(var(--primary))" />
        <rect x="25" y="42" width="50" height="16" rx="2" fill="hsl(var(--primary))" />
        
        {/* Pulse rings */}
        <motion.circle
          cx="50"
          cy="50"
          r="35"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="0.5"
          animate={{ scale: [1, 1.3], opacity: [0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.circle
          cx="50"
          cy="50"
          r="35"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="0.5"
          animate={{ scale: [1, 1.3], opacity: [0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />
      </motion.g>
    </svg>
  </div>
);

export const DashboardBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, hsl(var(--primary) / 0.08), transparent),
            radial-gradient(ellipse 60% 40% at 100% 50%, hsl(var(--secondary) / 0.05), transparent),
            radial-gradient(ellipse 50% 30% at 0% 80%, hsl(var(--primary) / 0.04), transparent),
            linear-gradient(180deg, hsl(var(--background)) 0%, hsl(210 40% 98%) 50%, hsl(var(--background)) 100%)
          `,
        }}
      />

      {/* Grid pattern */}
      <GridPattern />

      {/* Neural network visualization */}
      <NeuralNetworkNodes />

      {/* Blockchain nodes */}
      <BlockchainNodes />

      {/* Data flow particles */}
      <DataFlowParticles />

      {/* ECG waveform - top */}
      <div className="absolute top-16 left-0 right-0 h-12 opacity-[0.06] text-primary overflow-hidden">
        <ECGPattern className="w-full h-full" />
      </div>

      {/* ECG waveform - middle */}
      <div className="absolute top-1/2 left-0 right-0 h-8 opacity-[0.03] text-secondary overflow-hidden">
        <ECGPattern className="w-full h-full" />
      </div>

      {/* Medical cross pattern */}
      <MedicalCrossPattern />

      {/* Soft vignette */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, hsl(var(--background) / 0.4) 100%)',
        }}
      />

      {/* Top glow accent */}
      <div 
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(ellipse, hsl(var(--primary) / 0.15), transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Secondary accent glow */}
      <div 
        className="absolute top-1/3 -right-20 w-[400px] h-[400px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(ellipse, hsl(var(--secondary) / 0.2), transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
    </div>
  );
};
