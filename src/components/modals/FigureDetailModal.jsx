import React from "react";
import { useTranslation } from "react-i18next";

export default function FigureDetailModal({ figure, allFigures, onClose }) {
  const { t } = useTranslation();
  const father = allFigures?.[String(figure.fatherId)];
  const mother = allFigures?.[String(figure.motherId)];
  const spouse = allFigures?.[String(figure.spouseId)];

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="panel detail-modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <div>
            <div className="kicker">⚔ {t("sections.detailPanel")}</div>
            <h2 style={{ margin: 0 }}>{figure.name}</h2>
            <div className="small-meta">
              <span className="meta-chip">{figure.race}</span>
              <span className="meta-chip">{t("sections.impactedBy")}: {figure.narrativeImpact}</span>
              <span className="meta-chip">{figure.birthYear || "?"} / {figure.deathYear || "?"}</span>
            </div>
          </div>
          <button className="action-btn" onClick={onClose}>{t("sections.close")}</button>
        </div>

        <div className="detail-grid" style={{ marginTop: 20 }}>
          <div className="panel glass">
            <h3 style={{ marginTop: 0 }}>{t("sections.genealogy")}</h3>
            <div className="tree">
              <div className="tree-row">
                <div className="tree-node">{father ? `Father: ${father.name}` : "Father: -"}</div>
                <div className="tree-node" style={{ fontWeight: 700 }}>{figure.name}</div>
                <div className="tree-node">{mother ? `Mother: ${mother.name}` : "Mother: -"}</div>
              </div>
              <div className="tree-row">
                <div className="tree-node">{spouse ? `Spouse: ${spouse.name}` : "Spouse: -"}</div>
                <div className="tree-node">Children: {figure.descendants.length || 0}</div>
                <div className="tree-node">{figure.descendants.slice(0, 3).map((d) => d.name).join(", ") || "-"}</div>
              </div>
            </div>

            <h3>{t("sections.notableEvents")}</h3>
            <div className="scroll-list">
              {figure.relatedEvents.length ? figure.relatedEvents.map((event) => (
                <div key={event.id} className="card-mini">
                  <div style={{ fontWeight: 700 }}>{event.subtype || event.type}</div>
                  <div className="muted" style={{ marginTop: 4 }}>{event.year} · {event.site}</div>
                  <div style={{ marginTop: 8, color: "#d7e0ec", lineHeight: 1.7 }}>{event.description}</div>
                </div>
              )) : <div className="muted">-</div>}
            </div>
          </div>

          <div className="panel glass">
            <h3 style={{ marginTop: 0 }}>{t("sections.enemiesDefeated")}</h3>
            <div className="scroll-list">
              {figure.enemiesDefeated.length ? figure.enemiesDefeated.map((name) => (
                <div key={name} className="card-mini">{name}</div>
              )) : <div className="muted">-</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
