import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoConfig } from '@/config/seo';
import { legalInfo } from '@/data/legal';

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const PrivacyPolicy = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <SEOHead {...seoConfig.privacy} />
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
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Privacy Policy</h1>
                <p className="text-muted-foreground text-sm">Last updated: {legalInfo.lastUpdated}</p>
              </motion.div>

              <div className="prose prose-gray max-w-none space-y-6">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-3">Introduction</h2>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    At Bharat XR, we are committed to protecting your privacy. This Privacy Policy explains how we collect, 
                    use, and safeguard your personal information when you use our platform, attend our events, or participate 
                    in our programs. This policy applies to all users of Bharat XR services.
                  </p>
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-3">Information We Collect</h2>
                  <p className="text-muted-foreground mb-3 text-sm">We may collect the following types of information:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1.5 text-sm">
                    <li><strong className="text-foreground">Personal Information:</strong> Name, email address, phone number, and profile details you provide during registration</li>
                    <li><strong className="text-foreground">Usage Data:</strong> Information about how you interact with our platform, including pages visited and features used</li>
                    <li><strong className="text-foreground">Event Registration Data:</strong> Details provided when registering for workshops, hackathons, or other events</li>
                    <li><strong className="text-foreground">Communications:</strong> Messages, feedback, and inquiries you send to us</li>
                  </ul>
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-3">How We Use Information</h2>
                  <p className="text-muted-foreground mb-3 text-sm">We use the information we collect to:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1.5 text-sm">
                    <li>Operate and maintain our platform and services</li>
                    <li>Process event registrations and manage participation</li>
                    <li>Send important updates about events, programs, and community activities</li>
                    <li>Improve our services based on user feedback and usage patterns</li>
                    <li>Respond to inquiries and provide customer support</li>
                  </ul>
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-3">Data Sharing</h2>
                  <p className="text-muted-foreground mb-3 text-sm">We may share your information in the following circumstances:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1.5 text-sm">
                    <li><strong className="text-foreground">Event Partners:</strong> With sponsors or partners for events you participate in, with your consent</li>
                    <li><strong className="text-foreground">Service Providers:</strong> With trusted third parties who assist in operating our platform</li>
                    <li><strong className="text-foreground">Legal Requirements:</strong> When required by law or to protect our rights</li>
                  </ul>
                  <p className="text-muted-foreground mt-3 text-sm">
                    We do not sell your personal information to third parties.
                  </p>
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-3">Data Security</h2>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    We implement appropriate technical and organizational measures to protect your personal information 
                    against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission 
                    over the internet is 100% secure, and we cannot guarantee absolute security.
                  </p>
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-3">Your Rights</h2>
                  <p className="text-muted-foreground mb-3 text-sm">You have the right to:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1.5 text-sm">
                    <li><strong className="text-foreground">Access:</strong> Request a copy of the personal information we hold about you</li>
                    <li><strong className="text-foreground">Correction:</strong> Request correction of inaccurate or incomplete information</li>
                    <li><strong className="text-foreground">Deletion:</strong> Request deletion of your personal information, subject to legal requirements</li>
                    <li><strong className="text-foreground">Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
                  </ul>
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-3">Policy Updates</h2>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    We may update this Privacy Policy from time to time. We will notify you of any significant changes 
                    by posting the new policy on our platform and updating the "Last updated" date. We encourage you to 
                    review this policy periodically.
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
                    If you have any questions about this Privacy Policy or our data practices, please contact us at{' '}
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

export default PrivacyPolicy;
