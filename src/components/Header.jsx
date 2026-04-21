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
        <div className="panel">
          <div className="kicker">⚒ {t("hero.kicker")}</div>
          <h1 className="hero-title">{t("hero.title")}</h1>
          <p className="hero-text">{t("hero.description")}</p>

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

        <div className="panel glass">
          <h2 style={{ marginTop: 0 }}>{t("features.title")}</h2>
          <div style={{ color: "#d7e0ec", lineHeight: 1.8, fontSize: 14 }}>
            {["one", "two", "three", "four", "five"].map((k) => <div key={k}>• {t(`features.${k}`)}</div>)}
          </div>
        </div>
      </div>
    </>
  );
}
