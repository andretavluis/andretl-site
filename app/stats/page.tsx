'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import type { DeviceDatum } from '@/components/Stats/DeviceDonutChart';
import type { TopBarDatum } from '@/components/Stats/TopBarChart';
import type { ViewsOverTimePoint } from '@/components/Stats/ViewsOverTimeChart';
import PageWrapper from '@/components/Template/PageWrapper';

const ViewsOverTimeChart = dynamic(
  () => import('@/components/Stats/ViewsOverTimeChart'),
  { ssr: false, loading: () => <ChartPlaceholder height={280} /> },
);
const TopBarChart = dynamic(() => import('@/components/Stats/TopBarChart'), {
  ssr: false,
  loading: () => <ChartPlaceholder height={240} />,
});
const DeviceDonutChart = dynamic(
  () => import('@/components/Stats/DeviceDonutChart'),
  { ssr: false, loading: () => <ChartPlaceholder height={240} /> },
);

interface StatsResponse {
  since: string;
  totalViews: number;
  byPath: { path: string; views: number }[];
  byReferrer: { referrer_host: string; views: number }[];
  byCountry: { country: string; views: number }[];
  byDevice: { device: string; views: number }[];
  byDate: { event_date: string; views: number }[];
}

const RANGE_OPTIONS = [7, 30, 90, 'all'] as const;

function ChartPlaceholder({ height }: { height: number }) {
  return (
    <div className="stats-chart-placeholder" style={{ height }}>
      Loading chart…
    </div>
  );
}

export default function StatsPage() {
  const [range, setRange] = useState<(typeof RANGE_OPTIONS)[number]>(30);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setStats(null);
    setError(null);
    fetch(`/api/stats?days=${range}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json() as Promise<StatsResponse>;
      })
      .then(setStats)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Unknown error'),
      );
  }, [range]);

  const viewsOverTime: ViewsOverTimePoint[] = stats?.byDate ?? [];
  const topPaths: TopBarDatum[] =
    stats?.byPath.map((row) => ({ label: row.path, views: row.views })) ?? [];
  const topReferrers: TopBarDatum[] =
    stats?.byReferrer.map((row) => ({
      label: row.referrer_host,
      views: row.views,
    })) ?? [];
  const topCountries: TopBarDatum[] =
    stats?.byCountry.map((row) => ({
      label: row.country,
      views: row.views,
    })) ?? [];
  const deviceBreakdown: DeviceDatum[] = stats?.byDevice ?? [];

  const topPath = stats?.byPath[0]?.path ?? '—';
  const topReferrer = stats?.byReferrer[0]?.referrer_host ?? '—';
  const topCountry = stats?.byCountry[0]?.country ?? '—';

  return (
    <PageWrapper>
      <section className="stats-page">
        <header className="stats-header">
          <div className="stats-header-text">
            <h1 className="page-title">Analytics</h1>
            <p className="page-subtitle">Live visitor stats for andretl.com.</p>
          </div>
          <div className="stats-range-selector">
            {RANGE_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                className={
                  option === range
                    ? 'stats-range-button stats-range-button--active'
                    : 'stats-range-button'
                }
                onClick={() => setRange(option)}
              >
                {option === 'all' ? 'All' : `${option}d`}
              </button>
            ))}
          </div>
        </header>

        {error && <p className="stats-error">Failed to load stats: {error}</p>}

        {!error && !stats && <p className="stats-loading">Loading…</p>}

        {stats && (
          <>
            <div className="stats-cards">
              <div className="stat-card">
                <span className="stat-card-label">Total views</span>
                <span className="stat-card-value">{stats.totalViews}</span>
              </div>
              <div className="stat-card">
                <span className="stat-card-label">Top path</span>
                <span className="stat-card-value stat-card-value--text">
                  {topPath}
                </span>
              </div>
              <div className="stat-card">
                <span className="stat-card-label">Top referrer</span>
                <span className="stat-card-value stat-card-value--text">
                  {topReferrer}
                </span>
              </div>
              <div className="stat-card">
                <span className="stat-card-label">Top country</span>
                <span className="stat-card-value stat-card-value--text">
                  {topCountry}
                </span>
              </div>
            </div>

            <div className="stats-chart-card stats-chart-card--wide">
              <h2 className="stats-chart-title">Views over time</h2>
              <ViewsOverTimeChart data={viewsOverTime} />
            </div>

            <div className="stats-charts-grid">
              <div className="stats-chart-card">
                <h2 className="stats-chart-title">Top paths</h2>
                <TopBarChart data={topPaths} />
              </div>
              <div className="stats-chart-card">
                <h2 className="stats-chart-title">Top referrers</h2>
                <TopBarChart data={topReferrers} />
              </div>
              <div className="stats-chart-card">
                <h2 className="stats-chart-title">Top countries</h2>
                <TopBarChart data={topCountries} />
              </div>
              <div className="stats-chart-card">
                <h2 className="stats-chart-title">Devices</h2>
                <DeviceDonutChart data={deviceBreakdown} />
              </div>
            </div>
          </>
        )}
      </section>
    </PageWrapper>
  );
}
