import { useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import type { CanvasStats } from "../hooks/useCanvasStats";
import { useProjectAnalysis } from "../hooks/useProjectAnalysis";
import { AnalysisView } from "./AnalysisView";

const transformDataForPieChart = (
  data: { [key: string]: number } | undefined
) => {
  if (!data) return [];
  return Object.entries(data).map(([name, value]) => ({ name, value }));
};

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF1943",
];

type SnapshotViewType = "category" | "progressOverview" | "progressDetails" |"analysis";

interface SnapshotViewProps {
  stats: CanvasStats;
  setIsSidebarOpen:(value:boolean)=>void;
}

export const SnapshotView = ({ stats ,setIsSidebarOpen}: SnapshotViewProps) => {
  const [currentView, setCurrentView] = useState<SnapshotViewType>("category");
const {  data, isLoading:isAnalyzing, isError, error, refetch  } = useProjectAnalysis(stats);

 const handleAnalyzeClick = () => {
    setCurrentView('analysis');
    refetch(); 
  };
  const categoryData = useMemo(
    () => transformDataForPieChart(stats.nodeCountsByCategory),
    [stats.nodeCountsByCategory]
  );


  const handleGoBack  = ()=>{
    setCurrentView("category");
  }

  const overallProgressData = useMemo(() => {
    const { completedTasks, incompleteTasks } = stats.checklistProgress;
    return [
      {
        name: "Overall",
        completed: completedTasks,
        incomplete: incompleteTasks,
      },
    ];
  }, [stats.checklistProgress]);

  const detailedProgressData = useMemo(() => {
    return stats.checklistProgress.details.map((detail) => ({
      name:
        detail.title.length > 15
          ? `${detail.title.substring(0, 15)}...`
          : detail.title,
      completed: detail.completed,
      incomplete: detail.total - detail.completed,
    }));
  }, [stats.checklistProgress.details]);

  const renderActiveButtonClass = (view: SnapshotViewType) =>
    currentView === view
      ? "bg-indigo-600 text-white"
      : "bg-gray-200 text-gray-700 hover:bg-gray-300";

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-1 bg-gray-100 rounded-lg mb-4">
        <div className="flex items-center">
          <button
            onClick={() => setCurrentView("category")}
            className={`px-3 py-1 text-sm font-semibold rounded-md transition-all ${renderActiveButtonClass(
              "category"
            )}`}
          >
            Category
          </button>
          <button
            onClick={() => setCurrentView("progressOverview")}
            className={`mx-1 px-3 py-1 text-sm font-semibold rounded-md transition-all ${renderActiveButtonClass(
              "progressOverview"
            )}`}
          >
            Progress
          </button>
          <button
            onClick={() => setCurrentView("progressDetails")}
            className={`px-3 py-1 text-sm font-semibold rounded-md transition-all ${renderActiveButtonClass(
              "progressDetails"
            )}`}
          >
            Details
          </button>
        </div>

        <button className="p-1 hover:bg-gray-200 rounded" onClick={()=>setIsSidebarOpen(false)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="flex-grow">
        {currentView === "category" && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-2 text-center">
              Breakdown by Category
            </h3>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {currentView === "progressOverview" && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-2 text-center">
              Overall Checklist Progress
            </h3>
            <p className="text-center text-sm text-gray-500 mb-4">
              {stats.checklistProgress.completionPercentage}% Complete (
              {stats.checklistProgress.completedTasks} /{" "}
              {stats.checklistProgress.totalTasks} tasks)
            </p>
            <div style={{ width: "100%", height: 150 }}>
              <ResponsiveContainer>
                <BarChart
                  layout="vertical"
                  data={overallProgressData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" hide />
                  <Tooltip cursor={{ fill: "rgba(230, 230, 230, 0.5)" }} />
                  <Bar
                    dataKey="completed"
                    stackId="a"
                    fill="#4ade80"
                    name="Completed"
                  />
                  <Bar
                    dataKey="incomplete"
                    stackId="a"
                    fill="#f87171"
                    name="Incomplete"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {currentView === "progressDetails" && (
          <div>
            <h3 className="font-semibold text-gray-700 mb-2 text-center">
              Checklist Details
            </h3>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart
                  data={detailedProgressData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" fill="#4ade80" name="Completed" />
                  <Bar dataKey="incomplete" fill="#f87171" name="Incomplete" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}


         {currentView === 'analysis' && (
          <AnalysisView 
            isAnalyzing={isAnalyzing}
            isError={isError}
            error={error}
            data={data}
            onGoBack={handleGoBack}
          />
        )}



        
      </div>

      <div className="mt-auto border-t pt-4">
        <button
          onClick={handleAnalyzeClick}
          className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition-all"
        >
          Get AI Analysis ✨
        </button>
      </div>
    </div>
  );
};