'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface ViewsOverTimePoint {
  event_date: string;
  views: number;
}

export default function ViewsOverTimeChart({
  data,
}: {
  data: ViewsOverTimePoint[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis
          dataKey="event_date"
          tick={{ fill: 'var(--color-fg-light)', fontSize: 12 }}
          axisLine={{ stroke: 'var(--color-border)' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'var(--color-fg-light)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            background: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 8,
          }}
        />
        <Line
          type="monotone"
          dataKey="views"
          stroke="var(--color-accent)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
