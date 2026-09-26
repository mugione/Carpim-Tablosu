-- Çarpım Tablosu skor tablosu
CREATE TABLE IF NOT EXISTS scores (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL,
  mode       TEXT    NOT NULL,
  score      INTEGER NOT NULL,
  correct    INTEGER NOT NULL,
  total      INTEGER NOT NULL,
  stars      INTEGER NOT NULL,
  created_at TEXT    DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_scores_score ON scores(score DESC);
CREATE INDEX IF NOT EXISTS idx_scores_name  ON scores(name);
