import { ReactNode } from "react";
import { motion } from "framer-motion";

interface FormSectionProps {
  children: ReactNode;
  isActive: boolean;
  direction: number;
}

export function FormSection({
  children,
  isActive,
  direction,
}: FormSectionProps) {
  const sectionVariants = {
    hidden: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    }),
  };

  if (!isActive) return null;

  return (
    <motion.div
      className="w-full absolute"
      custom={direction}
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}
