'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function TabSwitcher() {
  const pathname = usePathname();
  const isEngineer = pathname === '/engineer';

  return (
    <div className="w-full max-w-sm mx-auto mt-6">
      <div className="relative flex h-12 bg-gray-300 rounded-full overflow-hidden shadow-inner">
        {/* Sliding square */}
        <motion.div
          layout
          initial={false}
          animate={{
            x: isEngineer ? '0%' : '100%',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="absolute top-0 left-0 h-full w-1/2 px-2"
        >
          <div className="h-full w-full bg-white rounded-lg shadow-md" />
        </motion.div>

        {/* Clickable sections */}
        <Link
          href="/engineer"
          className="w-1/2 flex items-center justify-center text-sm font-semibold z-10"
        >
          Software Engineer
        </Link>
        <Link
          href="/model"
          className="w-1/2 flex items-center justify-center text-sm font-semibold z-10"
        >
          Model
        </Link>
      </div>
    </div>
  );
}

