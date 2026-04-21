import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useTranslation } from "react-i18next";

export default function DragonChart({ data }) {
  const { t } = useTranslation();
  if (!data?.length) return <div className="panel glass">{t("sections.dragonChartEmpty")}</div>;

  return (
    <div className="panel chart-panel">
      <h3 style={{ marginTop: 0 }}>{t("sections.dragonChart")}</h3>
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="dragonFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.75}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.08}/>
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(148,163,184,.15)" strokeDasharray="3 3" />
            <XAxis dataKey="year" stroke="#94a3b8" />
            <YAxis allowDecimals={false} stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                background: "rgba(15,23,42,.96)",
                border: "1px solid rgba(148,163,184,.18)",
                borderRadius: 12,
                color: "#e2e8f0"
              }}
            />
            <Area type="monotone" dataKey="count" stroke="#22d3ee" strokeWidth={3} fill="url(#dragonFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
