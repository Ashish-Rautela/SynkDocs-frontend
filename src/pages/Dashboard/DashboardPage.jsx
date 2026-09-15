import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocument } from '../../hooks/useDocument';
import { Avatar } from '../../components/common/Avatar';
import { Loader } from '../../components/common/Loader';
import { Dropdown } from '../../components/common/Dropdown';
import { formatRelativeTime, getDocumentType, decodeHtmlEntities, getDocumentPreviewText } from '../../utils/formatters';
import { ROUTES } from '../../constants/routes';
import { PendingRequestsList } from '../../components/dashboard/PendingRequestsList';
import {
  Plus,
  FileText,
  MoreVertical,
  Trash2,
  ExternalLink,
  Clock,
  Users,
  Grid,
  List,
  FileSpreadsheet,
  NotebookPen,
} from 'lucide-react';

// ponytail: central visual config for document types (notes, sheet, doc)
const DOC_TYPE_CONFIG = {
  notes: {
    label: 'Notes',
    badgeText: 'Note',
    icon: NotebookPen,
    badgeClass: 'bg-amber-100/90 text-amber-800 border-amber-300/80',
    iconBoxClass: 'bg-amber-100 text-amber-700',
    previewBgClass: 'bg-amber-50/50',
    accentBorderClass: 'border-t-4 border-amber-500',
  },
  sheet: {
    label: 'Data Sheet',
    badgeText: 'Sheet',
    icon: FileSpreadsheet,
    badgeClass: 'bg-emerald-100/90 text-emerald-800 border-emerald-300/80',
    iconBoxClass: 'bg-emerald-100 text-emerald-700',
    previewBgClass: 'bg-emerald-50/40',
    accentBorderClass: 'border-t-4 border-emerald-500',
  },
  doc: {
    label: 'Document',
    badgeText: 'Doc',
    icon: FileText,
    badgeClass: 'bg-blue-100/90 text-blue-800 border-blue-300/80',
    iconBoxClass: 'bg-blue-50 text-docs-blue',
    previewBgClass: 'bg-docs-bg',
    accentBorderClass: 'border-t-4 border-docs-blue',
  },
};

export const DashboardPage = () => {
  const navigate = useNavigate();
  const {
    filteredDocuments,
    loading,
    fetchDocuments,
    createDocument,
    deleteDocument,
    filterCategory,
    updateFilterCategory,
  } = useDocument();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  useEffect(() => {
    fetchDocuments();
  }, []);

  const templates = [
    {
      title: 'Blank Document',
      icon: Plus,
      color: 'bg-white border-dashed border-2 border-docs-blue text-docs-blue',
      content: '',
    },
    {
      title: 'Data Sheet',
      icon: FileSpreadsheet,
      color: 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700',
      content: '<!-- TYPE:DATASHEET -->{"gridData":{},"cols":["A","B","C","D","E","F","G","H"],"rowCount":15}',
    },
    {
      title: 'Notes',
      icon: NotebookPen,
      color: 'bg-amber-600 text-white shadow-sm hover:bg-amber-700',
      content: '<!-- TYPE:NOTES -->{"pages":[{"id":1,"textContent":"","drawingData":""}],"currentPageIndex":0}',
    },
  ];

  const handleCreateFromTemplate = (template) => {
    createDocument({
      title: template.title === 'Blank Document' ? 'Untitled Document' : template.title,
      content: template.content,
      onSuccess: (newDoc) => {
        const docId = newDoc.documentId || newDoc.id;
        if (docId) {
          navigate(ROUTES.EDITOR_BUILDER(docId));
        }
      },
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-4">
      {/* Pending Access Requests Notifications */}
      <PendingRequestsList />

      {/* Top Banner: Quick Template Launcher */}
      <section className="space-y-4">
        <h2 className="text-xs font-bold text-docs-subtext uppercase tracking-wider">
          Start a new document
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {templates.map((tpl) => {
            const Icon = tpl.icon;
            return (
              <button
                key={tpl.title}
                onClick={() => handleCreateFromTemplate(tpl)}
                className="flex flex-col items-center justify-center p-6 rounded-2xl border border-docs-border bg-white hover:shadow-docs-card hover:-translate-y-1 transition-all group text-left cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${tpl.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-docs-darkText group-hover:text-docs-blue transition-colors">
                  {tpl.title}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Document Section Controls */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-docs-border pb-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { id: 'all', label: 'Recent Documents', icon: Clock },
              { id: 'shared', label: 'Shared with me', icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => updateFilterCategory(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    filterCategory === tab.id
                      ? 'bg-docs-blue text-white shadow-sm'
                      : 'bg-white text-docs-subtext hover:bg-gray-100 hover:text-docs-darkText'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* View toggle switch */}
          <div className="flex items-center gap-1 bg-white p-1 border border-docs-border rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-docs-subtext transition-colors ${
                viewMode === 'grid' ? 'bg-docs-bg text-docs-blue font-bold' : 'hover:bg-gray-100'
              }`}
              title="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-docs-subtext transition-colors ${
                viewMode === 'list' ? 'bg-docs-bg text-docs-blue font-bold' : 'hover:bg-gray-100'
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document Grid / List Content */}
        {loading ? (
          <Loader text="Fetching workspace documents..." />
        ) : filteredDocuments.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-docs-border space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-docs-blue flex items-center justify-center mx-auto">
              {filterCategory === 'shared' ? (
                <Users className="w-6 h-6" />
              ) : (
                <FileText className="w-6 h-6" />
              )}
            </div>
            <h3 className="text-base font-bold text-docs-darkText">
              {filterCategory === 'shared'
                ? 'No shared documents'
                : 'No documents found'}
            </h3>
            <p className="text-xs text-docs-subtext">
              {filterCategory === 'shared'
                ? 'When someone shares a document with you, it will appear here.'
                : 'Create your first document to start real-time editing.'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredDocuments.map((doc) => {
              const type = getDocumentType(doc.content, doc.title);
              const typeConfig = DOC_TYPE_CONFIG[type] || DOC_TYPE_CONFIG.doc;
              const TypeIcon = typeConfig.icon;

              return (
                <div
                  key={doc.id}
                  onClick={() => navigate(ROUTES.EDITOR_BUILDER(doc.id))}
                  className={`bg-white border border-docs-border ${typeConfig.accentBorderClass} rounded-2xl hover:shadow-docs-card hover:-translate-y-0.5 transition-all group cursor-pointer flex flex-col justify-between relative z-10 hover:z-30 [&:has([data-dropdown-open])]:z-40`}
                >
                  {/* Paper Preview Header */}
                  <div className={`h-36 ${typeConfig.previewBgClass} p-3.5 border-b border-docs-border rounded-t-2xl flex flex-col justify-between relative overflow-hidden`}>
                    {/* Top bar inside preview: Type Badge */}
                    <div className="flex items-center justify-between gap-2 z-10">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border shadow-xs ${typeConfig.badgeClass}`}>
                        <TypeIcon className="w-3 h-3" />
                        {typeConfig.badgeText}
                      </span>
                      {doc.sharedViaTeam && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs truncate max-w-[120px]">
                          👥 {doc.sharedViaTeam.teamName || 'Team'}
                        </span>
                      )}
                    </div>

                    {/* Preview content text (no preview for notes) */}
                    {type !== 'notes' && (
                      <div className="text-[11px] text-docs-subtext line-clamp-3 leading-relaxed select-none font-medium my-auto">
                        {getDocumentPreviewText(doc.content, type) || 'Empty document content preview...'}
                      </div>
                    )}

                    {/* Bottom row of preview: User avatar */}
                    <div className="flex items-center gap-1.5 z-10">
                      <Avatar src={doc.owner?.avatarUrl} name={doc.owner?.name} size="sm" />
                      <span className="text-[10px] text-docs-subtext truncate max-w-[120px]">
                        {doc.owner?.name || 'You'}
                      </span>
                    </div>
                  </div>

                  {/* Info Footer */}
                  <div className="p-3.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className={`p-2 rounded-xl shrink-0 ${typeConfig.iconBoxClass}`}>
                        <TypeIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-docs-darkText truncate group-hover:text-docs-blue transition-colors">
                          {doc.title}
                        </h3>
                        <p className="text-[11px] text-docs-subtext truncate">
                          {typeConfig.label} • {formatRelativeTime(doc.updatedAt)}
                        </p>
                      </div>
                    </div>

                    <Dropdown
                      align="right"
                      direction="up"
                      trigger={
                        <div className="p-1.5 rounded-lg text-docs-subtext hover:bg-gray-100 transition-colors cursor-pointer shrink-0">
                          <MoreVertical className="w-4 h-4" />
                        </div>
                      }
                      items={[
                        { label: 'Open', icon: ExternalLink, onClick: () => navigate(ROUTES.EDITOR_BUILDER(doc.id)) },
                        { divider: true },
                        { label: 'Delete', icon: Trash2, danger: true, onClick: () => deleteDocument(doc) },
                      ]}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="bg-white border border-docs-border rounded-2xl divide-y divide-docs-border">
            {filteredDocuments.map((doc) => {
              const type = getDocumentType(doc.content, doc.title);
              const typeConfig = DOC_TYPE_CONFIG[type] || DOC_TYPE_CONFIG.doc;
              const TypeIcon = typeConfig.icon;

              return (
                <div
                  key={doc.id}
                  onClick={() => navigate(ROUTES.EDITOR_BUILDER(doc.id))}
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer relative z-10 [&:has([data-dropdown-open])]:z-40"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className={`p-2 rounded-lg shrink-0 ${typeConfig.iconBoxClass}`}>
                      <TypeIcon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-docs-darkText truncate">{doc.title}</h3>
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${typeConfig.badgeClass}`}>
                          {typeConfig.badgeText}
                        </span>
                        {doc.sharedViaTeam && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            👥 {doc.sharedViaTeam.teamName || 'Team'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-docs-subtext">{typeConfig.label} • Owner: {doc.owner?.name || 'You'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0">
                    <span className="text-xs text-docs-subtext hidden sm:inline">
                      {formatRelativeTime(doc.updatedAt)}
                    </span>
                    <Dropdown
                      align="right"
                      trigger={
                        <div className="p-1.5 rounded-lg text-docs-subtext hover:bg-gray-100 transition-colors cursor-pointer">
                          <MoreVertical className="w-4 h-4" />
                        </div>
                      }
                      items={[
                        { label: 'Open', icon: ExternalLink, onClick: () => navigate(ROUTES.EDITOR_BUILDER(doc.id)) },
                        { label: 'Delete', icon: Trash2, danger: true, onClick: () => deleteDocument(doc) },
                      ]}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
