# siros-postgres

New generation of HW / budget tracking system.

## Components

The whole system is composed of the following components:
* [db-schema](db-schema/README.md)
* [admin-scripts](admin-scripts/README.md)
* [api-server](api-server/README.md)
* [web-server](web-server/README.md)

## Top-level `package.json`

You can work with them individually (install packages in respective directories,
run tests there, and run build procedure), or you can use top-level `package.json`
scripts here for convenience that will propagate all the commands to individual
components:
* `npm install`: install (both production and development) packages,
* `npm test`: run tests of all components (including eslint),
* `npm run set-version`: propagate version from top-level `package.json` to all components,
* `npm run build`: build all artifacts.

## Build artifacts

Build artifacts can be found in `build/` directory. All of them are bundled with
production `node_modules`, so after unpacking the artifacts they are ready.
You only need to add `.env` files for some of them, of adjust configuration JS files.
For detailed instructions please check respective README files of the components.
