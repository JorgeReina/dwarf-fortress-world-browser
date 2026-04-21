import React from "react";
import CardGrid from "../common/CardGrid";

export default function ArtifactsTab({ items }) {
  return (
    <CardGrid
      items={items}
      titleKey="name"
      subtitleBuilder={(item) => `${item.type} · ${item.material} · ${item.creator}`}
      descriptionBuilder={(item) => item.description}
    />
  );
}
