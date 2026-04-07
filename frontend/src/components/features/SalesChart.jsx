import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function SalesChart({ chartType = 'bar', data, title }) {
  return (
    <div className="bg-white rounded-lg border border-border p-6">
      <h3 className="font-fraunces text-lg text-ink mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={280}>
        {chartType === 'bar' ? (
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D8D2C8" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fill: '#8A8278' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                border: '1px solid #D8D2C8',
                borderRadius: 8,
              }}
            />
            <Bar dataKey="value" fill="#1C1814" radius={[3, 3, 0, 0]} />
          </BarChart>
        ) : (
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D8D2C8" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fill: '#8A8278' }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                border: '1px solid #D8D2C8',
                borderRadius: 8,
              }}
            />
            <Line type="monotone" dataKey="value" stroke="#2A4A35" strokeWidth={3} dot={false} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}
