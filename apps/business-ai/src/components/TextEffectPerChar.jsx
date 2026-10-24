'use client';
import React from 'react';
import { TextEffect } from './core/text-effect';

export function TextEffectPerChar({
  text = 'Animate your ideas with motion-primitives',
  className = '',
  as = 'p'
}) {
  return (
    <TextEffect
      per="char"
      preset="fade"
      as={as}
      className={className}
    >
      {text}
    </TextEffect>
  );
}

export default TextEffectPerChar;
