import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { BarChart3, LineChart, TrendingUp, Calendar, RefreshCw } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Analytics() {
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [weeklyWaterLogs, setWeeklyWaterLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('weekly'); // 'weekly' or 'monthly'

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const weeklyCheckinsRes = await api.get('/api/checkin/weekly');
      setWeeklyData(weeklyCheckinsRes.data);

      const monthlyCheckinsRes = await api.get('/api/checkin/monthly');
      setMonthlyData(monthlyCheckinsRes.data);

      const weeklyWaterRes = await api.get('/api/water/weekly');
      setWeeklyWaterLogs(weeklyWaterRes.data);
    } catch (err) {
      console.error("Error fetching analytics metrics", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  // Compile datasets for charts
  const activeDataset = viewMode === 'weekly' ? weeklyData : monthlyData;

  const labels = activeDataset.map(d => new Date(d.checkInDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));
  const hydrationScores = activeDataset.map(d => d.hydrationScore);
  const fatigueScores = activeDataset.map(d => d.fatigueScore);

  // Chart 1: Line Chart (Hydration & Fatigue trends)
  const lineChartData = {
    labels,
    datasets: [
      {
        label: 'Hydration Score (%)',
        data: hydrationScores,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        tension: 0.35,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#2563eb'
      },
      {
        label: 'Fatigue Score (%)',
        data: fatigueScores,
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.05)',
        tension: 0.35,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#ea580c'
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#94a3b8', font: { family: 'Outfit', size: 11 } }
      },
      tooltip: {
        padding: 12,
        backgroundColor: '#0f172a',
        titleFont: { family: 'Outfit', size: 12, weight: 'bold' },
        bodyFont: { family: 'Outfit', size: 12 },
        borderColor: '#1e293b',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.03)' },
        ticks: { color: '#64748b', font: { family: 'Outfit', size: 10 } }
      },
      y: {
        min: 0,
        max: 100,
        grid: { color: 'rgba(255,255,255,0.03)' },
        ticks: { color: '#64748b', font: { family: 'Outfit', size: 10 } }
      }
    }
  };

  // Chart 2: Water Log Aggregation (Bar chart)
  // Let's aggregate weekly water logs by day
  const waterAggregated = {};
  // Initialize last 7 days
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    waterAggregated[dateStr] = {
      label: d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
      amount: 0
    };
  }

  weeklyWaterLogs.forEach(log => {
    if (waterAggregated[log.logDate]) {
      waterAggregated[log.logDate].amount += log.amount;
    }
  });

  const barLabels = Object.values(waterAggregated).map(v => v.label);
  const barAmounts = Object.values(waterAggregated).map(v => v.amount);

  const barChartData = {
    labels: barLabels,
    datasets: [
      {
        label: 'Water Intake (ml)',
        data: barAmounts,
        backgroundColor: 'rgba(56, 189, 248, 0.45)',
        borderColor: '#38bdf8',
        borderWidth: 1.5,
        borderRadius: 8,
        barThickness: 24
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        padding: 12,
        backgroundColor: '#0f172a',
        titleFont: { family: 'Outfit', size: 12, weight: 'bold' },
        bodyFont: { family: 'Outfit', size: 12 }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#64748b', font: { family: 'Outfit', size: 10 } }
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.03)' },
        ticks: { color: '#64748b', font: { family: 'Outfit', size: 10 } }
      }
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto overflow-y-auto w-full">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900/60 pb-5">
        <div className="text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-heading">Analytics &amp; Biometrics</h1>
          <p className="text-xs text-slate-500 mt-1">Examine physical indices trends, water intake aggregates, and hydration depths.</p>
        </div>
        
        {/* Toggle Mode */}
        <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
              viewMode === 'weekly' 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
              viewMode === 'monthly' 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Grid: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Line Chart Hydration vs Fatigue (Takes 2 Cols) */}
        <div className="lg:col-span-2 glass-panel border border-slate-900 rounded-3xl p-6 text-left space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-900/60">
            <LineChart className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-extrabold text-sm text-slate-200">Physiological Index Correlation</h3>
              <p className="text-[10px] text-slate-500">Dehydration vs Exhaustion trends overlaid chronologically.</p>
            </div>
          </div>
          
          <div className="h-80 w-full relative">
            {activeDataset.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500">
                Complete questionnaires to gather correlation statistics.
              </div>
            ) : (
              <Line data={lineChartData} options={lineChartOptions} />
            )}
          </div>
        </div>

        {/* Dynamic Health Stats Summary */}
        <div className="glass-panel border border-slate-900 rounded-3xl p-6 text-left flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-900/60 mb-4">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <div>
                <h3 className="font-extrabold text-sm text-slate-200">Historical Health Insight</h3>
                <p className="text-[10px] text-slate-500">Averages evaluated from check-in dates.</p>
              </div>
            </div>

            {activeDataset.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-12">No check-ins logged.</p>
            ) : (
              <div className="space-y-4">
                <div className="p-3.5 bg-slate-950/60 border border-slate-900 rounded-2xl">
                  <span className="text-[10px] text-slate-500 font-semibold block">AVG HYDRATION DEGREE</span>
                  <span className="text-2xl font-black text-blue-400 mt-0.5">
                    {Math.round(hydrationScores.reduce((a,b) => a+b, 0) / hydrationScores.length)}%
                  </span>
                </div>
                <div className="p-3.5 bg-slate-950/60 border border-slate-900 rounded-2xl">
                  <span className="text-[10px] text-slate-500 font-semibold block">AVG FATIGUE RATIO</span>
                  <span className="text-2xl font-black text-orange-400 mt-0.5">
                    {Math.round(fatigueScores.reduce((a,b) => a+b, 0) / fatigueScores.length)}%
                  </span>
                </div>
                <div className="p-3.5 bg-slate-950/60 border border-slate-900 rounded-2xl">
                  <span className="text-[10px] text-slate-500 font-semibold block">RISK EVALUATIONS</span>
                  <span className="text-xs font-bold text-slate-200 mt-0.5 flex gap-1.5 items-center">
                    {activeDataset.filter(d => d.hydrationScore < 40).length} / {activeDataset.length} low hydration reports
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={fetchAnalyticsData}
            className="w-full mt-4 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-sync Analytics
          </button>
        </div>

      </div>

      {/* Row 2: Water Log aggregates (Full-width bar chart) */}
      <div className="glass-panel border border-slate-900 rounded-3xl p-6 text-left space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-900/60">
          <BarChart3 className="w-5 h-5 text-sky-400" />
          <div>
            <h3 className="font-extrabold text-sm text-slate-200">Daily Water Consumption Aggregates</h3>
            <p className="text-[10px] text-slate-500">ML volume intake aggregated over the last 7 calendar days.</p>
          </div>
        </div>

        <div className="h-64 w-full relative">
          {weeklyWaterLogs.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500">
              No water intake logs found for this week.
            </div>
          ) : (
            <Bar data={barChartData} options={barChartOptions} />
          )}
        </div>
      </div>

    </div>
  );
}
