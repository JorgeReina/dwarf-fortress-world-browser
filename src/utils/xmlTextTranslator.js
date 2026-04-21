const EN_TO_ES = [
  [/dragon/gi, "dragón"],
  [/drake/gi, "draco"],
  [/wyrm/gi, "guiverno"],
  [/battle/gi, "batalla"],
  [/war/gi, "guerra"],
  [/siege/gi, "asedio"],
  [/killed/gi, "mató"],
  [/slain/gi, "abatido"],
  [/artifact/gi, "artefacto"],
  [/treasure/gi, "tesoro"],
  [/mountain/gi, "montaña"],
  [/forest/gi, "bosque"],
  [/desert/gi, "desierto"],
  [/lake/gi, "lago"],
  [/queen/gi, "reina"],
  [/king/gi, "rey"],
  [/hero/gi, "héroe"],
  [/founded/gi, "fundó"],
  [/destroyed/gi, "destruyó"],
  [/conquered/gi, "conquistó"],
  [/the /gi, "el "],
];

const ES_TO_EN = [
  [/dragón/gi, "dragon"],
  [/guerra/gi, "war"],
  [/batalla/gi, "battle"],
  [/asedio/gi, "siege"],
  [/artefacto/gi, "artifact"],
  [/tesoro/gi, "treasure"],
  [/montaña/gi, "mountain"],
  [/bosque/gi, "forest"],
  [/desierto/gi, "desert"],
  [/lago/gi, "lake"],
  [/reina/gi, "queen"],
  [/rey/gi, "king"],
  [/héroe/gi, "hero"],
  [/fundó/gi, "founded"],
  [/destruyó/gi, "destroyed"],
  [/conquistó/gi, "conquered"],
];

export function translateXmlText(text, lang) {
  if (!text) return "";
  let out = String(text);
  const rules = lang === "es" ? EN_TO_ES : lang === "en" ? ES_TO_EN : [];
  rules.forEach(([pattern, replacement]) => {
    out = out.replace(pattern, replacement);
  });
  return out;
}
