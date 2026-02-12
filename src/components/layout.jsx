import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { openLoanDialog } from '@/shared/loanDialog';
import { Menu, X } from 'lucide-react';

const Layout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleApplyNow = (event) => {
    openLoanDialog(event);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-capitec-blue/80 backdrop-blur-md py-2 shadow-lg' : 'py-4'}`}>
      <div className="container mx-auto px-2 flex justify-between items-center">
        <div className="flex items-center">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="CapitecLogo" className="h-16 md:h-24 lg:h-32 w-auto mr-2" />
        </div>

        <div className="hidden lg:flex items-center space-x-4">
          <Button className="btn-capitec w-full" onClick={handleApplyNow}>
            Apply Now
          </Button>
        </div>

        {/* Mobile menu button */}
        <button className="lg:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-capitec-blue-light/50 backdrop-blur-lg absolute top-full left-0 w-full py-4 shadow-lg">
          <div className="container mx-auto px-4">
            <ul className="flex flex-col space-y-4">
              <li className="pt-4 flex flex-col space-y-3">
                <Button className="btn-capitec w-full" onClick={handleApplyNow}>
                  Apply Now
                </Button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Layout;
