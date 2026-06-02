import { useEffect, useRef } from "react";

export type ReactionId = "me-importa" | "gracias" | "interesante" | "me-alegra";

export const REACTIONS: { id: ReactionId; emoji: string; label: string }[] = [
  { id: "me-importa", emoji: "🤍", label: "Me importa" },
  { id: "gracias", emoji: "🙏", label: "Gracias" },
  { id: "interesante", emoji: "💡", label: "Interesante" },
  { id: "me-alegra", emoji: "😊", label: "Me alegra" },
];

interface ReactionsPopupProps {
  current: ReactionId | null;
  onSelect: (reaction: ReactionId | null) => void;
  onClose: () => void;
}

export function ReactionsPopup({ current, onSelect, onClose }: ReactionsPopupProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute bottom-full left-0 mb-2 z-50 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 flex gap-1 animate-in fade-in slide-in-from-bottom-2 duration-150"
    >
      {REACTIONS.map(({ id, emoji, label }) => (
        <button
          key={id}
          onClick={() => {
            onSelect(current === id ? null : id);
            onClose();
          }}
          className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors ${
            current === id
              ? "bg-emerald-50 ring-2 ring-emerald-400"
              : "hover:bg-gray-50"
          }`}
        >
          <span className="text-2xl leading-none">{emoji}</span>
          <span className="text-xs text-gray-600 whitespace-nowrap">{label}</span>
        </button>
      ))}
    </div>
  );
}
