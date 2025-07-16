import React, { useEffect, useState } from 'react';

const size = 64; // diameter of the circle
const waveAmplitude = 6; // height of the wave
const waveLength = 32; // length of one wave cycle
const waveSpeed = 0.15; // how fast the wave animates horizontally

function getWavePath(fillPercent, phase) {
  // fillPercent: 0 (empty) to 1 (full)
  const centerY = size / 2;
  const radius = size / 2 - 4;
  const waterLevel = size - 4 - (size - 8) * fillPercent;
  let path = `M4,${size} `;
  // Draw the wave
  for (let x = 0; x <= size - 8; x += 1) {
    const y = waterLevel + Math.sin((x / waveLength + phase) * 2 * Math.PI) * waveAmplitude;
    path += `L${x + 4},${Math.min(size - 4, Math.max(4, y))} `;
  }
  // Close the path
  path += `L${size - 4},${size - 4} L4,${size - 4} Z`;
  return path;
}

const ScrollBottle = () => {
  const [fill, setFill] = useState(0);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? 1 - scrollTop / docHeight : 1;
      setFill(percent);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animate the wave phase
  useEffect(() => {
    let running = true;
    function animate() {
      setPhase((p) => (p + waveSpeed) % 1);
      if (running) requestAnimationFrame(animate);
    }
    animate();
    return () => { running = false; };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      right: 32,
      bottom: 32,
      zIndex: 99999,
      width: 100,
      height: 100,
      background: 'red',
      color: 'white',
      fontWeight: 'bold',
      fontSize: 18,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px solid black'
    }}>
      TEST
    </div>
  );
};

export default ScrollBottle; 