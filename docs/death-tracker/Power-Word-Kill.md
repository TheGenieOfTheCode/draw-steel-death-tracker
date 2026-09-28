# Power Word: Kill

A targeted kill tool for the Director that defeats one or more tokens instantly, respecting squad stamina breakpoints.

## Running Power Word: Kill

Power Word: Kill is **macro-only**. Run the **Power Word: Kill** macro from the Death Tracker compendium. There is no toolbar button.

> **Visual coming soon**

## Selection UI

When the macro runs:

1. The canvas dims and X-marks appear on eligible tokens.
2. Click tokens to select them for defeat.
3. Press **Enter** or double-click to confirm.
4. Press **Escape** or right-click to cancel.

Eligible targets are NPCs and minions in active combat. Heroes and retainer actors are excluded.

## Squad Breakpoint Logic

For minion squads, Death Tracker calculates the minimum number of minions that must die to break the squad's current stamina tier. The required minions are **locked** (auto-selected and shown in orange). You can select additional minions beyond the locked ones if you want to kill more.

**Three-way eligibility logic:**

| Situation | Behavior |
|---|---|
| Exact stamina match | One minion is auto-killed instantly (the "One Must Die" case) |
| Most-damaged minions clearly identified | Locked minions are the most-damaged; you pick any extras |
| Ambiguous | Locked minions are fixed; you choose which additional targets to include |

## After Defeat

Each killed token goes through the normal death process: defeated condition, skull tile, Stamina bar hidden, and a chat message. A **"Power Word: Kill"** notification appears on screen. The kill is undoable via the chat message button.

## Settings

There are no dedicated settings for Power Word: Kill.

## Notes

- Power Word: Kill is intended for the Director only. It is not exposed to players.
- Running Power Word: Kill while the kill lock is active (e.g., during an ongoing death animation) will queue the command and execute it when the lock clears.
