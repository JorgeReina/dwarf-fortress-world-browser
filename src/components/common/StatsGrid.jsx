import React from "react";
import { useTranslation } from "react-i18next";

export default function StatsGrid({ stats }) {
  const { t } = useTranslation();

  const cards = [
    ["stats.events", stats.historicalEvents],
    ["stats.figures", stats.historicalFigures],
    ["stats.artifacts", stats.artifacts],
    ["stats.sites", stats.sites],
    ["stats.regions", stats.regions],
    ["stats.entities", stats.entities],
    ["stats.collections", stats.historicalEventCollections],
    ["stats.written", stats.writtenContents]
  ];

  return (
    <div className="stats-grid" style={{ marginTop: 18 }}>
      {cards.map(([label, value]) => (
        <div key={label} className="card-mini">
          <div className="muted" style={{ fontSize: 14 }}>{t(label)}</div>
          <div style={{ fontSize: 30, fontWeight: 800 }}>{value}</div>
        </div>
      ))}
    </div>
  );
}
