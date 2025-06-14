import React from 'react';
import { Navbar, NavbarBrand, NavbarContent, Link } from '@heroui/react';
import { motion, AnimatePresence, Transition } from 'framer-motion';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: React.ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    x: -20
  },
  animate: {
    opacity: 1,
    x: 0
  },
  exit: {
    opacity: 0,
    x: 20
  }
};

const pageTransition: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  duration: 0.5
};

const SimpleLayout = ({ children }: LayoutProps) => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar className="shadow-md">
        <NavbarContent>
          <NavbarBrand>
            <Link href="/" className="text-2xl font-bold text-primary-600">
              Travel Agency
            </Link>
          </NavbarBrand>
        </NavbarContent>
      </Navbar>

      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={router.route}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Travel Agency. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default SimpleLayout; 