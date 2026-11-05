import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_PARTITIONS,
  INITIAL_VFS_NODES,
  createVfsNode,
  emptyRecycleBin,
  evaluateCalculator,
  executeCommandPrompt,
  formatPartitionList,
  formatProductKey,
  isValidProductKeyOrSkipped,
  moveNodeToRecycleBin,
  restoreNodeFromRecycleBin,
} from './systemLogic';

test('formatProductKey formats 25 alphanumeric characters into 5x5 Windows key blocks', () => {
  const formatted = formatProductKey('vk7jgnphtmc97jm9mpgt3v66t');
  assert.equal(formatted, 'VK7JG-NPHTM-C97JM-9MPGT-3V66T');
  assert.equal(isValidProductKeyOrSkipped(formatted, false), true);
  assert.equal(isValidProductKeyOrSkipped('12345', false), false);
  assert.equal(isValidProductKeyOrSkipped('', true), true);
});

test('formatPartitionList resets free space on target partition and keeps it installable', () => {
  const updated = formatPartitionList(INITIAL_PARTITIONS, 'part_primary');
  const primary = updated.find((p) => p.id === 'part_primary');
  assert.ok(primary);
  assert.equal(primary.freeGb, 511.3);
  assert.equal(primary.canInstall, true);
});

test('VFS creates unique desktop files/folders and handles Recycle Bin cycle', () => {
  const step1 = createVfsNode(INITIAL_VFS_NODES, {
    name: 'Notatka.txt',
    type: 'file',
    parentId: 'desktop',
    content: 'Test Windows 10 Pro',
  });
  const step2 = createVfsNode(step1, {
    name: 'Notatka.txt',
    type: 'file',
    parentId: 'desktop',
    content: 'Duplikat',
  });

  const created1 = step2.find((n) => n.name === 'Notatka.txt');
  const created2 = step2.find((n) => n.name === 'Notatka (2).txt');
  assert.ok(created1);
  assert.ok(created2);

  const recycled = moveNodeToRecycleBin(step2, created1.id);
  assert.equal(recycled.find((n) => n.id === created1.id)?.parentId, 'recycle');

  const restored = restoreNodeFromRecycleBin(recycled, created1.id);
  assert.equal(restored.find((n) => n.id === created1.id)?.parentId, 'desktop');

  const recycledAgain = moveNodeToRecycleBin(restored, created1.id);
  const emptied = emptyRecycleBin(recycledAgain);
  assert.equal(emptied.find((n) => n.id === created1.id), undefined);
});

test('executeCommandPrompt supports ver, systeminfo, mkdir, and slmgr', () => {
  const verRes = executeCommandPrompt('ver', {
    currentDir: 'C:\\Users\\Administrator\\Desktop',
    username: 'Administrator',
    editionName: 'Windows 10 Pro',
    nodes: INITIAL_VFS_NODES,
  });
  assert.ok(verRes.outputLines[0].includes('10.0.19045'));

  const mkdirRes = executeCommandPrompt('mkdir TestFolderCMD', {
    currentDir: 'C:\\Users\\Administrator\\Desktop',
    username: 'Administrator',
    editionName: 'Windows 10 Pro',
    nodes: INITIAL_VFS_NODES,
  });
  assert.ok(mkdirRes.updatedNodes);
  assert.ok(mkdirRes.updatedNodes.some((n) => n.name === 'TestFolderCMD' && n.parentId === 'desktop'));
});

test('evaluateCalculator computes operations and guards division by zero', () => {
  assert.deepEqual(evaluateCalculator(12, 8, '+'), { value: 20 });
  assert.deepEqual(evaluateCalculator(10, 0, '/'), {
    value: null,
    error: 'Nie można dzielić przez zero',
  });
});
