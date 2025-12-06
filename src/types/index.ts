export interface Repository {
  id: string;
  name: string;
  url: string;
  language: string;
  files: number;
  lines: number;
  status: 'pending' | 'ingesting' | 'ready' | 'error';
}

export interface GraphNode {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory' | 'module';
  size?: number;
  language?: string;
  repo: string;
}

export interface GraphLink {
  source: string;
  target: string;
  type: 'import' | 'export' | 'reference';
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: SourceSnippet[];
  timestamp: Date;
}

export interface SourceSnippet {
  id: string;
  repo: string;
  path: string;
  content: string;
  startLine: number;
  endLine: number;
  relevance: number;
}

export interface FileContent {
  repo: string;
  path: string;
  content: string;
  language: string;
}

export interface IngestProgress {
  repo: string;
  status: 'cloning' | 'parsing' | 'indexing' | 'complete' | 'error';
  progress: number;
  message: string;
}
