import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { Button } from '../../components/common/Button';
import { Avatar } from '../../components/common/Avatar';
import {
  FileText,
  FileSpreadsheet,
  NotebookPen,
  Users,
  Zap,
  ShieldCheck,
  History,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Share2,
  Search,
  Layers,
  ChevronRight,
  Cloud,
  Check,
  MousePointer2,
  MessageSquare,
  Activity,
  Heart,
  ExternalLink,
  ArrowLeft,
  Undo2,
  Redo2,
  Printer,
  Bold,
  Italic,
  Underline,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  ChevronDown,
  Plus,
  Download,
  PenTool,
  Eraser,
  Type,
  ChevronLeft,
  FilePlus,
  Trash2,
  Wifi,
} from 'lucide-react';

const PAINT_COLORS = [
  { name: 'Dark Ink', value: '#1e293b' },
  { name: 'Royal Blue', value: '#2563eb' },
  { name: 'Crimson Red', value: '#dc2626' },
  { name: 'Emerald Green', value: '#059669' },
  { name: 'Purple', value: '#9333ea' },
  { name: 'Amber', value: '#d97706' },
];

export const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('notes'); // default to 'notes' to showcase the paint canvas

  // Interactive paint canvas states
  const canvasRef = useRef(null);
  const [paintColor, setPaintColor] = useState('#1e293b');
  const [brushSize, setBrushSize] = useState(4);
  const [paintMode, setPaintMode] = useState('brush'); // 'brush' | 'eraser' | 'type'
  const [isDrawing, setIsDrawing] = useState(false);

  // Smooth scroll helper for on-page navigation
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Draw the authentic handwritten "A S H I S H" strokes as shown in user screenshot (dynamically centered & scaled)
  const drawSampleHandwriting = (ctx, width = 760, height = 400) => {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#1e293b';

    // Calculate responsive scale based on current canvas dimensions
    const baseW = 720;
    const baseH = 380;
    const scale = Math.min(Math.max(width / baseW, 0.45), 1.2);
    ctx.lineWidth = Math.max(2.5, 4 * scale);

    // Center the strokes horizontally and vertically
    const shiftX = Math.max(10, (width - (580 - 120) * scale) / 2 - 120 * scale);
    const shiftY = Math.max(10, (height - (280 - 100) * scale) / 2 - 100 * scale);

    // Helper to draw smooth multi-point path with scaling
    const drawStroke = (points) => {
      if (!points || points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(points[0][0] * scale + shiftX, points[0][1] * scale + shiftY);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0] * scale + shiftX, points[i][1] * scale + shiftY);
      }
      ctx.stroke();
    };

    // 'A' (with characteristic slight forward tilt & natural hand tremble)
    drawStroke([[140, 275], [142, 230], [150, 180], [158, 140], [163, 130]]);
    drawStroke([[163, 130], [172, 175], [182, 225], [194, 270]]);
    drawStroke([[146, 226], [165, 224], [183, 222]]);

    // 'S'
    drawStroke([
      [256, 178], [242, 168], [228, 170], [220, 180], [218, 194],
      [226, 206], [238, 214], [246, 226], [248, 240], [240, 252],
      [226, 258], [214, 252]
    ]);

    // 'H'
    drawStroke([[280, 155], [285, 205], [292, 256]]);
    drawStroke([[330, 142], [334, 190], [338, 245]]);
    drawStroke([[286, 206], [310, 202], [333, 196]]);

    // 'I'
    drawStroke([[380, 138], [412, 132]]);
    drawStroke([[396, 135], [402, 185], [408, 236]]);
    drawStroke([[388, 238], [420, 232]]);

    // 'S'
    drawStroke([
      [478, 145], [464, 135], [450, 138], [442, 148], [440, 162],
      [448, 174], [460, 182], [468, 194], [470, 208], [462, 220],
      [448, 226], [436, 220]
    ]);

    // 'H'
    drawStroke([[506, 118], [514, 165], [524, 218]]);
    drawStroke([[558, 102], [568, 152], [578, 205]]);
    drawStroke([[515, 170], [538, 162], [567, 154]]);

    ctx.restore();
  };

  // Initialize or re-render canvas when switching to notes tab
  useEffect(() => {
    if (activeTab !== 'notes') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const updateCanvasSize = () => {
      const parent = canvas.parentElement;
      const w = parent ? parent.clientWidth : 760;
      const h = 420;
      canvas.width = w;
      canvas.height = h;
      ctx.clearRect(0, 0, w, h);
      drawSampleHandwriting(ctx, w, h);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [activeTab]);

  // Drawing interactions
  const handleStartDraw = (e) => {
    if (paintMode === 'type') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const handleDrawMove = (e) => {
    if (!isDrawing || paintMode === 'type') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (paintMode === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize * 4;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = paintColor;
      ctx.lineWidth = brushSize;
    }
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleStopDraw = () => {
    setIsDrawing(false);
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleResetSample = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSampleHandwriting(ctx, canvas.width, canvas.height);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-docs-darkText font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col">
      {/* ─── 1. TOP NAVIGATION BAR ─── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-docs-border/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-docs-blue flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-docs-darkText tracking-tight">
                Synk<span className="text-docs-blue">Docs</span>
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-docs-subtext">
            <button
              onClick={() => scrollToSection('capabilities')}
              className="hover:text-docs-blue transition-colors cursor-pointer"
            >
              Capabilities
            </button>
            <button
              onClick={() => scrollToSection('modes')}
              className="hover:text-docs-blue transition-colors cursor-pointer"
            >
              Workspace Types
            </button>
            <button
              onClick={() => scrollToSection('architecture')}
              className="hover:text-docs-blue transition-colors cursor-pointer"
            >
              Architecture
            </button>
            <button
              onClick={() => scrollToSection('security')}
              className="hover:text-docs-blue transition-colors cursor-pointer"
            >
              Enterprise Security
            </button>
          </nav>

          {/* Right Action / Auth Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to={ROUTES.DASHBOARD}
                  className="hidden sm:flex items-center gap-2 text-sm font-medium text-docs-darkText hover:text-docs-blue transition-colors"
                >
                  <Avatar src={user?.avatarUrl} name={user?.name || 'User'} size="sm" />
                  <span className="font-semibold">{user?.name || 'Workspace'}</span>
                </Link>
                <Button
                  variant="primary"
                  size="sm"
                  icon={ArrowRight}
                  onClick={() => navigate(ROUTES.DASHBOARD)}
                  className="shadow-sm"
                >
                  Open Workspace
                </Button>
              </div>
            ) : (
              <>
                <Link
                  to={ROUTES.LOGIN}
                  className="px-3.5 py-1.5 text-sm font-medium text-docs-darkText hover:text-docs-blue transition-colors"
                >
                  Sign In
                </Link>
                <Button
                  variant="primary"
                  size="sm"
                  icon={ArrowRight}
                  onClick={() => navigate(ROUTES.REGISTER)}
                  className="shadow-sm"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ─── 2. HERO SECTION ─── */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-docs-border/50 bg-gradient-to-b from-white via-white to-[#f8f9fa]">
        {/* Subtle background ambient blur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-50/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Product Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/90 border border-blue-200/60 text-xs font-semibold text-docs-blue mb-8 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>High-Velocity Document Infrastructure</span>
            <span className="text-blue-300">•</span>
            <span className="text-docs-darkText font-medium">Sub-millisecond OT Sync</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-docs-darkText tracking-tight leading-[1.12]">
            Where teams draft, calculate, and synchronize ideas.
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-docs-subtext max-w-3xl mx-auto font-normal leading-relaxed">
            SynkDocs unifies rich collaborative documents, dynamic data sheets, and a freehand digital paint notepad into one seamless workspace. Zero merge conflicts, live multi-cursor presence, and fine-grained access control.
          </p>

          {/* Hero CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Button
              variant="primary"
              size="lg"
              icon={ArrowRight}
              onClick={() => navigate(isAuthenticated ? ROUTES.DASHBOARD : ROUTES.REGISTER)}
              className="w-full sm:w-auto px-7 py-3 text-base shadow-md hover:shadow-lg transition-all"
            >
              {isAuthenticated ? 'Go to Workspace Dashboard' : 'Start Writing Free'}
            </Button>
            <button
              onClick={() => scrollToSection('modes')}
              className="w-full sm:w-auto px-6 py-3 rounded-full border border-docs-border bg-white text-docs-darkText text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Explore Product Preview</span>
              <ChevronRight className="w-4 h-4 text-docs-subtext" />
            </button>
          </div>

          {/* Live Metrics Ribbon */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-white border border-docs-border/70 shadow-xs">
              <div className="flex items-center gap-2 text-docs-blue font-bold text-xl sm:text-2xl">
                <Zap className="w-5 h-5 text-amber-500" />
                <span>&lt; 15ms</span>
              </div>
              <p className="text-xs text-docs-subtext mt-1">Multi-cursor sync latency</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-docs-border/70 shadow-xs">
              <div className="flex items-center gap-2 text-docs-darkText font-bold text-xl sm:text-2xl">
                <Layers className="w-5 h-5 text-docs-blue" />
                <span>3-in-1</span>
              </div>
              <p className="text-xs text-docs-subtext mt-1">Docs, Sheets &amp; Paint Notes</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-docs-border/70 shadow-xs">
              <div className="flex items-center gap-2 text-docs-darkText font-bold text-xl sm:text-2xl">
                <Users className="w-5 h-5 text-indigo-500" />
                <span>Zero</span>
              </div>
              <p className="text-xs text-docs-subtext mt-1">Merge overwrite conflicts</p>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-docs-border/70 shadow-xs">
              <div className="flex items-center gap-2 text-docs-darkText font-bold text-xl sm:text-2xl">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>100%</span>
              </div>
              <p className="text-xs text-docs-subtext mt-1">Serverless event-driven</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. INTERACTIVE PRODUCT SHOWCASE ─── */}
      <section id="modes" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-docs-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Interactive Product Preview
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-docs-darkText tracking-tight">
            Engineered for seamless co-authoring.
          </h2>
          <p className="mt-2.5 text-docs-subtext text-base">
            Switch between document types below to explore SynkDocs' rich text editor, computational data sheets, and freehand paint notepad.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="mt-6 inline-flex p-1.5 rounded-full bg-white border border-docs-border shadow-xs gap-1">
            <button
              onClick={() => setActiveTab('doc')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'doc'
                  ? 'bg-docs-blue text-white shadow-xs'
                  : 'text-docs-subtext hover:text-docs-darkText hover:bg-gray-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Collaborative Document</span>
            </button>
            <button
              onClick={() => setActiveTab('sheet')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'sheet'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-docs-subtext hover:text-docs-darkText hover:bg-gray-100'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Data Sheet</span>
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'notes'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-docs-subtext hover:text-docs-darkText hover:bg-gray-100'
              }`}
            >
              <NotebookPen className="w-3.5 h-3.5" />
              <span>Digital Paint &amp; Notes</span>
            </button>
          </div>
        </div>

        {/* High-Fidelity Mock Canvas Window */}
        <div className="rounded-2xl border border-docs-border bg-white shadow-docs-card overflow-hidden">
          {/* Simulated App Header */}
          <div className="px-4 py-3 bg-white border-b border-docs-border flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              {/* Back button */}
              <button
                type="button"
                className="p-1 rounded-lg hover:bg-gray-100 text-docs-subtext transition-colors"
                title="Back to dashboard"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              {/* Title & Document Badge */}
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-xs ${
                    activeTab === 'doc'
                      ? 'bg-docs-blue'
                      : activeTab === 'sheet'
                      ? 'bg-emerald-600'
                      : 'bg-amber-600'
                  }`}
                >
                  {activeTab === 'doc' && <FileText className="w-4 h-4" />}
                  {activeTab === 'sheet' && <FileSpreadsheet className="w-4 h-4" />}
                  {activeTab === 'notes' && <NotebookPen className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-docs-darkText leading-none">
                    {activeTab === 'doc' && 'Q4 Engineering Architecture & Launch Plan'}
                    {activeTab === 'sheet' && 'Service Latency & Infrastructure Metrics'}
                    {activeTab === 'notes' && 'Notes'}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-docs-subtext mt-1">
                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                      <Cloud className="w-3 h-3" /> Saved to Cloud
                    </span>
                    <span>•</span>
                    <span>Version 1.4</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Collaborator Avatars & Share Button */}
            <div className="flex items-center gap-3">
              <button className="p-1.5 rounded-lg hover:bg-gray-100 text-docs-subtext transition-colors" title="Comments">
                <MessageSquare className="w-4 h-4" />
              </button>

              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-docs-blue text-white rounded-lg text-xs font-semibold hover:bg-docs-hoverBlue shadow-xs transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>

              <div className="w-8 h-8 rounded-full bg-docs-blue text-white font-semibold text-xs flex items-center justify-center ring-2 ring-blue-100 shadow-xs" title="Ashish (You)">
                A
              </div>
            </div>
          </div>

          {/* ─── TAB 1: COLLABORATIVE DOCUMENT TOOLBAR & CANVAS ─── */}
          {activeTab === 'doc' && (
            <>
              {/* Google Docs-style Rich Text Toolbar */}
              <div className="px-4 py-1.5 bg-docs-toolbar border-b border-docs-border flex items-center gap-1 overflow-x-auto text-xs text-docs-darkText select-none">
                <button className="p-1.5 hover:bg-gray-200/70 rounded text-docs-subtext" title="Undo">
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 hover:bg-gray-200/70 rounded text-docs-subtext" title="Redo">
                  <Redo2 className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 hover:bg-gray-200/70 rounded text-docs-subtext" title="Print">
                  <Printer className="w-3.5 h-3.5" />
                </button>

                <div className="h-4 w-px bg-docs-border mx-1" />

                <div className="px-2 py-1 bg-white border border-docs-border rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer">
                  <span>Normal text</span>
                  <ChevronDown className="w-3 h-3 text-docs-subtext" />
                </div>
                <div className="px-2 py-1 bg-white border border-docs-border rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer">
                  <span>Inter</span>
                  <ChevronDown className="w-3 h-3 text-docs-subtext" />
                </div>
                <div className="px-2 py-1 bg-white border border-docs-border rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer">
                  <span>11</span>
                  <ChevronDown className="w-3 h-3 text-docs-subtext" />
                </div>

                <div className="h-4 w-px bg-docs-border mx-1" />

                <button className="p-1.5 hover:bg-gray-200/70 rounded bg-white shadow-xs font-bold text-docs-darkText" title="Bold">
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 hover:bg-gray-200/70 rounded text-docs-darkText italic" title="Italic">
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 hover:bg-gray-200/70 rounded text-docs-darkText underline" title="Underline">
                  <Underline className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 hover:bg-gray-200/70 rounded text-docs-subtext" title="Highlight">
                  <Highlighter className="w-3.5 h-3.5" />
                </button>

                <div className="h-4 w-px bg-docs-border mx-1" />

                <button className="p-1.5 hover:bg-gray-200/70 rounded bg-white shadow-xs text-docs-darkText" title="Align Left">
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 hover:bg-gray-200/70 rounded text-docs-subtext" title="Align Center">
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 hover:bg-gray-200/70 rounded text-docs-subtext" title="Align Right">
                  <AlignRight className="w-3.5 h-3.5" />
                </button>

                <div className="h-4 w-px bg-docs-border mx-1" />

                <button className="p-1.5 hover:bg-gray-200/70 rounded text-docs-subtext" title="Numbered List">
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 hover:bg-gray-200/70 rounded text-docs-subtext" title="Bulleted List">
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Document Canvas Sheet */}
              <div className="p-6 sm:p-10 bg-[#f1f3f4] min-h-[420px] flex justify-center">
                <div className="w-full max-w-3xl bg-white p-8 sm:p-12 rounded-sm shadow-docs-canvas border border-docs-border/60 relative">
                  {/* Floating Collaborator Cursor */}
                  <div className="absolute top-24 right-16 hidden sm:flex flex-col items-start pointer-events-none">
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-purple-600 text-white text-[10px] font-semibold shadow-xs">
                      <MousePointer2 className="w-2.5 h-2.5" />
                      <span>Sarah J. is editing</span>
                    </div>
                    <div className="w-[2px] h-5 bg-purple-600 animate-pulse ml-1" />
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-bold text-docs-darkText mb-4">
                    1. High-Performance Real-Time Sync Engine
                  </h1>
                  <p className="text-sm text-docs-subtext leading-relaxed mb-4">
                    SynkDocs relies on a decoupled WebSocket architecture backed by AWS API Gateway and event-driven microservices. All document mutation operations are parsed with operational transform guarantees to eliminate conflict collisions across active editor sessions.
                  </p>

                  <div className="my-5 p-4 rounded-xl bg-blue-50/60 border border-blue-200/70 text-sm">
                    <div className="flex items-center gap-2 font-semibold text-docs-blue mb-1">
                      <CheckCircle2 className="w-4 h-4 text-docs-blue" />
                      Key Objective for Q4
                    </div>
                    <p className="text-xs text-docs-darkText leading-relaxed">
                      Guarantee P99 operation broadcast latencies under 15ms while sustaining up to 100 concurrent collaborators per document canvas.
                    </p>
                  </div>

                  <h2 className="text-lg font-bold text-docs-darkText mt-6 mb-2">
                    2. Snapshot Cadence &amp; S3 Recovery
                  </h2>
                  <p className="text-sm text-docs-subtext leading-relaxed">
                    Every version milestone emits a background snapshot event to AWS S3. Users can inspect the version history timeline and restore point-in-time states with a single click.
                  </p>
                </div>
              </div>

              {/* Status Bar */}
              <div className="flex items-center justify-between px-6 py-2 bg-white border-t border-docs-border text-xs text-docs-subtext select-none">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 font-medium">
                    <FileText className="w-3.5 h-3.5 text-docs-blue" />
                    <span>Page 1 of 1</span>
                  </span>
                  <span className="h-3 w-px bg-docs-border" />
                  <span><strong className="text-docs-darkText">842</strong> words</span>
                  <span><strong className="text-docs-darkText">5,420</strong> characters</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 font-medium">
                  <Wifi className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <span>Multiplayer Active (Connected)</span>
                </div>
              </div>
            </>
          )}

          {/* ─── TAB 2: DATA SHEET TOOLBAR & CANVAS ─── */}
          {activeTab === 'sheet' && (
            <>
              {/* Spreadsheet Formula & Action Bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-docs-border gap-3 flex-wrap text-xs select-none">
                <div className="flex items-center gap-2 flex-1 min-w-[280px]">
                  <span className="font-bold text-docs-blue bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 text-xs">
                    B4
                  </span>
                  <div className="flex-1 flex items-center bg-white border border-docs-border rounded-lg px-2.5 py-1">
                    <span className="font-serif font-bold text-gray-400 mr-2 text-xs">fx</span>
                    <span className="font-mono text-docs-darkText font-medium text-xs">=AVERAGE(C2:C5)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-1.5 rounded-lg border border-docs-border bg-white text-docs-darkText hover:bg-gray-100" title="Bold cell">
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-docs-border bg-white hover:bg-gray-100 text-xs font-semibold text-docs-darkText">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Row</span>
                  </button>
                  <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-docs-border bg-white hover:bg-gray-100 text-xs font-semibold text-docs-darkText">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Col</span>
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs">
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Data Sheet Grid Container */}
              <div className="p-6 bg-gray-100 min-h-[420px] flex justify-center overflow-x-auto">
                <div className="w-full max-w-3xl bg-white border border-docs-border rounded-lg shadow-docs-canvas overflow-hidden">
                  <table className="w-full border-collapse text-xs font-sans">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600 border-b border-docs-border">
                        <th className="w-12 py-2 border-r border-docs-border font-semibold text-center select-none bg-gray-200/60">#</th>
                        <th className="p-2.5 border-r border-docs-border font-semibold text-left">A (Service)</th>
                        <th className="p-2.5 border-r border-docs-border font-semibold text-left">B (P99 Latency)</th>
                        <th className="p-2.5 border-r border-docs-border font-semibold text-left">C (Throughput req/s)</th>
                        <th className="p-2.5 font-semibold text-left">D (Status)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-docs-border">
                      <tr>
                        <td className="p-2 font-mono text-center text-docs-subtext border-r border-docs-border bg-gray-50/50">1</td>
                        <td className="p-2 font-medium text-docs-darkText border-r border-docs-border">Auth Service (JWT)</td>
                        <td className="p-2 font-mono border-r border-docs-border">12ms</td>
                        <td className="p-2 font-mono border-r border-docs-border">14,200</td>
                        <td className="p-2"><span className="text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded font-semibold text-[11px]">Optimal</span></td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono text-center text-docs-subtext border-r border-docs-border bg-gray-50/50">2</td>
                        <td className="p-2 font-medium text-docs-darkText border-r border-docs-border">WebSocket Broker</td>
                        <td className="p-2 font-mono border-r border-docs-border">9ms</td>
                        <td className="p-2 font-mono border-r border-docs-border">28,500</td>
                        <td className="p-2"><span className="text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded font-semibold text-[11px]">Optimal</span></td>
                      </tr>
                      <tr>
                        <td className="p-2 font-mono text-center text-docs-subtext border-r border-docs-border bg-gray-50/50">3</td>
                        <td className="p-2 font-medium text-docs-darkText border-r border-docs-border">Document Engine</td>
                        <td className="p-2 font-mono border-r border-docs-border">14ms</td>
                        <td className="p-2 font-mono border-r border-docs-border">19,100</td>
                        <td className="p-2"><span className="text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded font-semibold text-[11px]">Optimal</span></td>
                      </tr>
                      <tr className="bg-blue-50/40">
                        <td className="p-2 font-mono text-center text-docs-subtext border-r border-docs-border bg-gray-50/50">4</td>
                        <td className="p-2 font-medium text-docs-darkText border-r border-docs-border">Snapshot S3 Engine</td>
                        <td className="p-2 font-mono border-r border-docs-border font-bold text-docs-blue ring-2 ring-docs-blue ring-inset bg-white">18ms</td>
                        <td className="p-2 font-mono border-r border-docs-border">8,400</td>
                        <td className="p-2"><span className="text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded font-semibold text-[11px]">Optimal</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Status Bar */}
              <div className="flex items-center justify-between px-6 py-2 bg-white border-t border-docs-border text-xs text-docs-subtext select-none">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 font-medium">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Sheet 1 of 1</span>
                  </span>
                  <span className="h-3 w-px bg-docs-border" />
                  <span><strong className="text-docs-darkText">24</strong> cells calculated</span>
                  <span>Formula valid: <strong className="text-emerald-700 font-mono">fx ok</strong></span>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 font-medium">
                  <Wifi className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <span>Multiplayer Active (Connected)</span>
                </div>
              </div>
            </>
          )}

          {/* ─── TAB 3: DIGITAL PAINT & NOTES (Matching 2nd User Screenshot Exactly) ─── */}
          {activeTab === 'notes' && (
            <>
              {/* Paint & Drawing Toolbar */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-white border-b border-docs-border gap-2 sm:gap-3 flex-wrap text-xs select-none">
                {/* Tool Modes */}
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setPaintMode('brush')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      paintMode === 'brush'
                        ? 'bg-docs-blue text-white shadow-xs'
                        : 'text-docs-subtext hover:bg-white hover:text-docs-darkText'
                    }`}
                  >
                    <PenTool className="w-4 h-4" />
                    <span>Brush Pen</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaintMode('eraser')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      paintMode === 'eraser'
                        ? 'bg-docs-blue text-white shadow-xs'
                        : 'text-docs-subtext hover:bg-white hover:text-docs-darkText'
                    }`}
                  >
                    <Eraser className="w-4 h-4" />
                    <span>Eraser</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaintMode('type')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      paintMode === 'type'
                        ? 'bg-docs-blue text-white shadow-xs'
                        : 'text-docs-subtext hover:bg-white hover:text-docs-darkText'
                    }`}
                  >
                    <Type className="w-4 h-4" />
                    <span>Type Directly</span>
                  </button>
                </div>

                {/* Scroll Locked Pill */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#fef3c7] border border-[#fde68a] text-amber-900 shadow-xs">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Scroll Locked</span>
                </div>

                {/* Colors Palette */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-docs-subtext uppercase tracking-wider mr-1">
                    COLOR:
                  </span>
                  {PAINT_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setPaintColor(c.value)}
                      style={{ backgroundColor: c.value }}
                      className={`w-6 h-6 rounded-full transition-transform flex items-center justify-center cursor-pointer ${
                        paintColor === c.value
                          ? 'scale-110 ring-2 ring-docs-blue ring-offset-1'
                          : 'hover:scale-105'
                      }`}
                      title={c.name}
                    >
                      {paintColor === c.value && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>

                {/* Brush Thickness Slider */}
                <div className="flex items-center gap-2 bg-gray-50 border border-docs-border px-3 py-1 rounded-xl">
                  <span className="text-[11px] font-bold text-docs-subtext uppercase tracking-wider">
                    SIZE:
                  </span>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="w-20 accent-docs-blue cursor-pointer"
                  />
                  <span className="text-xs font-bold text-docs-darkText min-w-[24px]">
                    {brushSize}px
                  </span>
                </div>

                {/* Multi-Page Navigation Controls */}
                <div className="flex items-center gap-1.5 bg-amber-50/80 border border-amber-200 p-1 rounded-xl">
                  <button
                    type="button"
                    disabled
                    className="p-1 rounded-lg text-amber-900 opacity-40"
                    title="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="text-xs font-bold text-amber-900 px-1">
                    Page 1 of 1
                  </span>

                  <button
                    type="button"
                    disabled
                    className="p-1 rounded-lg text-amber-900 opacity-40"
                    title="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleResetSample}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-all ml-1 cursor-pointer"
                    title="Add Page or Reset Sample"
                  >
                    <FilePlus className="w-3.5 h-3.5" />
                    <span>Add Page</span>
                  </button>
                </div>

                {/* Clear Notes Action */}
                <button
                  type="button"
                  onClick={handleClearCanvas}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-all cursor-pointer"
                  title="Clear canvas"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Notes</span>
                </button>
              </div>

              {/* Lined Note Paper Pad Area (Yellow Legal Notepad with Red Margin) */}
              <div className="p-4 sm:p-8 bg-[#f5f5f5] min-h-[440px] flex justify-center">
                <div className="w-full max-w-[760px] min-h-[420px] bg-[#fefce8] border border-amber-200/90 rounded-xl shadow-docs-canvas relative overflow-hidden flex flex-col note-paper-pad">
                  {/* Page indicator watermark tag */}
                  <div className="absolute top-3 right-4 text-[11px] font-bold text-amber-800/70 bg-amber-100/70 border border-amber-200/60 px-2 py-0.5 rounded-md select-none pointer-events-none z-30">
                    Page 1 of 1
                  </div>

                  {/* Horizontal Blue/Gray Lined Rule Lines */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-40"
                    style={{
                      backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px)',
                      backgroundSize: '100% 32px',
                      marginTop: '44px',
                    }}
                  />

                  {/* Left Red Vertical Margin Line */}
                  <div className="absolute top-0 bottom-0 left-10 sm:left-14 w-0.5 bg-red-400/70 pointer-events-none z-10" />

                  {/* Interactive HTML5 Drawing Canvas (Pre-rendered with 'ASHISH' & interactive) */}
                  <canvas
                    ref={canvasRef}
                    onMouseDown={handleStartDraw}
                    onMouseMove={handleDrawMove}
                    onMouseUp={handleStopDraw}
                    onMouseLeave={handleStopDraw}
                    className="w-full h-full min-h-[420px] relative z-20 cursor-crosshair"
                    title="Interactive Canvas: Draw or write with your mouse/pen!"
                  />
                </div>
              </div>

              {/* Status Bar (Matching Screenshot 2) */}
              <div className="flex items-center justify-between px-6 py-2 bg-white border-t border-docs-border text-xs text-docs-subtext select-none">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 font-medium">
                    <FileText className="w-3.5 h-3.5 text-docs-blue" />
                    <span>Page 1 of 1</span>
                  </span>
                  <span className="h-3 w-px bg-docs-border" />
                  <span><strong className="text-docs-darkText">1</strong> words</span>
                  <span><strong className="text-docs-darkText">38581</strong> characters</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 font-medium">
                  <Wifi className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <span>Multiplayer Active (Connected)</span>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ─── 4. CORE CAPABILITIES (Bento Grid) ─── */}
      <section id="capabilities" className="py-16 sm:py-24 bg-white border-y border-docs-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-docs-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Core Capabilities
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-docs-darkText tracking-tight">
              Built for speed, focus, and collaboration.
            </h2>
            <p className="mt-3 text-docs-subtext text-base sm:text-lg">
              Everything your team needs to collaborate in real-time, stripped of enterprise bloat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-docs-bg border border-docs-border/80 hover:border-docs-blue/50 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-100/70 text-docs-blue flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-docs-darkText mb-2">
                Sub-Millisecond OT Sync
              </h3>
              <p className="text-sm text-docs-subtext leading-relaxed">
                Experience co-authoring without cursor stutter or overwrites. Our operational transform engine synchronizes characters and selections across all devices instantaneously.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-docs-bg border border-docs-border/80 hover:border-docs-blue/50 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <NotebookPen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-docs-darkText mb-2">
                Digital Paint &amp; Freehand Canvas
              </h3>
              <p className="text-sm text-docs-subtext leading-relaxed">
                Sketch architectures, scribble freehand formulas, or write notes with real-time multiplayer brush pens on legal-ruled notebook pads alongside your docs and spreadsheets.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-docs-bg border border-docs-border/80 hover:border-docs-blue/50 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-100/70 text-purple-700 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-docs-darkText mb-2">
                Granular Access &amp; Approvals
              </h3>
              <p className="text-sm text-docs-subtext leading-relaxed">
                Assign explicit Owner, Editor, Commenter, and Viewer permissions. Built-in permission request flows let teammates request and receive instant document access securely.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-2xl bg-docs-bg border border-docs-border/80 hover:border-docs-blue/50 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-docs-darkText mb-2">
                High-Speed Data Sheets
              </h3>
              <p className="text-sm text-docs-subtext leading-relaxed">
                Dynamic spreadsheet grid calculations, formulas, and tabular models built natively into the same workspace without needing third-party tools.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-2xl bg-docs-bg border border-docs-border/80 hover:border-docs-blue/50 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-100/70 text-indigo-700 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-docs-darkText mb-2">
                Team Workspaces &amp; Sharing
              </h3>
              <p className="text-sm text-docs-subtext leading-relaxed">
                Organize projects by team, track pending collaborator invitations, and share public or restricted links with zero friction.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-2xl bg-docs-bg border border-docs-border/80 hover:border-docs-blue/50 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-teal-100/70 text-teal-700 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <History className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-docs-darkText mb-2">
                Automated Cloud Snapshots
              </h3>
              <p className="text-sm text-docs-subtext leading-relaxed">
                Every revision is saved with point-in-time snapshotting. Review past milestones, inspect edits by collaborator, and revert unwanted changes with complete confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. ARCHITECTURE & RESILIENCE ─── */}
      <section id="architecture" className="py-16 sm:py-24 bg-[#f8f9fa] border-b border-docs-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-docs-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Architectural Resilience
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-docs-darkText tracking-tight">
                Decoupled serverless microservices. Engineered for production.
              </h2>
              <p className="mt-4 text-docs-subtext text-base leading-relaxed">
                SynkDocs avoids monolithic single-points-of-failure. Every domain—identity, document lifecycle, sharing permissions, real-time WebSockets, and search—operates as an independent microservice connected via an event bus.
              </p>

              <div className="mt-6 space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-blue-100 text-docs-blue flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-docs-darkText">Decoupled WebSocket Gateway</h4>
                    <p className="text-xs text-docs-subtext mt-0.5">Multiplexed client sessions with automatic reconnects and heartbeat state tracking.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-blue-100 text-docs-blue flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-docs-darkText">Event-Driven Asynchronous Pipeline</h4>
                    <p className="text-xs text-docs-subtext mt-0.5">Domain actions trigger EventBridge events for non-blocking notifications and audit trails.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-blue-100 text-docs-blue flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-docs-darkText">Zero-Knowledge Cloud Snapshots</h4>
                    <p className="text-xs text-docs-subtext mt-0.5">Presigned S3 snapshot transfers keep document backups safe, durable, and instantly restorable.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Architecture Card Visual */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-docs-border shadow-docs-card">
              <div className="flex items-center justify-between pb-4 border-b border-docs-border mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono font-semibold text-docs-darkText">SYSTEM_TOPOLOGY :: PRODUCTION</span>
                </div>
                <span className="text-[11px] text-docs-subtext font-mono">STATUS: 99.99% UP</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-gray-50 border border-docs-border flex items-center justify-between">
                  <div className="flex items-center gap-2 text-docs-darkText font-medium">
                    <span className="text-docs-blue font-bold">API GATEWAY</span>
                    <span>→ /ws &amp; /rest</span>
                  </div>
                  <span className="text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded text-[11px]">Sub-15ms</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-200/50">
                    <p className="font-bold text-docs-blue">Auth Service</p>
                    <p className="text-docs-subtext text-[10px] mt-0.5">JWT &amp; Refresh Rotation</p>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200/50">
                    <p className="font-bold text-emerald-800">Collab Engine</p>
                    <p className="text-docs-subtext text-[10px] mt-0.5">Operational Transform</p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-50/60 border border-purple-200/50">
                    <p className="font-bold text-purple-800">Sharing Service</p>
                    <p className="text-docs-subtext text-[10px] mt-0.5">RBAC &amp; Access Control</p>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200/50">
                    <p className="font-bold text-amber-800">Snapshot S3</p>
                    <p className="text-docs-subtext text-[10px] mt-0.5">Continuous Versioning</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-gray-900 text-gray-200 text-[11px]">
                  <p className="text-emerald-400 font-semibold">$ eventbridge.emit("DocumentChanged")</p>
                  <p className="text-gray-400 text-[10px] mt-1">
                    ✓ Handled by CollaborationService &amp; NotificationService in 4ms
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. SECURITY & ACCESS CONTROL ─── */}
      <section id="security" className="py-16 sm:py-20 bg-white border-b border-docs-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-docs-blue bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Enterprise Security
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-docs-darkText tracking-tight">
            Your documents remain strictly yours.
          </h2>
          <p className="mt-3 text-docs-subtext text-base max-w-2xl mx-auto">
            SynkDocs enforces industry-standard access management at every boundary, from authenticated session tokens to document-level authorization checks.
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-docs-bg border border-docs-border">
              <Lock className="w-6 h-6 text-docs-blue mb-4" />
              <h3 className="font-bold text-docs-darkText mb-1.5">Strict Role Hierarchy</h3>
              <p className="text-xs text-docs-subtext leading-relaxed">
                Clear boundaries between Owner, Editor, Commenter, and Viewer guarantee that sensitive files cannot be modified or shared without permission.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-docs-bg border border-docs-border">
              <ShieldCheck className="w-6 h-6 text-emerald-600 mb-4" />
              <h3 className="font-bold text-docs-darkText mb-1.5">Rotating Session Tokens</h3>
              <p className="text-xs text-docs-subtext leading-relaxed">
                Cryptographically signed access tokens with automated silent refresh ensure active sessions remain valid without compromising security.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-docs-bg border border-docs-border">
              <Share2 className="w-6 h-6 text-purple-600 mb-4" />
              <h3 className="font-bold text-docs-darkText mb-1.5">Approval Workflows</h3>
              <p className="text-xs text-docs-subtext leading-relaxed">
                Unauthorized viewers can request access directly in-app, triggering instant pending alerts for document owners to approve or reject.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. BOTTOM CALL TO ACTION ─── */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-[#f8f9fa]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-docs-blue text-white shadow-docs-card relative overflow-hidden">
            {/* Ambient pattern */}
            <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-10 -top-10 w-60 h-60 bg-blue-600/30 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-xs font-semibold tracking-wide uppercase mb-4">
                Ready for modern collaboration?
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Experience documents without friction.
              </h2>
              <p className="mt-3 text-blue-100 text-sm sm:text-base max-w-xl mx-auto">
                Create real-time documents, data sheets, and freehand paint notes in seconds. Start collaborating with your team today.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  variant="secondary"
                  size="lg"
                  icon={ArrowRight}
                  onClick={() => navigate(isAuthenticated ? ROUTES.DASHBOARD : ROUTES.REGISTER)}
                  className="w-full sm:w-auto px-8 py-3 bg-white text-docs-blue hover:bg-gray-50 shadow-md font-semibold"
                >
                  {isAuthenticated ? 'Open Your Workspace' : 'Create Free Account'}
                </Button>
                {!isAuthenticated && (
                  <Link
                    to={ROUTES.LOGIN}
                    className="w-full sm:w-auto px-6 py-3 rounded-full border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition-colors text-center"
                  >
                    Sign In to Existing Account
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 8. FOOTER WITH ATTRIBUTION ─── */}
      <footer className="mt-auto bg-white border-t border-docs-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand Col */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-docs-blue flex items-center justify-center text-white shadow-xs">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-lg font-bold text-docs-darkText tracking-tight">
                  Synk<span className="text-docs-blue">Docs</span>
                </span>
              </div>
              <p className="text-xs text-docs-subtext max-w-sm leading-relaxed">
                A high-performance real-time collaborative workspace engineered for modern teams. Built with a decoupled serverless microservices architecture.
              </p>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-xs font-bold text-docs-darkText uppercase tracking-wider mb-3">Product</h4>
              <ul className="space-y-2 text-xs text-docs-subtext">
                <li>
                  <Link to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN} className="hover:text-docs-blue transition-colors">
                    Documents Editor
                  </Link>
                </li>
                <li>
                  <Link to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN} className="hover:text-docs-blue transition-colors">
                    Data Sheets
                  </Link>
                </li>
                <li>
                  <Link to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN} className="hover:text-docs-blue transition-colors">
                    Digital Paint &amp; Notes
                  </Link>
                </li>
                <li>
                  <Link to={isAuthenticated ? ROUTES.SHARED : ROUTES.LOGIN} className="hover:text-docs-blue transition-colors">
                    Shared Documents
                  </Link>
                </li>
              </ul>
            </div>

            {/* Platform Links */}
            <div>
              <h4 className="text-xs font-bold text-docs-darkText uppercase tracking-wider mb-3">Platform</h4>
              <ul className="space-y-2 text-xs text-docs-subtext">
                <li>
                  <Link to={isAuthenticated ? ROUTES.TEAMS : ROUTES.LOGIN} className="hover:text-docs-blue transition-colors">
                    Teams &amp; Workspaces
                  </Link>
                </li>
                <li>
                  <button onClick={() => scrollToSection('architecture')} className="hover:text-docs-blue transition-colors cursor-pointer">
                    Serverless Architecture
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('security')} className="hover:text-docs-blue transition-colors cursor-pointer">
                    Enterprise Security
                  </button>
                </li>
                <li>
                  <Link to={ROUTES.LOGIN} className="hover:text-docs-blue transition-colors">
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Sub-footer Bar */}
          <div className="pt-6 border-t border-docs-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-docs-subtext">
            <div>
              © {new Date().getFullYear()} SynkDocs Platform. All rights reserved.
            </div>

            {/* Professional Attribution "Made by Ashish" */}
            <div className="flex items-center gap-2 bg-docs-bg px-3.5 py-1.5 rounded-full border border-docs-border/80">
              <span className="text-docs-subtext font-normal">Made with precision by</span>
              <span className="font-semibold text-docs-darkText tracking-tight">Ashish</span>
              <span className="w-1.5 h-1.5 rounded-full bg-docs-blue inline-block animate-pulse" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
