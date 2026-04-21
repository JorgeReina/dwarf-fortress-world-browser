import React from "react";
import { useTranslation } from "react-i18next";
import StatsGrid from "./common/StatsGrid";
import DragonChart from "./common/DragonChart";

export default function SummaryPanels({ data, selectedYear, setSelectedYear }) {
  const { t } = useTranslation();
  const topSpecies = data?.speciesStrength?.[0];
  const topWar = data?.warImpact?.[0];

  return (
    <div className="summary-grid" style={{ marginTop: 24 }}>
      <div className="panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div className="muted" style={{ fontSize: 14 }}>{t("worldLoaded")}</div>
            <h2 style={{ margin: "4px 0 0 0", fontSize: 38 }}>{data.worldName}</h2>
          </div>
          <select className="year-select" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            <option value="all">{t("allYears")}</option>
            {data.timeline.map((block) => (
              <option key={block.year} value={String(block.year)}>
                {t("year")} {block.year}
              </option>
            ))}
          </select>
        </div>

        <StatsGrid stats={data.stats} />
      </div>

      <div className="duo-grid">
        <div className="panel glass">
          <h3 style={{ marginTop: 0 }}>{t("sections.strongestSpecies")}</h3>
          {topSpecies ? (
            <>
              <div className="summary-highlight">{topSpecies.race}</div>
              <div className="muted" style={{ marginTop: 4 }}>Index: {topSpecies.strengthIndex}</div>
              <div style={{ marginTop: 10, color: "#d7e0ec" }}>
                {t("sections.champions")}: {topSpecies.champions.join(", ") || "-"}
              </div>
            </>
          ) : (
            <div className="muted">{t("sections.strongestSpeciesEmpty")}</div>
          )}
        </div>

        <div className="panel glass">
          <h3 style={{ marginTop: 0 }}>{t("sections.topWar")}</h3>
          {topWar ? (
            <>
              <div className="summary-highlight">{topWar.subtype || topWar.type}</div>
              <div className="muted" style={{ marginTop: 4 }}>{t("year")} {topWar.year} · {topWar.site}</div>
              <div style={{ marginTop: 10, color: "#d7e0ec", lineHeight: 1.7 }}>{topWar.description}</div>
            </>
          ) : (
            <div className="muted">{t("sections.topWarEmpty")}</div>
          )}
        </div>
      </div>

      <DragonChart data={data.dragonsByYear} />
    </div>
  );
}
