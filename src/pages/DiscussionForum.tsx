
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';
import ThreadList from '@/components/forum/ThreadList';
import CreateThreadDialog from '@/components/forum/CreateThreadDialog';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const DiscussionForum = () => {
  const [isCreateThreadOpen, setIsCreateThreadOpen] = useState(false);
  const { user } = useAuth();

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Discussion Forum</h1>
            <p className="text-muted-foreground mt-2">
              Join the conversation and share your thoughts with the community
            </p>
          </div>
          <Button 
            onClick={() => {
              if (!user) {
                toast.error("Please sign in to create a thread");
                return;
              }
              setIsCreateThreadOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            New Thread
          </Button>
        </div>

        <ThreadList />
        <CreateThreadDialog 
          open={isCreateThreadOpen} 
          onOpenChange={setIsCreateThreadOpen} 
        />
      </div>
    </Layout>
  );
};

export default DiscussionForum;
