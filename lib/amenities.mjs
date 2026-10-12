/**
 * Amenity words → icon names (template/icons.js), French and English, as
 * Airbnb writes them in a listing's room tour ("Lave-vaisselle", "Four",
 * "Lit queen size"…) and as a property.json writes its own tags.
 * First match wins, so the specific rules come before the general ones.
 */
const RULES = [
  // around the house first: "Bus de ski", "École de ski", "Train de montagne"
  [/\bbus\b/, 'bus'],
  [/t[ée]l[ée]ph[ée]rique|cable car|gondola|t[ée]l[ée]cabine/, 'cable-car'],
  [/train|gare|railway/, 'train-front'],
  [/[ée]cole de ski|ski school/, 'graduation-cap'],
  [/[ée]picerie|grocery|supermarch/, 'shopping-basket'],
  [/boulangerie|bakery/, 'croissant'],
  [/resto|restaurant|\bbar\b/, 'utensils-crossed'],
  [/piscine|pool|patinoire|rink/, 'waves'],
  [/golf/, 'flag'],
  [/sport|fitness|gym/, 'dumbbell'],
  // kitchen
  [/lave-vaisselle|dishwasher/, 'dishwasher'],
  [/lave-linge|s[èe]che-linge|washer|dryer|laverie|buanderie/, 'washing-machine'],
  [/micro-ondes|microwave/, 'microwave'],
  [/cong[ée]lateur|freezer/, 'thermometer-snowflake'],
  [/r[ée]frig[ée]rateur|frigo|fridge|refrigerator/, 'refrigerator'],
  [/\bfours?\b|oven/, 'oven'],
  [/cuisini[èe]re|plaques|stove|cooktop|hob/, 'cooking-pot'],
  [/nespresso|caf[ée]|coffee/, 'coffee'],
  [/bouilloire|kettle/, 'kettle'],
  [/grille-pain|toaster/, 'toaster'],
  [/blender|mixeur/, 'blender'],
  [/verres? [àa] vin|wine/, 'wine'],
  [/vaisselle|couverts|dishes|cutlery/, 'utensils'],
  [/n[ée]cessaire pour cuisiner|cooking basics|cuisine|kitchen/, 'chef-hat'],
  [/table|\brepas\b|dining/, 'utensils-crossed'],
  // bath and wellness
  [/sauna/, 'sauna'],
  [/baignoire|bathtub|bain\b/, 'bath'],
  [/shampo|gel douche|savon|soap|body/, 'droplets'],
  [/douche|shower/, 'shower-head'],
  [/vasque|lavabo|sink/, 'sink'],
  [/s[èe]che-cheveux|hair ?dryer/, 'wind'],
  [/eau chaude|hot water/, 'droplets'],
  // bedrooms
  [/linge|draps|linen|cintres|rangement|repasser|hangers|iron/, 'shirt'],
  [/lit (pour )?b[ée]b[ée]|crib|cot\b/, 'baby'],
  [/lits? simples?|single|twin/, 'bed-single'],
  [/\bking\b|queen|lit double|double bed|\blits?\b|\bbeds?\b/, 'bed-double'],
  [/duvet|couette|plume/, 'feather'],
  [/occultant|blackout|stores|rideaux/, 'blinds'],
  // living
  [/chemin[ée]e|fireplace|feu\b/, 'flame'],
  [/chauffage|heating/, 'heater'],
  [/audio|\bson\b|enceinte|speaker|sound/, 'speaker'],
  [/t[ée]l[ée]vision|\btv\b|[ée]crans?\b/, 'tv'],
  [/wi-?fi/, 'wifi'],
  [/travail|workspace|bureau|desk/, 'laptop'],
  [/lecture|livres|reading|books/, 'book-open'],
  // winter and outside
  [/s[èe]che-chaussures|chaussures de ski|boot/, 'ski-boot'],
  [/local [àa] skis|ski room|\bskis?\b|pied des pistes|ski-in/, 'ski'],
  [/parking|stationnement/, 'square-parking'],
  [/barbecue|bbq|grill/, 'flame-kindling'],
  [/p[ée]tanque|boules/, 'boules'],
  [/jardin|garden/, 'trees'],
  [/terrasse|terrace|patio/, 'sun'],
  [/balcon|balcony/, 'fence'],
  // the facts
  [/[ée]tages?|floors?|storeys?/, 'stairs'],
  [/chambres?|bedrooms?/, 'door-open'],
  [/voyageurs?|guests?|personnes|people/, 'users'],
  [/salles? de bains?|bathrooms?/, 'bath'],
  [/montagne|mountain|vue|view/, 'mountain-snow'],
  [/note|commentaires|rating|reviews/, 'star'],
]

export function iconFor(label) {
  const s = String(label).toLowerCase()
  for (const [re, icon] of RULES) if (re.test(s)) return icon
  return 'sparkles'
}

/** [{label, icon?}] or ["label"] → [{label, icon}] */
export function withIcons(tags = []) {
  return tags.map((t) => (typeof t === 'string' ? { label: t, icon: iconFor(t) } : { ...t, icon: t.icon || iconFor(t.label) }))
}
