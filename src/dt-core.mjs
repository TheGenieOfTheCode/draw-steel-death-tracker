import { config, dropKey } from './ctlib.mjs';

export const DT_ID = 'draw-steel-death-tracker';
export const LEGACY_ID = 'draw-steel-combat-tools';

export const setting = (key) => (game.settings.settings.has(`${DT_ID}.${key}`)
  ? game.settings.get(DT_ID, key)
  : config.get(key));

let _socket = null;
export const setDtSocket = (socket) => { _socket = socket; };
export const dtSocket = () => _socket;

const own = (doc) => doc?.flags?.[DT_ID];
const old = (doc) => doc?.flags?.[LEGACY_ID];

export const readFlag = (doc, key) => own(doc)?.[key] ?? old(doc)?.[key];

export const readFlags = (doc) => {
  const legacy = old(doc);
  const current = own(doc);
  if (!legacy) return current;
  if (!current) return legacy;
  return { ...legacy, ...current };
};

export const writeFlag = (doc, key, value) => doc.setFlag(DT_ID, key, value);

export const dropFlags = (doc, ...keys) => {
  const out = { [DT_ID]: Object.fromEntries(keys.map((k) => [k, dropKey()])) };
  const legacy = old(doc);
  const stale = legacy ? keys.filter((k) => k in legacy) : [];
  if (stale.length) out[LEGACY_ID] = Object.fromEntries(stale.map((k) => [k, dropKey()]));
  return out;
};

export const clearFlag = (doc, key) => doc.update({ flags: dropFlags(doc, key) });

export const combatToolsFlag = (doc, key) => doc?.flags?.[LEGACY_ID]?.[key];
