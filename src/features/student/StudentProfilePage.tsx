import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, User2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { getInitials } from '@/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Separator } from '@/components/ui/Separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { FormField } from '@/components/forms/FormField';
import { PageHeader } from '@/components/common/PageHeader';

const profileSchema = z.object({
  firstName: z.string().min(2, 'Too short'),
  lastName: z.string().min(2, 'Too short'),
  email: z.string().email('Invalid email'),
  bio: z.string().max(300, 'Max 300 characters').optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function StudentProfilePage() {
  const { user } = useAuthStore();
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      bio: '',
      website: '',
    },
  });

  const onSubmit = async (_data: ProfileFormData) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    toast.success('Profile updated successfully');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Profile Settings" description="Manage your personal information and preferences." />

      {/* Avatar */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
          <CardDescription>Your photo will be shown on your profile and reviews.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-5">
          <div className="relative">
            <Avatar size="xl">
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback className="text-xl">
                {user ? getInitials(user.firstName, user.lastName) : <User2 />}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 size-7 rounded-full gradient-brand flex items-center justify-center border-2 border-card shadow-sm hover:opacity-90 transition-opacity">
              <Camera className="size-3.5 text-white" />
            </button>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role?.toLowerCase()}</p>
            <Button variant="outline" size="sm">Upload new photo</Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile form */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your account details.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="First name" error={errors.firstName?.message} htmlFor="firstName" required>
                <Input id="firstName" {...register('firstName')} error={!!errors.firstName} />
              </FormField>
              <FormField label="Last name" error={errors.lastName?.message} htmlFor="lastName" required>
                <Input id="lastName" {...register('lastName')} error={!!errors.lastName} />
              </FormField>
            </div>

            <FormField label="Email address" error={errors.email?.message} htmlFor="email" required>
              <Input id="email" type="email" {...register('email')} error={!!errors.email} />
            </FormField>

            <FormField label="Bio" error={errors.bio?.message} htmlFor="bio" hint="Tell others about yourself (max 300 characters)">
              <textarea
                id="bio"
                {...register('bio')}
                rows={3}
                placeholder="I'm a software developer passionate about..."
                className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </FormField>

            <FormField label="Website" error={errors.website?.message} htmlFor="website">
              <Input id="website" type="url" placeholder="https://yourwebsite.com" {...register('website')} error={!!errors.website} />
            </FormField>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" disabled={!isDirty}>Discard changes</Button>
              <Button type="submit" loading={saving} disabled={!isDirty}>
                {saving ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Use a strong password you don't use elsewhere.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField label="Current password" htmlFor="currentPassword">
            <Input id="currentPassword" type="password" placeholder="••••••••" />
          </FormField>
          <FormField label="New password" htmlFor="newPassword">
            <Input id="newPassword" type="password" placeholder="••••••••" />
          </FormField>
          <div className="flex justify-end">
            <Button>Update password</Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions. Proceed with caution.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Delete account</p>
              <p className="text-xs text-muted-foreground">Permanently delete your account and all data.</p>
            </div>
            <Button variant="destructive" size="sm">Delete account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
