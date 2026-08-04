import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocument } from '../../hooks/useDocument';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import { formatRelativeTime } from '../../utils/formatters';
import { ROUTES } from '../../constants/routes';
import { Users, FileText, ExternalLink } from 'lucide-react';

export const SharedDocumentsPage = () => {
  const navigate = useNavigate();
  const { sharedDocuments, fetchDocuments, loading } = useDocument();

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 pb-4 border-b border-docs-border">
        <div className="p-3 rounded-2xl bg-blue-50 text-docs-blue">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-docs-darkText">Shared Documents</h1>
          <p className="text-xs text-docs-subtext">Documents shared with you by external organization members.</p>
        </div>
      </div>

      {loading ? (
        <Loader text="Fetching shared documents..." />
      ) : sharedDocuments.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-docs-border space-y-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-docs-blue flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-docs-darkText">No shared documents</h3>
          <p className="text-xs text-docs-subtext">When someone shares a document with you, it will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sharedDocuments.map((doc) => (
            <div
              key={doc.id}
              onClick={() => navigate(ROUTES.EDITOR_BUILDER(doc.id))}
              className="bg-white border border-docs-border rounded-2xl p-5 hover:shadow-docs-card transition-all cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-docs-blue shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <Badge variant="blue">SHARED EDITOR</Badge>
              </div>

              <div>
                <h3 className="text-base font-bold text-docs-darkText line-clamp-1">{doc.title}</h3>
                <p className="text-xs text-docs-subtext line-clamp-2 mt-1">
                  {doc.content.replace(/<[^>]*>?/gm, '')}
                </p>
              </div>

              <div className="pt-3 border-t border-docs-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar src={doc.owner?.avatarUrl} name={doc.owner?.name} size="sm" />
                  <span className="text-xs font-medium text-docs-darkText">{doc.owner?.name}</span>
                </div>
                <span className="text-[11px] text-docs-subtext">
                  {formatRelativeTime(doc.updatedAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
