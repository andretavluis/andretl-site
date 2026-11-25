'use client';

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export interface DeviceDatum {
  device: string;
  views: number;
}

const COLORS = [
  'var(--color-accent)',
  'var(--color-skill-2)',
  'var(--color-skill-5)',
];

export default function DeviceDonutChart({ data }: { data: DeviceDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          dataKey="views"
          nameKey="device"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell key={entry.device} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
            borderRadius: 8,
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, color: 'var(--color-fg-light)' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
