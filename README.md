<div align="center">
<img width="1200" height="475" alt="ARC Raiders Skill Tree Builder" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ARC Raiders Skill Tree Builder

An interactive skill tree builder and planner for **ARC Raiders**, allowing players to plan and optimize their skill point allocation across three major branches: **Conditioning**, **Mobility**, and **Survival**.

## Features

### 🎯 Interactive Skill Tree
- **Visual Skill Tree**: Navigate through 45+ skill nodes across three branches
- **Real-time Point Tracking**: Monitor your skill point allocation (max 75 points)
- **Prerequisite System**: Visual connections show skill dependencies
- **Category Requirements**: Some skills require minimum points in their category tree

### 🎨 User Experience
- **Zoom & Pan**: Drag to pan, scroll to zoom (0.4x - 2.5x)
- **Share Builds**: Generate shareable links for your skill builds
- **Reset Function**: Quickly reset your entire build
- **Tooltips**: Hover over skills to see detailed information

### 🤖 AI Assistant
- **Gemini AI Integration**: Get AI-powered build suggestions
- **Scenario-based Builds**: Request builds for specific playstyles (Solo, Team Combat, PvP)
- **Smart Recommendations**: AI analyzes your preferences and suggests optimal builds

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
   - Add your Gemini API key:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```
   - Note: The AI assistant feature requires a Gemini API key. The skill tree builder works without it.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

### Building Your Skill Tree

1. **Navigate the Tree**: Use mouse drag to pan, scroll wheel to zoom
2. **Allocate Points**: Click on skill nodes to increment, right-click (or use controls) to decrement
3. **Track Progress**: Monitor your total points and category-specific points in the top-right panel
4. **Share Your Build**: Click the share button to generate a shareable link
5. **Get AI Suggestions**: Use the AI assistant panel to get build recommendations

### Skill Tree Mechanics

- **Prerequisites**: Some skills require parent skills to be unlocked first
- **Category Requirements**: High-tier skills may require minimum points in their category (e.g., 15, 36 points)
- **Max Ranks**: Each skill has a maximum rank (typically 1 or 5)
- **Point Limit**: Total skill points are capped at 75

## Build Examples

### Solo Raider (Looter Build)
- **Survival**: 40-50 points
- **Mobility**: Low investment
- **Focus**: Silent infiltration, rapid looting, inventory capacity

### Team Combat (Tank Build)
- **Conditioning**: 40-50 points
- **Survival**: Moderate supplement
- **Focus**: Damage absorption, stamina recovery, shield efficiency

### PvP Combat (Flanker Build)
- **Mobility**: 45-55 points
- **Conditioning**: Low investment
- **Focus**: High mobility, tactical dodging, climbing speed

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Google Gemini AI** - AI assistant integration

## Project Structure

```
arcradiersskill/
├── components/
│   ├── SkillNode.tsx          # Individual skill node component
│   ├── ConnectionLines.tsx     # Skill tree connections
│   ├── Tooltip.tsx             # Skill information tooltip
│   ├── GeminiAssistant.tsx     # AI assistant panel
│   └── LandingSections.tsx     # Landing page content
├── data.ts                     # Skill tree data definitions
├── types.ts                    # TypeScript type definitions
├── App.tsx                     # Main application component
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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is for educational and community use. ARC Raiders is a trademark of its respective owners.

## Acknowledgments

- Built for the ARC Raiders community
- Skill data based on official game information
- AI assistance powered by Google Gemini

---

**Note**: This tool is a community-created planner and is not officially affiliated with ARC Raiders or its developers.
