import React, { useState } from 'react';
import { Globe, Home, Lock, RefreshCw, ShieldCheck, Terminal } from 'lucide-react';
import { AppId } from '../../os/systemLogic';

interface EdgeBrowserAppProps {
  editionName: string;
  onOpenApp: (appId: AppId) => void;
}

export const EdgeBrowserApp: React.FC<EdgeBrowserAppProps> = ({
  editionName,
  onOpenApp,
}) => {
  const [url, setUrl] = useState('edge://welcome-windows10-pro');
  const [activeTab, setActiveTab] = useState<'welcome' | 'pro_features' | 'admin_guide'>('welcome');

  const navigateTab = (tab: 'welcome' | 'pro_features' | 'admin_guide') => {
    setActiveTab(tab);
    setUrl(
      tab === 'welcome'
        ? 'edge://welcome-windows10-pro'
        : tab === 'pro_features'
        ? 'edge://windows-10-pro-architecture'
        : 'edge://powershell-cmd-cheatsheet'
    );
  };

  return (
    <div className="flex flex-col h-full bg-white text-slate-900 text-xs select-none">
      {/* Browser Tabs */}
      <div className="flex items-center gap-1 px-2 pt-1.5 bg-[#e3e5e8] border-b border-slate-300">
        <button
          type="button"
          onClick={() => navigateTab('welcome')}
          className={`px-3 py-1.5 rounded-t text-xs font-medium flex items-center gap-1.5 ${
            activeTab === 'welcome'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:bg-white/60'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-[#0078d7]" />
          Witamy w Windows 10 Pro
        </button>
        <button
          type="button"
          onClick={() => navigateTab('pro_features')}
          className={`px-3 py-1.5 rounded-t text-xs font-medium flex items-center gap-1.5 ${
            activeTab === 'pro_features'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:bg-white/60'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Funkcje edycji Pro
        </button>
        <button
          type="button"
          onClick={() => navigateTab('admin_guide')}
          className={`px-3 py-1.5 rounded-t text-xs font-medium flex items-center gap-1.5 ${
            activeTab === 'admin_guide'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:bg-white/60'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-slate-700" />
          Ściągawka CMD i Administracja
        </button>
      </div>

      {/* Address Bar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-white border-b border-slate-200">
        <button
          type="button"
          onClick={() => navigateTab('welcome')}
          title="Strona główna"
          aria-label="Strona główna Microsoft Edge"
          className="p-1 rounded hover:bg-slate-100 text-slate-600"
        >
          <Home className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => navigateTab(activeTab)}
          title="Odśwież stronę"
          aria-label="Odśwież stronę Microsoft Edge"
          className="p-1 rounded hover:bg-slate-100 text-slate-600"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
        <div className="flex-1 flex items-center gap-2 px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-mono text-slate-700">
          <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
          <span className="truncate">{url}</span>
        </div>
      </div>

      {/* Page Content */}
      <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
        {activeTab === 'welcome' && (
          <div className="max-w-xl mx-auto space-y-5">
            <div className="p-5 rounded-lg bg-gradient-to-r from-[#004578] to-[#0078d7] text-white space-y-2">
              <div className="text-xs text-sky-200 font-medium">
                Microsoft Edge · Przeglądarka systemowa
              </div>
              <h2 className="text-xl font-bold">
                Twój system {editionName} (22H2) jest gotowy do pracy
              </h2>
              <p className="text-xs text-sky-100 leading-relaxed">
                Pomyślnie zainstalowano i uruchomiono interaktywny pulpit Windows 10 Pro. Możesz korzystać z Eksploratora plików, Wiersza polecenia, Notatnika oraz Menedżera zadań.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 bg-white rounded border border-slate-200 space-y-2">
                <div className="font-semibold text-slate-900">Terminal Administratora</div>
                <p className="text-slate-600">
                  Sprawdź kompilację systemu, konfigurację sieci IP lub utwórz nowe katalogi na pulpicie.
                </p>
                <button
                  type="button"
                  onClick={() => onOpenApp('cmd')}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0078d7] hover:bg-[#106ebe] rounded"
                >
                  Otwórz Wiersz polecenia
                </button>
              </div>

              <div className="p-4 bg-white rounded border border-slate-200 space-y-2">
                <div className="font-semibold text-slate-900">Personalizacja i Tapety 4K</div>
                <p className="text-slate-600">
                  Zmień tapetę pulpitu Windows 10 Hero na nocny krajobraz alpejski lub Microsoft Fluent.
                </p>
                <button
                  type="button"
                  onClick={() => onOpenApp('settings')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded"
                >
                  Otwórz Ustawienia
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pro_features' && (
          <div className="max-w-xl mx-auto bg-white p-5 rounded border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Porównanie edycji: Dlaczego Windows 10 Pro?
            </h3>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2">Funkcja systemowa</th>
                  <th className="py-2">Windows 10 Home</th>
                  <th className="py-2 text-[#0078d7] font-semibold">Windows 10 Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2 font-medium">Szyfrowanie dysków BitLocker</td>
                  <td className="py-2 text-slate-400">Brak</td>
                  <td className="py-2 font-semibold text-emerald-700">Dostępne (XTS-AES 256)</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Wirtualizacja Microsoft Hyper-V</td>
                  <td className="py-2 text-slate-400">Brak</td>
                  <td className="py-2 font-semibold text-emerald-700">Wbudowany hipernadzorca</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Host Pulpitu zdalnego (RDP)</td>
                  <td className="py-2 text-slate-400">Tylko klient</td>
                  <td className="py-2 font-semibold text-emerald-700">Pełny serwer i klient RDP</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Zasady grupy (gpedit.msc) i Active Directory</td>
                  <td className="py-2 text-slate-400">Brak</td>
                  <td className="py-2 font-semibold text-emerald-700">Pełna obsługa domeny</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">Maksymalna obsługiwana pamięć RAM</td>
                  <td className="py-2 font-mono tabular-nums">128 GB</td>
                  <td className="py-2 font-mono font-semibold text-emerald-700 tabular-nums">2 TB (2048 GB)</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'admin_guide' && (
          <div className="max-w-xl mx-auto bg-white p-5 rounded border border-slate-200 space-y-3">
            <h3 className="text-base font-bold text-slate-900">
              Polecenia diagnostyczne w Wierszu polecenia (cmd.exe)
            </h3>
            <div className="space-y-2 font-mono text-xs">
              <div className="p-2.5 bg-slate-900 text-emerald-400 rounded">
                slmgr /xpr — weryfikuje bezterminową licencję cyfrową Windows 10 Pro
              </div>
              <div className="p-2.5 bg-slate-900 text-emerald-400 rounded">
                systeminfo — wyświetla specyfikację hosta, BIOS UEFI, RAM i kompilację 19045
              </div>
              <div className="p-2.5 bg-slate-900 text-emerald-400 rounded">
                mkdir NowyKatalog — tworzy folder widoczny natychmiast na Pulpicie
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
