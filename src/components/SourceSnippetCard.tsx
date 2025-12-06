import { motion } from 'framer-motion';
import { FileCode, ExternalLink, GitBranch } from 'lucide-react';
import type { SourceSnippet } from '@/types';
import { cn } from '@/lib/utils';

interface SourceSnippetCardProps {
  snippet: SourceSnippet;
  onOpen: () => void;
  index: number;
}

export const SourceSnippetCard: React.FC<SourceSnippetCardProps> = ({ 
  snippet, 
  onOpen,
  index 
}) => {
  const relevanceColor = snippet.relevance > 0.9 
    ? 'text-emerald-400' 
    : snippet.relevance > 0.7 
      ? 'text-accent' 
      : 'text-muted-foreground';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="glass-panel rounded-lg overflow-hidden glass-hover group cursor-pointer"
      onClick={onOpen}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-secondary/30 border-b border-border">
        <div className="flex items-center gap-2 min-w-0">
          <GitBranch className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground truncate">
            {snippet.repo}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('text-xs font-medium', relevanceColor)}>
            {Math.round(snippet.relevance * 100)}%
          </span>
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ExternalLink className="w-3.5 h-3.5 text-primary" />
          </motion.div>
        </div>
      </div>

      {/* File Path */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border/50">
        <FileCode className="w-3.5 h-3.5 text-primary shrink-0" />
        <span className="text-xs font-mono text-foreground truncate">
          {snippet.path}
        </span>
        <span className="text-xs text-muted-foreground shrink-0">
          L{snippet.startLine}-{snippet.endLine}
        </span>
      </div>

      {/* Code Preview */}
      <div className="p-3 bg-background/50">
        <pre className="text-xs font-mono text-muted-foreground overflow-x-auto scrollbar-thin">
          <code>{snippet.content}</code>
        </pre>
      </div>
    </motion.div>
  );
};
