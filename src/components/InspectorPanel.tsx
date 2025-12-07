import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { X, FileCode, Copy, Check, ExternalLink } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { EmptyState } from './EmptyState';
import { LoadingSkeleton } from './LoadingSkeleton';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export const InspectorPanel: React.FC = () => {
  const { inspectorFile, setInspectorFile, highlightedLines, setHighlightedLines } = useAppContext();
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (editorRef.current && highlightedLines) {
      const editor = editorRef.current;
      
      // Scroll to highlighted lines
      editor.revealLineInCenter(highlightedLines.start);
      
      // Create decoration for highlighted lines
      const decorations = editor.deltaDecorations(
        [],
        [{
          range: {
            startLineNumber: highlightedLines.start,
            startColumn: 1,
            endLineNumber: highlightedLines.end,
            endColumn: 1,
          },
          options: {
            isWholeLine: true,
            className: 'highlighted-line',
            glyphMarginClassName: 'highlighted-glyph',
          },
        }]
      );

      return () => {
        editor.deltaDecorations(decorations, []);
      };
    }
  }, [highlightedLines, inspectorFile]);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleCopy = () => {
    if (inspectorFile) {
      navigator.clipboard.writeText(inspectorFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setInspectorFile(null);
    setHighlightedLines(null);
  };

  return (
    <motion.aside
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-[420px] h-full bg-card border-l border-border flex flex-col"
    >
      {/* Header */}
      <div className="h-12 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Inspector</span>
        </div>
        {inspectorFile && (
          <div className="flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCopy}
              className="p-1.5 rounded-md hover:bg-secondary transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4 text-muted-foreground" />
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="p-1.5 rounded-md hover:bg-secondary transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {inspectorFile ? (
            <motion.div
              key={`editor-${inspectorFile.repo}-${inspectorFile.path}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col"
            >
              {/* File Path */}
              <div className="px-4 py-2 bg-secondary/30 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground truncate">
                    {inspectorFile.repo}
                  </span>
                  <span className="text-xs text-muted-foreground">/</span>
                  <span className="text-xs font-mono text-foreground truncate">
                    {inspectorFile.path}
                  </span>
                </div>
                {highlightedLines && (
                  <div className="mt-1 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    <span className="text-xs text-accent">
                      Lines {highlightedLines.start}-{highlightedLines.end}
                    </span>
                  </div>
                )}
              </div>

              {/* Monaco Editor */}
              <div className="flex-1">
                <Editor
                  key={`${inspectorFile.repo}-${inspectorFile.path}`}
                  height="100%"
                  language={inspectorFile.language}
                  value={inspectorFile.content}
                  theme="vs-dark"
                  onMount={handleEditorDidMount}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 13,
                    fontFamily: 'JetBrains Mono, monospace',
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    padding: { top: 16 },
                    renderLineHighlight: 'gutter',
                    scrollbar: {
                      verticalScrollbarSize: 8,
                      horizontalScrollbarSize: 8,
                    },
                  }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex items-center justify-center"
            >
              <EmptyState
                type="file"
                title="No file selected"
                description="Click on a graph node or source snippet to view its contents here"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
};
