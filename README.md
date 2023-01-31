<h1 align="center">Spoke</h1>

**[Spoke Documentation](https://hubs.mozilla.com/docs/spoke-creating-projects.html)**

## Development

- `git clone https://github.com/mozilla/Spoke.git`
- `cd Spoke`
- `yarn install`
- `yarn start`

Then open https://localhost:9090.

When running against a local self-signed cert reticulum server, you'll need to `export NODE_TLS_REJECT_UNAUTHORIZED=0` for publishing to work.

## Features

:telescope: **Discover**: Explore images, videos, and 3D models from around the web, all without opening up a new tab. With media integrations from Sketchfab and Google Poly, you'll be on your way to creating a scene in no time.

:pencil2: **Create**: No external software or 3D modeling experience required - build 3D scenes using the Spoke web editor so you can have a space that's entirely custom to your needs. From a board room to outer space and beyond, your space is in your control.

:tada: **Share**: Invite people to meet in your new space by publishing your content to Hubs immediately. With just a few clicks, you'll have a world of your own to experience and share - all from your browser.

## Contributing

Info on contributing to Spoke and general Spoke development can be found in the [CONTRIBUTING.md](./CONTRIBUTING.md) doc.

Additional developer documentation can be found in the [docs](./docs/README.md) folder.

## Credits

Parts of this project are derived from the [three.js editor](https://threejs.org/editor/)
with thanks to [Mr.doob](https://github.com/mrdoob) and three.js' many contributors.

Navigation mesh generation via recast.wasm, thanks to [Recast](https://github.com/recastnavigation/recastnavigation) and but0n's [RecastCLI wrapper](https://github.com/but0n/recastCLI.js).

See the [LICENSE](LICENSE) for details.
