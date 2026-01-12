import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const TermsConditions = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
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
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Terms and Conditions</h1>
                <p className="text-muted-foreground text-sm">Bharat XR • Last Updated: January 10, 2026</p>
              </motion.div>

              <motion.div 
                className="mb-6 p-4 bg-muted/50 rounded-lg border border-border/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-sm text-muted-foreground leading-relaxed">
                  These Terms and Conditions ("Terms") govern participation in hackathons, events, workshops, programs, and activities organized or hosted by Bharat XR ("Organizer", "we", "our", or "us"). By registering for or participating in any Bharat XR event or program, you ("Participant", "you") agree to comply with and be bound by these Terms.
                </p>
              </motion.div>

              <div className="prose prose-gray max-w-none space-y-8">
                {/* Section 1 */}
                <motion.section
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">1. General Conditions</h2>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li><strong className="text-foreground">1.1</strong> Bharat XR reserves the right to cancel, postpone, modify, or reschedule any event, hackathon, or program, including changes to date, time, venue, format, or structure, at its sole discretion.</li>
                    <li><strong className="text-foreground">1.2</strong> Bharat XR shall not be responsible for any personal costs, expenses, or losses incurred by Participants due to such changes or cancellations, including but not limited to travel, accommodation, or equipment costs.</li>
                    <li><strong className="text-foreground">1.3</strong> Bharat XR reserves the right to amend these Terms at any time without prior notice. Continued participation constitutes acceptance of the updated Terms.</li>
                  </ul>
                </motion.section>

                {/* Section 2 */}
                <motion.section
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">2. Registration & Participation</h2>
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <p><strong className="text-foreground">2.1</strong> Participants must register only through the official Bharat XR platform or designated microsite.</p>
                    
                    <div>
                      <p><strong className="text-foreground">2.2</strong> Bharat XR is not responsible for:</p>
                      <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                        <li>Late, lost, incomplete, or misdirected registrations</li>
                        <li>Unauthorized access, data loss, or system failures</li>
                        <li>Technical issues including network, hardware, software, or communication failures</li>
                      </ul>
                    </div>

                    <div>
                      <p><strong className="text-foreground">2.3</strong> Team-based events:</p>
                      <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                        <li>Teams must consist of a minimum of 2 and a maximum of 6 members, unless otherwise specified.</li>
                        <li>Each individual may participate in only one team per event.</li>
                        <li>Team details must be finalized during registration.</li>
                        <li>The team leader is responsible for all submissions and communications.</li>
                      </ul>
                    </div>

                    <p><strong className="text-foreground">2.4</strong> All participants must remain active on the official event platform and designated communication channels (such as Discord, Slack, Telegram, or WhatsApp) throughout the event. Failure to comply may result in disqualification.</p>
                  </div>
                </motion.section>

                {/* Section 3 */}
                <motion.section
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">3. Event Format & Presentation</h2>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div>
                      <p><strong className="text-foreground">3.1</strong> Teams may be required to present their solution, including:</p>
                      <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                        <li>A live or recorded demonstration</li>
                        <li>A working prototype or proof of concept</li>
                        <li>A Q&A session with judges</li>
                      </ul>
                    </div>
                    <p><strong className="text-foreground">3.2</strong> Presentation duration and format will be communicated prior to the event.</p>
                    <p><strong className="text-foreground">3.3</strong> By registering, Participants consent to receive event-related communications from Bharat XR via email or messaging platforms.</p>
                  </div>
                </motion.section>

                {/* Section 4 */}
                <motion.section
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">4. Prizes & Rewards</h2>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li><strong className="text-foreground">4.1</strong> Prize details will be published on the event page.</li>
                    <li><strong className="text-foreground">4.2</strong> All prizes are non-transferable.</li>
                    <li><strong className="text-foreground">4.3</strong> Winners are solely responsible for any applicable taxes, deductions, or statutory charges.</li>
                    <li><strong className="text-foreground">4.4</strong> Bharat XR reserves the right to modify prize structures or rewards without prior notice.</li>
                    <li><strong className="text-foreground">4.5</strong> Cash rewards, if applicable, will be disbursed within 60 days of event completion and may be subject to tax deductions as per applicable laws.</li>
                  </ul>
                </motion.section>

                {/* Section 5 */}
                <motion.section
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">5. Judging & Selection</h2>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p><strong className="text-foreground">5.1</strong> Winners will be selected by an independent panel of judges.</p>
                    <div>
                      <p><strong className="text-foreground">5.2</strong> Judging criteria may include, but are not limited to:</p>
                      <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                        <li>Impact</li>
                        <li>Creativity & originality</li>
                        <li>Design & user experience</li>
                        <li>Technical execution</li>
                        <li>Feasibility & scalability</li>
                      </ul>
                    </div>
                    <p><strong className="text-foreground">5.3</strong> All decisions made by the judges and Bharat XR are final and binding.</p>
                    <p><strong className="text-foreground">5.4</strong> Bharat XR reserves the right to modify judging criteria or evaluation processes at any stage.</p>
                  </div>
                </motion.section>

                {/* Section 6 */}
                <motion.section
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">6. Code of Conduct</h2>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li><strong className="text-foreground">6.1</strong> Participants must conduct themselves professionally and respectfully at all times.</li>
                    <li><strong className="text-foreground">6.2</strong> Harassment, discrimination, abuse, intimidation, or inappropriate behavior of any form will not be tolerated.</li>
                    <li><strong className="text-foreground">6.3</strong> This applies to all interactions, whether online or offline, including social media and communication platforms.</li>
                    <li><strong className="text-foreground">6.4</strong> Bharat XR reserves the right to warn, suspend, or disqualify Participants who violate this Code of Conduct.</li>
                  </ul>
                </motion.section>

                {/* Section 7 */}
                <motion.section
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">7. Anti-Harassment Policy</h2>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p><strong className="text-foreground">7.1</strong> Bharat XR is committed to providing a safe, inclusive, and harassment-free environment for all Participants.</p>
                    <div>
                      <p><strong className="text-foreground">7.2</strong> Harassment includes but is not limited to:</p>
                      <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                        <li>Offensive verbal or written comments</li>
                        <li>Unwelcome sexual attention</li>
                        <li>Intimidation or stalking</li>
                        <li>Disruptive behavior</li>
                        <li>Unauthorized photography or recording</li>
                      </ul>
                    </div>
                    <p><strong className="text-foreground">7.3</strong> Participants must immediately comply if asked to stop any inappropriate behavior.</p>
                    <p><strong className="text-foreground">7.4</strong> Incidents may be reported to the organizing team. Bharat XR may take appropriate action, including removal from the event.</p>
                  </div>
                </motion.section>

                {/* Section 8 */}
                <motion.section
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">8. Intellectual Property Rights</h2>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li><strong className="text-foreground">8.1</strong> Participants retain ownership of their original work.</li>
                    <li><strong className="text-foreground">8.2</strong> By participating, Participants grant Bharat XR a right of first refusal for acquiring or licensing submitted materials for up to 6 months after the event.</li>
                    <li><strong className="text-foreground">8.3</strong> During this period, Participants may not exclusively license or transfer their submission to third parties without first offering Bharat XR the same opportunity.</li>
                    <li><strong className="text-foreground">8.4</strong> Participants authorize Bharat XR to showcase, publish, and promote submitted ideas and materials for event-related and promotional purposes, without additional compensation.</li>
                    <li><strong className="text-foreground">8.5</strong> Submissions must not infringe on third-party intellectual property rights. Participants agree to indemnify Bharat XR against any related claims.</li>
                  </ul>
                </motion.section>

                {/* Section 9 */}
                <motion.section
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">9. Content & Submission Rules</h2>
                  <div className="text-sm text-muted-foreground">
                    <p className="mb-3">Participants represent and warrant that:</p>
                    <ul className="list-disc list-inside ml-4 space-y-2">
                      <li>Submissions are original or properly licensed</li>
                      <li>Content does not violate any laws or third-party rights</li>
                      <li>Submissions do not contain malicious code</li>
                      <li>Content is not obscene, defamatory, hateful, or unlawful</li>
                    </ul>
                    <p className="mt-3">Bharat XR reserves the right to remove or disqualify any submission that violates these standards.</p>
                  </div>
                </motion.section>

                {/* Section 10 */}
                <motion.section
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">10. Media & Recordings</h2>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li><strong className="text-foreground">10.1</strong> Participants consent to photography, audio, and video recording during events.</li>
                    <li><strong className="text-foreground">10.2</strong> Bharat XR may use such recordings worldwide for promotional, educational, and archival purposes for up to 10 years, without additional compensation.</li>
                  </ul>
                </motion.section>

                {/* Section 11 */}
                <motion.section
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">11. Eligibility</h2>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li><strong className="text-foreground">11.1</strong> Bharat XR reserves the right to determine Participant eligibility.</li>
                    <li><strong className="text-foreground">11.2</strong> Participants under 18 years of age (minimum 14) must provide parental or guardian consent.</li>
                    <li><strong className="text-foreground">11.3</strong> Ineligible or non-compliant entries may be disqualified at Bharat XR's discretion.</li>
                  </ul>
                </motion.section>

                {/* Section 12 */}
                <motion.section
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">12. Data Security</h2>
                  <p className="text-sm text-muted-foreground">
                    Participant data will be handled in accordance with applicable data protection laws, including the Information Technology Act, 2000 and amendments. Refer to the <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a> for more details.
                  </p>
                </motion.section>

                {/* Section 13 */}
                <motion.section
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">13. Governing Law</h2>
                  <p className="text-sm text-muted-foreground">
                    These Terms shall be governed and interpreted in accordance with the laws of India. Any disputes shall be subject to the jurisdiction of Indian courts.
                  </p>
                </motion.section>

                {/* Section 14 */}
                <motion.section
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">14. Precedence</h2>
                  <p className="text-sm text-muted-foreground">
                    These Terms shall prevail over any conflicting information provided in promotional or marketing materials related to Bharat XR events.
                  </p>
                </motion.section>

                {/* Contact */}
                <motion.section
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={sectionVariants}
                  className="pt-4 border-t border-border"
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">Contact</h2>
                  <p className="text-sm text-muted-foreground">
                    For questions related to these Terms, please contact:{' '}
                    <a href="mailto:support@bharatxr.co" className="text-primary hover:underline">
                      support@bharatxr.co
                    </a>
                  </p>
                </motion.section>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default TermsConditions;
