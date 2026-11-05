export type AppId =
  | 'explorer'
  | 'cmd'
  | 'notepad'
  | 'taskmgr'
  | 'settings'
  | 'calc'
  | 'edge'
  | 'winver';

export interface VfsNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  parentId: string;
  content?: string;
  sizeBytes: number;
  modifiedAt: string;
  originalParentId?: string;
}

export interface DiskPartition {
  id: string;
  name: string;
  totalGb: number;
  freeGb: number;
  type: 'Podstawowa' | 'System' | 'MSR (Zastrzeżona)' | 'Nieprzydzielone miejsce';
  formatted: boolean;
  canInstall: boolean;
}

export interface WindowsEdition {
  id: string;
  name: string;
  architecture: 'x64';
  description: string;
  recommended?: boolean;
}

export interface WallpaperOption {
  id: string;
  name: string;
  subtitle: string;
  url: string;
  fallbackGradient: string;
}

export const WALLPAPERS: WallpaperOption[] = [
  {
    id: 'hero',
    name: 'Windows 10 Pro Hero (Domyślna)',
    subtitle: 'Kultowa niebieska wiązka światła Windows 10',
    url: '/wallpapers/win10-hero.svg',
    fallbackGradient: 'radial-gradient(circle at 60% 48%, #0078d7 0%, #002b5e 45%, #000b1a 100%)',
  },
  {
    id: 'mountain',
    name: 'Alpejskie Jezioro o Zmierzchu',
    subtitle: 'Krajobraz nocny Windows Spotlight 4K',
    url: '/wallpapers/win10-mountain.svg',
    fallbackGradient: 'linear-gradient(160deg, #0b192c 0%, #1e3e62 55%, #000000 100%)',
  },
  {
    id: 'fluent',
    name: 'Microsoft Fluent Acrylic',
    subtitle: 'Abstrakcyjne fale szkła akrylowego',
    url: '/wallpapers/win10-fluent.svg',
    fallbackGradient: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #0f172a 100%)',
  },
];

export const WINDOWS_EDITIONS: WindowsEdition[] = [
  {
    id: 'win10_home',
    name: 'Windows 10 Home',
    architecture: 'x64',
    description: 'Podstawowa edycja dla komputerów domowych bez funkcji BitLocker, Hyper-V i zasad grupy.',
  },
  {
    id: 'win10_pro',
    name: 'Windows 10 Pro',
    architecture: 'x64',
    description: 'Pełna wersja profesjonalna: szyfrowanie BitLocker, Zdalny pulpit (RDP), Hyper-V, Edytor lokalnych zasad grupy (gpedit.msc) oraz dołączanie do domeny Active Directory.',
    recommended: true,
  },
  {
    id: 'win10_pro_workstations',
    name: 'Windows 10 Pro for Workstations',
    architecture: 'x64',
    description: 'Zaawansowana obsługa systemów plików ReFS oraz pamięci trwałej NVDIMM dla stacji roboczych.',
  },
];

export const INITIAL_PARTITIONS: DiskPartition[] = [
  {
    id: 'part_efi',
    name: 'Dysk 0 Partycja 1: System EFI',
    totalGb: 0.5,
    freeGb: 0.46,
    type: 'System',
    formatted: true,
    canInstall: false,
  },
  {
    id: 'part_msr',
    name: 'Dysk 0 Partycja 2: MSR (Zastrzeżona)',
    totalGb: 0.1,
    freeGb: 0.1,
    type: 'MSR (Zastrzeżona)',
    formatted: true,
    canInstall: false,
  },
  {
    id: 'part_primary',
    name: 'Dysk 0 Partycja 3: Windows 10 NVMe',
    totalGb: 511.4,
    freeGb: 486.2,
    type: 'Podstawowa',
    formatted: true,
    canInstall: true,
  },
];

export const INITIAL_VFS_NODES: VfsNode[] = [
  {
    id: 'file_welcome',
    name: 'Witamy w Windows 10 Pro.txt',
    type: 'file',
    parentId: 'desktop',
    sizeBytes: 642,
    modifiedAt: '2026-11-05 12:00',
    content: [
      '======================================================',
      '   MICROSOFT WINDOWS 10 PRO (Wersja 22H2 - 64-bit)    ',
      '======================================================',
      '',
      'Instalacja systemu Windows 10 Pro zakończyła się pomyślnie!',
      '',
      'Kluczowe funkcje dostępne na pulpicie:',
      '1. Eksplorator plików (Ten komputer) - zarządzanie plikami na dysku C:',
      '2. Wiersz polecenia (cmd.exe) - polecenia: ver, systeminfo, dir, slmgr /xpr',
      '3. Notatnik - edycja i zapisywanie plików tekstowych prosto na Pulpicie',
      '4. Menedżer zadań - monitorowanie procesów oraz zużycia CPU i pamięci RAM',
      '5. Ustawienia - zmiana tapety Windows 10, kolorów wiodących i motywu',
      '',
      'Klucz produktu OEM/Pro: VK7JG-NPHTM-C97JM-9MPGT-3V66T (Aktywowany cyfrowo)',
    ].join('\n'),
  },
  {
    id: 'file_key',
    name: 'Klucz_Licencyjny_Pro.txt',
    type: 'file',
    parentId: 'documents',
    sizeBytes: 318,
    modifiedAt: '2026-11-05 12:01',
    content: [
      'Edycja: Windows 10 Pro (x64)',
      'Kompilacja: 19045.5011',
      'Klucz domyślny KMS/Pro: VK7JG-NPHTM-C97JM-9MPGT-3V66T',
      'Stan licencji: System Windows jest aktywowany przy użyciu licencji cyfrowej.',
    ].join('\n'),
  },
  {
    id: 'file_sysreport',
    name: 'Raport_Instalacji_SetupDiag.log',
    type: 'file',
    parentId: 'documents',
    sizeBytes: 512,
    modifiedAt: '2026-11-05 12:02',
    content: [
      '[SetupDiag] HostOSVersion = 10.0.19045',
      '[SetupDiag] TargetEdition = Professional (Windows 10 Pro)',
      '[SetupDiag] BootMode = UEFI + SecureBoot Enabled',
      '[SetupDiag] TargetPartition = Disk 0 Partition 3 (NVMe 512 GB)',
      '[SetupDiag] Result = SUKCES (0x00000000)',
    ].join('\n'),
  },
  {
    id: 'folder_projects',
    name: 'Projekty systemowe',
    type: 'folder',
    parentId: 'desktop',
    sizeBytes: 0,
    modifiedAt: '2026-11-05 12:05',
  },
  {
    id: 'file_iso',
    name: 'Win10_22H2_Polish_x64.iso',
    type: 'file',
    parentId: 'downloads',
    sizeBytes: 5892997120,
    modifiedAt: '2026-11-05 11:45',
    content: '[Obraz instalacyjny ISO Microsoft Windows 10 Pro 22H2 PL x64 - 5.49 GB]',
  },
];

export function formatProductKey(raw: string): string {
  const cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 25);
  const groups: string[] = [];
  for (let i = 0; i < cleaned.length; i += 5) {
    groups.push(cleaned.slice(i, i + 5));
  }
  return groups.join('-');
}

export function isValidProductKeyOrSkipped(key: string, skipped: boolean): boolean {
  if (skipped) return true;
  return /^[A-Z0-9]{5}(-[A-Z0-9]{5}){4}$/.test(key.trim().toUpperCase());
}

export function formatPartitionList(
  partitions: DiskPartition[],
  targetId: string
): DiskPartition[] {
  return partitions.map((part) => {
    if (part.id !== targetId) return part;
    return {
      ...part,
      freeGb: Number((part.totalGb - 0.1).toFixed(2)),
      formatted: true,
      type: 'Podstawowa',
      canInstall: true,
    };
  });
}

export function createVfsNode(
  nodes: VfsNode[],
  params: {
    name: string;
    type: 'folder' | 'file';
    parentId: string;
    content?: string;
    nowStr?: string;
  }
): VfsNode[] {
  const baseName = params.name.trim() || (params.type === 'folder' ? 'Nowy folder' : 'Nowy dokument.txt');
  const existingNames = new Set(
    nodes.filter((n) => n.parentId === params.parentId).map((n) => n.name.toLowerCase())
  );

  let finalName = baseName;
  let counter = 2;
  while (existingNames.has(finalName.toLowerCase())) {
    if (params.type === 'file' && baseName.includes('.')) {
      const dotIndex = baseName.lastIndexOf('.');
      finalName = `${baseName.slice(0, dotIndex)} (${counter})${baseName.slice(dotIndex)}`;
    } else {
      finalName = `${baseName} (${counter})`;
    }
    counter++;
  }

  const content = params.content ?? '';
  const newNode: VfsNode = {
    id: `node_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: finalName,
    type: params.type,
    parentId: params.parentId,
    content: params.type === 'file' ? content : undefined,
    sizeBytes: params.type === 'file' ? Math.max(12, content.length) : 0,
    modifiedAt: params.nowStr ?? '2026-11-05 12:15',
  };

  return [...nodes, newNode];
}

export function moveNodeToRecycleBin(nodes: VfsNode[], nodeId: string): VfsNode[] {
  return nodes.map((n) => {
    if (n.id !== nodeId) return n;
    if (n.parentId === 'recycle') return n;
    return {
      ...n,
      originalParentId: n.parentId,
      parentId: 'recycle',
    };
  });
}

export function restoreNodeFromRecycleBin(nodes: VfsNode[], nodeId: string): VfsNode[] {
  return nodes.map((n) => {
    if (n.id !== nodeId || n.parentId !== 'recycle') return n;
    return {
      ...n,
      parentId: n.originalParentId || 'desktop',
      originalParentId: undefined,
    };
  });
}

export function emptyRecycleBin(nodes: VfsNode[]): VfsNode[] {
  return nodes.filter((n) => n.parentId !== 'recycle');
}

export interface CmdExecutionResult {
  outputLines: string[];
  clearScreen?: boolean;
  updatedNodes?: VfsNode[];
  openApp?: AppId;
  currentDir: string;
}

export function executeCommandPrompt(
  rawCommand: string,
  state: {
    currentDir: string;
    username: string;
    editionName: string;
    nodes: VfsNode[];
  }
): CmdExecutionResult {
  const trimmed = rawCommand.trim();
  if (!trimmed) {
    return { outputLines: [], currentDir: state.currentDir };
  }

  const parts = trimmed.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  switch (cmd) {
    case 'help':
      return {
        currentDir: state.currentDir,
        outputLines: [
          'Dostępne polecenia systemu Windows 10 Pro:',
          '  VER          Wyświetla dokładną wersję i kompilację systemu Windows 10.',
          '  SYSTEMINFO   Wyświetla szczegółową konfigurację systemu Windows 10 Pro.',
          '  SLMGR /XPR   Sprawdza stan aktywacji licencji Windows 10 Pro.',
          '  DIR          Wyświetla listę plików i podkatalogów na Pulpicie.',
          '  MKDIR <nazwa> Twrzy nowy folder na Pulpicie.',
          '  ECHO <tekst> Wyświetla komunikat tekstowy.',
          '  IPCONFIG     Wyświetla konfigurację protokołu IP karty sieciowej.',
          '  TASKLIST     Wyświetla listę uruchomionych procesów systemowych.',
          '  WINVER       Otwiera okno dialogowe Informacje o systemie Windows.',
          '  CLS          Czyści ekran terminala.',
        ],
      };

    case 'cls':
    case 'clear':
      return {
        currentDir: state.currentDir,
        clearScreen: true,
        outputLines: [],
      };

    case 'ver':
      return {
        currentDir: state.currentDir,
        outputLines: ['Microsoft Windows [Wersja 10.0.19045.5011]'],
      };

    case 'winver':
      return {
        currentDir: state.currentDir,
        openApp: 'winver',
        outputLines: ['Uruchamianie okna Informacje o systemie Windows (winver.exe)...'],
      };

    case 'systeminfo':
      return {
        currentDir: state.currentDir,
        outputLines: [
          `Nazwa hosta:                   DESKTOP-WIN10PRO`,
          `Nazwa systemu operacyjnego:    Microsoft ${state.editionName}`,
          `Wersja systemu operacyjnego:   10.0.19045 N/A Kompilacja 19045.5011 (22H2)`,
          `Producent systemu:             Microsoft Corporation`,
          `Typ systemu:                   x64-based PC`,
          `Zarejestrowany właściciel:     ${state.username}`,
          `Identyfikator produktu:        00330-80000-00000-AA649`,
          `Tryb rozruchu BIOS:            UEFI (Secure Boot włączony)`,
          `Całkowity rozmiar pamięci:     16 384 MB DDR4 3200 MHz`,
          `Dysk systemowy (C:):           511.4 GB NVMe SSD (System plików NTFS)`,
          `Domena / Grupa robocza:        WORKGROUP (Gotowy na Active Directory)`,
        ],
      };

    case 'slmgr':
    case 'slmgr.vbs':
      return {
        currentDir: state.currentDir,
        outputLines: [
          'Host skryptów systemu Windows (Wersja 5.812)',
          `Edycja: ${state.editionName} (Professional Edition)`,
          'Maszyna jest trwale aktywowana przy użyciu licencji cyfrowej.',
        ],
      };

    case 'ipconfig':
      return {
        currentDir: state.currentDir,
        outputLines: [
          'Konfiguracja IP systemu Windows',
          '',
          'Karta Ethernet Ethernet0 (Intel I225-V 2.5GbE):',
          '   Sufiks DNS konkretnego połączenia : localdomain',
          '   Adres IPv6 połączenia lokalnego . : fe80::8c4a:b2ff:fe19:1045%4',
          '   Adres IPv4. . . . . . . . . . . . : 192.168.1.104',
          '   Maska podsieci. . . . . . . . . . : 255.255.255.0',
          '   Brama domyślna. . . . . . . . . . : 192.168.1.1',
        ],
      };

    case 'dir':
    case 'ls': {
      const desktopNodes = state.nodes.filter((n) => n.parentId === 'desktop');
      const lines = [
        ' Wolumin w stacji C to Windows 10 Pro',
        ' Numer seryjny woluminu: 94E2-10F8',
        '',
        ` Katalog: ${state.currentDir}`,
        '',
      ];
      for (const node of desktopNodes) {
        const tag = node.type === 'folder' ? '<DIR>         ' : `${String(node.sizeBytes).padStart(14, ' ')}`;
        lines.push(`${node.modifiedAt}    ${tag} ${node.name}`);
      }
      lines.push(`               Plików: ${desktopNodes.filter((n) => n.type === 'file').length}`);
      lines.push(`               Katalogów: ${desktopNodes.filter((n) => n.type === 'folder').length} (486 200 000 000 bajtów wolnych)`);
      return {
        currentDir: state.currentDir,
        outputLines: lines,
      };
    }

    case 'mkdir':
    case 'md': {
      const folderName = args.join(' ').trim();
      if (!folderName) {
        return {
          currentDir: state.currentDir,
          outputLines: ['Składnia polecenia jest niepoprawna. Użycie: mkdir <nazwa_folderu>'],
        };
      }
      const nextNodes = createVfsNode(state.nodes, {
        name: folderName,
        type: 'folder',
        parentId: 'desktop',
      });
      return {
        currentDir: state.currentDir,
        updatedNodes: nextNodes,
        outputLines: [`Utworzono katalog "${folderName}" na Pulpicie.`],
      };
    }

    case 'echo':
      return {
        currentDir: state.currentDir,
        outputLines: [args.join(' ')],
      };

    case 'tasklist':
      return {
        currentDir: state.currentDir,
        outputLines: [
          'Nazwa obrazu                   PID Nazwa sesji     Nr sesji  Użycie pamięci',
          '========================= ======== ================ ======== ==============',
          'System Idle Process              0 Services                0           8 KB',
          'System                           4 Services                0         148 KB',
          'svchost.exe                    812 Services                0      24 420 KB',
          'dwm.exe                       1104 Console                 1      58 912 KB',
          'explorer.exe                  2480 Console                 1      94 120 KB',
          'SearchApp.exe                 3192 Console                 1      46 800 KB',
          'cmd.exe                       4816 Console                 1      12 540 KB',
        ],
      };

    case 'whoami':
      return {
        currentDir: state.currentDir,
        outputLines: [`desktop-win10pro\\${state.username.toLowerCase()}`],
      };

    default:
      return {
        currentDir: state.currentDir,
        outputLines: [
          `Nazwa '${parts[0]}' nie jest rozpoznawana jako polecenie wewnętrzne lub zewnętrzne,`,
          'program wykonywalny lub plik wsadowy. Wpisz HELP, aby zobaczyć listę poleceń.',
        ],
      };
  }
}

export function evaluateCalculator(a: number, b: number, operator: '+' | '-' | '*' | '/'): {
  value: number | null;
  error?: string;
} {
  if (operator === '/') {
    if (b === 0) {
      return { value: null, error: 'Nie można dzielić przez zero' };
    }
    return { value: Number((a / b).toFixed(8)) };
  }
  if (operator === '+') return { value: Number((a + b).toFixed(8)) };
  if (operator === '-') return { value: Number((a - b).toFixed(8)) };
  return { value: Number((a * b).toFixed(8)) };
}
