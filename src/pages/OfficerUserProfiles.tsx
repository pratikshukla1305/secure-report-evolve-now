
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OfficerNavbar from '@/components/officer/OfficerNavbar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Search, Filter, User, FileCheck, FileX, AlertCircle, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Mock data for demonstration
const userProfiles = [
  {
    id: 1,
    full_name: 'John Smith',
    email: 'john.smith@example.com',
    kyc_verified: true,
    reports_submitted: 8,
    reports_approved: 6,
    reports_rejected: 2,
    alerts_submitted: 3,
    alerts_confirmed: 2,
    profile_image: '',
    last_active: '2025-04-16T10:30:00',
  },
  {
    id: 2,
    full_name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    kyc_verified: true,
    reports_submitted: 12,
    reports_approved: 10,
    reports_rejected: 2,
    alerts_submitted: 5,
    alerts_confirmed: 4,
    profile_image: '',
    last_active: '2025-04-17T08:15:00',
  },
  {
    id: 3,
    full_name: 'Michael Rodriguez',
    email: 'mrodriguez@example.com',
    kyc_verified: false,
    reports_submitted: 3,
    reports_approved: 1,
    reports_rejected: 2,
    alerts_submitted: 1,
    alerts_confirmed: 0,
    profile_image: '',
    last_active: '2025-04-16T15:45:00',
  },
  {
    id: 4,
    full_name: 'Emily Chen',
    email: 'emily.chen@example.com',
    kyc_verified: true,
    reports_submitted: 5,
    reports_approved: 5,
    reports_rejected: 0,
    alerts_submitted: 2,
    alerts_confirmed: 2,
    profile_image: '',
    last_active: '2025-04-17T11:20:00',
  },
];

const OfficerUserProfiles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const navigate = useNavigate();

  const selectedUser = userProfiles.find(user => user.id === selectedUserId);

  // Filter users based on search term
  const filteredUsers = userProfiles.filter(user => 
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <OfficerNavbar />
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Profiles</h1>
            <p className="text-gray-600">View and manage user accounts, reports, and verification status</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User list sidebar */}
          <Card className="lg:col-span-1 shadow-sm border-gray-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-2">
                <Search className="h-4 w-4 text-gray-500" />
                <Input 
                  placeholder="Search users..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium">
                  {filteredUsers.length} Users
                </CardTitle>
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 max-h-[calc(100vh-300px)] overflow-y-auto">
              <div className="divide-y divide-gray-100">
                {filteredUsers.map(user => (
                  <div 
                    key={user.id} 
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${selectedUserId === user.id ? 'bg-gray-50' : ''}`}
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 border">
                        <AvatarFallback className="bg-stripe-blue-dark text-white">
                          {user.full_name.split(' ').map(name => name[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">{user.full_name}</p>
                          {user.kyc_verified ? (
                            <Badge variant="success" className="ml-2">Verified</Badge>
                          ) : (
                            <Badge variant="warning" className="ml-2">Pending</Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <div className="flex items-center mt-1 gap-3">
                          <span className="flex items-center text-xs text-gray-500">
                            <FileCheck className="h-3 w-3 mr-1 text-green-500" />
                            {user.reports_approved}
                          </span>
                          <span className="flex items-center text-xs text-gray-500">
                            <FileX className="h-3 w-3 mr-1 text-red-500" />
                            {user.reports_rejected}
                          </span>
                          <span className="flex items-center text-xs text-gray-500">
                            <AlertCircle className="h-3 w-3 mr-1 text-amber-500" />
                            {user.alerts_submitted}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* User detail panel */}
          {selectedUser ? (
            <Card className="lg:col-span-2 shadow-sm border-gray-200">
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 border">
                    <AvatarFallback className="bg-stripe-blue-dark text-white text-xl">
                      {selectedUser.full_name.split(' ').map(name => name[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{selectedUser.full_name}</CardTitle>
                    <CardDescription>{selectedUser.email}</CardDescription>
                    <div className="flex gap-2 mt-2">
                      {selectedUser.kyc_verified ? (
                        <Badge variant="success">KYC Verified</Badge>
                      ) : (
                        <Badge variant="warning">KYC Pending</Badge>
                      )}
                      <Badge variant="secondary">
                        Last active: {new Date(selectedUser.last_active).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList className="mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                    <TabsTrigger value="alerts">Alerts</TabsTrigger>
                    <TabsTrigger value="verification">Verification</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-gray-500">Total Reports</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{selectedUser.reports_submitted}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {selectedUser.reports_approved} approved · {selectedUser.reports_rejected} rejected
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-gray-500">Alerts Submitted</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{selectedUser.alerts_submitted}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {selectedUser.alerts_confirmed} confirmed
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-gray-500">KYC Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {selectedUser.kyc_verified ? 'Verified' : 'Pending'}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {selectedUser.kyc_verified ? 'Verified user account' : 'Verification in progress'}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex gap-3">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <FileCheck className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Submitted a new report</p>
                              <p className="text-xs text-gray-500">Today at 10:30 AM</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-3">
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                              <Shield className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Completed KYC verification</p>
                              <p className="text-xs text-gray-500">Yesterday at 2:15 PM</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-3">
                            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                              <AlertCircle className="h-4 w-4 text-amber-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Submitted an alert</p>
                              <p className="text-xs text-gray-500">Apr 15, 2025 at 9:20 AM</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="reports">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-base font-medium">Reports History</h3>
                        <Badge variant="outline">{selectedUser.reports_submitted} Total</Badge>
                      </div>
                      
                      <div className="border rounded-md divide-y">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="p-4 hover:bg-gray-50">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">Report #{selectedUser.id * 100 + i + 1}</span>
                              {i === 0 ? (
                                <Badge variant="success">Approved</Badge>
                              ) : i === 1 ? (
                                <Badge variant="destructive">Rejected</Badge>
                              ) : (
                                <Badge variant="info">Under Review</Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mb-2">Submitted on April {15 - i}, 2025</p>
                            <p className="text-sm">
                              {i === 0 ? 'Theft incident reported with video evidence' : 
                               i === 1 ? 'Suspicious activity near downtown area' :
                               'Traffic violation on Main Street'}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Button size="sm" variant="outline">View Details</Button>
                              {i === 2 && <Button size="sm">Review</Button>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="alerts">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-base font-medium">Alert History</h3>
                        <Badge variant="outline">{selectedUser.alerts_submitted} Total</Badge>
                      </div>
                      
                      <div className="border rounded-md divide-y">
                        {[...Array(Math.min(2, selectedUser.alerts_submitted))].map((_, i) => (
                          <div key={i} className="p-4 hover:bg-gray-50">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">Alert #{selectedUser.id * 10 + i + 1}</span>
                              {i === 0 ? (
                                <Badge variant="success">Confirmed</Badge>
                              ) : (
                                <Badge variant="warning">Pending</Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mb-2">Submitted on April {16 - i}, 2025</p>
                            <p className="text-sm">
                              {i === 0 ? 'Emergency SOS call from downtown location' : 
                               'Reported suspicious person in residential area'}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Button size="sm" variant="outline">View Details</Button>
                              {i === 1 && <Button size="sm">Review</Button>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="verification">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-base font-medium">KYC Verification</h3>
                        {selectedUser.kyc_verified ? (
                          <Badge variant="success">Verified</Badge>
                        ) : (
                          <Badge variant="warning">Pending</Badge>
                        )}
                      </div>
                      
                      <Card>
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Full Name</p>
                                <p className="text-sm text-gray-600">{selectedUser.full_name}</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Email</p>
                                <p className="text-sm text-gray-600">{selectedUser.email}</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm font-medium">ID Type</p>
                                <p className="text-sm text-gray-600">National ID Card</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Phone Number</p>
                                <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                              </div>
                            </div>
                            
                            <div className="pt-2">
                              <p className="text-sm font-medium mb-2">ID Documents</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="border rounded-md p-4">
                                  <p className="text-xs text-gray-500 mb-2">Front of ID</p>
                                  <div className="bg-gray-100 h-32 rounded-md flex items-center justify-center">
                                    <User className="h-8 w-8 text-gray-400" />
                                  </div>
                                </div>
                                <div className="border rounded-md p-4">
                                  <p className="text-xs text-gray-500 mb-2">Back of ID</p>
                                  <div className="bg-gray-100 h-32 rounded-md flex items-center justify-center">
                                    <User className="h-8 w-8 text-gray-400" />
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {!selectedUser.kyc_verified && (
                              <div className="pt-4 flex gap-2">
                                <Button>Verify User</Button>
                                <Button variant="outline">Request Additional Info</Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="lg:col-span-2 shadow-sm border-gray-200">
              <div className="flex flex-col items-center justify-center h-full py-12">
                <User className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Select a user</h3>
                <p className="text-gray-500 text-center max-w-md mt-2">
                  Choose a user from the list to view their profile details, reports, and verification status.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfficerUserProfiles;
