# Death Notifications

When an NPC or object token reaches 0 stamina, Death Tracker takes over from the system's default behavior and handles the defeat entirely.

## What Happens on Defeat

1. The defeated condition and overlay are applied.
2. The token stays on the battlefield as an object (it is removed from the combat tracker but remains visible).
3. A skull tile appears beneath the token (if the Death Marker setting is enabled).
4. The token's Stamina bar is hidden.
5. A chat message is posted with an **Undo** button.

Multiple deaths within 200ms are batched into a single chat message with one shared Undo button.

> **Visual coming soon**

## Undo

Clicking **Undo** in the chat message reverses the defeat fully:

- Stamina is restored.
- The defeated condition and overlay are removed.
- The token is re-added to the combat tracker.
- The Stamina bar is restored.
- The skull tile is removed.

Hovering over the Undo button highlights the token's pre-death position on the canvas as a reminder of where it was.

## Minion Deaths

When a minion squad takes enough damage to drop one or more minions:

- Death Tracker calculates how many minions should die based on the squad's remaining stamina.
- Each minion is defeated individually using the same per-token process above.
- The squad's stamina is corrected to reflect the deaths.

## Dying Escalation

For NPCs using the Dying condition (rather than instant defeat), Death Tracker automatically escalates Dying 1 to Dying 2 to Dead per Draw Steel rules, skipping the manual steps.

## Condition and Effect Cleanup

When a token dies:

- If you use Draw Steel: Combat Tools, any **Frightened** or **Taunted** conditions that listed the dying token as their source are automatically removed from all other tokens.
- The Health Estimate module (if installed) will correctly show "Dead" on the defeated token.

## Settings

| Setting | What It Does |
|---|---|
| Alternative Minion Defeat UI | Replace the system's defeat dialog with Death Tracker's |
| Show Death Marker | Show a skull tile under defeated tokens |
| Death Marker Icon | File path for the skull tile image (with live preview) |
| Clear Defeated Tokens at Combat End | Clear the fallen off the map when the encounter ends |
| Clean Up Orphaned Combat Tracker Entries | Remove combat entries for deleted tokens and actors automatically |

The full list is in the [Settings Reference](Settings-Reference).

## Notes

- Death Tracker only handles tokens that are part of an active combat. Tokens outside combat are handled by the system normally.
- Retainer actors are excluded from death animations and are treated like heroes.
