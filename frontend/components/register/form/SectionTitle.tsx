import { SectionTitle as SectionTitleType } from "@/actions/register";
import { motion } from "framer-motion";

interface SectionTitleProps {
  title: SectionTitleType;
  currentSection: number;
}

export function SectionTitle({ title, currentSection }: SectionTitleProps) {
  const titleVariants = {
    hidden: {
      y: -20,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: 0.1,
      },
    },
    exit: {
      y: 20,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className="text-center space-y-2">
      <motion.h2
        key={`title-${currentSection}`}
        className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight"
        variants={titleVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <span className="text-freehunt-main">{title.highlight}</span>
        <span className="text-foreground">{title.regular}</span>
      </motion.h2>
      <div className="w-20 h-1 bg-freehunt-main rounded-full mx-auto opacity-60"></div>
    </div>
  );
}
