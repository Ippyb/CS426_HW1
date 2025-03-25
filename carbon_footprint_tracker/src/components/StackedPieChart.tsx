import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// a single sector in the chart
interface ChartData {
  name: string;
  value: number;
}

interface StackedPieChartProps {
  todayData: ChartData[];
  allTimeData: ChartData[];
}

const TODAY_COLORS = [
  "#1F77B4",
  "#2CA02C",
  "#D62728",
  "#9467BD",
  "#8C564B",
  "#E377C2",
];

const ALL_TIME_COLORS = [
  "#FF7F0E",
  "#17BECF",
  "#BCBD22",
  "#7F7F7F",
  "#AEC7E8",
  "#98DF8A",
];

const StackedPieChart = ({ todayData, allTimeData }: StackedPieChartProps) => {
  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={500}>
        <PieChart>
          {/* Inner Ring - Today's Data */}
          <Pie
            data={todayData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            dataKey="value"
            nameKey="name"
          >
            {/* Assigning colors to sectors */}
            {todayData.map((entry, index) => (
              <Cell
                key={`today-cell-${index}`}
                fill={TODAY_COLORS[index % TODAY_COLORS.length]}
              />
            ))}
          </Pie>

          {/* Outer Ring - All Time Data */}
          <Pie
            data={allTimeData}
            cx="50%"
            cy="50%"
            innerRadius={130}
            outerRadius={180}
            dataKey="value"
            nameKey="name"
          >
            {/* Assigning colors to sectors */}
            {allTimeData.map((entry, index) => (
              <Cell
                key={`alltime-cell-${index}`}
                fill={ALL_TIME_COLORS[index % ALL_TIME_COLORS.length]}
              />
            ))}
          </Pie>

          {/* Chart tooltip showing exact values when hovering over sectors*/}
          <Tooltip
            formatter={(value: number, name: string) => [
              `${value} kg CO₂`,
              name,
            ]}
          />
          {/* Chart legend */}
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackedPieChart;
