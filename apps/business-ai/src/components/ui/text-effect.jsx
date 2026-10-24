'use client';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

const defaultStaggerTimes = {
  char: 0.03,
  word: 0.05,
  line: 0.1,
};

const defaultContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const defaultItemVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
  },
  exit: { opacity: 0 },
};

const presetVariants = {
  blur: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: 'blur(12px)' },
      visible: { opacity: 1, filter: 'blur(0px)' },
      exit: { opacity: 0, filter: 'blur(12px)' },
    },
  },
  'fade-in-blur': {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 20, filter: 'blur(12px)' },
      visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
      exit: { opacity: 0, y: 20, filter: 'blur(12px)' },
    },
  },
  scale: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, scale: 0 },
      visible: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0 },
    },
  },
  fade: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 },
    },
  },
  slide: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
  },
};

const AnimationComponent = React.memo(function AnimationComponent({
  segment,
  variants,
  per,
  segmentWrapperClassName,
}) {
  const content =
    per === 'line' ? (
      <motion.span variants={variants} className="block">
        {segment}
      </motion.span>
    ) : per === 'word' ? (
      <motion.span
        aria-hidden="true"
        variants={variants}
        className="inline-block whitespace-pre"
      >
        {segment}
      </motion.span>
    ) : (
      <motion.span className="inline-block whitespace-pre">
        {segment.split('').map((char, charIndex) => (
          <motion.span
            key={`char-${charIndex}`}
            aria-hidden="true"
            variants={variants}
            className="inline-block whitespace-pre"
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    );

  if (!segmentWrapperClassName) {
    return content;
  }

  const defaultWrapperClassName = per === 'line' ? 'block' : 'inline-block';

  return (
    <span className={cn(defaultWrapperClassName, segmentWrapperClassName)}>
      {content}
    </span>
  );
});

const splitText = (text, per) => {
  if (per === 'line') return text.split('\n');
  return text.split(/(\s+)/);
};

const hasTransition = (variant) => {
  return (
    typeof variant === 'object' && variant !== null && 'transition' in variant
  );
};

const createVariantsWithTransition = (baseVariants, transition) => {
  if (!transition) return baseVariants;

  return {
    ...baseVariants,
    visible: {
      ...baseVariants?.visible,
      transition: {
        ...(hasTransition(baseVariants?.visible)
          ? baseVariants?.visible?.transition
          : {}),
        ...transition,
      },
    },
    exit: {
      ...baseVariants?.exit,
      transition: {
        ...(hasTransition(baseVariants?.exit)
          ? baseVariants?.exit?.transition
          : {}),
        ...transition,
      },
    },
  };
};

export function TextEffect({
  children,
  per = 'word',
  as = 'p',
  variants,
  className,
  preset = 'fade-in-blur',
  delay = 0,
  speedReveal = 1,
  speedSegment = 1,
  trigger = true,
  onAnimationComplete,
  onAnimationStart,
  segmentWrapperClassName,
  containerTransition,
  segmentTransition,
  style,
}) {
  if (typeof children !== 'string') {
    return <span className={className}>{children}</span>;
  }

  const segments = splitText(children, per);
  const Tag = motion[as] || motion.p;

  const baseVariants = preset
    ? presetVariants[preset]
    : { container: defaultContainerVariants, item: defaultItemVariants };

  const stagger = defaultStaggerTimes[per] / speedReveal;

  const baseDuration = 0.3 / speedSegment;

  const customContainerVariants = {
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
    exit: {
      transition: {
        staggerChildren: stagger,
        staggerDirection: -1,
      },
    },
  };

  const customItemVariants = {
    hidden: baseVariants.item.hidden,
    visible: {
      ...baseVariants.item.visible,
      transition: {
        duration: baseDuration,
      },
    },
    exit: {
      ...baseVariants.item.exit,
      transition: {
        duration: baseDuration,
      },
    },
  };

  const finalVariants = {
    container: createVariantsWithTransition(
      variants?.container || customContainerVariants,
      containerTransition
    ),
    item: createVariantsWithTransition(
      variants?.item || customItemVariants,
      segmentTransition
    ),
  };

  return (
    <AnimatePresence mode="popLayout">
      {trigger && (
        <Tag
          initial="hidden"
          animate="visible"
          exit="exit"
          aria-label={children}
          variants={finalVariants.container}
          className={cn('whitespace-pre-wrap', className)}
          onAnimationComplete={onAnimationComplete}
          onAnimationStart={onAnimationStart}
          style={style}
        >
          {segments.map((segment, index) => (
            <AnimationComponent
              key={`${per}-${index}-${segment}`}
              segment={segment}
              variants={finalVariants.item}
              per={per}
              segmentWrapperClassName={segmentWrapperClassName}
            />
          ))}
        </Tag>
      )}
    </AnimatePresence>
  );
}

export default TextEffect;
