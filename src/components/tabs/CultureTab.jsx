import React from "react";
import CardGrid from "../common/CardGrid";

export default function CultureTab({ collections, writtenContents, forms }) {
  return (
    <div className="section-stack">
      <CardGrid items={collections} titleKey="name" subtitleBuilder={(item) => `${item.type} · ${item.startYear || "?"}-${item.endYear || "?"}`} descriptionBuilder={(item) => item.summary} />
      <CardGrid items={writtenContents} titleKey="title" subtitleBuilder={(item) => item.form} descriptionBuilder={(item) => item.summary} />
      <CardGrid items={forms} titleKey="name" descriptionBuilder={(item) => item.summary} />
    </div>
  );
}
