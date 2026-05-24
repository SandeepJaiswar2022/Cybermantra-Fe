import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ROUTES } from '@/constants';
import { cn } from '@/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FormField } from '@/components/forms/FormField';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

// ── Wizard Steps ──────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, title: 'Basic Info', description: 'Course title and description' },
  { id: 2, title: 'Category', description: 'Type and level' },
  { id: 3, title: 'Pricing', description: 'Set your price' },
  { id: 4, title: 'Curriculum', description: 'Add sections' },
  { id: 5, title: 'Review', description: 'Preview & publish' },
];

const basicInfoSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(120, 'Too long'),
  shortDescription: z.string().min(30, 'At least 30 characters').max(200, 'Too long'),
  description: z.string().min(100, 'Provide a detailed description (100+ characters)'),
});

const CATEGORIES = [
  'Web Development', 'Mobile Development', 'Data Science', 'AI & Machine Learning',
  'DevOps & Cloud', 'Cybersecurity', 'UI/UX Design', 'Business', 'Marketing', 'Finance',
];

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

type BasicInfoData = z.infer<typeof basicInfoSchema>;

interface CourseData {
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  level: string;
  language: string;
  price: number;
  isFree: boolean;
}

// ── Step Components ───────────────────────────────────────────────────────────
function StepBasicInfo({ onNext }: { onNext: (data: Partial<CourseData>) => void }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<BasicInfoData>({
    resolver: zodResolver(basicInfoSchema),
  });
  const title = watch('title', '');
  const desc = watch('description', '');

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      <FormField label="Course Title" error={errors.title?.message} htmlFor="title" required hint="A catchy, descriptive title (10–120 characters)">
        <Input id="title" placeholder="e.g. Complete React Developer 2025" {...register('title')} error={!!errors.title} />
        <p className="text-xs text-muted-foreground text-right">{title.length}/120</p>
      </FormField>

      <FormField label="Short Description" error={errors.shortDescription?.message} htmlFor="shortDesc" required hint="Shown in course cards (30–200 characters)">
        <textarea
          id="shortDesc"
          {...register('shortDescription')}
          rows={2}
          placeholder="Briefly describe what students will learn..."
          className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
        />
      </FormField>

      <FormField label="Full Description" error={errors.description?.message} htmlFor="description" required hint="Detailed overview, what's included, prerequisites (100+ characters)">
        <textarea
          id="description"
          {...register('description')}
          rows={6}
          placeholder="Describe your course in detail. Include what students will learn, the skills they'll develop, and who this course is for..."
          className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
        />
        <p className="text-xs text-muted-foreground text-right">{desc.length} chars</p>
      </FormField>

      <div className="flex justify-end">
        <Button type="submit">
          Continue <ArrowRight className="size-4" />
        </Button>
      </div>
    </form>
  );
}

function StepCategory({ data, onNext, onBack }: { data: Partial<CourseData>; onNext: (d: Partial<CourseData>) => void; onBack: () => void }) {
  const [category, setCategory] = useState(data.category ?? '');
  const [level, setLevel] = useState(data.level ?? 'Beginner');

  return (
    <div className="space-y-6">
      <FormField label="Category" required>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={cn(
                'px-3 py-2 rounded-lg border text-sm text-left transition-all duration-150',
                category === cat
                  ? 'border-primary bg-primary/10 text-primary font-medium'
                  : 'border-border hover:border-muted-foreground/50 text-muted-foreground hover:text-foreground'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </FormField>

      <FormField label="Difficulty Level" required>
        <div className="flex gap-2 flex-wrap mt-1">
          {LEVELS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLevel(l)}
              className={cn(
                'px-4 py-2 rounded-full border text-sm font-medium transition-all duration-150',
                level === l
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border hover:border-muted-foreground/50 text-muted-foreground hover:text-foreground'
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </FormField>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}><ArrowLeft className="size-4" /> Back</Button>
        <Button onClick={() => onNext({ category, level })} disabled={!category}>
          Continue <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function StepPricing({ data, onNext, onBack }: { data: Partial<CourseData>; onNext: (d: Partial<CourseData>) => void; onBack: () => void }) {
  const [isFree, setIsFree] = useState(data.isFree ?? false);
  const [price, setPrice] = useState(data.price?.toString() ?? '79');

  const PRICE_TIERS = [19, 29, 49, 59, 79, 89, 99, 119, 129, 149, 199, 249];

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        {[false, true].map((free) => (
          <button
            key={String(free)}
            type="button"
            onClick={() => setIsFree(free)}
            className={cn(
              'flex-1 p-4 rounded-xl border text-left transition-all duration-150',
              isFree === free
                ? 'border-primary bg-primary/10'
                : 'border-border hover:border-muted-foreground/50'
            )}
          >
            <p className={cn('font-semibold text-sm', isFree === free ? 'text-primary' : '')}>
              {free ? 'Free' : 'Paid'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {free ? 'No enrollment fee' : 'Earn revenue from students'}
            </p>
          </button>
        ))}
      </div>

      {!isFree && (
        <div className="space-y-4">
          <FormField label="Price (USD)" required hint="Select a tier or enter a custom price">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="pl-7"
                min={0}
                step={1}
              />
            </div>
          </FormField>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {PRICE_TIERS.map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setPrice(String(tier))}
                className={cn(
                  'px-3 py-1.5 rounded-lg border text-sm transition-all duration-150',
                  price === String(tier)
                    ? 'border-primary bg-primary/10 text-primary font-medium'
                    : 'border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/50'
                )}
              >
                ${tier}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}><ArrowLeft className="size-4" /> Back</Button>
        <Button onClick={() => onNext({ isFree, price: isFree ? 0 : Number(price) })}>
          Continue <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function StepCurriculum({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [sections, setSections] = useState([{ id: '1', title: 'Introduction', lectures: 0 }]);
  const [newSection, setNewSection] = useState('');

  const addSection = () => {
    if (!newSection.trim()) return;
    setSections((prev) => [...prev, { id: Date.now().toString(), title: newSection, lectures: 0 }]);
    setNewSection('');
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Organize your content into sections. You can add lectures after creating the course.
      </p>

      <div className="space-y-2">
        {sections.map((s, i) => (
          <div key={s.id} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
            <span className="size-6 rounded-md bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
              {i + 1}
            </span>
            <p className="flex-1 text-sm font-medium">{s.title}</p>
            <Button variant="ghost" size="icon-sm" onClick={() => setSections((prev) => prev.filter((x) => x.id !== s.id))}>
              ×
            </Button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          value={newSection}
          onChange={(e) => setNewSection(e.target.value)}
          placeholder="Section title..."
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSection())}
        />
        <Button variant="outline" onClick={addSection}>Add</Button>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}><ArrowLeft className="size-4" /> Back</Button>
        <Button onClick={onNext} disabled={sections.length === 0}>
          Continue <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function StepReview({ data, onSubmit }: { data: Partial<CourseData>; onSubmit: () => void }) {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border bg-muted/30 divide-y">
        {[
          { label: 'Title', value: data.title },
          { label: 'Category', value: data.category },
          { label: 'Level', value: data.level },
          { label: 'Price', value: data.isFree ? 'Free' : `$${data.price}` },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className="text-sm font-medium">{value || '—'}</span>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-xl border bg-primary/5 border-primary/20">
        <p className="text-sm text-primary font-medium mb-1">Ready to publish?</p>
        <p className="text-xs text-muted-foreground">
          Your course will be saved as a draft. You can add lectures, upload videos,
          and submit for review from the editor.
        </p>
      </div>

      <Button className="w-full" size="lg" onClick={onSubmit}>
        <Check className="size-4" />
        Create course draft
      </Button>
    </div>
  );
}

// ── Main Wizard ───────────────────────────────────────────────────────────────
export default function CreateCoursePage() {
  const [step, setStep] = useState(1);
  const [courseData, setCourseData] = useState<Partial<CourseData>>({});

  const updateAndNext = (data: Partial<CourseData>) => {
    setCourseData((prev) => ({ ...prev, ...data }));
    setStep((s) => s + 1);
  };

  const handleSubmit = () => {
    console.log('Creating course:', courseData);
    // In production: mutation to create course
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon-sm" asChild>
          <Link to={ROUTES.INSTRUCTOR.COURSES}><ArrowLeft className="size-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight">Create New Course</h1>
          <p className="text-sm text-muted-foreground">Step {step} of {STEPS.length}</p>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div className={cn(
                'size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200',
                step > s.id ? 'gradient-brand text-white' :
                step === s.id ? 'border-2 border-primary text-primary bg-primary/10' :
                'border-2 border-border text-muted-foreground'
              )}>
                {step > s.id ? <Check className="size-4" /> : s.id}
              </div>
              <span className={cn(
                'text-[10px] font-medium whitespace-nowrap hidden sm:block',
                step === s.id ? 'text-primary' : 'text-muted-foreground'
              )}>
                {s.title}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn('flex-1 h-px mx-2 mb-5 transition-colors duration-300', step > s.id ? 'bg-primary' : 'bg-border')} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <Card>
        <CardHeader>
          <CardTitle>{STEPS[step - 1].title}</CardTitle>
          <CardDescription>{STEPS[step - 1].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
            >
              {step === 1 && <StepBasicInfo onNext={updateAndNext} />}
              {step === 2 && <StepCategory data={courseData} onNext={updateAndNext} onBack={() => setStep(1)} />}
              {step === 3 && <StepPricing data={courseData} onNext={updateAndNext} onBack={() => setStep(2)} />}
              {step === 4 && <StepCurriculum onNext={() => setStep(5)} onBack={() => setStep(3)} />}
              {step === 5 && <StepReview data={courseData} onSubmit={handleSubmit} />}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
