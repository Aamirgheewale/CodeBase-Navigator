import { motion } from 'framer-motion';
import { GitBranch, FileCode, Code2, Check, Loader2, AlertCircle } from 'lucide-react';
import type { Repository } from '@/types';
import { cn } from '@/lib/utils';

interface RepoCardProps {
  repo: Repository;
  isSelected: boolean;
  onClick: () => void;
}

const statusConfig = {
  pending: { icon: Loader2, color: 'text-muted-foreground', label: 'Pending' },
  ingesting: { icon: Loader2, color: 'text-accent animate-spin', label: 'Ingesting...' },
  ready: { icon: Check, color: 'text-emerald-400', label: 'Ready' },
  error: { icon: AlertCircle, color: 'text-destructive', label: 'Error' },
};

const languageColors: Record<string, string> = {
  JavaScript: 'bg-yellow-400',
  TypeScript: 'bg-blue-400',
  Python: 'bg-green-400',
  Rust: 'bg-orange-400',
  Go: 'bg-cyan-400',
};

export const RepoCard: React.FC<RepoCardProps> = ({ repo, isSelected, onClick }) => {
  const status = statusConfig[repo.status];
  const StatusIcon = status.icon;

  return (
    <motion.button
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'w-full text-left p-3 rounded-lg transition-all duration-200',
        'border border-transparent',
        isSelected
          ? 'glass-panel glow-primary border-primary/50'
          : 'hover:bg-secondary/50'
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
          isSelected ? 'bg-primary/20' : 'bg-secondary'
        )}>
          <GitBranch className={cn(
            'w-5 h-5',
            isSelected ? 'text-primary' : 'text-muted-foreground'
          )} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-sm truncate">{repo.name}</span>
            <div className={cn(
              'w-2 h-2 rounded-full shrink-0',
              languageColors[repo.language] || 'bg-muted'
            )} />
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <FileCode className="w-3 h-3" />
              {repo.files.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Code2 className="w-3 h-3" />
              {(repo.lines / 1000).toFixed(0)}k
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <StatusIcon className={cn('w-4 h-4', status.color)} />
        </div>
      </div>
    </motion.button>
  );
};
