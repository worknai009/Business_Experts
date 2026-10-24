'use client';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import {
  Children,
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';

const DOCK_HEIGHT = 128;
const DEFAULT_MAGNIFICATION = 70;
const DEFAULT_DISTANCE = 140;
const DEFAULT_PANEL_HEIGHT = 64;

const DockContext = createContext(undefined);

function DockProvider({ children, value }) {
  return <DockContext.Provider value={value}>{children}</DockContext.Provider>;
}

function useDock() {
  const context = useContext(DockContext);
  if (!context) {
    throw new Error('useDock must be used within a DockProvider');
  }
  return context;
}

export function Dock({
  children,
  className,
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  panelHeight = DEFAULT_PANEL_HEIGHT,
}) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(() => {
    return Math.max(DOCK_HEIGHT, magnification + magnification / 2 + 4);
  }, [magnification]);

  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <motion.div
      style={{
        height: panelHeight,
        scrollbarWidth: 'none',
      }}
      className="mx-auto flex max-w-full items-end overflow-visible"
    >
      <motion.div
        onMouseMove={({ pageX }) => {
          isHovered.set(1);
          mouseX.set(pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={cn(
          'mx-auto flex w-fit gap-3 rounded-2xl bg-white/80 dark:bg-slate-900/80 px-3 py-2 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl backdrop-blur-xl items-end overflow-visible',
          className
        )}
        role="toolbar"
        aria-label="Application dock"
      >
        <DockProvider value={{ mouseX, spring, distance, magnification }}>
          {children}
        </DockProvider>
      </motion.div>
    </motion.div>
  );
}

export function DockItem({
  children,
  className,
  onClick,
}) {
  const ref = useRef(null);
  const { distance, magnification, mouseX, spring } = useDock();
  const [isHovered, setIsHovered] = useState(false);

  const mouseDistance = useTransform(mouseX, (val) => {
    const domRect = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - domRect.x - domRect.width / 2;
  });

  const widthTransform = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [42, magnification, 42]
  );

  const width = useSpring(widthTransform, spring);

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={cn(
        'relative inline-flex aspect-square items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700/60 shadow-sm transition-colors cursor-pointer select-none',
        className
      )}
      tabIndex={0}
      role="button"
    >
      {Children.map(children, (child) =>
        cloneElement(child, { isHovered })
      )}
    </motion.div>
  );
}

export function DockLabel({
  children,
  className,
  isHovered,
}) {
  return (
    <AnimatePresence>
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.9 }}
          animate={{ opacity: 1, y: -8, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.9 }}
          transition={{ duration: 0.15 }}
          className={cn(
            'absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-slate-900 dark:bg-slate-100 px-2 py-0.5 text-[11px] font-black text-white dark:text-slate-900 shadow-md whitespace-nowrap pointer-events-none z-50',
            className
          )}
          role="tooltip"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function DockIcon({
  children,
  className,
}) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      {children}
    </div>
  );
}

export default Dock;
