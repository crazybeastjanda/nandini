
import React, { useState, useRef } from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactElement;
  onClick: () => void;
  className?: string;
  isDisabled?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, onClick, className = '', isDisabled = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isDisabled) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const rotateX = (y / rect.height - 0.5) * -20; // Tilt strength
    const rotateY = (x / rect.width - 0.5) * 20;

    cardRef.current.style.setProperty('--angle', `${(x + y) & 360}deg`);
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  };
  
  const handleMouseEnter = () => {
    if(isDisabled) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if(isDisabled) return;
    setIsHovered(false);
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
  };

  const cardClasses = `
    relative rounded-2xl p-px transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group
    ${isDisabled ? 'opacity-60 cursor-not-allowed' : ''} 
    ${className}
  `;

  const innerClasses = `
    relative w-full h-full bg-slate-900 rounded-[15px] p-6 flex flex-col z-10
    transition-colors duration-300
    ${!isDisabled ? 'group-hover:bg-slate-800/80' : ''}
  `;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={!isDisabled ? onClick : undefined}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      className={cardClasses}
      style={{ transformStyle: 'preserve-3d', '--angle': '0deg' } as React.CSSProperties}
    >
      {/* Animated Gradient Border */}
      {!isDisabled && (
         <div 
            className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
                background: 'conic-gradient(from var(--angle), #7dd3fc 0%, #a78bfa 50%, #7dd3fc 100%)',
                animation: 'rotating-border 4s linear infinite',
            }}
         ></div>
      )}
      
      <div className={innerClasses}>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-800 rounded-xl ring-1 ring-white/10 transition-all duration-300 ease-in-out group-hover:scale-110 group-hover:bg-slate-700">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            {isDisabled && <span className="text-xs text-yellow-500 font-semibold bg-yellow-500/10 px-2 py-1 rounded-md">Schedule a meeting first</span>}
          </div>
        </div>
        <p className="text-slate-400 mt-4 flex-grow">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
