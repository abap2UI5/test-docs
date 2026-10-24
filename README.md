# Evaluate abap2UI5

The page for the people who approve abap2UI5 rather than build with it — IT
management, architecture boards, product owners, SAP Basis and internal audit:
the problem it answers, when to use it and when RAP, what your organization
keeps, where it runs, what it costs, the objections a review board raises, and
how to evaluate it on one real screen in a week.

**→ https://abap2ui5.github.io/test-docs/**

A standalone site, independent of the
[documentation](https://abap2ui5.github.io/docs/) and the
[playground](https://abap2ui5.github.io/playground/): its own repository,
build and deployment. Built with [Astro](https://astro.build) into one static
page; its one script is the cost calculator's.

## Run it

```bash
npm ci
npm run dev       # http://localhost:4321/test-docs/
npm run check     # build + tests, what CI runs
```

Edit the text in `src/pages/index.astro`. The counted figures under the hero
are read at build time from the framework README and are never typed here.

## License

MIT, see [LICENSE](LICENSE). Inter is under the SIL Open Font License
([public/fonts/NOTICE.md](public/fonts/NOTICE.md)).
