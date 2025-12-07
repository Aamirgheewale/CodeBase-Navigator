import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';

export const Topbar: React.FC = () => {
  const { selectedRepo } = useAppContext();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6"
    >
      {/* Left: Current Context */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
          <span className="text-sm font-medium">
            {selectedRepo ? selectedRepo.name : 'No repository selected'}
          </span>
        </div>
        {selectedRepo && (
          <div className="h-5 w-px bg-border" />
        )}
        {selectedRepo && (
          <span className="text-xs text-muted-foreground">
            {selectedRepo.files.toLocaleString()} files • {(selectedRepo.lines / 1000).toFixed(0)}k lines
          </span>
        )}
      </div>
    </motion.header>
  );
};
