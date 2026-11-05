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
    <div className="flex flex-col h-[calc(100vh-120px)] min-h-[560px] relative">
      <div className="flex items-center justify-between mb-4 z-10 absolute top-0 left-0 w-full p-4 pointer-events-none">
        <div className="pointer-events-auto bg-[#11161d]/95 p-3 border border-[#33404f]">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-blue-300">Relationship analysis</p>
          <h2 className="mt-1 text-xl font-semibold text-white tracking-tight">Investigation board</h2>
          <p className="text-xs text-neutral-500">Map entities, evidence, and attack paths.</p>
        </div>
        
        <div className="relative pointer-events-auto">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-slate-950 px-4 py-2 font-medium transition-colors shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Add Entity
          </button>
          
          {showAddMenu && (
            <div className="absolute top-12 right-0 bg-[#11161d] border border-[#33404f] shadow-xl w-48 overflow-hidden z-50">
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

      <div className="flex-1 bg-[#0a0d11] border border-[#26303b] overflow-hidden relative">
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
