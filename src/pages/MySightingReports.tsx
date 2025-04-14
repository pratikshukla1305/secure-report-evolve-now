
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import CriminalSightingsTracker from '@/components/user/CriminalSightingsTracker';
import { Shield } from 'lucide-react';

const MySightingReports = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoading && !user) {
      navigate('/signin');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-lightgray flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Shield className="h-12 w-12 text-deepblue animate-pulse" />
          <p className="mt-4 text-darkslate">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-lightgray">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm rounded-lg overflow-hidden p-6 md:p-8">
            <CriminalSightingsTracker />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MySightingReports;
