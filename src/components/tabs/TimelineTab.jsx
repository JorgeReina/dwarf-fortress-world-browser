import React from "react";
import { useTranslation } from "react-i18next";
import CardGrid from "../common/CardGrid";

export default function TimelineTab({ filteredTimeline }) {
  const { t } = useTranslation();

  if (!filteredTimeline.length) {
    return <div className="panel">{t("sections.noResults")}</div>;
  }

  return (
    <div className="section-stack">
      {filteredTimeline.map((block) => (
        <div key={block.year} className="section-stack">
          <div className="year-row">
            <span className="year-badge">{t("year")} {block.year}</span>
            <span className="muted" style={{ fontSize: 14 }}>{block.items.length} {t("stats.events")}</span>
          </div>
          <CardGrid
            items={block.items}
            titleKey="type"
            subtitleBuilder={(item) => `${item.site} · ${item.participants}`}
            descriptionBuilder={(item) => item.description}
          />
        </div>
      ))}
    </div>
  );
}
