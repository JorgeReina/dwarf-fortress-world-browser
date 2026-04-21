import React from "react";
import { useTranslation } from "react-i18next";
import CardGrid from "../common/CardGrid";

export default function ImpactTab({ items }) {
  const { t } = useTranslation();
  return (
    <CardGrid
      items={items}
      titleKey="type"
      subtitleBuilder={(item) => `${t("year")} ${item.year} · ${item.site}`}
      descriptionBuilder={(item) => item.description}
    />
  );
}
