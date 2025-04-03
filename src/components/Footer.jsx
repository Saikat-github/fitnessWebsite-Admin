const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-10 px-5 md:px-20 text-xs sm:text-sm">
      <div className="max-w-6xl mx-auto text-center space-y-4">
        {/* Support Section */}
        <div className="text-xs sm:text-sm space-y-2">
          <h3 className="text-lg text-white mb-3">Support</h3>
          <p className="text-slate-400">Need help? Reach out to us.</p>
          <p className="mt-2">📧 saikatservices@gmail.com</p>
          <p>📞 +91 9635473546</p>
          <p>📍 Burdwan, West Bengal, India</p>
        </div>

        {/* Links Section */}
        <a 
        href="https://www.zerodiet.in/" 
        className="text-sky-600"
        target="_blank"
        rel="noopener noreferrer"
        >
          Go to the main website
        </a>
      </div>

      <div className="text-center text-slate-300 mt-10 border-t border-slate-700 pt-5">
        &copy; {new Date().getFullYear()} Built by&nbsp; 
        <a
          href="https://portfolio-website-nu-blue.vercel.app/"
          className="text-sky-600"
          target="_blank"
          rel="noopener noreferrer"
        >
          Saikat Saha
        </a>

      </div>
    </footer>
  );
};

export default Footer;
