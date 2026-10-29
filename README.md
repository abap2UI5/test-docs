# abap2UI5 for decision makers

The page that presents abap2UI5 to IT management, product owners and
architecture boards: what you can build with it, who runs it, where it is the
shorter path to a UI5 app on SAP and where it is not, what your organization
keeps, where it runs, what it costs, and how to start with one real screen.

**→ https://abap2ui5.github.io/why/**

A standalone site, independent of the
[documentation](https://abap2ui5.github.io/docs/) and the
[playground](https://abap2ui5.github.io/playground/): its own repository,
build and deployment. Built with [Astro](https://astro.build) into one static
page, without a script.

## Run it

```bash
npm ci
npm run dev       # http://localhost:4321/why/
npm run check     # build + tests, what CI runs
```

Edit the text in `src/pages/index.astro`.

## License

MIT, see [LICENSE](LICENSE). Inter is under the SIL Open Font License
([public/fonts/NOTICE.md](public/fonts/NOTICE.md)).
