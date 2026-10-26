import React, { useState } from 'react';
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
} from 'lucide-react';

export const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('doc'); // 'doc' | 'sheet' | 'notes'

  // Smooth scroll helper for on-page navigation
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
            SynkDocs brings collaborative documents, real-time data sheets, and rapid engineering scratchpads into one unified canvas. Zero merge conflicts, instant multi-cursor presence, and granular enterprise permissions.
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
              <p className="text-xs text-docs-subtext mt-1">Docs, Sheets & Notes</p>
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
            Interactive Experience
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-docs-darkText tracking-tight">
            Engineered for seamless co-authoring.
          </h2>
          <p className="mt-2.5 text-docs-subtext text-base">
            Switch between document types below to see how SynkDocs adapts to every stage of your team's workflow.
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
              <span>Quick Notes</span>
            </button>
          </div>
        </div>

        {/* High-Fidelity Mock Canvas Window */}
        <div className="rounded-2xl border border-docs-border bg-white shadow-docs-card overflow-hidden">
          {/* Simulated App Header */}
          <div className="px-4 py-3 bg-[#f8f9fa] border-b border-docs-border flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              {/* Window controls */}
              <div className="flex items-center gap-1.5 mr-2">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>

              {/* Title & Document Badge */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded flex items-center justify-center text-white ${
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
                    {activeTab === 'sheet' && 'Service Metrics & P99 Latency Benchmarks'}
                    {activeTab === 'notes' && 'Sprint 42 Kickoff & Action Items'}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-docs-subtext mt-0.5">
                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                      <Cloud className="w-3 h-3" /> All changes saved
                    </span>
                    <span>•</span>
                    <span>Version 1.4</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Collaborator Avatars & Share Button */}
            <div className="flex items-center gap-3">
              <div className="flex items-center -space-x-2">
                <div className="w-7 h-7 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center ring-2 ring-white" title="Ashish (You)">
                  A
                </div>
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center ring-2 ring-white" title="Sarah (Lead Architect)">
                  S
                </div>
                <div className="w-7 h-7 rounded-full bg-purple-500 text-white text-xs font-bold flex items-center justify-center ring-2 ring-white" title="Elena (Security)">
                  E
                </div>
                <div className="w-7 h-7 rounded-full bg-gray-200 text-docs-subtext text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  +3
                </div>
              </div>

              <div className="h-4 w-[1px] bg-docs-border hidden sm:block" />

              <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-docs-blue rounded-full text-xs font-semibold">
                <Share2 className="w-3.5 h-3.5" />
                <span>Shared with Team</span>
              </div>
            </div>
          </div>

          {/* Simulated Toolbar */}
          <div className="px-4 py-2 bg-white border-b border-docs-border flex items-center gap-2 overflow-x-auto text-xs text-docs-subtext">
            <span className="font-semibold text-docs-darkText">Normal Text</span>
            <span className="text-gray-300">|</span>
            <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">Inter</span>
            <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">11</span>
            <span className="text-gray-300">|</span>
            <span className="font-bold text-docs-darkText px-1.5 py-0.5 hover:bg-gray-100 rounded cursor-pointer">B</span>
            <span className="italic text-docs-darkText px-1.5 py-0.5 hover:bg-gray-100 rounded cursor-pointer">I</span>
            <span className="underline text-docs-darkText px-1.5 py-0.5 hover:bg-gray-100 rounded cursor-pointer">U</span>
            <span className="text-gray-300">|</span>
            <span className="px-1.5 py-0.5 hover:bg-gray-100 rounded cursor-pointer">Align Left</span>
            <span className="px-1.5 py-0.5 hover:bg-gray-100 rounded cursor-pointer">Numbered List</span>
            <span className="px-1.5 py-0.5 hover:bg-gray-100 rounded cursor-pointer">Checklist</span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <Activity className="w-3.5 h-3.5" />
              <span>Realtime Connected</span>
            </span>
          </div>

          {/* Simulated Workspace Canvas Content */}
          <div className="p-6 sm:p-10 bg-[#f1f3f4] min-h-[380px] flex justify-center">
            {activeTab === 'doc' && (
              <div className="w-full max-w-3xl bg-white p-8 sm:p-12 rounded-sm shadow-docs-canvas border border-docs-border/60 relative">
                {/* Simulated Floating Realtime Cursor */}
                <div className="absolute top-24 right-16 hidden sm:flex flex-col items-start pointer-events-none">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-purple-600 text-white text-[10px] font-semibold shadow-xs">
                    <MousePointer2 className="w-2.5 h-2.5" />
                    <span>Sarah J. is editing</span>
                  </div>
                  <div className="w-[2px] h-5 bg-purple-600 animate-pulse ml-1" />
                </div>

                {/* Simulated Doc Content */}
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
                  2. Snapshot Cadence & S3 Recovery
                </h2>
                <p className="text-sm text-docs-subtext leading-relaxed">
                  Every version milestone emits a background snapshot event to AWS S3. Users can inspect the version history timeline and restore point-in-time states with a single click.
                </p>
              </div>
            )}

            {activeTab === 'sheet' && (
              <div className="w-full max-w-3xl bg-white p-6 rounded-sm shadow-docs-canvas border border-docs-border/60 overflow-x-auto">
                <div className="mb-4 flex items-center justify-between text-xs text-docs-subtext pb-3 border-b border-docs-border">
                  <span className="font-mono text-docs-darkText font-semibold">Formula: =AVERAGE(C2:C5)</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">Calculation Valid</span>
                </div>
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-docs-border text-docs-subtext font-semibold">
                      <th className="p-2.5 border-r border-docs-border">#</th>
                      <th className="p-2.5 border-r border-docs-border">Microservice</th>
                      <th className="p-2.5 border-r border-docs-border">P99 Latency</th>
                      <th className="p-2.5 border-r border-docs-border">Peak Load (req/s)</th>
                      <th className="p-2.5">Health State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-docs-border">
                    <tr>
                      <td className="p-2.5 font-mono text-docs-subtext border-r border-docs-border bg-gray-50/50">1</td>
                      <td className="p-2.5 font-medium text-docs-darkText border-r border-docs-border">Auth Service (JWT)</td>
                      <td className="p-2.5 font-mono border-r border-docs-border">12ms</td>
                      <td className="p-2.5 font-mono border-r border-docs-border">14,200</td>
                      <td className="p-2.5"><span className="text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">Operational</span></td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono text-docs-subtext border-r border-docs-border bg-gray-50/50">2</td>
                      <td className="p-2.5 font-medium text-docs-darkText border-r border-docs-border">WebSocket Broker</td>
                      <td className="p-2.5 font-mono border-r border-docs-border">9ms</td>
                      <td className="p-2.5 font-mono border-r border-docs-border">28,500</td>
                      <td className="p-2.5"><span className="text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">Operational</span></td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono text-docs-subtext border-r border-docs-border bg-gray-50/50">3</td>
                      <td className="p-2.5 font-medium text-docs-darkText border-r border-docs-border">Document Storage (DynamoDB)</td>
                      <td className="p-2.5 font-mono border-r border-docs-border">14ms</td>
                      <td className="p-2.5 font-mono border-r border-docs-border">19,100</td>
                      <td className="p-2.5"><span className="text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">Operational</span></td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-mono text-docs-subtext border-r border-docs-border bg-gray-50/50">4</td>
                      <td className="p-2.5 font-medium text-docs-darkText border-r border-docs-border">Snapshot Engine (S3)</td>
                      <td className="p-2.5 font-mono border-r border-docs-border">18ms</td>
                      <td className="p-2.5 font-mono border-r border-docs-border">8,400</td>
                      <td className="p-2.5"><span className="text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">Operational</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="w-full max-w-3xl bg-white p-6 sm:p-8 rounded-sm shadow-docs-canvas border border-docs-border/60">
                <div className="flex items-center justify-between pb-3 border-b border-docs-border mb-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                    <NotebookPen className="w-3.5 h-3.5" />
                    <span>Quick Scratchpad Notes</span>
                  </div>
                  <span className="text-xs text-docs-subtext">Markdown Enabled</span>
                </div>

                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2.5 text-docs-darkText">
                    <div className="mt-0.5 w-4 h-4 rounded bg-blue-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="line-through text-docs-subtext">Finalize DynamoDB composite primary keys for active document partitions</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-docs-darkText">
                    <div className="mt-0.5 w-4 h-4 rounded bg-blue-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="line-through text-docs-subtext">Enable EventBridge fanout for collaborator invitation notifications</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-docs-darkText">
                    <div className="mt-0.5 w-4 h-4 rounded border border-gray-400 flex items-center justify-center" />
                    <span>Benchmark multi-cursor operational transform under simulated 200ms latency jitter</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-docs-darkText">
                    <div className="mt-0.5 w-4 h-4 rounded border border-gray-400 flex items-center justify-center" />
                    <span>Deploy presigned URL uploads for custom team avatars</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
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
              <div className="w-12 h-12 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-docs-darkText mb-2">
                Unified Tri-Modal Canvas
              </h3>
              <p className="text-sm text-docs-subtext leading-relaxed">
                No more jumping between three different tools. Seamlessly author long-form specifications, structured data spreadsheets, and rapid brainstorm scratchpads in one app.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-docs-bg border border-docs-border/80 hover:border-docs-blue/50 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-100/70 text-purple-700 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-docs-darkText mb-2">
                Granular Access & Approvals
              </h3>
              <p className="text-sm text-docs-subtext leading-relaxed">
                Assign explicit Owner, Editor, Commenter, and Viewer permissions. Built-in permission request flows let teammates request and receive instant document access securely.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-2xl bg-docs-bg border border-docs-border/80 hover:border-docs-blue/50 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <History className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-docs-darkText mb-2">
                Automated Cloud Snapshots
              </h3>
              <p className="text-sm text-docs-subtext leading-relaxed">
                Every revision is saved with point-in-time snapshotting. Review past milestones, inspect edits by collaborator, and revert unwanted changes with complete confidence.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-2xl bg-docs-bg border border-docs-border/80 hover:border-docs-blue/50 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-100/70 text-indigo-700 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-docs-darkText mb-2">
                Team Workspaces & Sharing
              </h3>
              <p className="text-sm text-docs-subtext leading-relaxed">
                Organize projects by team, track pending collaborator invitations, and share public or restricted links with zero friction.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-2xl bg-docs-bg border border-docs-border/80 hover:border-docs-blue/50 hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-xl bg-teal-100/70 text-teal-700 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-docs-darkText mb-2">
                Instant Discovery & Search
              </h3>
              <p className="text-sm text-docs-subtext leading-relaxed">
                Locate any document, note, or data sheet across your workspace in milliseconds with instant full-text query matching and quick category filters.
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
                    <span>→ /ws & /rest</span>
                  </div>
                  <span className="text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded text-[11px]">Sub-15ms</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-200/50">
                    <p className="font-bold text-docs-blue">Auth Service</p>
                    <p className="text-docs-subtext text-[10px] mt-0.5">JWT & Refresh Rotation</p>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200/50">
                    <p className="font-bold text-emerald-800">Collab Engine</p>
                    <p className="text-docs-subtext text-[10px] mt-0.5">Operational Transform</p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-50/60 border border-purple-200/50">
                    <p className="font-bold text-purple-800">Sharing Service</p>
                    <p className="text-docs-subtext text-[10px] mt-0.5">RBAC & Access Control</p>
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
                Create real-time documents, data sheets, and notes in seconds. Start collaborating with your team today.
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
                    Quick Notes
                  </Link>
                </li>
                <li>
                  <Link to={isAuthenticated ? ROUTES.SHARED : ROUTES.LOGIN} className="hover:text-docs-blue transition-colors">
                    Shared Documents
                  </Link>
                </li>
              </ul>
            </div>

            {/* Architecture Links */}
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
