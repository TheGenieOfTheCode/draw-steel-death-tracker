import {
  registerDeathTrackerHooks, registerPickerLock, registerDeferDeath, registerDeathVisuals, registerDefeatedTokenVisibility,
  registerDeathTrackerDstd, deathTrackerApi, syncCedeDeathPicker, registerDeathTrackerSockets,
} from './index.mjs';
import { DT_ID, setDtSocket } from './dt-core.mjs';
import { registerDeathTrackerSettings, migrateFromCombatTools } from './settings.mjs';
import { suppressTrackerAutoDefeat } from './combat-tracker-compat.mjs';

export const MODULE_ID = DT_ID;

Hooks.once('init', () => {
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
  const socket = socketlib.registerModule(DT_ID);
  registerDeathTrackerSockets(socket);
  setDtSocket(socket);
});

Hooks.once('ready', async () => {
  suppressTrackerAutoDefeat();
  syncCedeDeathPicker();
  await migrateFromCombatTools();
});
