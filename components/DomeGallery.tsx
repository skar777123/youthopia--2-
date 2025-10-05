import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryImages, GalleryImage } from '../data/galleryImages';
import { FiX } from 'react-icons/fi';

const DOME_RADIUS = 250; // in pixels
const PERSPECTIVE = 800; // in pixels

const DomeGallery: React.FC = () => {
    const [selectedId, setSelectedId] = React.useState<number | null>(null);

    const selectedImage = galleryImages.find(img => img.id === selectedId);

    return (
        <div 
            className="w-full flex flex-col items-center justify-center p-8 bg-brand-bg dark:bg-brand-black min-h-[500px] overflow-hidden"
            style={{ perspective: `${PERSPECTIVE}px` }}
        >
            <motion.div 
                className="relative w-full h-[300px]"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateX: -15, rotateY: 0 }}
            >
                {galleryImages.map((image, i) => {
                    const angle = (i / galleryImages.length) * 2 * Math.PI;
                    const x = DOME_RADIUS * Math.sin(angle);
                    const z = -DOME_RADIUS * Math.cos(angle);

                    return (
                        <motion.div
                            key={image.id}
                            layoutId={`gallery-item-${image.id}`}
                            className="absolute top-1/2 left-1/2 w-32 h-48 rounded-lg overflow-hidden shadow-2xl cursor-pointer"
                            style={{
                                originX: '50%', originY: '50%',
                                backfaceVisibility: 'hidden',
                            }}
                            initial={{ x: '-50%', y: '-50%' }}
                            animate={{
                                x: `calc(-50% + ${x}px)`,
                                y: '-50%',
                                z: `${z}px`,
                                rotateY: `${(angle * 180) / Math.PI}deg`,
                            }}
                            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                            whileHover={{ y: '-60%', scale: 1.1, transition: { duration: 0.2 } }}
                            onClick={() => setSelectedId(image.id)}
                        >
                            <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
                        </motion.div>
                    );
                })}
            </motion.div>

            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedId(null)}
                    >
                        <motion.div 
                            layoutId={`gallery-item-${selectedImage.id}`}
                            className="relative w-full max-w-lg rounded-lg overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img src={selectedImage.src} alt={selectedImage.alt} className="w-full h-auto object-contain max-h-[90vh]" />
                            <motion.div
                                className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, transition: { delay: 0.3 } }}
                            >
                                <h3 className="text-white text-2xl font-bold">{selectedImage.title}</h3>
                            </motion.div>
                        </motion.div>
                        <motion.button
                            className="absolute top-5 right-5 p-2 bg-white/20 rounded-full text-white hover:bg-white/40"
                            onClick={() => setSelectedId(null)}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1, transition: { delay: 0.3 } }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            aria-label="Close image viewer"
                        >
                            <FiX size={24} />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DomeGallery;
