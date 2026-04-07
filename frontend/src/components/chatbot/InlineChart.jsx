import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function InlineChart({ chartType, title, data, summary }) {
  const COLORS = ['#1C1814', '#C97B2E', '#2A4A35', '#3A5068', '#B94E2D']

  return (
    <div className="bg-cream-dark rounded-2xl rounded-tl-sm p-4 max-w-xs">
      <h4 className="text-xs font-semibold text-ink mb-3">{title}</h4>

      <ResponsiveContainer width="100%" height={160}>
        {chartType === 'bar' && (
          <BarChart data={data} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D8D2C8" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fill: '#8A8278' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide={true} />
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
        )}

        {chartType === 'line' && (
          <LineChart data={data} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D8D2C8" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontFamily: "'DM Mono', monospace", fontSize: 10, fill: '#8A8278' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide={true} />
            <Tooltip
              contentStyle={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                border: '1px solid #D8D2C8',
                borderRadius: 8,
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#C97B2E"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        )}

        {chartType === 'pie' && (
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={50}
            >
              {data.map((_, i) => (
                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                border: '1px solid #D8D2C8',
                borderRadius: 8,
              }}
            />
            <Legend
              wrapperStyle={{ fontFamily: "'DM Mono', monospace", fontSize: 10 }}
              verticalAlign="bottom"
              height={36}
            />
          </PieChart>
        )}
      </ResponsiveContainer>

      {summary && <p className="text-xs text-stone mt-3">{summary}</p>}
    </div>
  )
}
