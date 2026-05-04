

# Rock Paper Scissors Game

A visually stunning Rock Paper Scissors game featuring 3D hand models that face each other in an epic battle arena.

## 🎮 Game Features

- **3D Hand Models**: Realistic hand animations with proper finger articulation
- **Proper Hand Orientation**: Hands face each other like real opponents
- **Smooth Animations**: Shaking, revealing, and gesture transitions
- **Responsive Design**: Works on both desktop and mobile devices
- **Score Tracking**: Keep track of wins for both player and AI
- **Victory Effects**: Confetti celebration on player wins



## 🚀 Run Locally

**Prerequisites:** Node.js (v16 or higher)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Place the 3D model:**
   - Ensure `oopo_hand.glb` is in the `/public` folder

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Navigate to `http://localhost:3000`

## 📁 Project Structure

```
├── components/
│   ├── GameScene.tsx    # 3D scene setup, lighting, hand positioning
│   └── Hand.tsx         # 3D hand model with gesture animations
├── App.tsx              # Main game logic and UI
├── types.ts             # TypeScript interfaces and enums
├── main.tsx             # React entry point
├── index.css            # Global styles
└── oopo_hand.glb        # 3D hand model file
```



## 🙏 Credits

Built with React, Three.js, React Three Fiber, and lots of hand-waving! 👋






