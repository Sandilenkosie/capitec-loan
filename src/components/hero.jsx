
import { ArrowRight, ArrowUpRight, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { openLoanDialog } from "@/shared/loanDialog";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-gradient-hero hero-glow">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
  <div className="absolute top-1/4 left-10 w-72 h-72 bg-capitec/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
  <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-capitec-blue-light/40 rounded-full filter blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 animate-fade-in-left">
            <div className="inline-flex items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 mb-6">
              <span className="text-xs font-medium text-capitec-black mr-2">LOAN TOOLS</span>
              <span className="text-xs text-gray-300">Loan Eligibility Simulator</span>
              <ChevronRight className="h-4 w-4 text-gray-400 ml-1" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Loan Eligibility Simulator
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-lg">
              Quickly estimate if you qualify for a Capitec personal loan and see an approximate loan amount and repayment plan. No login required — just enter a few details.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="btn-capitec px-8 py-6"
                onClick={openLoanDialog}
              >
                Start Simulation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="btn-capitec-outline">
                How it works
                <ArrowUpRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="mt-8 flex items-center space-x-6">
              <div>
                <p className="text-2xl font-bold text-white">1.2M</p>
                <p className="text-sm text-gray-700">Customers Notified</p>
              </div>
              <div className="h-12 w-px bg-gray-700"></div>
              <div>
                <p className="text-2xl font-bold text-white">+24%</p>
                <p className="text-sm text-gray-700">Digital Responses</p>
              </div>
              <div className="h-12 w-px bg-gray-700"></div>
              <div>
                <p className="text-2xl font-bold text-white">From 9.5%</p>
                <p className="text-sm text-gray-700">Avg. Interest Rate</p>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 mt-12 lg:mt-0 animate-fade-in-right">
            <div className="relative max-w-md mx-auto animate-float">
              <img
                src={`${import.meta.env.BASE_URL}hero_image.png`}
                alt="Capitec customer support and loans"
                className="rounded-xl shadow-2xl border border-white/10"
              />
              <div className="absolute -right-6 -bottom-6 bg-capitec-red/20 backdrop-blur-md rounded-lg p-4 border border-capitec-red/30 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gray-500/20 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-white">Support Response</p>
                    <p className="text-lg font-bold text-gray-500">Avg. 2h</p>
                  </div>
                </div>
              </div>
              <div className="absolute -left-6 -top-6 bg-capitec-blue-light/40 backdrop-blur-md rounded-lg p-4 border border-capitec-blue/30 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-capitec/20 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-capitec" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2zM12 14v6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-white">Loan Options</p>
                    <p className="text-lg font-bold text-gray-500">Flexible Repayments</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
