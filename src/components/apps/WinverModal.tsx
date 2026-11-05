import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface WinverModalProps {
  editionName: string;
  username: string;
  computerName: string;
  onClose: () => void;
}

export const WinverModal: React.FC<WinverModalProps> = ({
  editionName,
  username,
  computerName,
  onClose,
}) => {
  return (
    <div className="p-4 bg-white text-slate-900 flex flex-col justify-between h-full select-text overflow-y-auto">
      <div className="space-y-3">
        <div className="flex items-center gap-3 pb-2.5 border-b border-slate-200">
          <div className="grid grid-cols-2 gap-1 w-8 h-8 shrink-0">
            <span className="bg-[#0078d7]" />
            <span className="bg-[#0078d7]" />
            <span className="bg-[#0078d7]" />
            <span className="bg-[#0078d7]" />
          </div>
          <div>
            <div className="text-xl font-semibold tracking-tight text-[#0078d7]">
              Windows 10
            </div>
            <div className="text-xs text-slate-500">Microsoft Corporation</div>
          </div>
        </div>

        <div className="space-y-1.5 text-xs text-slate-700 leading-relaxed">
          <p className="font-semibold text-slate-900">Microsoft Windows</p>
          <p className="font-mono tabular-nums">
            Wersja 22H2 (Kompilacja systemu operacyjnego 19045.5011)
          </p>
          <p>© Microsoft Corporation. Wszelkie prawa zastrzeżone.</p>
          <p className="pt-0.5">
            System operacyjny <strong>{editionName}</strong> i jego interfejs użytkownika są chronione znakami towarowymi oraz innymi prawami własności intelektualnej.
          </p>
        </div>

        <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-1 text-xs">
          <div className="text-slate-500">
            Produkt licencjonowany dla użytkownika:
          </div>
          <div className="font-semibold text-slate-900">
            {username} ({computerName})
          </div>
          <div className="flex items-center gap-1.5 text-emerald-700 font-medium pt-0.5">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Stan licencji: Aktywowano licencją cyfrową Windows 10 Pro</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-3 border-t border-slate-200 mt-2 shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-1.5 text-xs font-semibold text-white bg-[#0078d7] hover:bg-[#106ebe] rounded shadow-sm transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
};
