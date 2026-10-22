import { Fragment } from 'react';

/**
 * 辞書の文言記法を描画する。
 * {…} = inline-block の塊 / ¶ = 改行 / § = PC幅のみの改行
 */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\{[^}]*\}|¶|§)/).map((part, i) => {
        if (part === '¶') return <br key={i} />;
        if (part === '§') return <br key={i} className="pc-only" />;
        if (part.startsWith('{')) {
          return <span key={i} className="inline-block">{part.slice(1, -1)}</span>;
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
