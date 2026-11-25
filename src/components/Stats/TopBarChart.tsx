'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface TopBarDatum {
  label: string;
  views: number;
}

export default function TopBarChart({ data }: { data: TopBarDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--color-border)"
          horizontal={false}
        />
        <XAxis
          type="number"
          tick={{ fill: 'var(--color-fg-light)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <YAxis
          type="category"
          dataKey="label"
          width={110}
          tick={{ fill: 'var(--color-fg-light)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 8,
          }}
        />
        <Bar dataKey="views" fill="var(--color-accent)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
