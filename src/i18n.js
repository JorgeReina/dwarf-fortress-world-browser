import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const resources = {
  es: {
    translation: {
      upload: "Subir XML",
      loadedFile: "Archivo cargado",
      search: "Buscar guerras, reyes, dragones, artefactos...",
      worldLoaded: "Mundo cargado",
      allYears: "Todos los años",
      year: "Año",
      timeline: "Cronología",
      impact: "Historias impactantes",
      artifacts: "Objetos legendarios",
      dragons: "Dragones",
      figures: "Figuras de impacto",
      world: "Mundo",
      culture: "Cultura",
      map: "Mapa",
      loadingTab: "Cargando contenido de la pestaña...",
      loadingXml: "Analizando XML en segundo plano...",
      restoreAvailable: "Se ha restaurado el último contexto guardado.",
      stats: {
        events: "Eventos",
        figures: "Figuras",
        artifacts: "Artefactos",
        sites: "Sitios",
        regions: "Regiones",
        entities: "Entidades",
        collections: "Colecciones",
        written: "Textos"
      },
      hero: {
        kicker: "Explorador histórico escalable de Dwarf Fortress",
        title: "Análisis asíncrono, pestañas modulares y contexto persistido.",
        description: "La app parsea el XML fuera del hilo principal, persiste el contexto en el navegador y distribuye la interfaz en componentes para que el mundo no congele la UI."
      },
      features: {
        title: "Qué cambia en esta versión",
        one: "Parsing pesado en Web Worker para evitar bloqueos de la interfaz.",
        two: "Persistencia del contexto resumido y del estado UI en localStorage.",
        three: "Componentes separados por dominio para escalar mejor.",
        four: "Mapa simplificado solo con dragones y figuras de impacto.",
        five: "Traducción heurística del texto del XML según el idioma elegido."
      },
      errors: {
        title: "Error al procesar el XML",
        read: "No se pudo leer el archivo."
      },
      sections: {
        strongestSpecies: "Especie con mayor fuerza estimada",
        strongestSpeciesEmpty: "No hay suficientes datos para estimar la especie dominante.",
        topWar: "Guerra o conflicto de mayor impacto",
        topWarEmpty: "No se detectaron guerras o grandes conflictos en el XML cargado.",
        champions: "Campeones destacados",
        noResults: "No hay eventos que coincidan con la búsqueda.",
        noDragons: "No se encontraron dragones identificables en este XML.",
        speciesRanking: "Ranking de especies",
        powerfulFigures: "Personajes de mayor impacto",
        forms: "Formas culturales",
        uploadTitle: "Sube tu exportación XML",
        uploadDescription: "Esta versión refactoriza la app en componentes, usa un worker asíncrono y guarda contexto para continuar la exploración si la sesión se interrumpe.",
        dragonChart: "Dragones únicos detectados por año de referencia",
        dragonChartEmpty: "No hay suficientes datos de dragones para generar la gráfica.",
        mapTitle: "Mapa histórico simplificado",
        mapNote: "Este mapa deja únicamente puntos de dragones y figuras de impacto. Cuando no existen coordenadas reales, se usa una distribución determinista basada en IDs para representar la narrativa sin congelar la app.",
        dragonAge: "Edad",
        dragonLocation: "Último lugar conocido",
        dragonStatus: "Estado",
        dragonAlive: "Vivo o sin muerte registrada",
        dragonDead: "Muerto",
        dragonEvents: "Eventos relacionados",
        dragonEnemies: "Enemigos abatidos",
        dragonTreasures: "Tesoros / artefactos asociados",
        inspect: "Ver detalle",
        genealogy: "Árbol genealógico",
        notableEvents: "Eventos destacables",
        enemiesDefeated: "Enemigos abatidos",
        impactedBy: "Impacto narrativo",
        detailPanel: "Panel de detalle",
        close: "Cerrar",
        mapLegendDragons: "Dragones",
        mapLegendFigures: "Figuras de impacto",
        progress: "Progreso de análisis",
        resetContext: "Borrar contexto guardado"
      }
    }
  },
  en: {
    translation: {
      upload: "Upload XML",
      loadedFile: "Loaded file",
      search: "Search wars, kings, dragons, artifacts...",
      worldLoaded: "Loaded world",
      allYears: "All years",
      year: "Year",
      timeline: "Timeline",
      impact: "Impactful stories",
      artifacts: "Legendary artifacts",
      dragons: "Dragons",
      figures: "Impact figures",
      world: "World",
      culture: "Culture",
      map: "Map",
      loadingTab: "Loading tab content...",
      loadingXml: "Analyzing XML in a background worker...",
      restoreAvailable: "The last saved context has been restored.",
      stats: {
        events: "Events",
        figures: "Figures",
        artifacts: "Artifacts",
        sites: "Sites",
        regions: "Regions",
        entities: "Entities",
        collections: "Collections",
        written: "Written works"
      },
      hero: {
        kicker: "Scalable Dwarf Fortress history explorer",
        title: "Async analysis, modular tabs, and persisted context.",
        description: "The app parses XML off the main thread, persists context in browser storage, and distributes the UI into components so the world stops freezing the interface."
      },
      features: {
        title: "What changes in this version",
        one: "Heavy parsing runs in a Web Worker to avoid UI blocking.",
        two: "A summarized context snapshot and UI state are persisted in localStorage.",
        three: "Components are split by domain for better scalability.",
        four: "The map is simplified to dragons and impact figures only.",
        five: "XML text is translated heuristically according to the selected language."
      },
      errors: {
        title: "Error processing XML",
        read: "The file could not be read."
      },
      sections: {
        strongestSpecies: "Estimated strongest species",
        strongestSpeciesEmpty: "Not enough data to estimate a dominant species.",
        topWar: "Highest-impact war or conflict",
        topWarEmpty: "No wars or major conflicts were detected in the loaded XML.",
        champions: "Featured champions",
        noResults: "No events match your search.",
        noDragons: "No identifiable dragons were found in this XML.",
        speciesRanking: "Species ranking",
        powerfulFigures: "Highest-impact characters",
        forms: "Cultural forms",
        uploadTitle: "Upload your XML export",
        uploadDescription: "This version refactors the app into components, uses an async worker, and stores context so exploration can resume if the session is interrupted.",
        dragonChart: "Unique dragons detected by reference year",
        dragonChartEmpty: "There is not enough dragon data to generate the chart.",
        mapTitle: "Simplified historical map",
        mapNote: "This map keeps only dragon and impact-figure points. When real coordinates are unavailable, a deterministic ID-based distribution is used to represent the narrative without freezing the app.",
        dragonAge: "Age",
        dragonLocation: "Last known location",
        dragonStatus: "Status",
        dragonAlive: "Alive or no recorded death",
        dragonDead: "Dead",
        dragonEvents: "Related events",
        dragonEnemies: "Defeated enemies",
        dragonTreasures: "Treasures / linked artifacts",
        inspect: "Open details",
        genealogy: "Genealogy tree",
        notableEvents: "Notable events",
        enemiesDefeated: "Defeated enemies",
        impactedBy: "Narrative impact",
        detailPanel: "Detail panel",
        close: "Close",
        mapLegendDragons: "Dragons",
        mapLegendFigures: "Impact figures",
        progress: "Parsing progress",
        resetContext: "Clear saved context"
      }
    }
  }
};

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources,
  fallbackLng: "en",
  supportedLngs: ["es", "en"],
  interpolation: { escapeValue: false },
  detection: {
    order: ["localStorage", "navigator", "htmlTag"],
    caches: ["localStorage"]
  }
});

export default i18n;
