/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Choice {
  ROCK = 'rock',
  PAPER = 'paper',
  SCISSORS = 'scissors',
  NONE = 'none',
}

export enum GameState {
  START = 'start',
  PICKING = 'picking',
  SHAKING = 'shaking',
  REVEALING = 'revealing',
  RESULT = 'result',
}

export interface GameResult {
  playerChoice: Choice;
  aiChoice: Choice;
  winner: 'player' | 'ai' | 'draw';
}
