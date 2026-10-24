import { useState, useEffect } from "react";

/**
 * Photo card with dynamic fallback and automatic reset on image src changes.
 */
export default function PhotoCard({ src, alt, icon: Icon, className = "", children }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!failed && src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          onError={() => setFailed(true)}
          className="w-full h-full object-cover transition-opacity duration-300"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-emerald-900/50 via-slate-900 to-slate-950 flex items-center justify-center">
          {Icon && <Icon size={28} className="text-emerald-500/50" />}
        </div>
      )}
      {children}
    </div>
  );
}
