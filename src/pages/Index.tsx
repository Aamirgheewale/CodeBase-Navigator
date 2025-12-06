import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { InspectorPanel } from '@/components/InspectorPanel';
import { GraphView } from './GraphView';
import { ChatView } from './ChatView';

const Index = () => {
  const { viewMode } = useAppContext();

  return (
    <div className="h-screen w-full flex overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <Topbar />

        {/* Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main View */}
          <main className="flex-1 overflow-hidden relative">
            <AnimatePresence mode="wait">
              {viewMode === 'graph' ? (
                <motion.div
                  key="graph"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <GraphView />
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <ChatView />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Inspector Panel */}
          <InspectorPanel />
        </div>
      </div>
    </div>
  );
};

export default Index;
