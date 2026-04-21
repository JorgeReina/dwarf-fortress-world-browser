import React from "react";
import { useTranslation } from "react-i18next";

export default function TabBar({ activeTab, setActiveTab }) {
  const { t } = useTranslation();
  const tabs = [
    ["timeline", t("timeline")],
    ["impact", t("impact")],
    ["artifacts", t("artifacts")],
    ["dragons", t("dragons")],
    ["figures", t("figures")],
    ["world", t("world")],
    ["culture", t("culture")],
    ["map", t("map")]
  ];

  return (
    <div className="tabs">
      {tabs.map(([id, label]) => (
        <button key={id} className={`tab-btn ${activeTab === id ? "active" : ""}`} onClick={() => setActiveTab(id)}>
          {label}
        </button>
      ))}
    </div>
  );
}
