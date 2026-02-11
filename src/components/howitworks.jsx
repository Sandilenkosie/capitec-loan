
import { Button } from "@/components/ui/button";
import { User, CreditCard, FileText, CheckCircle } from 'lucide-react';

const simulatorSteps = [
  {
    number: 1,
    title: 'Enter Basic Details',
    description: 'Provide a few details such as your age, employment status and monthly income so we can personalise the result.',
    icon: <User className="w-5 h-5" />,
  },
  {
    number: 2,
    title: 'Select Loan Amount & Term',
    description: 'Choose how much you need and the repayment term to see estimated monthly repayments.',
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    number: 3,
    title: 'Review Required Documents',
    description: "We'll show which documents you'll need (ID, proof of income, bank statements) to complete an application.",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    number: 4,
    title: 'Instant Eligibility Feedback',
    description: 'Get an immediate indication of likely eligibility and suggestions to improve your outcome.',
    icon: <CheckCircle className="w-5 h-5" />,
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-[#ffffff] via-gray-300 to-gray-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Capitec Bank Loan Eligibility Simulator
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Use the simulator to quickly check your likely loan eligibility, view estimated repayments, and learn what documents are required to complete a Capitec loan application.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {simulatorSteps.map((step, index) => (
            <div 
              key={index}
              className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 animate-on-scroll"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <span className="absolute -top-4 -left-4 bg-capitec-blue border rounded-md border-capitec-blue/30 text-white font-bold text-xl px-3 py-1">
                {step.number}
              </span>
              <div className="bg-capitec-blue/20 rounded-xl w-12 h-12 flex items-center justify-center mb-6 text-capitec">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-capitec-black">{step.title}</h3>
              <p className="text-gray-700">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
