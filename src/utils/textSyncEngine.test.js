import assert from 'node:assert';
import {
  computeTextDiff,
  applyOperation,
  transformOperation,
  adjustCaretOffset,
} from './textSyncEngine.js';

// 1. computeTextDiff and applyOperation
{
  const base = 'Hello world';
  const updated = 'Hello beautiful world';
  const diff = computeTextDiff(base, updated, 'user1');
  assert.strictEqual(diff.index, 6);
  assert.strictEqual(diff.deleteCount, 0);
  assert.strictEqual(diff.text, 'beautiful ');
  const merged = applyOperation(base, diff);
  assert.strictEqual(merged, updated);
}

// 2. Character deletion
{
  const base = 'Hello beautiful world';
  const updated = 'Hello world';
  const diff = computeTextDiff(base, updated, 'user1');
  assert.strictEqual(diff.index, 6);
  assert.strictEqual(diff.deleteCount, 10);
  assert.strictEqual(diff.text, '');
  const merged = applyOperation(base, diff);
  assert.strictEqual(merged, updated);
}

// 3. Concurrent edits at DIFFERENT places (both preserved)
{
  const initial = 'The quick brown fox';
  // User A inserts at start (index 0)
  const diffA = computeTextDiff(initial, 'Hey! The quick brown fox', 'userA');
  // User B inserts at end (index 19)
  const diffB = computeTextDiff(initial, 'The quick brown fox jumps', 'userB');

  // Apply A then transformed B
  const afterA = applyOperation(initial, diffA);
  const transformedB = transformOperation(diffB, diffA);
  const finalAB = applyOperation(afterA, transformedB);

  assert.strictEqual(finalAB, 'Hey! The quick brown fox jumps');
}

// 4. Concurrent edits at the SAME place (conflict resolution without losing either)
{
  const initial = 'Hello ';
  // User A and User B both type at the end simultaneously
  const opA = { index: 6, text: 'Alice', deleteCount: 0, timestamp: 100, authorId: 'A' };
  const opB = { index: 6, text: 'Bob', deleteCount: 0, timestamp: 100, authorId: 'B' };

  // Transform B against A
  const transformedB = transformOperation(opB, opA);
  // Apply A then transformed B
  const afterA = applyOperation(initial, opA);
  const final = applyOperation(afterA, transformedB);

  // Both names are preserved deterministically
  assert.strictEqual(final, 'Hello AliceBob');
}

// 5. Caret offset adjustments
{
  const caret = 10;
  // Remote insert before caret (at index 5, length 3) -> caret shifts +3
  const opInsert = { index: 5, text: 'abc', deleteCount: 0 };
  assert.strictEqual(adjustCaretOffset(caret, opInsert), 13);

  // Remote delete before caret (at index 2, deleteCount 4) -> caret shifts -4
  const opDel = { index: 2, text: '', deleteCount: 4 };
  assert.strictEqual(adjustCaretOffset(caret, opDel), 6);

  // Remote insert after caret (at index 15) -> caret remains 10
  const opAfter = { index: 15, text: 'xyz', deleteCount: 0 };
  assert.strictEqual(adjustCaretOffset(caret, opAfter), 10);
}

console.log('All textSyncEngine tests passed cleanly!');
