import { useEffect, useState } from 'react';

export default function MotionEnhancements() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const current = max > 0 ? window.scrollY / max : 0;
        setProgress(current);
        document.documentElement.style.setProperty('--parallax-y', `${Math.min(window.scrollY * 0.07, 70)}px`);
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return <><div className="page-intro" aria-hidden="true"/><div className="scroll-progress" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }}/></div></>;
}
