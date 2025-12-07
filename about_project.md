# CodeNav - Codebase Navigator

## Project Overview

**CodeNav** (CodeBaseNav) is an interactive codebase exploration and analysis tool that provides visual graph representations and AI-powered Q&A capabilities for understanding large code repositories. The application allows developers to explore codebases through an intuitive graph visualization interface and ask questions about code structure, patterns, and implementations.

## Key Features

### 1. **Graph Visualization**
- Interactive force-directed graph showing code structure
- Visual representation of files, directories, and their relationships
- Node-based navigation with click-to-explore functionality
- Real-time graph rendering with smooth animations
- Zoom, pan, and reset controls for navigation

### 2. **AI-Powered Chat Interface**
- Ask questions about codebase architecture, patterns, and implementations
- Repository-specific responses tailored to each codebase
- Integration with Google Gemini API for intelligent responses
- Fallback to mock responses when API is unavailable
- Suggested questions for quick exploration

### 3. **Code Inspector**
- Monaco Editor integration for viewing file contents
- Syntax highlighting based on file type
- Line highlighting for referenced code snippets
- Copy-to-clipboard functionality
- Responsive panel that slides in from the right

### 4. **Repository Management**
- Support for multiple repositories (React, VS Code, Next.js)
- Repository selection and switching
- Repository metadata display (files count, lines of code)
- Status tracking (pending, ingesting, ready, error)

## Technology Stack

### Frontend Framework
- **React 18.3.1** - UI library
- **TypeScript 5.8.3** - Type safety
- **Vite 5.4.19** - Build tool and dev server

### UI Libraries & Components
- **shadcn/ui** - Component library built on Radix UI
- **Radix UI** - Accessible component primitives
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Framer Motion 11.18.2** - Animation library

### Data & State Management
- **TanStack Query (React Query) 5.83.0** - Server state management
- **React Context API** - Global application state
- **Axios 1.13.2** - HTTP client

### Visualization & Editing
- **react-force-graph-2d 1.29.0** - Force-directed graph visualization
- **@monaco-editor/react 4.7.0** - Code editor component

### Routing
- **React Router DOM 6.30.1** - Client-side routing

### AI Integration
- **Google Gemini API** - AI-powered codebase Q&A
  - Supports multiple models (gemini-2.0-flash-exp, gemini-1.5-flash, gemini-pro)
  - Automatic model fallback
  - Environment variable configuration

## Project Structure

```
repo-canvas/
├── public/                 # Static assets
│   ├── favicon.svg        # Application favicon (C logo)
│   └── placeholder.svg    # Placeholder images
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── Sidebar.tsx   # Repository sidebar
│   │   ├── Topbar.tsx    # Top navigation bar
│   │   ├── InspectorPanel.tsx  # Code inspector
│   │   ├── RepoCard.tsx  # Repository card component
│   │   └── ...
│   ├── pages/            # Page components
│   │   ├── Index.tsx     # Main application page
│   │   ├── GraphView.tsx # Graph visualization view
│   │   ├── ChatView.tsx  # AI chat interface
│   │   └── NotFound.tsx  # 404 page
│   ├── context/          # React Context providers
│   │   └── AppContext.tsx # Global application state
│   ├── lib/              # Utility libraries
│   │   ├── api.ts        # API client and mock data
│   │   └── utils.ts      # Helper functions
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts      # Shared types and interfaces
│   ├── hooks/            # Custom React hooks
│   ├── App.tsx           # Root application component
│   └── main.tsx           # Application entry point
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── package.json          # Dependencies and scripts
```

## Architecture

### Application Flow

1. **Initialization**
   - App loads with React Router setup
   - QueryClient configured for data fetching
   - AppContext provides global state management
   - Sidebar fetches and displays available repositories

2. **Repository Selection**
   - User selects a repository from the sidebar
   - Selected repository state updates in AppContext
   - Graph view or chat view loads based on current view mode

3. **Graph View Mode**
   - Fetches graph data for selected repository
   - Renders interactive force-directed graph
   - User can click nodes to view file contents
   - Inspector panel opens with file content

4. **Chat View Mode**
   - User can ask questions about the codebase
   - Query sent to Gemini API (if configured) or mock responses
   - Responses include source code snippets
   - User can click snippets to view in inspector

### State Management

The application uses a combination of:

1. **React Context (AppContext)**
   - Global application state
   - Selected repository
   - View mode (graph/chat)
   - Inspector file and highlighted lines
   - Selected graph node

2. **TanStack Query**
   - Server state management
   - Caching and refetching
   - Loading and error states
   - Automatic background updates

3. **Local Component State**
   - UI-specific state (hover states, animations)
   - Form inputs
   - Temporary UI state

## Core Components

### 1. Sidebar (`src/components/Sidebar.tsx`)
- Displays repository list
- View mode toggle (Graph/Chat)
- Repository selection
- Logo and branding
- Refresh functionality

### 2. GraphView (`src/pages/GraphView.tsx`)
- Force-directed graph visualization
- Node interaction (click, hover)
- Zoom and pan controls
- Custom node rendering
- Graph data fetching

### 3. ChatView (`src/pages/ChatView.tsx`)
- Chat message interface
- Input handling
- Suggested questions
- Message display with source snippets
- AI response integration

### 4. InspectorPanel (`src/components/InspectorPanel.tsx`)
- Monaco Editor integration
- File content display
- Syntax highlighting
- Line highlighting
- Copy functionality

### 5. Topbar (`src/components/Topbar.tsx`)
- Current repository context
- Repository statistics
- Demo mode toggle
- Presentation controls

## API Integration

### API Client (`src/lib/api.ts`)

The API client provides a unified interface for backend communication with fallback to mock data:

#### Functions:

1. **`getRepositories()`**
   - Fetches list of available repositories
   - Returns immediately with mock data (no backend delay)
   - Returns: `Repository[]`

2. **`getGraph(repoId: string)`**
   - Fetches graph data for a repository
   - Returns mock graph structure with nodes and links
   - Returns: `GraphData`

3. **`getFile(repo: string, path: string)`**
   - Fetches file content
   - Generates mock content based on file type
   - Supports multiple file types with appropriate content
   - Returns: `FileContent`

4. **`chat(query: string, repoId: string)`**
   - Sends query to Gemini API (if configured)
   - Falls back to intelligent mock responses
   - Repository-specific responses for common questions
   - Returns: `ChatMessage`

5. **`ingestRepo(repoUrl: string)`**
   - Initiates repository ingestion process
   - Returns progress tracking
   - Returns: `IngestProgress`

### Mock Data System

The application includes comprehensive mock data for demonstration:

- **3 Mock Repositories**: React, VS Code, Next.js
- **Graph Data**: Node-link structure with files and directories
- **File Content**: Type-specific mock content for different file types
- **Chat Responses**: Intelligent responses based on query keywords

### Gemini API Integration

The chat function integrates with Google Gemini API:

1. **Configuration**: API key via `VITE_GEMINI_API_KEY` environment variable
2. **Model Selection**: Tries multiple models in order:
   - gemini-2.0-flash-exp
   - gemini-2.0-flash
   - gemini-2.5-flash
   - gemini-1.5-flash
   - gemini-1.5-pro
   - gemini-pro
3. **Fallback**: If API fails or unavailable, uses intelligent mock responses
4. **Repository-Specific**: Responses tailored to selected repository

## Data Models

### Repository
```typescript
interface Repository {
  id: string;
  name: string;
  url: string;
  language: string;
  files: number;
  lines: number;
  status: 'pending' | 'ingesting' | 'ready' | 'error';
}
```

### GraphData
```typescript
interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

interface GraphNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory' | 'module';
  size?: number;
  language?: string;
  repo: string;
}

interface GraphLink {
  source: string;
  target: string;
  type: 'import' | 'export' | 'reference';
}
```

### ChatMessage
```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: SourceSnippet[];
  timestamp: Date;
}
```

## User Interface

### Design System

- **Color Scheme**: Dark theme with primary/accent colors
- **Typography**: Inter font family
- **Spacing**: Consistent spacing scale
- **Animations**: Smooth transitions with Framer Motion
- **Glass Morphism**: Frosted glass effects on panels

### Responsive Design

- Fixed sidebar (272px width)
- Flexible main content area
- Inspector panel (420px width)
- Responsive graph visualization

### Accessibility

- Keyboard navigation support
- ARIA labels where appropriate
- Focus management
- Screen reader friendly

## Development Workflow

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### Development Server

- Runs on `http://localhost:8080`
- Hot Module Replacement (HMR)
- Fast refresh for React components

## Key Features Explained

### 1. Graph Visualization

The graph view uses `react-force-graph-2d` to create an interactive force-directed graph:

- **Nodes**: Represent files (purple) and directories (gray)
- **Links**: Show relationships (imports, exports, references)
- **Interactions**: 
  - Click nodes to view file content
  - Hover for node information
  - Zoom and pan for navigation
- **Custom Rendering**: Custom node shapes and labels
- **Physics Simulation**: Force-directed layout algorithm

### 2. AI Chat System

The chat interface provides intelligent codebase Q&A:

- **Suggested Questions**: 4 pre-defined questions for quick exploration
- **Repository-Specific Responses**: Different answers for React, VS Code, and Next.js
- **Source Citations**: Responses include code snippets with file paths
- **Interactive Snippets**: Click snippets to view in inspector
- **Context Awareness**: Responses adapt to selected repository

### 3. Code Inspector

The inspector panel provides detailed code viewing:

- **Monaco Editor**: Full-featured code editor
- **Syntax Highlighting**: Language-specific highlighting
- **Line Highlighting**: Highlight specific line ranges
- **File Path Display**: Shows repository and file path
- **Copy Functionality**: Quick copy-to-clipboard

## Mock Data System

The application includes a comprehensive mock data system for demonstration:

### Mock Repositories
- **facebook/react**: JavaScript, 2,847 files, 284,521 lines
- **microsoft/vscode**: TypeScript, 5,421 files, 892,341 lines
- **vercel/next.js**: TypeScript, 3,156 files, 412,893 lines

### Mock Graph Data
- 11 nodes (directories and files)
- 9 links (import relationships)
- Represents a typical React project structure

### Mock File Content
- Type-specific content for different file types
- Realistic code examples
- Multiple file types supported (TypeScript, JavaScript, etc.)

### Mock Chat Responses
- Keyword-based response generation
- Repository-specific answers
- 4 specialized responses for suggested questions
- Fallback responses for general queries

## Future Enhancements

### Potential Improvements

1. **Backend Integration**
   - Real repository ingestion
   - Actual codebase parsing
   - Live graph generation
   - Real file content fetching

2. **Enhanced Graph Features**
   - 3D graph visualization
   - Graph filtering and search
   - Custom graph layouts
   - Export graph as image

3. **Advanced Chat Features**
   - Conversation history
   - Code generation
   - Refactoring suggestions
   - Code explanation with diagrams

4. **Repository Management**
   - Add custom repositories
   - Repository search
   - Repository comparison
   - Import from GitHub/GitLab

5. **Code Analysis**
   - Dependency analysis
   - Code metrics
   - Complexity visualization
   - Test coverage display

6. **Collaboration Features**
   - Share graph views
   - Annotate code
   - Team discussions
   - Code review integration

## Performance Considerations

### Optimizations

1. **Code Splitting**: Route-based code splitting
2. **Lazy Loading**: Components loaded on demand
3. **Memoization**: React.memo for expensive components
4. **Query Caching**: TanStack Query caching strategy
5. **Graph Rendering**: Optimized force simulation

### Bundle Size

- Production build optimized with Vite
- Tree shaking for unused code
- Minification and compression
- Asset optimization

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features required
- Canvas API for graph rendering
- WebGL not required (2D graph)

## License & Credits

- Built with React and TypeScript
- UI components from shadcn/ui
- Graph visualization with react-force-graph-2d
- Code editor powered by Monaco Editor
- AI integration with Google Gemini API

## Conclusion

CodeNav is a powerful tool for exploring and understanding codebases through visual representation and AI-powered assistance. The application provides an intuitive interface for navigating complex code structures and getting intelligent answers about code architecture, patterns, and implementations.

The modular architecture, comprehensive mock data system, and flexible API integration make it easy to extend and customize for specific use cases. Whether exploring open-source projects or understanding your own codebase, CodeNav provides the tools needed for effective code exploration and analysis.

