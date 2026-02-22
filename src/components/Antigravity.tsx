/* eslint-disable react/no-unknown-property */
"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
import * as THREE from "three";

type AntigravityProps = {
  count?: number;
  magnetRadius?: number;
  ringRadius?: number;
  waveSpeed?: number;
  waveAmplitude?: number;
  particleSize?: number;
  lerpSpeed?: number;
  color?: string;
  autoAnimate?: boolean;
  particleVariance?: number;
  rotationSpeed?: number;
  depthFactor?: number;
  pulseSpeed?: number;
  particleShape?: "capsule" | "sphere" | "box" | "tetrahedron";
  fieldStrength?: number;
  followMouse?: boolean;
  mouseStrength?: number; // NOW USED
  motionIntensity?: number;
};

const AntigravityInner: React.FC<AntigravityProps> = ({
  count = 150,
  magnetRadius = 3,
  ringRadius = 3,
  waveSpeed = 0.08,
  waveAmplitude = 0.4,
  particleSize = 0.25, // SMALL particles
  lerpSpeed = 0.015, // smooooth movement
  color = "#4A4AFF",
  autoAnimate = true,
  particleVariance = 0.5,
  rotationSpeed = 0.05,
  depthFactor = 0.8,
  pulseSpeed = 1,
  particleShape = "capsule",
  fieldStrength = 4,
  followMouse = true,
  mouseStrength = 0.6, // CURSOR FOLLOW WORKS NOW
  motionIntensity = 0.4,
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastMouseMoveTime = useRef(0);
  const virtualMouse = useRef({ x: 0, y: 0 });

  // Generate particles
  const particles = useMemo(() => {
    const temp = [];
    const width = viewport.width || 100;
    const height = viewport.height || 100;

    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const speed = 0.005 + Math.random() * 0.01; // smoother, slower
      const x = (Math.random() - 0.5) * width;
      const y = (Math.random() - 0.5) * height;
      const z = (Math.random() - 0.5) * 10;

      temp.push({
        t,
        speed,
        mx: x,
        my: y,
        mz: z,
        cx: x,
        cy: y,
        cz: z,
        random: (Math.random() - 0.5) * 2,
      });
    }
    return temp;
  }, [count, viewport.width, viewport.height]);

  // Animation loop
  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const { viewport: v, pointer: m } = state;

    // Track mouse motion
    const mouseDist = Math.hypot(
      m.x - lastMousePos.current.x,
      m.y - lastMousePos.current.y,
    );

    if (mouseDist > 0.0001) {
      lastMouseMoveTime.current = Date.now();
      lastMousePos.current = { x: m.x, y: m.y };
    }

    // Target for particles
    let destX = (m.x * v.width) / 2;
    let destY = (m.y * v.height) / 2;

    // Auto animation when mouse is idle
    if (autoAnimate && Date.now() - lastMouseMoveTime.current > 2000) {
      const t = state.clock.getElapsedTime();
      destX = Math.sin(t * 0.3) * (v.width / 5);
      destY = Math.cos(t * 0.4) * (v.height / 5);
    }

    // Smooth mouse
    const smoothFactor = 0.05;
    virtualMouse.current.x += (destX - virtualMouse.current.x) * smoothFactor;
    virtualMouse.current.y += (destY - virtualMouse.current.y) * smoothFactor;

    const targetX = virtualMouse.current.x * mouseStrength;
    const targetY = virtualMouse.current.y * mouseStrength;

    const globalRotation = state.clock.getElapsedTime() * rotationSpeed;

    // Animate each particle
    particles.forEach((p, i) => {
      p.t += p.speed;

      // Projection for depth
      const proj = 1 - p.cz / 40;
      const px = targetX * proj;
      const py = targetY * proj;

      const dx = p.mx - px;
      const dy = p.my - py;
      const dist = Math.hypot(dx, dy);

      let tx = p.mx;
      let ty = p.my;
      let tz = p.mz * depthFactor;

      if (followMouse && dist < magnetRadius) {
        const angle = Math.atan2(dy, dx) + globalRotation;

        const wave = Math.sin(p.t * waveSpeed + angle) * waveAmplitude * 0.5;
        const offset = p.random * (3 / (fieldStrength + 1));

        const r = ringRadius + wave + offset;

        tx = px + r * Math.cos(angle);
        ty = py + r * Math.sin(angle);
        tz = p.mz * depthFactor + Math.sin(p.t) * waveAmplitude;
      }

      // Smooth follow
      p.cx += (tx - p.cx) * lerpSpeed;
      p.cy += (ty - p.cy) * lerpSpeed;
      p.cz += (tz - p.cz) * lerpSpeed;

      // Apply transform
      dummy.position.set(p.cx, p.cy, p.cz);

      dummy.lookAt(px, py, p.cz);
      dummy.rotateX(Math.PI / 2);

      // Soft small scale
      const scale =
        (0.3 + Math.sin(p.t * pulseSpeed) * 0.1 * particleVariance) *
        particleSize;

      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();

      mesh.setMatrixAt(i, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {particleShape === "capsule" && (
        <capsuleGeometry args={[0.08, 0.25, 4, 8]} />
      )}
      {particleShape === "sphere" && <sphereGeometry args={[0.12, 16, 16]} />}
      {particleShape === "box" && <boxGeometry args={[0.12, 0.12, 0.12]} />}
      {particleShape === "tetrahedron" && <tetrahedronGeometry args={[0.12]} />}
      <meshBasicMaterial color={color} />
    </instancedMesh>
  );
};

const Antigravity: React.FC<AntigravityProps> = (props) => {
  return (
    <Canvas camera={{ position: [0, 0, 40], fov: 35 }}>
      <AntigravityInner {...props} />
    </Canvas>
  );
};

export default Antigravity;
