import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Copy, Check, Presentation } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { cn } from '@/lib/utils';

const DEMO_SCRIPT = [
  "1. Select a repository from the sidebar",
  "2. Explore the graph - click nodes to view files",
  "3. Switch to Chat - ask questions about the code",
  "4. Click source snippets to jump to relevant code",
];

export const Topbar: React.FC = () => {
  const { 
    isPresentMode, 
    setIsPresentMode, 
    demoStartTime, 
    setDemoStartTime,
    selectedRepo 
  } = useAppContext();
  
  const [elapsed, setElapsed] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showScript, setShowScript] = useState(false);

  useEffect(() => {
    if (!demoStartTime) return;
    
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - demoStartTime.getTime()) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [demoStartTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePresent = () => {
    if (isPresentMode) {
      setIsPresentMode(false);
      setDemoStartTime(null);
      setElapsed(0);
    } else {
      setIsPresentMode(true);
      setDemoStartTime(new Date());
    }
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(DEMO_SCRIPT.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

      {/* Center: Demo Timer */}
      <AnimatePresence>
        {isPresentMode && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex items-center gap-4"
          >
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-destructive/10 border border-destructive/20">
              <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              <span className="font-mono text-sm font-semibold text-destructive">
                {formatTime(elapsed)}
              </span>
            </div>
            
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowScript(!showScript)}
                className="p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <Copy className="w-4 h-4" />
              </motion.button>

              <AnimatePresence>
                {showScript && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full mt-2 right-0 w-80 p-4 glass-panel rounded-xl z-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold">Demo Script</span>
                      <button
                        onClick={handleCopyScript}
                        className="p-1.5 rounded-md hover:bg-secondary transition-colors"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <ul className="space-y-2">
                      {DEMO_SCRIPT.map((step, i) => (
                        <li key={i} className="text-xs text-muted-foreground">
                          {step}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePresent}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all',
            isPresentMode
              ? 'bg-destructive text-destructive-foreground'
              : 'bg-primary text-primary-foreground'
          )}
        >
          {isPresentMode ? (
            <>
              <Pause className="w-4 h-4" />
              Stop
            </>
          ) : (
            <>
              <Presentation className="w-4 h-4" />
              Present
            </>
          )}
        </motion.button>
      </div>
    </motion.header>
  );
};
