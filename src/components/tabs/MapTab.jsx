import React from "react";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";

export default function MapTab({ mapData }) {
  const { t } = useTranslation();
  const center = [18, 8];

  return (
    <div className="panel">
      <h3 style={{ marginTop: 0 }}>{t("sections.mapTitle")}</h3>
      <p className="muted" style={{ lineHeight: 1.7 }}>{t("sections.mapNote")}</p>
      <div className="map-container">
        <MapContainer center={center} zoom={2} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
          <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {mapData.dragons.map((point) => (
            <CircleMarker
              key={point.id}
              center={point.coords}
              radius={8}
              pathOptions={{ color: "#ef4444", fillColor: "#ef4444", fillOpacity: 0.9 }}
            >
              <Popup>
                <strong>{point.name}</strong><br />{point.description}
              </Popup>
            </CircleMarker>
          ))}
          {mapData.figures.map((point) => (
            <CircleMarker
              key={point.id}
              center={point.coords}
              radius={7}
              pathOptions={{ color: "#a78bfa", fillColor: "#a78bfa", fillOpacity: 0.9 }}
            >
              <Popup>
                <strong>{point.name}</strong><br />{point.description}
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
      <div className="legend">
        <span><span className="legend-dot" style={{ background: "#ef4444" }} />{t("sections.mapLegendDragons")}</span>
        <span><span className="legend-dot" style={{ background: "#a78bfa" }} />{t("sections.mapLegendFigures")}</span>
      </div>
    </div>
  );
}
