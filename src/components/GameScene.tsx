/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Environment, ContactShadows, Float } from '@react-three/drei';
import { Hand } from './Hand';
import { Choice, GameState } from '../types';

interface GameSceneProps {
  playerChoice: Choice;
  aiChoice: Choice;
  gameState: GameState;
}

function ResponsiveScene({ playerChoice, aiChoice, gameState }: GameSceneProps) {
  const { viewport } = useThree();
  const isShaking = gameState === GameState.SHAKING;
  const isRevealing = gameState === GameState.REVEALING || gameState === GameState.RESULT;

  // Granular responsive calculation for perfect centering
  const aspect = viewport.width / viewport.height;
  const isMobile = aspect < 1;
  
  // Calculate scale and spacing based on available viewport width
  const handScale = useMemo(() => {
    if (isMobile) {
      return (viewport.width / 4) * 0.9;
    }
    return Math.min(1.2, (viewport.width / 12) * 1.3);
  }, [viewport.width, isMobile]);

  const handSpacing = useMemo(() => {
    if (isMobile) {
      return viewport.width * 0.22;
    }
    return Math.min(2.2, viewport.width * 0.13);
  }, [viewport.width, isMobile]);

  return (
    <group scale={handScale} position={[0, isMobile ? 0.5 : 0, 0]}>
      {/* Player Hand */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
        <group position={[-handSpacing, 0, 0]}>
          <Hand choice={playerChoice} shaking={isShaking} />
        </group>
      </Float>

      {/* AI Hand */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
        <group position={[handSpacing, 0, 0]}>
          <Hand 
            choice={isRevealing ? aiChoice : Choice.ROCK} 
            isAI 
            shaking={isShaking} 
          />
        </group>
      </Float>
    </group>
  );
}

export function GameScene(props: GameSceneProps) {
  return (
    <div className="w-full h-full bg-[#0a0a0a] relative overflow-hidden">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={2} castShadow />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} />
        
        {/* Rim Lights for silhouette definition */}
        <pointLight position={[0, 5, -5]} intensity={2} color="#ffffff" />
        <pointLight position={[-5, 0, -2]} intensity={1} color="#fb923c" />
        <pointLight position={[5, 0, -2]} intensity={1} color="#3b82f6" />
        
        <Suspense fallback={null}>
          <Environment preset="studio" />
          
          <ResponsiveScene {...props} />

          <ContactShadows 
            position={[0, -2, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2.5} 
            far={4.5} 
          />
        </Suspense>
      </Canvas>
      
      {/* Dynamic Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-48 md:w-64 h-48 md:h-64 bg-orange-500/10 md:bg-orange-500/20 blur-[80px] md:blur-[120px]" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 translate-x-1/2 w-48 md:w-64 h-48 md:h-64 bg-blue-500/5 md:bg-blue-500/10 blur-[80px] md:blur-[120px]" />
      </div>
    </div>
  );
}
