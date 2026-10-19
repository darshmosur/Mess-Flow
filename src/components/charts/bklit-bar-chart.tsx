"use client";

import * as React from "react";
import { scaleBand, scaleLinear } from "@visx/scale";
import { LinearGradient } from "@visx/gradient";
import { localPoint } from "@visx/event";
import { motion, AnimatePresence } from "motion/react";

export interface BarDataPoint {
  label: string;
  confirmed: number;
  expected: number;
  capacity?: number;
  [key: string]: unknown;
}

interface BklitBarChartProps {
  data: BarDataPoint[];
  height?: number;
  className?: string;
  showExpected?: boolean;
}

export function BklitBarChart({
  data,
  height = 240,
  className = "",
  showExpected = true,
}: BklitBarChartProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState<number>(500);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = React.useState<{ x: number; y: number } | null>(null);

  // ResizeObserver for responsive width
  React.useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const margin = { top: 28, right: 16, bottom: 36, left: 36 };
  const innerWidth = Math.max(0, containerWidth - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);

  // Scales
  const xScale = React.useMemo(() => {
    return scaleBand<string>({
      range: [0, innerWidth],
      domain: data.map((d) => d.label),
      padding: 0.28,
    });
  }, [innerWidth, data]);

  const maxVal = React.useMemo(() => {
    const rawMax = Math.max(
      ...data.map((d) => Math.max(d.confirmed, showExpected ? d.expected : 0, 50))
    );
    return Math.ceil(rawMax * 1.15);
  }, [data, showExpected]);

  const yScale = React.useMemo(() => {
    return scaleLinear<number>({
      range: [innerHeight, 0],
      domain: [0, maxVal],
      nice: true,
    });
  }, [innerHeight, maxVal]);

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const coords = localPoint(event);
    if (!coords) return;
    const x = coords.x - margin.left;
    if (x < 0 || x > innerWidth) {
      setHoveredIndex(null);
      setTooltipPos(null);
      return;
    }

    const bandWidth = xScale.step();
    const index = Math.floor(x / bandWidth);
    if (index >= 0 && index < data.length) {
      setHoveredIndex(index);
      setTooltipPos({ x: coords.x, y: coords.y });
    } else {
      setHoveredIndex(null);
      setTooltipPos(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setTooltipPos(null);
  };

  const activeItem = hoveredIndex !== null ? data[hoveredIndex] : null;

  return (
    <div ref={containerRef} className={`relative w-full select-none ${className}`}>
      <svg
        width={containerWidth}
        height={height}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="overflow-visible"
      >
        <defs>
          <LinearGradient
            id="bklit-bar-gradient-confirmed"
            from="#8b5cf6"
            to="#6d28d9"
            fromOpacity={0.95}
            toOpacity={0.65}
          />
          <LinearGradient
            id="bklit-bar-gradient-expected"
            from="#10b981"
            to="#059669"
            fromOpacity={0.85}
            toOpacity={0.45}
          />
        </defs>

        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Horizontal gridlines */}
          {yScale.ticks(4).map((tickVal) => {
            const y = yScale(tickVal);
            return (
              <g key={`grid-${tickVal}`}>
                <line
                  x1={0}
                  x2={innerWidth}
                  y1={y}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.06)"
                  strokeDasharray="3 3"
                />
                <text
                  x={-8}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] fill-zinc-500 font-mono"
                >
                  {tickVal}
                </text>
              </g>
            );
          })}

          {/* Grouped Bars */}
          {data.map((d, i) => {
            const xBand = xScale(d.label) ?? 0;
            const fullBandWidth = xScale.bandwidth();
            const barW = showExpected ? fullBandWidth * 0.44 : fullBandWidth;
            const gap = fullBandWidth * 0.08;

            const confirmedH = Math.max(2, innerHeight - (yScale(d.confirmed) ?? innerHeight));
            const expectedH = Math.max(2, innerHeight - (yScale(d.expected) ?? innerHeight));

            const isHovered = hoveredIndex === i;
            const isDimmed = hoveredIndex !== null && !isHovered;

            return (
              <g
                key={`bar-group-${d.label}`}
                className="transition-opacity duration-200"
                style={{ opacity: isDimmed ? 0.35 : 1 }}
              >
                {/* Background hover pillar */}
                <rect
                  x={xBand - 4}
                  y={0}
                  width={fullBandWidth + 8}
                  height={innerHeight}
                  fill={isHovered ? "rgba(255, 255, 255, 0.03)" : "transparent"}
                  rx={4}
                />

                {/* Confirmed Bar */}
                <motion.rect
                  x={xBand}
                  y={innerHeight - confirmedH}
                  width={barW}
                  height={confirmedH}
                  fill="url(#bklit-bar-gradient-confirmed)"
                  rx={3}
                  initial={{ height: 0, y: innerHeight }}
                  animate={{ height: confirmedH, y: innerHeight - confirmedH }}
                  transition={{ duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Expected / Projected Bar */}
                {showExpected && (
                  <motion.rect
                    x={xBand + barW + gap}
                    y={innerHeight - expectedH}
                    width={barW}
                    height={expectedH}
                    fill="url(#bklit-bar-gradient-expected)"
                    rx={3}
                    initial={{ height: 0, y: innerHeight }}
                    animate={{ height: expectedH, y: innerHeight - expectedH }}
                    transition={{ duration: 0.65, delay: i * 0.1 + 0.05, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}

                {/* X-axis label */}
                <text
                  x={xBand + fullBandWidth / 2}
                  y={innerHeight + 18}
                  textAnchor="middle"
                  className={`text-[11px] font-mono tracking-wider transition-colors ${
                    isHovered ? "fill-white font-semibold" : "fill-zinc-400"
                  }`}
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Floating Interactive Tooltip */}
      <AnimatePresence>
        {activeItem && tooltipPos && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              left: Math.min(containerWidth - 160, Math.max(16, tooltipPos.x - 70)),
              top: Math.max(0, tooltipPos.y - 80),
            }}
            className="pointer-events-none absolute z-30 p-2.5 rounded-lg bg-[#14141c]/95 border border-white/10 shadow-xl backdrop-blur-md min-w-[140px]"
          >
            <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-300 border-b border-white/10 pb-1 mb-1.5">
              {activeItem.label}
            </div>
            <div className="flex items-center justify-between text-xs font-mono gap-3">
              <span className="flex items-center gap-1.5 text-violet-400">
                <span className="w-2 h-2 rounded-full bg-violet-500" />
                Confirmed:
              </span>
              <span className="font-bold text-white">{activeItem.confirmed}</span>
            </div>
            {showExpected && (
              <div className="flex items-center justify-between text-xs font-mono gap-3 mt-1">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Target Prep:
                </span>
                <span className="font-bold text-white">{activeItem.expected}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
