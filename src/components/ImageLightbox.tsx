/**
 * Copyright 2024 Google LLC
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
}

export default function ImageLightbox({ isOpen, onClose, imageSrc }: ImageLightboxProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            onClick={onClose}
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative z-10 w-full max-w-2xl max-h-[80vh] flex items-center justify-center pointer-events-none"
          >
            <img 
              src={imageSrc} 
              alt="Product View" 
              className="w-full h-full object-contain rounded-2xl shadow-2xl pointer-events-auto"
            />
            
            <button 
              onClick={onClose}
              className="absolute -top-12 right-0 w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors pointer-events-auto"
            >
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
