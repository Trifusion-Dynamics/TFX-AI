'use client'

import React from 'react'

interface ARIAAvatarProps {
  size?: 'small' | 'medium' | 'large'
  className?: string
}

const ARIAAvatar: React.FC<ARIAAvatarProps> = ({ 
  size = 'medium', 
  className = '' 
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <style jsx>{`
        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        .eye {
          animation: blink 4s infinite;
        }
        .eye:nth-child(2) {
          animation-delay: 0.1s;
        }
      `}</style>
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Robot head */}
        <defs>
          <linearGradient id="headGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
        
        {/* Head circle */}
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill="url(#headGradient)"
          stroke="#fff"
          strokeWidth="2"
        />
        
        {/* Antenna */}
        <line 
          x1="50" 
          y1="5" 
          x2="50" 
          y2="15" 
          stroke="#fff" 
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle 
          cx="50" 
          cy="5" 
          r="4" 
          fill="#fff"
        />
        
        {/* Eyes */}
        <rect 
          x="30" 
          y="35" 
          width="12" 
          height="15" 
          rx="6" 
          fill="#fff"
          className="eye"
        />
        <rect 
          x="58" 
          y="35" 
          width="12" 
          height="15" 
          rx="6" 
          fill="#fff"
          className="eye"
        />
        
        {/* Mouth */}
        <path 
          d="M 35 65 Q 50 75 65 65" 
          stroke="#fff" 
          strokeWidth="3" 
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

export default ARIAAvatar
