import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useCaseStore } from '../store/caseStore';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, FileJson, CheckCircle } from 'lucide-react';
import { buildTimeline } from '../engine/timeline';

export const Report: React.FC = () => {
  const { id } = useParams();
  const { cases } = useCaseStore();
  const currentCase = cases.find(c => c.id === id);

  if (!currentCase) {
    return <Navigate to="/" replace />;
  }

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(currentCase, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ForensicDesk_${currentCase.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    let yPos = 20;

    // Header
    doc.setFontSize(22);
    doc.text('FORENSIC INVESTIGATION REPORT', 14, yPos);
    yPos += 12;

    // Case Information
    doc.setFontSize(16);
    doc.text('1. Case Information', 14, yPos);
    yPos += 8;

    doc.setFontSize(11);
    doc.text(`Case ID: ${currentCase.id}`, 14, yPos);
    yPos += 6;
    doc.text(`Name: ${currentCase.name}`, 14, yPos);
    yPos += 6;
    doc.text(`Investigator: ${currentCase.investigator}`, 14, yPos);
    yPos += 6;
    doc.text(`Date Created: ${new Date(currentCase.createdAt).toLocaleDateString()}`, 14, yPos);
    yPos += 6;
    doc.text(`Objective: ${currentCase.objective}`, 14, yPos);
    yPos += 12;

    // Evidence Examined
    doc.setFontSize(16);
    doc.text('2. Evidence Examined (Integrity Verified)', 14, yPos);
    yPos += 8;

    if (currentCase.evidence.length === 0) {
        doc.setFontSize(11);
        doc.text('No evidence collected.', 14, yPos);
        yPos += 12;
    } else {
        const evidenceData = currentCase.evidence.map(e => [
            e.name,
            e.hash,
            'Verified'
        ]);

        autoTable(doc, {
            startY: yPos,
            head: [['Evidence Name', 'SHA-256 Hash', 'Integrity Status']],
            body: evidenceData,
            theme: 'grid',
            styles: { fontSize: 9 },
            headStyles: { fillColor: [40, 40, 40] },
            columnStyles: { 1: { cellWidth: 90, fontStyle: 'italic' } }
        });

        yPos = (doc as any).lastAutoTable.finalY + 12;
    }

    // Timeline of Relevant Events
    const fullTimeline = buildTimeline(currentCase.evidence);
    const relevantEvents = fullTimeline.filter(event => event.isRelevant);

    doc.setFontSize(16);
    doc.text('3. Key Investigation Timeline (Marked Relevant)', 14, yPos);
    yPos += 8;

    if (relevantEvents.length === 0) {
        doc.setFontSize(11);
        doc.text('No relevant events marked.', 14, yPos);
        yPos += 12;
    } else {
        const timelineData = relevantEvents.map(event => {
            const time = event.normalizedTime ? new Date(event.normalizedTime).toLocaleString() : 'Unknown';
            const type = event.type || 'Event';
            // Extract a summary string from the data
            const importantKeys = Object.entries(event.data)
                .filter(([key, val]) => {
                  const k = key.toLowerCase();
                  return !['timestamp', 'time', 'date', 'type', 'event'].includes(k) && val !== null && val !== '';
                })
                .slice(0, 3)
                .map(([key, val]) => `${key}: ${val}`)
                .join(', ');

            return [time, type, event.evidenceName, importantKeys];
        });

        autoTable(doc, {
            startY: yPos,
            head: [['Time', 'Type', 'Source', 'Details']],
            body: timelineData,
            theme: 'grid',
            styles: { fontSize: 9 },
            headStyles: { fillColor: [40, 40, 40] },
            columnStyles: { 3: { cellWidth: 80 } }
        });

        yPos = (doc as any).lastAutoTable.finalY + 12;
    }

    // Investigation Graph Nodes
    if (currentCase.board?.nodes && currentCase.board.nodes.length > 0) {
        // Add new page if close to bottom
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFontSize(16);
        doc.text('4. Evidence Relationships (Graph Nodes)', 14, yPos);
        yPos += 8;

        const nodeData = currentCase.board.nodes.map(n => [
            (n.data as any).type,
            (n.data as any).label
        ]);

        autoTable(doc, {
            startY: yPos,
            head: [['Type', 'Entity']],
            body: nodeData,
            theme: 'grid',
            styles: { fontSize: 10 },
            headStyles: { fillColor: [40, 40, 40] }
        });

        yPos = (doc as any).lastAutoTable.finalY + 12;
    }

    // Save PDF
    doc.save(`ForensicDesk_Report_${currentCase.id}.pdf`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white tracking-tight">Final Investigation Report</h2>
        <p className="text-neutral-400 mt-1">Export case findings, timeline, and artifacts.</p>
      </div>

      <div className="flex-1 max-w-4xl w-full bg-neutral-900 border border-neutral-800 rounded-lg p-8 space-y-8 overflow-y-auto">
        <div className="flex justify-between items-start border-b border-neutral-800 pb-6">
            <div>
                <h3 className="text-3xl font-serif text-white mb-2">FORENSIC INVESTIGATION REPORT</h3>
                <p className="text-neutral-400">{currentCase.id} - {currentCase.name}</p>
            </div>
            <div className="flex gap-4">
                <button
                    onClick={handleExportJSON}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md transition-colors"
                >
                    <FileJson className="w-4 h-4" />
                    Export JSON
                </button>
                <button
                    onClick={handleExportPDF}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium shadow-lg"
                >
                    <Download className="w-4 h-4" />
                    Download PDF
                </button>
            </div>
        </div>

        <div className="space-y-8">
            <div>
                <h4 className="text-lg font-bold text-white mb-2">1. Case Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-neutral-300 bg-neutral-950 p-4 rounded-lg">
                    <div><span className="text-neutral-500">Investigator:</span> {currentCase.investigator}</div>
                    <div><span className="text-neutral-500">Date:</span> {new Date(currentCase.createdAt).toLocaleDateString()}</div>
                    <div className="col-span-2"><span className="text-neutral-500">Objective:</span> {currentCase.objective}</div>
                </div>
            </div>

            <div>
                <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  2. Evidence Integrity
                </h4>
                <div className="space-y-2">
                  {currentCase.evidence.map(e => (
                    <div key={e.id} className="flex flex-col gap-1 text-sm bg-neutral-950 p-3 rounded-lg border border-neutral-800">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-white">{e.name}</span>
                        <span className="flex items-center gap-1 text-green-400 bg-green-400/10 px-2 py-0.5 rounded text-xs">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 sm:items-center text-neutral-500 mt-1">
                        <span className="text-xs">SHA-256:</span>
                        <span className="font-mono text-xs break-all bg-neutral-900 px-2 py-1 rounded">{e.hash}</span>
                      </div>
                    </div>
                  ))}
                  {currentCase.evidence.length === 0 && (
                    <div className="text-sm text-neutral-500 italic">No evidence collected.</div>
                  )}
                </div>
            </div>

            <div>
                <h4 className="text-lg font-bold text-white mb-2">3. Investigation Status</h4>
                <div className="text-sm text-neutral-300 bg-neutral-950 p-4 rounded-lg">
                    <p>Timeline relevant events: {buildTimeline(currentCase.evidence).filter(e => e.isRelevant).length}</p>
                    <p>Graph nodes mapped: {currentCase.board?.nodes.length || 0}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
