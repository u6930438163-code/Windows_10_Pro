import React, { useEffect, useState } from 'react';
import {
  Check,
  HardDrive,
  KeyRound,
  Monitor,
  Play,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserCheck,
  Zap,
} from 'lucide-react';
import {
  DiskPartition,
  INITIAL_PARTITIONS,
  WINDOWS_EDITIONS,
  formatPartitionList,
  formatProductKey,
  isValidProductKeyOrSkipped,
} from '../os/systemLogic';

interface WindowsInstallerProps {
  onComplete: (config: {
    editionName: string;
    username: string;
    computerName: string;
    partitions: DiskPartition[];
  }) => void;
}

type InstallerStep = 'language' | 'edition' | 'partition' | 'copying' | 'oobe';

export const WindowsInstaller: React.FC<WindowsInstallerProps> = ({ onComplete }) => {
  const [step, setStep] = useState<InstallerStep>('language');
  const [language, setLanguage] = useState('Polski (Polska)');
  const [keyboardLayout, setKeyboardLayout] = useState('Polski (Programisty)');
  const [productKey, setProductKey] = useState('VK7JG-NPHTM-C97JM-9MPGT-3V66T');
  const [skipKey, setSkipKey] = useState(false);
  const [selectedEditionId, setSelectedEditionId] = useState('win10_pro');
  const [acceptedLicense, setAcceptedLicense] = useState(true);
  const [partitions, setPartitions] = useState<DiskPartition[]>(INITIAL_PARTITIONS);
  const [selectedPartitionId, setSelectedPartitionId] = useState('part_primary');
  const [partitionMessage, setPartitionMessage] = useState<string | null>(null);
  const [copyProgress, setCopyProgress] = useState(0);
  const [expressMode, setExpressMode] = useState(false);
  const [username, setUsername] = useState('Administrator');
  const [computerName, setComputerName] = useState('DESKTOP-WIN10PRO');
  const [validationError, setValidationError] = useState<string | null>(null);

  const selectedEdition =
    WINDOWS_EDITIONS.find((e) => e.id === selectedEditionId) ?? WINDOWS_EDITIONS[1];
  const selectedPartition =
    partitions.find((p) => p.id === selectedPartitionId) ?? partitions[2];

  useEffect(() => {
    if (step !== 'copying') return;
    const speedMs = expressMode ? 45 : 110;
    const increment = expressMode ? 8 : 4;
    const timer = window.setInterval(() => {
      setCopyProgress((prev) => {
        if (prev >= 100) {
          window.clearInterval(timer);
          return 100;
        }
        return Math.min(100, prev + increment);
      });
    }, speedMs);

    return () => window.clearInterval(timer);
  }, [step, expressMode]);

  useEffect(() => {
    if (step === 'copying' && copyProgress >= 100) {
      const timeout = window.setTimeout(() => {
        if (expressMode) {
          onComplete({
            editionName: selectedEdition.name,
            username: username.trim() || 'Administrator',
            computerName: computerName.trim() || 'DESKTOP-WIN10PRO',
            partitions,
          });
        } else {
          setStep('oobe');
        }
      }, 400);
      return () => window.clearTimeout(timeout);
    }
  }, [step, copyProgress, expressMode, onComplete, selectedEdition.name, username, computerName, partitions]);

  const handleQuickExpressInstall = () => {
    setSelectedEditionId('win10_pro');
    setAcceptedLicense(true);
    setSelectedPartitionId('part_primary');
    setExpressMode(true);
    setCopyProgress(24);
    setStep('copying');
  };

  const handleBootDesktopNow = () => {
    onComplete({
      editionName: selectedEdition.name,
      username: username.trim() || 'Administrator',
      computerName: computerName.trim() || 'DESKTOP-WIN10PRO',
      partitions,
    });
  };

  const handleFormatSelected = () => {
    if (!selectedPartition.canInstall) {
      setPartitionMessage('Nie można sformatować zastrzeżonej partycji systemowej EFI/MSR.');
      return;
    }
    setPartitions((prev) => formatPartitionList(prev, selectedPartition.id));
    setPartitionMessage(`Pomyślnie sformatowano partycję "${selectedPartition.name}" (NTFS).`);
  };

  const handleFinishOobe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setValidationError('Wprowadź nazwę konta użytkownika systemu Windows 10 Pro.');
      return;
    }
    setValidationError(null);
    onComplete({
      editionName: selectedEdition.name,
      username: username.trim(),
      computerName: computerName.trim() || 'DESKTOP-WIN10PRO',
      partitions,
    });
  };

  const stepIndex =
    step === 'language' ? 1 : step === 'edition' ? 2 : step === 'partition' ? 3 : step === 'copying' ? 4 : 5;

  return (
    <div className="h-screen w-screen bg-[#0c1c36] bg-gradient-to-br from-[#12082b] via-[#0b2548] to-[#004578] flex flex-col justify-between overflow-hidden select-none">
      {/* Top Bar Contract: Brand title | Step navigation | 1 Primary Action */}
      <header className="flex items-center justify-between gap-8 px-6 py-3 bg-black/40 border-b border-white/10 backdrop-blur-md shrink-0">
        <span className="text-sm font-semibold tracking-tight text-white whitespace-nowrap shrink-0">
          Instalator systemu Microsoft Windows 10 Pro (22H2 x64)
        </span>

        <nav aria-label="Etapy instalacji" className="hidden lg:flex items-center gap-5 text-xs text-slate-300">
          <button
            type="button"
            onClick={() => setStep('language')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              step === 'language' ? 'text-white font-semibold underline underline-offset-4' : ''
            }`}
          >
            1. Język i region
          </button>
          <button
            type="button"
            onClick={() => setStep('edition')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              step === 'edition' ? 'text-white font-semibold underline underline-offset-4' : ''
            }`}
          >
            2. Edycja Windows 10 Pro
          </button>
          <button
            type="button"
            onClick={() => setStep('partition')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              step === 'partition' ? 'text-white font-semibold underline underline-offset-4' : ''
            }`}
          >
            3. Dysk NVMe
          </button>
          <button
            type="button"
            onClick={() => {
              setCopyProgress(16);
              setStep('copying');
            }}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              step === 'copying' ? 'text-white font-semibold underline underline-offset-4' : ''
            }`}
          >
            4. Instalacja plików
          </button>
          <button
            type="button"
            onClick={() => setStep('oobe')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              step === 'oobe' ? 'text-white font-semibold underline underline-offset-4' : ''
            }`}
          >
            5. Konto OOBE
          </button>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleBootDesktopNow}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0078d7] hover:bg-[#106ebe] rounded shadow-sm transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Monitor className="w-3.5 h-3.5" />
            Uruchom Pulpit teraz
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <div className="w-full max-w-3xl bg-[#f2f4f8] text-slate-900 rounded shadow-2xl border border-white/40 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
                <span className="bg-[#0078d7]" />
                <span className="bg-[#0078d7]" />
                <span className="bg-[#0078d7]" />
                <span className="bg-[#0078d7]" />
              </div>
              <span className="text-xs font-medium text-slate-700">
                Instalator systemu Windows — Krok {stepIndex} z 5
              </span>
            </div>
            <span className="text-xs text-slate-500 tabular-nums">
              UEFI x64 · ISO Kompilacja 19045.5011
            </span>
          </div>

          {step === 'language' && (
            <div className="p-6 sm:p-8 flex flex-col justify-between min-h-[430px] bg-gradient-to-b from-[#005099] to-[#00396e] text-white">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="grid grid-cols-2 gap-1 w-9 h-9">
                    <span className="bg-[#00bcf2]" />
                    <span className="bg-[#00bcf2]" />
                    <span className="bg-[#00bcf2]" />
                    <span className="bg-[#00bcf2]" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Windows 10 Pro</h1>
                    <p className="text-xs text-sky-200">
                      Kreator instalacji czystego systemu Microsoft Windows 10 Professional (22H2)
                    </p>
                  </div>
                </div>

                <div className="space-y-4 max-w-xl bg-black/20 p-5 rounded border border-white/15">
                  <div className="grid grid-cols-1 sm:grid-cols-3 sm:items-center gap-2">
                    <label htmlFor="setup-lang" className="text-xs font-medium text-sky-100">
                      Instalowany język:
                    </label>
                    <select
                      id="setup-lang"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="sm:col-span-2 bg-white text-slate-900 text-sm px-3 py-1.5 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    >
                      <option value="Polski (Polska)">Polski (Polska)</option>
                      <option value="English (United States)">English (United States)</option>
                      <option value="Deutsch (Deutschland)">Deutsch (Deutschland)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 sm:items-center gap-2">
                    <label htmlFor="setup-time" className="text-xs font-medium text-sky-100">
                      Format godziny i waluty:
                    </label>
                    <input
                      id="setup-time"
                      type="text"
                      readOnly
                      value={language}
                      className="sm:col-span-2 bg-white/90 text-slate-800 text-sm px-3 py-1.5 rounded border border-slate-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 sm:items-center gap-2">
                    <label htmlFor="setup-kbd" className="text-xs font-medium text-sky-100">
                      Klawiatura lub metoda wprowadzania:
                    </label>
                    <select
                      id="setup-kbd"
                      value={keyboardLayout}
                      onChange={(e) => setKeyboardLayout(e.target.value)}
                      className="sm:col-span-2 bg-white text-slate-900 text-sm px-3 py-1.5 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    >
                      <option value="Polski (Programisty)">Polski (Programisty)</option>
                      <option value="Polski (214)">Polski (214)</option>
                      <option value="US QWERTY">US QWERTY</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/15">
                <span className="text-xs text-sky-200">
                  Wprowadź preferencje językowe i kliknij przycisk Dalej, aby rozpocząć.
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleQuickExpressInstall}
                    className="px-4 py-2 text-xs font-medium bg-white/15 hover:bg-white/25 text-white rounded border border-white/25 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <Zap className="w-3.5 h-3.5 text-sky-300" />
                    Ekspresowa instalacja (Auto)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('edition')}
                    className="px-6 py-2 text-sm font-semibold bg-white text-[#004578] hover:bg-sky-50 rounded shadow transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Zainstaluj teraz (Dalej)
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'edition' && (
            <div className="p-6 sm:p-8 flex flex-col justify-between min-h-[430px]">
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg font-semibold text-[#004578]">
                    Wybierz system operacyjny do zainstalowania oraz klucz produktu
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Domyślnie wybrano rekomendowaną edycję <strong>Windows 10 Pro (x64)</strong> z aktywacją cyfrową.
                  </p>
                </div>

                <div className="border border-slate-300 rounded bg-white overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-300 text-slate-700">
                        <th className="py-2 px-3 font-semibold">System operacyjny</th>
                        <th className="py-2 px-3 font-semibold">Architektura</th>
                        <th className="py-2 px-3 font-semibold">Funkcje edycji</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {WINDOWS_EDITIONS.map((edition) => {
                        const isSelected = edition.id === selectedEditionId;
                        return (
                          <tr
                            key={edition.id}
                            onClick={() => setSelectedEditionId(edition.id)}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-[#cce8ff] text-slate-900 font-medium'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <td className="py-2.5 px-3 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="win_edition"
                                  checked={isSelected}
                                  onChange={() => setSelectedEditionId(edition.id)}
                                  aria-label={edition.name}
                                />
                                <span>{edition.name}</span>
                                {edition.recommended && (
                                  <span className="text-[11px] text-[#005a9e] font-semibold">
                                    · Zalecana
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-2.5 px-3 font-mono tabular-nums">{edition.architecture}</td>
                            <td className="py-2.5 px-3 text-slate-600">{edition.description}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="bg-white p-4 rounded border border-slate-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="product-key-input"
                      className="text-xs font-semibold text-slate-800 flex items-center gap-1.5"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-[#0078d7]" />
                      Klucz produktu Windows 10 Pro (25 znaków):
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={skipKey}
                        onChange={(e) => setSkipKey(e.target.checked)}
                      />
                      Nie mam klucza produktu (aktywuj cyfrowo później)
                    </label>
                  </div>
                  <input
                    id="product-key-input"
                    type="text"
                    disabled={skipKey}
                    value={productKey}
                    onChange={(e) => setProductKey(formatProductKey(e.target.value))}
                    placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
                    className="w-full font-mono text-sm tracking-wider px-3 py-1.5 rounded border border-slate-300 disabled:bg-slate-100 disabled:text-slate-400"
                  />

                  <label className="flex items-center gap-2 text-xs text-slate-700 pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptedLicense}
                      onChange={(e) => setAcceptedLicense(e.target.checked)}
                    />
                    Akceptuję postanowienia licencyjne dotyczące oprogramowania firmy Microsoft (EULA).
                  </label>
                </div>

                {validationError && (
                  <p className="text-xs text-red-600 font-medium">{validationError}</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-slate-300 mt-4">
                <button
                  type="button"
                  onClick={() => setStep('language')}
                  className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded"
                >
                  Wstecz
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!isValidProductKeyOrSkipped(productKey, skipKey)) {
                      setValidationError('Wprowadź poprawny 25-znakowy klucz lub zaznacz "Nie mam klucza produktu".');
                      return;
                    }
                    if (!acceptedLicense) {
                      setValidationError('Zaakceptuj postanowienia licencyjne, aby kontynuować.');
                      return;
                    }
                    setValidationError(null);
                    setStep('partition');
                  }}
                  className="px-6 py-1.5 text-xs font-semibold text-white bg-[#0078d7] hover:bg-[#106ebe] rounded shadow-sm"
                >
                  Dalej (Wybór dysku)
                </button>
              </div>
            </div>
          )}

          {step === 'partition' && (
            <div className="p-6 sm:p-8 flex flex-col justify-between min-h-[430px]">
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-[#004578]">
                    Gdzie chcesz zainstalować system Windows 10 Pro?
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Wybierz partycję podstawową NVMe SSD lub sformatuj ją przed rozpoczęciem kopiowania plików.
                  </p>
                </div>

                <div className="border border-slate-300 rounded bg-white overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-300 text-slate-700">
                        <th className="py-2 px-3 font-semibold">Nazwa partycji</th>
                        <th className="py-2 px-3 font-semibold text-right">Rozmiar całkowity</th>
                        <th className="py-2 px-3 font-semibold text-right">Wolne miejsce</th>
                        <th className="py-2 px-3 font-semibold">Typ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {partitions.map((part) => {
                        const isSelected = part.id === selectedPartitionId;
                        return (
                          <tr
                            key={part.id}
                            onClick={() => {
                              setSelectedPartitionId(part.id);
                              setPartitionMessage(null);
                            }}
                            className={`cursor-pointer transition-colors ${
                              isSelected ? 'bg-[#cce8ff] font-medium text-slate-900' : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <td className="py-2.5 px-3 flex items-center gap-2">
                              <HardDrive className="w-4 h-4 text-[#0078d7] shrink-0" />
                              <span>{part.name}</span>
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                              {part.totalGb.toFixed(1)} GB
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                              {part.freeGb.toFixed(1)} GB
                            </td>
                            <td className="py-2.5 px-3">{part.type}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleFormatSelected}
                    className="px-3 py-1.5 text-xs font-medium text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-amber-600" />
                    Formatuj partycję (NTFS)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setPartitionMessage('Stan SMART dysku NVMe 0: Znakomity (100% żywotności, GPT/UEFI).')
                    }
                    className="px-3 py-1.5 text-xs font-medium text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#0078d7]" />
                    Odśwież dyski
                  </button>
                </div>

                {partitionMessage && (
                  <p className="text-xs text-[#005a9e] bg-sky-50 border border-sky-200 px-3 py-2 rounded">
                    {partitionMessage}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-slate-300 mt-4">
                <button
                  type="button"
                  onClick={() => setStep('edition')}
                  className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded"
                >
                  Wstecz
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!selectedPartition.canInstall) {
                      setPartitionMessage(
                        'Nie można zainstalować systemu Windows na partycji EFI/MSR. Wybierz Dysk 0 Partycja 3.'
                      );
                      return;
                    }
                    setCopyProgress(8);
                    setStep('copying');
                  }}
                  className="px-6 py-1.5 text-xs font-semibold text-white bg-[#0078d7] hover:bg-[#106ebe] rounded shadow-sm"
                >
                  Rozpocznij instalację Windows 10 Pro
                </button>
              </div>
            </div>
          )}

          {step === 'copying' && (
            <div className="p-6 sm:p-8 flex flex-col justify-between min-h-[430px]">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-[#004578]">
                    Instalowanie systemu {selectedEdition.name}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    To potrwa tylko chwilę. Twój komputer zostanie automatycznie skonfigurowany do uruchomienia pulpitu.
                  </p>
                </div>

                <div className="space-y-3 pl-2">
                  {[
                    { label: 'Kopiowanie plików systemu Windows', threshold: 20 },
                    { label: 'Przygotowywanie plików do instalacji', threshold: 55 },
                    { label: 'Instalowanie funkcji i sterowników Pro (Hyper-V, BitLocker)', threshold: 75 },
                    { label: 'Instalowanie aktualizacji zabezpieczeń 22H2', threshold: 92 },
                    { label: 'Kończenie instalacji i rozruch usług pulpitu', threshold: 100 },
                  ].map((item, idx) => {
                    const done = copyProgress >= item.threshold;
                    const active =
                      !done &&
                      (idx === 0 || copyProgress >= [0, 20, 55, 75, 92][idx]);

                    return (
                      <div key={item.label} className="flex items-center gap-3 text-sm">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                            done
                              ? 'bg-emerald-600 text-white'
                              : active
                              ? 'bg-[#0078d7] text-white'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {done ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                        </div>
                        <span
                          className={
                            done
                              ? 'text-slate-700 font-medium'
                              : active
                              ? 'text-[#004578] font-semibold'
                              : 'text-slate-400'
                          }
                        >
                          {item.label}
                          {active ? ` (${copyProgress}%)` : ''}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-medium text-slate-700 tabular-nums">
                    <span>Całkowity postęp instalacji na {selectedPartition.name}</span>
                    <span>{copyProgress}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 rounded overflow-hidden">
                    <div
                      className="h-full bg-[#0078d7] transition-all duration-150"
                      style={{ width: `${copyProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-slate-300 mt-4">
                <span className="text-xs text-slate-500">
                  Docelowa edycja: <strong>{selectedEdition.name}</strong>
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCopyProgress(100)}
                    className="px-4 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded"
                  >
                    Przeskocz do 100%
                  </button>
                  <button
                    type="button"
                    onClick={handleBootDesktopNow}
                    className="px-5 py-1.5 text-xs font-semibold text-white bg-[#0078d7] hover:bg-[#106ebe] rounded"
                  >
                    Pomiń i uruchom Pulpit
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'oobe' && (
            <form
              onSubmit={handleFinishOobe}
              className="p-6 sm:p-8 flex flex-col justify-between min-h-[430px] bg-gradient-to-b from-[#005099] to-[#003466] text-white"
            >
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-full bg-white/15">
                    <UserCheck className="w-6 h-6 text-sky-300" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">
                      Kto będzie używać tego komputera z Windows 10 Pro?
                    </h2>
                    <p className="text-xs text-sky-200">
                      Konto lokalne Administratora zostanie utworzone i zalogowane bezpośrednio na Pulpit.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 max-w-lg bg-black/25 p-5 rounded border border-white/15">
                  <div>
                    <label
                      htmlFor="oobe-username"
                      className="block text-xs font-medium text-sky-100 mb-1"
                    >
                      Nazwa użytkownika (Konto Administratora):
                    </label>
                    <input
                      id="oobe-username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="np. Administrator"
                      className="w-full bg-white text-slate-900 text-sm px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="oobe-pcname"
                      className="block text-xs font-medium text-sky-100 mb-1"
                    >
                      Nazwa komputera w sieci (Hostname):
                    </label>
                    <input
                      id="oobe-pcname"
                      type="text"
                      value={computerName}
                      onChange={(e) => setComputerName(e.target.value.toUpperCase())}
                      placeholder="DESKTOP-WIN10PRO"
                      className="w-full font-mono bg-white text-slate-900 text-sm px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-emerald-300 pt-1">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>
                      Licencja cyfrowa {selectedEdition.name} została zweryfikowana i przypisana do urządzenia.
                    </span>
                  </div>
                </div>

                {validationError && (
                  <p className="text-xs text-amber-300 font-medium">{validationError}</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-white/15 mt-4">
                <span className="text-xs text-sky-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Gotowy do pierwszego uruchomienia Pulpitu Windows 10 Pro
                </span>
                <button
                  type="submit"
                  className="px-6 py-2 text-sm font-semibold bg-white text-[#004578] hover:bg-sky-50 rounded shadow transition-colors"
                >
                  Zaloguj i uruchom Pulpit Windows 10 Pro
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <footer className="px-6 py-2.5 bg-black/50 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 shrink-0">
        <span>Microsoft Windows 10 Professional Setup (x64) · Kompilacja 19045.5011</span>
        <span>Wybierz "Uruchom Pulpit teraz" w prawym górnym rogu, aby pominąć kreator</span>
      </footer>
    </div>
  );
};
