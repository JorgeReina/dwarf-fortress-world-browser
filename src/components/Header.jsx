import React from "react";
import { useTranslation } from "react-i18next";

export default function Header({ fileName, query, setQuery, onFile, onClearContext, restored }) {
  const { t, i18n } = useTranslation();

  const languageButton = (lng, label) => (
    <button className={`lang-btn ${i18n.language?.startsWith(lng) ? "active" : ""}`} onClick={() => i18n.changeLanguage(lng)}>
      {label}
    </button>
  );

  return (
    <>
      <div className="topbar">
        {languageButton("es", "ES")}
        {languageButton("en", "EN")}
      </div>

      <div className="hero-grid">
        <div className="panel hero-panel">
          <div className="kicker">⚒ {t("hero.kicker")}</div>
          <h1 className="hero-title">{t("hero.title")}</h1>
          <p className="hero-text">{t("hero.description")}</p>

          <div className="hero-highlight-row">
            <div className="hero-stat">
              <span className="hero-stat-value">XML → Historia</span>
              <span className="hero-stat-label">Lectura clara del mundo</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">Async</span>
              <span className="hero-stat-label">Sin congelar la interfaz</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">ES / EN</span>
              <span className="hero-stat-label">Exploración bilingüe</span>
            </div>
          </div>

          <div className="controls">
            <label className="file-label">
              {t("upload")}
              <input type="file" accept=".xml,text/xml,application/xml" style={{ display: "none" }} onChange={onFile} />
            </label>
            <input className="search-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("search")} />
            <button className="action-btn" onClick={onClearContext}>{t("sections.resetContext")}</button>
          </div>

          {fileName ? <p className="muted" style={{ marginTop: 12, fontSize: 14 }}>{t("loadedFile")}: {fileName}</p> : null}
          {restored ? <div className="notice">{t("restoreAvailable")}</div> : null}
        </div>

        <div className="hero-side">
          <div className="panel glass hero-feature-panel">
            <h2 style={{ marginTop: 0 }}>{t("features.title")}</h2>
            <div style={{ color: "#d7e0ec", lineHeight: 1.8, fontSize: 14 }}>
              {["one", "two", "three", "four", "five"].map((k) => <div key={k}>• {t(`features.${k}`)}</div>)}
            </div>
          </div>

          <div className="feature-mini-grid">
            <div className="panel mini-card">
              <div className="mini-card-icon">🐉</div>
              <div className="mini-card-title">Dragones únicos</div>
              <div className="mini-card-text">Ficha narrativa con eventos, enemigos y tesoros.</div>
            </div>
            <div className="panel mini-card">
              <div className="mini-card-icon">🧬</div>
              <div className="mini-card-title">Linajes y figuras</div>
              <div className="mini-card-text">Árbol genealógico y personajes de mayor impacto.</div>
            </div>
            <div className="panel mini-card">
              <div className="mini-card-icon">📜</div>
              <div className="mini-card-title">Historia navegable</div>
              <div className="mini-card-text">Cronología, cultura y contexto guardado.</div>
            </div>
            <div className="panel mini-card">
              <div className="mini-card-icon">🗺️</div>
              <div className="mini-card-title">Mapa narrativo</div>
              <div className="mini-card-text">Explora dragones y figuras de impacto visualmente.</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
