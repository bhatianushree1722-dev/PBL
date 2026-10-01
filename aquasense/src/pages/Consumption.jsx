import { useMemo, useState } from "react";
import {
  Droplets,
  TrendingUp,
  TrendingDown,
  CalendarDays,
  BarChart3,
  Clock3,
  Lightbulb,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const consumptionData = {
  "7d": [
    { day: "Mon", usage: 182 },
    { day: "Tue", usage: 205 },
    { day: "Wed", usage: 176 },
    { day: "Thu", usage: 221 },
    { day: "Fri", usage: 198 },
    { day: "Sat", usage: 243 },
    { day: "Sun", usage: 186 },
  ],
  "30d": [
    { day: "Week 1", usage: 1190 },
    { day: "Week 2", usage: 1325 },
    { day: "Week 3", usage: 1248 },
    { day: "Week 4", usage: 1382 },
  ],
};

const hourlyData = [
  { time: "12 AM", usage: 4 },
  { time: "3 AM", usage: 2 },
  { time: "6 AM", usage: 18 },
  { time: "9 AM", usage: 31 },
  { time: "12 PM", usage: 24 },
  { time: "3 PM", usage: 17 },
  { time: "6 PM", usage: 38 },
  { time: "9 PM", usage: 29 },
];

function Consumption() {
  const [range, setRange] = useState("7d");

  const data = useMemo(() => consumptionData[range], [range]);

  const totalUsage = data.reduce((sum, item) => sum + item.usage, 0);
  const averageUsage = Math.round(totalUsage / data.length);

  const peakDay = data.reduce((highest, current) =>
    current.usage > highest.usage ? current : highest
  );

  return (
    <div className="page-container consumption-page">

      {/* HEADER */}
      <div className="page-header">
        <div>
          <div className="page-eyebrow">
            <BarChart3 size={13} />
            WATER CONSUMPTION
          </div>

          <h1>Consumption</h1>

          <p>
            Understand how water usage changes across your home over time.
          </p>
        </div>

        <div className="consumption-range">
          <button
            className={range === "7d" ? "active" : ""}
            onClick={() => setRange("7d")}
          >
            7 Days
          </button>

          <button
            className={range === "30d" ? "active" : ""}
            onClick={() => setRange("30d")}
          >
            30 Days
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="consumption-summary-grid">

        <div className="consumption-stat-card">
          <div className="consumption-stat-icon blue">
            <Droplets size={21} />
          </div>

          <div>
            <span>Total Consumption</span>

            <strong>
              {range === "7d" ? "1,411" : "5,145"}
              <small> L</small>
            </strong>

            <p>Across the selected period</p>
          </div>
        </div>

        <div className="consumption-stat-card">
          <div className="consumption-stat-icon green">
            <TrendingDown size={21} />
          </div>

          <div>
            <span>Daily Average</span>

            <strong>
              {range === "7d" ? averageUsage : 184}
              <small> L/day</small>
            </strong>

            <p className="positive-change">
              4.8% lower than previous period
            </p>
          </div>
        </div>

        <div className="consumption-stat-card">
          <div className="consumption-stat-icon orange">
            <TrendingUp size={21} />
          </div>

          <div>
            <span>Peak Usage</span>

            <strong>
              {range === "7d" ? peakDay.usage : 1382}
              <small> L</small>
            </strong>

            <p>
              {range === "7d" ? peakDay.day : "Week 4"}
            </p>
          </div>
        </div>

        <div className="consumption-stat-card">
          <div className="consumption-stat-icon purple">
            <CalendarDays size={21} />
          </div>

          <div>
            <span>Current Period</span>

            <strong>
              {range === "7d" ? "7" : "30"}
              <small> days</small>
            </strong>

            <p>Monitoring continuously</p>
          </div>
        </div>

      </div>

      {/* MAIN CHART */}
      <div className="consumption-chart-card">

        <div className="consumption-chart-header">

          <div>
            <h3>Water Consumption</h3>
            <p>
              {range === "7d"
                ? "Daily water usage for the last 7 days."
                : "Weekly water usage for the last 30 days."}
            </p>
          </div>

          <div className="chart-unit">
            <Droplets size={15} />
            Litres
          </div>

        </div>

        <div className="consumption-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: -15,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#edf2f7"
              />

              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 11,
                  fill: "#8799a8",
                }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 11,
                  fill: "#8799a8",
                }}
              />

              <Tooltip
                cursor={{ fill: "#f5f9fc" }}
                contentStyle={{
                  border: "1px solid #e5edf5",
                  borderRadius: "10px",
                  boxShadow:
                    "0 5px 20px rgba(16, 42, 67, 0.08)",
                }}
                formatter={(value) => [`${value} L`, "Usage"]}
              />

              <Bar
                dataKey="usage"
                fill="#1683d8"
                radius={[6, 6, 0, 0]}
                barSize={range === "7d" ? 42 : 70}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* LOWER GRID */}
      <div className="consumption-lower-grid">

        {/* HOURLY USAGE */}
        <div className="consumption-panel">

          <div className="panel-header">
            <div>
              <h3>Today's Usage Pattern</h3>
              <p>Approximate consumption throughout the day.</p>
            </div>

            <Clock3 size={19} />
          </div>

          <div className="hourly-list">

            {hourlyData.map((item) => (
              <div className="hourly-row" key={item.time}>

                <span>{item.time}</span>

                <div className="hourly-bar-track">
                  <div
                    className="hourly-bar"
                    style={{
                      width: `${Math.min(
                        (item.usage / 40) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>

                <strong>{item.usage} L</strong>

              </div>
            ))}

          </div>

        </div>

        {/* INSIGHT */}
        <div className="consumption-panel insight-panel">

          <div className="insight-icon">
            <Lightbulb size={22} />
          </div>

          <div className="insight-content">

            <span className="insight-label">
              AQUASENSE INSIGHT
            </span>

            <h3>Your evening usage is higher.</h3>

            <p>
              The highest recorded activity today occurs between
              6 PM and 9 PM. This can help identify when most household
              water activity takes place.
            </p>

            <div className="insight-stat">
              <div>
                <span>Peak window</span>
                <strong>6 PM – 9 PM</strong>
              </div>

              <div>
                <span>Observed usage</span>
                <strong>38 L</strong>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* COMPARISON */}
      <div className="consumption-comparison">

        <div className="comparison-icon">
          <TrendingDown size={20} />
        </div>

        <div className="comparison-content">

          <strong>
            Usage is currently below the previous monitoring period.
          </strong>

          <p>
            AquaSense recorded approximately 4.8% lower average daily
            consumption compared with the previous comparable period.
          </p>

        </div>

        <div className="comparison-value">
          ↓ 4.8%
        </div>

      </div>

      {/* NOTE */}
      <div className="consumption-note">
        Consumption values shown here are based on recorded flow
        observations and are intended for monitoring and analysis.
      </div>

    </div>
  );
}

export default Consumption;