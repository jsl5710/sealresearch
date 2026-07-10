import React from 'react';
import lab from '../data/lab.json';

const Footer = () => {
  return (
    <footer className="relative bg-ink pt-20 pb-10 px-6 border-t border-signal/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-3xl font-serif font-semibold text-paper mb-4">
            {lab.short}<span className="text-signal">.</span>
          </h2>
          <p className="text-mist max-w-md mb-6 leading-relaxed">
            {lab.mission}
          </p>
          <div className="flex items-center gap-3">
            {lab.social.twitter && (
              <a href={lab.social.twitter} className="w-10 h-10 rounded-full border border-signal/30 flex items-center justify-center text-signal hover:bg-signal/10 transition-all" aria-label="Twitter">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            )}
            {lab.social.github && (
              <a href={lab.social.github} className="w-10 h-10 rounded-full border border-signal/30 flex items-center justify-center text-signal hover:bg-signal/10 transition-all" aria-label="GitHub">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
            )}
            <a href={`mailto:${lab.email}`} className="w-10 h-10 rounded-full border border-signal/30 flex items-center justify-center text-signal hover:bg-signal/10 transition-all" aria-label="Email">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-sm mono uppercase text-signal mb-6 tracking-widest">Explore</h3>
          <ul className="space-y-3 text-sm text-mist">
            <li><a href="#mission" className="hover:text-signal transition-colors">Mission</a></li>
            <li><a href="#research" className="hover:text-signal transition-colors">Research</a></li>
            <li><a href="#people" className="hover:text-signal transition-colors">People</a></li>
            <li><a href="#publications" className="hover:text-signal transition-colors">Publications</a></li>
            <li><a href="#join" className="hover:text-signal transition-colors">Join Us</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm mono uppercase text-signal mb-6 tracking-widest">Find Us</h3>
          <ul className="space-y-3 text-sm text-mist">
            <li>{lab.department}</li>
            <li><a href={lab.institutionUrl} className="hover:text-signal transition-colors">{lab.institution}</a></li>
            <li>{lab.location}</li>
            <li><a href={`mailto:${lab.email}`} className="text-signal font-medium">{lab.email}</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-signal/5 text-center text-xs mono uppercase tracking-widest text-mist/50">
        &copy; {new Date().getFullYear()} {lab.name}. Built with care in Boulder, CO.
      </div>
    </footer>
  );
};

export default Footer;
