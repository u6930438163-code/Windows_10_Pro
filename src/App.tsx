/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DesktopEnvironment } from './components/DesktopEnvironment';
import { WindowsInstaller } from './components/WindowsInstaller';
import { DiskPartition, INITIAL_PARTITIONS } from './os/systemLogic';

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const autostartDesktop = params.get('autostart') === '1';

  const [installed, setInstalled] = useState<boolean>(autostartDesktop);
  const [systemConfig, setSystemConfig] = useState<{
    editionName: string;
    username: string;
    computerName: string;
    partitions: DiskPartition[];
  }>({
    editionName: 'Windows 10 Pro',
    username: 'Administrator',
    computerName: 'DESKTOP-WIN10PRO',
    partitions: INITIAL_PARTITIONS,
  });

  if (!installed) {
    return (
      <WindowsInstaller
        onComplete={(config) => {
          setSystemConfig(config);
          setInstalled(true);
        }}
      />
    );
  }

  return (
    <DesktopEnvironment
      editionName={systemConfig.editionName}
      username={systemConfig.username}
      computerName={systemConfig.computerName}
      partitions={systemConfig.partitions}
      onRestartInstaller={() => setInstalled(false)}
    />
  );
}
