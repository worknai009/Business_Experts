import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

export default function AnimatedCounter({ value, duration = 1.6 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  // Extract prefix, number, and suffix (e.g., "$10M+" -> prefix "$", num 10, suffix "M+")
  const match = value.match(/^([^0-9.]*)([0-9.,]+)(.*)$/);
  const prefix = match ? match[1] : "";
  const numStr = match ? match[2].replace(/,/g, "") : "";
  const suffix = match ? match[3] : "";
  const targetNum = parseFloat(numStr);

  const [displayNum, setDisplayNum] = useState(0);

  useEffect(() => {
    if (!isInView || isNaN(targetNum)) return;

    let start = 0;
    const end = targetNum;
    const startTime = performance.now();
    const durationMs = duration * 1000;

    const isDecimal = numStr.includes(".");

    function step(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = start + (end - start) * ease;

      setDisplayNum(isDecimal ? parseFloat(current.toFixed(1)) : Math.round(current));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }, [isInView, targetNum, duration, numStr]);

  if (isNaN(targetNum)) {
    return <span ref={ref}>{value}</span>;
  }

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {displayNum.toLocaleString()}
      {suffix}
    </span>
  );
}
