import React, { useEffect } from 'react';
import { FaArrowLeft as ArrowLeft } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const TermsOfService: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const sections = [
    { id: 'agreement', title: '1. Agreement to Terms' },
    { id: 'use-conduct', title: '2. User Responsibilities & Conduct' },
    { id: 'intellectual-property', title: '3. Intellectual Property' },
    { id: 'purchases-pricing', title: '4. Purchases & Pricing' },
    { id: 'limitation-liability', title: '5. Limitation of Liability' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-sans pb-16 text-left">
      {/* Hero Header Banner */}
      <div className="bg-[#10324B] text-white py-16 md:py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#83D318]/15 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#005461]/25 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <Link 
            to="/" 
            className="inline-flex items-center text-[#83D318] hover:text-white transition-colors gap-2 text-sm font-bold mb-6"
          >
            <ArrowLeft size={16} /> Back to Play4Impact Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-4 tracking-tight leading-tight uppercase">
            Terms of Service
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto font-medium">
            Please read these terms carefully before using our platform and purchasing event passes.
          </p>
          <div className="mt-6 inline-block bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold text-[#83D318] tracking-wide uppercase">
            Last Updated: August 2026
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl mt-12 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Table of Contents */}
          <aside className="hidden lg:block lg:col-span-1 text-left">
            <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider text-left">
                Table of Contents
              </h3>
              <nav className="flex flex-col space-y-1 text-left">
                {sections.map(section => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block text-sm text-slate-800 hover:text-[#005461] font-bold py-2 px-3 rounded-lg hover:bg-slate-50 transition-all text-left"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Legal Text */}
          <main className="col-span-1 lg:col-span-3 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 text-left">
            <div className="max-w-none text-slate-800 leading-relaxed space-y-10 font-medium text-left">
              
              <div className="text-left">
                <p className="text-lg text-slate-900 font-bold text-left">
                  Welcome to PLAY4IMPACT. By accessing or using our website, services, or purchasing gate entry passes, you agree to comply with and be bound by the following Terms of Service.
                </p>
              </div>

              {/* Section 1 */}
              <section id="agreement" className="scroll-mt-24 pt-4 border-t border-gray-100 text-left">
                <div className="mb-4 text-left">
                  <h2 className="text-2xl font-bold font-poppins text-slate-900 text-left uppercase">
                    1. Agreement to Terms
                  </h2>
                </div>
                <div className="space-y-4 text-left">
                  <p className="text-slate-800 font-medium text-left">
                    By accessing our site or purchasing passes, you represent that you are at least the age of majority in your state or province of residence.
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section id="use-conduct" className="scroll-mt-24 pt-4 border-t border-gray-100 text-left">
                <div className="mb-4 text-left">
                  <h2 className="text-2xl font-bold font-poppins text-slate-900 text-left uppercase">
                    2. User Responsibilities & Conduct
                  </h2>
                </div>
                <div className="space-y-4 text-left">
                  <p className="text-slate-800 font-medium text-left">
                    As a condition of your use of this website and attendance at Play4Impact events, you warrant and agree that you will not use the website for any purpose that is unlawful or prohibited by these terms.
                  </p>
                </div>
              </section>

              {/* Section 3 */}
              <section id="intellectual-property" className="scroll-mt-24 pt-4 border-t border-gray-100 text-left">
                <div className="mb-4 text-left">
                  <h2 className="text-2xl font-bold font-poppins text-slate-900 text-left uppercase">
                    3. Intellectual Property
                  </h2>
                </div>
                <div className="space-y-4 text-left">
                  <p className="text-slate-800 font-medium text-left">
                    All content, assets, logos, design files, trademarks, graphics, code, and interfaces on this website are the intellectual property of Play4Impact and Techies4Impact.
                  </p>
                </div>
              </section>

              {/* Section 4 */}
              <section id="purchases-pricing" className="scroll-mt-24 pt-4 border-t border-gray-100 text-left">
                <div className="mb-4 text-left">
                  <h2 className="text-2xl font-bold font-poppins text-slate-900 text-left uppercase">
                    4. Purchases & Pricing
                  </h2>
                </div>
                <div className="space-y-4 text-left">
                  <p className="text-slate-800 font-medium text-left">
                    Prices for event pass tiers are subject to change without notice. All transactions are securely processed through third-party billing providers like Paystack.
                  </p>
                </div>
              </section>

              {/* Section 5 */}
              <section id="limitation-liability" className="scroll-mt-24 pt-4 border-t border-gray-100 text-left">
                <div className="mb-4 text-left">
                  <h2 className="text-2xl font-bold font-poppins text-slate-900 text-left uppercase">
                    5. Limitation of Liability
                  </h2>
                </div>
                <div className="space-y-4 text-left">
                  <p className="text-slate-800 font-medium text-left">
                    In no case shall Play4Impact or Techies4Impact be liable for any injury, loss, claim, or any direct, indirect, or consequential damages.
                  </p>
                </div>
              </section>

              {/* Contact Block */}
              <div className="mt-16 bg-[#F1F9E5] rounded-2xl border border-[#83D318]/30 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
                <div className="text-left">
                  <h4 className="text-lg font-bold text-slate-900 font-poppins mb-1 text-left uppercase">Have questions about our Terms?</h4>
                  <p className="text-sm text-slate-700 font-semibold text-left">Send us an email at techies4impact@gmail.com for clarification or legal assistance.</p>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
