<div align="center">
<img width="1200" height="475" alt="ARC Raiders Skill Tree Builder" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ARC Raiders Skill Tree Builder

An interactive skill tree builder and planner for **ARC Raiders**, allowing players to plan and optimize their skill point allocation across three major branches: **Conditioning**, **Mobility**, and **Survival**.

## Features

### 🎯 Interactive Skill Tree
- **Visual Skill Tree**: Navigate through 48 Frozen Trail skill nodes across three branches
- **Real-time Point Tracking**: Plan with 76 base points or 81, 86, and 91-point Expedition budgets
- **Prerequisite System**: Visual connections show skill dependencies
- **Category Requirements**: Choose one middle skill after 10 branch points and up to two final skills after 30 and 40

### 🎨 User Experience
- **Zoom & Pan**: Drag to pan, scroll to zoom (0.4x - 2.5x)
- **Share Builds**: Generate shareable links for your skill builds
- **Reset Function**: Quickly reset your entire build
- **Tooltips**: Hover over skills to see detailed information

### AI Build Advisor
- **Generate or review builds**: Create a build from preferences or analyze the current tree
- **Structured recommendations**: See point changes, reasoning, and tradeoffs before applying
- **Server-side API access**: RapidAPI credentials remain on the Node.js server

### 📊 Skill Categories

#### Conditioning
Focus on stamina management, shield efficiency, and survival capabilities. Perfect for tank builds and endurance-focused raiders.

#### Mobility  
Enhance movement speed, climbing, vaulting, and dodge mechanics. Ideal for aggressive players and PvP combatants.

#### Survival
Improve looting speed, inventory capacity, and resource management. Essential for solo raiders and loot specialists.

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd arcradiersskill
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add your RapidAPI configuration:
     ```
     RAPIDAPI_KEY=your_rotated_api_key
     RAPIDAPI_HOST=gpt-5-6-sol.p.rapidapi.com
     RAPIDAPI_MODEL=gpt-5.6-sol
     ```
   - The skill tree builder works without a key, but AI requests will remain disabled.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

### Building Your Skill Tree

1. **Navigate the Tree**: Use mouse drag to pan, scroll wheel to zoom
2. **Allocate Points**: Click on skill nodes to increment, right-click (or use controls) to decrement
3. **Track Progress**: Monitor your total points and category-specific points in the top-right panel
4. **Share Your Build**: Click the share button to generate a shareable link
5. **Get AI Suggestions**: Use the AI assistant panel to get build recommendations

### Skill Tree Mechanics

- **Prerequisites**: Some skills require parent skills to be unlocked first
- **Category Requirements**: Middle choices unlock after 10 branch points; final picks unlock after 30 and 40
- **Max Ranks**: Each skill has a maximum rank (typically 1 or 5)
- **Point Limit**: Select a 76, 81, 86, or 91-point budget before allocating

The 48-node dataset is adapted from the [Frozen Trail community skill tree](https://arc-raiders.build/frozen-trail-skill-tree-changes/) and checked against the [official 2.0 skill-tree rules](https://arcraiders.com/news/frozen-trail-2-0-update). See the [PvPvE build guide](https://arcraiderskill.com/blog/arc-raiders-20-best-skill-tree-builds-for-pvpve-solo--squad.html) for example allocations. Verify patch-sensitive values in game.

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Node.js HTTPS** - Server-side RapidAPI integration

## Project Structure

```
arcradiersskill/
├── components/
│   ├── SkillNode.tsx          # Individual skill node component
│   ├── ConnectionLines.tsx     # Skill tree connections
│   ├── Tooltip.tsx             # Skill information tooltip
│   ├── GeminiAssistant.tsx     # AI build advisor panel
│   └── LandingSections.tsx     # Landing page content
├── data.ts                     # Skill tree data definitions
├── types.ts                    # TypeScript type definitions
├── App.tsx                     # Main application component
├── server.mjs                  # Vite host and server-side AI proxy
└── index.html                  # HTML entry point
```

## Development

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Deploying to Vercel

The repository includes a Serverless Function at `/api/ai/build`. Add `RAPIDAPI_KEY`
to the Vercel project's Production environment variables before deploying. Set
`RAPIDAPI_HOST` and `RAPIDAPI_MODEL` only when overriding their documented defaults.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is for educational and community use. ARC Raiders is a trademark of its respective owners.

## Acknowledgments

- Built for the ARC Raiders community
- Skill data based on official game information
- AI assistance is provided through the configured RapidAPI model

---

**Note**: This tool is a community-created planner and is not officially affiliated with ARC Raiders or its developers.
