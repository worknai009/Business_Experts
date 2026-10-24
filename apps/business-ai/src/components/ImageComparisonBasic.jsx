import React from 'react';
import {
  ImageComparison,
  ImageComparisonImage,
  ImageComparisonSlider,
} from './core/image-comparison';

export function ImageComparisonBasic() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <ImageComparison
        enableHover={true}
        className="aspect-[16/10] w-full rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden bg-slate-950"
      >
        <ImageComparisonImage
          src="/mp_dark.png"
          alt="Dark theme"
          position="left"
        />
        <ImageComparisonImage
          src="/mp_light.png"
          alt="Light theme"
          position="right"
        />
        <ImageComparisonSlider className="bg-emerald-500 w-1 shadow-[0_0_15px_rgba(16,185,129,0.9)]" />
      </ImageComparison>
      <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400 mt-3 px-1">
        <span>◂ Slide to reveal Dark UI</span>
        <span>Slide to reveal Light UI ▸</span>
      </div>
    </div>
  );
}

export default ImageComparisonBasic;
