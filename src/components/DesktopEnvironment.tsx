import React, { useEffect, useState } from 'react';
import {
  Activity,
  Bell,
  Calculator,
  FilePlus,
  FileText,
  Folder,
  FolderOpen,
  FolderPlus,
  Globe,
  HardDrive,
  Info,
  Lock,
  Maximize2,
  Minimize2,
  Minus,
  Palette,
  RefreshCw,
  RotateCcw,
  Search,
  Settings,
  Terminal,
  Trash2,
  Volume2,
  Wifi,
  X,
} from 'lucide-react';
import {
  AppId,
  DiskPartition,
  INITIAL_VFS_NODES,
  VfsNode,
  WALLPAPERS,
  createVfsNode,
} from '../os/systemLogic';
import { StartMenu } from './StartMenu';
import { CalculatorApp } from './apps/CalculatorApp';
import { CommandPromptApp } from './apps/CommandPromptApp';
import { EdgeBrowserApp } from './apps/EdgeBrowserApp';
import { FileExplorerApp } from './apps/FileExplorerApp';
import { NotepadApp } from './apps/NotepadApp';
import { SettingsApp } from './apps/SettingsApp';
import { TaskManagerApp } from './apps/TaskManagerApp';
import { WinverModal } from './apps/WinverModal';

interface DesktopEnvironmentProps {
  editionName: string;
  username: string;
  computerName: string;
  partitions: DiskPartition[];
  onRestartInstaller: () => void;
}

interface WindowInstance {
  id: AppId;
  title: string;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  memoryMb: number;
  cpuPercent: number;
}

const DEFAULT_WINDOWS: Record<AppId, Omit<WindowInstance, 'zIndex' | 'minimized' | 'maximized'>> = {
  explorer: {
    id: 'explorer',
    title: 'Ten komputer — Eksplorator plików',
    x: 224,
    y: 32,
    width: 700,
    height: 490,
    memoryMb: 84.2,
    cpuPercent: 1.4,
  },
  cmd: {
    id: 'cmd',
    title: 'Administrator: Wiersz polecenia (cmd.exe)',
    x: 250,
    y: 84,
    width: 700,
    height: 430,
    memoryMb: 18.6,
    cpuPercent: 0.7,
  },
  notepad: {
    id: 'notepad',
    title: 'Notatnik — Windows 10 Pro',
    x: 280,
    y: 95,
    width: 620,
    height: 420,
    memoryMb: 22.4,
    cpuPercent: 0.3,
  },
  taskmgr: {
    id: 'taskmgr',
    title: 'Menedżer zadań',
    x: 260,
    y: 70,
    width: 680,
    height: 450,
    memoryMb: 46.8,
    cpuPercent: 2.1,
  },
  settings: {
    id: 'settings',
    title: 'Ustawienia systemu Windows 10 Pro',
    x: 240,
    y: 56,
    width: 760,
    height: 500,
    memoryMb: 68.0,
    cpuPercent: 0.9,
  },
  calc: {
    id: 'calc',
    title: 'Kalkulator',
    x: 520,
    y: 110,
    width: 320,
    height: 430,
    memoryMb: 19.2,
    cpuPercent: 0.2,
  },
  edge: {
    id: 'edge',
    title: 'Microsoft Edge — Windows 10 Pro',
    x: 235,
    y: 52,
    width: 780,
    height: 490,
    memoryMb: 142.5,
    cpuPercent: 1.8,
  },
  winver: {
    id: 'winver',
    title: 'Informacje o systemie Windows (winver)',
    x: 944,
    y: 32,
    width: 468,
    height: 400,
    memoryMb: 14.0,
    cpuPercent: 0.1,
  },
};

export const DesktopEnvironment: React.FC<DesktopEnvironmentProps> = ({
  editionName,
  username,
  computerName,
  partitions,
  onRestartInstaller,
}) => {
  const [nodes, setNodes] = useState<VfsNode[]>(INITIAL_VFS_NODES);
  const [activeWallpaperId, setActiveWallpaperId] = useState<string>('hero');
  const [taskbarLightMode, setTaskbarLightMode] = useState<boolean>(false);
  const [startMenuOpen, setStartMenuOpen] = useState<boolean>(false);
  const [actionCenterOpen, setActionCenterOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [locked, setLocked] = useState<boolean>(false);
  const [explorerInitialFolder, setExplorerInitialFolder] = useState<string>('this_pc');
  const [notepadTargetNode, setNotepadTargetNode] = useState<VfsNode | null>(
    INITIAL_VFS_NODES[0]
  );
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [clockTime, setClockTime] = useState<string>('12:15');
  const [clockDate, setClockDate] = useState<string>('05.11.2026');
  const [volume, setVolume] = useState<number>(80);
  const [volumeFlyoutOpen, setVolumeFlyoutOpen] = useState<boolean>(false);
  const [nightLight, setNightLight] = useState<boolean>(false);

  // Open Explorer and Winver initially so the user immediately sees the working Windows 10 Pro desktop
  const [windows, setWindows] = useState<WindowInstance[]>([
    {
      ...DEFAULT_WINDOWS.explorer,
      minimized: false,
      maximized: false,
      zIndex: 10,
    },
    {
      ...DEFAULT_WINDOWS.winver,
      minimized: false,
      maximized: false,
      zIndex: 11,
    },
  ]);

  const [draggingState, setDraggingState] = useState<{
    id: AppId;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const mo = String(now.getMonth() + 1).padStart(2, '0');
      const yyyy = now.getFullYear();
      setClockTime(`${hh}:${mm}`);
      setClockDate(`${dd}.${mo}.${yyyy}`);
    };
    updateClock();
    const timer = window.setInterval(updateClock, 15000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!draggingState) return;
    const handleMouseMove = (e: MouseEvent) => {
      setWindows((prev) =>
        prev.map((w) => {
          if (w.id !== draggingState.id || w.maximized) return w;
          const nextX = Math.max(0, Math.min(window.innerWidth - 180, e.clientX - draggingState.offsetX));
          const nextY = Math.max(0, Math.min(window.innerHeight - 90, e.clientY - draggingState.offsetY));
          return { ...w, x: nextX, y: nextY };
        })
      );
    };
    const handleMouseUp = () => setDraggingState(null);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingState]);

  const activeWallpaper =
    WALLPAPERS.find((w) => w.id === activeWallpaperId) ?? WALLPAPERS[0];

  const bringToFront = (appId: AppId) => {
    setWindows((prev) => {
      const maxZ = prev.reduce((max, w) => Math.max(max, w.zIndex), 10);
      return prev.map((w) =>
        w.id === appId ? { ...w, minimized: false, zIndex: maxZ + 1 } : w
      );
    });
  };

  const openApp = (appId: AppId, options?: { folder?: string; fileNode?: VfsNode }) => {
    if (options?.folder) {
      setExplorerInitialFolder(options.folder);
    }
    if (options?.fileNode) {
      setNotepadTargetNode(options.fileNode);
    }

    setWindows((prev) => {
      const maxZ = prev.reduce((max, w) => Math.max(max, w.zIndex), 10);
      const exists = prev.find((w) => w.id === appId);
      if (exists) {
        return prev.map((w) =>
          w.id === appId ? { ...w, minimized: false, zIndex: maxZ + 1 } : w
        );
      }
      const template = DEFAULT_WINDOWS[appId];
      return [
        ...prev,
        {
          ...template,
          minimized: false,
          maximized: false,
          zIndex: maxZ + 1,
        },
      ];
    });
    setStartMenuOpen(false);
    setActionCenterOpen(false);
    setContextMenu(null);
  };

  const closeApp = (appId: AppId) => {
    setWindows((prev) => prev.filter((w) => w.id !== appId));
  };

  const toggleMinimizeApp = (appId: AppId) => {
    setWindows((prev) => {
      const target = prev.find((w) => w.id === appId);
      if (!target) return prev;
      const maxZ = prev.reduce((max, w) => Math.max(max, w.zIndex), 10);
      if (target.minimized) {
        return prev.map((w) =>
          w.id === appId ? { ...w, minimized: false, zIndex: maxZ + 1 } : w
        );
      }
      const isTopmost = target.zIndex === maxZ;
      if (!isTopmost) {
        return prev.map((w) =>
          w.id === appId ? { ...w, zIndex: maxZ + 1 } : w
        );
      }
      return prev.map((w) =>
        w.id === appId ? { ...w, minimized: true } : w
      );
    });
  };

  const toggleMaximizeApp = (appId: AppId) => {
    setWindows((prev) => {
      const maxZ = prev.reduce((max, w) => Math.max(max, w.zIndex), 10);
      return prev.map((w) =>
        w.id === appId
          ? { ...w, maximized: !w.maximized, zIndex: maxZ + 1 }
          : w
      );
    });
  };

  const renderAppIcon = (appId: AppId, sizeClass = 'w-5 h-5') => {
    switch (appId) {
      case 'explorer':
        return <FolderOpen className={`${sizeClass} text-amber-400`} />;
      case 'cmd':
        return <Terminal className={`${sizeClass} text-emerald-400`} />;
      case 'notepad':
        return <FileText className={`${sizeClass} text-sky-400`} />;
      case 'taskmgr':
        return <Activity className={`${sizeClass} text-teal-400`} />;
      case 'settings':
        return <Settings className={`${sizeClass} text-sky-400`} />;
      case 'calc':
        return <Calculator className={`${sizeClass} text-purple-400`} />;
      case 'edge':
        return <Globe className={`${sizeClass} text-cyan-400`} />;
      case 'winver':
        return <Info className={`${sizeClass} text-sky-400`} />;
    }
  };

  const desktopShortcuts: {
    id: string;
    label: string;
    icon: React.ReactNode;
    onTrigger: () => void;
  }[] = [
    {
      id: 'shortcut_this_pc',
      label: 'Ten komputer',
      icon: <HardDrive className="w-8 h-8 text-sky-300 drop-shadow" />,
      onTrigger: () => openApp('explorer', { folder: 'this_pc' }),
    },
    {
      id: 'shortcut_recycle',
      label: `Kosz (${nodes.filter((n) => n.parentId === 'recycle').length})`,
      icon: <Trash2 className="w-8 h-8 text-slate-200 drop-shadow" />,
      onTrigger: () => openApp('explorer', { folder: 'recycle' }),
    },
    {
      id: 'shortcut_cmd',
      label: 'Wiersz polecenia',
      icon: <Terminal className="w-8 h-8 text-emerald-400 drop-shadow" />,
      onTrigger: () => openApp('cmd'),
    },
    {
      id: 'shortcut_notepad',
      label: 'Notatnik',
      icon: <FileText className="w-8 h-8 text-sky-300 drop-shadow" />,
      onTrigger: () => openApp('notepad'),
    },
    {
      id: 'shortcut_taskmgr',
      label: 'Menedżer zadań',
      icon: <Activity className="w-8 h-8 text-teal-300 drop-shadow" />,
      onTrigger: () => openApp('taskmgr'),
    },
    {
      id: 'shortcut_settings',
      label: 'Ustawienia',
      icon: <Settings className="w-8 h-8 text-sky-400 drop-shadow" />,
      onTrigger: () => openApp('settings'),
    },
    {
      id: 'shortcut_calc',
      label: 'Kalkulator',
      icon: <Calculator className="w-8 h-8 text-purple-300 drop-shadow" />,
      onTrigger: () => openApp('calc'),
    },
    {
      id: 'shortcut_edge',
      label: 'Microsoft Edge',
      icon: <Globe className="w-8 h-8 text-cyan-300 drop-shadow" />,
      onTrigger: () => openApp('edge'),
    },
    {
      id: 'shortcut_winver',
      label: 'Informacje (winver)',
      icon: <Info className="w-8 h-8 text-amber-300 drop-shadow" />,
      onTrigger: () => openApp('winver'),
    },
  ];

  const desktopFiles = nodes.filter((n) => n.parentId === 'desktop');

  const searchResults = searchQuery.trim()
    ? [
        { label: 'Ten komputer (Eksplorator plików)', appId: 'explorer' as AppId },
        { label: 'Wiersz polecenia (cmd.exe)', appId: 'cmd' as AppId },
        { label: 'Notatnik (notepad.exe)', appId: 'notepad' as AppId },
        { label: 'Menedżer zadań (taskmgr.exe)', appId: 'taskmgr' as AppId },
        { label: 'Ustawienia systemu Windows 10 Pro', appId: 'settings' as AppId },
        { label: 'Kalkulator', appId: 'calc' as AppId },
        { label: 'Microsoft Edge', appId: 'edge' as AppId },
        { label: 'Informacje o systemie Windows (winver)', appId: 'winver' as AppId },
      ].filter((item) =>
        item.label.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : [];

  if (locked) {
    return (
      <div
        className="h-screen w-screen relative flex flex-col justify-between p-12 text-white select-none overflow-hidden"
        style={{ background: WALLPAPERS[1].fallbackGradient }}
      >
        <img
          src={WALLPAPERS[1].url}
          alt="Ekran blokady Windows 10 Pro"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-black/45 backdrop-blur-xs" />

        <div className="relative z-10">
          <div className="text-6xl font-light tracking-tight tabular-nums">{clockTime}</div>
          <div className="text-lg text-sky-100 mt-1">Czwartek, 5 listopada 2026</div>
        </div>

        <div className="relative z-10 max-w-sm mx-auto w-full bg-black/50 border border-white/20 backdrop-blur-md p-6 rounded-lg text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#0078d7] mx-auto flex items-center justify-center text-2xl font-bold">
            {username.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <div className="text-lg font-semibold">{username}</div>
            <div className="text-xs text-sky-200">{editionName} · Zablokowano</div>
          </div>
          <button
            type="button"
            onClick={() => setLocked(false)}
            className="w-full py-2 text-xs font-semibold bg-[#0078d7] hover:bg-[#1084e0] text-white rounded transition-colors"
          >
            Zaloguj ponownie na Pulpit
          </button>
        </div>

        <div className="relative z-10 flex justify-between items-center text-xs text-slate-300">
          <span>{computerName}</span>
          <span>Windows 10 Pro 22H2</span>
        </div>
      </div>
    );
  }

  const maxZIndex = windows.reduce((max, w) => Math.max(max, w.zIndex), 10);

  return (
    <div
      data-testid="win10-desktop"
      onContextMenu={(e) => {
        e.preventDefault();
        setContextMenu({
          x: Math.min(e.clientX, window.innerWidth - 240),
          y: Math.min(e.clientY, window.innerHeight - 280),
        });
        setStartMenuOpen(false);
      }}
      onClick={() => {
        setContextMenu(null);
        setVolumeFlyoutOpen(false);
      }}
      className="h-screen w-screen relative overflow-hidden flex flex-col justify-between select-none"
      style={{ background: activeWallpaper.fallbackGradient }}
    >
      {/* Generated 8K Desktop Wallpaper with fallback */}
      <img
        src={activeWallpaper.url}
        alt={activeWallpaper.name}
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = 'none';
        }}
      />

      {/* Optional Night Light Warm Filter */}
      {nightLight && (
        <div className="absolute inset-0 bg-amber-500/15 pointer-events-none z-40" />
      )}

      {/* Desktop Canvas Area */}
      <main
        aria-label="Obszar roboczy Pulpitu Windows 10 Pro"
        className="relative z-10 flex-1 p-3 overflow-hidden"
      >
        {/* Desktop Icons Grid */}
        <div className="grid grid-flow-col grid-rows-6 gap-y-2 gap-x-3 w-fit">
          {desktopShortcuts.map((shortcut) => (
            <button
              key={shortcut.id}
              type="button"
              onClick={shortcut.onTrigger}
              className="w-24 p-2 rounded hover:bg-white/15 focus:bg-[#0078d7]/40 focus:outline-none border border-transparent hover:border-white/25 flex flex-col items-center text-center gap-1.5 transition-colors group"
            >
              {shortcut.icon}
              <span className="text-[11px] font-medium text-white leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] line-clamp-2">
                {shortcut.label}
              </span>
            </button>
          ))}

          {/* Dynamic VFS Desktop Files & Folders */}
          {desktopFiles.map((node) => (
            <button
              key={node.id}
              type="button"
              onClick={() => {
                if (node.type === 'file') {
                  openApp('notepad', { fileNode: node });
                } else {
                  openApp('explorer', { folder: 'desktop' });
                }
              }}
              className="w-24 p-2 rounded hover:bg-white/15 focus:bg-[#0078d7]/40 focus:outline-none border border-transparent hover:border-white/25 flex flex-col items-center text-center gap-1.5 transition-colors"
            >
              {node.type === 'folder' ? (
                <Folder className="w-8 h-8 text-amber-400 fill-amber-400 drop-shadow" />
              ) : (
                <FileText className="w-8 h-8 text-sky-200 drop-shadow" />
              )}
              <span className="text-[11px] font-medium text-white leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)] line-clamp-2">
                {node.name}
              </span>
            </button>
          ))}
        </div>

        {/* Subtle Bottom-Right Desktop Watermark / System Pill */}
        <div className="absolute bottom-3 right-4 text-right pointer-events-none text-white/75 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] text-[11px]">
          <div className="font-semibold">{editionName}</div>
          <div className="font-mono tabular-nums">Wersja 22H2 (Kompilacja 19045.5011)</div>
        </div>

        {/* Open Windows */}
        {windows.map((win) => {
          if (win.minimized) return null;
          const isFocused = win.zIndex === maxZIndex;
          const style: React.CSSProperties = win.maximized
            ? {
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: win.zIndex,
              }
            : {
                top: win.y,
                left: win.x,
                width: `min(${win.width}px, calc(100vw - 24px))`,
                height: `min(${win.height}px, calc(100vh - 68px))`,
                zIndex: win.zIndex,
              };

          return (
            <section
              key={win.id}
              aria-label={win.title}
              onMouseDown={() => bringToFront(win.id)}
              style={style}
              className={`absolute flex flex-col rounded-sm overflow-hidden shadow-2xl border transition-shadow ${
                isFocused
                  ? 'border-[#0078d7] ring-1 ring-[#0078d7]/40'
                  : 'border-slate-400/70'
              }`}
            >
              {/* Window Titlebar */}
              <div
                onMouseDown={(e) => {
                  if (win.maximized) return;
                  bringToFront(win.id);
                  setDraggingState({
                    id: win.id,
                    offsetX: e.clientX - win.x,
                    offsetY: e.clientY - win.y,
                  });
                }}
                onDoubleClick={() => toggleMaximizeApp(win.id)}
                className={`flex items-center justify-between pl-3 pr-1 h-8 select-none cursor-default shrink-0 ${
                  isFocused
                    ? 'bg-white text-slate-900'
                    : 'bg-[#f0f0f0] text-slate-600'
                } border-b border-slate-200`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {renderAppIcon(win.id, 'w-4 h-4')}
                  <span className="text-xs font-medium truncate">{win.title}</span>
                </div>

                <div
                  className="flex items-center shrink-0"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => toggleMinimizeApp(win.id)}
                    aria-label={`Minimalizuj ${win.title}`}
                    className="w-10 h-8 flex items-center justify-center hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleMaximizeApp(win.id)}
                    aria-label={`Maksymalizuj ${win.title}`}
                    className="w-10 h-8 flex items-center justify-center hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    {win.maximized ? (
                      <Minimize2 className="w-3.5 h-3.5" />
                    ) : (
                      <Maximize2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => closeApp(win.id)}
                    aria-label={`Zamknij ${win.title}`}
                    className="w-10 h-8 flex items-center justify-center hover:bg-[#e81123] hover:text-white text-slate-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Window Body */}
              <div className="flex-1 overflow-hidden bg-white">
                {win.id === 'explorer' && (
                  <FileExplorerApp
                    nodes={nodes}
                    partitions={partitions}
                    initialFolder={explorerInitialFolder}
                    onUpdateNodes={setNodes}
                    onOpenFileInNotepad={(node) =>
                      openApp('notepad', { fileNode: node })
                    }
                  />
                )}
                {win.id === 'cmd' && (
                  <CommandPromptApp
                    username={username}
                    editionName={editionName}
                    nodes={nodes}
                    onUpdateNodes={setNodes}
                    onOpenApp={(id) => openApp(id)}
                  />
                )}
                {win.id === 'notepad' && (
                  <NotepadApp
                    initialNode={notepadTargetNode}
                    nodes={nodes}
                    onUpdateNodes={setNodes}
                  />
                )}
                {win.id === 'taskmgr' && (
                  <TaskManagerApp
                    openProcesses={windows.map((w) => ({
                      id: w.id,
                      title: w.title,
                      memoryMb: w.memoryMb,
                      cpuPercent: w.cpuPercent,
                    }))}
                    onCloseApp={closeApp}
                  />
                )}
                {win.id === 'settings' && (
                  <SettingsApp
                    editionName={editionName}
                    username={username}
                    computerName={computerName}
                    activeWallpaperId={activeWallpaperId}
                    taskbarLightMode={taskbarLightMode}
                    onSelectWallpaper={setActiveWallpaperId}
                    onToggleTaskbarMode={setTaskbarLightMode}
                    onRestartInstaller={onRestartInstaller}
                  />
                )}
                {win.id === 'calc' && <CalculatorApp />}
                {win.id === 'edge' && (
                  <EdgeBrowserApp
                    editionName={editionName}
                    onOpenApp={(id) => openApp(id)}
                  />
                )}
                {win.id === 'winver' && (
                  <WinverModal
                    editionName={editionName}
                    username={username}
                    computerName={computerName}
                    onClose={() => closeApp('winver')}
                  />
                )}
              </div>
            </section>
          );
        })}

        {/* Right-Click Desktop Context Menu */}
        {contextMenu && (
          <div
            role="menu"
            aria-label="Menu kontekstowe Pulpitu"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            onClick={(e) => e.stopPropagation()}
            className="fixed w-60 bg-[#2b2b2b]/95 backdrop-blur-md text-white border border-white/15 rounded shadow-2xl py-1.5 z-50 text-xs"
          >
            <button
              type="button"
              onClick={() => {
                setNodes((prev) =>
                  createVfsNode(prev, {
                    name: 'Nowy folder',
                    type: 'folder',
                    parentId: 'desktop',
                  })
                );
                setContextMenu(null);
              }}
              className="w-full px-3 py-1.5 hover:bg-[#0078d7] flex items-center gap-2.5 text-left"
            >
              <FolderPlus className="w-4 h-4 text-amber-400" />
              <span>Nowy folder na Pulpicie</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setNodes((prev) =>
                  createVfsNode(prev, {
                    name: 'Nowy dokument tekstowy.txt',
                    type: 'file',
                    parentId: 'desktop',
                    content: 'Utworzono z menu kontekstowego Pulpitu Windows 10 Pro.',
                  })
                );
                setContextMenu(null);
              }}
              className="w-full px-3 py-1.5 hover:bg-[#0078d7] flex items-center gap-2.5 text-left"
            >
              <FilePlus className="w-4 h-4 text-sky-300" />
              <span>Nowy dokument tekstowy (.txt)</span>
            </button>
            <div className="my-1 border-t border-white/10" />
            <button
              type="button"
              onClick={() => openApp('cmd')}
              className="w-full px-3 py-1.5 hover:bg-[#0078d7] flex items-center gap-2.5 text-left"
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Otwórz tutaj Wiersz polecenia</span>
            </button>
            <button
              type="button"
              onClick={() => openApp('settings')}
              className="w-full px-3 py-1.5 hover:bg-[#0078d7] flex items-center gap-2.5 text-left"
            >
              <Palette className="w-4 h-4 text-sky-400" />
              <span>Personalizuj (Tapeta i Kolory)</span>
            </button>
            <button
              type="button"
              onClick={() => openApp('winver')}
              className="w-full px-3 py-1.5 hover:bg-[#0078d7] flex items-center gap-2.5 text-left"
            >
              <Info className="w-4 h-4 text-amber-300" />
              <span>Informacje o Windows 10 Pro</span>
            </button>
            <div className="my-1 border-t border-white/10" />
            <button
              type="button"
              onClick={onRestartInstaller}
              className="w-full px-3 py-1.5 hover:bg-[#0078d7] flex items-center gap-2.5 text-left text-rose-300"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Uruchom ponownie instalator ISO</span>
            </button>
          </div>
        )}
      </main>

      {/* Start Menu Popover */}
      {startMenuOpen && (
        <StartMenu
          username={username}
          editionName={editionName}
          onOpenApp={(id) => openApp(id)}
          onRestartInstaller={onRestartInstaller}
          onLockScreen={() => {
            setStartMenuOpen(false);
            setLocked(true);
          }}
          onClose={() => setStartMenuOpen(false)}
        />
      )}

      {/* Search Flyout */}
      {searchFocused && searchQuery.trim().length > 0 && (
        <div className="fixed bottom-11 left-12 w-80 bg-[#1f1f1f]/95 backdrop-blur-xl text-white border border-white/15 shadow-2xl rounded-t z-50 p-3 space-y-2">
          <div className="text-[11px] text-slate-400 font-semibold">
            Najlepsze dopasowania w Windows 10 Pro
          </div>
          {searchResults.length === 0 ? (
            <div className="text-xs text-slate-400 py-2">
              Brak wyników dla "{searchQuery}".
            </div>
          ) : (
            searchResults.map((item) => (
              <button
                key={item.appId}
                type="button"
                onClick={() => {
                  openApp(item.appId);
                  setSearchQuery('');
                  setSearchFocused(false);
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded hover:bg-[#0078d7] text-xs text-left transition-colors"
              >
                {renderAppIcon(item.appId, 'w-4 h-4')}
                <span>{item.label}</span>
              </button>
            ))
          )}
        </div>
      )}

      {/* Volume Flyout */}
      {volumeFlyoutOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed bottom-11 right-28 w-64 bg-[#1f1f1f]/95 backdrop-blur-xl text-white border border-white/15 shadow-2xl p-4 z-50 space-y-2"
        >
          <div className="text-xs font-medium text-slate-200">
            Głośniki (Realtek High Definition Audio)
          </div>
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-[#0078d7] shrink-0" />
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              aria-label="Poziom głośności"
              onChange={(e) => setVolume(Number(e.target.value))}
              className="flex-1 accent-[#0078d7]"
            />
            <span className="text-sm font-mono tabular-nums w-8 text-right">
              {volume}
            </span>
          </div>
        </div>
      )}

      {/* Action Center ("Centrum akcji") Drawer */}
      {actionCenterOpen && (
        <aside
          aria-label="Centrum akcji systemu Windows 10"
          className="fixed top-0 bottom-11 right-0 w-80 bg-[#1f1f1f]/95 backdrop-blur-xl text-white border-l border-white/15 shadow-2xl z-50 p-4 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-semibold text-slate-200">
                Powiadomienia systemowe
              </span>
              <button
                type="button"
                onClick={() => setActionCenterOpen(false)}
                className="text-[11px] text-sky-400 hover:underline"
              >
                Zamknij
              </button>
            </div>

            <div className="p-3 rounded bg-white/5 border border-white/10 space-y-1 text-xs">
              <div className="font-semibold text-sky-300">
                Instalator Windows 10 Pro
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                System {editionName} (Kompilacja 19045.5011) został pomyślnie zainstalowany i aktywowany cyfrowo.
              </p>
            </div>

            <div className="p-3 rounded bg-white/5 border border-white/10 space-y-1 text-xs">
              <div className="font-semibold text-emerald-300">
                Zabezpieczenia Windows Defender
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Zapora sieciowa i ochrona przed zagrożeniami działają prawidłowo.
              </p>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="space-y-2 pt-3 border-t border-white/10">
            <div className="text-[11px] text-slate-400">Szybkie akcje</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setNightLight((v) => !v)}
                className={`p-2.5 rounded border text-left transition-colors ${
                  nightLight
                    ? 'bg-[#0078d7] border-sky-400 text-white'
                    : 'bg-white/10 border-white/10 text-slate-200 hover:bg-white/15'
                }`}
              >
                Wyświetlanie nocne: {nightLight ? 'Wł.' : 'Wył.'}
              </button>
              <button
                type="button"
                onClick={() => setTaskbarLightMode((v) => !v)}
                className={`p-2.5 rounded border text-left transition-colors ${
                  taskbarLightMode
                    ? 'bg-[#0078d7] border-sky-400 text-white'
                    : 'bg-white/10 border-white/10 text-slate-200 hover:bg-white/15'
                }`}
              >
                Jasny pasek: {taskbarLightMode ? 'Wł.' : 'Wył.'}
              </button>
              <button
                type="button"
                onClick={() => openApp('settings')}
                className="p-2.5 rounded bg-white/10 hover:bg-white/15 border border-white/10 text-left flex items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5 text-sky-400" />
                Wszystkie ustawienia
              </button>
              <button
                type="button"
                onClick={() => setLocked(true)}
                className="p-2.5 rounded bg-white/10 hover:bg-white/15 border border-white/10 text-left flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                Zablokuj ekran
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Windows 10 Taskbar ("Pasek zadań") */}
      <footer
        aria-label="Pasek zadań systemu Windows 10"
        className={`relative z-50 h-11 w-full flex items-center justify-between px-1 border-t shrink-0 ${
          taskbarLightMode
            ? 'bg-[#e6e6e6]/95 text-slate-900 border-slate-300'
            : 'bg-[#101010]/95 text-white border-white/10'
        } backdrop-blur-md`}
      >
        {/* Left: Start, Search, Pinned & Running Apps */}
        <div className="flex items-center h-full gap-0.5 min-w-0">
          {/* Start Button */}
          <button
            type="button"
            aria-label="Start"
            onClick={() => {
              setStartMenuOpen((prev) => !prev);
              setActionCenterOpen(false);
            }}
            className={`w-11 h-full flex items-center justify-center transition-colors ${
              startMenuOpen
                ? 'bg-[#0078d7] text-white'
                : 'hover:bg-white/10'
            }`}
          >
            <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
              <span className="bg-current" />
              <span className="bg-current" />
              <span className="bg-current" />
              <span className="bg-current" />
            </div>
          </button>

          {/* Search Box */}
          <div className="hidden sm:flex items-center h-8 px-2.5 bg-white text-slate-900 border border-slate-300 w-48 mx-1">
            <Search className="w-3.5 h-3.5 text-slate-500 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setSearchFocused(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchFocused(true);
              }}
              placeholder="Szukaj w Windows 10"
              aria-label="Wyszukaj w systemie Windows 10"
              className="w-full text-xs bg-transparent text-slate-900 placeholder:text-slate-500 focus:outline-none"
            />
          </div>

          {/* Taskbar App Buttons */}
          {(
            ['explorer', 'cmd', 'notepad', 'taskmgr', 'settings', 'calc', 'edge', 'winver'] as AppId[]
          ).map((appId) => {
            const win = windows.find((w) => w.id === appId);
            const isOpen = Boolean(win);
            const isFocused = Boolean(win && !win.minimized && win.zIndex === maxZIndex);
            const labelMap: Record<AppId, string> = {
              explorer: 'Eksplorator plików',
              cmd: 'Wiersz polecenia',
              notepad: 'Notatnik',
              taskmgr: 'Menedżer zadań',
              settings: 'Ustawienia',
              calc: 'Kalkulator',
              edge: 'Microsoft Edge',
              winver: 'Informacje o Windows (winver)',
            };

            return (
              <button
                key={appId}
                type="button"
                title={labelMap[appId]}
                aria-label={`Pasek zadań: ${labelMap[appId]}`}
                onClick={() => {
                  if (!isOpen) {
                    openApp(appId);
                  } else {
                    toggleMinimizeApp(appId);
                  }
                }}
                className={`relative h-full px-3 flex items-center gap-1.5 text-xs transition-colors ${
                  isFocused
                    ? taskbarLightMode
                      ? 'bg-slate-300/80'
                      : 'bg-white/15'
                    : 'hover:bg-white/10'
                }`}
              >
                {renderAppIcon(appId, 'w-4 h-4')}
                <span className="hidden xl:inline truncate max-w-[100px]">
                  {labelMap[appId]}
                </span>
                {isOpen && (
                  <span
                    className={`absolute bottom-0 left-1 right-1 h-0.5 ${
                      isFocused ? 'bg-[#00a4ef]' : 'bg-slate-400'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Right: System Tray */}
        <div className="flex items-center h-full gap-1 shrink-0">
          <button
            type="button"
            onClick={() => openApp('settings')}
            title="Sieć Ethernet0: Połączono (Dostęp do Internetu)"
            aria-label="Stan sieci Ethernet"
            className="h-full px-2 hover:bg-white/10 flex items-center justify-center"
          >
            <Wifi className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setVolumeFlyoutOpen((v) => !v);
            }}
            title={`Głośność: ${volume}%`}
            aria-label="Regulacja głośności"
            className="h-full px-2 hover:bg-white/10 flex items-center justify-center"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          <span className="hidden md:inline text-[11px] px-1.5 font-medium">
            POL
          </span>

          <button
            type="button"
            onClick={() => setActionCenterOpen((v) => !v)}
            aria-label="Godzina i data systemu Windows"
            className="h-full px-2.5 hover:bg-white/10 flex flex-col items-end justify-center text-[11px] leading-tight font-mono tabular-nums"
          >
            <span>{clockTime}</span>
            <span>{clockDate}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActionCenterOpen((v) => !v);
              setStartMenuOpen(false);
            }}
            aria-label="Centrum akcji"
            title="Centrum akcji (2 powiadomienia)"
            className="h-full px-2.5 hover:bg-white/10 flex items-center justify-center relative"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Show Desktop Sliver */}
          <button
            type="button"
            title="Pokaż pulpit (Minimalizuj wszystkie okna)"
            aria-label="Pokaż pulpit"
            onClick={() =>
              setWindows((prev) => prev.map((w) => ({ ...w, minimized: true })))
            }
            className="w-2 h-full border-l border-white/20 hover:bg-white/25"
          />
        </div>
      </footer>
    </div>
  );
};
