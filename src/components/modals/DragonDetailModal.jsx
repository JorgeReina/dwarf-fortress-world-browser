import React from "react";
import { useTranslation } from "react-i18next";

export default function DragonDetailModal({ dragon, onClose }) {
  const { t } = useTranslation();
  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="panel detail-modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <div>
            <div className="kicker">🐉 {t("sections.detailPanel")}</div>
            <h2 style={{ margin: 0 }}>{dragon.name}</h2>
            <div className="small-meta">
              <span className="meta-chip">{t("sections.dragonAge")}: {dragon.age ?? "?"}</span>
              <span className="meta-chip">{t("sections.dragonLocation")}: {dragon.location}</span>
              <span className="meta-chip">{t("sections.dragonStatus")}: {dragon.isDead ? t("sections.dragonDead") : t("sections.dragonAlive")}</span>
            </div>
          </div>
          <button className="action-btn" onClick={onClose}>{t("sections.close")}</button>
        </div>

        <div className="detail-grid" style={{ marginTop: 20 }}>
          <div className="panel glass">
            <h3 style={{ marginTop: 0 }}>{t("sections.dragonEvents")}</h3>
            <div className="scroll-list">
              {dragon.relatedEvents.length ? dragon.relatedEvents.map((event) => (
                <div key={event.id} className="card-mini">
                  <div style={{ fontWeight: 700 }}>{event.subtype || event.type}</div>
                  <div className="muted" style={{ marginTop: 4 }}>{event.year} · {event.site}</div>
                  <div style={{ marginTop: 8, color: "#d7e0ec", lineHeight: 1.7 }}>{event.description}</div>
                </div>
              )) : <div className="muted">-</div>}
            </div>
          </div>

          <div className="panel glass">
            <h3 style={{ marginTop: 0 }}>{t("sections.dragonEnemies")}</h3>
            <div className="scroll-list">
              {dragon.enemiesDefeated.length ? dragon.enemiesDefeated.map((name) => (
                <div key={name} className="card-mini">{name}</div>
              )) : <div className="muted">-</div>}
            </div>

            <h3>{t("sections.dragonTreasures")}</h3>
            <div className="scroll-list">
              {dragon.treasures.length ? dragon.treasures.map((name) => (
                <div key={name} className="card-mini">{name}</div>
              )) : <div className="muted">-</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
