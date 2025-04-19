
import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface CreateThreadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateThreadDialog: React.FC<CreateThreadDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { user } = useAuth();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      const { error } = await supabase
        .from('forum_threads')
        .insert({
          title: data.title,
          content: data.content,
          user_id: user?.id,
          is_anonymous: data.isAnonymous
        });

      if (error) throw error;

      toast.success('Thread created successfully!');
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating thread:', error);
      toast.error('Failed to create thread');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Thread</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input 
              id="title"
              {...register('title', { required: true })}
              placeholder="Enter thread title"
            />
          </div>
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea 
              id="content"
              {...register('content', { required: true })}
              placeholder="Share your thoughts..."
              rows={5}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="isAnonymous" {...register('isAnonymous')} />
            <Label htmlFor="isAnonymous">Post anonymously</Label>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Thread'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateThreadDialog;
