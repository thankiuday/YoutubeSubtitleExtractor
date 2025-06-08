import React from 'react';
import { motion } from 'framer-motion';

function LearningHub() {
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
            Learning Hub (Coming Soon)
          </motion.h1>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* AI-Powered Learning Section */}
            <motion.section variants={itemVariants} className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">AI-Powered Learning</h2>
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-blue-600 mb-4">Transform Subtitles into Learning Materials</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Convert video subtitles into structured study notes</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Generate practice questions and quizzes</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Create flashcards for better retention</span>
                  </li>
                </ul>
              </div>
            </motion.section>

            {/* Features Preview */}
            <motion.section variants={itemVariants} className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800">Upcoming Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Smart Summaries</h3>
                  <p className="text-gray-600">AI-generated concise summaries of video content with key points highlighted.</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Interactive Quizzes</h3>
                  <p className="text-gray-600">Automatically generated quizzes to test your understanding of the content.</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Study Plans</h3>
                  <p className="text-gray-600">Personalized study schedules based on your learning goals and progress.</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Progress Tracking</h3>
                  <p className="text-gray-600">Monitor your learning progress and get insights on areas that need more focus.</p>
                </motion.div>
              </div>
            </motion.section>

            {/* Coming Soon Notice */}
            <motion.div
              variants={itemVariants}
              className="text-center p-6 bg-blue-50 rounded-xl"
            >
              <h3 className="text-xl font-semibold text-blue-600 mb-2">Coming Soon!</h3>
              <p className="text-gray-600">
                We're working hard to bring these features to you. Stay tuned for updates!
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default LearningHub; 