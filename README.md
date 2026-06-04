# personal-site-v2

Personal site rewritten as a Bonsai/js_of_ocaml app.

## Build

Use a dedicated switch for the Jane Street Bonsai stack:

```sh
opam switch create personal-site-bonsai ocaml-base-compiler.5.1.1
eval $(opam env --switch=personal-site-bonsai)
opam install . --deps-only
bun run build
```

## Development

```sh
bun run build
bun run dev
```

The app source is `src/main.ml`; styling is plain CSS in `public/styles.css`.

## OxCaml

OxCaml is opam/dune compatible, and Jane Street publishes OxCaml-oriented
package sets. Public Bonsai currently resolves through the regular `bonsai`
opam package, so this repo keeps the app standard OCaml-compatible first. Try
OxCaml in a dedicated switch instead of changing the global switch in place.
