import { useRef, useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ForceGraph2D from 'react-force-graph-2d';
import { useQuery } from '@tanstack/react-query';
import { ZoomIn, ZoomOut, Maximize, RotateCcw } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useAppContext } from '@/context/AppContext';
import { EmptyState } from '@/components/EmptyState';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import type { GraphNode } from '@/types';

export const GraphView: React.FC = () => {
  const { selectedRepo, setInspectorFile, setHighlightedLines, setSelectedNode } = useAppContext();
  const graphRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);

  const { data: graphData, isLoading } = useQuery({
    queryKey: ['graph', selectedRepo?.id],
    queryFn: () => apiClient.getGraph(selectedRepo!.id),
    enabled: !!selectedRepo,
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleNodeClick = useCallback(async (node: any) => {
    if (node.type === 'file') {
      setSelectedNode(node as GraphNode);
      const file = await apiClient.getFile(node.repo, node.path);
      setInspectorFile(file);
      setHighlightedLines(null);
    }
  }, [setInspectorFile, setHighlightedLines, setSelectedNode]);

  const handleNodeHover = useCallback((node: any) => {
    setHoveredNode(node as GraphNode | null);
    document.body.style.cursor = node ? 'pointer' : 'default';
  }, []);

  const nodeCanvasObject = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.name;
    const fontSize = Math.max(10 / globalScale, 3);
    const isHovered = hoveredNode?.id === node.id;
    const isFile = node.type === 'file';
    
    // Node size based on type
    const size = isFile ? (node.size ? Math.sqrt(node.size) / 20 : 4) : 6;
    const nodeRadius = Math.max(size, 3);

    // Draw glow effect for hovered nodes
    if (isHovered) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius + 8, 0, 2 * Math.PI);
      const gradient = ctx.createRadialGradient(node.x, node.y, nodeRadius, node.x, node.y, nodeRadius + 12);
      gradient.addColorStop(0, 'rgba(124, 58, 237, 0.4)');
      gradient.addColorStop(1, 'rgba(124, 58, 237, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // Draw node
    ctx.beginPath();
    ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI);
    ctx.fillStyle = isHovered 
      ? '#06b6d4' // accent color
      : isFile 
        ? '#7c3aed' // primary color
        : '#374151'; // directory color
    ctx.fill();

    // Draw border
    ctx.strokeStyle = isHovered ? '#06b6d4' : 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw label
    if (globalScale > 0.8 || isHovered) {
      ctx.font = `${isHovered ? 'bold ' : ''}${fontSize}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isHovered ? '#fff' : 'rgba(255,255,255,0.7)';
      ctx.fillText(label, node.x, node.y + nodeRadius + fontSize + 2);
    }
  }, [hoveredNode]);

  const handleZoomIn = () => graphRef.current?.zoom(graphRef.current.zoom() * 1.5, 400);
  const handleZoomOut = () => graphRef.current?.zoom(graphRef.current.zoom() / 1.5, 400);
  const handleReset = () => graphRef.current?.zoomToFit(400, 50);
  const handleCenter = () => graphRef.current?.centerAt(0, 0, 400);

  if (!selectedRepo) {
    return (
      <div className="h-full flex items-center justify-center">
        <EmptyState
          type="repo"
          title="Select a repository"
          description="Choose a repository from the sidebar to explore its code graph"
        />
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSkeleton variant="graph" className="h-full" />;
  }

  return (
    <div ref={containerRef} className="h-full relative overflow-hidden bg-gradient-radial">
      {/* Graph */}
      {graphData && (
        <ForceGraph2D
          ref={graphRef}
          width={dimensions.width}
          height={dimensions.height}
          graphData={graphData}
          nodeCanvasObject={nodeCanvasObject}
          nodePointerAreaPaint={(node, color, ctx) => {
            const size = node.type === 'file' ? 8 : 10;
            ctx.beginPath();
            ctx.arc(node.x!, node.y!, size, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
          }}
          onNodeClick={handleNodeClick}
          onNodeHover={handleNodeHover}
          linkColor={() => 'rgba(255,255,255,0.1)'}
          linkWidth={1}
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={2}
          linkDirectionalParticleSpeed={0.005}
          linkDirectionalParticleColor={() => '#7c3aed'}
          backgroundColor="transparent"
          cooldownTicks={100}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}
        />
      )}

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1.5 glass-panel rounded-xl"
      >
        <button
          onClick={handleZoomIn}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-border mx-1" />
        <button
          onClick={handleCenter}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
          aria-label="Center graph"
        >
          <Maximize className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
          aria-label="Reset view"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </motion.div>

      {/* Hovered Node Info */}
      <AnimatePresence>
        {hoveredNode && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-4 right-4 glass-panel rounded-lg p-3 max-w-xs"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${hoveredNode.type === 'file' ? 'bg-primary' : 'bg-muted-foreground'}`} />
              <span className="font-medium text-sm">{hoveredNode.name}</span>
            </div>
            <p className="text-xs text-muted-foreground font-mono truncate">
              {hoveredNode.path}
            </p>
            {hoveredNode.type === 'file' && (
              <p className="text-xs text-accent mt-1">Click to view</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute bottom-6 left-6 glass-panel rounded-lg p-3"
      >
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">File</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted-foreground" />
            <span className="text-muted-foreground">Directory</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
