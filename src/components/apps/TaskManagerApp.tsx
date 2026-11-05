import React, { useState } from 'react';
import { Activity, Cpu, HardDrive, MemoryStick, XCircle } from 'lucide-react';
import { AppId } from '../../os/systemLogic';

interface OpenWindowProcess {
  id: AppId;
  title: string;
  memoryMb: number;
  cpuPercent: number;
}

interface TaskManagerAppProps {
  openProcesses: OpenWindowProcess[];
  onCloseApp: (appId: AppId) => void;
}

export const TaskManagerApp: React.FC<TaskManagerAppProps> = ({
  openProcesses,
  onCloseApp,
}) => {
  const [tab, setTab] = useState<'processes' | 'performance'>('processes');
  const [selectedAppId, setSelectedAppId] = useState<AppId | null>(null);

  const systemProcesses = [
    { name: 'Menedżer okien pulpitu (dwm.exe)', cpu: 1.2, mem: 64.4, status: 'Działa' },
    { name: 'Eksplorator Windows (explorer.exe)', cpu: 0.8, mem: 92.1, status: 'Działa' },
    { name: 'Usługa Microsoft Defender Antivirus', cpu: 0.4, mem: 118.0, status: 'Działa' },
    { name: 'Host usługi: System lokalny (svchost.exe)', cpu: 0.3, mem: 42.6, status: 'Działa' },
  ];

  const totalCpu = Math.min(
    99,
    Math.round(
      systemProcesses.reduce((acc, p) => acc + p.cpu, 0) +
        openProcesses.reduce((acc, p) => acc + p.cpuPercent, 0) +
        6
    )
  );
  const totalRamGb = 3.4;

  return (
    <div className="flex flex-col h-full bg-white text-slate-900 text-xs select-none">
      {/* Top Tabs */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#f5f6f7] border-b border-slate-200">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setTab('processes')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              tab === 'processes'
                ? 'bg-white text-[#0078d7] shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Procesy ({openProcesses.length + systemProcesses.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('performance')}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              tab === 'performance'
                ? 'bg-white text-[#0078d7] shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Wydajność sprzętu
          </button>
        </div>

        <div className="flex items-center gap-4 font-mono tabular-nums text-[11px] text-slate-600">
          <span>CPU: {totalCpu}%</span>
          <span>RAM: {totalRamGb} / 16.0 GB (21%)</span>
          <span>Dysk C: 1%</span>
        </div>
      </div>

      {tab === 'processes' ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <th className="py-2 px-3 font-semibold">Nazwa procesu / Aplikacji</th>
                  <th className="py-2 px-3 font-semibold">Stan</th>
                  <th className="py-2 px-3 font-semibold text-right">Procesor CPU</th>
                  <th className="py-2 px-3 font-semibold text-right">Pamięć RAM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {openProcesses.map((proc) => {
                  const selected = selectedAppId === proc.id;
                  return (
                    <tr
                      key={proc.id}
                      onClick={() => setSelectedAppId(proc.id)}
                      className={`cursor-pointer ${
                        selected ? 'bg-[#cce8ff] font-medium' : 'hover:bg-[#f0f8ff]'
                      }`}
                    >
                      <td className="py-2 px-3 flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-[#0078d7]" />
                        <span>{proc.title} (Aplikacja pulpitu)</span>
                      </td>
                      <td className="py-2 px-3 text-emerald-700 font-medium">Działa</td>
                      <td className="py-2 px-3 text-right font-mono tabular-nums">
                        {proc.cpuPercent.toFixed(1)}%
                      </td>
                      <td className="py-2 px-3 text-right font-mono tabular-nums">
                        {proc.memoryMb.toFixed(1)} MB
                      </td>
                    </tr>
                  );
                })}

                {systemProcesses.map((sys) => (
                  <tr key={sys.name} className="text-slate-600 hover:bg-slate-50">
                    <td className="py-2 px-3">{sys.name}</td>
                    <td className="py-2 px-3">{sys.status}</td>
                    <td className="py-2 px-3 text-right font-mono tabular-nums">
                      {sys.cpu.toFixed(1)}%
                    </td>
                    <td className="py-2 px-3 text-right font-mono tabular-nums">
                      {sys.mem.toFixed(1)} MB
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-3 py-2 bg-[#f5f6f7] border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Wybierz uruchomioną aplikację powyżej, aby móc zakończyć jej zadanie.
            </span>
            <button
              type="button"
              disabled={!selectedAppId}
              onClick={() => {
                if (selectedAppId) {
                  onCloseApp(selectedAppId);
                  setSelectedAppId(null);
                }
              }}
              className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-rose-50 text-rose-700 border border-slate-300 disabled:opacity-40 rounded flex items-center gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" />
              Zakończ zadanie
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 overflow-y-auto">
          <div className="p-3.5 rounded border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[#0078d7]" />
                Procesor CPU
              </span>
              <span className="font-mono font-bold text-[#0078d7] tabular-nums">{totalCpu}%</span>
            </div>
            <div className="text-[11px] text-slate-600">
              Intel Core i7-12700K @ 3.60 GHz (12 rdzeni / 20 wątków)
            </div>
            <div className="w-full h-2 bg-slate-200 rounded overflow-hidden">
              <div className="h-full bg-[#0078d7]" style={{ width: `${totalCpu}%` }} />
            </div>
            <div className="text-[11px] text-slate-500 font-mono tabular-nums">
              Wirtualizacja Hyper-V: Włączona
            </div>
          </div>

          <div className="p-3.5 rounded border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <MemoryStick className="w-4 h-4 text-purple-600" />
                Pamięć RAM
              </span>
              <span className="font-mono font-bold text-purple-700 tabular-nums">21%</span>
            </div>
            <div className="text-[11px] text-slate-600">
              3.4 GB w użyciu z 16.0 GB DDR4 3200 MHz
            </div>
            <div className="w-full h-2 bg-slate-200 rounded overflow-hidden">
              <div className="h-full bg-purple-600" style={{ width: '21%' }} />
            </div>
            <div className="text-[11px] text-slate-500 font-mono tabular-nums">
              Dostępne: 12.6 GB · Gniazda: 2 z 4
            </div>
          </div>

          <div className="p-3.5 rounded border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-emerald-600" />
                Dysk 0 (C:) NVMe
              </span>
              <span className="font-mono font-bold text-emerald-700 tabular-nums">1%</span>
            </div>
            <div className="text-[11px] text-slate-600">
              Samsung PCIe 4.0 NVMe SSD 512 GB
            </div>
            <div className="w-full h-2 bg-slate-200 rounded overflow-hidden">
              <div className="h-full bg-emerald-600" style={{ width: '6%' }} />
            </div>
            <div className="text-[11px] text-slate-500 font-mono tabular-nums">
              Dysk systemowy Windows 10 Pro: Tak
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
