import { motion } from 'framer-motion';
import { SectionBadge } from '@/components/ui/SectionBadge';
import { Camera } from 'lucide-react';
import ref2 from '@/assets/bharat-xr-ref-2.png';
import ref3 from '@/assets/bharat-xr-ref-3.png';
import ref4 from '@/assets/bharat-xr-ref-4.png';
import ref5 from '@/assets/bharat-xr-ref-5.png';

const galleryImages = [
  { src: ref2, alt: 'Bharat XR Workshop' },
  { src: ref3, alt: 'Community Event' },
  { src: ref4, alt: 'Hackathon' },
  { src: ref5, alt: 'Team Collaboration' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export const CommunityGallerySection = () => {
  return (
    <section className="py-8 md:py-12 bg-secondary/30">
      <div className="container-wide">
        <div className="text-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <SectionBadge icon={<Camera size={14} />}>
              Community
            </SectionBadge>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold"
          >
            Community in Action
          </motion.h2>
        </div>

        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.alt}
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              className="aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer"
            >
              <motion.img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
