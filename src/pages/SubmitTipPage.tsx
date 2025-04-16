
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TipForm from '@/components/helpus/TipForm';
import { useAuth } from '@/contexts/AuthContext';
import { getUserVerificationStatus } from '@/data/kycVerificationsData';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const SubmitTipPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showKycDialog, setShowKycDialog] = useState(false);
  
  // Check if user is KYC verified
  React.useEffect(() => {
    if (user) {
      const kycStatus = getUserVerificationStatus(user.id);
      if (kycStatus !== 'approved') {
        setShowKycDialog(true);
      }
    }
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-6 sm:p-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Submit a Tip About a Wanted Individual
            </h1>
            <p className="text-gray-600 mb-8">
              Your information will be securely transmitted to law enforcement. You may choose to remain anonymous.
            </p>
            
            <TipForm />
          </div>
        </div>
      </main>
      
      <Footer />

      <AlertDialog open={showKycDialog} onOpenChange={setShowKycDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Verification Required</AlertDialogTitle>
            <AlertDialogDescription>
              You need to complete e-KYC verification before submitting tips. 
              Would you like to complete your verification now?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => navigate('/home')}>Go Back</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate('/e-kyc')}>
              Complete Verification
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SubmitTipPage;
