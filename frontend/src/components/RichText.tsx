import type { ReactNode } from "react";

/** Renders plain text with blank-line paragraphs and **bold** segments. */
export default function RichText({ text, className }: { text: string; className?: string }) {
  const paragraphs = (text || "").split(/\n{2,}/).filter(Boolean);
  return (
    <div className={className}>
      {paragraphs.map((paragraph, index) => {
        const parts: ReactNode[] = [];
        const pieces = paragraph.split(/\*\*(.+?)\*\*/g);
        pieces.forEach((piece, pieceIndex) => {
          if (pieceIndex % 2 === 1) {
            parts.push(
              <strong key={pieceIndex} className="font-semibold text-ink">
                {piece}
              </strong>
            );
          } else if (piece) {
            parts.push(piece);
          }
        });
        return (
          <p key={index} className="mb-4 text-sm leading-relaxed last:mb-0 md:text-base md:leading-7">
            {parts}
          </p>
        );
      })}
    </div>
  );
}
