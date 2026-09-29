# AR device validation

## Local secure testing

Run:

    npm run dev:https

The generated certificate is self-signed. Desktop localhost can use it for development, but a phone may not trust it. For a phone, use a trusted HTTPS deployment or an HTTPS tunnel.

## Android

- Test current Chrome and Samsung Internet on a device with Google Play Services for AR.
- Confirm WebXR launches when supported and Scene Viewer is used as fallback.
- Deny camera permission once and confirm the recovery message is understandable.
- Scan a plain floor, place every product, drag it, rotate it, reset it, remove/restore it, and exit.
- Confirm fixed scale matches the dimensions shown on the page.

## iPhone and iPad

- Test current Safari on an AR Quick Look-capable device.
- Confirm Quick Look launches and the runtime-generated USDZ preserves materials and scale.
- Repeat with a custom optimized USDZ by setting product.ar.iosModel when one is available.
- Confirm native placement, move, rotation, reset, removal, and exit controls work.

## Product and failure coverage

- Open View in AR from every product card and every product detail page.
- Confirm each slug opens the matching model, name, dimensions, scale, and return link.
- Test slow network, offline mode, an invalid model URL, denied camera permission, and an unsupported desktop browser.
- Confirm model progress, retry, compatibility fallback, and AR status messages.

## Release requirements

- Deploy behind trusted HTTPS.
- Verify the Permissions-Policy response header allows camera and xr-spatial-tracking for self.
- Test at least one Android and one iOS device before presenting to a client.
