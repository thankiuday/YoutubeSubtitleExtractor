import React from 'react';
import { motion } from 'framer-motion';

function AboutUs() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-100 py-12"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          className="bg-white shadow-lg rounded-3xl p-8"
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-extrabold text-blue-600 mb-8 text-center"
          >
            About YouTube Subtitle Extractor
          </motion.h1>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">What We Do</h2>
              <p className="text-gray-600 leading-relaxed">
                YouTube Subtitle Extractor is a powerful tool that helps you extract subtitles from YouTube videos. 
                Our application makes it easy to get captions in multiple languages, supporting both manual and 
                auto-generated subtitles.
              </p>
            </motion.section>

            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Features</h2>
              <motion.ul
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="list-disc list-inside space-y-2 text-gray-600"
              >
                <motion.li variants={itemVariants}>Extract subtitles from any YouTube video</motion.li>
                <motion.li variants={itemVariants}>Support for multiple languages</motion.li>
                <motion.li variants={itemVariants}>Download subtitles in text format</motion.li>
                <motion.li variants={itemVariants}>Automatic language detection</motion.li>
                <motion.li variants={itemVariants}>Support for both manual and auto-generated captions</motion.li>
                <motion.li variants={itemVariants}>User-friendly interface</motion.li>
              </motion.ul>
            </motion.section>

            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Use</h2>
              <motion.ol
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="list-decimal list-inside space-y-2 text-gray-600"
              >
                <motion.li variants={itemVariants}>Enter a YouTube video URL in the input field</motion.li>
                <motion.li variants={itemVariants}>Select your preferred language</motion.li>
                <motion.li variants={itemVariants}>Click "Extract Subtitles"</motion.li>
                <motion.li variants={itemVariants}>View the extracted subtitles</motion.li>
                <motion.li variants={itemVariants}>Download the subtitles if needed</motion.li>
              </motion.ol>
            </motion.section>

            <motion.section variants={itemVariants}>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                Our mission is to make video content more accessible by providing an easy way to extract and 
                work with subtitles. We believe that everyone should have access to video content in their 
                preferred language, and our tool helps make that possible.
              </p>
            </motion.section>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default AboutUs; 