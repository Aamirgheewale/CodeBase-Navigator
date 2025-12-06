import { motion } from 'framer-motion';
import { 
  Network, MessageSquare, RefreshCw, Sparkles, 
  ChevronRight, Zap
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useAppContext } from '@/context/AppContext';
import { RepoCard } from './RepoCard';
import { LoadingSkeleton } from './LoadingSkeleton';
import { cn } from '@/lib/utils';

export const Sidebar: React.FC = () => {
  const { 
    selectedRepo, 
    setSelectedRepo, 
    viewMode, 
    setViewMode 
  } = useAppContext();

  const { data: repos, isLoading, refetch } = useQuery({
    queryKey: ['repositories'],
    queryFn: () => apiClient.getRepositories(),
  });

  const viewModes = [
    { id: 'graph' as const, label: 'Graph View', icon: Network },
    { id: 'chat' as const, label: 'Chat', icon: MessageSquare },
  ];

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-72 h-full bg-sidebar border-r border-sidebar-border flex flex-col"
    >
      {/* Logo */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary"
          >
            <Zap className="w-5 h-5 text-primary-foreground" />
          </motion.div>
          <div>
            <h1 className="font-bold text-lg">CodeNav</h1>
            <p className="text-xs text-muted-foreground">Explore any codebase</p>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex gap-2 p-1 bg-secondary/50 rounded-lg">
          {viewModes.map(mode => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all',
                  viewMode === mode.id
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Repositories */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Repositories
          </span>
          <motion.button
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
            onClick={() => refetch()}
            className="p-1.5 rounded-md hover:bg-secondary transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
          </motion.button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-3 pb-4 space-y-1">
          {isLoading ? (
            <>
              <LoadingSkeleton variant="card" />
              <LoadingSkeleton variant="card" />
              <LoadingSkeleton variant="card" />
            </>
          ) : Array.isArray(repos) ? (
            repos.map(repo => (
              <RepoCard
                key={repo.id}
                repo={repo}
                isSelected={selectedRepo?.id === repo.id}
                onClick={() => setSelectedRepo(repo)}
              />
            ))
          ) : null}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 hover:border-primary/40 transition-colors group"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">AI Insights</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </motion.button>
      </div>
    </motion.aside>
  );
};
