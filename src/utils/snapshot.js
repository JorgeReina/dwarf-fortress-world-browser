export function buildPersistableSnapshot(parsed) {
  if (!parsed) return null;
  return {
    worldName: parsed.worldName,
    stats: parsed.stats,
    timeline: parsed.timeline.slice(0, 80),
    impactfulStories: parsed.impactfulStories.slice(0, 15),
    artifacts: parsed.artifacts.slice(0, 24),
    dragons: parsed.dragons,
    dragonsByYear: parsed.dragonsByYear,
    impactFigures: parsed.impactFigures,
    speciesStrength: parsed.speciesStrength,
    warImpact: parsed.warImpact,
    regions: parsed.regions.slice(0, 20),
    sites: parsed.sites.slice(0, 20),
    worldConstructions: parsed.worldConstructions.slice(0, 12),
    historicalEventCollections: parsed.historicalEventCollections.slice(0, 12),
    writtenContents: parsed.writtenContents.slice(0, 12),
    poeticForms: parsed.poeticForms.slice(0, 12),
    musicalForms: parsed.musicalForms.slice(0, 12),
    danceForms: parsed.danceForms.slice(0, 12),
    mapMarkers: parsed.mapMarkers,
    figureById: parsed.figureById,
    historicalFigures: parsed.historicalFigures.slice(0, 120)
  };
}
