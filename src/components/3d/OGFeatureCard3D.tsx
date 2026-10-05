import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, RefreshCw, Eye, Download, Check, Copy, Share2, Flame, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface OGFeatureCard3DProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  detail?: string;
  ogImageUrl?: string;
  pageUrl?: string;
  interactive?: boolean;
}

export const OGFeatureCard3D: React.FC<OGFeatureCard3DProps> = ({
  title = 'THE EMBER TABLE',
  subtitle = 'Crafted for the Senses · Live Woodfire Gastronomy',
  badge = 'MICHELIN GUIDE 2026 · THREE KEYS',
  detail = 'Coastal California White Oak Coals · 72h Wild Ferment · Rare Cellar Allocations',
  ogImageUrl = '/og-home.png',
  pageUrl,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { showToast } = useApp();

  const [isFlipped, setIsFlipped] = useState(false);
  const [clocheLifted, setClocheLifted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showMetaDrawer, setShowMetaDrawer] = useState(false);

  // References for animation state
  const stateRef = useRef({
    targetRotationY: 0,
    currentRotationY: 0,
    targetTiltX: 0,
    targetTiltY: 0,
    currentTiltX: 0,
    currentTiltY: 0,
    clocheLiftAmount: 0,
    targetClocheLift: 0,
  });

  useEffect(() => {
    stateRef.current.targetRotationY = isFlipped ? Math.PI : 0;
  }, [isFlipped]);

  useEffect(() => {
    stateRef.current.targetClocheLift = clocheLifted ? 0.75 : 0;
  }, [clocheLifted]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 360;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08090b, 0.08);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xfff7e6, 1.2);
    scene.add(ambientLight);

    const goldKeyLight = new THREE.DirectionalLight(0xffd700, 2.5);
    goldKeyLight.position.set(3, 4, 5);
    scene.add(goldKeyLight);

    const emberFillLight = new THREE.PointLight(0xff5500, 3.0, 10);
    emberFillLight.position.set(-3, -2, 2);
    scene.add(emberFillLight);

    const rimLight = new THREE.PointLight(0xffeedd, 2.0, 8);
    rimLight.position.set(0, 3, -2);
    scene.add(rimLight);

    // 3. Create Canvas Textures for Front & Back
    const frontCanvas = document.createElement('canvas');
    frontCanvas.width = 1200;
    frontCanvas.height = 630;
    const fctx = frontCanvas.getContext('2d')!;

    const frontTexture = new THREE.CanvasTexture(frontCanvas);
    frontTexture.generateMipmaps = true;
    frontTexture.minFilter = THREE.LinearMipmapLinearFilter;

    // Helper: Draw standard UI overlay on canvas
    const drawOverlayText = () => {
      // Outer Gold Double Border with Corner Flourishes
      fctx.strokeStyle = '#d4af37';
      fctx.lineWidth = 3;
      fctx.strokeRect(36, 36, 1128, 558);

      fctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
      fctx.lineWidth = 1;
      fctx.strokeRect(44, 44, 1112, 542);

      // Corner Accents
      const drawCorner = (x: number, y: number, dx: number, dy: number) => {
        fctx.beginPath();
        fctx.moveTo(x + dx * 24, y);
        fctx.lineTo(x, y);
        fctx.lineTo(x, y + dy * 24);
        fctx.strokeStyle = '#fef08a';
        fctx.lineWidth = 3;
        fctx.stroke();
      };
      drawCorner(36, 36, 1, 1);
      drawCorner(1164, 36, -1, 1);
      drawCorner(36, 594, 1, -1);
      drawCorner(1164, 594, -1, -1);

      // Badge Pill
      fctx.fillStyle = '#171922';
      fctx.strokeStyle = 'rgba(212, 175, 55, 0.6)';
      fctx.lineWidth = 1.5;
      fctx.beginPath();
      const badgeWidth = Math.min(420, badge.length * 10 + 44);
      fctx.roundRect(84, 90, badgeWidth, 34, 17);
      fctx.fill();
      fctx.stroke();

      fctx.beginPath();
      fctx.arc(104, 107, 5, 0, Math.PI * 2);
      fctx.fillStyle = '#f59e0b';
      fctx.fill();

      fctx.font = 'bold 12px Cinzel, Georgia, serif';
      fctx.fillStyle = '#fef08a';
      fctx.fillText(badge, 120, 112);

      // Main Brand Title
      const titleGrad = fctx.createLinearGradient(84, 150, 700, 240);
      titleGrad.addColorStop(0, '#ffffff');
      titleGrad.addColorStop(0.3, '#fef08a');
      titleGrad.addColorStop(0.7, '#d4af37');
      titleGrad.addColorStop(1, '#ca8a04');
      fctx.fillStyle = titleGrad;
      fctx.font = 'bold 54px Cinzel, Georgia, serif';
      fctx.fillText(title.length > 28 ? title.slice(0, 28) + '...' : title, 84, 210);

      // Subtitle
      fctx.fillStyle = '#e2e8f0';
      fctx.font = '300 23px -apple-system, BlinkMacSystemFont, sans-serif';
      fctx.fillText(subtitle.length > 45 ? subtitle.slice(0, 45) + '...' : subtitle, 84, 260);

      fctx.fillStyle = '#94a3b8';
      fctx.font = '400 16px -apple-system, BlinkMacSystemFont, sans-serif';
      fctx.fillText(detail.length > 60 ? detail.slice(0, 60) + '...' : detail, 84, 298);

      // Badges
      const drawBadge = (x: number, text: string, gold = false) => {
        fctx.fillStyle = '#13161f';
        fctx.strokeStyle = gold ? '#d4af37' : 'rgba(255,255,255,0.15)';
        fctx.lineWidth = 1;
        fctx.beginPath();
        fctx.roundRect(x, 340, 160, 42, 8);
        fctx.fill();
        fctx.stroke();

        fctx.fillStyle = gold ? '#fef08a' : '#cbd5e1';
        fctx.font = '500 13px -apple-system, sans-serif';
        fctx.fillText(text, x + 16, 366);
      };
      drawBadge(84, '★ 4.9 Rated', true);
      drawBadge(256, 'Woodfire Line');
      drawBadge(428, 'Pier 7 San Francisco');

      // Footer Location & Domain
      fctx.strokeStyle = 'rgba(255,255,255,0.12)';
      fctx.lineWidth = 1;
      fctx.beginPath();
      fctx.moveTo(84, 440);
      fctx.lineTo(680, 440);
      fctx.stroke();

      fctx.fillStyle = '#d4af37';
      fctx.font = '500 15px -apple-system, sans-serif';
      fctx.fillText('Pier 7, The Embarcadero, San Francisco, CA', 84, 480);

      fctx.fillStyle = '#64748b';
      fctx.font = '400 13px monospace';
      fctx.fillText('1200x630 OpenGraph 2.0 · Three.js Animated Mesh', 84, 510);
    };

    // Draw fallback canvas
    const drawFallback = () => {
      const bgGrad = fctx.createRadialGradient(240, 500, 50, 600, 315, 750);
      bgGrad.addColorStop(0, '#592004');
      bgGrad.addColorStop(0.35, '#1e140d');
      bgGrad.addColorStop(0.8, '#0d0f14');
      bgGrad.addColorStop(1, '#08090b');
      fctx.fillStyle = bgGrad;
      fctx.fillRect(0, 0, 1200, 630);

      const clocheGlow = fctx.createRadialGradient(980, 300, 10, 980, 300, 260);
      clocheGlow.addColorStop(0, 'rgba(212, 175, 55, 0.35)');
      clocheGlow.addColorStop(0.5, 'rgba(212, 175, 55, 0.08)');
      clocheGlow.addColorStop(1, 'rgba(0,0,0,0)');
      fctx.fillStyle = clocheGlow;
      fctx.fillRect(700, 50, 500, 500);

      drawOverlayText();
    };

    // Render Front: check if ogImageUrl is provided
    drawFallback();

    if (ogImageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = ogImageUrl;
      img.onload = () => {
        // If image is a pre-rendered OG card (contains /og-)
        if (ogImageUrl.includes('/og-')) {
          fctx.drawImage(img, 0, 0, 1200, 630);
        } else {
          // If it's a dish photo or external photo:
          fctx.drawImage(img, 0, 0, 1200, 630);
          // Dark Chiaroscuro overlay
          const darkGrad = fctx.createLinearGradient(0, 0, 0, 630);
          darkGrad.addColorStop(0, 'rgba(8, 9, 11, 0.4)');
          darkGrad.addColorStop(0.5, 'rgba(8, 9, 11, 0.75)');
          darkGrad.addColorStop(1, 'rgba(8, 9, 11, 0.95)');
          fctx.fillStyle = darkGrad;
          fctx.fillRect(0, 0, 1200, 630);

          drawOverlayText();
        }
        frontTexture.needsUpdate = true;
      };
      img.onerror = () => {
        drawFallback();
        frontTexture.needsUpdate = true;
      };
    }

    // Back Face Canvas (Schema Verification & QR Code)
    const backCanvas = document.createElement('canvas');
    backCanvas.width = 1200;
    backCanvas.height = 630;
    const bctx = backCanvas.getContext('2d')!;

    const drawBack = () => {
      // Dark slate background
      bctx.fillStyle = '#0a0c10';
      bctx.fillRect(0, 0, 1200, 630);

      // Subtle grid
      bctx.strokeStyle = 'rgba(212, 175, 55, 0.08)';
      bctx.lineWidth = 1;
      for (let x = 0; x < 1200; x += 40) {
        bctx.beginPath();
        bctx.moveTo(x, 0);
        bctx.lineTo(x, 630);
        bctx.stroke();
      }

      // Border
      bctx.strokeStyle = '#d4af37';
      bctx.lineWidth = 2;
      bctx.strokeRect(36, 36, 1128, 558);

      // Header
      bctx.fillStyle = '#fef08a';
      bctx.font = 'bold 20px Cinzel, serif';
      bctx.fillText('SCHEMA.ORG VALIDATED · OPENGRAPH 2.0 PROTOCOL', 80, 95);

      bctx.fillStyle = '#94a3b8';
      bctx.font = '14px monospace';
      bctx.fillText('Canonical: https://theembertable.com/', 80, 130);
      bctx.fillText('Meta Type: Restaurant / FoodEstablishment / JSON-LD', 80, 155);

      // JSON-LD code preview box
      bctx.fillStyle = '#11141c';
      bctx.strokeStyle = 'rgba(255,255,255,0.1)';
      bctx.beginPath();
      bctx.roundRect(80, 185, 620, 360, 12);
      bctx.fill();
      bctx.stroke();

      bctx.fillStyle = '#38bdf8';
      bctx.font = '13px monospace';
      bctx.fillText('{', 105, 220);
      bctx.fillStyle = '#a78bfa';
      bctx.fillText('  "@context": "https://schema.org",', 105, 245);
      bctx.fillText('  "@type": "Restaurant",', 105, 270);
      bctx.fillStyle = '#fef08a';
      bctx.fillText('  "name": "The Ember Table",', 105, 295);
      bctx.fillText('  "servesCuisine": "Woodfire Gastronomy",', 105, 320);
      bctx.fillText('  "priceRange": "$$$$",', 105, 345);
      bctx.fillText('  "acceptsReservations": true,', 105, 370);
      bctx.fillStyle = '#34d399';
      bctx.fillText('  "aggregateRating": { "ratingValue": "4.9", "reviewCount": "1284" },', 105, 395);
      bctx.fillStyle = '#fb923c';
      bctx.fillText('  "telephone": "+1-415-555-0199"', 105, 420);
      bctx.fillStyle = '#38bdf8';
      bctx.fillText('}', 105, 445);

      bctx.fillStyle = '#64748b';
      bctx.font = '12px monospace';
      bctx.fillText('// Real-time synchronization with document.head', 105, 490);

      // Right Side: Procedural QR Code Mockup
      bctx.fillStyle = '#ffffff';
      bctx.beginPath();
      bctx.roundRect(770, 185, 340, 360, 16);
      bctx.fill();

      // Draw QR Pattern
      bctx.fillStyle = '#08090b';
      const qrStartX = 810;
      const qrStartY = 225;
      const cellSize = 10;
      // Corner squares
      const drawQRCorner = (cx: number, cy: number) => {
        bctx.fillRect(cx, cy, 70, 70);
        bctx.fillStyle = '#ffffff';
        bctx.fillRect(cx + 10, cy + 10, 50, 50);
        bctx.fillStyle = '#08090b';
        bctx.fillRect(cx + 20, cy + 20, 30, 30);
      };
      drawQRCorner(qrStartX, qrStartY);
      drawQRCorner(qrStartX + 190, qrStartY);
      drawQRCorner(qrStartX, qrStartY + 190);

      // Procedural pseudo-QR modules
      for (let r = 0; r < 26; r++) {
        for (let c = 0; c < 26; c++) {
          if ((r < 8 && c < 8) || (r < 8 && c > 17) || (r > 17 && c < 8)) continue;
          if ((r * 7 + c * 13 + (r % 3)) % 2 === 0) {
            bctx.fillRect(qrStartX + c * cellSize, qrStartY + r * cellSize, cellSize - 1, cellSize - 1);
          }
        }
      }

      bctx.fillStyle = '#08090b';
      bctx.font = 'bold 13px Cinzel, sans-serif';
      bctx.textAlign = 'center';
      bctx.fillText('SCAN TO EXPERIENCE', 940, 515);
      bctx.textAlign = 'left';
    };
    drawBack();

    const backTexture = new THREE.CanvasTexture(backCanvas);
    backTexture.generateMipmaps = true;
    backTexture.minFilter = THREE.LinearMipmapLinearFilter;

    // 4. Create Card 3D Geometry & Multi-Material Mesh
    // Aspect Ratio 1200 / 630 = ~1.905
    const cardWidth = 3.8;
    const cardHeight = 2.0;
    const cardDepth = 0.035;

    const cardGeometry = new THREE.BoxGeometry(cardWidth, cardHeight, cardDepth);

    // Beveled gold edge material
    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0x443005,
      emissiveIntensity: 0.3,
    });

    const frontMaterial = new THREE.MeshStandardMaterial({
      map: frontTexture,
      roughness: 0.25,
      metalness: 0.3,
      emissive: 0x110802,
      emissiveIntensity: 0.2,
    });

    const backMaterial = new THREE.MeshStandardMaterial({
      map: backTexture,
      roughness: 0.3,
      metalness: 0.2,
    });

    // Materials order: [right, left, top, bottom, front, back]
    const cardMaterials = [
      edgeMaterial,
      edgeMaterial,
      edgeMaterial,
      edgeMaterial,
      frontMaterial,
      backMaterial,
    ];

    const cardGroup = new THREE.Group();
    const cardMesh = new THREE.Mesh(cardGeometry, cardMaterials);
    cardGroup.add(cardMesh);
    scene.add(cardGroup);

    // 5. 3D Procedural Gold Cloche Floating on Front of Card
    const clocheGroup = new THREE.Group();
    clocheGroup.position.set(1.15, 0.05, 0.06); // Positioned above the motif area on the card

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      metalness: 0.95,
      roughness: 0.12,
      emissive: 0xb45309,
      emissiveIntensity: 0.25,
    });

    // Dome
    const domeGeom = new THREE.SphereGeometry(0.38, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const domeMesh = new THREE.Mesh(domeGeom, goldMaterial);
    domeMesh.rotation.x = Math.PI;
    domeMesh.position.y = 0.2;
    clocheGroup.add(domeMesh);

    // Handle Top
    const handleGeom = new THREE.SphereGeometry(0.065, 16, 16);
    const handleMesh = new THREE.Mesh(handleGeom, goldMaterial);
    handleMesh.position.y = 0.26;
    clocheGroup.add(handleMesh);

    // Platter Ring
    const platterGeom = new THREE.TorusGeometry(0.42, 0.025, 16, 48);
    const platterMesh = new THREE.Mesh(platterGeom, goldMaterial);
    platterMesh.rotation.x = Math.PI * 0.5;
    platterMesh.position.y = -0.18;
    clocheGroup.add(platterMesh);

    // Woodfire Coals Bed inside cloche
    const coalGeom = new THREE.CylinderGeometry(0.34, 0.34, 0.04, 24);
    const coalMat = new THREE.MeshStandardMaterial({
      color: 0x1a0f08,
      emissive: 0xff3b00,
      emissiveIntensity: 2.5,
    });
    const coalMesh = new THREE.Mesh(coalGeom, coalMat);
    coalMesh.position.y = -0.16;
    clocheGroup.add(coalMesh);

    cardGroup.add(clocheGroup);

    // 6. Floating Ember Particle Swarm
    const particleCount = 140;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    const scales = new Float32Array(particleCount);
    const angles = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      // Start around the cloche
      positions[idx] = 1.15 + (Math.random() - 0.5) * 0.6;
      positions[idx + 1] = -0.1 + Math.random() * 0.6;
      positions[idx + 2] = 0.1 + Math.random() * 0.5;

      speeds[i] = 0.008 + Math.random() * 0.018;
      scales[i] = 0.02 + Math.random() * 0.04;
      angles[i] = Math.random() * Math.PI * 2;
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xffaa00,
      size: 0.045,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeom, particleMat);
    cardGroup.add(particles);

    // 7. Mouse Interactivity & Parallax Tilt
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      stateRef.current.targetTiltX = -y * 0.28;
      stateRef.current.targetTiltY = x * 0.35;

      // Move keylight for specular foil shine
      goldKeyLight.position.x = 3 + x * 2;
      goldKeyLight.position.y = 4 + y * 2;
    };

    const handleMouseLeave = () => {
      stateRef.current.targetTiltX = 0;
      stateRef.current.targetTiltY = 0;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smooth Lerp for Flip and Parallax
      const s = stateRef.current;
      s.currentRotationY += (s.targetRotationY - s.currentRotationY) * 0.08;
      s.currentTiltX += (s.targetTiltX - s.currentTiltX) * 0.08;
      s.currentTiltY += (s.targetTiltY - s.currentTiltY) * 0.08;

      // Cloche Levitation Lerp
      s.clocheLiftAmount += (s.targetClocheLift - s.clocheLiftAmount) * 0.08;

      // Base Floating Motion
      const floatY = Math.sin(time * 1.6) * 0.05;
      const floatRotZ = Math.cos(time * 1.2) * 0.015;

      cardGroup.position.y = floatY;
      cardGroup.rotation.x = s.currentTiltX;
      cardGroup.rotation.y = s.currentRotationY + s.currentTiltY;
      cardGroup.rotation.z = floatRotZ;

      // Update Cloche Position & Lift
      clocheGroup.position.z = 0.06 + s.clocheLiftAmount * 0.8;
      clocheGroup.position.y = 0.05 + s.clocheLiftAmount * 0.4;
      clocheGroup.rotation.x = -s.clocheLiftAmount * 0.25;

      // Embers Particle Animation
      const posAttr = particleGeom.getAttribute('position') as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      const liftFactor = s.clocheLiftAmount > 0.05 ? 2.5 : 1.0;

      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        angles[i] += 0.03 * liftFactor;
        posArray[idx + 1] += speeds[i] * liftFactor;
        posArray[idx] += Math.sin(angles[i]) * 0.005;

        // Reset if too high
        if (posArray[idx + 1] > 1.2) {
          posArray[idx + 1] = -0.15;
          posArray[idx] = 1.15 + (Math.random() - 0.5) * 0.5;
          posArray[idx + 2] = 0.1 + Math.random() * 0.4;
        }
      }
      posAttr.needsUpdate = true;

      // Pulsing ember bed
      coalMat.emissiveIntensity = 2.0 + Math.sin(time * 4) * 0.8;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [title, subtitle, badge, detail, ogImageUrl, pageUrl]);

  const handleCopyLink = () => {
    const url = pageUrl || (typeof window !== 'undefined' ? window.location.href : 'https://theembertable.com');
    navigator.clipboard?.writeText(url);
    setIsCopied(true);
    showToast('Share Link Copied', 'URL ready for social sharing cards.', 'success');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleDownloadOG = () => {
    const targetSrc = ogImageUrl || '/og-home.png';
    const link = document.createElement('a');
    link.href = targetSrc;
    link.download = targetSrc.split('/').pop() || 'the-ember-table-og.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloading OG Image', `Saved 1200x630 social card (${link.download}).`, 'success');
  };

  return (
    <div className="relative w-full rounded-2xl glass-dark border border-gold-subtle overflow-hidden p-4 sm:p-6 shadow-2xl">
      {/* Top Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-widest text-[#d4af37] font-semibold">
            OpenGraph 2.0 · 3D Interactive Feature Card
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400">1200 × 630 PNG / Three.js Mesh</span>
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div className="relative w-full h-80 sm:h-96 my-2 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing bg-gradient-to-b from-[#0e1017] to-[#07080a]">
        <div ref={containerRef} className="w-full h-full" />

        {/* Floating Instructions Pill */}
        <div className="absolute bottom-3 left-4 text-[10px] font-mono text-slate-400 bg-black/60 backdrop-blur px-2.5 py-1 rounded border border-white/5 pointer-events-none">
          Move cursor to tilt 3D foil · Toggle Cloche or Flip below
        </div>

        {/* Current State Pill */}
        <div className="absolute top-3 right-4 flex items-center gap-1.5 text-[10px] font-mono text-[#fef08a] bg-black/70 backdrop-blur px-2.5 py-1 rounded border border-[#d4af37]/30">
          <Sparkles className="w-3 h-3 text-[#d4af37]" />
          <span>{isFlipped ? 'Back: Schema & QR' : clocheLifted ? 'Hearth Embers Unleashed' : 'Front: Social Share Card'}</span>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle Cloche */}
          <button
            onClick={() => setClocheLifted(!clocheLifted)}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
              clocheLifted
                ? 'bg-[#d4af37] text-[#0b0c10] border-[#d4af37]'
                : 'glass-card text-white hover:text-[#d4af37] border-white/10'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{clocheLifted ? 'Close Cloche' : 'Awaken Embers & Lift Cloche'}</span>
          </button>

          {/* Flip Card */}
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-3.5 py-2 glass-card hover:bg-white/10 text-white hover:text-[#d4af37] text-xs font-semibold rounded-lg border border-white/10 transition-all flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isFlipped ? 'View Front Card' : 'Inspect Schema & QR (Flip)'}</span>
          </button>

          {/* Toggle Meta Inspector */}
          <button
            onClick={() => setShowMetaDrawer(!showMetaDrawer)}
            className="px-3 py-2 text-xs text-slate-400 hover:text-white glass-dark rounded-lg border border-white/5 transition-all flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showMetaDrawer ? 'Hide Meta Tags' : 'View Head Tags'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-medium rounded-lg border border-white/10 transition-all flex items-center gap-1.5"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Copied' : 'Copy URL'}</span>
          </button>

          {/* Download 1200x630 OG */}
          <button
            onClick={handleDownloadOG}
            className="px-3.5 py-2 bg-[#d4af37] hover:bg-[#e5be49] text-[#0b0c10] text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save OG Card</span>
          </button>
        </div>
      </div>

      {/* Meta Drawer */}
      {showMetaDrawer && (
        <div className="mt-4 pt-4 border-t border-white/10 text-xs font-mono space-y-2 text-slate-300 animate-in fade-in duration-300">
          <div className="flex items-center justify-between text-slate-400 pb-1">
            <span className="uppercase font-bold tracking-wider text-[#d4af37] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Live Head Metadata Active
            </span>
            <span className="text-[10px]">Verified against Google & Twitter Card Bot specs</span>
          </div>

          <div className="bg-black/50 p-3 rounded-lg border border-white/5 space-y-1.5 overflow-x-auto text-[11px] text-slate-300">
            <div><span className="text-emerald-400">&lt;title&gt;</span>The Ember Table — Live Woodfire Fine Dining &amp; Reserve Cellar<span className="text-emerald-400">&lt;/title&gt;</span></div>
            <div><span className="text-amber-400">&lt;meta name="description"</span> content="Experience Michelin-caliber woodfire gastronomy, tableside cloche reveals..."<span className="text-amber-400">&gt;</span></div>
            <div><span className="text-sky-400">&lt;meta property="og:image"</span> content="https://theembertable.com/og-feature-image.png"<span className="text-sky-400">&gt;</span></div>
            <div><span className="text-sky-400">&lt;meta property="og:image:width"</span> content="1200"<span className="text-sky-400">&gt;</span> <span className="text-sky-400">&lt;meta property="og:image:height"</span> content="630"<span className="text-sky-400">&gt;</span></div>
            <div><span className="text-purple-400">&lt;meta name="twitter:card"</span> content="summary_large_image"<span className="text-purple-400">&gt;</span></div>
            <div><span className="text-slate-400">&lt;script type="application/ld+json"&gt;</span> &#123; "@context": "https://schema.org", "@type": "Restaurant", ... &#125; <span className="text-slate-400">&lt;/script&gt;</span></div>
          </div>
        </div>
      )}
    </div>
  );
};
