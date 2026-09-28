# Draw Steel: Death Tracker

[![Downloads](https://img.shields.io/github/downloads/TheGenieOfTheCode/draw-steel-death-tracker/total?label=Downloads&color=4aa94a)](https://github.com/TheGenieOfTheCode/draw-steel-death-tracker/releases)
[![Latest Version](https://img.shields.io/github/downloads/TheGenieOfTheCode/draw-steel-death-tracker/latest/total?label=Latest%20Version&color=4aa94a)](https://github.com/TheGenieOfTheCode/draw-steel-death-tracker/releases/latest)

*The Reaper's digital assistant.*

A Foundry VTT module for the Draw Steel system that handles defeat in combat, from the moment a creature falls to the moment it gets back up.

**Requires Foundry v14 and the Draw Steel system.**

---

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/genieofthecode)

*If you like what I do, consider donating on Ko-fi. Thanks!*

---

## Documentation

Full documentation is available on the **[Wiki](https://github.com/TheGenieOfTheCode/draw-steel-death-tracker/wiki)**.

---

## Features

**[Object Destruction](https://github.com/TheGenieOfTheCode/draw-steel-death-tracker/wiki/Object-Destruction)**: A destroyed object crumbles into rubble where it stood, and can still be brought back.

**[Power Word: Kill](https://github.com/TheGenieOfTheCode/draw-steel-death-tracker/wiki/Power-Word-Kill)**: A Director's macro that fells the creatures you click. For a squad, the minions that must die to break its Stamina are picked for you, and you choose any extras.

**[Raise Dead](https://github.com/TheGenieOfTheCode/draw-steel-death-tracker/wiki/Raise-Dead)**: Bring the fallen back into the fight by clicking them on the map, or revive everyone at once. Squad Stamina and the Combat Tracker are put right for you.

**[Death Notifications](https://github.com/TheGenieOfTheCode/draw-steel-death-tracker/wiki/Death-Notifications)**: A defeated creature leaves the Combat Tracker but stays where it fell, marked with a skull if you like. Every death is announced in chat with an undo that puts the creature back exactly as it was. When a squad takes damage, the minions that were hit are the ones that die, and when it isn't clear who, whoever dealt the damage picks them on the map.

---

## Installation

Install via the Foundry module browser, or paste this manifest URL directly:

```
https://github.com/TheGenieOfTheCode/draw-steel-death-tracker/releases/latest/download/module.json
```

**Required dependencies:** [Draw Steel: CTLib](https://github.com/TheGenieOfTheCode/draw-steel-ctlib), [socketlib](https://foundryvtt.com/packages/socketlib)

Foundry offers to install both alongside Death Tracker.

---

## Compatibility

- [Draw Steel: Target Damage](https://foundryvtt.com/packages/draw-steel-target-damage): undoing damage that killed a creature brings it back, and dead targets drop out of the damage card.
- [Draw Steel: Combat Tools](https://github.com/TheGenieOfTheCode/draw-steel-combat-tools): squad captains are handed on when they fall, and deaths caused by forced movement undo cleanly.

---

## Issues & Feedback

Bug reports and feature requests go in [Issues](https://github.com/TheGenieOfTheCode/draw-steel-death-tracker/issues).
