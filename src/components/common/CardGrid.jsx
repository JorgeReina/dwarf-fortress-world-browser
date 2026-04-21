import React from "react";

export default function CardGrid({ items, titleKey, subtitleBuilder, descriptionBuilder, actionBuilder }) {
  return (
    <div className="card-grid">
      {items.map((item) => (
        <div key={item.id} className="panel glass">
          <div style={{ fontWeight: 700 }}>{item[titleKey]}</div>
          {subtitleBuilder ? <div className="muted" style={{ fontSize: 14, marginTop: 6 }}>{subtitleBuilder(item)}</div> : null}
          <div style={{ marginTop: 10, color: "#d7e0ec", lineHeight: 1.7 }}>{descriptionBuilder(item)}</div>
          {actionBuilder ? <div style={{ marginTop: 14 }}>{actionBuilder(item)}</div> : null}
        </div>
      ))}
    </div>
  );
}
