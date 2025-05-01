import styles from './LandingPage.module.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileCircleCheck,
  faRobot,
  faMagnifyingGlassChart,
  faPenToSquare,
  faChartLine,
  faFileExport,
  faUserTie,
} from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <nav className={styles.nav}>
            <div className={styles.logo}>
              <FontAwesomeIcon icon={faFileCircleCheck} className={styles.logoIcon} />
              ResumeAI
            </div>
            <ul className={styles.navLinks}>
              <li><a href="#">Features</a></li>
              
              <li><a href="#">About</a></li>
            </ul>
            <button className={styles.ctaButton} onClick={() => navigate('/resume-editor')}>
              Start Optimizing
            </button>
          </nav>
        </div>
      </header>

      <main>
        <section className={styles.heroSection}>
          <div className={styles.container}>
            <div className={styles.hero}>
              <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>Get Your Resume <span>ATS-Ready</span> in Minutes</h1>
                <p className={styles.heroDescription}>
                  Our AI-powered tool analyzes your resume against ATS systems, provides real-time scoring, and helps you optimize to land more interviews.
                </p>
                <button className={styles.ctaButton} onClick={() => navigate('/resume-editor')}>
                  Upload Your Resume
                </button>
              </div>
              <div className={styles.heroImage}>
                <img src="/api/placeholder/500/350" alt="Resume ATS Tracker Dashboard Preview" />
              </div>
            </div>
          </div>
        </section>

        <section className={styles.features}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Why Choose ResumeAI?</h2>
            <div className={styles.featureGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}><FontAwesomeIcon icon={faRobot} /></div>
                <h3 className={styles.featureTitle}>ATS Compatibility Score</h3>
                <p className={styles.featureDescription}>Get instant feedback on how well your resume will perform with Applicant Tracking Systems used by 90% of employers.</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}><FontAwesomeIcon icon={faMagnifyingGlassChart} /></div>
                <h3 className={styles.featureTitle}>Keyword Optimization</h3>
                <p className={styles.featureDescription}>Our AI identifies missing keywords and phrases that match your target job descriptions and industry standards.</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}><FontAwesomeIcon icon={faPenToSquare} /></div>
                <h3 className={styles.featureTitle}>Real-time Editing</h3>
                <p className={styles.featureDescription}>Make changes to your resume and see your ATS score improve instantly with our interactive editor.</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}><FontAwesomeIcon icon={faChartLine} /></div>
                <h3 className={styles.featureTitle}>Detailed Analytics</h3>
                <p className={styles.featureDescription}>Get section-by-section analysis and actionable recommendations to improve your resume's effectiveness.</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}><FontAwesomeIcon icon={faFileExport} /></div>
                <h3 className={styles.featureTitle}>Multiple Export Options</h3>
                <p className={styles.featureDescription}>Download your optimized resume in PDF, DOCX, or plain text formats ready for submission.</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}><FontAwesomeIcon icon={faUserTie} /></div>
                <h3 className={styles.featureTitle}>Industry Templates</h3>
                <p className={styles.featureDescription}>Access professional templates tailored to your specific industry and career level.</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.testimonials}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>What Our Users Say</h2>
            <div className={styles.testimonialGrid}>
              {[{
                initials: 'JD', name: 'James Donovan', title: 'Software Engineer',
                quote: 'After optimizing my resume with ResumeAI, I started getting callbacks within days. The ATS score feature helped me understand exactly what was missing from my resume.'
              }, {
                initials: 'SL', name: 'Sarah Lin', title: 'Marketing Director',
                quote: 'I was applying for months with no success. After using ResumeAI to optimize my resume, I got 3 interviews in the first week! The keyword suggestions were game-changing.'
              }, {
                initials: 'MR', name: 'Michael Rodriguez', title: 'Career Coach',
                quote: 'As a career coach, I recommend ResumeAI to all my clients. The real-time feedback helps job seekers understand what recruiters and ATS systems are looking for.'
              }, {
                initials: 'AP', name: 'Aisha Patel', title: 'Project Manager',
                quote: 'The section-by-section analysis pointed out weaknesses in my experience descriptions I never would have caught. My ATS score jumped from 64% to 92%!'
              }].map((t, i) => (
                <div key={i} className={styles.testimonialCard}>
                  <p className={styles.testimonialText}>&quot;{t.quote}&quot;</p>
                  <div className={styles.testimonialAuthor}>
                    <div className={styles.testimonialAvatar}>{t.initials}</div>
                    <div className={styles.testimonialInfo}>
                      <h4>{t.name}</h4>
                      <p className={styles.testimonialPosition}>{t.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>How It Works</h2>
            <p className={styles.ctaDescription}>Three simple steps to optimize your resume and increase your interview chances</p>

            <div className={styles.demoWrapper}>
              <div className={styles.stepContainer}>
                <div className={styles.step}>
                  <div className={styles.stepNumber}>1</div>
                  <h3 className={styles.stepTitle}>Upload Your Resume</h3>
                  <p className={styles.stepDescription}>Upload your existing resume in PDF, DOCX, or paste your text directly.</p>
                </div>
                <div className={styles.step}>
                  <div className={styles.stepNumber}>2</div>
                  <h3 className={styles.stepTitle}>Get ATS Analysis</h3>
                  <p className={styles.stepDescription}>Our AI analyzes your resume against ATS criteria and industry standards.</p>
                </div>
                <div className={styles.step}>
                  <div className={styles.stepNumber}>3</div>
                  <h3 className={styles.stepTitle}>Optimize & Download</h3>
                  <p className={styles.stepDescription}>Make the suggested improvements and download your ATS-optimized resume.</p>
                </div>
              </div>
              <button className={styles.ctaButton} onClick={() => navigate('/resume-editor')}>
                Try It Now
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerInfo}>
              <div className={styles.footerLogo}>
                <FontAwesomeIcon icon={faFileCircleCheck} /> ResumeAI
              </div>
              <p className={styles.footerDescription}>Helping job seekers beat the ATS and land more interviews with AI-powered resume optimization.</p>
            </div>
            {[
              {
                title: 'Product',
                links: ['Features', 'Pricing', 'Testimonials', 'FAQ']
              }, {
                title: 'Company',
                links: ['About Us', 'Blog', 'Careers', 'Contact']
              }, {
                title: 'Resources',
                links: ['Resume Tips', 'Career Advice', 'Interview Prep', 'Job Search Guide']
              }
            ].map((section, i) => (
              <div key={i} className={styles.footerLinks}>
                <h3>{section.title}</h3>
                <ul>
                  {section.links.map((link, j) => (
                    <li key={j}><a href="#">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className={styles.copyright}>
            &copy; 2025 ResumeAI. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}