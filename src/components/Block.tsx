import React from 'react';

interface BlockProps {
  color: string;
  isPreview?: boolean;
  isValidPlacement?: boolean;
  isNewPlacement?: boolean;
  isClearing?: boolean;
  className?: string;
}

export const Block: React.FC<BlockProps> = React.memo(({
  color,
  isPreview = false,
  isValidPlacement = true,
  isNewPlacement = false,
  isClearing = false,
  className = '',
}) => {
  if (isPreview) {
    return (
      <div
        className={`w-full h-full rounded-md border-2 transition-all duration-75 ${
          isValidPlacement
            ? 'bg-indigo-500/40 border-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.6)] animate-pulse'
            : 'bg-rose-500/40 border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.6)]'
        } ${className}`}
      />
    );
  }

  const animationClass = isClearing
    ? 'animate-line-clear z-20'
    : isNewPlacement
    ? 'animate-place'
    : '';

  return (
    <div
      className={`w-full h-full rounded-[2px] transition-transform ${animationClass} ${className}`}
      style={{
        backgroundColor: color,
        borderTop: '2px solid rgba(255, 255, 255, 0.45)',
        borderLeft: '2px solid rgba(255, 255, 255, 0.35)',
        borderBottom: '2px solid rgba(0, 0, 0, 0.4)',
        borderRight: '2px solid rgba(0, 0, 0, 0.3)',
        boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.3), inset 0 -1px 2px rgba(0, 0, 0, 0.35)',
      }}
    />
  );
});

Block.displayName = 'Block';
