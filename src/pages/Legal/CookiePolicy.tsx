import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoConfig } from '@/config/seo';

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const CookiePolicy = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <SEOHead {...seoConfig.cookiePolicy} />
        <Header />
        <main className="py-10 md:py-12">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto">
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Cookie Policy</h1>
                <p className="text-muted-foreground text-sm">Last Updated: January 10, 2026</p>
              </motion.div>

              <div className="prose prose-gray max-w-none space-y-6">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-3">What Are Cookies?</h2>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and give website owners useful information about how their site is being used.
                  </p>
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-3">Types of Cookies We Use</h2>
                  
                  <h3 className="text-lg font-medium text-foreground mb-2 mt-4">Necessary Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm mb-4">
                    These cookies are essential for the website to function properly. They enable basic functions like page navigation, secure areas access, and session management. The website cannot function properly without these cookies, and they cannot be disabled.
                  </p>

                  <h3 className="text-lg font-medium text-foreground mb-2">Analytics Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm mb-4">
                    These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website's structure and content to better serve our users.
                  </p>

                  <h3 className="text-lg font-medium text-foreground mb-2">Marketing Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm mb-4">
                    These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.
                  </p>

                  <h3 className="text-lg font-medium text-foreground mb-2">Preference Cookies</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    These cookies enable the website to remember choices you make (such as your language preference or the region you are in) and provide enhanced, more personal features.
                  </p>
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-3">How to Control Cookies</h2>
                  <p className="text-muted-foreground leading-relaxed text-sm mb-3">
                    You can control and manage cookies in several ways:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1.5 text-sm">
                    <li>Use our cookie consent banner to manage your preferences</li>
                    <li>Adjust your browser settings to refuse cookies</li>
                    <li>Delete cookies that have already been set</li>
                    <li>Set your browser to alert you when cookies are being sent</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed text-sm mt-3">
                    Please note that disabling cookies may affect the functionality of this and many other websites that you visit.
                  </p>
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-3">Third-Party Cookies</h2>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    In some cases, we use cookies provided by trusted third parties. These third-party cookies may track your use of our website and may combine that information with other information they've collected from your use of other websites.
                  </p>
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-3">Updates to This Policy</h2>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our data practices. When we make changes, we will update the "Last Updated" date at the top of this policy.
                  </p>
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-3">Contact Us</h2>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    If you have any questions about our use of cookies, please contact us at{' '}
                    <a href="mailto:privacy@bharatxr.co" className="text-accent hover:underline">
                      privacy@bharatxr.co
                    </a>
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default CookiePolicy;
