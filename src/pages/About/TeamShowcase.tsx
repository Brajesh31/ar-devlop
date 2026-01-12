import { motion } from 'framer-motion';
import { Linkedin, Twitter, Mail } from 'lucide-react';

const team = [
  {
    name: 'Chhavi Gaur',
    role: 'Founder & CEO',
    bio: 'Forbes 30U30 Asia • XR Evangelist',
    initials: 'CG',
    isFounder: true,
  },
  {
    name: 'Rahul Sharma',
    role: 'Head of Partnerships',
    bio: 'Ex-Google • Community Builder',
    initials: 'RS',
    isFounder: false,
  },
  {
    name: 'Priya Patel',
    role: 'Lead Developer',
    bio: 'Unity Expert • AR/VR Developer',
    initials: 'PP',
    isFounder: false,
  },
  {
    name: 'Amit Kumar',
    role: 'Content Lead',
    bio: 'XR Educator • Content Creator',
    initials: 'AK',
    isFounder: false,
  },
];

export const TeamShowcase = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-success/5 rounded-full blur-3xl" />
      </div>

      <div className="container-narrow relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Our Team
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Meet the Dreamers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The passionate individuals driving India's XR revolution
          </p>
        </motion.div>

        {/* Team grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group"
            >
              <div className={`h-full p-6 rounded-2xl bg-card border transition-all duration-300 shadow-sm ${
                member.isFounder 
                  ? 'border-accent/30 hover:border-accent' 
                  : 'border-border hover:border-accent/30'
              }`}>
                {/* Avatar */}
                <div className="relative mb-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-white text-2xl font-bold ${
                      member.isFounder 
                        ? 'bg-gradient-to-br from-accent to-success' 
                        : 'bg-gradient-to-br from-muted-foreground/50 to-muted-foreground/30'
                    }`}
                  >
                    {member.initials}
                  </motion.div>
                  {member.isFounder && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                      Founder
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="text-center">
                  <h3 className="text-lg font-bold mb-1 group-hover:text-accent transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-sm text-accent font-medium mb-2">{member.role}</p>
                  <p className="text-xs text-muted-foreground mb-4">{member.bio}</p>

                  {/* Social links */}
                  <div className="flex justify-center gap-3">
                    {[Linkedin, Twitter, Mail].map((Icon, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors"
                      >
                        <Icon className="w-4 h-4" />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Join CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">Want to join our team?</p>
          <motion.a
            href="/careers"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors"
          >
            View Open Positions
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};
