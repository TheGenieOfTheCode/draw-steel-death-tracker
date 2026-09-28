# Object Destruction

When a token for an Object actor reaches 0 stamina, Death Tracker replaces it with rubble.

## Setup

1. Create an actor with type **Object** (set in the DS actor sheet).
2. Place it on the canvas as a token.

When the object is defeated in combat, Death Tracker places a rubble tile at the same position and hides the token. The tile is cleaned up when the object actor document is deleted from the world.

> **Visual coming soon**

## Rubble Tile Behavior

- The tile is placed at the defeated token's grid position.
- Tile size matches the token's footprint.
- The rubble uses Foundry's building rubble icon.
- The original token is hidden (not deleted) so it can be revived if needed.
- With Draw Steel: Combat Tools, colliding with an object during forced movement places rubble at the collision point.

## Notes

- Object actors are excluded from death animations and the Power Word: Kill picker.
