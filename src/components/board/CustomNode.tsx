import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Monitor, User, Server, FileText, Activity, Globe } from 'lucide-react';
import type { BoardNodeData } from '../../types';

export const CustomNode: React.FC<{ data: BoardNodeData; selected: boolean }> = ({ data, selected }) => {
  const getIcon = () => {
    switch (data.type) {
      case 'IP': return <Server className="w-4 h-4 text-orange-400" />;
      case 'User': return <User className="w-4 h-4 text-purple-400" />;
      case 'Process': return <Activity className="w-4 h-4 text-green-400" />;
      case 'File': return <FileText className="w-4 h-4 text-blue-400" />;
      case 'Domain': return <Globe className="w-4 h-4 text-yellow-400" />;
      default: return <Monitor className="w-4 h-4 text-neutral-400" />;
    }
  };

  const getBorderColor = () => {
    switch (data.type) {
      case 'IP': return 'border-orange-500/50';
      case 'User': return 'border-purple-500/50';
      case 'Process': return 'border-green-500/50';
      case 'File': return 'border-blue-500/50';
      case 'Domain': return 'border-yellow-500/50';
      default: return 'border-neutral-700';
    }
  };

  return (
    <div className={`px-4 py-2 shadow-lg rounded-md bg-neutral-900 border-2 transition-all ${getBorderColor()} ${selected ? 'ring-2 ring-white scale-105' : ''}`}>
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-neutral-500" />
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-6 h-6 bg-neutral-950 rounded-full">
          {getIcon()}
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-neutral-500 leading-none mb-1">{data.type}</div>
          <div className="text-sm font-semibold text-white leading-none">{data.label}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-neutral-500" />
    </div>
  );
};
