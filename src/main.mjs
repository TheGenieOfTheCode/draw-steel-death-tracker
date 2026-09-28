import {
  registerDeathTrackerHooks, registerPickerLock, registerDeferDeath, registerDeathVisuals, registerDefeatedTokenVisibility,
  registerDeathTrackerDstd, deathTrackerApi, syncCedeDeathPicker, registerDeathTrackerSockets,
} from './index.mjs';
import { DT_ID, setDtSocket } from './dt-core.mjs';
import { registerDeathTrackerSettings, migrateFromCombatTools } from './settings.mjs';
import { suppressTrackerAutoDefeat } from './combat-tracker-compat.mjs';

export const MODULE_ID = DT_ID;

const LEGACY = 'draw-steel-combat-tools';
const olderCombatTools = () => {
  if (!game.settings.settings.has(`${LEGACY}.deathTrackerEnabled`)) return false;
  try { return game.settings.get(LEGACY, 'deathTrackerEnabled') !== false; } catch { return true; }
};
let standingAside = false;

Hooks.once('init', () => {
  if (olderCombatTools()) {
    standingAside = true;
    Hooks.once('ready', () => {
      if (!game.user.isGM) return;
      ui.notifications.warn(game.i18n.format('DSDT.notice.olderCombatTools', { version: game.modules.get(LEGACY)?.version ?? '' }), { permanent: true });
    });
    return;
  }
  registerDeathTrackerSettings();
  registerDeathTrackerHooks();
  registerPickerLock();
  registerDeferDeath();
  registerDeathVisuals();
  registerDeathTrackerDstd();
  registerDefeatedTokenVisibility();
  game.modules.get(DT_ID).api = deathTrackerApi;
});

Hooks.once('socketlib.ready', () => {
  if (standingAside) return;
  const socket = socketlib.registerModule(DT_ID);
  registerDeathTrackerSockets(socket);
  setDtSocket(socket);
});

Hooks.once('ready', async () => {
  if (standingAside) return;
  suppressTrackerAutoDefeat();
  syncCedeDeathPicker();
  await migrateFromCombatTools();
});
