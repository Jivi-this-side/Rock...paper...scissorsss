/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, RefreshCw, Trophy, Shield, Zap } from "lucide-react";
import confetti from "canvas-confetti";
import { GameScene } from "./components/GameScene";
import { Choice, GameState, GameResult } from "./types";

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [playerChoice, setPlayerChoice] = useState<Choice>(Choice.NONE);
  const [aiChoice, setAiChoice] = useState<Choice>(Choice.NONE);
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [lastResult, setLastResult] = useState<"player" | "ai" | "draw" | null>(
    null
  );

  const determineWinner = (p: Choice, a: Choice): "player" | "ai" | "draw" => {
    if (p === a) return "draw";
    if (
      (p === Choice.ROCK && a === Choice.SCISSORS) ||
      (p === Choice.PAPER && a === Choice.ROCK) ||
      (p === Choice.SCISSORS && a === Choice.PAPER)
    ) {
      return "player";
    }
    return "ai";
  };

  const handlePlay = useCallback(
    async (choice: Choice) => {
      if (gameState !== GameState.PICKING && gameState !== GameState.START)
        return;

      setPlayerChoice(choice);
      setGameState(GameState.SHAKING);

      // Pick AI choice immediately but keep it hidden during shake
      const choices = [Choice.ROCK, Choice.PAPER, Choice.SCISSORS];
      const ai = choices[Math.floor(Math.random() * choices.length)];
      setAiChoice(ai);

      // Initial "shaking" duration
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setGameState(GameState.REVEALING);

      const winner = determineWinner(choice, ai);
      setLastResult(winner);

      if (winner === "player") {
        setScore((s) => ({ ...s, player: s.player + 1 }));
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#fb923c", "#ffffff", "#3b82f6"],
        });
      } else if (winner === "ai") {
        setScore((s) => ({ ...s, ai: s.ai + 1 }));
      }

      setGameState(GameState.RESULT);
    },
    [gameState]
  );

  const resetGame = () => {
    setGameState(GameState.PICKING);
    setPlayerChoice(Choice.NONE);
    setAiChoice(Choice.NONE);
    setLastResult(null);
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-white font-sans overflow-hidden">
      {/* Header / Stats Overlay */}
      <div className="fixed top-0 left-0 w-full p-6 z-10 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tighter flex items-center gap-2">
            <Zap className="text-orange-500 fill-orange-500" size={24} />
            Rock Paper Scissorrrr...{" "}
            <span className="text-xs border border-white/20 px-1.5 rounded opacity-50">
              Socha nahi
            </span>
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-mono">
            Oye! I dare u..
          </p>
        </div>

        <div className="flex gap-2 md:gap-4 pointer-events-auto">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-2 md:p-3 rounded-xl min-w-[80px] md:min-w-[120px] text-center">
            <p className="text-[8px] md:text-[10px] uppercase tracking-widest text-white/40 mb-1">
              Score
            </p>
            <div className="flex justify-center items-center gap-2 md:gap-4 text-lg md:text-2xl font-mono font-bold">
              <span className="text-orange-400">{score.player}</span>
              <span className="opacity-20 text-sm">:</span>
              <span className="text-white/60">{score.ai}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Battle Arena */}
      <div className="flex-1 w-full relative">
        <GameScene
          playerChoice={playerChoice}
          aiChoice={aiChoice}
          gameState={gameState}
        />

        {/* Action Indicators */}
        <AnimatePresence mode="wait">
          {gameState === GameState.RESULT && (
            <motion.div
              key="result-overlay"
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -20 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none px-4"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.1, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  <h2
                    className={`text-5xl md:text-8xl font-black uppercase tracking-tighter italic ${
                      lastResult === "player"
                        ? "text-orange-500"
                        : lastResult === "ai"
                        ? "text-white/40"
                        : "text-blue-400"
                    }`}
                  >
                    {lastResult === "player"
                      ? "Victory"
                      : lastResult === "ai"
                      ? "Defeat"
                      : "Draw"}
                  </h2>
                </motion.div>
                <div className="flex justify-center gap-6 md:gap-12 mt-4">
                  <div className="text-center">
                    <p className="text-[8px] md:text-[10px] uppercase tracking-widest text-white/40 mb-1">
                      Your Move
                    </p>
                    <p className="text-sm md:text-lg font-bold capitalize">
                      {playerChoice}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] md:text-[10px] uppercase tracking-widest text-white/40 mb-1">
                      Opponent
                    </p>
                    <p className="text-sm md:text-lg font-bold capitalize">
                      {aiChoice}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {gameState === GameState.SHAKING && (
            <motion.div
              key="shaking-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <p className="text-xl md:text-4xl font-mono font-bold tracking-[0.3em] md:tracking-[0.5em] text-white/10 uppercase italic animate-pulse">
                ...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls Overlay */}
      <div className="absolute bottom-8 left-0 right-0 p-4 md:p-8 flex justify-center items-center z-20 pointer-events-none">
        <div className="max-w-xl w-full pointer-events-auto">
          <AnimatePresence>
            {gameState === GameState.START ||
            gameState === GameState.PICKING ? (
              <motion.div
                key="choice-ui"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex flex-col items-center gap-4 md:gap-6 pointer-events-auto"
              >
                <h3 className="text-[10px] md:text-sm uppercase tracking-[0.2em] font-medium text-white/50">
                  Choose Your Weapon
                </h3>
                <div className="flex gap-2 md:gap-4 overflow-x-auto pb-2 no-scrollbar w-full justify-center">
                  {[
                    {
                      id: Choice.ROCK,
                      label: "Rock",
                      icon: <Shield size={18} />,
                    },
                    {
                      id: Choice.PAPER,
                      label: "Paper",
                      icon: <HelpCircle size={18} />,
                    },
                    {
                      id: Choice.SCISSORS,
                      label: "Scissors",
                      icon: <Zap size={18} />,
                    },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => handlePlay(btn.id)}
                      className="group relative flex flex-col items-center gap-2 md:gap-3 p-4 md:p-6 min-w-[90px] md:min-w-[120px] bg-white/5 backdrop-blur-md border border-white/10 rounded-xl md:rounded-2xl transition-all hover:bg-orange-500/10 hover:border-orange-500/30 active:scale-95 cursor-pointer"
                    >
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange-500/20 group-hover:text-orange-400 transition-colors pointer-events-none">
                        {btn.icon}
                      </div>
                      <span className="text-[10px] md:text-sm font-bold uppercase tracking-widest pointer-events-none">
                        {btn.label}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : gameState === GameState.RESULT ? (
              <motion.div
                key="result-ui"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex flex-col items-center gap-4 pointer-events-auto"
              >
                <button
                  onClick={resetGame}
                  className="flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 bg-orange-500 hover:bg-orange-600 rounded-full font-bold uppercase tracking-widest text-[10px] md:text-sm transition-all transform active:scale-95 shadow-[0_0_40px_rgba(249,115,22,0.3)] cursor-pointer"
                >
                  <RefreshCw size={16} />
                  Play Again
                </button>
               
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Visual elements */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500/0 via-orange-500/20 to-orange-500/0" />
    </div>
  );
}
