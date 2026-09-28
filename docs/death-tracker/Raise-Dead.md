# Raise Dead

An interactive revival UI for bringing defeated NPCs back into the fight.

## Opening Raise Dead

- Run the **Raise Dead** macro from the compendium.
- Call `game.modules.get('draw-steel-death-tracker').api.revive()` from the console.

> **Visual coming soon**

## How to Use

1. Open Raise Dead. The canvas dims and defeated token outlines appear as clickable highlights.
2. Click tokens to select them for revival. Click again to deselect.
3. Press **Enter** or double-click to confirm and revive the selected tokens.
4. Press **Escape** or right-click to cancel.

If only one token qualifies and **Auto-Confirm Single Selection** is enabled, it is selected and revived automatically without any clicks.

## What Revival Does

For each revived token:

1. The defeated condition and overlay are removed.
2. Stamina is restored to 1 (or to maximum for minions).
3. The token's Stamina bar display is restored to its pre-death setting.
4. A new combatant entry is created in the active combat.
5. Squad stamina is adjusted to account for the returning minion (if applicable).
6. Death-related chat messages for the token are cleared from the log.

## Revive All

To revive every defeated token at once without the picker UI, run the **Revive All** macro, or call `game.modules.get('draw-steel-death-tracker').api.reviveAll()` from the console.

## Settings

| Setting | What It Does |
|---|---|
| Auto-Confirm Target Selection | Automatically confirm when the required number of targets are selected |
| Clear Effects on Revive | Remove conditions from the token on revival |

## Notes

- Raise Dead requires an active combat. It cannot be used outside of a combat encounter.
- Players cannot open Raise Dead directly; it is Director-only.
