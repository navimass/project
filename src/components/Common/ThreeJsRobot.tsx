import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeJsRobotProps {
  onRobotClick: () => void;
}

const ThreeJsRobot: React.FC<ThreeJsRobotProps> = ({ onRobotClick }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const robotRef = useRef<THREE.Group>();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 200 / 200, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(200, 200);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x2563eb, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const redLight = new THREE.PointLight(0xdc2626, 0.5, 10);
    redLight.position.set(-2, 2, 2);
    scene.add(redLight);

    // Create R2-D2 style robot
    const robotGroup = new THREE.Group();
    robotRef.current = robotGroup;

    // Materials
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xcccccc,
      shininess: 100 
    });
    const blueMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x2563eb,
      shininess: 100 
    });
    const redMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xdc2626,
      shininess: 100,
      emissive: 0x330000
    });

    // Main body (cylinder)
    const bodyGeometry = new THREE.CylinderGeometry(0.8, 0.8, 1.5, 16);
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.75;
    robotGroup.add(body);

    // Head (dome)
    const headGeometry = new THREE.SphereGeometry(0.6, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const head = new THREE.Mesh(headGeometry, bodyMaterial);
    head.position.y = 1.8;
    robotGroup.add(head);

    // Blue panels
    const panelGeometry = new THREE.BoxGeometry(0.3, 0.8, 0.05);
    const leftPanel = new THREE.Mesh(panelGeometry, blueMaterial);
    leftPanel.position.set(-0.5, 0.75, 0.8);
    robotGroup.add(leftPanel);

    const rightPanel = new THREE.Mesh(panelGeometry, blueMaterial);
    rightPanel.position.set(0.5, 0.75, 0.8);
    robotGroup.add(rightPanel);

    // Red eye/sensor
    const eyeGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const eye = new THREE.Mesh(eyeGeometry, redMaterial);
    eye.position.set(0, 1.9, 0.55);
    robotGroup.add(eye);

    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8);
    const legMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.3, -0.4, 0);
    robotGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.3, -0.4, 0);
    robotGroup.add(rightLeg);

    const centerLeg = new THREE.Mesh(legGeometry, legMaterial);
    centerLeg.position.set(0, -0.4, -0.4);
    robotGroup.add(centerLeg);

    // Add some details
    const detailGeometry = new THREE.BoxGeometry(0.2, 0.1, 0.05);
    for (let i = 0; i < 3; i++) {
      const detail = new THREE.Mesh(detailGeometry, blueMaterial);
      detail.position.set(0, 0.3 + i * 0.3, 0.8);
      robotGroup.add(detail);
    }

    scene.add(robotGroup);
    camera.position.z = 4;

    // Animation variables
    let time = 0;
    const baseRotationSpeed = 0.01;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.016;

      if (robotRef.current) {
        // Gentle floating motion
        robotRef.current.position.y = Math.sin(time * 2) * 0.1;
        
        // Slow rotation
        robotRef.current.rotation.y += baseRotationSpeed;
        
        // Slight tilt animation
        robotRef.current.rotation.z = Math.sin(time * 1.5) * 0.05;

        // Scale effect when hovered
        const targetScale = isHovered ? 1.1 : 1;
        robotRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

        // Eye glow animation
        if (eye.material instanceof THREE.MeshPhongMaterial) {
          const intensity = 0.3 + Math.sin(time * 4) * 0.2;
          eye.material.emissive.setHex(0x330000);
          eye.material.emissiveIntensity = intensity;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(robotGroup.children, true);
      
      setIsHovered(intersects.length > 0);
    };

    const handleClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(robotGroup.children, true);
      
      if (intersects.length > 0) {
        onRobotClick();
        
        // Fun click animation
        if (robotRef.current) {
          robotRef.current.rotation.y += Math.PI / 4;
          
          // Flash effect
          robotGroup.children.forEach(child => {
            if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshPhongMaterial) {
              const originalEmissive = child.material.emissive.clone();
              child.material.emissive.setHex(0x2563eb);
              setTimeout(() => {
                child.material.emissive.copy(originalEmissive);
              }, 200);
            }
          });
        }
      }
    };

    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('click', handleClick);
    renderer.domElement.style.cursor = 'pointer';

    // Cleanup
    return () => {
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('click', handleClick);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isHovered, onRobotClick]);

  return (
    <div 
      ref={mountRef} 
      className="fixed bottom-4 right-4 z-40 rounded-lg overflow-hidden easter-egg-glow"
      style={{ 
        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%)',
        padding: '10px'
      }}
    />
  );
};

export default ThreeJsRobot;