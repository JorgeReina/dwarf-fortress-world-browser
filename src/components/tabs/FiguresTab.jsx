import React from "react";
import { useTranslation } from "react-i18next";

export default function FiguresTab({ speciesStrength, impactFigures, onOpen }) {
  const { t } = useTranslation();
  return (
    <div className="duo-grid">
      <div className="panel">
        <h3 style={{ marginTop: 0 }}>{t("sections.speciesRanking")}</h3>
        <div className="scroll-list">
          {speciesStrength.map((species, index) => (
            <div key={species.race} className="card-mini">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div><strong>#{index + 1}</strong> · {species.race}</div>
                <div className="muted">{species.strengthIndex} pts</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <h3 style={{ marginTop: 0 }}>{t("sections.powerfulFigures")}</h3>
        <div className="scroll-list">
          {impactFigures.map((figure, index) => (
            <div key={figure.id} className="card-mini">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>#{index + 1} · {figure.name}</div>
                  <div className="muted" style={{ fontSize: 14 }}>{figure.race}</div>
                </div>
                <div className="muted">{figure.narrativeImpact} pts</div>
              </div>
              <div style={{ marginTop: 8, color: "#d7e0ec", lineHeight: 1.7 }}>{figure.notable}</div>
              <div style={{ marginTop: 12 }}>
                <button className="action-btn primary" onClick={() => onOpen(figure)}>
                  {t("sections.inspect")}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
