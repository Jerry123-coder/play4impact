import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const RefundsPolicy: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-sans pb-16 text-left">
      <div className="bg-[#10324B] text-white py-16 md:py-24 px-6 text-center relative overflow-hidden">
        <div className="container mx-auto max-w-4xl relative z-10">
          <Link 
            to="/" 
            className="inline-flex items-center text-[#83D318] hover:text-white transition-colors gap-2 text-sm font-bold mb-6"
          >
            <ArrowLeft size={16} /> Back to Play4Impact Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold font-nexa mb-4 tracking-tight leading-tight uppercase">
            Refunds & Cancellation Policy
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto font-medium">
            Guidelines regarding ticket pass cancellations, transfers, and refunds.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl mt-12 text-left">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 text-left space-y-6">
          <h2 className="text-2xl font-bold font-nexa uppercase text-slate-900">Pass Refund Guidelines</h2>
          <p className="text-slate-700 font-medium">
            All ticket pass sales for Play4Impact are final. Passes are non-refundable once issued, except in the event of complete cancellation of the event by organizers.
          </p>
          <p className="text-slate-700 font-medium">
            Ticket passes may be transferred to another individual by contacting our support team at least 48 hours prior to the event date.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundsPolicy;
