
import { Activity, Lock, Zap, Compass, LineChart, Shield } from 'lucide-react';

const loanFeatures = [
  {
    title: 'Quick Eligibility Check',
    description: 'Answer a few questions and get an instant indication of your loan eligibility with no impact to your credit score.',
    icon: <Activity className="w-5 h-5" />,
  },
  {
    title: 'Estimated Monthly Repayments',
    description: 'See an estimated repayment schedule based on loan amount and term to plan your budget effectively.',
    icon: <LineChart className="w-5 h-5" />,
  },
  {
    title: 'Required Documents',
    description: 'Know exactly which documents you need (ID, proof of income, bank statements) to speed up the application.',
    icon: <Shield className="w-5 h-5" />,
  },
  {
    title: 'Secure & Confidential',
    description: 'Your data is handled securely and privately—results are only visible to you.',
    icon: <Lock className="w-5 h-5" />,
  },
  {
    title: 'Personalised Guidance',
    description: 'Get tailored suggestions for loan amounts and terms based on your financial profile.',
    icon: <Compass className="w-5 h-5" />,
  },
  {
    title: 'Instant Results',
    description: 'Receive immediate feedback so you can move forward quickly with a confident decision.',
    icon: <Zap className="w-5 h-5" />,
  },
];

const Features = () => {
  return (
    <section id="loan-simulator" className="py-24 bg-gradient-to-b from-capitec-blue-light via-gray-100 to-[#ffffff]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Capitec Bank Loan Eligibility Simulator
          </h2>
          <p className="text-white max-w-2xl mx-auto">
            Quickly check your likely loan eligibility, view estimated repayments, and learn what documents you'll need to apply.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {loanFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-capitec-blue/5 group animate-on-scroll"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="bg-capitec-blue-light/20 rounded-lg w-12 h-12 flex items-center justify-center mb-5 text-capitec group-hover:bg-capitec-blue/30 transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
