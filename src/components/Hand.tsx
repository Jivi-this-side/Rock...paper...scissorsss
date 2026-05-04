import React, { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { SkeletonUtils } from "three-stdlib";
import { Choice } from "../types";

interface HandProps {
  choice: Choice;
  isAI?: boolean;
  shaking?: boolean;
}

export function Hand({ choice = Choice.ROCK, isAI = false, shaking = false }: HandProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // ✅ ONE MODEL ONLY
  const { scene } = useGLTF("/oopo_hand.glb");
  const cloned = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  // =========================
  // BONES
  // =========================
  const bones = useMemo(() => {
    const map: Record<string, THREE.Bone[]> = {
      thumb: [],
      index: [],
      middle: [],
      ring: [],
      pinky: [],
    };

    cloned.traverse((obj) => {
      if (obj instanceof THREE.Bone) {
        const n = obj.name.toLowerCase();

        if (n.includes("thumb")) map.thumb.push(obj);
        else if (n.includes("index")) map.index.push(obj);
        else if (n.includes("middle")) map.middle.push(obj);
        else if (n.includes("ring")) map.ring.push(obj);
        else if (n.includes("pinky") || n.includes("little")) map.pinky.push(obj);
      }
    });

    Object.values(map).forEach((arr) =>
      arr.sort((a, b) => a.name.localeCompare(b.name))
    );

    return map;
  }, [cloned]);

  // =========================
  // MATERIAL
  // =========================
  useEffect(() => {
    cloned.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.material = new THREE.MeshStandardMaterial({
          // AI gets a darker skin tone, Player gets a lighter one
          color: isAI ? "#8d5524" : "#ffdbac", 
          roughness: 0.5,
          metalness: 0.05,
        });
      }
    });
  }, [cloned, isAI]);

  // =========================
  // ✅ CURL (ONE AXIS ONLY)
  // =========================
  const curl = (bone: THREE.Bone, target: number, speed = 0.15) => {
    bone.rotation.x = THREE.MathUtils.lerp(
      bone.rotation.x,
      target,
      speed
    );
  };

  // =========================
  // POSES
  // =========================
  const poses: Record<string, Record<string, number[]>> = {
    [Choice.ROCK]: {
      thumb: [1.0, 0.7, 0.5],
      index: [1.4, 1.4, 1.4],
      middle: [1.4, 1.4, 1.4],
      ring: [1.4, 1.4, 1.4],
      pinky: [1.4, 1.4, 1.4],
    },
    [Choice.PAPER]: {
      thumb: [0.2, 0, 0],
      index: [0, 0, 0],
      middle: [0, 0, 0],
      ring: [0, 0, 0],
      pinky: [0, 0, 0],
    },
    [Choice.SCISSORS]: {
      thumb: [1.0, 1.0, 1.0],
      index: [0, 0, 0],
      middle: [0, 0, 0],
      ring: [1.4, 1.4, 1.4],
      pinky: [1.4, 1.4, 1.4],
    },
    [Choice.NONE]: {
      thumb: [0, 0, 0],
      index: [0.2, 0.2, 0.2],
      middle: [0.2, 0.2, 0.2],
      ring: [0.2, 0.2, 0.2],
      pinky: [0.2, 0.2, 0.2],
    }
  };

  // =========================
  // ANIMATION
  // =========================
  useFrame((state) => {
    if (!groupRef.current) return;

    const t = state.clock.getElapsedTime();

    // SHAKE
    if (shaking) {
      const motion = Math.sin(t * 18);
      groupRef.current.position.y = motion * 0.25;
      groupRef.current.rotation.z = motion * 0.1;
    } else {
      groupRef.current.position.y *= 0.9;
      groupRef.current.rotation.z *= 0.9;
    }

    const currentPose =
      shaking ? poses[Choice.ROCK] : (poses[choice] || poses[Choice.ROCK]);

    Object.entries(bones).forEach(([finger, fingerBones]) => {
      fingerBones.forEach((bone, i) => {
        const target = currentPose[finger]?.[i] ?? 0;
        curl(bone, target);
      });
    });

    // Responsive Positioning: Adjust X position based on viewport width
    const responsiveX = isAI ? viewport.width * 0.18 : -viewport.width * 0.18;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, responsiveX, 0.1);
  });

  // =========================
  // 🔥 ORIENTATION + MIRROR
  // =========================
  return (
    <group
      ref={groupRef}
      rotation={[
        Math.PI / 2,        // face downward
        isAI ? Math.PI : 0, // face each other
        0,
      ]}
      scale={[
        isAI ? 0.75 : -0.75, // 🔥 mirror player hand
        1,
        1,
      ]}
    >
      <primitive object={cloned} scale={1.25} />
    </group>
  );
}

useGLTF.preload("/oopo_hand.glb");
