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

const CodeOfConduct = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <SEOHead {...seoConfig.codeOfConduct} />
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
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Code of Conduct</h1>
                <p className="text-muted-foreground text-sm">
                  Creating a safe, inclusive, and respectful community for all.
                </p>
              </motion.div>

              <div className="prose prose-gray max-w-none space-y-6">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-3">Our Commitment</h2>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    Bharat XR is committed to providing a welcoming and harassment-free environment for everyone, regardless 
                    of gender, gender identity and expression, age, sexual orientation, disability, physical appearance, body 
                    size, race, ethnicity, religion, or technology choices. We do not tolerate harassment of participants in 
                    any form.
                  </p>
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-3">Expected Behavior</h2>
                  <p className="text-muted-foreground mb-3 text-sm">All community members are expected to:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1.5 text-sm">
                    <li><strong className="text-foreground">Be Respectful:</strong> Treat everyone with dignity and respect. Listen actively and be open to different viewpoints</li>
                    <li><strong className="text-foreground">Be Collaborative:</strong> Work together constructively. Help others learn and grow</li>
                    <li><strong className="text-foreground">Be Inclusive:</strong> Welcome newcomers. Use inclusive language and avoid jargon that excludes others</li>
                    <li><strong className="text-foreground">Be Professional:</strong> Maintain professionalism in all interactions, online and offline</li>
                    <li><strong className="text-foreground">Act with Integrity:</strong> Be honest about your work and give credit where it's due</li>
                    <li><strong className="text-foreground">Support Others:</strong> Offer help when you can and accept help graciously</li>
                  </ul>
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-3">Unacceptable Behavior</h2>
                  <p className="text-muted-foreground mb-3 text-sm">The following behaviors are unacceptable in our community:</p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1.5 text-sm">
                    <li><strong className="text-foreground">Harassment:</strong> Offensive verbal or written comments, intimidation, stalking, or unwelcome sexual attention</li>
                    <li><strong className="text-foreground">Discrimination:</strong> Any behavior that demeans, marginalizes, or insults individuals based on their identity</li>
                    <li><strong className="text-foreground">Abuse:</strong> Personal attacks, trolling, or sustained disruption of events or discussions</li>
                    <li><strong className="text-foreground">Cheating:</strong> Plagiarism, unauthorized collaboration, or submission of others' work as your own</li>
                    <li><strong className="text-foreground">Deception:</strong> Misrepresenting your identity, qualifications, or affiliations</li>
                    <li><strong className="text-foreground">Inappropriate Content:</strong> Sharing content that is violent, sexually explicit, or otherwise inappropriate</li>
                  </ul>
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-3">Reporting Issues</h2>
                  <p className="text-muted-foreground mb-3 text-sm">
                    If you experience or witness behavior that violates this Code of Conduct:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1.5 text-sm">
                    <li>Report the incident to Bharat XR organizers or staff immediately</li>
                    <li>Email us at <a href="mailto:conduct@bharatxr.co" className="text-accent hover:underline">conduct@bharatxr.co</a></li>
                    <li>Include as much detail as possible: what happened, when, where, and who was involved</li>
                  </ul>
                  <p className="text-muted-foreground mt-3 text-sm">
                    <strong className="text-foreground">Confidentiality:</strong> All reports will be handled with discretion. We will not share your identity 
                    without your consent, except as required by law.
                  </p>
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-3">Enforcement</h2>
                  <p className="text-muted-foreground mb-3 text-sm">
                    Violations of this Code of Conduct may result in:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1.5 text-sm">
                    <li>A verbal or written warning</li>
                    <li>Removal from the current event or program</li>
                    <li>Temporary or permanent ban from future events and community spaces</li>
                    <li>Disqualification from competitions and revocation of prizes or certificates</li>
                    <li>Reporting to appropriate authorities if laws have been violated</li>
                  </ul>
                  <p className="text-muted-foreground mt-3 text-sm">
                    The severity of the response will be proportional to the violation. Bharat XR organizers have the final 
                    authority on all enforcement decisions.
                  </p>
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-3">Scope</h2>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    This Code of Conduct applies to all Bharat XR spaces, including:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1.5 mt-3 text-sm">
                    <li>In-person events, workshops, and hackathons</li>
                    <li>Online events, webinars, and virtual meetups</li>
                    <li>Community platforms (Discord, WhatsApp groups, forums)</li>
                    <li>Social media interactions representing Bharat XR</li>
                    <li>Any other space where Bharat XR community members gather</li>
                  </ul>
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

export default CodeOfConduct;
