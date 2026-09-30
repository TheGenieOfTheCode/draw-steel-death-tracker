import { DT_ID as M, readFlag, setting, dtSocket } from './dt-core.mjs';
import { services } from './ctlib.mjs';

const hidingDefeated = () => readFlag(game.user, 'hideDefeated') === true;

const _isDeadMinion = (squad, actor) => {
  if (actor?.statuses?.has(CONFIG.specialStatusEffects?.DEFEATED ?? 'dead')) return true;
  return !!squad.minions?.find?.((m) => m.actor === actor)?.defeated;
};

export const revivedInitiative = (combatant) => {
  const held = readFlag(combatant, 'heldInitiative');
  if (held && held.round === combatant.parent?.round) return Math.max(0, Number(held.value) || 0);
  return combatant.actor?.system?.combat?.turns ?? 1;
};

export const defeatUpdate = (combatant) => ({
  _id: combatant.id,
  defeated: true,
  initiative: 0,
  flags: { [M]: { heldInitiative: { value: combatant.initiative ?? 0, round: combatant.parent?.round ?? 0 } } },
});

export const reviveUpdate = (combatant) => ({
  _id: combatant.id,
  defeated: false,
  initiative: revivedInitiative(combatant),
  flags: { [M]: { heldInitiative: new foundry.data.operators.ForcedDeletion() } },
});

export const markDefeated = async (combatants, options = {}) => {
  const list = combatants.filter((c) => c && !c.defeated);
  if (!list.length) return;
  await list[0].parent.updateEmbeddedDocuments('Combatant', list.map(defeatUpdate), options).catch((err) => {
    if (setting('debugMode')) console.warn('Death Tracker | could not mark the fallen defeated:', err);
  });
};

const _hideDefeatedRows = (_app, element) => {
  const root = element instanceof HTMLElement ? element : element?.[0];
  if (!root) return;
  const hide = hidingDefeated();
  for (const el of root.querySelectorAll('li.combatant.defeated, .combatant-group.defeated')) {
    el.style.display = hide ? 'none' : '';
  }
};

export const reviveCombatant = async (combatant) => {
  const combat = combatant?.parent;
  if (!combat) return;
  if (combat.isOwner) return combat.updateEmbeddedDocuments('Combatant', [reviveUpdate(combatant)], { dsdtRevive: true });
  return dtSocket()?.executeAsGM('dt.reviveCombatant', combat.id, combatant.id);
};

const _syncDockHiding = () => document.body.classList.toggle('dsdt-hiding-defeated', hidingDefeated());

export const registerKeepDefeated = () => {
  services.provide('reviveCombatant', reviveCombatant);
  Hooks.once('ready', _syncDockHiding);
  Hooks.on('updateUser', (user, changes) => {
    if (user.isSelf && changes.flags?.[M] && 'hideDefeated' in changes.flags[M]) _syncDockHiding();
  });
  
  Hooks.on('preUpdateCombatant', (combatant, changed, options) => {
    if (options?.dsdtRevive || !('initiative' in changed)) return;
    if (!(Number(changed.initiative) > 0)) return;
    if (!(changed.defeated ?? combatant.defeated)) return;
    changed.initiative = 0;
  });

  Hooks.on('preUpdateCombat', (combat, changed, options) => {
    if (!('turn' in changed) || changed.turn == null || options?.dsdtAllowDefeated) return;
    const next = combat.turns?.[changed.turn];
    if (!next?.defeated) return;
    ui.notifications.warn(game.i18n.format('DSDT.notice.defeatedTurn', { name: next.name }));
    return false;
  });

  Hooks.on('renderCombatTracker', _hideDefeatedRows);

  Hooks.once('setup', () => {
    if (typeof libWrapper === 'undefined') return;
    
    libWrapper.register(M, 'CONFIG.CombatantGroup.dataModels.squad.prototype.takeDamage', function (wrapped, minions, damage, options) {
      const all = Array.isArray(minions) ? minions : [];
      const standing = all.filter((actor) => !_isDeadMinion(this, actor));
      if (standing.length === all.length) return wrapped(minions, damage, options);
      if (setting('debugMode')) console.log(`Death Tracker | ${all.length - standing.length} fallen minion(s) took no squad damage`);
      if (!standing.length) return this;
      return wrapped(standing, damage, options);
    }, 'MIXED');

    
    
    libWrapper.register(M, 'CONFIG.Combatant.documentClass.prototype._preUpdate', async function (wrapped, changes, options, user) {
      if (!('initiative' in changes) || !(changes.initiative < this.initiative)) return wrapped(changes, options, user);
      if (!(changes.defeated ?? this.defeated)) return wrapped(changes, options, user);
      const initiative = changes.initiative;
      delete changes.initiative;
      try { return await wrapped(changes, options, user); }
      finally { changes.initiative = initiative; }
    }, 'MIXED');
  });
};
