
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OfficerNavbar from '@/components/officer/OfficerNavbar';
import { useOfficerAuth } from '@/contexts/OfficerAuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Shield, Search, Check, X, User, FileText, Eye, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

// This would be fetched from your API in a real app
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&q=80',
    reports: {
      total: 7,
      confirmed: 5,
      rejected: 2
    },
    kyc_status: 'Verified',
    last_activity: '2025-04-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar_url: null,
    reports: {
      total: 3,
      confirmed: 3,
      rejected: 0
    },
    kyc_status: 'Pending',
    last_activity: '2025-04-16T15:20:00Z'
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'michael.j@example.com',
    avatar_url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&q=80',
    reports: {
      total: 12,
      confirmed: 9,
      rejected: 3
    },
    kyc_status: 'Rejected',
    last_activity: '2025-04-14T08:45:00Z'
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah.w@example.com',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&q=80',
    reports: {
      total: 5,
      confirmed: 4,
      rejected: 1
    },
    kyc_status: 'Verified',
    last_activity: '2025-04-17T09:15:00Z'
  }
];

// Mock user details
const mockUserDetails = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80',
  address: '123 Main St, Anytown, USA',
  joined_date: '2024-11-05T00:00:00Z',
  kyc_status: 'Verified',
  kyc_date: '2025-01-10T00:00:00Z',
  reports: [
    {
      id: 'rep1',
      title: 'Suspicious activity near Main Street',
      date: '2025-04-10T14:30:00Z',
      status: 'confirmed',
      location: 'Main Street Park',
      type: 'Theft'
    },
    {
      id: 'rep2',
      title: 'Vandalism at city center',
      date: '2025-04-05T09:15:00Z',
      status: 'confirmed',
      location: 'City Center Plaza',
      type: 'Vandalism'
    },
    {
      id: 'rep3',
      title: 'Noise complaint',
      date: '2025-04-01T22:45:00Z',
      status: 'rejected',
      location: 'Apartment 4B, River View',
      type: 'Noise Complaint',
      rejection_reason: 'Not within police jurisdiction, directed to building management'
    }
  ],
  tips: [
    {
      id: 'tip1',
      subject: 'Information about recent robbery',
      date: '2025-04-12T16:20:00Z',
      status: 'confirmed',
      action_taken: 'Information forwarded to detective unit'
    },
    {
      id: 'tip2',
      subject: 'Suspected drug activity',
      date: '2025-04-08T10:30:00Z',
      status: 'pending',
      action_taken: null
    }
  ],
  sos_alerts: [
    {
      id: 'sos1',
      date: '2025-04-15T19:45:00Z',
      location: 'Oak Street Shopping Center',
      resolved: true,
      resolution_details: 'Officers responded within 5 minutes, situation de-escalated'
    }
  ]
};

const UserItem = ({ user, onClick }: { user: any, onClick: () => void }) => {
  return (
    <div 
      className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors" 
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatar_url} alt={user.name} />
          <AvatarFallback className="bg-shield-blue text-white">{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="text-right">
          <Badge variant={user.kyc_status === 'Verified' ? 'success' : user.kyc_status === 'Rejected' ? 'destructive' : 'outline'}>
            {user.kyc_status}
          </Badge>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(user.last_activity).toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-col items-center bg-gray-50 px-3 py-1 rounded-lg">
          <span className="text-lg font-semibold">{user.reports.total}</span>
          <span className="text-xs text-gray-500">Reports</span>
        </div>
      </div>
    </div>
  );
};

const UserProfileDetail = ({ user, onBack }: { user: any, onBack: () => void }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4">
            <path d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15795L8.13508 3.15795C8.32394 2.95649 8.64036 2.94628 8.84182 3.13514Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
          </svg>
          Back to users
        </Button>
        <div className="flex space-x-2">
          <Badge variant={user.kyc_status === 'Verified' ? 'outline' : 'secondary'} className="px-3 py-1">
            {user.kyc_status === 'Verified' ? (
              <Check className="mr-1 h-3 w-3 text-green-500" />
            ) : (
              <AlertTriangle className="mr-1 h-3 w-3 text-amber-500" />
            )}
            {user.kyc_status}
          </Badge>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-none">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatar_url} alt={user.name} />
            <AvatarFallback className="text-2xl bg-shield-blue text-white">{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg flex flex-col items-center">
              <div className="text-3xl font-bold text-shield-blue">{user.reports.length}</div>
              <div className="text-sm text-gray-600">Total Reports</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg flex flex-col items-center">
              <div className="text-3xl font-bold text-green-600">
                {user.reports.filter(r => r.status === 'confirmed').length}
              </div>
              <div className="text-sm text-gray-600">Confirmed</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg flex flex-col items-center">
              <div className="text-3xl font-bold text-red-600">
                {user.reports.filter(r => r.status === 'rejected').length}
              </div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Contact</h3>
              <p className="font-medium">{user.phone}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Address</h3>
              <p className="font-medium">{user.address}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500">Joined</h3>
              <p className="font-medium">{formatDate(user.joined_date)}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500">KYC Verified On</h3>
              <p className="font-medium">
                {user.kyc_status === 'Verified' ? formatDate(user.kyc_date) : 'Not verified'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="tips">Tips</TabsTrigger>
          <TabsTrigger value="sos">SOS Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reports" className="border rounded-lg p-4 mt-4">
          <h3 className="text-lg font-semibold mb-4">Report History</h3>
          {user.reports.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.title}</TableCell>
                    <TableCell>{formatDate(report.date)}</TableCell>
                    <TableCell>{report.location}</TableCell>
                    <TableCell>
                      <Badge variant={report.status === 'confirmed' ? 'success' : report.status === 'rejected' ? 'destructive' : 'outline'}>
                        {report.status === 'confirmed' ? (
                          <Check className="mr-1 h-3 w-3" />
                        ) : report.status === 'rejected' ? (
                          <X className="mr-1 h-3 w-3" />
                        ) : null}
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" /> 
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">No reports found</div>
          )}
        </TabsContent>
        
        <TabsContent value="tips" className="border rounded-lg p-4 mt-4">
          <h3 className="text-lg font-semibold mb-4">Tips Submitted</h3>
          {user.tips.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action Taken</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.tips.map((tip) => (
                  <TableRow key={tip.id}>
                    <TableCell className="font-medium">{tip.subject}</TableCell>
                    <TableCell>{formatDate(tip.date)}</TableCell>
                    <TableCell>
                      <Badge variant={tip.status === 'confirmed' ? 'success' : tip.status === 'rejected' ? 'destructive' : 'outline'}>
                        {tip.status.charAt(0).toUpperCase() + tip.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{tip.action_taken || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">No tips found</div>
          )}
        </TabsContent>
        
        <TabsContent value="sos" className="border rounded-lg p-4 mt-4">
          <h3 className="text-lg font-semibold mb-4">SOS Alert History</h3>
          {user.sos_alerts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Resolution</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user.sos_alerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>{formatDate(alert.date)}</TableCell>
                    <TableCell>{alert.location}</TableCell>
                    <TableCell>
                      <Badge variant={alert.resolved ? 'success' : 'destructive'}>
                        {alert.resolved ? 'Resolved' : 'Unresolved'}
                      </Badge>
                    </TableCell>
                    <TableCell>{alert.resolution_details || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">No SOS alerts found</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const OfficerUserProfiles = () => {
  const navigate = useNavigate();
  const { officer, isAuthenticated, isLoading } = useOfficerAuth();
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/officer-login');
    }
  }, [isLoading, isAuthenticated, navigate]);
  
  const handleUserClick = (userId: string) => {
    // In a real app, you'd fetch user details from your API
    setSelectedUser(mockUserDetails);
  };
  
  const handleBackClick = () => {
    setSelectedUser(null);
  };
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-shield-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <OfficerNavbar />
      
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center mb-6">
          <User className="h-6 w-6 text-shield-blue mr-2" />
          <h1 className="text-2xl font-bold">User Management</h1>
        </div>
        
        {!selectedUser ? (
          <>
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Registered Users</h2>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search users..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="divide-y">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <UserItem 
                      key={user.id} 
                      user={user} 
                      onClick={() => handleUserClick(user.id)} 
                    />
                  ))
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No users found matching your search
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Total Users</CardTitle>
                  <CardDescription>Registered on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{users.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Verified Users</CardTitle>
                  <CardDescription>Completed KYC verification</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {users.filter(u => u.kyc_status === 'Verified').length}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Active Reports</CardTitle>
                  <CardDescription>From all registered users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {users.reduce((total, user) => total + user.reports.total, 0)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <UserProfileDetail user={selectedUser} onBack={handleBackClick} />
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficerUserProfiles;
