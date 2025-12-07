# CodeNav - CodeBase Navigator

<div align="center">

**An intelligent codebase exploration platform powered by AI**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

[Features](#features) • [Getting Started](#getting-started) • [Architecture](#architecture) • [Documentation](#documentation)

</div>

---

## Overview

**CodeNav** is an advanced codebase exploration and analysis platform that combines interactive graph visualization with AI-powered code understanding. Built on a RAG (Retrieval Augmented Generation) architecture, CodeNav enables developers to navigate, understand, and query large codebases through an intuitive visual interface and intelligent conversational AI.

## Features

### 🗺️ Interactive Graph Visualization
- **Force-directed graph** representation of code structure
- Visual mapping of files, directories, and their relationships
- Real-time node interaction with click-to-explore functionality
- Zoom, pan, and navigation controls
- Custom node rendering with type-based styling

### 🤖 AI-Powered Code Analysis
- **RAG-based Q&A system** running on top of LLM (Large Language Model)
- Context-aware responses based on codebase structure
- Repository-specific knowledge retrieval
- Source code citation with file references
- Intelligent code pattern recognition

### 📝 Code Inspector
- **Monaco Editor** integration for syntax-highlighted code viewing
- Line-by-line code navigation
- Highlighted code snippets from AI responses
- Multi-language support with automatic language detection
- Copy-to-clipboard functionality

### 📦 Multi-Repository Support
- Manage and explore multiple codebases
- Repository switching and context management
- Repository metadata and statistics
- Status tracking and ingestion progress

## Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks and context
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations and transitions

### UI Components
- **shadcn/ui** - High-quality component library
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

### Data & State Management
- **TanStack Query** - Server state management and caching
- **React Context** - Global application state
- **Axios** - HTTP client for API communication

### Visualization & Editing
- **react-force-graph-2d** - Force-directed graph rendering
- **Monaco Editor** - VS Code-powered code editor

### AI Integration
- **Google Gemini API** - Large Language Model integration
- **RAG Architecture** - Retrieval Augmented Generation for codebase understanding

## Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aamirgheewale/CodeBase-Navigator.git
   cd CodeBase-Navigator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   Get your Gemini API key from: [Google AI Studio](https://makersuite.google.com/app/apikey)

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:8080`

## Architecture

### System Overview

CodeNav follows a modern, scalable architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Graph View  │  │  Chat View   │  │  Inspector   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                    API Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Repository   │  │   Graph      │  │   File       │  │
│  │   Service    │  │   Service    │  │   Service    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│              RAG System (Backend)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Codebase    │  │  Vector      │  │   LLM        │  │
│  │  Indexer     │  │  Database    │  │  (Gemini)    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### RAG Architecture

CodeNav implements a **Retrieval Augmented Generation** system that enhances LLM responses with codebase-specific context:

1. **Codebase Ingestion**
   - Parses repository structure
   - Extracts code relationships and dependencies
   - Generates graph representation

2. **Vector Embedding**
   - Converts code snippets to vector embeddings
   - Stores in vector database for semantic search
   - Enables context-aware retrieval

3. **Query Processing**
   - User query analyzed for intent
   - Relevant code snippets retrieved from vector database
   - Context assembled for LLM

4. **Response Generation**
   - LLM generates response using retrieved context
   - Source citations included
   - Response formatted with code references

### Component Architecture

- **Sidebar**: Repository management and view mode selection
- **GraphView**: Interactive graph visualization with D3.js force simulation
- **ChatView**: AI-powered Q&A interface with RAG integration
- **InspectorPanel**: Code viewer with Monaco Editor
- **Topbar**: Contextual information and navigation

## Project Structure

```
CodeBase-Navigator/
├── public/                 # Static assets
│   ├── favicon.svg        # Application favicon
│   └── robots.txt         # SEO configuration
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── Sidebar.tsx   # Repository sidebar
│   │   ├── Topbar.tsx    # Top navigation
│   │   ├── InspectorPanel.tsx  # Code inspector
│   │   └── ...
│   ├── pages/            # Page components
│   │   ├── Index.tsx     # Main application
│   │   ├── GraphView.tsx # Graph visualization
│   │   └── ChatView.tsx  # AI chat interface
│   ├── context/          # React Context providers
│   │   └── AppContext.tsx # Global state
│   ├── lib/              # Utilities and API client
│   │   ├── api.ts        # API integration
│   │   └── utils.ts      # Helper functions
│   ├── types/            # TypeScript definitions
│   └── hooks/            # Custom React hooks
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── package.json          # Dependencies
```

## Usage

### Exploring a Codebase

1. **Select a Repository**
   - Choose from available repositories in the sidebar
   - View repository statistics (files, lines of code)

2. **Graph View**
   - Visualize code structure as an interactive graph
   - Click nodes to view file contents
   - Navigate relationships between files

3. **Chat Interface**
   - Ask questions about codebase architecture
   - Get AI-powered explanations with source citations
   - Click source snippets to view in inspector

4. **Code Inspector**
   - View full file contents with syntax highlighting
   - Navigate to specific line ranges
   - Copy code snippets

### Example Queries

- "How is state management handled in this codebase?"
- "Explain the main entry point"
- "What design patterns are used?"
- "How are components organized?"

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Development Server

The development server runs on `http://localhost:8080` with:
- Hot Module Replacement (HMR)
- Fast refresh for React components
- TypeScript type checking
- ESLint integration

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key for AI features | Optional |

### API Configuration

The application connects to backend services for:
- Repository ingestion and indexing
- Graph data generation
- File content retrieval
- RAG-based query processing

## Building for Production

```bash
# Create production build
npm run build

# Output will be in the 'dist' directory
```

The production build is optimized with:
- Code splitting
- Tree shaking
- Minification
- Asset optimization

## Deployment

### Deploy to Vercel

This project is optimized for deployment on [Vercel](https://vercel.com/). Vercel automatically detects Vite projects and provides optimal configuration.

#### Option 1: Deploy via Vercel Dashboard

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import project on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository: `Aamirgheewale/CodeBase-Navigator`
   - Vercel will auto-detect Vite settings

3. **Configure Environment Variables**
   - In Vercel project settings, add:
     - `VITE_GEMINI_API_KEY` = your API key
   - Click "Deploy"

#### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add VITE_GEMINI_API_KEY
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

#### Vercel Configuration

The project includes a `vercel.json` configuration file that:
- Sets the build output directory to `dist`
- Configures SPA routing for React Router
- Optimizes build settings for Vite

#### Custom Domain

After deployment, you can add a custom domain:
1. Go to your project settings on Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### Other Deployment Options

#### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### GitHub Pages

1. Install `gh-pages`:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Documentation

For detailed technical documentation, see [about_project.md](./about_project.md)

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Built with [React](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Graph visualization powered by [react-force-graph-2d](https://github.com/vasturiano/react-force-graph)
- Code editor powered by [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- AI integration with [Google Gemini](https://deepmind.google/technologies/gemini/)

## Contact

**Repository**: [https://github.com/Aamirgheewale/CodeBase-Navigator](https://github.com/Aamirgheewale/CodeBase-Navigator)

---

<div align="center">

Made with ❤️ for developers

</div>
