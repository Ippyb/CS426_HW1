import { useState } from "react";
import moment from "moment";
import CalendarHeatmap, {
  ReactCalendarHeatmapValue,
} from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

// To avoid type safety errors am creating interfaces
interface Activity {
  name: string;
  category: string;
  carbonValue: number;
  date: string;
}

// to represent total daily emissions and the activities that contributed to them
interface HeatmapValue {
  date: string;
  count: number;
  activities: Activity[];
}

interface HeatMapProps {
  heatmapData: HeatmapValue[];
  maxDailyValue: number;
}

const HeatMap = ({ heatmapData, maxDailyValue }: HeatMapProps) => {
  const [selectedDay, setSelectedDay] = useState<HeatmapValue | null>(null);

  const handleDayClick = (
    value: ReactCalendarHeatmapValue<string> | undefined
  ) => {
    if (!value) {
      setSelectedDay(null);
      return;
    }

    // Find the full data object from heatmapData
    const fullData = heatmapData.find((item) => item.date === value.date);
    setSelectedDay(fullData || null);
  };

  return (
    <div className="heatmap-wrapper">
      <CalendarHeatmap
        // only data from the past year displayed
        startDate={moment().subtract(1, "year").toDate()}
        endDate={new Date()}
        values={heatmapData}
        // classes assignment dynamically based on emission intensity
        classForValue={(value) => {
          if (!value) return "color-empty";
          // color (scale of 1 to 5) based on relative emissions
          return `color-filled color-scale-${Math.min(
            Math.floor((value.count / maxDailyValue) * 4) + 1,
            5
          )}`;
        }}
        onClick={handleDayClick}
        showWeekdayLabels={true}
      />
      {/* Popup for when a specific day is selected */}
      {selectedDay && (
        <div className="day-details">
          <h4>{moment(selectedDay.date).format("MMMM D, YYYY")}</h4>
          <p>Total: {selectedDay.count} kg CO₂</p>
          <ul>
            {selectedDay.activities.map((activity, i) => (
              <li key={i}>
                {activity.name} ({activity.category}): {activity.carbonValue} kg
              </li>
            ))}
          </ul>
          <button onClick={() => setSelectedDay(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default HeatMap;
