import { useEffect } from 'react';

export function useParallax(strength = 1) {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * strength * 20;
      const y = (clientY / window.innerHeight - 0.5) * strength * 20;
      
      document.documentElement.style.setProperty('--mouse-x', `${x}deg`);
      document.documentElement.style.setProperty('--mouse-y', `${-y}deg`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [strength]);
  
  return {
    x: `calc((var(--mouse-x, 0deg) * var(--tilt-strength, 1)))`,
    y: `calc((var(--mouse-y, 0deg) * var(--tilt-strength, 1)))`,
    style: {
      transform: 'rotateX(var(--mouse-y, 0deg)) rotateY(var(--mouse-x, 0deg))'
    }
  };
}
