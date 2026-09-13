export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(dateString);
};

export const getInitials = (name = '') => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const countWordsAndChars = (text = '') => {
  const cleanText = text.replace(/<[^>]*>?/gm, '').trim();
  const words = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0;
  const characters = cleanText.length;
  return { words, characters };
};

export const decodeHtmlEntities = (text = '') => {
  if (!text) return '';
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
};

export const getDocumentType = (content = '', title = '') => {
  const str = typeof content === 'string' ? content : '';
  const t = typeof title === 'string' ? title.toLowerCase() : '';
  if (str.includes('<!-- TYPE:NOTES -->') || (!str && t.includes('note'))) {
    return 'notes';
  }
  if (str.includes('<!-- TYPE:DATASHEET -->') || (!str && t.includes('sheet'))) {
    return 'sheet';
  }
  return 'doc';
};

// ponytail: extract clean preview text for standard documents, suppress for notes and sheets
export const getDocumentPreviewText = (content = '', type = 'doc') => {
  if (!content) return '';
  const docType = type || getDocumentType(content);
  if (docType === 'notes' || docType === 'sheet') return '';

  const str = typeof content === 'string' ? content : '';
  if (str.includes('<!-- TYPE:NOTES -->') || str.includes('<!-- TYPE:DATASHEET -->')) {
    return '';
  }

  const trimmed = str.trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[') || trimmed.startsWith('<!--')) {
    return '';
  }

  const clean = decodeHtmlEntities(trimmed.replace(/<[^>]*>?/gm, ' '))
    .replace(/\{[^}]*\}/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return clean;
};

