import React from 'react';

const Skeleton = ({ className, variant = 'text', animation = 'pulse', ...props }) => {
  // Base classes for the skeleton element
  const baseClasses = `bg-gray-200 dark:bg-slate-700/50 ${animation === 'pulse' ? 'animate-pulse' : ''}`;
  
  // Specific variant classes
  const variantClasses = {
    text: 'h-4 rounded-[4px] w-full',
    circle: 'rounded-full h-12 w-12',
    rectangular: 'h-auto w-full',
    card: 'rounded-2xl h-auto w-full'
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className || ''}`}
      {...props}
    />
  );
};

export default Skeleton;
