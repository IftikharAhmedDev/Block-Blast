import React from 'react';
import { BLOCK_THEMES } from '../config/gameConfig';

interface BlockProps {
  color: string;
  isPreview?: boolean;
  isNewPlacement?: boolean;
  isClearing?: boolean;
  className?: string;
}

export const Block: React.FC<BlockProps> = React.memo(({
  color,
  isPreview = false,
  isNewPlacement = false,
  isClearing = false,
  className = '',
}) => {
  if (isPreview) {
    return (
      <div
        className={`w-full h-full rounded-[2px] border-2 transition-all duration-75 bg-white/35 border-white/90 shadow-[0_0_8px_rgba(255,255,255,0.6)] ${className}`}
      />
    );
  }

  const theme = BLOCK_THEMES[color] || {
    base: color,
    top: 'rgba(255, 255, 255, 0.45)',
    left: 'rgba(255, 255, 255, 0.25)',
    right: 'rgba(0, 0, 0, 0.25)',
    bottom: 'rgba(0, 0, 0, 0.45)',
  };

  const animationClass = isClearing
    ? 'animate-line-clear z-20'
    : isNewPlacement
    ? 'animate-place'
    : '';

  return (
    <div
      className={`w-full h-full relative rounded-[2px] overflow-hidden select-none box-border transition-transform ${animationClass} ${className}`}
      style={{
        backgroundColor: theme.base,
        borderTop: `3.5px solid ${theme.top}`,
        borderLeft: `3.5px solid ${theme.left}`,
        borderRight: `3.5px solid ${theme.right}`,
        borderBottom: `3.5px solid ${theme.bottom}`,
        boxShadow: 'inset 0 0 1px rgba(0, 0, 0, 0.25)',
      }}
    >
      {/* Center facet highlight */}
      <div
        className="w-full h-full pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.02) 50%, rgba(0,0,0,0.1) 100%)',
        }}
      />
    </div>
  );
});

Block.displayName = 'Block';


