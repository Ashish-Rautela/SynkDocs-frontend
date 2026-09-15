/**
 * Utility functions for capturing and restoring caret (cursor) positions
 * in contentEditable elements during real-time collaborative edits.
 */

export const getCaretCharacterOffsetWithin = (element) => {
  let caretOffset = 0;
  const doc = element.ownerDocument || document;
  const win = doc.defaultView || window;
  const sel = win.getSelection();

  if (sel && sel.rangeCount > 0) {
    const range = sel.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    caretOffset = preCaretRange.toString().length;
  }
  return caretOffset;
};

export const setCaretCharacterOffsetWithin = (element, targetOffset) => {
  const doc = element.ownerDocument || document;
  const win = doc.defaultView || window;
  const sel = win.getSelection();
  if (!sel) return;

  let currentOffset = 0;
  let targetNode = null;
  let nodeOffset = 0;

  const traverseNodes = (node) => {
    if (targetNode) return;

    if (node.nodeType === Node.TEXT_NODE) {
      const nodeLength = node.textContent.length;
      if (currentOffset + nodeLength >= targetOffset) {
        targetNode = node;
        nodeOffset = Math.max(0, targetOffset - currentOffset);
        return;
      }
      currentOffset += nodeLength;
    } else {
      for (let i = 0; i < node.childNodes.length; i++) {
        traverseNodes(node.childNodes[i]);
        if (targetNode) return;
      }
    }
  };

  traverseNodes(element);

  if (!targetNode) {
    // If offset is beyond end, place cursor at the end
    targetNode = element;
    nodeOffset = element.childNodes.length;
  }

  try {
    const range = doc.createRange();
    if (targetNode.nodeType === Node.TEXT_NODE) {
      range.setStart(targetNode, Math.min(nodeOffset, targetNode.textContent.length));
    } else {
      range.setStart(targetNode, nodeOffset);
    }
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  } catch (err) {
    // Silently handle edge-case selection failures during unmounted/rapid changes
  }
};
