# Fanz smart items

This repository provides smart items that allow to integrate [Fanz events](https://app.fanz.events/) with Decentraland scenes using the [Decentraland builder](https://builder.decentraland.com/).

**Need help building your scene? reach out to us on [discord](https://discord.gg/pyxrs7ZX) or [twitter](https://twitter.com/fanzevents)**

## About the smart items

The smart items allow to check access for a event on a Decentraland scene and trigger actions based on the Player's access level.

### Fanz trigger area

This square trigger area activates when the player steps on it, and checks access for a fanz event based on the Player's ethereum address, actions and effects on the scene can be configured for different cases: access granted, access denied, VIP access granted, etc.

![FanszoidTriggerArea-SI](https://user-images.githubusercontent.com/42985576/164781996-eccc8606-78f4-462e-b299-766e8042ee4e.png)

### Single player invisible wall

This smart item is a modified version of the existing invisible wall available on the Builder. This invisible wall can be enabled/disabled by other Smart items, and the changes on the wall will only be applied for the triggering player ( e.g. disabling the invisible wall after the user has checked access for the event doesn't disable the wall for other players on the scene ).

![SiinglePlayerWall_SI](https://user-images.githubusercontent.com/42985576/164781991-0e647791-6563-4cdb-818d-aef667b8951f.png)

