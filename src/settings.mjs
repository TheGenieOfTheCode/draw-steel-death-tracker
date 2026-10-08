import { DT_ID, LEGACY_ID, writeFlag } from './dt-core.mjs';

const L = (key) => game.i18n.localize(`DSDT.setting.${key}`);
const DSTD = 'draw-steel-target-damage';
const DSTD_MINION_KEY = 'minionDamageAutomation';
const TRACKER_ID = 'draw-steel-combat-tracker';

const WORLD_KEYS = ['overrideMinionDefeat', 'autoAssignDamagedMinion', 'pickDeathsEnabled', 'gmControlsAllDeathPickers',
  'deathAnimationDuration', 'batchAnimationSafety', 'deathMarkerEnabled', 'deathMarkerIcon', 'clearSkullsOnCombatEnd',
  'clearEffectsOnRevive', 'cleanOrphanedCombatants', 'playerCanUndoCausedDeaths',
  'deathTrackerSkullIds', 'suppressTrackerAutoDefeat'];
const CLIENT_KEYS = ['deathPickerDimAll', 'cedeDeathPickerToGM'];

const SETTING_HEADERS = [
  ['MinionDeaths', ['overrideMinionDefeat', 'autoAssignDamagedMinion', 'pickDeathsEnabled', 'deathPickerDimAll',
    'gmControlsAllDeathPickers', 'cedeDeathPickerToGM']],
  ['DeathAnimation', ['deathAnimationDuration', 'batchAnimationSafety']],
  ['FallenCreatures', ['deathMarkerEnabled', 'deathMarkerIcon', 'clearSkullsOnCombatEnd', 'cleanOrphanedCombatants']],
  ['RevivesAndUndo', ['clearEffectsOnRevive', 'playerCanUndoCausedDeaths']],
  ['CombatTracker', ['suppressTrackerAutoDefeat']],
  ['Debug', ['debugMode']],
];

const SUB_SETTINGS = {
  overrideMinionDefeat: ['autoAssignDamagedMinion'],
  pickDeathsEnabled: ['deathPickerDimAll', 'gmControlsAllDeathPickers', 'cedeDeathPickerToGM'],
  deathMarkerEnabled: ['deathMarkerIcon'],
};

(() => {
  try {
    for (const key of CLIENT_KEYS) {
      const target = `${DT_ID}.${key}`;
      const source = localStorage.getItem(`${LEGACY_ID}.${key}`);
      if (source !== null && localStorage.getItem(target) === null) localStorage.setItem(target, source);
    }
  } catch { }
})();

const hiddenKeys = () => [
  ...(game.user.isGM || game.settings.get(DT_ID, 'gmControlsAllDeathPickers') ? ['cedeDeathPickerToGM'] : []),
  ...(game.settings.get(DT_ID, 'debugMode') || game.modules.get(TRACKER_ID)?.active ? [] : ['suppressTrackerAutoDefeat']),
];

Hooks.on('renderSettingsConfig', (_app, html) => {
  const root = html instanceof HTMLElement ? html : html?.[0];
  if (!root) return;
  const groupOf = (key) => root.querySelector(`[name="${DT_ID}.${key}"]`)?.closest('.form-group') ?? null;

  for (const key of hiddenKeys()) groupOf(key)?.remove();

  const picker = root.querySelector(`file-picker[name="${DT_ID}.deathMarkerIcon"]`);
  if (picker && !picker.nextElementSibling?.classList.contains('dsdt-icon-tile')) {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'dsdt-icon-tile';
    tile.dataset.tooltip = picker.value;
    tile.setAttribute('aria-label', L('deathMarkerIcon.name'));
    const img = document.createElement('img');
    img.src = picker.value;
    img.alt = '';
    tile.append(img);
    const FP = foundry.applications.apps?.FilePicker?.implementation ?? FilePicker;
    tile.addEventListener('click', () => new FP({
      type: 'image',
      current: picker.value,
      callback: (path) => {
        picker.value = path;
        picker.dispatchEvent(new Event('change', { bubbles: true }));
        img.src = path;
        tile.dataset.tooltip = path;
      },
    }).render(true));
    picker.style.display = 'none';
    picker.after(tile);
  }

  for (const [header, keys] of SETTING_HEADERS) {
    const first = keys.map(groupOf).find(Boolean);
    if (!first || first.previousElementSibling?.classList?.contains('dsdt-settings-header')) continue;
    const h = document.createElement('h3');
    h.className = 'dsdt-settings-header';
    h.textContent = game.i18n.localize(`DSDT.settingHeader.${header}`);
    first.insertAdjacentElement('beforebegin', h);
  }

  for (const [parent, children] of Object.entries(SUB_SETTINGS)) {
    const box = root.querySelector(`[name="${DT_ID}.${parent}"]`);
    if (!box) continue;
    const groups = children.map(groupOf).filter(Boolean);
    for (const g of groups) g.classList.add('dsdt-sub-setting');
    const sync = () => {
      for (const g of groups) {
        g.classList.toggle('dsdt-sub-off', !box.checked);
        g.querySelectorAll('input, select, button, file-picker').forEach((i) => { i.disabled = !box.checked; });
      }
    };
    box.addEventListener('change', sync);
    sync();
  }
});

const minionDeathConflict = async () => {
  if (!game.users.activeGM?.isSelf) return;
  if (!game.modules.get(DSTD)?.active) return;
  if (!game.settings.get(DT_ID, 'overrideMinionDefeat')) return;
  let theirValue;
  try { theirValue = game.settings.get(DSTD, DSTD_MINION_KEY); } catch { return; }
  if (!theirValue) return;

  await game.settings.set(DSTD, DSTD_MINION_KEY, false);

  const cb = document.querySelector(`[name="${DSTD}.${DSTD_MINION_KEY}"]`);
  if (cb) cb.checked = false;
  ui.notifications.warn(game.i18n.localize('DSDT.notice.conflict.minionDeath'));
  foundry.applications.settings.SettingsConfig.reloadConfirm({ world: true });
};

export const registerDeathTrackerSettings = () => {
  game.settings.register(DT_ID, 'overrideMinionDefeat', {
    name: L('overrideMinionDefeat.name'), hint: L('overrideMinionDefeat.hint'),
    scope: 'world', config: true, type: Boolean, default: true,
  });
  game.settings.register(DT_ID, 'autoAssignDamagedMinion', {
    name: L('autoAssignDamagedMinion.name'), hint: L('autoAssignDamagedMinion.hint'),
    scope: 'world', config: true, type: Boolean, default: true,
    onChange: (value) => { if (value) minionDeathConflict(); },
  });
  game.settings.register(DT_ID, 'pickDeathsEnabled', {
    name: L('pickDeathsEnabled.name'), hint: L('pickDeathsEnabled.hint'),
    scope: 'world', config: true, type: Boolean, default: true,
  });
  game.settings.register(DT_ID, 'deathPickerDimAll', {
    name: L('deathPickerDimAll.name'), hint: L('deathPickerDimAll.hint'),
    scope: 'client', config: true, type: Boolean, default: true,
  });
  game.settings.register(DT_ID, 'gmControlsAllDeathPickers', {
    name: L('gmControlsAllDeathPickers.name'), hint: L('gmControlsAllDeathPickers.hint'),
    scope: 'world', config: true, type: Boolean, default: false,
  });
  game.settings.register(DT_ID, 'cedeDeathPickerToGM', {
    name: L('cedeDeathPickerToGM.name'), hint: L('cedeDeathPickerToGM.hint'),
    scope: 'client', config: true, type: Boolean, default: false,
    onChange: (v) => { if (game.user && !game.user.isGM) writeFlag(game.user, 'cedeDeathPickerToGM', v); },
  });
  game.settings.register(DT_ID, 'deathAnimationDuration', {
    name: L('deathAnimationDuration.name'), hint: L('deathAnimationDuration.hint'),
    scope: 'world', config: true, type: Number, default: 2000, range: { min: 0, max: 5000, step: 100 },
  });
  game.settings.register(DT_ID, 'batchAnimationSafety', {
    name: L('batchAnimationSafety.name'), hint: L('batchAnimationSafety.hint'),
    scope: 'world', config: true, type: Boolean, default: true,
  });
  game.settings.register(DT_ID, 'deathMarkerEnabled', {
    name: L('deathMarkerEnabled.name'), hint: L('deathMarkerEnabled.hint'),
    scope: 'world', config: true, type: Boolean, default: false,
    requiresReload: true,
  });
  game.settings.register(DT_ID, 'deathMarkerIcon', {
    name: L('deathMarkerIcon.name'), hint: L('deathMarkerIcon.hint'),
    scope: 'world', config: true, type: String, default: 'icons/commodities/bones/skull-hollow-worn-blue.webp',
    filePicker: 'image', requiresReload: true,
  });
  game.settings.register(DT_ID, 'clearSkullsOnCombatEnd', {
    name: L('clearSkullsOnCombatEnd.name'), hint: L('clearSkullsOnCombatEnd.hint'),
    scope: 'world', config: true, type: Boolean, default: false,
  });
  game.settings.register(DT_ID, 'cleanOrphanedCombatants', {
    name: L('cleanOrphanedCombatants.name'), hint: L('cleanOrphanedCombatants.hint'),
    scope: 'world', config: true, type: Boolean, default: true,
  });
  game.settings.register(DT_ID, 'clearEffectsOnRevive', {
    name: L('clearEffectsOnRevive.name'), hint: L('clearEffectsOnRevive.hint'),
    scope: 'world', config: true, type: Boolean, default: false,
  });
  game.settings.register(DT_ID, 'playerCanUndoCausedDeaths', {
    name: L('playerCanUndoCausedDeaths.name'), hint: L('playerCanUndoCausedDeaths.hint'),
    scope: 'world', config: true, type: Boolean, default: true,
  });
  game.settings.register(DT_ID, 'suppressTrackerAutoDefeat', {
    name: L('suppressTrackerAutoDefeat.name'), hint: L('suppressTrackerAutoDefeat.hint'),
    scope: 'world', config: true, type: Boolean, default: true,
  });
  game.settings.register(DT_ID, 'debugMode', {
    name: L('debugMode.name'), hint: L('debugMode.hint'),
    scope: 'world', config: true, type: Boolean, default: false,
  });
  game.settings.register(DT_ID, 'deathTrackerSkullIds', { scope: 'world', config: false, type: Array, default: [] });
  game.settings.register(DT_ID, 'migratedFromCombatTools', { scope: 'world', config: false, type: Boolean, default: false });

  Hooks.once('ready', () => { minionDeathConflict(); });
  Hooks.on('updateSetting', (setting) => {
    if (setting.key === `${DSTD}.${DSTD_MINION_KEY}` && setting.value) minionDeathConflict();
    if (setting.key === `${DT_ID}.overrideMinionDefeat` && setting.value) minionDeathConflict();
  });
};

export const migrateFromCombatTools = async () => {
  if (!game.users.activeGM?.isSelf) return;
  if (game.settings.get(DT_ID, 'migratedFromCombatTools')) return;
  const world = game.settings.storage.get('world');
  const stored = (id, key) => world?.getSetting(`${id}.${key}`);
  const fallback = { deathMarkerEnabled: 'skullEnabled', deathMarkerIcon: 'skullIcon', playerCanUndoCausedDeaths: 'playerCanUndoDstdDeaths' };
  const parse = (v) => {
    if (typeof v !== 'string') return v;
    try { return JSON.parse(v); } catch { return v; }
  };
  let copied = 0;
  for (const key of WORLD_KEYS) {
    try {
      if (stored(DT_ID, key)) continue;
      const old = stored(LEGACY_ID, key) ?? (fallback[key] ? stored(LEGACY_ID, fallback[key]) : null);
      if (!old) continue;
      const value = parse(old.value);
      if (value === undefined || value === null || value === '') continue;
      await game.settings.set(DT_ID, key, value);
      copied++;
    } catch (err) {
      console.warn(`${DT_ID} | could not carry ${key} over from Combat Tools:`, err);
    }
  }
  await game.settings.set(DT_ID, 'migratedFromCombatTools', true);
  if (copied) console.log(`${DT_ID} | carried ${copied} setting(s) over from Combat Tools`);
};
