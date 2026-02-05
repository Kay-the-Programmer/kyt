
import React from 'react';

interface SplitTextProps {
  text: string;
  className?: string;
  isGradient?: boolean;
}

/**
 * SplitText component that breaks text into individual characters for animation.
 * Refactored to be visible by default for better robustness.
 * Use gsap.from() in parent components to animate these characters.
 */
const SplitText: React.FC<SplitTextProps> = ({ text, className, isGradient = false }) => {
  return (
    <span className={`${className} inline-flex flex-wrap relative leading-none`} aria-label={text}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className={`letter-reveal inline-block ${isGradient ? 'gradient-text' : ''}`}
          style={{
            transformOrigin: 'bottom center',
            willChange: 'transform, opacity, filter',
            display: 'inline-block',
            whiteSpace: 'pre'
          }}
          aria-hidden="true"
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

export default SplitText;
