# Settings Reference

Every Death Tracker setting, with its default. Open them from **Settings > Module Settings > Draw Steel: Death Tracker**.

| Setting | Default | What It Does |
|---|---|---|
| Alternative Minion Defeat UI | On | Let this module work out which minions die, instead of the system asking you. |
| Auto-Assign Damaged Minion on Death | On | When a squad loses only part of its Stamina, the minions that were hit are the ones that die. Turn it off to decide those yourself; a whole squad going down is still handled for you. |
| Pick Ambiguous Deaths | On | Ask who dies when it is not clear, by picking minions on the map. Whoever dealt the damage chooses. Turn it off and the deaths are assigned for you. |
| Dim Highlight All Candidates | On | Faintly mark every minion you could pick, so the choices are easy to see. Turn it off for a cleaner map. |
| Director Controls All Death Picks | Off | The Director always chooses who dies, even when a player dealt the damage. |
| Let Director Pick Deaths | Off | Let the Director choose who dies instead of you. |
| Death Animation Duration (ms) | 2000 | How long a creature takes to fade out as it falls. Set it to 0 to skip. |
| Skip Animation on Mass Kill | On | Skip the fade when eight or more creatures fall at once, to keep things smooth. |
| Show Death Marker | Off | Mark the spot where a creature fell. The mark follows if it is moved, and goes when it is revived. |
| Death Marker Icon | icons/commodities/bones/skull-hollow-worn-blue.webp | The image used to mark where a creature fell. |
| Clear Defeated Tokens at Combat End | Off | Clear the fallen off the map when the encounter ends. |
| Clear Effects on Revive | Off | A revived creature comes back free of its conditions and effects. |
| Clean Up Orphaned Combat Tracker Entries | On | Tidy away Combat Tracker entries for creatures that are no longer there, and keep a squad’s Stamina in step as its minions die. Best left on. |
| Players Can Undo Deaths Their Owned Actors Caused | On | Players can undo a death they caused, from the chat message that reports it. Deaths dealt from a damage card are undone on the card itself. |

## Debug

| Setting | Default | What It Does |
|---|---|---|
| Manual Mode | Off | Step through every death and revival in chat, approving or undoing each stage. For testing, not for play. |

## Notes

- A few settings are per client rather than per world, meaning each player sets their own.
- Settings that need a reload say so, and prompt you when they change.

## Related Pages

- [Module API](Module-API)
- [Macro Reference](Macro-Reference)
