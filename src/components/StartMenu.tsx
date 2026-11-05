import React from 'react';
import {
  Activity,
  Calculator,
  CloudSun,
  FileText,
  FolderOpen,
  Globe,
  HardDrive,
  Info,
  Power,
  RotateCcw,
  Settings,
  ShieldCheck,
  Terminal,
  User,
} from 'lucide-react';
import { AppId } from '../os/systemLogic';

interface StartMenuProps {
  username: string;
  editionName: string;
  onOpenApp: (appId: AppId) => void;
  onRestartInstaller: () => void;
  onLockScreen: () => void;
  onClose: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({
  username,
  editionName,
  onOpenApp,
  onRestartInstaller,
  onLockScreen,
  onClose,
}) => {
  const handleLaunch = (appId: AppId) => {
    onOpenApp(appId);
    onClose();
  };

  const allApps: { id: AppId; name: string; icon: React.ReactNode }[] = [
    {
      id: 'explorer',
      name: 'Eksplorator plików (Ten komputer)',
      icon: <FolderOpen className="w-4 h-4 text-amber-400" />,
    },
    {
      id: 'winver',
      name: 'Informacje o systemie (winver)',
      icon: <Info className="w-4 h-4 text-sky-400" />,
    },
    {
      id: 'calc',
      name: 'Kalkulator',
      icon: <Calculator className="w-4 h-4 text-teal-400" />,
    },
    {
      id: 'taskmgr',
      name: 'Menedżer zadań',
      icon: <Activity className="w-4 h-4 text-emerald-400" />,
    },
    {
      id: 'edge',
      name: 'Microsoft Edge',
      icon: <Globe className="w-4 h-4 text-cyan-400" />,
    },
    {
      id: 'notepad',
      name: 'Notatnik',
      icon: <FileText className="w-4 h-4 text-blue-300" />,
    },
    {
      id: 'settings',
      name: 'Ustawienia',
      icon: <Settings className="w-4 h-4 text-sky-400" />,
    },
    {
      id: 'cmd',
      name: 'Wiersz polecenia (Administrator)',
      icon: <Terminal className="w-4 h-4 text-slate-200" />,
    },
  ];

  return (
    <div
      role="dialog"
      aria-label="Menu Start systemu Windows 10"
      className="fixed bottom-11 left-0 w-[640px] max-w-[96vw] h-[500px] max-h-[82vh] bg-[#1f1f1f]/95 backdrop-blur-xl text-white border border-white/15 shadow-2xl z-50 flex overflow-hidden"
    >
      <div className="w-12 bg-[#141414]/90 border-r border-white/10 flex flex-col justify-between items-center py-3 shrink-0">
        <button
          type="button"
          onClick={() => handleLaunch('settings')}
          title={`Profil: ${username}`}
          aria-label={`Profil użytkownika ${username}`}
          className="w-9 h-9 rounded hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <User className="w-4 h-4 text-sky-400" />
        </button>

        <div className="flex flex-col items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleLaunch('explorer')}
            title="Eksplorator plików"
            aria-label="Otwórz Eksplorator plików z paska bocznego"
            className="w-9 h-9 rounded hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <FolderOpen className="w-4 h-4 text-slate-300" />
          </button>
          <button
            type="button"
            onClick={() => handleLaunch('settings')}
            title="Ustawienia systemu"
            aria-label="Otwórz Ustawienia systemu z paska bocznego"
            className="w-9 h-9 rounded hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <Settings className="w-4 h-4 text-slate-300" />
          </button>
          <button
            type="button"
            onClick={onLockScreen}
            title="Zablokuj ekran Windows 10"
            aria-label="Zablokuj ekran Windows 10"
            className="w-9 h-9 rounded hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <Power className="w-4 h-4 text-amber-400" />
          </button>
          <button
            type="button"
            onClick={onRestartInstaller}
            title="Ponownie uruchom instalator Windows 10 Pro"
            aria-label="Ponownie uruchom instalator Windows 10 Pro"
            className="w-9 h-9 rounded hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-rose-400" />
          </button>
        </div>
      </div>

      <div className="w-60 border-r border-white/10 flex flex-col py-3 px-2 overflow-y-auto shrink-0">
        <div className="px-2 pb-2 mb-1 border-b border-white/10">
          <div className="text-xs font-semibold text-slate-300">{username}</div>
          <div className="text-[11px] text-sky-400">{editionName} · Aktywowany</div>
        </div>

        <div className="text-[11px] text-slate-400 px-2 py-1 font-medium">
          Wszystkie aplikacje
        </div>

        <div className="space-y-0.5 mt-1">
          {allApps.map((app) => (
            <button
              key={app.id}
              type="button"
              onClick={() => handleLaunch(app.id)}
              className="w-full flex items-center gap-3 px-2.5 py-2 text-xs text-left rounded hover:bg-white/10 transition-colors"
            >
              <div className="w-6 h-6 bg-[#0078d7]/30 border border-white/10 flex items-center justify-center shrink-0">
                {app.icon}
              </div>
              <span className="truncate">{app.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="text-xs font-medium text-slate-300 mb-2.5">
          Produktywność i Narzędzia Windows 10 Pro
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleLaunch('winver')}
            className="col-span-2 h-24 bg-[#0078d7] hover:bg-[#1084e0] p-3 text-left flex flex-col justify-between border border-white/15 transition-colors"
          >
            <div className="flex items-center justify-between">
              <ShieldCheck className="w-6 h-6 text-white" />
              <span className="text-[11px] text-sky-100 font-mono">22H2 · 19045.5011</span>
            </div>
            <div>
              <div className="text-xs font-semibold text-white">{editionName}</div>
              <div className="text-[11px] text-sky-100">Licencja cyfrowa aktywna · Sprawdź winver</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleLaunch('edge')}
            className="h-24 bg-[#005a9e] hover:bg-[#0068b8] p-3 text-left flex flex-col justify-between border border-white/15 transition-colors"
          >
            <CloudSun className="w-6 h-6 text-amber-300" />
            <div>
              <div className="text-sm font-bold tabular-nums">19°C</div>
              <div className="text-[11px] text-sky-100">Warszawa</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleLaunch('explorer')}
            className="h-24 bg-[#2d2d30] hover:bg-[#3e3e42] p-3 text-left flex flex-col justify-between border border-white/15 transition-colors"
          >
            <HardDrive className="w-6 h-6 text-amber-400" />
            <div className="text-xs font-medium">Ten komputer</div>
          </button>

          <button
            type="button"
            onClick={() => handleLaunch('cmd')}
            className="h-24 bg-[#1e1e1e] hover:bg-[#2d2d2d] p-3 text-left flex flex-col justify-between border border-white/15 transition-colors"
          >
            <Terminal className="w-6 h-6 text-emerald-400" />
            <div className="text-xs font-medium">Terminal CMD</div>
          </button>

          <button
            type="button"
            onClick={() => handleLaunch('taskmgr')}
            className="h-24 bg-[#008272] hover:bg-[#009986] p-3 text-left flex flex-col justify-between border border-white/15 transition-colors"
          >
            <Activity className="w-6 h-6 text-white" />
            <div className="text-xs font-medium">Menedżer zadań</div>
          </button>

          <button
            type="button"
            onClick={() => handleLaunch('notepad')}
            className="h-24 bg-[#2b579a] hover:bg-[#3468b8] p-3 text-left flex flex-col justify-between border border-white/15 transition-colors"
          >
            <FileText className="w-6 h-6 text-white" />
            <div className="text-xs font-medium">Notatnik</div>
          </button>

          <button
            type="button"
            onClick={() => handleLaunch('calc')}
            className="h-24 bg-[#5133ab] hover:bg-[#603cba] p-3 text-left flex flex-col justify-between border border-white/15 transition-colors"
          >
            <Calculator className="w-6 h-6 text-white" />
            <div className="text-xs font-medium">Kalkulator</div>
          </button>

          <button
            type="button"
            onClick={() => handleLaunch('settings')}
            className="h-24 bg-[#0078d7] hover:bg-[#1084e0] p-3 text-left flex flex-col justify-between border border-white/15 transition-colors"
          >
            <Settings className="w-6 h-6 text-white" />
            <div className="text-xs font-medium">Ustawienia</div>
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Zasilanie i Odzyskiwanie</span>
          <button
            type="button"
            onClick={onRestartInstaller}
            className="px-2.5 py-1 text-[11px] font-medium bg-white/10 hover:bg-white/20 rounded text-sky-200 transition-colors"
          >
            Uruchom ponownie instalator ISO
          </button>
        </div>
      </div>
    </div>
  );
};
