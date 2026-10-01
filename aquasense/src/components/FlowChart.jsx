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

const datasets = {
  "1h": [
    { time: "09:00", flow: 3.2 },
    { time: "09:05", flow: 4.8 },
    { time: "09:10", flow: 3.9 },
    { time: "09:15", flow: 5.1 },
    { time: "09:20", flow: 9.8 },
    { time: "09:25", flow: 4.1 },
    { time: "09:30", flow: 3.7 },
    { time: "09:35", flow: 4.4 },
    { time: "09:40", flow: 10.1 },
    { time: "09:45", flow: 5.2 },
    { time: "09:50", flow: 4.6 },
    { time: "09:55", flow: 3.9 },
    { time: "10:00", flow: 4.2 },
  ],

  "6h": [
    { time: "04:00", flow: 1.8 },
    { time: "05:00", flow: 2.1 },
    { time: "06:00", flow: 5.4 },
    { time: "07:00", flow: 7.2 },
    { time: "08:00", flow: 4.8 },
    { time: "09:00", flow: 3.2 },
    { time: "10:00", flow: 4.2 },
  ],

  "24h": [
    { time: "00:00", flow: 1.1 },
    { time: "04:00", flow: 0.8 },
    { time: "08:00", flow: 6.4 },
    { time: "12:00", flow: 8.2 },
    { time: "16:00", flow: 5.9 },
    { time: "20:00", flow: 7.1 },
    { time: "24:00", flow: 2.4 },
  ],
};

function FlowChart({
  title = "Live Water Flow",
  subtitle = "Real-time flow activity from your AquaSense device.",
}) {
  const [range, setRange] = useState("1h");
  const [isLive, setIsLive] = useState(true);

  const data = useMemo(() => datasets[range], [range]);

  return (
    <div className="chart-card">

      <div className="chart-header">

        <div>
          <div className="chart-title-row">
            <h3>{title}</h3>

            {isLive && (
              <span className="live-indicator">
                <span></span>
                LIVE
              </span>
            )}
          </div>

          <p>{subtitle}</p>
        </div>

        <div className="chart-controls">

          <button
            className={`chart-live-button ${
              isLive ? "active" : ""
            }`}
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? "Pause" : "Resume"}
          </button>

          <select
            className="chart-select"
            value={range}
            onChange={(event) => setRange(event.target.value)}
          >
            <option value="1h">Last 1 Hour</option>
            <option value="6h">Last 6 Hours</option>
            <option value="24h">Last 24 Hours</option>
          </select>

        </div>

      </div>

      <div className="chart-container">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#edf2f7"
            />

            <XAxis
              dataKey="time"
              tick={{
                fontSize: 11,
                fill: "#8a9bad",
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{
                fontSize: 11,
                fill: "#8a9bad",
              }}
              axisLine={false}
              tickLine={false}
              domain={[0, "auto"]}
              unit=" L"
            />

            <Tooltip
              contentStyle={{
                border: "1px solid #e5edf5",
                borderRadius: "10px",
                boxShadow:
                  "0 5px 20px rgba(16, 42, 67, 0.08)",
              }}
              formatter={(value) => [
                `${value} L/min`,
                "Flow",
              ]}
            />

            <Line
              type="monotone"
              dataKey="flow"
              stroke="#1683d8"
              strokeWidth={3}
              dot={false}
              isAnimationActive={true}
              activeDot={{
                r: 5,
                strokeWidth: 3,
                stroke: "#ffffff",
                fill: "#1683d8",
              }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default FlowChart;