import React, { useState } from 'react';
import { AppId, VfsNode, executeCommandPrompt } from '../../os/systemLogic';

interface CommandPromptAppProps {
  username: string;
  editionName: string;
  nodes: VfsNode[];
  onUpdateNodes: (nodes: VfsNode[]) => void;
  onOpenApp: (appId: AppId) => void;
}

interface HistoryEntry {
  command?: string;
  lines: string[];
}

export const CommandPromptApp: React.FC<CommandPromptAppProps> = ({
  username,
  editionName,
  nodes,
  onUpdateNodes,
  onOpenApp,
}) => {
  const currentDir = `C:\\Users\\${username}\\Desktop`;
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([
    {
      lines: [
        'Microsoft Windows [Wersja 10.0.19045.5011]',
        '(c) Microsoft Corporation. Wszelkie prawa zastrzeżone.',
        '',
        'Wpisz HELP, aby wyświetlić listę dostępnych poleceń (np. ver, systeminfo, slmgr /xpr, dir, ipconfig).',
      ],
    },
  ]);

  const runCommand = (cmdStr: string) => {
    const result = executeCommandPrompt(cmdStr, {
      currentDir,
      username,
      editionName,
      nodes,
    });

    if (result.updatedNodes) {
      onUpdateNodes(result.updatedNodes);
    }
    if (result.openApp) {
      onOpenApp(result.openApp);
    }
    if (result.clearScreen) {
      setHistory([]);
    } else {
      setHistory((prev) => [
        ...prev,
        {
          command: `${currentDir}>${cmdStr}`,
          lines: result.outputLines,
        },
      ]);
    }
    setInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runCommand(input);
  };

  const quickCommands = ['ver', 'systeminfo', 'slmgr /xpr', 'dir', 'ipconfig', 'tasklist', 'winver', 'cls'];

  return (
    <div className="flex flex-col h-full bg-[#0c0c0c] text-slate-100 font-mono text-xs select-text">
      {/* Quick Command Bar for easy one-click testing */}
      <div className="flex flex-wrap items-center gap-1.5 px-3 py-1.5 bg-[#1a1a1a] border-b border-white/10">
        <span className="text-[11px] text-slate-400 mr-1">Szybkie polecenia:</span>
        {quickCommands.map((qCmd) => (
          <button
            key={qCmd}
            type="button"
            onClick={() => runCommand(qCmd)}
            className="px-2 py-0.5 text-[11px] bg-white/10 hover:bg-white/20 text-sky-300 rounded transition-colors"
          >
            {qCmd}
          </button>
        ))}
      </div>

      {/* Terminal Output */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {history.map((entry, idx) => (
          <div key={idx} className="space-y-0.5">
            {entry.command && (
              <div className="text-emerald-400 font-semibold">{entry.command}</div>
            )}
            {entry.lines.map((line, lIdx) => (
              <div key={lIdx} className="whitespace-pre-wrap leading-relaxed text-slate-200">
                {line || '\u00A0'}
              </div>
            ))}
          </div>
        ))}

        {/* Active Prompt Line */}
        <form onSubmit={handleSubmit} className="flex items-center gap-1.5 pt-1">
          <label htmlFor="cmd-prompt-input" className="text-emerald-400 shrink-0">
            {currentDir}&gt;
          </label>
          <input
            id="cmd-prompt-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Wpisz polecenie (np. systeminfo) i naciśnij Enter..."
            className="flex-1 bg-transparent text-white focus:outline-none"
            autoFocus
          />
          <button
            type="submit"
            className="px-2.5 py-0.5 text-[11px] bg-[#0078d7] hover:bg-[#1084e0] text-white rounded"
          >
            Wykonaj
          </button>
        </form>
      </div>
    </div>
  );
};
