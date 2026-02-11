
import { useEffect } from 'react';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import Loans from '@/components/Loans';
import HowItWorks from '@/components/HowItWorks';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import useScrollAnimation from '@/server/utils/useScrollAnimation';

const Index = () => {
  // Initialize scroll animations
  useScrollAnimation();

  // Set page title
  useEffect(() => {
    document.title = "Capitec Bank | Modern Banking Solutions";
  }, []);
  
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Layout />
      <Hero />
      <Loans />
      <HowItWorks />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
