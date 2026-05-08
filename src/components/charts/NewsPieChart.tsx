import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Label,
} from "recharts";
import { PlaySquare, StopCircle } from "lucide-react";
import { cn } from "../../utils/cn";
import { ArticleCategory } from "../../hooks/useNews";

interface NewsPieChartProps {
  data: { name: string; value: number }[];
  selectedCategory: ArticleCategory;
  onCategorySelected: (category: ArticleCategory) => void;
  className?: string;
}

const COLORS: Record<string, string> = {
  Space: "#3b82f6", // blue-500
  Technology: "#8b5cf6", // violet-500
  Science: "#10b981", // emerald-500
  World: "#f59e0b", // amber-500
  AI: "#ec4899", // pink-500
};

export function NewsPieChart({
  data,
  selectedCategory,
  onCategorySelected,
  className,
}: NewsPieChartProps) {
  const [animate, setAnimate] = useState(false);

  const handlePieClick = (entry: any) => {
    if (selectedCategory === entry.name) {
      onCategorySelected("All"); // Toggle off
    } else {
      onCategorySelected(entry.name as ArticleCategory);
    }
  };

  const activeIndex = useMemo(() => {
    if (selectedCategory === "All") return -1;
    return data.findIndex((d) => d.name === selectedCategory);
  }, [selectedCategory, data]);

  const totalArticles = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);

  const centerText = useMemo(() => {
    if (selectedCategory === "All") return "All News";
    return selectedCategory;
  }, [selectedCategory]);

  const centerValue = useMemo(() => {
    if (selectedCategory === "All") return totalArticles;
    const cat = data.find((d) => d.name === selectedCategory);
    return cat ? cat.value : 0;
  }, [selectedCategory, totalArticles, data]);

  if (!data || data.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center text-slate-500 h-64 bg-white/50 dark:bg-[#151828]/50 rounded-xl border border-slate-200 dark:border-slate-800",
          className,
        )}
      >
        <p>No category data available</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-white/80 dark:bg-[#151828]/80 backdrop-blur-md rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
          News Distribution
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAnimate(!animate)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 text-xs transition-colors"
            title={animate ? "Disable animations" : "Enable animations"}
          >
            {animate ? <StopCircle size={14} /> : <PlaySquare size={14} />}
            <span>{animate ? "Static" : "Animate"}</span>
          </button>

          {selectedCategory !== "All" && (
            <button
              onClick={() => onCategorySelected("All")}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>
      <div className="h-[250px] sm:h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={85}
              paddingAngle={4}
              cornerRadius={6}
              dataKey="value"
              onClick={handlePieClick}
              className="cursor-pointer focus:outline-none"
              stroke="none"
              isAnimationActive={animate}
            >
              <Label
                content={({ viewBox }) => {
                  const { cx, cy } = viewBox as any;
                  return (
                    <g>
                      <text
                        x={cx}
                        y={cy - 5}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="text-3xl font-bold fill-slate-800 dark:fill-white"
                      >
                        {centerValue}
                      </text>
                      <text
                        x={cx}
                        y={cy + 18}
                        textAnchor="middle"
                        className="text-[10px] font-semibold fill-slate-500 uppercase tracking-wider"
                      >
                        {centerText}
                      </text>
                    </g>
                  );
                }}
              />
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name] || "#94a3b8"}
                  className={cn(
                    "transition-all duration-300 outline-none",
                    selectedCategory === "All"
                      ? "opacity-100 hover:opacity-80"
                      : selectedCategory === entry.name
                        ? "opacity-100"
                        : "opacity-30",
                  )}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                backgroundColor: "rgba(15, 23, 42, 0.85)",
                backdropFilter: "blur(8px)",
                color: "#f8fafc",
                padding: "8px 12px",
              }}
              itemStyle={{ color: "#f8fafc", fontWeight: 500 }}
              formatter={(value: number, name: string) => [
                `${value} articles`,
                name,
              ]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value, entry: any) => {
                const isFaded = selectedCategory !== "All" && selectedCategory !== value;
                return (
                  <span 
                    className={cn(
                      "text-xs ml-1 font-medium select-none transition-opacity",
                      isFaded ? "text-slate-400/50 dark:text-slate-500/50" : "text-slate-700 dark:text-slate-300"
                    )}
                  >
                    {value}
                  </span>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

