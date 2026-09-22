import React, { useCallback, useState } from 'react';
import Papa from 'papaparse';
import { UploadCloud } from 'lucide-react';
import { useCaseStore } from '../store/caseStore';
import { calculateFileHash } from '../engine/hashing';
import type { Artifact } from '../types';

interface EvidenceUploaderProps {
  caseId: string;
}

export const EvidenceUploader: React.FC<EvidenceUploaderProps> = ({ caseId }) => {
  const { addEvidence } = useCaseStore();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    try {
      const hashes = await calculateFileHash(file);
      
      let parsedArtifacts: Artifact[] = [];
      const extension = file.name.split('.').pop()?.toLowerCase() || '';

      if (extension === 'csv') {
        const text = await file.text();
        const results = Papa.parse(text, { header: true, skipEmptyLines: true });
        parsedArtifacts = results.data.map((row: any) => ({
          id: '', // Will be assigned by store
          evidenceId: '',
          timestamp: row.timestamp || row.Time || row.time || undefined,
          type: row.type || row.Event || row.event || 'Log',
          data: row,
          isRelevant: false,
          notes: ''
        }));
      } else if (extension === 'json') {
        const text = await file.text();
        const results = JSON.parse(text);
        const dataArray = Array.isArray(results) ? results : [results];
        parsedArtifacts = dataArray.map((row: any) => ({
          id: '',
          evidenceId: '',
          timestamp: row.timestamp || row.Time || row.time || undefined,
          type: row.type || row.Event || row.event || 'Log',
          data: row,
          isRelevant: false,
          notes: ''
        }));
      } else {
        alert('Only CSV and JSON files are supported for now.');
        setIsProcessing(false);
        return;
      }

      addEvidence(caseId, {
        name: file.name,
        type: extension.toUpperCase(),
        hash: hashes.sha256,
        md5: hashes.md5,
        size: file.size,
        artifacts: parsedArtifacts,
        notes: ''
      });
    } catch (err) {
      console.error(err);
      alert('Error processing file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  }, [caseId]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center transition-colors ${
        isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-neutral-800 bg-neutral-900'
      }`}
    >
      <UploadCloud className={`w-12 h-12 mb-4 ${isDragging ? 'text-blue-400' : 'text-neutral-500'}`} />
      <h3 className="text-lg font-medium text-white mb-2">
        {isProcessing ? 'Processing Evidence...' : 'Import Evidence'}
      </h3>
      <p className="text-sm text-neutral-400 text-center mb-6 max-w-sm">
        Drag and drop CSV or JSON datasets here, or click to browse. Files are processed locally.
      </p>
      <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium cursor-pointer transition-colors shadow-sm">
        Browse Files
        <input 
          type="file" 
          className="hidden" 
          accept=".csv,.json" 
          onChange={handleFileInput}
          disabled={isProcessing}
        />
      </label>
    </div>
  );
};
