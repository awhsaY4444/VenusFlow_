import { useEffect, useRef } from "react";

export function DropdownPanel({
  align = "right",
  open,
  onClose,
  className = "",
  children,
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    function handlePointerDown(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      ref={panelRef}
      className={`absolute top-[calc(100%+0.75rem)] z-50 min-w-[220px] rounded-2xl border border-line bg-surface p-2 shadow-[0_20px_60px_rgba(15,23,32,0.14)] ${align === "left" ? "left-0" : "right-0"} ${className}`}
    >
      {children}
    </div>
  );
}
