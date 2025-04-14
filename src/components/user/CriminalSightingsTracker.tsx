
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Edit, 
  Eye, 
  MapPin, 
  Search, 
  ThumbsUp, 
  X, 
  Calendar 
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../ui/button';

interface CriminalTip {
  id: number;
  subject: string;
  description: string;
  location: string;
  tip_date: string;
  status: string;
  image_url: string | null;
  is_anonymous: boolean;
  submitter_name: string | null;
  email: string | null;
  phone: string | null;
  officer_action?: string | null;
  result?: string | null;
  criminal_name?: string | null;
  criminal_photo?: string | null;
}

const CriminalSightingsTracker: React.FC = () => {
  const { user } = useAuth();
  const [tips, setTips] = useState<CriminalTip[]>([]);
  const [filteredTips, setFilteredTips] = useState<CriminalTip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    if (user?.email) {
      fetchCriminalTips();
    }
  }, [user]);

  const fetchCriminalTips = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('criminal_tips')
        .select('*')
        .eq('email', user?.email)
        .order('tip_date', { ascending: false });
      
      if (error) throw error;
      
      setTips(data || []);
      setFilteredTips(data || []);
    } catch (error) {
      console.error('Error fetching tips:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    if (value === 'all') {
      setFilteredTips(tips);
    } else {
      const filteredByStatus = tips.filter(tip => {
        switch (value) {
          case 'new':
            return tip.status === 'New';
          case 'investigating':
            return tip.status === 'Investigating';
          case 'captured':
            return tip.status === 'Captured';
          case 'closed':
            return tip.status === 'Closed';
          default:
            return true;
        }
      });
      setFilteredTips(filteredByStatus);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return <Badge variant="outline" className="text-yellow-600 bg-yellow-50 border-yellow-200">New</Badge>;
      case 'Investigating':
        return <Badge variant="outline" className="text-teal bg-blue-50 border-blue-200">Investigating</Badge>;
      case 'Captured':
        return <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Captured</Badge>;
      case 'Closed':
        return <Badge variant="outline" className="text-red-500 bg-red-50 border-red-200">Closed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'New':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'Investigating':
        return <Search className="h-4 w-4 text-teal" />;
      case 'Captured':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Closed':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getResultBadge = (result?: string | null) => {
    if (!result) return null;
    
    switch (result) {
      case 'Successful':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Successful</Badge>;
      case 'Unsuccessful':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Unsuccessful</Badge>;
      case 'Pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{result}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-gray-200 mb-3"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-deepblue mb-2">Criminal Sightings Reports</h2>
        <p className="text-darkslate mb-6">
          Track the status of your criminal sighting reports and see if your tips led to successful captures.
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="investigating">Investigating</TabsTrigger>
          <TabsTrigger value="captured">Captured</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {filteredTips.length > 0 ? (
            <div className="space-y-4">
              {filteredTips.map((tip) => (
                <Card key={tip.id} className="overflow-hidden hover:shadow-md transition-shadow border-l-4 border-l-teal">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      <div className="p-6 flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg text-deepblue">{tip.subject}</h3>
                          {getStatusBadge(tip.status)}
                        </div>
                        
                        <p className="text-darkslate text-sm mb-4 line-clamp-2">
                          {tip.description}
                        </p>

                        {tip.criminal_name && (
                          <div className="flex items-center mb-4">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage src={tip.criminal_photo || ''} alt={tip.criminal_name} />
                              <AvatarFallback className="bg-amber text-white">
                                {tip.criminal_name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{tip.criminal_name}</span>
                          </div>
                        )}
                        
                        {tip.officer_action && (
                          <div className="bg-blue-50 p-3 rounded-md mb-4">
                            <p className="text-xs font-medium text-deepblue mb-1">Officer Action:</p>
                            <p className="text-sm text-darkslate">{tip.officer_action}</p>
                          </div>
                        )}

                        {tip.result && (
                          <div className="mb-3">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-600 mr-2">Result:</span>
                              {getResultBadge(tip.result)}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {format(new Date(tip.tip_date), 'MMM dd, yyyy')}
                          </div>
                          
                          {tip.location && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {tip.location}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-6 flex flex-col justify-center items-center sm:w-48">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 mb-3">
                          {getStatusIcon(tip.status)}
                        </div>
                        <Button variant="outline" className="whitespace-nowrap">
                          View Details
                          <Eye className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-16 text-center">
              <Eye className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No reports found</h3>
              <p className="text-gray-500 mb-6">
                {activeTab === 'all' 
                  ? "You haven't submitted any criminal sighting reports yet." 
                  : `You don't have any ${activeTab} reports.`}
              </p>
              <Button asChild className="bg-teal hover:bg-teal/90">
                <a href="/submit-tip">
                  Submit a New Tip
                </a>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CriminalSightingsTracker;
