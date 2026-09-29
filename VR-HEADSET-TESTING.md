# VR headset validation

Use an HTTPS deployment and test on at least one standalone headset (Meta Quest or Pico) plus one desktop WebXR headset when available.

## Entry and lifecycle

- Open /vr-showroom, enter VR, remove and restore the headset, then exit with the in-world EXIT VR button.
- Confirm an OS-triggered session exit restores the desktop controls and Enter VR button.
- Confirm a failed or denied session shows a readable recovery message.

## Controllers and comfort

- Left thumbstick moves at a comfortable speed and stops at room boundaries.
- Right thumbstick turns exactly 30 degrees once per deflection.
- Aim at the floor and press trigger to teleport; verify the destination remains inside the room.
- Ray-select and squeeze-grab each furniture item. Confirm haptics on supported controllers.

## Furniture editing

- Drag each item against every wall and every other item.
- Confirm invalid positions show a red marker and never overlap.
- Test rotate left/right, reset item, reset room, persistence after reload, and controls from the in-headset panel.

## Performance

- Test for ten minutes while moving and rearranging furniture.
- Target a stable headset refresh rate without repeated quality oscillation, overheating warnings, or visible frame drops.
- Verify models and fonts finish loading on a cold cache and that offline/failed assets show the recovery UI.
