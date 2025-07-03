import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeJsCursor: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const targetPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Create subtle particle trail
    const particleCount = 20;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      
      // Sith red color
      colors[i * 3] = 0.8;     // R
      colors[i * 3 + 1] = 0.1; // G
      colors[i * 3 + 2] = 0.1; // B
      
      sizes[i] = Math.random() * 3 + 1;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Subtle particle material
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        varying float vSize;
        uniform float time;
        
        void main() {
          vColor = color;
          vSize = size;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (200.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vSize;
        uniform float time;
        
        void main() {
          vec2 center = gl_PointCoord - 0.5;
          float dist = length(center);
          
          if (dist > 0.5) discard;
          
          float alpha = (1.0 - (dist * 2.0)) * 0.6;
          
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      blending: THREE.AdditiveBlending,
      transparent: true,
      vertexColors: true
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    camera.position.z = 5;

    // Mouse tracking
    const handleMouseMove = (event: MouseEvent) => {
      targetPosition.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      targetPosition.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    document.addEventListener('mousemove', handleMouseMove);

    // Trail positions array
    const trailPositions: Array<{ x: number; y: number; age: number }> = [];

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      // Smooth cursor following
      mousePosition.current.x += (targetPosition.current.x - mousePosition.current.x) * 0.15;
      mousePosition.current.y += (targetPosition.current.y - mousePosition.current.y) * 0.15;

      // Update trail
      trailPositions.push({
        x: mousePosition.current.x * 2,
        y: mousePosition.current.y * 2,
        age: 0
      });

      // Remove old trail points
      for (let i = trailPositions.length - 1; i >= 0; i--) {
        trailPositions[i].age += 0.05;
        if (trailPositions[i].age > 1 || trailPositions.length > particleCount) {
          trailPositions.splice(i, 1);
        }
      }

      // Update particle positions
      const positions = particles.attributes.position.array as Float32Array;
      const colors = particles.attributes.color.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        if (i < trailPositions.length) {
          const trail = trailPositions[trailPositions.length - 1 - i];
          positions[i * 3] = trail.x;
          positions[i * 3 + 1] = trail.y;
          positions[i * 3 + 2] = 0;

          // Color fade based on age
          const intensity = 1 - trail.age;
          colors[i * 3] = intensity * 0.8;     // R
          colors[i * 3 + 1] = intensity * 0.1; // G
          colors[i * 3 + 2] = intensity * 0.1; // B
        } else {
          // Hide unused particles
          positions[i * 3] = 1000;
          positions[i * 3 + 1] = 1000;
          positions[i * 3 + 2] = 1000;
        }
      }

      particles.attributes.position.needsUpdate = true;
      particles.attributes.color.needsUpdate = true;

      // Update particle material
      particleMaterial.uniforms.time.value = time;

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default ThreeJsCursor;