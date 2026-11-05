import React, { useState } from 'react';
import {
  Download,
  FilePlus,
  FileText,
  Folder,
  FolderPlus,
  HardDrive,
  Monitor,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import {
  DiskPartition,
  VfsNode,
  createVfsNode,
  emptyRecycleBin,
  moveNodeToRecycleBin,
  restoreNodeFromRecycleBin,
} from '../../os/systemLogic';

interface FileExplorerAppProps {
  nodes: VfsNode[];
  partitions: DiskPartition[];
  initialFolder?: string;
  onUpdateNodes: (nodes: VfsNode[]) => void;
  onOpenFileInNotepad: (node: VfsNode) => void;
}

export const FileExplorerApp: React.FC<FileExplorerAppProps> = ({
  nodes,
  partitions,
  initialFolder = 'this_pc',
  onUpdateNodes,
  onOpenFileInNotepad,
}) => {
  const [currentFolder, setCurrentFolder] = useState<string>(initialFolder);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const navItems = [
    { id: 'this_pc', label: 'Ten komputer', icon: <HardDrive className="w-4 h-4 text-[#0078d7]" /> },
    { id: 'desktop', label: 'Pulpit', icon: <Monitor className="w-4 h-4 text-sky-600" /> },
    { id: 'documents', label: 'Dokumenty', icon: <FileText className="w-4 h-4 text-amber-600" /> },
    { id: 'downloads', label: 'Pobrane', icon: <Download className="w-4 h-4 text-emerald-600" /> },
    { id: 'recycle', label: 'Kosz', icon: <Trash2 className="w-4 h-4 text-slate-600" /> },
  ];

  const visibleNodes = nodes.filter((n) => n.parentId === currentFolder);
  const primaryPartition = partitions.find((p) => p.id === 'part_primary') ?? {
    name: 'Dysk lokalny (C:) Windows 10 Pro',
    totalGb: 511.4,
    freeGb: 486.2,
  };
  const usedGb = Number((primaryPartition.totalGb - primaryPartition.freeGb).toFixed(1));
  const usedPercent = Math.min(100, Math.round((usedGb / primaryPartition.totalGb) * 100));

  const addressLabel =
    currentFolder === 'this_pc'
      ? 'Ten komputer'
      : currentFolder === 'desktop'
      ? 'Ten komputer > Pulpit (C:\\Users\\Administrator\\Desktop)'
      : currentFolder === 'documents'
      ? 'Ten komputer > Dokumenty (C:\\Users\\Administrator\\Documents)'
      : currentFolder === 'downloads'
      ? 'Ten komputer > Pobrane (C:\\Users\\Administrator\\Downloads)'
      : 'Ten komputer > Kosz';

  const handleCreateItem = (type: 'folder' | 'file') => {
    const targetFolder = currentFolder === 'this_pc' || currentFolder === 'recycle' ? 'desktop' : currentFolder;
    const defaultName =
      newItemName.trim() ||
      (type === 'folder' ? 'Nowy folder' : 'Notatka_Windows10.txt');

    const updated = createVfsNode(nodes, {
      name: defaultName,
      type,
      parentId: targetFolder,
      content:
        type === 'file'
          ? `Plik utworzony w Eksploratorze plików Windows 10 Pro: ${defaultName}`
          : undefined,
    });
    onUpdateNodes(updated);
    setNewItemName('');
    if (currentFolder === 'this_pc' || currentFolder === 'recycle') {
      setCurrentFolder('desktop');
    }
    setStatusMessage(`Utworzono "${defaultName}" w katalogu ${targetFolder === 'desktop' ? 'Pulpit' : targetFolder}.`);
  };

  const handleDeleteSelected = () => {
    if (!selectedNodeId) return;
    const updated = moveNodeToRecycleBin(nodes, selectedNodeId);
    onUpdateNodes(updated);
    setSelectedNodeId(null);
    setStatusMessage('Przeniesiono wybrany element do Kosza.');
  };

  const handleRestoreSelected = () => {
    if (!selectedNodeId) return;
    const updated = restoreNodeFromRecycleBin(nodes, selectedNodeId);
    onUpdateNodes(updated);
    setSelectedNodeId(null);
    setStatusMessage('Przywrócono element z Kosza do pierwotnej lokalizacji.');
  };

  return (
    <div className="flex flex-col h-full bg-white text-slate-900 select-none">
      {/* Ribbon Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-[#f5f6f7] border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Nazwa nowego pliku/folderu..."
            aria-label="Nazwa nowego pliku lub folderu"
            className="text-xs px-2.5 py-1 bg-white border border-slate-300 rounded w-48 focus:outline-none focus:border-[#0078d7]"
          />
          <button
            type="button"
            onClick={() => handleCreateItem('folder')}
            className="px-2.5 py-1 text-xs font-medium bg-white hover:bg-slate-100 border border-slate-300 rounded flex items-center gap-1.5"
          >
            <FolderPlus className="w-3.5 h-3.5 text-amber-500" />
            Nowy folder
          </button>
          <button
            type="button"
            onClick={() => handleCreateItem('file')}
            className="px-2.5 py-1 text-xs font-medium bg-white hover:bg-slate-100 border border-slate-300 rounded flex items-center gap-1.5"
          >
            <FilePlus className="w-3.5 h-3.5 text-[#0078d7]" />
            Nowy dokument .txt
          </button>
        </div>

        <div className="flex items-center gap-2">
          {currentFolder === 'recycle' ? (
            <>
              <button
                type="button"
                disabled={!selectedNodeId}
                onClick={handleRestoreSelected}
                className="px-2.5 py-1 text-xs font-medium bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-300 rounded flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                Przywróć
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateNodes(emptyRecycleBin(nodes));
                  setSelectedNodeId(null);
                  setStatusMessage('Opróżniono Kosz systemu Windows 10.');
                }}
                className="px-2.5 py-1 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Opróżnij Kosz
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled={!selectedNodeId}
              onClick={handleDeleteSelected}
              className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-40 border border-slate-300 rounded flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              Usuń do Kosza
            </button>
          )}
        </div>
      </div>

      {/* Address Bar */}
      <div className="px-3 py-1.5 bg-white border-b border-slate-200 flex items-center gap-2 text-xs">
        <span className="text-slate-400 font-medium">Adres:</span>
        <div className="flex-1 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-slate-700 font-mono truncate">
          {addressLabel}
        </div>
      </div>

      {/* Main Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Pane */}
        <aside className="w-48 border-r border-slate-200 bg-[#fbfbfc] p-2 space-y-1 overflow-y-auto shrink-0">
          <div className="text-[11px] font-semibold text-slate-400 px-2 py-1">
            Szybki dostęp
          </div>
          {navItems.map((item) => {
            const active = currentFolder === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setCurrentFolder(item.id);
                  setSelectedNodeId(null);
                }}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 text-xs rounded text-left transition-colors ${
                  active
                    ? 'bg-[#cce8ff] text-slate-900 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Content Pane */}
        <div className="flex-1 p-4 overflow-y-auto">
          {currentFolder === 'this_pc' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-semibold text-slate-500 mb-3">
                  Foldery systemowe (4)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {navItems
                    .filter((i) => i.id !== 'this_pc')
                    .map((folder) => (
                      <button
                        key={folder.id}
                        type="button"
                        onClick={() => setCurrentFolder(folder.id)}
                        className="p-3 rounded border border-slate-200 hover:bg-[#e5f3ff] hover:border-[#99d1ff] flex items-center gap-3 text-left transition-colors"
                      >
                        <div className="p-2 rounded bg-slate-100">{folder.icon}</div>
                        <div>
                          <div className="text-xs font-semibold text-slate-800">{folder.label}</div>
                          <div className="text-[11px] text-slate-500">Folder systemowy</div>
                        </div>
                      </button>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-slate-500 mb-3">
                  Urządzenia i dyski (1)
                </h3>
                <button
                  type="button"
                  onClick={() => setCurrentFolder('desktop')}
                  className="w-full max-w-md p-3.5 rounded border border-slate-200 hover:bg-[#e5f3ff] hover:border-[#99d1ff] flex items-center gap-3.5 text-left transition-colors"
                >
                  <HardDrive className="w-9 h-9 text-[#0078d7] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-900">
                      Windows 10 Pro (C:) — NVMe SSD
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-sm overflow-hidden my-1.5 border border-slate-300">
                      <div
                        className="h-full bg-[#0078d7]"
                        style={{ width: `${Math.max(8, usedPercent)}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-slate-600 tabular-nums">
                      {primaryPartition.freeGb.toFixed(1)} GB wolnych z {primaryPartition.totalGb.toFixed(1)} GB (NTFS)
                    </div>
                  </div>
                </button>
              </div>
            </div>
          ) : visibleNodes.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center text-slate-400">
              <Folder className="w-8 h-8 mb-2 text-slate-300" />
              <p className="text-xs">Ten folder jest pusty.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-1.5 px-2 font-medium">Nazwa</th>
                  <th className="py-1.5 px-2 font-medium">Data modyfikacji</th>
                  <th className="py-1.5 px-2 font-medium">Typ</th>
                  <th className="py-1.5 px-2 font-medium text-right">Rozmiar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleNodes.map((node) => {
                  const selected = node.id === selectedNodeId;
                  return (
                    <tr
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      onDoubleClick={() => {
                        if (node.type === 'file') {
                          onOpenFileInNotepad(node);
                        }
                      }}
                      className={`cursor-pointer transition-colors ${
                        selected ? 'bg-[#cce8ff] text-slate-900' : 'hover:bg-[#e5f3ff]'
                      }`}
                    >
                      <td className="py-2 px-2 flex items-center gap-2 font-medium">
                        {node.type === 'folder' ? (
                          <Folder className="w-4 h-4 text-amber-500 shrink-0 fill-amber-400" />
                        ) : (
                          <FileText className="w-4 h-4 text-[#0078d7] shrink-0" />
                        )}
                        <span>{node.name}</span>
                        {node.type === 'file' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenFileInNotepad(node);
                            }}
                            className="ml-2 px-1.5 py-0.5 text-[10px] bg-white border border-slate-300 rounded text-[#0078d7] hover:bg-sky-50"
                          >
                            Otwórz w Notatniku
                          </button>
                        )}
                      </td>
                      <td className="py-2 px-2 text-slate-500 font-mono tabular-nums">
                        {node.modifiedAt}
                      </td>
                      <td className="py-2 px-2 text-slate-500">
                        {node.type === 'folder' ? 'Folder plików' : 'Dokument tekstowy'}
                      </td>
                      <td className="py-2 px-2 text-right text-slate-500 font-mono tabular-nums">
                        {node.type === 'folder' ? '—' : `${Math.max(1, Math.ceil(node.sizeBytes / 1024))} KB`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="px-3 py-1.5 bg-[#f5f6f7] border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600 tabular-nums">
        <span>
          Elementów: {currentFolder === 'this_pc' ? 5 : visibleNodes.length}
        </span>
        <span>{statusMessage ?? 'Kliknij dwukrotnie plik .txt, aby otworzyć w Notatniku'}</span>
      </div>
    </div>
  );
};
