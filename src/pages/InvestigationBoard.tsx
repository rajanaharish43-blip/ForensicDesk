import React, { useState, useCallback, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useCaseStore } from '../store/caseStore';
import { 
  ReactFlow, 
  Controls, 
  Background, 
  applyNodeChanges, 
  applyEdgeChanges,
  addEdge
} from '@xyflow/react';
import type {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CustomNode } from '../components/board/CustomNode';
import { Plus } from 'lucide-react';
import type { BoardNodeData } from '../types';

const nodeTypes = {
  custom: CustomNode,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export const InvestigationBoard: React.FC = () => {
  const { id } = useParams();
  const { cases, updateBoard } = useCaseStore();
  const currentCase = cases.find(c => c.id === id);

  const [nodes, setNodes] = useState<Node[]>(currentCase?.board?.nodes || initialNodes);
  const [edges, setEdges] = useState<Edge[]>(currentCase?.board?.edges || initialEdges);
  const [showAddMenu, setShowAddMenu] = useState(false);

  // Auto-save to store when nodes or edges change
  useEffect(() => {
    if (currentCase) {
      updateBoard(currentCase.id, nodes, edges);
    }
  }, [nodes, edges, currentCase, updateBoard]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) => {
      const edgeLabel = prompt('Enter relationship (e.g., executed, connected to, downloaded):') || undefined;
      const newEdge = {
        ...params,
        animated: true,
        style: { stroke: '#60a5fa' },
        label: edgeLabel,
        labelStyle: { fill: '#cbd5e1', fontWeight: 500, fontSize: 12 },
        labelBgStyle: { fill: '#171717' },
        labelBgPadding: [4, 4]
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    []
  );

  if (!currentCase) {
    return <Navigate to="/" replace />;
  }

  const addNode = (type: BoardNodeData['type']) => {
    const label = prompt(`Enter label for ${type}:`);
    if (!label) return;

    const newNode: Node = {
      id: `node_${Date.now()}`,
      type: 'custom',
      position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
      data: { type, label } as Record<string, unknown>,
    };
    setNodes((nds) => [...nds, newNode]);
    setShowAddMenu(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] relative">
      <div className="flex items-center justify-between mb-4 z-10 absolute top-0 left-0 w-full p-4 pointer-events-none">
        <div className="pointer-events-auto bg-neutral-900/80 backdrop-blur-sm p-3 rounded-lg border border-neutral-800">
          <h2 className="text-xl font-bold text-white tracking-tight">Investigation Board</h2>
          <p className="text-xs text-neutral-400">Map relationships and attack paths.</p>
        </div>
        
        <div className="relative pointer-events-auto">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Add Entity
          </button>
          
          {showAddMenu && (
            <div className="absolute top-12 right-0 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl w-48 overflow-hidden z-50">
              {(['IP', 'User', 'Process', 'File', 'Domain', 'Event'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => addNode(type)}
                  className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors border-b border-neutral-800/50 last:border-0"
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-neutral-950"
          colorMode="dark"
        >
          <Background color="#333" gap={16} />
          <Controls className="!bg-neutral-900 !border-neutral-800 !fill-neutral-400" />
        </ReactFlow>
      </div>
    </div>
  );
};
