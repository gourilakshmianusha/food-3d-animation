import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Story3DCanvasProps {
  currentStage: number; // 0: Hearth, 1: Ingredients, 2: Flame Craft, 3: Plating
  progress: number; // 0 to 1 smooth scroll progress through story section
}

export const Story3DCanvas: React.FC<Story3DCanvasProps> = ({ currentStage, progress }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef(currentStage);
  const progressRef = useRef(progress);

  useEffect(() => {
    stageRef.current = currentStage;
    progressRef.current = progress;
  }, [currentStage, progress]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0c10, 0.08);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      50
    );
    camera.position.set(0, 1.2, 4.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    container.appendChild(renderer.domElement);

    // ==========================================
    // STORYTELLING 3D OBJECTS
    // ==========================================
    const storyGroup = new THREE.Group();
    scene.add(storyGroup);

    // 1. Central Hearth Stone & Cast Iron Skillet
    const skilletGeo = new THREE.CylinderGeometry(1.2, 1.05, 0.2, 48);
    const skilletMat = new THREE.MeshStandardMaterial({
      color: 0x18191c,
      roughness: 0.6,
      metalness: 0.85,
    });
    const skillet = new THREE.Mesh(skilletGeo, skilletMat);
    storyGroup.add(skillet);

    // Skillet Handle
    const handleGeo = new THREE.BoxGeometry(0.18, 0.1, 1.2);
    const handle = new THREE.Mesh(handleGeo, skilletMat);
    handle.position.set(0, 0.04, 1.6);
    storyGroup.add(handle);

    // Sizzling Prime Cut (Wagyu Steak)
    const steakGeo = new THREE.BoxGeometry(0.9, 0.22, 0.7);
    const steakMat = new THREE.MeshStandardMaterial({
      color: 0x3d1c14,
      roughness: 0.45,
      metalness: 0.1,
    });
    const steak = new THREE.Mesh(steakGeo, steakMat);
    steak.position.y = 0.14;
    storyGroup.add(steak);

    // Char Marks on Steak
    for (let i = -2; i <= 2; i++) {
      const charGeo = new THREE.BoxGeometry(0.04, 0.02, 0.65);
      const charMat = new THREE.MeshBasicMaterial({ color: 0x110906 });
      const charMark = new THREE.Mesh(charGeo, charMat);
      charMark.position.set(i * 0.16, 0.26, 0);
      charMark.rotation.y = 0.2;
      storyGroup.add(charMark);
    }

    // Melting Golden Herb Butter
    const butterGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.08, 16);
    const butterMat = new THREE.MeshStandardMaterial({
      color: 0xffd54f,
      roughness: 0.1,
      metalness: 0.1,
    });
    const butter = new THREE.Mesh(butterGeo, butterMat);
    butter.position.set(0.05, 0.28, 0);
    storyGroup.add(butter);

    // 2. Floating Exploded Ingredients in Orbit
    const ingredientsGroup = new THREE.Group();
    scene.add(ingredientsGroup);

    // Basil & Herb Leaves
    const herbShape = new THREE.Shape();
    herbShape.moveTo(0, 0);
    herbShape.quadraticCurveTo(0.12, 0.18, 0.08, 0.4);
    herbShape.quadraticCurveTo(-0.06, 0.25, 0, 0);
    const herbGeo = new THREE.ExtrudeGeometry(herbShape, { depth: 0.015, bevelEnabled: false });
    const herbMat = new THREE.MeshStandardMaterial({ color: 0x388e3c, roughness: 0.4 });

    const herbs: THREE.Mesh[] = [];
    for (let i = 0; i < 7; i++) {
      const mesh = new THREE.Mesh(herbGeo, herbMat);
      const angle = (i / 7) * Math.PI * 2;
      const radius = 1.6 + Math.random() * 0.5;
      mesh.position.set(Math.cos(angle) * radius, 0.5 + Math.random() * 0.8, Math.sin(angle) * radius);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      ingredientsGroup.add(mesh);
      herbs.push(mesh);
    }

    // Cracked Black Peppercorns
    const pepperGeo = new THREE.DodecahedronGeometry(0.045);
    const pepperMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.8 });
    const peppers: THREE.Mesh[] = [];
    for (let i = 0; i < 18; i++) {
      const mesh = new THREE.Mesh(pepperGeo, pepperMat);
      mesh.position.set((Math.random() - 0.5) * 2.8, Math.random() * 1.5 + 0.2, (Math.random() - 0.5) * 2.8);
      ingredientsGroup.add(mesh);
      peppers.push(mesh);
    }

    // Himalayan Sea Salt Crystals (Translucent White)
    const saltGeo = new THREE.BoxGeometry(0.05, 0.05, 0.05);
    const saltMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.8,
      opacity: 1,
      roughness: 0.1,
      ior: 1.5,
    });
    const salts: THREE.Mesh[] = [];
    for (let i = 0; i < 16; i++) {
      const mesh = new THREE.Mesh(saltGeo, saltMat);
      mesh.position.set((Math.random() - 0.5) * 2.6, Math.random() * 1.6 + 0.3, (Math.random() - 0.5) * 2.6);
      mesh.rotation.set(Math.random(), Math.random(), Math.random());
      ingredientsGroup.add(mesh);
      salts.push(mesh);
    }

    // Golden Truffle Flakes
    const truffleGeo = new THREE.CircleGeometry(0.12, 8);
    const truffleMat = new THREE.MeshStandardMaterial({
      color: 0x2e2016,
      roughness: 0.7,
      side: THREE.DoubleSide,
    });
    const truffles: THREE.Mesh[] = [];
    for (let i = 0; i < 8; i++) {
      const mesh = new THREE.Mesh(truffleGeo, truffleMat);
      mesh.position.set((Math.random() - 0.5) * 2.2, Math.random() * 1.2 + 0.4, (Math.random() - 0.5) * 2.2);
      ingredientsGroup.add(mesh);
      truffles.push(mesh);
    }

    // ==========================================
    // DYNAMIC EMBER LIGHTING
    // ==========================================
    const ambientLight = new THREE.AmbientLight(0xfff5eb, 0.8);
    scene.add(ambientLight);

    const hearthLight = new THREE.PointLight(0xff5722, 3.5, 8);
    hearthLight.position.set(0, -0.2, 0);
    scene.add(hearthLight);

    const keyLight = new THREE.DirectionalLight(0xffd54f, 2.5);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x80d8ff, 1.2);
    rimLight.position.set(-3, 2, -3);
    scene.add(rimLight);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const st = stageRef.current;
      const prog = progressRef.current;

      // Choreographed Camera & Object Movement based on stage + progress
      const targetCamY = 1.2 - st * 0.2 + Math.sin(elapsedTime * 0.4) * 0.05;
      const targetCamZ = 4.2 - st * 0.35;
      const targetCamX = Math.sin(prog * Math.PI) * 0.8;

      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.position.z += (targetCamZ - camera.position.z) * 0.05;
      camera.lookAt(0, 0.2, 0);

      // Skillet & Steak rotation
      storyGroup.rotation.y = elapsedTime * 0.35 + prog * Math.PI * 1.5;
      storyGroup.rotation.x = Math.sin(elapsedTime * 0.8) * 0.05 + 0.15;

      // Ingredients orbit expansion based on stage
      const expansion = st === 1 ? 1.6 : st === 2 ? 1.2 : 0.8;
      ingredientsGroup.rotation.y = -elapsedTime * 0.4;
      ingredientsGroup.scale.set(expansion, expansion, expansion);

      // Fluctuate hearth embers
      hearthLight.intensity = 2.8 + Math.sin(elapsedTime * 4.0) * 0.9;
      if (st === 2) {
        hearthLight.color.setHex(0xff3d00); // Intense flame
      } else if (st === 3) {
        hearthLight.color.setHex(0xffb300); // Golden plating
      } else {
        hearthLight.color.setHex(0xff5722);
      }

      // Herb floating wiggle
      herbs.forEach((h, idx) => {
        h.rotation.z = Math.sin(elapsedTime * 1.5 + idx) * 0.3;
        h.position.y += Math.sin(elapsedTime * 2 + idx) * 0.001;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      skilletGeo.dispose();
      skilletMat.dispose();
      steakGeo.dispose();
      steakMat.dispose();
      herbGeo.dispose();
      herbMat.dispose();
      pepperGeo.dispose();
      pepperMat.dispose();
      saltGeo.dispose();
      saltMat.dispose();
      truffleGeo.dispose();
      truffleMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative pointer-events-none select-none"
      style={{ minHeight: '440px' }}
    />
  );
};
