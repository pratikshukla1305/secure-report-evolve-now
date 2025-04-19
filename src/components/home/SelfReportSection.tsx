
import React from 'react';
import { UserCircle, FileText, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const SelfReportSection = () => {
  return (
    <div className="relative animate-fade-up glass-card p-6" style={{ animationDelay: '0.2s' }}>
      <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-shield-blue flex items-center justify-center text-white font-bold text-lg shadow-lg">3</div>
      <div className="rounded-full w-12 h-12 bg-shield-blue/10 flex items-center justify-center mb-4">
        <UserCircle className="h-6 w-6 text-shield-blue" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Self Reporting</h3>
      <p className="text-gray-600 mb-4">
        Don't have photos or videos? You can still submit a detailed text description of what happened.
      </p>
      <ul className="space-y-2 mb-6">
        <li className="flex items-start">
          <div className="mr-2 mt-1 text-shield-blue">•</div>
          <span className="text-sm text-gray-600">Describe the incident in detail</span>
        </li>
        <li className="flex items-start">
          <div className="mr-2 mt-1 text-shield-blue">•</div>
          <span className="text-sm text-gray-600">Option to remain anonymous</span>
        </li>
        <li className="flex items-start">
          <div className="mr-2 mt-1 text-shield-blue">•</div>
          <span className="text-sm text-gray-600">Request confidential handling</span>
        </li>
      </ul>
      <Link to="/how-it-works#self-report">
        <Button className="w-full bg-shield-blue hover:bg-shield-blue/90">
          <FileText className="w-4 h-4 mr-2" />
          Submit Self Report
        </Button>
      </Link>
    </div>
  );
};

export default SelfReportSection;
