import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useEditor } from '../../hooks/useEditor';
import { useDocument } from '../../hooks/useDocument';
import { formatDate } from '../../utils/formatters';
import { History, RotateCcw, Clock, User } from 'lucide-react';

export const VersionHistoryModal = () => {
  const { isVersionHistoryOpen, openVersionHistory } = useEditor();
  const { currentDocument, versionHistory, fetchVersionHistory } = useDocument();

  useEffect(() => {
    if (isVersionHistoryOpen && currentDocument?.id) {
      fetchVersionHistory(currentDocument.id);
    }
  }, [isVersionHistoryOpen, currentDocument?.id]);

  return (
    <Modal
      isOpen={isVersionHistoryOpen}
      onClose={() => openVersionHistory(false)}
      title="Document Version History"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        <p className="text-xs text-docs-subtext">
          Review automatic snapshots saved during collaborative editing sessions.
        </p>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {versionHistory.map((ver) => (
            <div
              key={ver.id}
              className="flex items-center justify-between p-4 border border-docs-border rounded-xl hover:border-docs-blue/50 hover:bg-blue-50/40 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-docs-bg text-docs-blue">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-docs-darkText">
                    Version {ver.version} - {ver.label}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-docs-subtext mt-0.5">
                    <User className="w-3.5 h-3.5" />
                    <span>{ver.author}</span>
                    <span>•</span>
                    <span>{formatDate(ver.timestamp)}</span>
                  </div>
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                icon={RotateCcw}
                onClick={() => {
                  alert(`Restored to Version ${ver.version}`);
                  openVersionHistory(false);
                }}
              >
                Restore
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
