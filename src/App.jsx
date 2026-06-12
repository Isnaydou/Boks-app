import { useEffect, useRef, useState } from "react";
import {
  BatteryFull,
  BicepsFlexed,
  Check,
  ChevronLeft,
  CircleCheck,
  Crown,
  Dumbbell,
  EllipsisVertical,
  Flame,
  Footprints,
  Lock,
  Medal,
  Plus,
  RotateCcw,
  Shield,
  Signal,
  Skull,
  Swords,
  Target,
  Trash2,
  TriangleAlert,
  Trophy,
  Wifi,
  X,
  Zap,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Constants & seed data                                              */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "vechtstijl:v1";

// Literal class strings per accent — Tailwind needs them spelled out.
const ACCENTS = {
  red: {
    label: "Bloedrood",
    text: "text-red-500",
    bg: "bg-red-600",
    fg: "text-white",
    soft: "bg-red-500/10",
    bar: "from-red-600 to-red-400",
    glow: "shadow-red-900/60",
    strike: "decoration-red-500/60",
  },
  orange: {
    label: "Vuur",
    text: "text-orange-500",
    bg: "bg-orange-600",
    fg: "text-white",
    soft: "bg-orange-500/10",
    bar: "from-orange-600 to-amber-400",
    glow: "shadow-orange-900/60",
    strike: "decoration-orange-500/60",
  },
  gold: {
    label: "Goud",
    text: "text-amber-400",
    bg: "bg-amber-500",
    fg: "text-black",
    soft: "bg-amber-400/10",
    bar: "from-amber-500 to-yellow-300",
    glow: "shadow-amber-900/60",
    strike: "decoration-amber-400/60",
  },
  yellow: {
    label: "Neon geel",
    text: "text-yellow-300",
    bg: "bg-yellow-400",
    fg: "text-black",
    soft: "bg-yellow-300/10",
    bar: "from-yellow-400 to-lime-300",
    glow: "shadow-yellow-900/60",
    strike: "decoration-yellow-300/60",
  },
};

const SPORT_ICONS = {
  swords: Swords,
  shield: Shield,
  flame: Flame,
  biceps: BicepsFlexed,
  dumbbell: Dumbbell,
  zap: Zap,
  trophy: Trophy,
  target: Target,
  skull: Skull,
  crown: Crown,
  medal: Medal,
  footprints: Footprints,
};

// Gear that every fighter needs, used as optional starter kit for custom sports.
const BASE_ITEMS = [
  "Mouth guard",
  "Sport T-shirt",
  "Sportbroek",
  "Onderbroek",
  "Parfum",
  "Deo",
  "Handdoek",
  "Water",
];

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

const mkItems = (names) => names.map((name) => ({ id: uid(), name, checked: false }));

const seedSports = () => [
  {
    id: uid(),
    name: "MMA",
    icon: "swords",
    accent: "red",
    custom: false,
    items: mkItems([
      "MMA Handschoenen",
      "Scheen bescherming",
      "Hand wraps",
      "Mouth guard",
      "Sport T-shirt",
      "Sportbroek",
      "Onderbroek",
      "Parfum",
      "Deo",
      "Handdoek",
      "Water",
    ]),
  },
  {
    id: uid(),
    name: "Jiu-jitsu",
    icon: "shield",
    accent: "gold",
    custom: false,
    items: mkItems([
      "Mouth guard",
      "Sport T-shirt",
      "Sportbroek",
      "Onderbroek",
      "Parfum",
      "Deo",
      "Handdoek",
      "Water",
      "jiu jitsu riem",
    ]),
  },
  {
    id: uid(),
    name: "Worstelen",
    icon: "biceps",
    accent: "yellow",
    custom: false,
    items: mkItems([
      "Mouth guard",
      "Sport T-shirt",
      "Sportbroek",
      "Onderbroek",
      "Parfum",
      "Deo",
      "Handdoek",
      "Water",
    ]),
  },
  {
    id: uid(),
    name: "Muay thai",
    icon: "flame",
    accent: "orange",
    custom: false,
    items: mkItems([
      "Bokshandschoenen",
      "Scheen bescherming",
      "Hoofd bescherming",
      "Hand wraps",
      "Mouth guard",
      "Sport T-shirt",
      "Sportbroek",
      "Onderbroek",
      "Parfum",
      "Deo",
      "Handdoek",
      "Water",
    ]),
  },
];

function loadSports() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        Array.isArray(parsed) &&
        parsed.every((s) => s && typeof s.name === "string" && Array.isArray(s.items))
      ) {
        return parsed;
      }
    }
  } catch {
    /* corrupt storage → reseed */
  }
  return seedSports();
}

const buzz = (ms = 12) => {
  try {
    navigator.vibrate?.(ms);
  } catch {
    /* not supported */
  }
};

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */

function MenuItem({ icon: Icon, label, danger = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-4 py-3 text-left text-[13px] font-bold tracking-wide transition-colors active:bg-zinc-800 ${
        danger ? "text-red-500" : "text-zinc-200"
      }`}
    >
      <Icon size={16} strokeWidth={2.4} className="shrink-0" />
      {label}
    </button>
  );
}

function Sheet({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50">
      <button
        aria-label="Sluiten"
        onClick={onClose}
        className="absolute inset-0 animate-fade-in cursor-default bg-black/70"
      />
      <div className="absolute inset-x-0 bottom-0 animate-sheet-up rounded-t-3xl border-t border-zinc-800 bg-zinc-950 pb-7 shadow-2xl">
        <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-zinc-700" />
        <div className="flex items-center justify-between px-5 pb-2 pt-3">
          <h2 className="font-display text-xl tracking-wide text-white">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Sluiten"
            className="rounded-full p-2 text-zinc-400 transition-colors active:bg-zinc-800"
          >
            <X size={18} strokeWidth={2.4} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  App                                                                */
/* ------------------------------------------------------------------ */

export default function App() {
  const [sports, setSports] = useState(loadSports);
  const [activeId, setActiveId] = useState(null);
  const [screen, setScreen] = useState("home"); // "home" | "sport"

  // Protected edit mode (behind kebab menu) + overlays
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [addSportOpen, setAddSportOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Drafts for the two bottom sheets
  const [itemDraft, setItemDraft] = useState("");
  const [justAdded, setJustAdded] = useState("");
  const [sportDraft, setSportDraft] = useState("");
  const [sportIcon, setSportIcon] = useState("swords");
  const [sportAccent, setSportAccent] = useState("red");
  const [withBase, setWithBase] = useState(true);

  const [now, setNow] = useState(() => new Date());
  const justAddedTimer = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sports));
    } catch {
      /* storage full / unavailable */
    }
  }, [sports]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 15000);
    return () => {
      clearInterval(t);
      clearTimeout(justAddedTimer.current);
    };
  }, []);

  const active = sports.find((s) => s.id === activeId) ?? null;
  const readyCount = sports.filter(
    (s) => s.items.length > 0 && s.items.every((it) => it.checked)
  ).length;

  /* ----- actions ----- */

  const updateSport = (id, fn) =>
    setSports((prev) => prev.map((s) => (s.id === id ? fn(s) : s)));

  const openSport = (id) => {
    setActiveId(id);
    setMenuOpen(false);
    setDeleteMode(false);
    setScreen("sport");
  };

  const goHome = () => {
    setScreen("home");
    setMenuOpen(false);
    setDeleteMode(false);
    setAddItemOpen(false);
  };

  const openAddItem = () => {
    setMenuOpen(false);
    setItemDraft("");
    setJustAdded("");
    setAddItemOpen(true);
  };

  const toggleItem = (sportId, itemId) => {
    buzz();
    updateSport(sportId, (s) => ({
      ...s,
      items: s.items.map((it) =>
        it.id === itemId ? { ...it, checked: !it.checked } : it
      ),
    }));
  };

  const removeItem = (sportId, itemId) => {
    buzz(20);
    const sport = sports.find((s) => s.id === sportId);
    const remaining = sport ? sport.items.filter((it) => it.id !== itemId) : [];
    updateSport(sportId, (s) => ({
      ...s,
      items: s.items.filter((it) => it.id !== itemId),
    }));
    if (remaining.length === 0) setDeleteMode(false);
  };

  const uncheckAll = (sportId) =>
    updateSport(sportId, (s) => ({
      ...s,
      items: s.items.map((it) => ({ ...it, checked: false })),
    }));

  const submitItem = (e) => {
    e.preventDefault();
    const name = itemDraft.trim();
    if (!name || !active) return;
    updateSport(active.id, (s) => ({
      ...s,
      items: [...s.items, { id: uid(), name, checked: false }],
    }));
    setItemDraft("");
    setJustAdded(name);
    clearTimeout(justAddedTimer.current);
    justAddedTimer.current = setTimeout(() => setJustAdded(""), 1800);
  };

  const openAddSport = () => {
    setSportDraft("");
    setSportIcon("swords");
    setSportAccent("red");
    setWithBase(true);
    setAddSportOpen(true);
  };

  const submitSport = (e) => {
    e.preventDefault();
    const name = sportDraft.trim();
    if (!name) return;
    const sport = {
      id: uid(),
      name,
      icon: sportIcon,
      accent: sportAccent,
      custom: true,
      items: withBase ? mkItems(BASE_ITEMS) : [],
    };
    setSports((prev) => [...prev, sport]);
    setAddSportOpen(false);
    openSport(sport.id);
  };

  const removeSport = () => {
    if (!active) return;
    setSports((prev) => prev.filter((s) => s.id !== active.id));
    setConfirmDelete(false);
    goHome();
  };

  /* ----- derived for the active sport ----- */

  const acc = ACCENTS[active?.accent] ?? ACCENTS.red;
  const total = active?.items.length ?? 0;
  const done = active?.items.filter((it) => it.checked).length ?? 0;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const complete = total > 0 && done === total;

  const time = now.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });

  /* ----- screens ----- */

  const homeScreen = (
    <div className="flex h-full flex-col">
      <header className="px-5 pb-1 pt-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-extrabold tracking-[0.35em] text-red-500">
              FIGHT GEAR CHECKLIST
            </p>
            <h1 className="mt-1 font-display text-[34px] leading-none tracking-wide text-white">
              VECHT<span className="text-red-600">STIJL</span>
            </h1>
            <p className="mt-2 text-[13px] font-medium text-zinc-500">
              Pak je tas in. Geen excuses.
            </p>
          </div>
          <div className="mt-1 flex h-12 w-12 rotate-6 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-red-900 shadow-lg shadow-red-950/60 ring-1 ring-red-500/30">
            <Swords size={22} strokeWidth={2.2} className="text-white" />
          </div>
        </div>
      </header>

      <div className="mt-4 flex items-center justify-between px-5">
        <p className="text-[10px] font-extrabold tracking-[0.3em] text-zinc-500">
          JOUW SPORTEN
        </p>
        {sports.length > 0 && (
          <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-[10px] font-bold tracking-wider text-zinc-400">
            {readyCount}/{sports.length} KLAAR
          </span>
        )}
      </div>

      <div className="no-scrollbar mt-3 flex-1 overflow-y-auto overscroll-contain px-5 pb-28">
        {sports.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center pb-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-900 text-zinc-600">
              <Skull size={28} strokeWidth={2} />
            </div>
            <p className="mt-4 font-display text-xl tracking-wide text-zinc-300">
              GEEN SPORTEN
            </p>
            <p className="mt-1 max-w-[220px] text-[13px] text-zinc-500">
              Voeg je eerste vechtsport toe met de rode knop.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {sports.map((s, i) => {
              const a = ACCENTS[s.accent] ?? ACCENTS.red;
              const Icon = SPORT_ICONS[s.icon] ?? Flame;
              const sTotal = s.items.length;
              const sDone = s.items.filter((it) => it.checked).length;
              const ready = sTotal > 0 && sDone === sTotal;
              return (
                <button
                  key={s.id}
                  onClick={() => openSport(s.id)}
                  style={{ animationDelay: `${Math.min(i * 45, 270)}ms` }}
                  className={`group relative animate-rise overflow-hidden rounded-2xl border bg-gradient-to-b from-zinc-900 to-zinc-950 p-4 text-left transition-transform duration-150 active:scale-[0.96] ${
                    ready ? "border-amber-400/40" : "border-zinc-800"
                  }`}
                >
                  <div
                    className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl ${a.soft}`}
                  />
                  <span
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${a.soft} ${a.text}`}
                  >
                    <Icon size={22} strokeWidth={2.2} />
                  </span>
                  {ready && (
                    <CircleCheck
                      size={18}
                      strokeWidth={2.4}
                      className="absolute right-3 top-3 text-amber-400"
                    />
                  )}
                  <h3 className="mt-3 truncate font-display text-[17px] uppercase leading-tight tracking-wide text-zinc-100">
                    {s.name}
                  </h3>
                  <p className="mt-0.5 text-[10px] font-bold tracking-wider text-zinc-500">
                    {sDone}/{sTotal} INGEPAKT
                  </p>
                  <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${a.bar} transition-all duration-500`}
                      style={{ width: sTotal ? `${(sDone / sTotal) * 100}%` : "0%" }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={openAddSport}
        aria-label="Sport toevoegen"
        className="absolute bottom-7 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-700 text-white shadow-xl shadow-red-950/70 ring-1 ring-red-400/30 transition-transform active:scale-90"
      >
        <Plus size={26} strokeWidth={2.6} />
      </button>
    </div>
  );

  const sportScreen = active && (
    <div className="flex h-full flex-col">
      {/* App bar */}
      <div className="flex items-center gap-1 px-2 pt-1">
        <button
          onClick={goHome}
          aria-label="Terug"
          className="rounded-full p-2.5 text-zinc-300 transition-colors active:bg-zinc-800"
        >
          <ChevronLeft size={22} strokeWidth={2.4} />
        </button>
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-display text-[19px] uppercase leading-none tracking-wide text-white">
            {active.name}
          </h2>
          <p className="mt-1 text-[10px] font-bold tracking-[0.2em] text-zinc-500">
            {total} SPULLEN
          </p>
        </div>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Beheer menu"
          className={`rounded-full p-2.5 transition-colors active:bg-zinc-800 ${
            menuOpen ? "bg-zinc-800 text-white" : "text-zinc-300"
          }`}
        >
          <EllipsisVertical size={20} strokeWidth={2.4} />
        </button>
      </div>

      {/* Progress hero */}
      <div className="px-5 pt-2">
        <div
          className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br from-zinc-900 to-zinc-950 p-4 ${
            complete ? "border-amber-400/50" : "border-zinc-800"
          }`}
        >
          <div
            className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl ${acc.soft}`}
          />
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-[9px] font-extrabold tracking-[0.3em] text-zinc-500">
                VOORTGANG
              </p>
              <p className="mt-1 font-display text-[34px] leading-none text-white">
                {done}
                <span className="text-zinc-600">/{total}</span>
              </p>
            </div>
            {complete ? (
              <span className="flex animate-scale-in items-center gap-1.5 rounded-xl bg-amber-400 px-3 py-2 font-display text-[12px] tracking-wide text-black">
                <Flame size={14} strokeWidth={2.5} />
                KLAAR VOOR DE STRIJD
              </span>
            ) : (
              <span className={`font-display text-2xl ${acc.text}`}>{pct}%</span>
            )}
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-800">
            <div
              className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${
                complete ? "from-amber-500 to-yellow-300" : acc.bar
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {deleteMode && (
          <div className="mt-3 flex animate-rise items-center justify-between rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-2.5">
            <p className="flex items-center gap-2 text-[11px] font-bold tracking-wide text-red-400">
              <Trash2 size={13} strokeWidth={2.4} />
              VERWIJDERMODUS ACTIEF
            </p>
            <button
              onClick={() => setDeleteMode(false)}
              className="rounded-lg bg-red-600 px-3 py-1 text-[11px] font-extrabold text-white transition-transform active:scale-95"
            >
              KLAAR
            </button>
          </div>
        )}
      </div>

      {/* Gear list */}
      <div
        key={active.id}
        className="no-scrollbar mt-3 flex-1 space-y-2 overflow-y-auto overscroll-contain px-5 pb-24"
      >
        {active.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 px-6 py-12 text-center">
            <p className="font-display text-lg tracking-wide text-zinc-400">
              NOG GEEN SPULLEN
            </p>
            <p className="mt-1 text-[12px] text-zinc-600">
              Voeg je gear toe via het menu rechtsboven.
            </p>
            <button
              onClick={openAddItem}
              className="mt-4 flex items-center gap-1.5 rounded-xl bg-zinc-800 px-4 py-2 text-[12px] font-bold text-zinc-200 transition-transform active:scale-95"
            >
              <Plus size={14} strokeWidth={2.6} />
              Spullen toevoegen
            </button>
          </div>
        ) : deleteMode ? (
          active.items.map((it) => (
            <button
              key={it.id}
              onClick={() => removeItem(active.id, it.id)}
              className="flex w-full items-center gap-3.5 rounded-2xl border border-red-500/25 bg-red-950/20 px-4 py-3.5 text-left transition-transform duration-100 active:scale-[0.97]"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600/15 text-red-500">
                <Trash2 size={13} strokeWidth={2.4} />
              </span>
              <span className="min-w-0 flex-1 text-[15px] font-semibold leading-snug text-red-200/90">
                {it.name}
              </span>
              <X size={15} strokeWidth={2.6} className="shrink-0 text-red-500/70" />
            </button>
          ))
        ) : (
          active.items.map((it, i) => (
            <button
              key={it.id}
              onClick={() => toggleItem(active.id, it.id)}
              style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
              className="flex w-full animate-rise items-center gap-3.5 rounded-2xl border border-zinc-800/90 bg-zinc-900/70 px-4 py-3.5 text-left transition-transform duration-100 active:scale-[0.985]"
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] border-2 transition-colors duration-150 ${
                  it.checked
                    ? `${acc.bg} border-transparent shadow-md ${acc.glow}`
                    : "border-zinc-600 bg-zinc-950"
                }`}
              >
                {it.checked && (
                  <Check size={15} strokeWidth={4} className={`animate-pop ${acc.fg}`} />
                )}
              </span>
              <span
                className={`min-w-0 flex-1 text-[15px] font-semibold leading-snug transition-colors duration-150 ${
                  it.checked
                    ? `text-zinc-600 line-through decoration-2 ${acc.strike}`
                    : "text-zinc-100"
                }`}
              >
                {it.name}
              </span>
            </button>
          ))
        )}
      </div>

      {/* Kebab menu — protected edit options live here */}
      {menuOpen && (
        <>
          <button
            aria-label="Menu sluiten"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 z-30 cursor-default"
          />
          <div className="absolute right-3 top-12 z-40 w-60 animate-scale-in overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 py-1.5 shadow-2xl shadow-black/60">
            <p className="flex items-center gap-1.5 px-4 pb-1.5 pt-2 text-[9px] font-extrabold tracking-[0.25em] text-zinc-500">
              <Lock size={10} strokeWidth={2.6} />
              BEHEER
            </p>
            <MenuItem icon={Plus} label="Spullen toevoegen" onClick={openAddItem} />
            <MenuItem
              icon={Trash2}
              label={deleteMode ? "Stop met verwijderen" : "Spullen verwijderen"}
              onClick={() => {
                setMenuOpen(false);
                setDeleteMode((d) => !d);
              }}
            />
            <MenuItem
              icon={RotateCcw}
              label="Alles uitvinken"
              onClick={() => {
                setMenuOpen(false);
                uncheckAll(active.id);
              }}
            />
            <div className="mx-4 my-1 h-px bg-zinc-800" />
            <MenuItem
              danger
              icon={TriangleAlert}
              label="Sport verwijderen"
              onClick={() => {
                setMenuOpen(false);
                setConfirmDelete(true);
              }}
            />
          </div>
        </>
      )}
    </div>
  );

  /* ----- shell ----- */

  return (
    <div className="min-h-dvh w-full bg-[#060607] font-sans text-zinc-100 antialiased lg:flex lg:items-center lg:justify-center lg:py-8">
      {/* Desktop backdrop glows */}
      <div className="pointer-events-none fixed -left-32 -top-20 hidden h-[28rem] w-[28rem] rounded-full bg-red-600/10 blur-3xl lg:block" />
      <div className="pointer-events-none fixed -bottom-24 -right-24 hidden h-96 w-96 rounded-full bg-amber-500/5 blur-3xl lg:block" />

      <div className="relative">
        {/* Hardware buttons (Galaxy S24 Ultra style, desktop frame only) */}
        <div className="absolute -right-1 top-40 hidden h-20 w-1 rounded-r-md bg-zinc-700 lg:block" />
        <div className="absolute -right-1 top-64 hidden h-10 w-1 rounded-r-md bg-zinc-700 lg:block" />

        {/* Phone shell */}
        <div className="relative flex h-dvh w-full select-none flex-col overflow-hidden bg-zinc-950 lg:h-[896px] lg:max-h-[94vh] lg:w-[412px] lg:rounded-[1.9rem] lg:border-4 lg:border-zinc-800 lg:shadow-[0_0_90px_-20px_rgba(220,38,38,0.35)] lg:ring-1 lg:ring-zinc-700">
          {/* Punch-hole camera (desktop frame only) */}
          <div className="absolute left-1/2 top-2 z-[70] hidden h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-black shadow-[inset_0_0_3px_1px_rgba(63,63,70,0.7)] lg:block" />

          {/* Android status bar */}
          <div className="relative z-20 flex items-center justify-between px-6 pb-1 pt-2.5 text-zinc-300">
            <span className="text-[12px] font-bold tracking-widest">{time}</span>
            <span className="flex items-center gap-1.5">
              <Wifi size={13} strokeWidth={2.5} />
              <Signal size={13} strokeWidth={2.5} />
              <BatteryFull size={16} strokeWidth={2} />
            </span>
          </div>

          {/* Sliding screens: home ⇄ sport */}
          <div className="relative flex-1 overflow-hidden">
            <div
              className="flex h-full w-[200%] transition-transform duration-300 ease-[cubic-bezier(0.25,0.8,0.3,1)]"
              style={{
                transform: screen === "sport" ? "translateX(-50%)" : "translateX(0%)",
              }}
            >
              <section className="relative h-full w-1/2">{homeScreen}</section>
              <section className="relative h-full w-1/2">{sportScreen}</section>
            </div>
          </div>

          {/* Android gesture pill */}
          <div className="pointer-events-none absolute inset-x-0 bottom-1.5 z-30 flex justify-center">
            <div className="h-1 w-24 rounded-full bg-zinc-700" />
          </div>

          {/* Sheet: add custom sport */}
          <Sheet
            open={addSportOpen}
            onClose={() => setAddSportOpen(false)}
            title="NIEUWE SPORT"
          >
            <form onSubmit={submitSport} className="px-5 pt-1">
              <label className="text-[10px] font-extrabold tracking-[0.25em] text-zinc-500">
                NAAM
              </label>
              <input
                autoFocus
                value={sportDraft}
                onChange={(e) => setSportDraft(e.target.value)}
                maxLength={24}
                placeholder="bijv. Kickboksen"
                className="mt-1.5 w-full select-text rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3.5 text-[15px] font-semibold text-white placeholder-zinc-600 outline-none transition-colors focus:border-red-500"
              />

              <label className="mt-4 block text-[10px] font-extrabold tracking-[0.25em] text-zinc-500">
                ICOON
              </label>
              <div className="mt-2 grid grid-cols-6 gap-2">
                {Object.entries(SPORT_ICONS).map(([key, Icon]) => (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setSportIcon(key)}
                    aria-label={key}
                    className={`flex h-11 items-center justify-center rounded-xl border transition-all active:scale-90 ${
                      sportIcon === key
                        ? `${ACCENTS[sportAccent].soft} ${ACCENTS[sportAccent].text} border-current`
                        : "border-zinc-800 bg-zinc-900 text-zinc-500"
                    }`}
                  >
                    <Icon size={19} strokeWidth={2.2} />
                  </button>
                ))}
              </div>

              <label className="mt-4 block text-[10px] font-extrabold tracking-[0.25em] text-zinc-500">
                KLEUR
              </label>
              <div className="mt-2 flex gap-2.5">
                {Object.entries(ACCENTS).map(([key, a]) => (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setSportAccent(key)}
                    aria-label={a.label}
                    className={`h-9 flex-1 rounded-xl transition-all active:scale-95 ${a.bg} ${
                      sportAccent === key
                        ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-950"
                        : "opacity-40"
                    }`}
                  />
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
                <div>
                  <p className="text-[13px] font-bold text-zinc-200">
                    Basisspullen meenemen
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    T-shirt, handdoek, water, enz.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={withBase}
                  onClick={() => setWithBase((v) => !v)}
                  className={`h-7 w-12 shrink-0 rounded-full p-1 transition-colors ${
                    withBase ? "bg-red-600" : "bg-zinc-700"
                  }`}
                >
                  <span
                    className={`block h-5 w-5 rounded-full bg-white transition-transform ${
                      withBase ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <button
                type="submit"
                disabled={!sportDraft.trim()}
                className={`mt-4 w-full rounded-xl py-3.5 font-display text-[15px] tracking-wider transition-all active:scale-[0.98] disabled:opacity-40 ${ACCENTS[sportAccent].bg} ${ACCENTS[sportAccent].fg}`}
              >
                SPORT TOEVOEGEN
              </button>
            </form>
          </Sheet>

          {/* Sheet: add gear item */}
          <Sheet
            open={addItemOpen && !!active}
            onClose={() => setAddItemOpen(false)}
            title="SPULLEN TOEVOEGEN"
          >
            <form onSubmit={submitItem} className="px-5 pt-1">
              <input
                autoFocus
                value={itemDraft}
                onChange={(e) => setItemDraft(e.target.value)}
                maxLength={40}
                placeholder="bijv. Springtouw"
                className="w-full select-text rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3.5 text-[15px] font-semibold text-white placeholder-zinc-600 outline-none transition-colors focus:border-red-500"
              />
              <button
                type="submit"
                disabled={!itemDraft.trim()}
                className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 font-display text-[15px] tracking-wider transition-all active:scale-[0.98] disabled:opacity-40 ${acc.bg} ${acc.fg}`}
              >
                <Plus size={16} strokeWidth={2.6} />
                TOEVOEGEN
              </button>
              <p
                className={`mt-2.5 h-4 text-center text-[11px] font-semibold text-emerald-400 transition-opacity ${
                  justAdded ? "opacity-100" : "opacity-0"
                }`}
              >
                {justAdded ? `‘${justAdded}’ toegevoegd` : ""}
              </p>
            </form>
          </Sheet>

          {/* Confirm: delete sport */}
          {confirmDelete && active && (
            <div className="absolute inset-0 z-[60] flex items-center justify-center p-8">
              <button
                aria-label="Annuleren"
                onClick={() => setConfirmDelete(false)}
                className="absolute inset-0 animate-fade-in cursor-default bg-black/70"
              />
              <div className="relative w-full animate-scale-in rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600/15 text-red-500">
                  <TriangleAlert size={20} strokeWidth={2.4} />
                </div>
                <h3 className="mt-3 font-display text-lg tracking-wide text-white">
                  SPORT VERWIJDEREN?
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-zinc-500">
                  ‘{active.name}’ en alle spullen worden definitief verwijderd.
                </p>
                <div className="mt-4 flex gap-2.5">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 rounded-xl bg-zinc-800 py-3 text-[13px] font-bold text-zinc-200 transition-transform active:scale-[0.97]"
                  >
                    Annuleren
                  </button>
                  <button
                    onClick={removeSport}
                    className="flex-1 rounded-xl bg-red-600 py-3 text-[13px] font-extrabold text-white transition-transform active:scale-[0.97]"
                  >
                    Verwijderen
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
