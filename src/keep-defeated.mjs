import { DT_ID as M, readFlag, setting } from './dt-core.mjs';



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


export const registerKeepDefeated = () => {
  
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


};
