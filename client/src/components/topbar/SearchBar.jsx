import { Command, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { DropdownPanel } from "./DropdownPanel";
import { tr } from "../../utils/i18n";

function buildResults(query) {
  if (!query.trim()) {
    return [];
  }

  return [
    { id: "task", label: tr(`Search tasks for "${query}"`, `"${query}" के लिए टास्क खोजें`), meta: tr("Tasks", "टास्क") },
    { id: "people", label: tr(`Find teammates matching "${query}"`, `"${query}" से मिलते टीम सदस्य खोजें`), meta: tr("Team", "टीम") },
    { id: "activity", label: tr(`Scan activity mentioning "${query}"`, `"${query}" वाली एक्टिविटी खोजें`), meta: tr("Activity", "एक्टिविटी") },
  ];
}

export function SearchBar({ value, onChange, placeholder }) {
  const [localValue, setLocalValue] = useState(value);
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  useEffect(() => {
    function handleShortcut(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    }

    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  const results = useMemo(() => buildResults(localValue), [localValue]);

  return (
    <div className="relative ml-auto w-full max-w-xl">
      <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-ink-500" />
      <input
        ref={inputRef}
        type="text"
        className="topbar-input w-full cursor-text pr-18 transition duration-150"
        value={localValue}
        onFocus={() => setOpen(true)}
        onChange={(event) => setLocalValue(event.target.value)}
        placeholder={placeholder}
      />
      <div className="pointer-events-none absolute right-3 top-1/2 z-10 flex -translate-y-1/2 items-center gap-1 rounded-lg border border-line bg-surface px-2 py-1 text-[11px] text-ink-500">
        Ctrl
        <Command className="h-3.5 w-3.5" />
        K
      </div>

      <DropdownPanel open={open && results.length > 0} onClose={() => setOpen(false)} className="left-0 right-0 w-full">
        <div className="px-3 pb-2 pt-1">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-500">
            {tr("Search results", "खोज परिणाम")}
          </p>
        </div>
        <div className="space-y-1">
          {results.map((result) => (
            <button
              key={result.id}
              type="button"
              className="flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-left transition duration-150 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100"
              onClick={() => {
                setLocalValue(result.label);
                onChange(result.label);
                setOpen(false);
              }}
            >
              <div>
                <p className="text-sm font-medium text-ink-950">{result.label}</p>
                <p className="text-xs text-ink-500">{result.meta}</p>
              </div>
            </button>
          ))}
        </div>
      </DropdownPanel>
    </div>
  );
}
