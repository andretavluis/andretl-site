'use client';

import { useEffect, useState } from 'react';

interface StatsResponse {
  since: string;
  totalViews: number;
  byPath: { path: string; views: number }[];
  byReferrer: { referrer_host: string; views: number }[];
  byCountry: { country: string; views: number }[];
  byDevice: { device: string; views: number }[];
  byDate: { event_date: string; views: number }[];
}

export default function StatsPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json() as Promise<StatsResponse>;
      })
      .then(setStats)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Unknown error'),
      );
  }, []);

  if (error) return <main className="p-8">Failed to load stats: {error}</main>;
  if (!stats) return <main className="p-8">Loading…</main>;

  return (
    <main className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Stats (last 30 days)</h1>
      <p>Total views: {stats.totalViews}</p>
      <Table title="Top paths" rows={stats.byPath} keyField="path" />
      <Table
        title="Referrers"
        rows={stats.byReferrer}
        keyField="referrer_host"
      />
      <Table title="Countries" rows={stats.byCountry} keyField="country" />
      <Table title="Devices" rows={stats.byDevice} keyField="device" />
    </main>
  );
}

function Table<K extends string>({
  title,
  rows,
  keyField,
}: {
  title: string;
  rows: Record<K | 'views', string | number>[];
  keyField: K;
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row) => (
            <tr key={String(row[keyField])}>
              <td className="pr-4">{row[keyField]}</td>
              <td>{row.views}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
