import { motion } from "framer-motion";
import { SectionTitle as SectionTitleType } from "@/actions/register";

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
    <motion.p
      key={`title-${currentSection}`}
      className="text-xl md:text-2xl lg:text-4xl text-center font-bold"
      variants={titleVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <span className="text-freehunt-main">{title.highlight}</span>
      <span className="text-black font-normal">{title.regular}</span>
    </motion.p>
  );
}
