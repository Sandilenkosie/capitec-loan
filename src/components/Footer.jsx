
import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-8">
          <div className="lg:col-span-2">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="CapitecLogo" className="md:h-24 w-auto" />

            <p className="text-gray-500 mb-4 max-w-xs">
              Capitec Bank Loan Eligibility Simulator — quickly estimate your likely loan eligibility, view
              estimated monthly repayments, and see which documents you'll need to apply. Results are
              confidential and intended for guidance only.
            </p>
            <a
              href="#loan-simulator"
              className="btn-capitec text-sm inline-block"
            >
              Try the Loan Simulator
            </a>
            <div className="flex space-x-4 mt-4">
              <a href="#!" className="text-gray-500 hover:text-capitec-blue transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#!" className="text-gray-500 hover:text-capitec-blue transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#!" className="text-gray-500 hover:text-capitec-blue transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#!" className="text-gray-500 hover:text-capitec-blue transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#!" className="text-gray-500 hover:text-capitec-blue transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Products</h3>
            <ul className="space-y-2">
              <li><a href="#!" className="text-gray-500 hover:text-capitec-blue transition-colors">Exchange</a></li>
              <li><a href="#!" className="text-gray-500 hover:text-capitec-blue transition-colors">Wallet</a></li>
              <li><a href="#!" className="text-gray-500 hover:text-capitec-blue transition-colors">API</a></li>
              <li><a href="#!" className="text-gray-500 hover:text-capitec-blue transition-colors">Institutional</a></li>
              <li><a href="#!" className="text-gray-500 hover:text-capitec-blue transition-colors">DeFi Platform</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#!" className="text-gray-500 hover:text-capitec-blue transition-colors">Blog</a></li>
              <li><a href="#!" className="text-gray-500 hover:text-capitec-blue transition-colors">Tutorials</a></li>
              <li><a href="#!" className="text-gray-500 hover:text-capitec-blue transition-colors">Market Data</a></li>
              <li><a href="#!" className="text-gray-500 hover:text-capitec-blue transition-colors">Documentation</a></li>
              <li><a href="#!" className="text-gray-500 hover:text-capitec-blue transition-colors">Help Center</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#!" className="text-gray-500 hover:text-capitec-blue transition-colors">About</a></li>
              <li><a href="#!" className="text-gray-500 hover:text-capitec-blue transition-colors">Careers</a></li>
              <li><a href="#!" className="text-gray-500 hover:text-capitec-blue transition-colors">Press</a></li>
              <li><a href="#!" className="text-gray-500 hover:text-capitec-blue transition-colors">Legal & Privacy</a></li>
              <li><a href="#!" className="text-gray-500 hover:text-capitec-blue transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {currentYear} Capitec bank. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#!" className="text-gray-500 hover:text-capitec-blue text-sm transition-colors">Terms of Service</a>
              <a href="#!" className="text-gray-500 hover:text-capitec-blue text-sm transition-colors">Privacy Policy</a>
              <a href="#!" className="text-gray-500 hover:text-capitec-blue text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
