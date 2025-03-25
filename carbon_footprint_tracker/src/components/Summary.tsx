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

// To avoid type safety errors am creating interfaces
interface Activity {
  name: string;
  category: string;
  carbonValue: number;
  date: string;
}

interface SummaryProps {
  activities: Activity[];
}

/*
takes an array of activity objects (each w/ name, category, carbon value, date) and processes them to group emissions by day
CO₂ vals for activities on same date get summed.
dates are then formatted for readability
Output is a responsive line chart that visualizes daily carbon emissions over time.
*/
const Summary = ({ activities }: SummaryProps) => {
  
  // result of reduce is an arr where each entry is the line graph data (carbon emissions) for each date
  const lineData = activities.reduce((acc, activity) => {
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
    // declaring structure of data that'll be stored in arr; eg "{ date: "2025-03-25", carbonValue: 2 }"
  }, [] as { date: string; carbonValue: number }[]);

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
