import {
  MapPin,
  Navigation,
  Map as MapIcon,
  RotateCcw,
  AlertTriangle,
  Moon,
  Sun,
} from "lucide-react";
import { useISSTracking } from "../hooks/useISSTracking";
import { useNews } from "../hooks/useNews";
import { StatCard } from "../components/StatCard";
import { ISSMap } from "../components/Map";
import { SpeedChart } from "../components/SpeedChart";
import { Astronauts } from "../components/Astronauts";
import { NewsGrid } from "../components/news/NewsGrid";
import { NewsPieChart } from "../components/charts/NewsPieChart";
import { ChatWidget } from "../components/chatbot/ChatWidget";
import { Toaster } from "react-hot-toast";
import { cn } from "../utils/cn";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const {
    currentPosition,
    history,
    speed,
    nearestPlace,
    peopleInSpace,
    astronauts,
    isLoading: isISSLoading,
    error: issError,
    isAutoRefresh,
    toggleAutoRefresh,
    manualRefresh,
    lastUpdated,
  } = useISSTracking();

  const newsData = useNews();

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("space-dashboard-theme");
    return saved !== null ? saved === "dark" : true;
  });

  useEffect(() => {
    localStorage.setItem("space-dashboard-theme", darkMode ? "dark" : "light");
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0D17] text-slate-900 dark:text-slate-100 transition-colors duration-200 font-sans pb-12">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: darkMode ? "#151828" : "#fff",
            color: darkMode ? "#fff" : "#000",
            border: "1px solid",
            borderColor: darkMode ? "#1e293b" : "#e2e8f0",
          },
        }}
      />

      {/* Header */}
      <header className="bg-white/80 dark:bg-[#151828]/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-600/20">
              <Navigation className="w-6 h-6 -rotate-45" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase">
                Mission Control Dashboard
              </p>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Real-Time ISS Intelligence
              </h1>
            </div>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 sm:px-4 sm:py-2 rounded-full sm:rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            <span className="hidden sm:inline font-medium text-sm">
              Switch to {darkMode ? "Light" : "Dark"}
            </span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {issError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
              <AlertTriangle size={20} />
              <p className="font-medium">{issError}</p>
            </div>
            <button
              onClick={manualRefresh}
              className="px-4 py-2 bg-red-100 dark:bg-red-800 hover:bg-red-200 dark:hover:bg-red-700 text-red-800 dark:text-red-100 rounded-lg text-sm font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Tracking & Map) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tracking Controls & Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-lg font-bold">ISS Live Tracking</h2>
              <div className="flex items-center gap-3">
                <div className="text-xs text-slate-500 hidden sm:block">
                  Last Update:{" "}
                  {lastUpdated ? lastUpdated.toLocaleTimeString() : "..."}
                </div>
                <button
                  onClick={manualRefresh}
                  disabled={isISSLoading}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  <RotateCcw
                    size={16}
                    className={isISSLoading ? "animate-spin" : ""}
                  />
                  Refresh Now
                </button>
                <button
                  onClick={toggleAutoRefresh}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium border transition",
                    isAutoRefresh
                      ? "bg-slate-900 border-slate-900 text-white dark:bg-slate-200 dark:border-slate-200 dark:text-slate-900"
                      : "bg-white border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300",
                  )}
                >
                  Auto-Refresh: {isAutoRefresh ? "ON" : "OFF"}
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                title="Latitude / Longitude"
                value={
                  currentPosition
                    ? `${currentPosition.lat.toFixed(3)}, ${currentPosition.lng.toFixed(3)}`
                    : "-"
                }
              />
              <StatCard
                title="Speed"
                value={speed ? `${speed.toFixed(2)} km/h` : "Calibrating..."}
              />
              <StatCard
                title="Nearest Place"
                value={
                  <span
                    className="text-lg leading-tight block truncate"
                    title={nearestPlace}
                  >
                    {nearestPlace}
                  </span>
                }
              />
              <StatCard
                title="Tracked Positions"
                value={history.length.toString()}
              />
            </div>

            {/* Map */}
            <ISSMap
              currentPosition={currentPosition}
              history={history}
              speed={speed}
            />

            {/* News Distribution Chart */}
            <NewsPieChart
              data={newsData.categoryData}
              selectedCategory={newsData.selectedCategory}
              onCategorySelected={newsData.setSelectedCategory}
            />
          </div>

          {/* Right Column (Charts & Astros) */}
          <div className="space-y-6 flex flex-col">
            <SpeedChart history={history} />

            <div className="flex-1 min-h-[300px]">
              <Astronauts
                peopleInSpace={peopleInSpace}
                astronauts={astronauts}
              />
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent my-12" />

        {/* News Section */}
        <section>
          <NewsGrid {...newsData} />
        </section>
      </main>

      {/* AI Chatbot Widget */}
      <ChatWidget
        currentPosition={currentPosition}
        history={history}
        speed={speed}
        astronauts={astronauts}
        articles={newsData.articles}
      />
    </div>
  );
}
