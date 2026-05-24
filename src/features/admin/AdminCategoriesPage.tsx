import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, PlusCircle, Tag, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogDescription,
} from '@/components/ui/Dialog';
import { FormField } from '@/components/forms/FormField';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';

interface Category {
  id: string;
  name: string;
  slug: string;
  courseCount: number;
  createdAt: string;
}

const INIT_CATEGORIES: Category[] = [
  { id: '1', name: 'Web Development', slug: 'web-development', courseCount: 420, createdAt: '2024-01-01' },
  { id: '2', name: 'AI & Machine Learning', slug: 'ai-machine-learning', courseCount: 280, createdAt: '2024-01-01' },
  { id: '3', name: 'UI/UX Design', slug: 'ui-ux-design', courseCount: 195, createdAt: '2024-02-15' },
  { id: '4', name: 'Backend Development', slug: 'backend-development', courseCount: 165, createdAt: '2024-02-20' },
  { id: '5', name: 'Cloud & DevOps', slug: 'cloud-devops', courseCount: 142, createdAt: '2024-03-01' },
  { id: '6', name: 'Cybersecurity', slug: 'cybersecurity', courseCount: 98, createdAt: '2024-03-10' },
  { id: '7', name: 'Mobile Development', slug: 'mobile-development', courseCount: 87, createdAt: '2024-04-01' },
  { id: '8', name: 'Data Science', slug: 'data-science', courseCount: 134, createdAt: '2024-04-15' },
];

function slugify(str: string) {
  return str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_]+/g, '-');
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState(INIT_CATEGORIES);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', slug: '' });
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditTarget(null);
    setForm({ name: '', slug: '' });
    setDialogOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditTarget(cat);
    setForm({ name: cat.name, slug: cat.slug });
    setDialogOpen(true);
  };

  const handleNameChange = (name: string) => {
    setForm({ name, slug: editTarget ? form.slug : slugify(name) });
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));

    if (editTarget) {
      setCategories((prev) =>
        prev.map((c) => c.id === editTarget.id ? { ...c, name: form.name, slug: form.slug } : c)
      );
      toast.success('Category updated');
    } else {
      setCategories((prev) => [
        ...prev,
        { id: Date.now().toString(), name: form.name, slug: form.slug, courseCount: 0, createdAt: new Date().toISOString() },
      ]);
      toast.success('Category created');
    }

    setSaving(false);
    setDialogOpen(false);
  };

  const handleDelete = (cat: Category) => {
    setCategories((prev) => prev.filter((c) => c.id !== cat.id));
    setDeleteTarget(null);
    toast.success('Category deleted');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description={`${categories.length} categories`}
        action={
          <Button onClick={openCreate}>
            <PlusCircle className="size-4" />
            New category
          </Button>
        }
      />

      {categories.length === 0 ? (
        <EmptyState
          icon={Tag}
          title="No categories"
          description="Create your first course category."
          action={<Button onClick={openCreate}><PlusCircle className="size-4" /> Create category</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="p-4 group">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Tag className="size-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{cat.name}</p>
                      <p className="text-xs text-muted-foreground truncate">/{cat.slug}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <Button variant="ghost" size="icon-sm" onClick={() => openEdit(cat)}>
                      <Edit2 className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(cat)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <Badge variant="muted" className="text-[10px]">
                    {cat.courseCount.toLocaleString()} courses
                  </Badge>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editTarget ? 'Edit Category' : 'New Category'}</DialogTitle>
            <DialogDescription>
              {editTarget ? 'Update category details.' : 'Add a new course category to the platform.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <FormField label="Name" required htmlFor="catName">
              <Input
                id="catName"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Web Development"
                autoFocus
              />
            </FormField>
            <FormField label="Slug" required htmlFor="catSlug" hint="URL-friendly identifier">
              <Input
                id="catSlug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="e.g. web-development"
              />
            </FormField>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={saving} disabled={!form.name.trim()}>
              {editTarget ? 'Save changes' : 'Create category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete category?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?
              This cannot be undone. Courses in this category will need to be reassigned.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteTarget && handleDelete(deleteTarget)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
