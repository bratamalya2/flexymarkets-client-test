import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { Badge } from "./badge";
import { Card } from "./card";
import { TrendingUp, Users, Eye, Star, Clock } from "lucide-react";

// 8 Unsplash finance/trading images, stable by photo ID
const CARD_IMAGES = [
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&q=80",
    "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&q=80",
    "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&q=80",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    "https://images.unsplash.com/photo-1642790551116-18e150f248e3?w=800&q=80",
    "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=800&q=80",
];

const AVATAR_GRADIENTS = [
    "from-violet-500 to-purple-700",
    "from-pink-500 to-rose-600",
    "from-sky-400 to-cyan-500",
    "from-emerald-400 to-teal-500",
    "from-orange-400 to-pink-500",
    "from-indigo-500 to-blue-600",
    "from-teal-400 to-cyan-700",
    "from-amber-400 to-orange-500",
];

const RISK_STYLES = {
    LOW:    { badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30", dot: "bg-emerald-400" },
    MEDIUM: { badge: "bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30", dot: "bg-amber-400" },
    HIGH:   { badge: "bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30", dot: "bg-red-400" },
};

const getImage      = (id) => CARD_IMAGES[(Number(id) || 0) % CARD_IMAGES.length];
const getGradient   = (id) => AVATAR_GRADIENTS[(Number(id) || 0) % AVATAR_GRADIENTS.length];
const getRisk       = (level) => RISK_STYLES[level] ?? RISK_STYLES.MEDIUM;

function MiniSparkline({ data }) {
    if (!data || data.length < 2) return null;
    const values = data.map((d) => parseFloat(d.totalPnL || 0));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const w = 80;
    const h = 28;
    const pts = values
        .slice(-12)
        .map((v, i, arr) => `${(i / (arr.length - 1)) * w},${h - ((v - min) / range) * h}`)
        .join(" ");
    const positive = values[values.length - 1] >= values[0];
    return (
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
            <polyline fill="none" stroke={positive ? "#4ade80" : "#f87171"} strokeWidth="1.5" strokeLinejoin="round" points={pts} />
        </svg>
    );
}

export function GlassTraderCard({ trader, onView, className }) {
    const [hovered, setHovered] = useState(false);
    const stats = trader.latestStats;
    const roi      = stats?.totalPnLPercentage ?? null;
    const winRate  = stats?.winRate ?? null;
    const drawdown = stats?.maxDrawdownPercent ?? null;
    const copiers  = stats?.activeCopiers ?? 0;
    const riskStyle = getRisk(trader.riskLevel);

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={cn("w-full h-full", className)}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
        >
            <Card className="group relative h-full overflow-hidden rounded-2xl border-gray-200 dark:border-white/[0.12] bg-white dark:bg-white/[0.06] dark:backdrop-blur-md transition-all duration-300 hover:border-gray-300 dark:hover:border-white/25 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-black/40 flex flex-col">

                {/* ── Image section ── */}
                <div className="relative aspect-[16/9] overflow-hidden flex-shrink-0">
                    <motion.img
                        src={getImage(trader.id)}
                        alt={trader.displayName}
                        className="h-full w-full object-cover"
                        animate={{ scale: hovered ? 1.07 : 1 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                    {/* Profile photo overlay (bottom-left) */}
                    {trader.profilePhoto && (
                        <div className="absolute bottom-12 left-3">
                            <img
                                src={`${import.meta.env.VITE_BASE_URL}${trader.profilePhoto}`}
                                alt={trader.displayName}
                                className="h-10 w-10 rounded-full object-cover border-2 border-white/80 shadow-md"
                            />
                        </div>
                    )}

                    {/* Bottom-up dark gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                    {/* Badges on image */}
                    <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
                        <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold backdrop-blur-sm", riskStyle.badge)}>
                            <span className={cn("h-1.5 w-1.5 rounded-full", riskStyle.dot)} />
                            {trader.riskLevel}
                        </span>
                        {trader.tradingStyle && (
                            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
                                {trader.tradingStyle.charAt(0) + trader.tradingStyle.slice(1).toLowerCase()}
                            </span>
                        )}
                        {(trader.instruments || []).slice(0, 2).map((inst) => (
                            <span key={inst} className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.08] px-2 py-0.5 text-[11px] text-white/80 backdrop-blur-sm">
                                {inst.charAt(0) + inst.slice(1).toLowerCase()}
                            </span>
                        ))}
                    </div>

                    {/* Mini sparkline top-right */}
                    <div className="absolute top-3 right-3 opacity-70">
                        <MiniSparkline data={trader.pnlPerformanceChart} />
                    </div>

                    {/* Hover overlay CTA */}
                    <AnimatePresence>
                        {hovered && (
                            <motion.div
                                key="overlay"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]"
                            >
                                <motion.button
                                    initial={{ scale: 0.9, y: 8 }}
                                    animate={{ scale: 1, y: 0 }}
                                    exit={{ scale: 0.9, y: 8 }}
                                    transition={{ duration: 0.2 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onView(trader.id)}
                                    className="flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 shadow-xl shadow-black/30"
                                >
                                    <Eye className="h-4 w-4" />
                                    View Profile
                                </motion.button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ── Content section ── */}
                <div className="flex flex-col gap-3 p-4 flex-1">

                    {/* Trader name + avatar */}
                    <div className="flex items-center gap-2.5">
                        <div className={cn("h-9 w-9 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm flex-shrink-0", getGradient(trader.id))}>
                            {(trader.displayName || "T")[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-900 dark:text-white leading-tight">{trader.displayName}</p>
                            <p className="truncate text-xs text-gray-500 dark:text-white/50">{trader.user?.name || trader.user?.userName || ""}</p>
                        </div>
                    </div>

                    {/* ROI — the headline metric */}
                    <div className="text-center py-1">
                        <p className={cn("text-2xl font-black tracking-tight leading-none", roi !== null ? (roi >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400") : "text-gray-300 dark:text-white/40")}>
                            {roi !== null ? `${roi >= 0 ? "+" : ""}${parseFloat(roi).toFixed(2)}%` : "—"}
                        </p>
                        <p className="text-[11px] text-gray-400 dark:text-white/40 mt-0.5">Total ROI</p>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-1 rounded-xl bg-gray-50 dark:bg-white/[0.05] p-2.5">
                        <div className="text-center">
                            <p className="text-xs font-semibold text-gray-800 dark:text-white/90">
                                {winRate !== null ? `${parseFloat(winRate).toFixed(1)}%` : "—"}
                            </p>
                            <p className="text-[10px] text-gray-400 dark:text-white/40">Win Rate</p>
                        </div>
                        <div className="text-center border-x border-gray-200 dark:border-white/10">
                            <p className="text-xs font-semibold text-red-500 dark:text-red-400/90">
                                {drawdown !== null ? `${parseFloat(drawdown).toFixed(1)}%` : "—"}
                            </p>
                            <p className="text-[10px] text-gray-400 dark:text-white/40">Max DD</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-semibold text-gray-800 dark:text-white/90">{copiers}</p>
                            <p className="text-[10px] text-gray-400 dark:text-white/40">Copiers</p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between border-t border-gray-100 dark:border-white/[0.08] pt-3 mt-auto">
                        <div className="flex items-center gap-1 text-gray-400 dark:text-white/40">
                            <Users className="h-3 w-3" />
                            <span className="text-[11px]">{copiers} copying</span>
                        </div>
                        {trader.reviewsCount > 0 && (
                            <div className="flex items-center gap-1 text-gray-400 dark:text-white/40">
                                <Star className="h-3 w-3" />
                                <span className="text-[11px]">{parseFloat(trader.reviewsRating).toFixed(1)}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1 text-gray-400 dark:text-white/40">
                            <TrendingUp className="h-3 w-3" />
                            <span className="text-[11px]">Min ${trader.minimumCopyBalance}</span>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
