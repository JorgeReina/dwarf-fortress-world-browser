import React from "react";
import { useTranslation } from "react-i18next";
import CardGrid from "../common/CardGrid";

export default function DragonsTab({ dragons, onOpen }) {
  const { t } = useTranslation();
  if (!dragons.length) return <div className="panel">{t("sections.noDragons")}</div>;

  return (
    <CardGrid
      items={dragons}
      titleKey="name"
      subtitleBuilder={(dragon) => `${t("sections.dragonAge")}: ${dragon.age ?? "?"} · ${t("sections.dragonLocation")}: ${dragon.location}`}
      descriptionBuilder={(dragon) => `${t("sections.dragonStatus")}: ${dragon.isDead ? t("sections.dragonDead") : t("sections.dragonAlive")}`}
      actionBuilder={(dragon) => (
        <button className="action-btn primary" onClick={() => onOpen(dragon)}>
          {t("sections.inspect")}
        </button>
      )}
    />
  );
}
