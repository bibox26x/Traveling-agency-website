import { ReactNode } from 'react';
import { motion, AnimatePresence, easeInOut } from 'framer-motion';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  hideHeader?: boolean;
  hideFooter?: boolean;
  fullWidth?: boolean;
}

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 }
};

const pageTransitionProps = {
  duration: 0.3,
  ease: easeInOut
};

export default function Layout({ 
  children, 
  hideHeader = false, 
  hideFooter = false,
  fullWidth = false 
}: LayoutProps) {
  const router = useRouter();
  
  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeader && <Header />}
      
      <main className="flex-grow w-full">
        {fullWidth ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={router.route}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransitionProps}
              className="h-full w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={router.route}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={pageTransitionProps}
                className="h-full w-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
} 