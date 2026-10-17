import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function PressureChart() {
  const [data, setData] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      time: `${String(10 + Math.floor(i / 6)).padStart(2, "0")}:${String(
        (i % 6) * 10
      ).padStart(2, "0")}`,
      pressure: Number((2.0 + Math.random() * 0.5).toFixed(2)),
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setData((previous) => [
        ...previous.slice(1),
        {
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          pressure: Number(
            Math.max(0.5, Math.min(4, 2.2 + (Math.random() - 0.5) * 0.8)).toFixed(2)
          ),
        },
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pressure-chart-card">
      <div className="section-card-header">
        <div>
          <h3>Pipeline Pressure</h3>
          <p>Simulated pressure readings</p>
        </div>

        <span className="simulated-label">SIMULATED</span>
      </div>

      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#263449" />
            <XAxis
              dataKey="time"
              stroke="#94a3b8"
              tick={{ fontSize: 11 }}
            />
            <YAxis
              domain={[0, 4]}
              stroke="#94a3b8"
              tick={{ fontSize: 11 }}
              unit=" bar"
            />
            <Tooltip
              contentStyle={{
                background: "#101b2d",
                border: "1px solid #334155",
                borderRadius: 8,
                color: "#fff",
              }}
              formatter={(value) => [`${value} bar`, "Simulated Pressure"]}
            />
            <Line
              type="monotone"
              dataKey="pressure"
              stroke="#a78bfa"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PressureChart;