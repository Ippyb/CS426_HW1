import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";
import { useState, useEffect } from "react";

// To avoid type safety errors am creating interfaces
interface Activity {
  name: string;
  category: string;
  carbonValue: number;
  date: string;
}

/*
takes an array of activity objects (each w/ name, category, carbon value, date) and processes them to group emissions by day
CO₂ vals for activities on same date get summed.
dates are then formatted for readability
Output is a responsive line chart that visualizes daily carbon emissions over time.
*/
const Summary = () => {
  const [lineData, setLineData] = useState<
    { date: string; carbonValue: number }[]
  >([]);

  const updateLineData = (activities: Activity[]) => {
    // result of reduce is an arr where each entry is the line graph data (carbon emissions) for each date
    const processedData = activities.reduce((acc, activity) => {
      // format date to display as "MMM D"
      const date = moment(activity.date).format("MMM D");

      const existing = acc.find((item) => item.date === date);
      // if date exists add to its carbon value
      if (existing) {
        existing.carbonValue += activity.carbonValue;
      }
      // if date doesn't exist, create new entry
      else {
        acc.push({
          date,
          carbonValue: activity.carbonValue,
        });
      }

      // want reduce to return the arr
      return acc;
    }, [] as { date: string; carbonValue: number }[]);

    setLineData(processedData);
  };

  // logic to make line chart and vals dynamically update
  useEffect(() => {
    const loadActivities = () => {
      const storedActivities = localStorage.getItem("activities");
      const activities = storedActivities ? JSON.parse(storedActivities) : [];
      updateLineData(activities);
    };

    // Load initial data
    loadActivities();

    // Set up event listener for updates
    window.addEventListener("activityUpdated", loadActivities);

    // Clean up event listener
    return () => window.removeEventListener("activityUpdated", loadActivities);
  }, []);

  return (
    <div className="summary-container">
      <h2>Summary</h2>
      <div className="chart-section">
        <h3>Emissions By Day</h3>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                label={{ value: "kg CO₂", angle: -90, position: "insideLeft" }}
              />
              {/* Using Tooltip to display extra info when user hovers over a data point in chart */}
              <Tooltip
                formatter={(value) => [`${value} kg CO₂`, "Emissions"]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="carbonValue"
                stroke="#63d369"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Carbon Emissions"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Summary;
