import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ChevronDown, ChevronUp, Edit2, GripVertical,
  PlusCircle, Save, Trash2, Upload, Video,
} from 'lucide-react';
import { toast } from 'sonner';
import { ROUTES } from '@/constants';
import { cn } from '@/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';
import { PageHeader } from '@/components/common/PageHeader';

interface Lecture {
  id: string;
  title: string;
  type: 'VIDEO' | 'ARTICLE';
  duration?: string;
  status: 'DRAFT' | 'READY' | 'PROCESSING' | 'UPLOADING';
  isFree: boolean;
}

interface Section {
  id: string;
  title: string;
  lectures: Lecture[];
  expanded: boolean;
}

const STATUS_BADGE: Record<string, 'success' | 'warning' | 'secondary' | 'outline'> = {
  READY: 'success',
  PROCESSING: 'warning',
  UPLOADING: 'warning',
  DRAFT: 'secondary',
};

const INIT_SECTIONS: Section[] = [
  {
    id: 's1',
    title: 'Getting Started',
    expanded: true,
    lectures: [
      { id: 'l1', title: 'Course Introduction', type: 'VIDEO', duration: '5:23', status: 'READY', isFree: true },
      { id: 'l2', title: 'Setting Up Your Environment', type: 'VIDEO', duration: '12:10', status: 'READY', isFree: true },
    ],
  },
  {
    id: 's2',
    title: 'Core Concepts',
    expanded: true,
    lectures: [
      { id: 'l3', title: 'Understanding JSX', type: 'VIDEO', duration: '14:20', status: 'DRAFT', isFree: false },
      { id: 'l4', title: 'Component Architecture', type: 'ARTICLE', status: 'DRAFT', isFree: false },
    ],
  },
];

function LectureRow({ lecture, onDelete, onEdit }: {
  lecture: Lecture;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(lecture.title);

  const save = () => {
    onEdit(lecture.id, title);
    setEditing(false);
  };

  return (
    <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-muted/50 group transition-colors">
      <GripVertical className="size-4 text-muted-foreground/40 shrink-0 cursor-grab" />

      <div className={cn(
        'size-7 rounded-md flex items-center justify-center shrink-0',
        lecture.type === 'VIDEO' ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'
      )}>
        {lecture.type === 'VIDEO' ? <Video className="size-3.5" /> : <Edit2 className="size-3.5" />}
      </div>

      {editing ? (
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => e.key === 'Enter' && save()}
          className="flex-1 text-sm bg-transparent border-b border-primary outline-none"
        />
      ) : (
        <span className="flex-1 text-sm truncate">{lecture.title}</span>
      )}

      <div className="flex items-center gap-2 ml-auto">
        {lecture.duration && (
          <span className="text-xs text-muted-foreground">{lecture.duration}</span>
        )}
        <Badge variant={STATUS_BADGE[lecture.status]} className="text-[10px] py-0 hidden sm:flex">
          {lecture.status}
        </Badge>
        {lecture.isFree && (
          <Badge variant="outline" className="text-[10px] py-0 hidden sm:flex text-green-600 border-green-500/30">
            Free
          </Badge>
        )}
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
          <Button variant="ghost" size="icon-sm" onClick={() => setEditing(true)}>
            <Edit2 className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onDelete(lecture.id)} className="text-destructive hover:text-destructive">
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function EditCoursePage() {
  const { id } = useParams();
  const [sections, setSections] = useState<Section[]>(INIT_SECTIONS);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [saving, setSaving] = useState(false);

  const toggleSection = (sId: string) =>
    setSections((prev) => prev.map((s) => s.id === sId ? { ...s, expanded: !s.expanded } : s));

  const addSection = () => {
    if (!newSectionTitle.trim()) return;
    setSections((prev) => [
      ...prev,
      { id: Date.now().toString(), title: newSectionTitle, lectures: [], expanded: true },
    ]);
    setNewSectionTitle('');
  };

  const addLecture = (sId: string) => {
    setSections((prev) => prev.map((s) =>
      s.id === sId
        ? { ...s, lectures: [...s.lectures, { id: Date.now().toString(), title: 'New Lecture', type: 'VIDEO', status: 'DRAFT', isFree: false }] }
        : s
    ));
  };

  const deleteLecture = (sId: string, lId: string) =>
    setSections((prev) => prev.map((s) =>
      s.id === sId ? { ...s, lectures: s.lectures.filter((l) => l.id !== lId) } : s
    ));

  const editLecture = (sId: string, lId: string, title: string) =>
    setSections((prev) => prev.map((s) =>
      s.id === sId
        ? { ...s, lectures: s.lectures.map((l) => l.id === lId ? { ...l, title } : l) }
        : s
    ));

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast.success('Course saved!');
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" asChild>
          <Link to={ROUTES.INSTRUCTOR.COURSES}><ArrowLeft className="size-4" /></Link>
        </Button>
        <PageHeader
          title="Edit Course"
          description="Course ID: " 
          className="mb-0"
          action={
            <Button onClick={handleSave} loading={saving}>
              <Save className="size-4" />
              {saving ? 'Saving...' : 'Save changes'}
            </Button>
          }
        />
      </div>

      <Tabs defaultValue="curriculum">
        <TabsList>
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
          <TabsTrigger value="info">Course Info</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* ── Curriculum Tab ─────────────────────────────────────────── */}
        <TabsContent value="curriculum">
          <div className="space-y-4">
            {sections.map((section) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  {/* Section header */}
                  <div
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors rounded-t-xl"
                    onClick={() => toggleSection(section.id)}
                  >
                    <GripVertical className="size-4 text-muted-foreground/50 cursor-grab shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{section.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {section.lectures.length} lecture{section.lectures.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); addLecture(section.id); }}
                        className="hidden sm:flex"
                      >
                        <PlusCircle className="size-4" />
                        Add lecture
                      </Button>
                      {section.expanded
                        ? <ChevronUp className="size-4 text-muted-foreground" />
                        : <ChevronDown className="size-4 text-muted-foreground" />
                      }
                    </div>
                  </div>

                  {/* Lectures */}
                  {section.expanded && (
                    <CardContent className="pt-0 pb-3 px-3 space-y-0.5">
                      {section.lectures.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No lectures yet. Add your first lecture.
                        </p>
                      ) : (
                        section.lectures.map((lecture) => (
                          <LectureRow
                            key={lecture.id}
                            lecture={lecture}
                            onDelete={(lId) => deleteLecture(section.id, lId)}
                            onEdit={(lId, title) => editLecture(section.id, lId, title)}
                          />
                        ))
                      )}

                      {/* Upload drop zone */}
                      <div className="mt-2 p-4 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                          <Upload className="size-4 shrink-0" />
                          <span className="text-xs">Drop video files here or click to upload</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addLecture(section.id)}
                        >
                          <PlusCircle className="size-4" />
                          Add lecture
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))}

            {/* Add section */}
            <Card className="border-dashed">
              <CardContent className="pt-4 pb-4">
                <p className="text-sm font-medium mb-3">Add a new section</p>
                <div className="flex gap-2">
                  <Input
                    value={newSectionTitle}
                    onChange={(e) => setNewSectionTitle(e.target.value)}
                    placeholder="Section title..."
                    onKeyDown={(e) => e.key === 'Enter' && addSection()}
                  />
                  <Button onClick={addSection} disabled={!newSectionTitle.trim()}>
                    <PlusCircle className="size-4" />
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Course Info Tab ────────────────────────────────────────── */}
        <TabsContent value="info">
          <Card>
            <CardHeader><CardTitle>Course Information</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Course Title</label>
                <Input defaultValue="Complete React Developer 2025" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Short Description</label>
                <textarea
                  rows={2}
                  defaultValue="Master React 19 from beginner to expert with real-world projects."
                  className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Full Description</label>
                <textarea
                  rows={6}
                  defaultValue="This comprehensive React course takes you from beginner to professional..."
                  className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave} loading={saving}>Save changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Pricing Tab ────────────────────────────────────────────── */}
        <TabsContent value="pricing">
          <Card>
            <CardHeader><CardTitle>Pricing</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Price (USD)</label>
                <div className="relative max-w-xs">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input type="number" defaultValue="89" className="pl-7" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave} loading={saving}>Save pricing</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Settings Tab ───────────────────────────────────────────── */}
        <TabsContent value="settings">
          <Card>
            <CardHeader><CardTitle>Course Settings</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="text-sm font-medium">Submit for Review</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Send your course to admins for approval</p>
                </div>
                <Button variant="outline" size="sm">Submit</Button>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <p className="text-sm font-medium text-destructive">Delete Course</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Permanently delete this course and all content</p>
                </div>
                <Button variant="destructive" size="sm">Delete</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
