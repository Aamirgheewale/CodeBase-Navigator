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

const MOCK_FILE_CONTENT = `import React, { useState, useEffect } from 'react';
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

export default App;`;

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
    try {
      const response = await api.get<Repository[]>('/repos');
      return response.data;
    } catch {
      useMockData = true;
      return MOCK_REPOS;
    }
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
    try {
      const response = await api.get<GraphData>(`/graph?repo=${repoId}`);
      return response.data;
    } catch {
      return MOCK_GRAPH_DATA;
    }
  },

  async getFile(repo: string, path: string): Promise<FileContent> {
    try {
      const response = await api.get<FileContent>(`/file?repo=${repo}&path=${path}`);
      return response.data;
    } catch {
      return {
        repo,
        path,
        content: MOCK_FILE_CONTENT,
        language: 'typescript',
      };
    }
  },

  async chat(query: string, repoId: string): Promise<ChatMessage> {
    try {
      const response = await api.post<ChatMessage>('/chat', { query, repo: repoId });
      return response.data;
    } catch {
      // Simulate streaming delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Based on my analysis of the codebase, I found that the **useState** hook is used extensively throughout the application for managing local component state. 

The pattern you're asking about follows React's standard state management approach:

1. **State Declaration**: \`const [count, setCount] = useState(0)\`
2. **State Updates**: Using the setter function with functional updates for reliability
3. **Effect Integration**: Combined with useEffect for side effects

This pattern is commonly used in ${repoId === 'react' ? 'the React codebase itself' : 'this repository'} for managing UI state.`,
        sources: MOCK_SOURCES,
        timestamp: new Date(),
      };
    }
  },

  isMockMode(): boolean {
    return useMockData;
  },
};
