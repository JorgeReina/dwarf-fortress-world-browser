import React, { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "./components/Header";
import SummaryPanels from "./components/SummaryPanels";
import TabBar from "./components/TabBar";
import LoaderPanel from "./components/common/LoaderPanel";
import DragonDetailModal from "./components/modals/DragonDetailModal";
import FigureDetailModal from "./components/modals/FigureDetailModal";
import TimelineTab from "./components/tabs/TimelineTab";
import ImpactTab from "./components/tabs/ImpactTab";
import ArtifactsTab from "./components/tabs/ArtifactsTab";
import DragonsTab from "./components/tabs/DragonsTab";
import FiguresTab from "./components/tabs/FiguresTab";
import WorldTab from "./components/tabs/WorldTab";
import CultureTab from "./components/tabs/CultureTab";
import MapTab from "./components/tabs/MapTab";
import { usePersistentState } from "./hooks/usePersistentState";
import { useTabLoader } from "./hooks/useTabLoader";
import { STORAGE_KEYS } from "./utils/storageKeys";
import { buildPersistableSnapshot } from "./utils/snapshot";
import { translateXmlText } from "./utils/xmlTextTranslator";

function translateDataset(data, lang) {
  if (!data) return data;

  const translateTextFields = (items, fields) =>
    items.map((item) => {
      const clone = { ...item };
      fields.forEach((field) => {
        if (clone[field]) clone[field] = translateXmlText(clone[field], lang);
      });
      return clone;
    });

  const figureById = {};
  (data.figureById ? Object.values(data.figureById) : []).forEach((figure) => {
    figureById[String(figure.xmlId)] = {
      ...figure,
      notable: translateXmlText(figure.notable, lang),
      summary: translateXmlText(figure.summary, lang),
    };
  });

  return {
    ...data,
    timeline: data.timeline.map((block) => ({
      ...block,
      items: translateTextFields(block.items, ["type", "subtype", "site", "participants", "description"])
    })),
    impactfulStories: translateTextFields(data.impactfulStories, ["type", "subtype", "site", "participants", "description"]),
    artifacts: translateTextFields(data.artifacts, ["name", "type", "creator", "material", "description", "summary"]),
    dragons: data.dragons.map((dragon) => ({
      ...dragon,
      name: translateXmlText(dragon.name, lang),
      race: translateXmlText(dragon.race, lang),
      notable: translateXmlText(dragon.notable, lang),
      location: translateXmlText(dragon.location, lang),
      relatedEvents: translateTextFields(dragon.relatedEvents, ["type", "subtype", "site", "participants", "description"]),
      enemiesDefeated: dragon.enemiesDefeated.map((x) => translateXmlText(x, lang)),
      treasures: dragon.treasures.map((x) => translateXmlText(x, lang)),
    })),
    impactFigures: data.impactFigures.map((figure) => ({
      ...figure,
      name: translateXmlText(figure.name, lang),
      race: translateXmlText(figure.race, lang),
      notable: translateXmlText(figure.notable, lang),
      relatedEvents: translateTextFields(figure.relatedEvents, ["type", "subtype", "site", "participants", "description"]),
      enemiesDefeated: figure.enemiesDefeated.map((x) => translateXmlText(x, lang)),
      descendants: figure.descendants.map((d) => ({ ...d, name: translateXmlText(d.name, lang) })),
    })),
    speciesStrength: data.speciesStrength.map((item) => ({
      ...item,
      race: translateXmlText(item.race, lang),
      champions: item.champions.map((x) => translateXmlText(x, lang)),
    })),
    warImpact: translateTextFields(data.warImpact, ["type", "subtype", "site", "participants", "description"]),
    regions: translateTextFields(data.regions, ["name", "type", "summary"]),
    sites: translateTextFields(data.sites, ["name", "type", "summary"]),
    worldConstructions: translateTextFields(data.worldConstructions, ["name", "type", "summary"]),
    historicalEventCollections: translateTextFields(data.historicalEventCollections, ["name", "type", "summary"]),
    writtenContents: translateTextFields(data.writtenContents, ["title", "form", "summary"]),
    poeticForms: translateTextFields(data.poeticForms, ["name", "summary"]),
    musicalForms: translateTextFields(data.musicalForms, ["name", "summary"]),
    danceForms: translateTextFields(data.danceForms, ["name", "summary"]),
    mapMarkers: {
      dragons: data.mapMarkers.dragons.map((d) => ({ ...d, name: translateXmlText(d.name, lang), description: translateXmlText(d.description, lang) })),
      figures: data.mapMarkers.figures.map((d) => ({ ...d, name: translateXmlText(d.name, lang), description: translateXmlText(d.description, lang) })),
    },
    figureById,
    historicalFigures: translateTextFields(data.historicalFigures, ["name", "race", "notable", "summary"]),
  };
}

export default function App() {
  const { t, i18n } = useTranslation();
  const workerRef = useRef(null);

  const [data, setData] = usePersistentState(STORAGE_KEYS.snapshot, null);
  const [uiState, setUiState] = usePersistentState(STORAGE_KEYS.ui, {
    fileName: "",
    query: "",
    selectedYear: "all",
    activeTab: "timeline"
  });

  const [error, setError] = useState("");
  const [workerProgress, setWorkerProgress] = useState(0);
  const [isParsing, setIsParsing] = useState(false);
  const [restored, setRestored] = useState(Boolean(data));
  const [selectedDragon, setSelectedDragon] = useState(null);
  const [selectedFigure, setSelectedFigure] = useState(null);

  const filteredTimeline = useMemo(() => {
    if (!data) return [];
    const q = uiState.query.trim().toLowerCase();
    return data.timeline
      .filter((yearBlock) => uiState.selectedYear === "all" || String(yearBlock.year) === uiState.selectedYear)
      .map((yearBlock) => ({
        ...yearBlock,
        items: yearBlock.items.filter((item) => !q || item.rawText?.includes?.(q) || JSON.stringify(item).toLowerCase().includes(q)),
      }))
      .filter((yearBlock) => yearBlock.items.length > 0);
  }, [data, uiState.query, uiState.selectedYear]);

  const viewData = useMemo(() => {
    if (!data) return null;
    return translateDataset(data, i18n.language?.startsWith("es") ? "es" : "en");
  }, [data, i18n.language]);

  const tabLoading = useTabLoader(uiState.activeTab);

  const updateUiState = (partial) => setUiState((prev) => ({ ...prev, ...partial }));

  const clearContext = () => {
    localStorage.removeItem(STORAGE_KEYS.ui);
    localStorage.removeItem(STORAGE_KEYS.snapshot);
    setData(null);
    setUiState({
      fileName: "",
      query: "",
      selectedYear: "all",
      activeTab: "timeline"
    });
    setSelectedDragon(null);
    setSelectedFigure(null);
    setRestored(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setIsParsing(true);
    setWorkerProgress(0);
    setRestored(false);
    updateUiState({ fileName: file.name });

    if (workerRef.current) workerRef.current.terminate();
    workerRef.current = new Worker(new URL("./workers/parseWorker.js", import.meta.url), { type: "module" });

    workerRef.current.onmessage = (message) => {
      const { type, value, payload, error: workerError } = message.data;
      if (type === "progress") {
        setWorkerProgress(value ?? 0);
      } else if (type === "done") {
        const snapshot = buildPersistableSnapshot(payload);
        setData(snapshot);
        setIsParsing(false);
        setWorkerProgress(100);
        setSelectedDragon(null);
        setSelectedFigure(null);
      } else if (type === "error") {
        setError(workerError || t("errors.read"));
        setIsParsing(false);
      }
    };

    workerRef.current.onerror = () => {
      setError(t("errors.read"));
      setIsParsing(false);
    };

    try {
      const buffer = await file.arrayBuffer();
      workerRef.current.postMessage({ arrayBuffer: buffer }, [buffer]);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.read"));
      setIsParsing(false);
    }
  };

  const renderTabContent = () => {
    if (!viewData) return null;
    if (tabLoading) return <LoaderPanel text={t("loadingTab")} />;

    switch (uiState.activeTab) {
      case "timeline":
        return <TimelineTab filteredTimeline={filteredTimeline} />;
      case "impact":
        return <ImpactTab items={viewData.impactfulStories} />;
      case "artifacts":
        return <ArtifactsTab items={viewData.artifacts} />;
      case "dragons":
        return <DragonsTab dragons={viewData.dragons} onOpen={setSelectedDragon} />;
      case "figures":
        return <FiguresTab speciesStrength={viewData.speciesStrength} impactFigures={viewData.impactFigures} onOpen={setSelectedFigure} />;
      case "world":
        return <WorldTab regions={viewData.regions} sites={viewData.sites} constructions={viewData.worldConstructions} />;
      case "culture":
        return <CultureTab collections={viewData.historicalEventCollections} writtenContents={viewData.writtenContents} forms={[...viewData.poeticForms, ...viewData.musicalForms, ...viewData.danceForms]} />;
      case "map":
        return <MapTab mapData={viewData.mapMarkers} />;
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <Header
        fileName={uiState.fileName}
        query={uiState.query}
        setQuery={(query) => updateUiState({ query })}
        onFile={handleFileUpload}
        onClearContext={clearContext}
        restored={restored}
      />

      {error ? (
        <div className="panel error-panel" style={{ marginTop: 24 }}>
          <strong>{t("errors.title")}</strong>
          <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{error}</div>
        </div>
      ) : null}

      {isParsing ? (
        <div className="panel" style={{ marginTop: 24 }}>
          <div className="loader-wrap" style={{ minHeight: 180 }}>
            <div>
              <div className="loader" />
              <div className="muted" style={{ marginTop: 16, textAlign: "center" }}>{t("loadingXml")}</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${workerProgress}%` }} />
              </div>
              <div className="muted" style={{ marginTop: 8, textAlign: "center" }}>{t("sections.progress")}: {workerProgress}%</div>
            </div>
          </div>
        </div>
      ) : viewData ? (
        <>
          <SummaryPanels data={viewData} selectedYear={uiState.selectedYear} setSelectedYear={(selectedYear) => updateUiState({ selectedYear })} />
          <TabBar activeTab={uiState.activeTab} setActiveTab={(activeTab) => updateUiState({ activeTab })} />
          <div style={{ marginTop: 24 }}>{renderTabContent()}</div>
        </>
      ) : !error ? (
        <div className="panel" style={{ marginTop: 24 }}>
          <h3 style={{ marginTop: 0 }}>{t("sections.uploadTitle")}</h3>
          <p className="muted" style={{ lineHeight: 1.7 }}>{t("sections.uploadDescription")}</p>
        </div>
      ) : null}

      {selectedDragon ? <DragonDetailModal dragon={selectedDragon} onClose={() => setSelectedDragon(null)} /> : null}
      {selectedFigure ? <FigureDetailModal figure={selectedFigure} allFigures={viewData?.figureById} onClose={() => setSelectedFigure(null)} /> : null}
    </div>
  );
}
