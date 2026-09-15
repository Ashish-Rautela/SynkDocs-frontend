/**
 * Real-Time Character-Level Synchronization & Conflict Resolution Engine
 * Handles character-level operational diffing, transformations, and deterministic merge.
 */

/**
 * Computes the minimal character-level diff between two text strings.
 * Returns null if strings are identical, or an operation object.
 */
export const computeTextDiff = (oldText = '', newText = '', authorId = '') => {
  if (oldText === newText) return null;

  const oldLen = oldText.length;
  const newLen = newText.length;

  let start = 0;
  while (start < oldLen && start < newLen && oldText[start] === newText[start]) {
    start++;
  }

  let oldEnd = oldLen - 1;
  let newEnd = newLen - 1;
  while (oldEnd >= start && newEnd >= start && oldText[oldEnd] === newText[newEnd]) {
    oldEnd--;
    newEnd--;
  }

  const deleteCount = Math.max(0, oldEnd - start + 1);
  const insertText = newText.slice(start, newEnd + 1);

  return {
    opId: `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    authorId,
    timestamp: Date.now(),
    index: start,
    deleteCount,
    text: insertText,
  };
};

/**
 * Applies an operation cleanly to a base text string.
 */
export const applyOperation = (baseText = '', op) => {
  if (!op) return baseText;

  const idx = Math.max(0, Math.min(baseText.length, op.index || 0));
  const deleteCount = Math.max(0, op.deleteCount || 0);
  const insertText = op.text || '';

  const prefix = baseText.slice(0, idx);
  const suffix = baseText.slice(idx + deleteCount);

  return prefix + insertText + suffix;
};

/**
 * Transforms an incoming remote operation against a locally applied concurrent operation
 * to ensure deterministic convergence when both users type concurrently.
 */
export const transformOperation = (incomingOp, localOp) => {
  if (!incomingOp || !localOp) return incomingOp;

  const transformed = { ...incomingOp };

  // Case 1: Remote operation happens strictly after local operation
  if (incomingOp.index > localOp.index) {
    const localInsertLen = (localOp.text && localOp.text.length) || 0;
    const localDelLen = localOp.deleteCount || 0;
    transformed.index = Math.max(localOp.index, incomingOp.index + localInsertLen - localDelLen);
    return transformed;
  }

  // Case 2: Both operations happen at the exact same index (conflict)
  if (incomingOp.index === localOp.index) {
    // Deterministic tie-breaker: compare timestamp then authorId
    const incomingWins =
      incomingOp.timestamp < localOp.timestamp ||
      (incomingOp.timestamp === localOp.timestamp && (incomingOp.authorId || '') < (localOp.authorId || ''));

    if (!incomingWins) {
      // Local operation took precedence, shift incoming remote operation forward
      const localInsertLen = (localOp.text && localOp.text.length) || 0;
      transformed.index += localInsertLen;
    }
    return transformed;
  }

  // Case 3: Remote operation happens strictly before local operation
  return transformed;
};

/**
 * Adjusts the local user's caret offset when a remote operation is applied.
 * Prevents cursor jumps and keeps cursor attached to the user's active typing position.
 */
export const adjustCaretOffset = (currentCaretOffset, remoteOp) => {
  if (currentCaretOffset === null || currentCaretOffset === undefined) return 0;
  if (!remoteOp) return currentCaretOffset;

  const opIdx = remoteOp.index || 0;

  // Remote change occurred after the user's cursor: cursor position unaffected
  if (opIdx > currentCaretOffset) {
    return currentCaretOffset;
  }

  // Remote change occurred at or before the user's cursor
  const deleteCount = remoteOp.deleteCount || 0;
  const insertLen = (remoteOp.text && remoteOp.text.length) || 0;

  // If remote deleted characters across/before cursor
  let newOffset = currentCaretOffset;
  if (deleteCount > 0) {
    if (currentCaretOffset >= opIdx + deleteCount) {
      newOffset -= deleteCount;
    } else {
      newOffset = opIdx;
    }
  }

  // Add remote inserted characters
  if (insertLen > 0 && opIdx <= currentCaretOffset) {
    newOffset += insertLen;
  }

  return Math.max(0, newOffset);
};
