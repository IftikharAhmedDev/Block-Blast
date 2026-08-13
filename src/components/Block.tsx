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
      className={`w-full h-full rounded-[3px] sm:rounded-sm transition-transform ${animationClass} ${className}`}
      style={{
        backgroundColor: color,
        boxShadow: `
          inset 0 2.5px 2px rgba(255, 255, 255, 0.45),
          inset 2.5px 0 2px rgba(255, 255, 255, 0.25),
          inset 0 -2.5px 3px rgba(0, 0, 0, 0.4),
          inset -2.5px 0 3px rgba(0, 0, 0, 0.3),
          0 2px 4px rgba(0, 0, 0, 0.4)
        `,
      }}
    />
  );
});

Block.displayName = 'Block';
