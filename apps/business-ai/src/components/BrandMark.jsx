function BrandMark({ size = 32, className = "" }) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 via-green-600 to-emerald-500 text-white shadow-md shadow-emerald-600/30 border border-emerald-400/40 shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 48 48" className="w-[75%] h-[75%]" fill="none">
        <path d="M13 12.5h12.5c5.8 0 9.5 2.7 9.5 7.1 0 2.5-1.4 4.5-3.8 5.6 3.1 1 5.1 3.2 5.1 6.4 0 4.9-4.2 7.9-10.8 7.9H13V12.5Z" fill="transparent"/>
        <path d="M14 12v24h11.4c6.6 0 10.8-3 10.8-7.9 0-3.2-2-5.4-5.1-6.4 2.4-1.1 3.8-3.1 3.8-5.6 0-4.4-3.7-7.1-9.5-7.1H14Z" fill="white"/>
        <path d="M8.5 35.5 15 29l4 4-6.5 6.5-4-.5.5-4Z" fill="#a7f3d0"/>
      </svg>
    </div>
  );
}

export default BrandMark;
