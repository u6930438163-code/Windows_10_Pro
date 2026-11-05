import React, { useState } from 'react';
import {
  CheckCircle2,
  Image as ImageIcon,
  Monitor,
  Palette,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { WALLPAPERS, WallpaperOption } from '../../os/systemLogic';

interface SettingsAppProps {
  editionName: string;
  username: string;
  computerName: string;
  activeWallpaperId: string;
  taskbarLightMode: boolean;
  onSelectWallpaper: (wallpaperId: string) => void;
  onToggleTaskbarMode: (light: boolean) => void;
  onRestartInstaller: () => void;
}

export const SettingsApp: React.FC<SettingsAppProps> = ({
  editionName,
  username,
  computerName,
  activeWallpaperId,
  taskbarLightMode,
  onSelectWallpaper,
  onToggleTaskbarMode,
  onRestartInstaller,
}) => {
  const [section, setSection] = useState<'about' | 'personalization' | 'recovery'>('about');
  const [updateStatus, setUpdateStatus] = useState<string>(
    'System Windows 10 Pro jest aktualny (Ostatnie sprawdzenie: dzisiaj, 12:10).'
  );

  return (
    <div className="flex h-full bg-white text-slate-900 text-xs select-none overflow-hidden">
      {/* Left Settings Sidebar */}
      <aside className="w-52 bg-[#f3f3f3] border-r border-slate-200 p-3 flex flex-col justify-between shrink-0">
        <div className="space-y-1">
          <div className="px-2 py-1.5 mb-2">
            <div className="text-sm font-semibold text-slate-900">Ustawienia Windows</div>
            <div className="text-[11px] text-slate-500">{username} · Konto lokalne</div>
          </div>

          <button
            type="button"
            onClick={() => setSection('about')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-left transition-colors ${
              section === 'about'
                ? 'bg-white text-[#0078d7] font-semibold shadow-xs border-l-2 border-[#0078d7]'
                : 'text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            <Monitor className="w-4 h-4 shrink-0" />
            <span>System i Informacje</span>
          </button>

          <button
            type="button"
            onClick={() => setSection('personalization')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-left transition-colors ${
              section === 'personalization'
                ? 'bg-white text-[#0078d7] font-semibold shadow-xs border-l-2 border-[#0078d7]'
                : 'text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            <Palette className="w-4 h-4 shrink-0" />
            <span>Personalizacja (Tapeta)</span>
          </button>

          <button
            type="button"
            onClick={() => setSection('recovery')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded text-left transition-colors ${
              section === 'recovery'
                ? 'bg-white text-[#0078d7] font-semibold shadow-xs border-l-2 border-[#0078d7]'
                : 'text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            <RefreshCw className="w-4 h-4 shrink-0" />
            <span>Aktualizacja i Odzyskiwanie</span>
          </button>
        </div>

        <div className="p-2.5 rounded bg-white border border-slate-200 text-[11px] space-y-1">
          <div className="font-semibold text-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Aktywacja Windows
          </div>
          <div className="text-slate-500">
            {editionName} jest aktywowany licencją cyfrową.
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {section === 'about' && (
          <div className="max-w-xl space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Informacje o systemie</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                 komputer jest monitorowany i chroniony przez zabezpieczenia Windows 10 Pro.
              </p>
            </div>

            <div className="p-4 rounded border border-slate-200 bg-slate-50 space-y-3">
              <div className="text-sm font-semibold text-slate-900">Specyfikacja urządzenia</div>
              <div className="grid grid-cols-2 gap-y-2 text-xs">
                <span className="text-slate-500">Nazwa urządzenia:</span>
                <span className="font-mono font-medium">{computerName}</span>
                <span className="text-slate-500">Procesor:</span>
                <span>Intel(R) Core(TM) i7-12700K CPU @ 3.60GHz</span>
                <span className="text-slate-500">Zainstalowana pamięć RAM:</span>
                <span className="font-mono tabular-nums">16,0 GB (dostępne: 15,8 GB)</span>
                <span className="text-slate-500">Typ systemu:</span>
                <span>64-bitowy system operacyjny, procesor x64</span>
              </div>
            </div>

            <div className="p-4 rounded border border-slate-200 bg-slate-50 space-y-3">
              <div className="text-sm font-semibold text-slate-900">Specyfikacja systemu Windows</div>
              <div className="grid grid-cols-2 gap-y-2 text-xs">
                <span className="text-slate-500">Wersja (Edycja):</span>
                <span className="font-semibold text-[#0078d7]">{editionName}</span>
                <span className="text-slate-500">Wersja funkcji:</span>
                <span className="font-mono tabular-nums">22H2</span>
                <span className="text-slate-500">Zainstalowano dnia:</span>
                <span className="font-mono tabular-nums">05.11.2026</span>
                <span className="text-slate-500">Kompilacja systemu OS:</span>
                <span className="font-mono tabular-nums">19045.5011</span>
                <span className="text-slate-500">Pakiet funkcji:</span>
                <span>Windows Feature Experience Pack 1000.19060.1000.0</span>
              </div>
            </div>
          </div>
        )}

        {section === 'personalization' && (
          <div className="max-w-xl space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Personalizacja pulpitu</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Wybierz tło pulpitu Windows 10 Pro oraz styl paska zadań.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#0078d7]" />
                Wybierz obraz tła Pulpitu:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {WALLPAPERS.map((wp: WallpaperOption) => {
                  const selected = wp.id === activeWallpaperId;
                  return (
                    <button
                      key={wp.id}
                      type="button"
                      onClick={() => onSelectWallpaper(wp.id)}
                      className={`group rounded overflow-hidden border text-left transition-all ${
                        selected
                          ? 'border-[#0078d7] ring-2 ring-[#0078d7]/30 bg-sky-50/40'
                          : 'border-slate-200 hover:border-slate-400 bg-white'
                      }`}
                    >
                      <div
                        className="h-24 w-full relative overflow-hidden"
                        style={{ background: wp.fallbackGradient }}
                      >
                        <img
                          src={wp.url}
                          alt={wp.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="p-2.5">
                        <div className="font-semibold text-slate-900 text-xs truncate">
                          {wp.name}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {wp.subtitle}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 rounded border border-slate-200 bg-slate-50 space-y-3">
              <div className="text-xs font-semibold text-slate-800">
                Tryb kolorów paska zadań systemu Windows 10
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onToggleTaskbarMode(false)}
                  className={`px-3.5 py-1.5 rounded text-xs font-medium border ${
                    !taskbarLightMode
                      ? 'bg-[#0078d7] text-white border-[#0078d7]'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  Ciemny pasek zadań (Domyślny)
                </button>
                <button
                  type="button"
                  onClick={() => onToggleTaskbarMode(true)}
                  className={`px-3.5 py-1.5 rounded text-xs font-medium border ${
                    taskbarLightMode
                      ? 'bg-[#0078d7] text-white border-[#0078d7]'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  Jasny pasek zadań (1903+)
                </button>
              </div>
            </div>
          </div>
        )}

        {section === 'recovery' && (
          <div className="max-w-xl space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Windows Update i Odzyskiwanie systemu
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Sprawdzaj aktualizacje zabezpieczeń lub uruchom ponownie kreator czystej instalacji Windows 10 Pro.
              </p>
            </div>

            <div className="p-4 rounded border border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-slate-900">Windows Update</div>
                  <div className="text-[11px] text-slate-600">{updateStatus}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setUpdateStatus(
                    'Sprawdzono aktualizacje KB5046613: Wszystkie poprawki 22H2 są zainstalowane.'
                  )
                }
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0078d7] hover:bg-[#106ebe] rounded shrink-0"
              >
                Sprawdź aktualizacje
              </button>
            </div>

            <div className="p-4 rounded border border-slate-200 bg-slate-50 space-y-3">
              <div className="text-sm font-semibold text-slate-900">
                Resetuj ten komputer / Ponowna instalacja z obrazu ISO
              </div>
              <p className="text-xs text-slate-600">
                Jeśli chcesz ponownie przejść przez partycjonowanie dysku, wybór edycji i kreator instalacji systemu Windows 10 Pro, uruchom instalator poniżej.
              </p>
              <button
                type="button"
                onClick={onRestartInstaller}
                className="px-4 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#0078d7]" />
                Uruchom Kreator Instalacji Windows 10 Pro
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
