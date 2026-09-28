# Art assets

The app's Super Auto Pets art is sourced from the public `Public.zip` archive:

<https://drive.google.com/file/d/1p4TlD45ReNHlGwGKPIX7e09gq8mMW71t/view?usp=drive_link>

Update the checked-in art with Node 22.12 or newer and a system `unzip`
command:

```sh
npm run update:art-assets
```

The updater handles Google Drive's large-file confirmation page, validates the
zip and every PNG, stages the complete result, and then swaps it into
`src/assets/art`. It synchronizes the archive-owned `Ailment`, `Background`,
`Cosmetic`, `Food`, `Mascot`, `Pets`, and `Toys` directories. Local `Brand` and
`Icons` assets are preserved. Current ailments are also copied over the legacy
`Ailments/Ailments` path without deleting retired images that remain necessary
for engine compatibility.

To inspect changes without writing them:

```sh
npm run update:art-assets -- --dry-run
```

For an already-downloaded archive:

```sh
npm run update:art-assets -- --archive /path/to/Public.zip
```
