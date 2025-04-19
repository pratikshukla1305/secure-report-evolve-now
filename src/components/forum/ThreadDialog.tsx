
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ThreadDialogProps {
  thread: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ThreadDialog: React.FC<ThreadDialogProps> = ({ 
  thread, 
  open, 
  onOpenChange 
}) => {
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (thread?.id) {
      fetchReplies();

      // Subscribe to realtime updates for replies
      const channel = supabase
        .channel('thread-replies')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'forum_replies',
            filter: `thread_id=eq.${thread.id}`
          },
          () => {
            fetchReplies();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [thread?.id]);

  const fetchReplies = async () => {
    if (!thread?.id) return;

    try {
      const { data, error } = await supabase
        .from('forum_replies')
        .select(`
          *,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .eq('thread_id', thread.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setReplies(data);
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  const handleSubmitReply = async () => {
    if (!user) {
      toast.error('Please sign in to reply');
      return;
    }

    if (!newReply.trim()) {
      toast.error('Reply cannot be empty');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('forum_replies')
        .insert({
          thread_id: thread.id,
          content: newReply,
          user_id: user.id,
          is_anonymous: isAnonymous
        });

      if (error) throw error;

      setNewReply('');
      setIsAnonymous(false);
      toast.success('Reply added successfully!');
    } catch (error) {
      console.error('Error adding reply:', error);
      toast.error('Failed to add reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, type: 'thread' | 'reply') => {
    try {
      const { error } = await supabase
        .from(type === 'thread' ? 'forum_threads' : 'forum_replies')
        .delete()
        .eq('id', id);

      if (error) throw error;

      if (type === 'thread') {
        onOpenChange(false);
      }
      toast.success(`${type === 'thread' ? 'Thread' : 'Reply'} deleted successfully`);
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Failed to delete');
    }
  };

  if (!thread) return null;

  // Correct way to handle checkbox state changes
  const handleAnonymousChange = (checked: boolean) => {
    setIsAnonymous(checked);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{thread.title}</DialogTitle>
            {user?.id === thread.user_id && (
              <Button 
                variant="destructive" 
                onClick={() => handleDelete(thread.id, 'thread')}
              >
                Delete Thread
              </Button>
            )}
          </div>
          <div className="flex items-center justify-between mt-2">
            {thread.is_anonymous ? (
              <Badge variant="secondary">Anonymous</Badge>
            ) : (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback>
                    {thread.profiles?.full_name?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">
                  {thread.profiles?.full_name || 'Unknown User'}
                </span>
              </div>
            )}
            <span className="text-sm text-muted-foreground">
              {format(new Date(thread.created_at), 'PPp')}
            </span>
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <p className="text-lg">{thread.content}</p>

          <div className="space-y-4 mt-8">
            <h3 className="font-semibold">Replies</h3>
            {replies.map((reply) => (
              <div 
                key={reply.id} 
                className="bg-muted p-4 rounded-lg space-y-2"
              >
                <div className="flex items-center justify-between">
                  {reply.is_anonymous ? (
                    <Badge variant="secondary">Anonymous</Badge>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>
                          {reply.profiles?.full_name?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">
                        {reply.profiles?.full_name || 'Unknown User'}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(reply.created_at), 'PPp')}
                    </span>
                    {user?.id === reply.user_id && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(reply.id, 'reply')}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
                <p>{reply.content}</p>
              </div>
            ))}

            <div className="space-y-4 pt-4">
              <Textarea
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                placeholder={user ? "Write a reply..." : "Sign in to reply"}
                disabled={!user || isSubmitting}
                rows={3}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="replyAnonymous"
                    checked={isAnonymous}
                    onCheckedChange={handleAnonymousChange}
                    disabled={!user}
                  />
                  <Label htmlFor="replyAnonymous">Reply anonymously</Label>
                </div>
                <Button
                  onClick={handleSubmitReply}
                  disabled={!user || isSubmitting || !newReply.trim()}
                >
                  {isSubmitting ? 'Sending...' : 'Send Reply'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ThreadDialog;
