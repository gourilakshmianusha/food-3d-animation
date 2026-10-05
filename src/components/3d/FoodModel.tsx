import * as THREE from 'three';

export type FoodType =
  | 'cloche'
  | 'steak'
  | 'burger'
  | 'pizza'
  | 'pasta'
  | 'dessert'
  | 'beverage'
  | 'coffee'
  | 'cake'
  | 'wine'
  | 'plate'
  | 'cutlery';

export function createFoodModel(type: FoodType): THREE.Group {
  const group = new THREE.Group();

  // Shared physically based materials
  const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.92,
    roughness: 0.16,
    envMapIntensity: 1.8,
  });

  const porcelainMaterial = new THREE.MeshStandardMaterial({
    color: 0x14161a,
    roughness: 0.28,
    metalness: 0.65,
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 0.94,
    opacity: 1,
    transparent: true,
    roughness: 0.04,
    ior: 1.52,
  });

  switch (type) {
    case 'cloche': {
      // Charger Plate
      const plate = new THREE.Mesh(
        new THREE.CylinderGeometry(1.6, 1.4, 0.1, 48),
        porcelainMaterial
      );
      plate.position.y = -0.15;
      group.add(plate);

      // Gold Rim
      const rim = new THREE.Mesh(new THREE.TorusGeometry(1.58, 0.035, 16, 48), goldMaterial);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = -0.09;
      group.add(rim);

      // Cloche Dome
      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(1.05, 48, 28, 0, Math.PI * 2, 0, Math.PI / 2),
        goldMaterial
      );
      dome.position.y = -0.09;
      group.add(dome);

      // Base band
      const baseBand = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.05, 16, 48), goldMaterial);
      baseBand.rotation.x = Math.PI / 2;
      baseBand.position.y = -0.09;
      group.add(baseBand);

      // Handle Stem & Finial Ball
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.07, 0.22, 16), goldMaterial);
      stem.position.y = 1.05;
      group.add(stem);

      const finial = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), goldMaterial);
      finial.position.y = 1.2;
      group.add(finial);
      break;
    }

    case 'steak': {
      // Plate Plinth
      const plate = new THREE.Mesh(
        new THREE.CylinderGeometry(1.5, 1.35, 0.08, 48),
        porcelainMaterial
      );
      plate.position.y = -0.12;
      group.add(plate);

      // Seared Wagyu Cut
      const steakMat = new THREE.MeshStandardMaterial({
        color: 0x3d1a12,
        roughness: 0.5,
        metalness: 0.12,
      });
      const steak = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.28, 0.9), steakMat);
      steak.position.y = 0.06;
      group.add(steak);

      // Grill char marks
      const charMat = new THREE.MeshBasicMaterial({ color: 0x140704 });
      for (let i = -2; i <= 2; i++) {
        const charMark = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 0.82), charMat);
        charMark.position.set(i * 0.22, 0.21, 0);
        charMark.rotation.y = 0.25;
        group.add(charMark);
      }

      // Melting Herb Butter Quenelle
      const butterMat = new THREE.MeshStandardMaterial({
        color: 0xffd54f,
        roughness: 0.2,
      });
      const butter = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.1, 16), butterMat);
      butter.position.set(0.1, 0.24, 0.05);
      group.add(butter);

      // Fresh Rosemary sprig
      const herbMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.4 });
      const stemMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.6, 8), herbMat);
      stemMesh.position.set(-0.2, 0.22, -0.1);
      stemMesh.rotation.z = Math.PI / 3;
      group.add(stemMesh);
      break;
    }

    case 'burger': {
      const bunMat = new THREE.MeshStandardMaterial({ color: 0xdb9645, roughness: 0.55 });
      const pattyMat = new THREE.MeshStandardMaterial({ color: 0x3a1e14, roughness: 0.8 });
      const cheeseMat = new THREE.MeshStandardMaterial({ color: 0xffa000, roughness: 0.3 });
      const lettuceMat = new THREE.MeshStandardMaterial({ color: 0x4caf50, roughness: 0.45 });

      // Bottom bun
      const bBun = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.85, 0.35, 32), bunMat);
      bBun.position.y = -0.4;
      group.add(bBun);

      // Patty 1
      const patty1 = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.92, 0.22, 32), pattyMat);
      patty1.position.y = -0.15;
      group.add(patty1);

      // Melted Cheese Square
      const cheese = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.06, 1.65), cheeseMat);
      cheese.position.y = -0.01;
      cheese.rotation.y = 0.4;
      group.add(cheese);

      // Patty 2
      const patty2 = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.92, 0.22, 32), pattyMat);
      patty2.position.y = 0.14;
      group.add(patty2);

      // Lettuce Ring
      const lettuce = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.09, 12, 32), lettuceMat);
      lettuce.rotation.x = Math.PI / 2;
      lettuce.position.y = 0.28;
      group.add(lettuce);

      // Top Dome Bun
      const tBun = new THREE.Mesh(
        new THREE.SphereGeometry(0.92, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2),
        bunMat
      );
      tBun.position.y = 0.32;
      group.add(tBun);

      // Sesame Seeds
      const seedGeo = new THREE.ConeGeometry(0.02, 0.04, 6);
      const seedMat = new THREE.MeshStandardMaterial({ color: 0xfff3e0, roughness: 0.5 });
      for (let i = 0; i < 30; i++) {
        const seed = new THREE.Mesh(seedGeo, seedMat);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * (Math.PI / 3);
        seed.position.set(
          0.92 * Math.sin(phi) * Math.cos(theta),
          0.32 + 0.92 * Math.cos(phi),
          0.92 * Math.sin(phi) * Math.sin(theta)
        );
        seed.rotation.x = phi;
        seed.rotation.y = theta;
        group.add(seed);
      }
      break;
    }

    case 'pizza': {
      // Crust Torus
      const crustMat = new THREE.MeshStandardMaterial({ color: 0xc48c48, roughness: 0.7 });
      const crust = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.16, 16, 48), crustMat);
      crust.rotation.x = Math.PI / 2;
      group.add(crust);

      // Melted Cheese & San Marzano Sauce
      const baseMat = new THREE.MeshStandardMaterial({ color: 0xffbe76, roughness: 0.35 });
      const base = new THREE.Mesh(new THREE.CylinderGeometry(1.22, 1.22, 0.08, 48), baseMat);
      group.add(base);

      // Center Fresh Burrata
      const burrataMat = new THREE.MeshStandardMaterial({ color: 0xfbfbfb, roughness: 0.2 });
      const burrata = new THREE.Mesh(new THREE.SphereGeometry(0.38, 24, 18), burrataMat);
      burrata.position.y = 0.24;
      group.add(burrata);

      // Basil Leaves
      const leafMat = new THREE.MeshStandardMaterial({
        color: 0x2e7d32,
        roughness: 0.4,
        side: THREE.DoubleSide,
      });
      for (let i = 0; i < 6; i++) {
        const leaf = new THREE.Mesh(new THREE.CircleGeometry(0.14, 8), leafMat);
        const angle = (i / 6) * Math.PI * 2 + 0.2;
        leaf.position.set(Math.cos(angle) * 0.75, 0.06, Math.sin(angle) * 0.75);
        leaf.rotation.x = -Math.PI / 2;
        leaf.rotation.z = Math.random();
        group.add(leaf);
      }
      break;
    }

    case 'pasta': {
      // Wide pasta bowl
      const bowl = new THREE.Mesh(
        new THREE.CylinderGeometry(1.4, 0.9, 0.4, 48),
        porcelainMaterial
      );
      bowl.position.y = -0.15;
      group.add(bowl);

      // Swirled Tagliolini nest (toruses)
      const pastaMat = new THREE.MeshStandardMaterial({ color: 0xf5cd79, roughness: 0.35 });
      for (let i = 0; i < 4; i++) {
        const loop = new THREE.Mesh(
          new THREE.TorusGeometry(0.6 - i * 0.1, 0.07, 12, 32),
          pastaMat
        );
        loop.rotation.x = Math.PI / 2 + Math.random() * 0.2;
        loop.rotation.y = Math.random() * 0.3;
        loop.position.y = 0.05 + i * 0.08;
        group.add(loop);
      }

      // Shaved Black Truffle flakes
      const truffleMat = new THREE.MeshStandardMaterial({
        color: 0x241812,
        roughness: 0.8,
        side: THREE.DoubleSide,
      });
      for (let i = 0; i < 9; i++) {
        const flake = new THREE.Mesh(new THREE.CircleGeometry(0.11, 7), truffleMat);
        flake.position.set((Math.random() - 0.5) * 0.8, 0.32 + Math.random() * 0.08, (Math.random() - 0.5) * 0.8);
        flake.rotation.set(Math.random(), Math.random(), Math.random());
        group.add(flake);
      }
      break;
    }

    case 'dessert': {
      // Charcoal slate base
      const slate = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.08, 2.0), porcelainMaterial);
      slate.position.y = -0.38;
      group.add(slate);

      // Valrhona Chocolate Sphere
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0x29160e,
        roughness: 0.18,
        metalness: 0.08,
      });
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.72, 48, 36), sphereMat);
      sphere.position.y = 0.32;
      group.add(sphere);

      // 24k Gold leaf flakes
      const goldFlakeMat = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 0.95,
        roughness: 0.15,
        side: THREE.DoubleSide,
      });
      for (let i = 0; i < 9; i++) {
        const flake = new THREE.Mesh(new THREE.CircleGeometry(0.09, 6), goldFlakeMat);
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = 0.73;
        flake.position.set(
          r * Math.sin(phi) * Math.cos(theta),
          0.32 + r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        );
        flake.lookAt(0, 0.32, 0);
        group.add(flake);
      }
      break;
    }

    case 'beverage': {
      // Heavy crystal rocks glass
      const glass = new THREE.Mesh(
        new THREE.CylinderGeometry(0.65, 0.55, 1.25, 32, 1, true),
        glassMaterial
      );
      group.add(glass);

      // Amber Bourbon/Rye Whiskey
      const liquidMat = new THREE.MeshStandardMaterial({
        color: 0xd97706,
        roughness: 0.1,
        transparent: true,
        opacity: 0.85,
      });
      const liquid = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.52, 0.72, 32), liquidMat);
      liquid.position.y = -0.22;
      group.add(liquid);

      // Carved Ice Sphere
      const ice = new THREE.Mesh(new THREE.SphereGeometry(0.38, 24, 24), glassMaterial);
      ice.position.y = -0.04;
      group.add(ice);
      break;
    }

    case 'coffee': {
      // Ceramic cup
      const cupMat = new THREE.MeshStandardMaterial({ color: 0x22262d, roughness: 0.35 });
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.45, 0.8, 32), cupMat);
      group.add(cup);

      // Cup Handle
      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 16, 24), cupMat);
      handle.position.set(0.68, 0, 0);
      handle.rotation.y = Math.PI / 2;
      group.add(handle);

      // Coffee Liquid & Crema
      const cremaMat = new THREE.MeshStandardMaterial({ color: 0xc89658, roughness: 0.25 });
      const crema = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.04, 32), cremaMat);
      crema.position.y = 0.34;
      group.add(crema);

      // Saucer
      const saucer = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 0.9, 0.06, 32), cupMat);
      saucer.position.y = -0.42;
      group.add(saucer);
      break;
    }

    case 'cake': {
      // Celebratory Tiered Cake
      const spongeMat = new THREE.MeshStandardMaterial({ color: 0xfff0db, roughness: 0.4 });
      const icingMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.2 });

      const bottomTier = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.45, 36), icingMat);
      bottomTier.position.y = -0.2;
      group.add(bottomTier);

      const topTier = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.4, 32), icingMat);
      topTier.position.y = 0.22;
      group.add(topTier);

      // Candle
      const candle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.35, 16),
        new THREE.MeshStandardMaterial({ color: 0xd4af37 })
      );
      candle.position.y = 0.6;
      group.add(candle);

      // Candle Flame
      const flameMat = new THREE.MeshBasicMaterial({ color: 0xff9800 });
      const flame = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), flameMat);
      flame.scale.set(0.6, 1.6, 0.6);
      flame.position.y = 0.82;
      group.add(flame);
      break;
    }

    case 'wine': {
      // Stem Glass
      const bowl = new THREE.Mesh(
        new THREE.SphereGeometry(0.48, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.75),
        glassMaterial
      );
      bowl.position.y = 0.35;
      group.add(bowl);

      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.75, 16), glassMaterial);
      stem.position.y = -0.15;
      group.add(stem);

      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.03, 24), glassMaterial);
      foot.position.y = -0.52;
      group.add(foot);

      // Ruby Wine
      const wineMat = new THREE.MeshStandardMaterial({
        color: 0x72091c,
        roughness: 0.1,
        transparent: true,
        opacity: 0.85,
      });
      const wine = new THREE.Mesh(new THREE.SphereGeometry(0.44, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.45), wineMat);
      wine.position.y = 0.32;
      group.add(wine);
      break;
    }

    case 'plate': {
      const plate = new THREE.Mesh(
        new THREE.CylinderGeometry(1.6, 1.4, 0.09, 48),
        porcelainMaterial
      );
      group.add(plate);

      const rim = new THREE.Mesh(new THREE.TorusGeometry(1.58, 0.03, 16, 48), goldMaterial);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 0.04;
      group.add(rim);
      break;
    }

    case 'cutlery': {
      // Fork
      const forkStem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.4, 12), goldMaterial);
      forkStem.position.set(-0.4, 0, 0);
      group.add(forkStem);

      const forkHead = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.35, 0.03), goldMaterial);
      forkHead.position.set(-0.4, 0.75, 0);
      group.add(forkHead);

      // Knife
      const knifeHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.3, 12), goldMaterial);
      knifeHandle.position.set(0.4, 0, 0);
      group.add(knifeHandle);

      const knifeBlade = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.6, 0.02), goldMaterial);
      knifeBlade.position.set(0.4, 0.7, 0);
      group.add(knifeBlade);
      break;
    }
  }

  return group;
}
