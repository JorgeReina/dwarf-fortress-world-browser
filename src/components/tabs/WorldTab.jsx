import React from "react";
import CardGrid from "../common/CardGrid";

export default function WorldTab({ regions, sites, constructions }) {
  return (
    <div className="section-stack">
      <CardGrid items={regions} titleKey="name" subtitleBuilder={(item) => item.type} descriptionBuilder={(item) => item.summary} />
      <CardGrid items={sites} titleKey="name" subtitleBuilder={(item) => item.type} descriptionBuilder={(item) => item.summary} />
      <CardGrid items={constructions} titleKey="name" subtitleBuilder={(item) => item.type} descriptionBuilder={(item) => item.summary} />
    </div>
  );
}
