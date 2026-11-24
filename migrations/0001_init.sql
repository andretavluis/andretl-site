CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_date TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  path TEXT NOT NULL,
  referrer_host TEXT NOT NULL,
  country TEXT NOT NULL,
  device TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_events_event_date ON events (event_date);

CREATE TABLE IF NOT EXISTS daily_stats (
  event_date TEXT NOT NULL,
  path TEXT NOT NULL,
  referrer_host TEXT NOT NULL,
  country TEXT NOT NULL,
  device TEXT NOT NULL,
  views INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (event_date, path, referrer_host, country, device)
);

CREATE INDEX IF NOT EXISTS idx_daily_stats_event_date ON daily_stats (event_date);
