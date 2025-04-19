
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import ThreadDialog from './ThreadDialog';
import { FileVideo } from 'lucide-react';

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
      <div className="space-y-6">
        {threads.map((thread) => (
          <Card key={thread.id} className="hover:shadow-lg transition-shadow duration-300 bg-card">
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-foreground hover:text-primary transition-colors">
                  {thread.title}
                </CardTitle>
                {thread.is_anonymous ? (
                  <Badge variant="secondary" className="text-sm">Anonymous</Badge>
                ) : (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {thread.profiles?.full_name?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground font-medium">
                      {thread.profiles?.full_name || 'Unknown User'}
                    </span>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground/90 line-clamp-3">{thread.content}</p>
              
              {thread.media_urls && thread.media_urls.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {thread.media_urls.slice(0, 4).map((url, index) => (
                    <div key={index} className="relative aspect-video">
                      {url.toLowerCase().includes('.mp4') ? (
                        <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                          <FileVideo className="w-8 h-8 text-muted-foreground" />
                        </div>
                      ) : (
                        <img 
                          src={url} 
                          alt={`Thread media ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      )}
                    </div>
                  ))}
                  {thread.media_urls.length > 4 && (
                    <div className="absolute bottom-2 right-2">
                      <Badge variant="secondary">+{thread.media_urls.length - 4} more</Badge>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{format(new Date(thread.created_at), 'PPp')}</span>
                <span>{thread.reply_count} replies</span>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => setSelectedThread(thread)}
                className="hover:bg-primary/10 hover:text-primary transition-colors"
              >
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
