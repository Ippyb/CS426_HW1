import { useState, useEffect } from "react";
import moment from "moment";
import StackedPieChart from "./StackedPieChart";
import HeatMap from "./HeatMap";

// To avoid type safety errors creating interfaces
interface Activity {
  name: string;
  category: string;
  carbonValue: number;
  date: string;
}

interface ChartData {
  name: string;
  value: number;
}

interface HeatmapValue {
  date: string;
  count: number;
  activities: Activity[];
}

const DataVis = () => {
  const [todayData, setTodayData] = useState<ChartData[]>([]);
  const [allTimeData, setAllTimeData] = useState<ChartData[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapValue[]>([]);
  const [maxDailyValue, setMaxDailyValue] = useState(1);

  useEffect(() => {
    const loadActivities = () => {
      const storedActivities = localStorage.getItem("activities");
      const activities = storedActivities ? JSON.parse(storedActivities) : [];
      updateChartData(activities);
      updateHeatmapData(activities);
    };

    loadActivities();
    window.addEventListener("activityUpdated", loadActivities);
    return () => window.removeEventListener("activityUpdated", loadActivities);
  }, []);

  const updateChartData = (activities: Activity[]) => {
    const today = moment().format("YYYY-MM-DD");

    // filters activities array to only include items where activity's date matches today's date
    const todayActivities = activities.filter(
      (activity) => moment(activity.date).format("YYYY-MM-DD") === today
    );

    // groups today's activities by category + sums their carbon values into and array of objs (eg "{ name: "Transport", value: 8.0 }")
    const todayCategories = todayActivities.reduce((acc, activity) => {
      const existing = acc.find((item) => item.name === activity.category);
      if (existing) {
        existing.value += activity.carbonValue;
      } else {
        acc.push({
          name: activity.category,
          value: activity.carbonValue,
        });
      }
      return acc;
    }, [] as ChartData[]);

    setTodayData(todayCategories);

    const allTimeCategories = activities.reduce((acc, activity) => {
      const existing = acc.find((item) => item.name === activity.category);
      if (existing) {
        existing.value += activity.carbonValue;
      } else {
        acc.push({
          name: activity.category,
          value: activity.carbonValue,
        });
      }
      return acc;
    }, [] as ChartData[]);

    setAllTimeData(allTimeCategories);
  };

  const updateHeatmapData = (activities: Activity[]) => {
    // groups activities by date into obj where key =  YYYY-MM-DD date and value = object w/ 
    // total carbon emissions and arr of activities for that date
    const groupedByDate = activities.reduce((acc, activity) => {
      const date = moment(activity.date).format("YYYY-MM-DD");
      if (!acc[date]) {
        acc[date] = {
          count: 0,
          activities: [],
        };
      }
      acc[date].count += activity.carbonValue;
      acc[date].activities.push(activity);
      return acc;
    }, {} as Record<string, { count: number; activities: Activity[] }>);

    // convert to array format
    const heatmapValues = Object.entries(groupedByDate).map(([date, data]) => ({
      date,
      count: data.count,
      activities: data.activities,
    }));

    // find maximum value for color scaling
    const max = Math.max(...heatmapValues.map((item) => item.count), 1);
    setMaxDailyValue(max);
    setHeatmapData(heatmapValues);
  };

  return (
    <div className="data-vis-container">
      <h2>Data Visualizations</h2>

      <div className="chart-section">
        <h3>Emissions Breakdown</h3>
        <span>Inner Ring: Today's Breakdown, Outer Ring: All Time Breakdown</span>
        <StackedPieChart todayData={todayData} allTimeData={allTimeData} />
      </div>

      <div className="heatmap-section">
        <h3>Daily Carbon Footprint</h3>
        <HeatMap heatmapData={heatmapData} maxDailyValue={maxDailyValue} />
      </div>
    </div>
  );
};

export default DataVis;
