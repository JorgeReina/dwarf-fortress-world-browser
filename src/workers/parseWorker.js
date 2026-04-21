import { XMLParser } from "fast-xml-parser";

function asArray(value) {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

function parseNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeName(value, fallback = "Unknown") {
  if (value == null || value === "") return fallback;
  return String(value).replace(/_/g, " ").trim() || fallback;
}

function detectXmlEncoding(bytes) {
  try {
    const header = new TextDecoder("ascii").decode(bytes.slice(0, 256));
    const match = header.match(/encoding\s*=\s*['"]([^'"]+)['"]/i);
    return (match?.[1] || "").trim().toLowerCase();
  } catch {
    return "";
  }
}

function decodeXmlFileBuffer(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  const declared = detectXmlEncoding(bytes);
  const candidates =
    declared === "cp437" ? ["ibm437", "windows-1252", "utf-8"] : ["utf-8", "windows-1252", "ibm437"];

  for (const enc of candidates) {
    try {
      return new TextDecoder(enc).decode(bytes);
    } catch {}
  }
  return new TextDecoder().decode(bytes);
}

function sanitizeXmlText(xmlText) {
  return xmlText
    .replace(/^\uFEFF/, "")
    .replace(/<\?xml([^>]*?)encoding\s*=\s*['"][^'"]+['"]([^>]*?)\?>/i, "<?xml$1$2?>")
    .replace(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-fA-F]+;)/g, "&amp;")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
}

function getText(obj, keys, fallback = "") {
  for (const key of keys) {
    if (obj && obj[key] != null && obj[key] !== "") return obj[key];
  }
  return fallback;
}

function buildLookup(items, labelFields = ["name", "title"]) {
  const map = new Map();
  items.forEach((item) => {
    const label = labelFields.map((f) => item[f]).find(Boolean);
    if (item?.xmlId != null && label) map.set(String(item.xmlId), label);
  });
  return map;
}

function resolveFieldValue(tagName, value, refs) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  const t = String(tagName || "").toLowerCase();
  const tryMap = (...maps) => {
    for (const m of maps) if (m?.has(raw)) return m.get(raw);
    return null;
  };

  let resolved = null;
  if (/site/.test(t)) resolved = tryMap(refs.sites);
  else if (/region/.test(t)) resolved = tryMap(refs.regions, refs.undergroundRegions);
  else if (/entity|civ/.test(t)) resolved = tryMap(refs.entities);
  else if (/hf|figure|histfig/.test(t)) resolved = tryMap(refs.figures);
  else if (/artifact/.test(t)) resolved = tryMap(refs.artifacts);
  else if (/construction/.test(t)) resolved = tryMap(refs.constructions);
  else if (/identity/.test(t)) resolved = tryMap(refs.identities);
  else if (/river/.test(t)) resolved = tryMap(refs.rivers);
  else if (/mountain|peak/.test(t)) resolved = tryMap(refs.mountains);
  else if (/_id$/.test(t) || t === "id") {
    resolved = tryMap(
      refs.sites, refs.regions, refs.undergroundRegions, refs.entities,
      refs.figures, refs.artifacts, refs.constructions, refs.identities,
      refs.rivers, refs.mountains
    );
  }

  return resolved || normalizeName(raw, raw);
}

function summarizeObject(obj, refs) {
  const entries = Object.entries(obj || {}).filter(([k]) => !k.startsWith(":"));
  return entries
    .slice(0, 8)
    .map(([k, v]) => {
      const value = Array.isArray(v) ? v[0] : v;
      return `${normalizeName(k)}: ${resolveFieldValue(k, typeof value === "object" ? JSON.stringify(value) : value, refs) || "-"}`;
    })
    .join(" · ");
}

function hashCoords(seed) {
  const str = String(seed ?? "");
  let a = 0;
  for (let i = 0; i < str.length; i += 1) a = (a * 31 + str.charCodeAt(i)) % 100000;
  const lat = ((a % 1600) / 10) - 80;
  const lng = (((a * 7) % 3400) / 10) - 170;
  return [lat, lng];
}

function buildMapMarkers(dragons, figures) {
  return {
    dragons: dragons.slice(0, 50).map((dragon) => ({
      id: `dragon-map-${dragon.xmlId}`,
      name: dragon.name,
      coords: hashCoords(`dragon-${dragon.location}-${dragon.xmlId}`),
      description: `${dragon.location} · ${dragon.age ?? "?"}`,
    })),
    figures: figures.slice(0, 50).map((figure) => ({
      id: `figure-map-${figure.xmlId}`,
      name: figure.name,
      coords: hashCoords(`figure-${figure.xmlId}`),
      description: figure.notable,
    })),
  };
}

function postProgress(value, message) {
  postMessage({ type: "progress", value, message });
}

function parseXml(arrayBuffer) {
  postProgress(5, "Decoding XML");
  const xmlText = sanitizeXmlText(decodeXmlFileBuffer(arrayBuffer));

  postProgress(18, "Parsing XML tree");
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    trimValues: true,
    parseTagValue: false,
    textNodeName: "#text"
  });
  const root = parser.parse(xmlText)?.df_world;
  if (!root) throw new Error("No se encontró la raíz df_world en el XML.");

  postProgress(28, "Collecting core sections");
  const core = {
    regions: asArray(root.regions?.region).map((item, index) => ({
      id: `region-${index}`,
      xmlId: getText(item, ["id"], `${index}`),
      name: normalizeName(getText(item, ["name"], `Region ${index + 1}`)),
      type: normalizeName(getText(item, ["type"], "Unknown")),
      raw: item
    })),
    undergroundRegions: asArray(root.underground_regions?.underground_region).map((item, index) => ({
      id: `underground-region-${index}`,
      xmlId: getText(item, ["id"], `${index}`),
      name: normalizeName(getText(item, ["name"], `Underground region ${index + 1}`)),
      type: normalizeName(getText(item, ["type", "layer"], "Underground")),
      raw: item
    })),
    sites: asArray(root.sites?.site).map((item, index) => ({
      id: `site-${index}`,
      xmlId: getText(item, ["id"], `${index}`),
      name: normalizeName(getText(item, ["name"], `Site ${index + 1}`)),
      type: normalizeName(getText(item, ["type"], "Site")),
      raw: item
    })),
    artifacts: asArray(root.artifacts?.artifact).map((item, index) => ({
      id: `artifact-${index}`,
      xmlId: getText(item, ["id"], `${index}`),
      name: normalizeName(getText(item, ["name"], `Artifact ${index + 1}`)),
      type: normalizeName(getText(item, ["item_type", "type"], "Object")),
      creatorId: getText(item, ["creator_hf", "creator"], ""),
      material: normalizeName(getText(item, ["material", "mat"], "Unknown material")),
      raw: item
    })),
    worldConstructions: asArray(root.world_constructions?.world_construction).map((item, index) => ({
      id: `construction-${index}`,
      xmlId: getText(item, ["id"], `${index}`),
      name: normalizeName(getText(item, ["name"], `Construction ${index + 1}`)),
      type: normalizeName(getText(item, ["type"], "Construction")),
      raw: item
    })),
    historicalFigures: asArray(root.historical_figures?.historical_figure).map((item, index) => ({
      id: `hf-${index}`,
      xmlId: getText(item, ["id"], `${index}`),
      name: normalizeName(getText(item, ["name", "hf_name"], `Figure ${index + 1}`)),
      race: normalizeName(getText(item, ["race", "species", "caste"], "Unknown")),
      birthYear: parseNumber(getText(item, ["birth_year", "born"], "0"), 0),
      deathYear: parseNumber(getText(item, ["death_year", "died"], "0"), 0),
      notableRaw: getText(item, ["notable_event", "description", "info"], ""),
      motherId: getText(item, ["mother_hfid", "mother_id"], ""),
      fatherId: getText(item, ["father_hfid", "father_id"], ""),
      spouseId: getText(item, ["spouse_hfid", "spouse_id"], ""),
      raw: item
    })),
    entities: asArray(root.entities?.entity).map((item, index) => ({
      id: `entity-${index}`,
      xmlId: getText(item, ["id"], `${index}`),
      name: normalizeName(getText(item, ["name"], `Entity ${index + 1}`)),
      race: normalizeName(getText(item, ["race"], "Unknown")),
      type: normalizeName(getText(item, ["type"], "Entity")),
      raw: item
    })),
    identities: asArray(root.identities?.identity).map((item, index) => ({
      id: `identity-${index}`,
      xmlId: getText(item, ["id"], `${index}`),
      name: normalizeName(getText(item, ["name"], `Identity ${index + 1}`)),
      raw: item
    })),
    rivers: asArray(root.rivers?.river).map((item, index) => ({
      id: `river-${index}`,
      xmlId: getText(item, ["id"], `${index}`),
      name: normalizeName(getText(item, ["name"], `River ${index + 1}`)),
      raw: item
    })),
    mountainPeaks: asArray(root.mountain_peaks?.mountain_peak).map((item, index) => ({
      id: `mountain-peak-${index}`,
      xmlId: getText(item, ["id"], `${index}`),
      name: normalizeName(getText(item, ["name"], `Peak ${index + 1}`)),
      height: parseNumber(getText(item, ["height"], "0"), 0),
      raw: item
    }))
  };

  const refs = {
    sites: buildLookup(core.sites),
    regions: buildLookup(core.regions),
    undergroundRegions: buildLookup(core.undergroundRegions),
    entities: buildLookup(core.entities),
    figures: buildLookup(core.historicalFigures),
    artifacts: buildLookup(core.artifacts),
    constructions: buildLookup(core.worldConstructions),
    identities: buildLookup(core.identities),
    rivers: buildLookup(core.rivers),
    mountains: buildLookup(core.mountainPeaks),
  };

  postProgress(42, "Resolving references");
  const artifacts = core.artifacts.map((item) => ({
    ...item,
    creator: resolveFieldValue("creator_hf", item.creatorId, refs) || "Unknown author",
    description: normalizeName(getText(item.raw, ["description", "details", "text"], summarizeObject(item.raw, refs)), "No description"),
    summary: summarizeObject(item.raw, refs)
  }));

  const historicalFigures = core.historicalFigures.map((item) => ({
    ...item,
    notable: normalizeName(item.notableRaw || summarizeObject(item.raw, refs), "No milestone"),
    motherName: resolveFieldValue("mother_hfid", item.motherId, refs),
    fatherName: resolveFieldValue("father_hfid", item.fatherId, refs),
    spouseName: resolveFieldValue("spouse_hfid", item.spouseId, refs),
    summary: summarizeObject(item.raw, refs)
  }));

  const figureDict = Object.fromEntries(historicalFigures.map((f) => [String(f.xmlId), f]));
  const regions = core.regions.map((item) => ({ ...item, summary: summarizeObject(item.raw, refs) }));
  const sites = core.sites.map((item) => ({ ...item, summary: summarizeObject(item.raw, refs) }));
  const worldConstructions = core.worldConstructions.map((item) => ({ ...item, summary: summarizeObject(item.raw, refs) }));
  const entities = core.entities.map((item) => ({ ...item, summary: summarizeObject(item.raw, refs) }));

  const historicalEvents = asArray(root.historical_events?.historical_event).map((item, index) => {
    const type = normalizeName(getText(item, ["type", "event_type"], "Event"));
    const subtype = normalizeName(getText(item, ["subtype", "war_name", "battle_name"], ""), "");
    const siteId = getText(item, ["site_id"], "");
    const regionId = getText(item, ["region_id"], "");
    const hfid = getText(item, ["hfid", "histfig_id"], "");
    const slayerHfid = getText(item, ["slayer_hfid"], "");
    const victimHfid = getText(item, ["victim_hfid"], "");

    const siteResolved =
      resolveFieldValue("site_id", siteId, refs) ||
      resolveFieldValue("region_id", regionId, refs) ||
      normalizeName(getText(item, ["site_name", "site", "region_name"], "Unknown place"));

    const attacker = resolveFieldValue("attacker_civ", getText(item, ["attacker_civ", "attacker_civ_id"], ""), refs);
    const defender = resolveFieldValue("defender_civ", getText(item, ["defender_civ", "defender_civ_id"], ""), refs);
    const hf = resolveFieldValue("hfid", hfid, refs);
    const slayer = resolveFieldValue("slayer_hfid", slayerHfid, refs);
    const victim = resolveFieldValue("victim_hfid", victimHfid, refs);

    const participants = [...new Set([attacker, defender, hf, slayer, victim].filter(Boolean))].join(" vs ") || "Not specified";
    const description = normalizeName(getText(item, ["description", "details", "text", "outcome", "sentence"], summarizeObject(item, refs)), "No description");

    return {
      id: `event-${index}`,
      xmlId: getText(item, ["id"], `${index}`),
      year: parseNumber(getText(item, ["year", "date_year", "date year", "season_year", "season year"], "0"), 0),
      type,
      subtype,
      site: siteResolved,
      hfid,
      slayerHfid,
      victimHfid,
      participants,
      description,
      impactScore: Math.round(
        Math.max(
          description.length / 12,
          participants.split(/,| and | vs /i).length * 5,
          subtype ? 12 : 4,
          /war|battle|siege|slaughter|massacre|dragon|fall|conquest|rebellion|invasion/i.test(
            `${type} ${description} ${subtype}`
          ) ? 18 : 0
        )
      ),
      rawText: `${type} ${subtype} ${description} ${participants}`.toLowerCase()
    };
  });

  postProgress(62, "Building derived models");
  const yearsMap = new Map();
  historicalEvents.forEach((event) => {
    const key = String(event.year || 0);
    if (!yearsMap.has(key)) yearsMap.set(key, []);
    yearsMap.get(key).push(event);
  });

  const timeline = Array.from(yearsMap.entries())
    .map(([year, items]) => ({ year: Number(year), items: items.sort((a, b) => b.impactScore - a.impactScore) }))
    .sort((a, b) => a.year - b.year);

  const speciesStrength = Array.from(
    historicalFigures.reduce((acc, item) => {
      const current = acc.get(item.race) || { race: item.race, total: 0, count: 0, champions: [] };
      const powerScore =
        (item.deathYear > 0 ? 8 : 15) +
        item.notable.length / 16 +
        (/dragon|demon|titan|king|queen|general|warlord/i.test(`${item.name} ${item.notable}`) ? 18 : 0);
      current.total += powerScore;
      current.count += 1;
      if (current.champions.length < 3) current.champions.push(item.name);
      acc.set(item.race, current);
      return acc;
    }, new Map()).values()
  ).map((entry) => ({
    race: entry.race,
    averagePower: Math.round(entry.total / Math.max(entry.count, 1)),
    count: entry.count,
    champions: entry.champions,
    strengthIndex: Math.round(entry.total + entry.count * 2),
  })).sort((a, b) => b.strengthIndex - a.strengthIndex).slice(0, 10);

  const warImpact = historicalEvents
    .filter((event) => /war|battle|siege|rebellion|conquest|invasion/i.test(event.rawText))
    .sort((a, b) => b.impactScore - a.impactScore)
    .slice(0, 10);

  const dragons = historicalFigures
    .filter((figure) => /dragon|drake|wyrm/i.test(`${figure.race} ${figure.name} ${figure.notable} ${figure.summary}`))
    .map((figure) => {
      const relatedEvents = historicalEvents.filter(
        (event) =>
          String(event.hfid) === String(figure.xmlId) ||
          String(event.slayerHfid) === String(figure.xmlId) ||
          String(event.victimHfid) === String(figure.xmlId) ||
          event.rawText.includes(figure.name.toLowerCase())
      );
      const lastEvent = [...relatedEvents].sort((a, b) => b.year - a.year)[0];
      const firstKnownYear = figure.birthYear || relatedEvents.map((e) => e.year).filter(Boolean).sort((a, b) => a - b)[0] || 0;
      const lastKnownYear = figure.deathYear || (lastEvent?.year ?? firstKnownYear);
      const age = firstKnownYear && lastKnownYear ? Math.max(lastKnownYear - firstKnownYear, 0) : null;
      const enemies = relatedEvents
        .flatMap((event) => {
          const raw = event.participants.split(/ vs /i);
          return raw;
        })
        .filter((name) => name && name !== figure.name);
      const treasures = artifacts
        .filter((artifact) =>
          artifact.creator === figure.name ||
          artifact.description.toLowerCase().includes(figure.name.toLowerCase()) ||
          artifact.summary.toLowerCase().includes(figure.name.toLowerCase())
        )
        .map((artifact) => artifact.name);

      return {
        ...figure,
        age,
        firstKnownYear,
        location: lastEvent?.site || "Unknown",
        isDead: Boolean(figure.deathYear),
        relatedEvents: relatedEvents.sort((a, b) => b.year - a.year),
        enemiesDefeated: [...new Set(enemies)].slice(0, 20),
        treasures: [...new Set(treasures)].slice(0, 20),
      };
    })
    .sort((a, b) => (b.relatedEvents.length + (b.age || 0)) - (a.relatedEvents.length + (a.age || 0)));

  const dragonsByYear = Array.from(
    dragons.reduce((acc, dragon) => {
      const key = String(dragon.firstKnownYear || 0);
      acc.set(key, (acc.get(key) || 0) + 1);
      return acc;
    }, new Map()).entries()
  ).map(([year, count]) => ({ year: Number(year), count })).sort((a, b) => a.year - b.year);

  const impactFigures = historicalFigures
    .map((figure) => {
      const relatedEvents = historicalEvents.filter(
        (event) =>
          String(event.hfid) === String(figure.xmlId) ||
          String(event.slayerHfid) === String(figure.xmlId) ||
          String(event.victimHfid) === String(figure.xmlId) ||
          event.rawText.includes(figure.name.toLowerCase())
      );

      const defeated = relatedEvents
        .flatMap((event) => event.participants.split(/ vs /i))
        .filter((name) => name && name !== figure.name);

      const descendants = historicalFigures
        .filter((other) => String(other.fatherId) === String(figure.xmlId) || String(other.motherId) === String(figure.xmlId))
        .slice(0, 8);

      const narrativeImpact =
        relatedEvents.length * 4 +
        defeated.length * 2 +
        (figure.deathYear ? 2 : 6) +
        (/king|queen|general|warlord|dragon|titan|hero/i.test(`${figure.name} ${figure.notable}`) ? 15 : 0);

      return {
        ...figure,
        relatedEvents: relatedEvents.sort((a, b) => b.year - a.year),
        enemiesDefeated: [...new Set(defeated)].slice(0, 25),
        descendants,
        narrativeImpact,
      };
    })
    .sort((a, b) => b.narrativeImpact - a.narrativeImpact)
    .slice(0, 18);

  postProgress(82, "Collecting secondary sections");
  const historicalEventCollections = asArray(root.historical_event_collections?.historical_event_collection).map((item, index) => ({
    id: `event-collection-${index}`,
    xmlId: getText(item, ["id"], `${index}`),
    type: normalizeName(getText(item, ["type"], "Collection")),
    name: normalizeName(getText(item, ["name"], `Collection ${index + 1}`)),
    startYear: parseNumber(getText(item, ["start_year"], "0"), 0),
    endYear: parseNumber(getText(item, ["end_year"], "0"), 0),
    summary: summarizeObject(item, refs)
  }));
  const writtenContents = asArray(root.written_contents?.written_content).map((item, index) => ({
    id: `written-content-${index}`,
    xmlId: getText(item, ["id"], `${index}`),
    title: normalizeName(getText(item, ["title", "name"], `Written work ${index + 1}`)),
    form: normalizeName(getText(item, ["form"], "Written")),
    summary: summarizeObject(item, refs)
  }));
  const poeticForms = asArray(root.poetic_forms?.poetic_form).map((item, index) => ({
    id: `poetic-${index}`,
    name: normalizeName(getText(item, ["name"], `Poetic form ${index + 1}`)),
    summary: summarizeObject(item, refs)
  }));
  const musicalForms = asArray(root.musical_forms?.musical_form).map((item, index) => ({
    id: `musical-${index}`,
    name: normalizeName(getText(item, ["name"], `Musical form ${index + 1}`)),
    summary: summarizeObject(item, refs)
  }));
  const danceForms = asArray(root.dance_forms?.dance_form).map((item, index) => ({
    id: `dance-${index}`,
    name: normalizeName(getText(item, ["name"], `Dance form ${index + 1}`)),
    summary: summarizeObject(item, refs)
  }));

  const mapMarkers = buildMapMarkers(dragons, impactFigures);

  postProgress(100, "Done");
  return {
    worldName: normalizeName(root.name, "Unnamed world"),
    stats: {
      regions: regions.length,
      sites: sites.length,
      artifacts: artifacts.length,
      historicalFigures: historicalFigures.length,
      entities: entities.length,
      historicalEvents: historicalEvents.length,
      historicalEventCollections: historicalEventCollections.length,
      writtenContents: writtenContents.length,
    },
    timeline,
    impactfulStories: [...historicalEvents].sort((a, b) => b.impactScore - a.impactScore).slice(0, 15),
    artifacts: artifacts.slice(0, 40),
    dragons,
    dragonsByYear,
    impactFigures,
    speciesStrength,
    warImpact,
    regions: regions.slice(0, 25),
    sites: sites.slice(0, 25),
    worldConstructions: worldConstructions.slice(0, 18),
    historicalEventCollections,
    writtenContents,
    poeticForms,
    musicalForms,
    danceForms,
    mapMarkers,
    historicalFigures,
    figureById: figureDict,
  };
}

self.onmessage = (event) => {
  try {
    const result = parseXml(event.data.arrayBuffer);
    postMessage({ type: "done", payload: result });
  } catch (error) {
    postMessage({
      type: "error",
      error: error instanceof Error ? error.message : "Unknown worker error"
    });
  }
};
