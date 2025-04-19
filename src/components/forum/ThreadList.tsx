
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import ThreadDialog from './ThreadDialog';

const ThreadList = () => {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedThread, setSelectedThread] = useState(null);

  useEffect(() => {
    fetchThreads();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('forum-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'forum_threads'
        },
        () => {
          fetchThreads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchThreads = async () => {
    try {
      // Modify query to avoid using direct joins since the FK relationship might not be properly set up
      const { data, error } = await supabase
        .from('forum_threads')
        .select('*, user_id')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fetch reply counts separately
      const threadsWithDetails = await Promise.all(
        data.map(async (thread) => {
          // Get reply count
          const { count: replyCount, error: replyError } = await supabase
            .from('forum_replies')
            .select('*', { count: 'exact', head: true })
            .eq('thread_id', thread.id);
            
          if (replyError) console.error('Error fetching reply count:', replyError);
          
          // Get user profile if not anonymous
          let userProfile = null;
          if (!thread.is_anonymous && thread.user_id) {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('full_name, avatar_url')
              .eq('id', thread.user_id)
              .single();
              
            if (!profileError) userProfile = profileData;
          }
          
          return {
            ...thread,
            profiles: userProfile,
            reply_count: replyCount || 0
          };
        })
      );
      
      setThreads(threadsWithDetails);
    } catch (error) {
      console.error('Error fetching threads:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <Card key={n}>
            <CardHeader>
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {threads.map((thread) => (
          <Card key={thread.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{thread.title}</CardTitle>
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
              </div>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-2">{thread.content}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{format(new Date(thread.created_at), 'PPp')}</span>
                <span>{thread.reply_count} replies</span>
              </div>
              <Button variant="ghost" onClick={() => setSelectedThread(thread)}>
                View Discussion
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <ThreadDialog 
        thread={selectedThread} 
        open={!!selectedThread} 
        onOpenChange={(open) => !open && setSelectedThread(null)} 
      />
    </>
  );
};

export default ThreadList;
