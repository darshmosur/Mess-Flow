"use client";

import * as React from "react";
import { scalePoint, scaleLinear } from "@visx/scale";
import { AreaClosed, LinePath } from "@visx/shape";
import { LinearGradient } from "@visx/gradient";
import { localPoint } from "@visx/event";
import { motion, AnimatePresence } from "motion/react";

export interface TrendDataPoint {
  day: string;
  actualServed: number;
  unplannedBuffer: number;
  wasteKg: number;
}

interface BklitTrendChartProps {
  data: TrendDataPoint[];
  height?: number;
  className?: string;
}

export function BklitTrendChart({
  data,
  height = 240,
  className = "",
}: BklitTrendChartProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState<number>(500);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = React.useState<{ x: number; y: number } | null>(null);

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

  const margin = { top: 24, right: 16, bottom: 36, left: 36 };
  const innerWidth = Math.max(0, containerWidth - margin.left - margin.right);
  const innerHeight = Math.max(0, height - margin.top - margin.bottom);

  const xScale = React.useMemo(() => {
    return scalePoint<string>({
      range: [0, innerWidth],
      domain: data.map((d) => d.day),
      padding: 0.2,
    });
  }, [innerWidth, data]);

  const maxVal = React.useMemo(() => {
    const rawMax = Math.max(...data.map((d) => d.actualServed + d.unplannedBuffer), 100);
    return Math.ceil(rawMax * 1.15);
  }, [data]);

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

    const step = innerWidth / Math.max(1, data.length - 1);
    const closestIdx = Math.round(x / step);
    const clampedIdx = Math.max(0, Math.min(data.length - 1, closestIdx));

    setHoveredIndex(clampedIdx);
    setTooltipPos({ x: coords.x, y: coords.y });
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
            id="bklit-area-gradient-served"
            from="#8b5cf6"
            to="#8b5cf6"
            fromOpacity={0.35}
            toOpacity={0.0}
          />
        </defs>

        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Horizontal gridlines */}
          {yScale.ticks(4).map((tickVal) => {
            const y = yScale(tickVal);
            return (
              <g key={`trend-grid-${tickVal}`}>
                <line
                  x1={0}
                  x2={innerWidth}
                  y1={y}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.05)"
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

          {/* Area under curve */}
          <AreaClosed<TrendDataPoint>
            data={data}
            x={(d) => xScale(d.day) ?? 0}
            y={(d) => yScale(d.actualServed) ?? 0}
            yScale={yScale}
            fill="url(#bklit-area-gradient-served)"
          />

          {/* Line Path */}
          <LinePath<TrendDataPoint>
            data={data}
            x={(d) => xScale(d.day) ?? 0}
            y={(d) => yScale(d.actualServed) ?? 0}
            stroke="#8b5cf6"
            strokeWidth={2}
            strokeLinecap="round"
          />

          {/* Unplanned Buffer Dotted Line (Baseline Waste) */}
          <LinePath<TrendDataPoint>
            data={data}
            x={(d) => xScale(d.day) ?? 0}
            y={(d) => yScale(d.actualServed + d.unplannedBuffer) ?? 0}
            stroke="#f59e0b"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            strokeOpacity={0.6}
            strokeLinecap="round"
          />

          {/* Data point dots */}
          {data.map((d, i) => {
            const cx = xScale(d.day) ?? 0;
            const cy = yScale(d.actualServed) ?? 0;
            const isHovered = hoveredIndex === i;

            return (
              <g key={`trend-point-${d.day}`}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 5 : 3}
                  fill={isHovered ? "#ffffff" : "#8b5cf6"}
                  stroke="#14141c"
                  strokeWidth={2}
                  className="transition-all duration-150"
                />
                <text
                  x={cx}
                  y={innerHeight + 18}
                  textAnchor="middle"
                  className={`text-[11px] font-mono tracking-wider transition-colors ${
                    isHovered ? "fill-white font-semibold" : "fill-zinc-400"
                  }`}
                >
                  {d.day}
                </text>
              </g>
            );
          })}

          {/* Hover Crosshair line */}
          {activeItem && hoveredIndex !== null && (
            <line
              x1={xScale(activeItem.day) ?? 0}
              x2={xScale(activeItem.day) ?? 0}
              y1={0}
              y2={innerHeight}
              stroke="rgba(255, 255, 255, 0.25)"
              strokeDasharray="2 2"
            />
          )}
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
              left: Math.min(containerWidth - 170, Math.max(16, tooltipPos.x - 75)),
              top: Math.max(0, tooltipPos.y - 85),
            }}
            className="pointer-events-none absolute z-30 p-2.5 rounded-lg bg-[#14141c]/95 border border-white/10 shadow-xl backdrop-blur-md min-w-[150px]"
          >
            <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-300 border-b border-white/10 pb-1 mb-1.5 flex items-center justify-between">
              <span>{activeItem.day}</span>
              <span className="text-[10px] text-emerald-400 font-normal">
                -{activeItem.wasteKg}kg waste
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono gap-3">
              <span className="flex items-center gap-1.5 text-violet-400">
                <span className="w-2 h-2 rounded-full bg-violet-500" />
                Actual Served:
              </span>
              <span className="font-bold text-white">{activeItem.actualServed}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono gap-3 mt-1">
              <span className="flex items-center gap-1.5 text-amber-400/80">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Overprep Avoided:
              </span>
              <span className="font-bold text-zinc-300">+{activeItem.unplannedBuffer}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
