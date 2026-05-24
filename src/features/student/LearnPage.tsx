import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle2, ChevronDown, ChevronRight,
  Lock, Play, PlayCircle,
} from 'lucide-react';
import { ROUTES } from '@/constants';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils';

const MOCK_CURRICULUM = [
  {
    id: 's1',
    title: 'Getting Started',
    completed: true,
    lectures: [
      { id: 'l1', title: 'Course Introduction', duration: '5:23', isCompleted: true, isFree: true },
      { id: 'l2', title: 'Setting Up Your Environment', duration: '12:10', isCompleted: true, isFree: true },
      { id: 'l3', title: 'Your First React App', duration: '18:45', isCompleted: true, isFree: false },
    ],
  },
  {
    id: 's2',
    title: 'Components & Props',
    completed: false,
    lectures: [
      { id: 'l4', title: 'Understanding JSX', duration: '14:20', isCompleted: false, isFree: false },
      { id: 'l5', title: 'Component Types', duration: '22:08', isCompleted: false, isFree: false },
      { id: 'l6', title: 'Props Deep Dive', duration: '19:33', isCompleted: false, isFree: false },
    ],
  },
  {
    id: 's3',
    title: 'State Management',
    completed: false,
    lectures: [
      { id: 'l7', title: 'useState Hook', duration: '16:45', isCompleted: false, isFree: false },
      { id: 'l8', title: 'useReducer', duration: '24:12', isCompleted: false, isFree: false },
      { id: 'l9', title: 'Zustand State Management', duration: '31:05', isCompleted: false, isFree: false },
    ],
  },
];

export default function LearnPage() {
  const [activeLectureId, setActiveLectureId] = useState('l4');
  const [expandedSections, setExpandedSections] = useState<string[]>(['s1', 's2']);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const activeLecture = MOCK_CURRICULUM
    .flatMap((s) => s.lectures)
    .find((l) => l.id === activeLectureId);

  const totalLectures = MOCK_CURRICULUM.reduce((a, s) => a + s.lectures.length, 0);
  const completedLectures = MOCK_CURRICULUM.flatMap((s) => s.lectures).filter((l) => l.isCompleted).length;
  const progress = Math.round((completedLectures / totalLectures) * 100);

  return (
    <div className="fixed inset-0 top-14 flex bg-background overflow-hidden">
      {/* ── Video Area ────────────────────────────────────────────────── */}
      <div className={cn('flex flex-col flex-1 overflow-hidden min-w-0')}>
        {/* Top bar */}
        <div className="flex items-center gap-3 px-4 h-12 border-b bg-card shrink-0">
          <Button variant="ghost" size="icon-sm" asChild>
            <Link to={ROUTES.STUDENT.MY_COURSES}>
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Complete React Developer 2025</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full gradient-brand rounded-full" style={{ width: `${progress}%` }} />
            </div>
            <span>{progress}% complete</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:flex"
          >
            {sidebarOpen ? <ChevronRight className="size-4" /> : <ChevronRight className="size-4 rotate-180" />}
            {sidebarOpen ? 'Hide' : 'Show'} content
          </Button>
        </div>

        {/* Video */}
        <div className="flex-1 overflow-y-auto">
          <div className="bg-black aspect-video w-full max-h-[65vh] flex items-center justify-center">
            <div className="text-center text-white space-y-4">
              <PlayCircle className="size-16 opacity-80 mx-auto" />
              <p className="text-sm opacity-60">{activeLecture?.title}</p>
              <p className="text-xs opacity-40">Video player would render here (HLS.js)</p>
            </div>
          </div>

          {/* Lecture info */}
          <div className="max-w-3xl mx-auto px-6 py-8 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-xl font-display font-bold">{activeLecture?.title}</h1>
              <Button size="sm" className="shrink-0 gap-1.5">
                <CheckCircle2 className="size-4" />
                Mark complete
              </Button>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              In this lecture, we'll explore the core concepts in depth with practical examples
              you can apply immediately in your projects.
            </p>
          </div>
        </div>
      </div>

      {/* ── Curriculum Sidebar ───────────────────────────────────────── */}
      {sidebarOpen && (
        <div className="hidden md:flex flex-col w-80 border-l bg-card shrink-0 overflow-hidden">
          <div className="px-4 py-3 border-b">
            <p className="font-semibold text-sm">Course Content</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {completedLectures}/{totalLectures} lectures • {progress}% complete
            </p>
            <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full gradient-brand rounded-full" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {MOCK_CURRICULUM.map((section) => {
              const isExpanded = expandedSections.includes(section.id);
              const sectionCompleted = section.lectures.filter((l) => l.isCompleted).length;

              return (
                <div key={section.id} className="border-b last:border-0">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-muted/50 transition-colors"
                  >
                    <ChevronDown className={cn('size-4 text-muted-foreground transition-transform shrink-0', isExpanded && 'rotate-180')} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-snug">{section.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {sectionCompleted}/{section.lectures.length} · {section.lectures.reduce((a, l) => a + parseInt(l.duration), 0)}m
                      </p>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="pb-1">
                      {section.lectures.map((lecture) => {
                        const isActive = lecture.id === activeLectureId;
                        return (
                          <button
                            key={lecture.id}
                            onClick={() => setActiveLectureId(lecture.id)}
                            className={cn(
                              'w-full flex items-start gap-2.5 px-4 py-2.5 text-left transition-colors',
                              isActive ? 'bg-primary/10' : 'hover:bg-muted/50'
                            )}
                          >
                            <div className="mt-0.5 shrink-0">
                              {lecture.isCompleted ? (
                                <CheckCircle2 className="size-4 text-green-500" />
                              ) : isActive ? (
                                <Play className="size-4 text-primary fill-primary" />
                              ) : (
                                <div className="size-4 rounded-full border-2 border-muted-foreground/40" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={cn(
                                'text-xs leading-snug',
                                isActive ? 'text-primary font-medium' : 'text-foreground'
                              )}>
                                {lecture.title}
                              </p>
                              <p className="text-[11px] text-muted-foreground mt-0.5">{lecture.duration}</p>
                            </div>
                            {lecture.isFree && (
                              <span className="text-[10px] text-green-600 font-medium shrink-0">Free</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
