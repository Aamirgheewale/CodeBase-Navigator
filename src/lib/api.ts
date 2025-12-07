import axios from 'axios';
import type { Repository, GraphData, ChatMessage, FileContent, IngestProgress, SourceSnippet } from '@/types';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

// Mock data for demo when backend is unavailable
const MOCK_REPOS: Repository[] = [
  {
    id: 'react',
    name: 'facebook/react',
    url: 'https://github.com/facebook/react',
    language: 'JavaScript',
    files: 2847,
    lines: 284521,
    status: 'ready',
  },
  {
    id: 'vscode',
    name: 'microsoft/vscode',
    url: 'https://github.com/microsoft/vscode',
    language: 'TypeScript',
    files: 5421,
    lines: 892341,
    status: 'ready',
  },
  {
    id: 'next',
    name: 'vercel/next.js',
    url: 'https://github.com/vercel/next.js',
    language: 'TypeScript',
    files: 3156,
    lines: 412893,
    status: 'ready',
  },
];

const MOCK_GRAPH_DATA: GraphData = {
  nodes: [
    { id: 'src', name: 'src', path: '/src', type: 'directory', repo: 'react' },
    { id: 'components', name: 'components', path: '/src/components', type: 'directory', repo: 'react' },
    { id: 'hooks', name: 'hooks', path: '/src/hooks', type: 'directory', repo: 'react' },
    { id: 'utils', name: 'utils', path: '/src/utils', type: 'directory', repo: 'react' },
    { id: 'app', name: 'App.tsx', path: '/src/App.tsx', type: 'file', language: 'typescript', size: 2400, repo: 'react' },
    { id: 'main', name: 'main.tsx', path: '/src/main.tsx', type: 'file', language: 'typescript', size: 800, repo: 'react' },
    { id: 'button', name: 'Button.tsx', path: '/src/components/Button.tsx', type: 'file', language: 'typescript', size: 1200, repo: 'react' },
    { id: 'modal', name: 'Modal.tsx', path: '/src/components/Modal.tsx', type: 'file', language: 'typescript', size: 1800, repo: 'react' },
    { id: 'usestate', name: 'useState.ts', path: '/src/hooks/useState.ts', type: 'file', language: 'typescript', size: 3200, repo: 'react' },
    { id: 'useeffect', name: 'useEffect.ts', path: '/src/hooks/useEffect.ts', type: 'file', language: 'typescript', size: 2800, repo: 'react' },
    { id: 'helpers', name: 'helpers.ts', path: '/src/utils/helpers.ts', type: 'file', language: 'typescript', size: 1500, repo: 'react' },
    { id: 'constants', name: 'constants.ts', path: '/src/utils/constants.ts', type: 'file', language: 'typescript', size: 600, repo: 'react' },
  ],
  links: [
    { source: 'main', target: 'app', type: 'import' },
    { source: 'app', target: 'button', type: 'import' },
    { source: 'app', target: 'modal', type: 'import' },
    { source: 'app', target: 'usestate', type: 'import' },
    { source: 'app', target: 'useeffect', type: 'import' },
    { source: 'button', target: 'helpers', type: 'import' },
    { source: 'modal', target: 'usestate', type: 'import' },
    { source: 'helpers', target: 'constants', type: 'import' },
    { source: 'useeffect', target: 'usestate', type: 'reference' },
  ],
};

// Generate mock file content based on file path
function generateMockFileContent(fileName: string, path: string, language: string): string {
  const fileMap: Record<string, string> = {
    'App.tsx': `import React, { useState, useEffect } from 'react';
import { Button } from './components/Button';
import { Modal } from './components/Modal';

interface AppProps {
  title?: string;
}

export const App: React.FC<AppProps> = ({ title = 'My App' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = title;
  }, [title]);

  const handleClick = () => {
    setCount(prev => prev + 1);
  };

  return (
    <div className="app-container">
      <h1>{title}</h1>
      <p>Count: {count}</p>
      <Button onClick={handleClick}>
        Increment
      </Button>
      <Button onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2>Modal Content</h2>
        <p>This is the modal body content.</p>
      </Modal>
    </div>
  );
};

export default App;`,
    'main.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
    'Button.tsx': `import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary',
  disabled = false 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={\`btn btn-\${variant}\`}
    >
      {children}
    </button>
  );
};`,
    'Modal.tsx': `import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};`,
    'useState.ts': `import { getCurrentFiber } from '../fiber';
import { dispatchSetState } from '../reconciler';

export function useState<T>(initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const fiber = getCurrentFiber();
  if (!fiber.hooks) {
    fiber.hooks = [];
  }
  
  const hookIndex = fiber.hookIndex || 0;
  fiber.hookIndex = hookIndex + 1;
  
  if (!fiber.hooks[hookIndex]) {
    fiber.hooks[hookIndex] = {
      state: initialValue,
      queue: [],
    };
  }
  
  const hook = fiber.hooks[hookIndex];
  const setState = (value: T | ((prev: T) => T)) => {
    dispatchSetState(fiber, hookIndex, value);
  };
  
  return [hook.state, setState];
}`,
    'useEffect.ts': `import { getCurrentFiber } from '../fiber';
import { scheduleEffect } from '../scheduler';

export function useEffect(
  effect: () => void | (() => void),
  deps?: any[]
): void {
  const fiber = getCurrentFiber();
  if (!fiber.effects) {
    fiber.effects = [];
  }
  
  const effectIndex = fiber.effectIndex || 0;
  fiber.effectIndex = effectIndex + 1;
  
  scheduleEffect(fiber, effectIndex, effect, deps);
}`,
    'helpers.ts': `import { CONSTANTS } from './constants';

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function getApiUrl(endpoint: string): string {
  return \`\${CONSTANTS.API_BASE_URL}/\${endpoint}\`;
}`,
    'constants.ts': `export const CONSTANTS = {
  API_BASE_URL: 'https://api.example.com',
  API_VERSION: 'v1',
  MAX_RETRIES: 3,
  TIMEOUT: 5000,
} as const;`,
  };

  // Return specific content if file exists in map, otherwise generate generic content
  if (fileMap[fileName]) {
    return fileMap[fileName];
  }

  // Generate generic content based on file type
  if (language === 'typescript' || language === 'javascript') {
    return `// ${fileName}
// This is a mock file for demonstration purposes

export const ${fileName.replace(/\.(ts|tsx|js|jsx)$/, '')} = {
  // File content would be loaded here
  path: '${path}',
  repo: 'react',
};`;
  }

  return `// ${fileName}\n// Mock content for ${path}`;
}

const MOCK_SOURCES: SourceSnippet[] = [
  {
    id: '1',
    repo: 'facebook/react',
    path: '/src/App.tsx',
    content: `const [count, setCount] = useState(0);

const handleClick = () => {
  setCount(prev => prev + 1);
};`,
    startLine: 10,
    endLine: 15,
    relevance: 0.95,
  },
  {
    id: '2',
    repo: 'facebook/react',
    path: '/src/hooks/useState.ts',
    content: `export function useState<T>(initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Implementation using fiber reconciler
  const fiber = getCurrentFiber();
  return dispatchSetState(fiber, initialValue);
}`,
    startLine: 42,
    endLine: 47,
    relevance: 0.88,
  },
];

let useMockData = false;

export const apiClient = {
  async getRepositories(): Promise<Repository[]> {
    // Return mock data immediately without trying API first
    useMockData = true;
    return MOCK_REPOS;
  },

  async ingestRepo(repoUrl: string): Promise<IngestProgress> {
    try {
      const response = await api.post<IngestProgress>('/ingest', { url: repoUrl });
      return response.data;
    } catch {
      return {
        repo: repoUrl,
        status: 'complete',
        progress: 100,
        message: 'Demo mode: Repository ingested successfully',
      };
    }
  },

  async getGraph(repoId: string): Promise<GraphData> {
    // Return mock data immediately without trying API first
    return MOCK_GRAPH_DATA;
  },

  async getFile(repo: string, path: string): Promise<FileContent> {
    // Return mock data immediately without trying API first
    // Determine language from file extension
    const extension = path.split('.').pop()?.toLowerCase() || 'typescript';
    const languageMap: Record<string, string> = {
      'ts': 'typescript',
      'tsx': 'typescript',
      'js': 'javascript',
      'jsx': 'javascript',
      'json': 'json',
      'css': 'css',
      'html': 'html',
      'md': 'markdown',
    };
    const language = languageMap[extension] || 'typescript';

    // Generate different mock content based on file path
    const fileName = path.split('/').pop() || 'file';
    const mockContent = generateMockFileContent(fileName, path, language);

    return {
      repo,
      path,
      content: mockContent,
      language,
    };
  },

  async chat(query: string, repoId: string): Promise<ChatMessage> {
    try {
      const response = await api.post<ChatMessage>('/chat', { query, repo: repoId });
      return response.data;
    } catch {
      // Try Gemini API if API key is available
      const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (geminiApiKey && geminiApiKey !== 'your_gemini_api_key_here') {
        try {
          // First, try to list available models to see what's actually available
          // Then use the most appropriate model
          let modelName = 'gemini-1.5-flash'; // Try newer model first
          
          // Use the correct endpoint format for Gemini API
          // The API expects: v1beta/models/MODEL_NAME:generateContent
          // Prioritize Gemini 2.5 Flash and other 2.x models
          const modelsToTry = [
            'gemini-2.0-flash-exp',
            'gemini-2.0-flash',
            'gemini-2.5-flash',
            'gemini-1.5-flash',
            'gemini-1.5-pro',
            'gemini-pro'
          ];
          
          let geminiResponse: Response | null = null;
          let successfulModel = '';
          let responseData: any = null;
          
          for (const model of modelsToTry) {
            try {
              geminiResponse = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    contents: [{
                      parts: [{
                        text: `You are a helpful codebase assistant analyzing the ${repoId} repository. Answer the following question about the codebase in a clear and helpful way. If the question is about code structure, components, hooks, or patterns, provide specific examples when possible.

Question: ${query}

Provide a detailed answer:`
                      }]
                    }]
                  })
                }
              );
              
              responseData = await geminiResponse.json();
              
              // Check if we got an error about model not found
              if (responseData.error) {
                if (responseData.error.message?.includes('not found')) {
                  continue; // Try next model
                } else {
                  // Other error (auth, rate limit, etc.)
                  throw new Error(responseData.error.message || 'Gemini API error');
                }
              }
              
              // Success!
              if (geminiResponse.ok && responseData.candidates) {
                successfulModel = model;
                break;
              }
            } catch (err: any) {
              // If it's a JSON parse error, the response might be an error
              if (err.message?.includes('not found') || err.message?.includes('404')) {
                continue;
              }
              // Re-throw other errors
              throw err;
            }
          }
          
          if (!geminiResponse || !successfulModel || !responseData) {
            throw new Error('No available Gemini models found. Please check your API key and model access.');
          }
          
          // Check for errors in response
          if (responseData.error) {
            throw new Error(responseData.error.message || 'Gemini API error');
          }
          
          const geminiContent = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
          
          if (geminiContent) {
            return {
              id: Date.now().toString(),
              role: 'assistant',
              content: geminiContent,
              sources: MOCK_SOURCES,
              timestamp: new Date(),
            };
          }
        } catch (geminiError: any) {
          // Fall through to mock response
        }
      }
      
      // Fallback to mock responses
      // Simulate streaming delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate different responses based on query content
      const queryLower = query.toLowerCase();
      const repoName = repoId === 'react' ? 'React' : repoId === 'vscode' ? 'VS Code' : repoId === 'next' ? 'Next.js' : 'this repository';
      
      let content = '';
      let sources = MOCK_SOURCES;
      
      // Repository-specific responses for the 4 suggested questions
      if (queryLower.includes('how is state management handled') || queryLower === 'how is state management handled?') {
        if (repoId === 'react') {
          content = `React uses a sophisticated state management system built around the **Fiber architecture** and **hooks API**.

**Core State Management:**
- **useState Hook**: Primary mechanism for local component state
- **useReducer**: For complex state logic with reducers
- **Context API**: For sharing state across component trees
- **Fiber Reconciler**: Manages state updates and re-renders efficiently

**State Update Mechanism:**
1. State changes trigger reconciliation
2. Fiber tree is traversed to determine what needs updating
3. Batched updates for performance
4. Functional updates ensure consistency: \`setState(prev => prev + 1)\`

**Advanced Patterns:**
- **State lifting**: Moving state up to common ancestors
- **Derived state**: Computing values from props/state
- **State machines**: Using libraries like XState for complex flows

React's state management is designed for predictable updates and optimal rendering performance.`;
        } else if (repoId === 'vscode') {
          content = `VS Code uses a **multi-layered state management architecture** combining several patterns:

**State Management Layers:**
1. **Configuration Service**: Manages user settings, workspace settings, and defaults
2. **Extension Host State**: Isolated state for each extension
3. **Editor State**: Per-editor instance state (cursor, selection, viewport)
4. **Workbench State**: Global UI state (panels, views, layout)

**Key Patterns:**
- **Event-driven architecture**: State changes emit events
- **Observable pattern**: Using RxJS for reactive state streams
- **Service-based**: State encapsulated in services (ConfigurationService, EditorService)
- **Immutable updates**: State changes create new state objects

**State Storage:**
- **In-memory**: Active state during session
- **Persistent storage**: Settings, workspace state saved to disk
- **Extension storage**: Extension-specific state in \`.vscode\` folders

**State Synchronization:**
- Settings sync across devices
- Workspace state persistence
- Extension state isolation prevents conflicts

VS Code's architecture ensures state is managed efficiently across thousands of files and extensions.`;
        } else if (repoId === 'next') {
          content = `Next.js provides **multiple state management strategies** depending on your needs:

**Built-in State Management:**
1. **React State**: useState, useReducer for component-level state
2. **Server Components**: State managed on the server (Next.js 13+)
3. **Route State**: URL-based state via query params and route segments

**Client-Side State:**
- **React Context**: For app-wide client state
- **Zustand/Redux**: For complex global state
- **SWR/React Query**: For server state synchronization

**Server-Side State:**
- **Server Components**: No client-side JavaScript, state on server
- **Server Actions**: Mutations that run on the server
- **Route Handlers**: API routes for state operations

**Data Fetching Patterns:**
- **Static Generation**: State determined at build time
- **Server-Side Rendering**: State fetched on each request
- **Incremental Static Regeneration**: Hybrid approach

**State Hydration:**
- Server-rendered state is hydrated on the client
- Minimizes client-side JavaScript
- Optimized for performance and SEO

Next.js combines React's state management with server-side capabilities for a comprehensive solution.`;
        }
      } else if (queryLower.includes('explain the main entry point') || queryLower === 'explain the main entry point') {
        if (repoId === 'react') {
          content = `React's main entry point is **\`packages/react/index.js\`**, which exports the core React API.

**Entry Point Structure:**
\`\`\`javascript
// Main exports
export { useState, useEffect, useCallback, ... } from './ReactHooks';
export { createElement } from './ReactElement';
export { Component, PureComponent } from './ReactBaseClasses';
\`\`\`

**Initialization Flow:**
1. **ReactDOM.render()** or **createRoot()**: Entry for rendering
2. **FiberRoot**: Root of the Fiber tree is created
3. **Scheduler**: Starts the work loop
4. **Reconciler**: Begins diffing and updating

**Key Entry Files:**
- \`React.js\`: Core React API exports
- \`ReactDOM.js\`: DOM-specific rendering
- \`ReactDOMServer.js\`: Server-side rendering
- \`react/index.js\`: Public API entry point

**Bootstrap Process:**
1. Create root container
2. Initialize Fiber tree
3. Schedule initial render
4. Begin reconciliation process

The entry point sets up React's rendering pipeline and makes all core APIs available.`;
        } else if (repoId === 'vscode') {
          content = `VS Code's main entry point is **\`src/main.js\`**, which bootstraps the entire application.

**Entry Point Flow:**
1. **main.js**: Initializes the Electron app
2. **bootstrap.js**: Sets up the application shell
3. **workbench.js**: Creates the workbench UI
4. **Extension Host**: Launches extension processes

**Key Entry Files:**
- \`src/main.js\`: Electron main process entry
- \`src/vs/workbench/workbench.js\`: Workbench initialization
- \`src/vs/workbench/electron-browser/main.js\`: Browser window setup
- \`src/vs/platform/instantiation/common/instantiationService.ts\`: Dependency injection

**Initialization Sequence:**
\`\`\`typescript
// Main process
main() → bootstrap() → createWorkbench() → startExtensionHost()
\`\`\`

**Architecture Layers:**
1. **Electron Shell**: Window management
2. **Workbench**: UI framework
3. **Services**: Core functionality (editor, file system, etc.)
4. **Extensions**: Plugin system

**Startup Process:**
- Loads configuration
- Initializes services
- Creates workbench UI
- Loads extensions
- Restores previous session state

VS Code's entry point orchestrates the entire application lifecycle from startup to shutdown.`;
        } else if (repoId === 'next') {
          content = `Next.js has **multiple entry points** depending on the context:

**Development Entry Point:**
- **\`next dev\`**: Starts development server
- Entry: \`packages/next/bin/next\`
- Initializes: Dev server, hot reloading, error overlay

**Production Entry Point:**
- **\`next start\`**: Starts production server
- Entry: \`server.js\` in your app directory
- Initializes: Optimized server, static file serving

**Application Entry Points:**
1. **\`pages/_app.js\`** (Pages Router): Wraps all pages
2. **\`app/layout.js\`** (App Router): Root layout component
3. **\`pages/_document.js\`**: Custom HTML document structure

**Server Entry:**
\`\`\`javascript
// next-server.js
const next = require('next');
const app = next({ dev });
const handler = app.getRequestHandler();
\`\`\`

**Client Entry:**
- **\`_next/static/chunks/main.js\`**: Client-side React bundle
- Hydrates server-rendered HTML
- Initializes client-side routing

**Build Entry:**
- **\`next build\`**: Compiles application
- Creates optimized bundles
- Generates static pages

**Key Initialization:**
1. Load configuration (\`next.config.js\`)
2. Initialize router
3. Set up middleware
4. Start server (dev/prod)
5. Handle requests

Next.js entry points adapt based on the runtime environment (dev/prod) and routing strategy (Pages/App Router).`;
        }
      } else if (queryLower.includes('what design patterns are used') || queryLower === 'what design patterns are used?') {
        if (repoId === 'react') {
          content = `React employs several **fundamental design patterns**:

**Core Patterns:**
1. **Component Pattern**: Reusable, composable UI units
2. **Higher-Order Components (HOCs)**: Component composition
3. **Render Props**: Sharing code via render functions
4. **Hooks Pattern**: Functional stateful logic
5. **Context Pattern**: Prop drilling alternative

**Architectural Patterns:**
- **Virtual DOM**: Efficient DOM updates
- **Fiber Architecture**: Incremental rendering
- **Reconciliation Algorithm**: Diffing and patching
- **Scheduler**: Priority-based rendering

**State Management Patterns:**
- **Lifting State Up**: Shared state in common ancestor
- **Container/Presenter**: Separation of logic and presentation
- **Flux Pattern**: Unidirectional data flow

**Code Organization:**
- **Feature-based structure**: Group by feature, not type
- **Co-location**: Keep related files together
- **Barrel exports**: Centralized exports

**Performance Patterns:**
- **Memoization**: React.memo, useMemo, useCallback
- **Code splitting**: Lazy loading components
- **Suspense**: Async rendering boundaries

React's patterns emphasize composition, reusability, and performance optimization.`;
        } else if (repoId === 'vscode') {
          content = `VS Code uses a **sophisticated set of design patterns**:

**Core Patterns:**
1. **Service Pattern**: Dependency injection via InstantiationService
2. **Command Pattern**: Actions as commands (undo/redo support)
3. **Observer Pattern**: Event-driven architecture
4. **Adapter Pattern**: Abstracting platform differences
5. **Strategy Pattern**: Pluggable algorithms (themes, languages)

**Architectural Patterns:**
- **Layered Architecture**: Shell → Workbench → Services → Extensions
- **Plugin Architecture**: Extensions as plugins
- **Event Bus**: Centralized event system
- **Service Locator**: Service discovery and registration

**UI Patterns:**
- **View/ViewModel**: Separation of UI and logic
- **Composite Pattern**: Tree structure for UI components
- **Decorator Pattern**: Extending editor functionality

**Extension Patterns:**
- **Extension Host**: Isolated extension execution
- **API Surface**: Controlled extension API
- **Contribution Points**: Extension registration

**Data Patterns:**
- **Repository Pattern**: Abstracting data access
- **Caching**: Multi-level caching strategy
- **Streaming**: Large file handling

**Concurrency Patterns:**
- **Worker Threads**: Background processing
- **Promise-based**: Async operations
- **Cancellation Tokens**: Request cancellation

VS Code's patterns enable extensibility, performance, and maintainability at scale.`;
        } else if (repoId === 'next') {
          content = `Next.js implements **modern web development patterns**:

**Core Patterns:**
1. **Server Components**: React components that run on the server
2. **Islands Architecture**: Selective client-side hydration
3. **Colocation**: Keep related code together
4. **File-based Routing**: Routes defined by file structure

**Rendering Patterns:**
- **Static Site Generation (SSG)**: Pre-render at build time
- **Server-Side Rendering (SSR)**: Render on each request
- **Incremental Static Regeneration (ISR)**: Update static pages
- **Streaming SSR**: Progressive page rendering

**Data Fetching Patterns:**
- **Server Actions**: Server-side mutations
- **Route Handlers**: API endpoints as routes
- **Data Fetching in Components**: Fetch in Server Components
- **Parallel Data Fetching**: Concurrent requests

**Performance Patterns:**
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Built-in image component
- **Font Optimization**: Automatic font loading
- **Bundle Analysis**: Built-in analyzer

**Architecture Patterns:**
- **App Router**: New routing system (Next.js 13+)
- **Pages Router**: Traditional file-based routing
- **Middleware**: Request interception
- **Edge Runtime**: Edge function execution

**State Patterns:**
- **Server State**: Managed on server
- **Client State**: React hooks for UI state
- **URL State**: Query params and route segments

Next.js patterns optimize for performance, SEO, and developer experience.`;
        }
      } else if (queryLower.includes('how are components organized') || queryLower === 'how are components organized?') {
        if (repoId === 'react') {
          content = `React's component organization follows **flexible, scalable patterns**:

**Directory Structure:**
\`\`\`
packages/
  react/
    src/
      React.js          # Core API
      ReactHooks.js     # Hooks implementation
      ReactElement.js   # Element creation
      ReactComponent.js # Component base classes
\`\`\`

**Component Organization:**
1. **Core Components**: Base classes and primitives
2. **Hooks**: Stateful logic (useState, useEffect, etc.)
3. **Reconciler**: Rendering engine
4. **Scheduler**: Work prioritization

**Code Organization Principles:**
- **Co-location**: Related code stays together
- **Feature-based**: Group by feature, not type
- **Barrel exports**: \`index.js\` for clean imports
- **Separation of concerns**: Logic vs. presentation

**Component Hierarchy:**
- **Base Classes**: Component, PureComponent
- **Hooks System**: Functional state management
- **Fiber Nodes**: Internal representation
- **React Elements**: Virtual DOM representation

**File Naming:**
- PascalCase for components
- camelCase for utilities
- Descriptive names reflecting purpose

**Modularity:**
- Small, focused modules
- Clear dependencies
- Reusable abstractions
- Well-defined interfaces

React's organization emphasizes modularity, reusability, and maintainability.`;
        } else if (repoId === 'vscode') {
          content = `VS Code organizes components using a **layered, service-oriented architecture**:

**Directory Structure:**
\`\`\`
src/
  vs/
    workbench/         # UI components
    platform/          # Core services
    editor/            # Editor components
    base/              # Base utilities
\`\`\`

**Component Layers:**
1. **Workbench**: Main UI framework
   - Views, panels, editors
   - Layout management
   - Theme integration

2. **Services**: Core functionality
   - FileService, EditorService
   - ConfigurationService
   - ExtensionService

3. **Editor**: Text editing
   - Monaco Editor integration
   - Language services
   - IntelliSense

4. **Platform**: Cross-platform abstractions
   - File system
   - Network
   - Process management

**Organization Principles:**
- **Service-based**: Components as services
- **Dependency Injection**: Via InstantiationService
- **Interface-based**: Contracts via interfaces
- **Layered**: Clear separation of concerns

**Component Types:**
- **Views**: UI panels (Explorer, Search, etc.)
- **Editors**: Text editors, diff editors
- **Services**: Business logic
- **Commands**: User actions

**Extension Points:**
- **Contribution Points**: Extension registration
- **API Surface**: Public extension API
- **Extension Host**: Isolated execution

**File Organization:**
- Feature-based directories
- Service files per feature
- Clear module boundaries
- TypeScript for type safety

VS Code's organization enables extensibility and maintainability across millions of lines of code.`;
        } else if (repoId === 'next') {
          content = `Next.js organizes components using **file-based conventions**:

**App Router Structure (Next.js 13+):**
\`\`\`
app/
  layout.js          # Root layout
  page.js            # Route page
  components/        # Shared components
  [slug]/
    page.js          # Dynamic route
\`\`\`

**Pages Router Structure:**
\`\`\`
pages/
  _app.js            # App wrapper
  _document.js       # HTML document
  index.js           # Home page
  about/
    index.js         # About page
\`\`\`

**Component Organization:**
1. **Route Components**: Pages that define routes
2. **Layout Components**: Shared layouts
3. **UI Components**: Reusable components
4. **Server Components**: Server-rendered (default)
5. **Client Components**: Client-rendered (\`'use client'\`)

**Directory Conventions:**
- **\`components/\`**: Shared UI components
- **\`lib/\`**: Utility functions
- **\`app/\`** or **\`pages/\`**: Route definitions
- **\`public/\`**: Static assets

**Component Types:**
- **Server Components**: Default, run on server
- **Client Components**: Interactive, run on client
- **Layout Components**: Shared UI structure
- **Template Components**: Reusable page templates

**File Naming:**
- **Special files**: \`layout.js\`, \`page.js\`, \`loading.js\`
- **Route segments**: Folders define routes
- **Dynamic routes**: \`[param]\` syntax
- **Route groups**: \`(group)\` for organization

**Code Splitting:**
- Automatic per-route
- Dynamic imports for lazy loading
- Shared chunks optimization

Next.js organization is convention-based, reducing configuration while maintaining flexibility.`;
        }
      } else if (queryLower.includes('useState') || queryLower.includes('state') || queryLower.includes('state management')) {
        content = `Based on my analysis of the codebase, I found that the **useState** hook is used extensively throughout the application for managing local component state. 

The pattern you're asking about follows React's standard state management approach:

1. **State Declaration**: \`const [count, setCount] = useState(0)\`
2. **State Updates**: Using the setter function with functional updates for reliability
3. **Effect Integration**: Combined with useEffect for side effects

This pattern is commonly used in ${repoName} for managing UI state.`;
      } else if (queryLower.includes('useEffect') || queryLower.includes('effect') || queryLower.includes('side effect')) {
        content = `The **useEffect** hook in ${repoName} is used to handle side effects in functional components. Here's how it works:

1. **Basic Usage**: \`useEffect(() => { /* effect */ }, [dependencies])\`
2. **Cleanup**: Return a cleanup function to prevent memory leaks
3. **Dependency Array**: Controls when the effect runs
   - Empty array \`[]\`: Runs once on mount
   - With dependencies: Runs when dependencies change
   - No array: Runs on every render

In this codebase, useEffect is commonly used for:
- Subscribing to data sources
- Managing document title updates
- Setting up event listeners
- Performing API calls`;
      } else if (queryLower.includes('component') || queryLower.includes('render') || queryLower.includes('jsx')) {
        content = `Components in ${repoName} are the building blocks of the UI. Here's what I found:

**Component Structure:**
- Functional components using TypeScript
- Props interface definitions for type safety
- Conditional rendering with ternary operators
- List rendering with \`map()\`

**Common Patterns:**
1. **Props Interface**: \`interface ComponentProps { ... }\`
2. **Default Props**: Using default parameters
3. **Event Handlers**: Inline or extracted functions
4. **Conditional Classes**: Using \`cn()\` utility for className composition

The codebase follows React best practices with proper component composition and separation of concerns.`;
      } else if (queryLower.includes('button') || queryLower.includes('click') || queryLower.includes('onclick')) {
        content = `Button components in ${repoName} are implemented with the following features:

**Button Component Features:**
- Multiple variants (primary, secondary)
- Disabled state handling
- Click event handlers
- Customizable styling

**Usage Pattern:**
\`\`\`tsx
<Button onClick={handleClick} variant="primary">
  Click me
</Button>
\`\`\`

The Button component accepts children, onClick handler, variant prop, and disabled state. It's used throughout the application for user interactions.`;
      } else if (queryLower.includes('modal') || queryLower.includes('dialog') || queryLower.includes('popup')) {
        content = `Modal components in ${repoName} provide overlay dialogs for user interactions:

**Modal Features:**
- Open/close state management
- Overlay background
- Click-outside-to-close functionality
- Body scroll lock when open
- Smooth animations

**Implementation:**
- Uses \`useEffect\` to manage body overflow
- Stops event propagation on content click
- Cleanup function restores body scroll
- Conditional rendering based on \`isOpen\` prop

Modals are used for confirmations, forms, and displaying additional content.`;
      } else if (queryLower.includes('import') || queryLower.includes('export') || queryLower.includes('module')) {
        content = `Module imports and exports in ${repoName} follow ES6 module syntax:

**Import Patterns:**
- Named imports: \`import { Component } from './Component'\`
- Default imports: \`import Component from './Component'\`
- Type imports: \`import type { Type } from './types'\`

**Export Patterns:**
- Named exports: \`export const Component = ...\`
- Default exports: \`export default Component\`
- Type exports: \`export interface Type { ... }\`

The codebase uses a clear module structure with:
- Component files in \`/components\`
- Utility functions in \`/utils\`
- Type definitions in \`/types\`
- Hooks in \`/hooks\``;
      } else if (queryLower.includes('hook') || queryLower.includes('custom hook')) {
        content = `Custom hooks in ${repoName} follow React's hook conventions:

**Hook Rules:**
1. Always start with "use" prefix
2. Can call other hooks
3. Must be called at the top level
4. Return values or functions

**Common Hooks in Codebase:**
- \`useState\`: Local state management
- \`useEffect\`: Side effects
- \`useCallback\`: Memoized callbacks
- \`useRef\`: Mutable references

Custom hooks encapsulate reusable logic and can be shared across components.`;
      } else if (queryLower.includes('file') || queryLower.includes('structure') || queryLower.includes('directory')) {
        content = `The file structure in ${repoName} is organized as follows:

**Directory Structure:**
- \`/src/components\`: Reusable UI components
- \`/src/hooks\`: Custom React hooks
- \`/src/utils\`: Utility functions and helpers
- \`/src/types\`: TypeScript type definitions
- \`/src/pages\`: Page-level components
- \`/src/lib\`: Library configurations and API clients

**File Naming:**
- Components: PascalCase (e.g., \`Button.tsx\`)
- Utilities: camelCase (e.g., \`helpers.ts\`)
- Types: camelCase (e.g., \`index.ts\`)

This structure promotes code organization and maintainability.`;
      } else if (queryLower.includes('type') || queryLower.includes('interface') || queryLower.includes('typescript')) {
        content = `TypeScript is used throughout ${repoName} for type safety:

**Type Definitions:**
- Interfaces for component props
- Type aliases for complex types
- Generic types for reusable components
- Union types for variant props

**Common Patterns:**
\`\`\`typescript
interface Props {
  title: string;
  optional?: boolean;
}

type Status = 'pending' | 'ready' | 'error';
\`\`\`

TypeScript helps catch errors at compile time and provides better IDE support with autocomplete and type checking.`;
      } else if (queryLower.includes('styling') || queryLower.includes('css') || queryLower.includes('tailwind')) {
        content = `Styling in ${repoName} uses Tailwind CSS with custom configuration:

**Styling Approach:**
- Utility-first CSS with Tailwind
- Custom color palette in theme
- Responsive design utilities
- Dark mode support

**Common Patterns:**
- Conditional classes with \`cn()\` utility
- Component variants with class combinations
- Custom animations with Framer Motion
- Glass morphism effects

The design system uses a consistent color palette and spacing scale throughout the application.`;
      } else {
        // Generic response for unknown queries
        content = `I've analyzed your question about "${query}" in the ${repoName} codebase.

Based on the code structure, here's what I found:

**Key Observations:**
- The codebase follows modern React patterns
- TypeScript is used for type safety
- Components are well-organized and reusable
- Hooks are used for state and side effects

**Relevant Code Areas:**
- Component implementations in \`/src/components\`
- Custom hooks in \`/src/hooks\`
- Utility functions in \`/src/utils\`

Would you like me to dive deeper into any specific aspect of the codebase?`;
      }
      
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content,
        sources: sources,
        timestamp: new Date(),
      };
    }
  },

  isMockMode(): boolean {
    return useMockData;
  },
};
