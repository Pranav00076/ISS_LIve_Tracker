import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PlaySquare, StopCircle } from "lucide-react";
import { Position, calculateSpeed } from "../utils/geo";
import { cn } from "../utils/cn";
import { format } from "date-fns";

interface SpeedChartProps {
  history: Position[];
  className?: string;
}

export function SpeedChart({ history, className }: SpeedChartProps) {
  const [animate, setAnimate] = useState(false);

  const data = useMemo(() => {
    if (history.length < 2) return [];

    const chartData = [];
    for (let i = 1; i < history.length; i++) {
      const prev = history[i - 1];
      const curr = history[i];
      const timeDiff = curr.timestamp - prev.timestamp;

      let speed = 0;
      if (timeDiff > 0) {
        speed = calculateSpeed(prev, curr, timeDiff);
      }

      chartData.push({
        time: format(new Date(curr.timestamp * 1000), "HH:mm:ss"),
        speed: Math.round(speed),
      });
    }
    return chartData;
  }, [history]);

  if (history.length < 2) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center text-slate-500 h-64 bg-white/50 dark:bg-slate-800/50 rounded-xl",
          className,
        )}
      >
        <p>Gathering data for speed trend...</p>
        <p className="text-xs mt-2">Needs at least 2 data points (Wait ~15s)</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-white/80 dark:bg-[#151828]/80 backdrop-blur-md rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-800",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
          ISS Speed Trend (km/h)
        </h3>
        <button
          onClick={() => setAnimate(!animate)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 text-xs transition-colors"
          title={animate ? "Disable animations" : "Enable animations"}
        >
          {animate ? <StopCircle size={14} /> : <PlaySquare size={14} />}
          <span>{animate ? "Static" : "Animate"}</span>
        </button>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#cbd5e1"
              opacity={0.5}
            />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#64748b" }}
              angle={-45}
              textAnchor="end"
              height={40}
            />
            <YAxis
              domain={["auto", "auto"]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#64748b" }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #1e293b",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                color: "#f8fafc",
              }}
              itemStyle={{ color: "#f8fafc" }}
              labelStyle={{ color: "#94a3b8", fontSize: "12px" }}
            />
            <Line
              type="monotone"
              dataKey="speed"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ r: 3, fill: "#ef4444", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
              isAnimationActive={animate}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
