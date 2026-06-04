(lang dune 3.11)

(name personal_site_v2)

(generate_opam_files true)

(package
 (name personal_site_v2)
 (depends
  (ocaml (>= 5.1.0))
  (dune (>= 3.11))
  bonsai
  js_of_ocaml
  js_of_ocaml-ppx
  ppx_jane
  ppx_css))
