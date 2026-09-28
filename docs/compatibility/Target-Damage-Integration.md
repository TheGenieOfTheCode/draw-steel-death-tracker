# Target Damage Integration

Death Tracker works alongside **Draw Steel: Target Damage**, which applies an ability's damage from a card in chat. It is recommended rather than required.

## Death and Undo

When applied damage kills a target, Death Tracker processes the death as usual. Undoing that damage from the target's box also revives the token, restoring it exactly as it was rather than leaving a defeated token with its stamina back.

By default only the Director can undo a death this way. **Players Can Undo Deaths Their Owned Actors Caused** hands the undo button to players as well.

## On the Card

- A target that has died drops out of the card, so the rows left are the ones still in the fight.
- An undo button that would bring someone back says who, and hovering it shows where they fell.
- The Director gets a footer on the card to settle waiting deaths now, or to release a death picker another user is holding.

## Related Pages

- [Death Notifications](Death-Notifications)
- [Settings Reference](Settings-Reference)
