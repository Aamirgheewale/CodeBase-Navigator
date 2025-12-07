import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Repository, FileContent, GraphNode } from '@/types';

type ViewMode = 'graph' | 'chat';

interface AppState {
  selectedRepo: Repository | null;
  setSelectedRepo: (repo: Repository | null) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  inspectorFile: FileContent | null;
  setInspectorFile: (file: FileContent | null) => void;
  highlightedLines: { start: number; end: number } | null;
  setHighlightedLines: (lines: { start: number; end: number } | null) => void;
  selectedNode: GraphNode | null;
  setSelectedNode: (node: GraphNode | null) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('graph');
  const [inspectorFile, setInspectorFile] = useState<FileContent | null>(null);
  const [highlightedLines, setHighlightedLines] = useState<{ start: number; end: number } | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  return (
    <AppContext.Provider
      value={{
        selectedRepo,
        setSelectedRepo,
        viewMode,
        setViewMode,
        inspectorFile,
        setInspectorFile,
        highlightedLines,
        setHighlightedLines,
        selectedNode,
        setSelectedNode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppState => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
