
import { useEffect } from 'react';
import Layout from '@/components/layout';
import Hero from '@/components/hero';
import ScrollToTop from '@/components/scrollUp';
import useScrollAnimation from '@/utils/useScrollAnimation';

const Index = () => {
  // Initialize scroll animations
  useScrollAnimation();

  // Set page title
  useEffect(() => {
    document.title = "CryptoFlow | Modern Cryptocurrency Trading";
  }, []);
  
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Layout />
      <Hero />
      <ScrollToTop />
    </div>
  );
};

export default Index;
