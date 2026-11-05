import React, { useEffect, useState } from 'react';
import { FilePlus, Save } from 'lucide-react';
import { VfsNode, createVfsNode } from '../../os/systemLogic';

interface NotepadAppProps {
  initialNode: VfsNode | null;
  nodes: VfsNode[];
  onUpdateNodes: (nodes: VfsNode[]) => void;
}

export const NotepadApp: React.FC<NotepadAppProps> = ({
  initialNode,
  nodes,
  onUpdateNodes,
}) => {
  const [fileName, setFileName] = useState(
    initialNode?.name ?? 'Notatka_Pulpit.txt'
  );
  const [content, setContent] = useState(
    initialNode?.content ??
      'Notatnik systemu Windows 10 Pro\n================================\nWpisz tutaj swoją treść i kliknij "Zapisz na Pulpicie", aby utworzyć lub zaktualizować plik .txt widoczny bezpośrednio na Pulpicie.'
  );
  const [activeNodeId, setActiveNodeId] = useState<string | null>(
    initialNode?.id ?? null
  );
  const [savedBanner, setSavedBanner] = useState<string | null>(null);

  useEffect(() => {
    if (initialNode) {
      setFileName(initialNode.name);
      setContent(initialNode.content ?? '');
      setActiveNodeId(initialNode.id);
    }
  }, [initialNode]);

  const handleSaveToDesktop = () => {
    const cleanName = fileName.trim().endsWith('.txt')
      ? fileName.trim()
      : `${fileName.trim() || 'Notatka'}.txt`;

    if (activeNodeId && nodes.some((n) => n.id === activeNodeId)) {
      const updated = nodes.map((n) =>
        n.id === activeNodeId
          ? {
              ...n,
              name: cleanName,
              content,
              sizeBytes: Math.max(12, content.length),
            }
          : n
      );
      onUpdateNodes(updated);
      setSavedBanner(`Zaktualizowano plik "${cleanName}"`);
    } else {
      const updated = createVfsNode(nodes, {
        name: cleanName,
        type: 'file',
        parentId: 'desktop',
        content,
      });
      onUpdateNodes(updated);
      const newest = updated[updated.length - 1];
      setActiveNodeId(newest.id);
      setFileName(newest.name);
      setSavedBanner(`Zapisano nowy plik "${newest.name}" na Pulpicie`);
    }
  };

  const handleNewDocument = () => {
    setActiveNodeId(null);
    setFileName('Nowy_dokument.txt');
    setContent('');
    setSavedBanner('Utworzono pusty dokument');
  };

  const lineCount = content.split('\n').length;

  return (
    <div className="flex flex-col h-full bg-white text-slate-900">
      {/* Menu / Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-[#f5f6f7] border-b border-slate-200 text-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleNewDocument}
            className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded flex items-center gap-1.5 font-medium"
          >
            <FilePlus className="w-3.5 h-3.5 text-slate-600" />
            Nowy
          </button>
          <label htmlFor="notepad-filename" className="text-slate-500">
            Plik:
          </label>
          <input
            id="notepad-filename"
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono w-44 focus:outline-none focus:border-[#0078d7]"
          />
          <button
            type="button"
            onClick={handleSaveToDesktop}
            className="px-3 py-1 bg-[#0078d7] hover:bg-[#106ebe] text-white rounded flex items-center gap-1.5 font-semibold"
          >
            <Save className="w-3.5 h-3.5" />
            Zapisz na Pulpicie
          </button>
        </div>

        {savedBanner && (
          <span className="text-emerald-700 font-medium">{savedBanner}</span>
        )}
      </div>

      {/* Textarea */}
      <textarea
        aria-label="Edytor tekstu Notatnika"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 w-full p-3 font-mono text-xs leading-relaxed text-slate-900 focus:outline-none resize-none select-text"
      />

      {/* Notepad Status Bar */}
      <div className="px-3 py-1 bg-[#f5f6f7] border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600 font-mono tabular-nums">
        <span>
          Wiersze: {lineCount} · Znaki: {content.length}
        </span>
        <span>100% · Windows (CRLF) · UTF-8</span>
      </div>
    </div>
  );
};
