open! Core
open! Bonsai_web.Cont
open Bonsai.Let_syntax
open Vdom

module Section = struct
  type t =
    | Work
    | Writings
    | Stack
  [@@deriving sexp, equal, enumerate]

  let label = function
    | Work -> "work"
    | Writings -> "writings"
    | Stack -> "stack"
  ;;
end

let links =
  [ "github", "https://github.com/joeyjooste"
  ; "linkedin", "https://linkedin.com/in/joeyjooste"
  ; "email", "mailto:hello@joeyjooste.com"
  ]
;;

let work =
  [ "2026", "Software Engineer", "Life Scientific", "Optimising revenue per headcount"
  ; "2025", "Engineer", "Fused", "AI agents"
  ; "2024", "Co-founder", "CodeYard", "RAG before it was cool"
  ; "2023", "Freelance", "Independent", "Golang APIs, web systems"
  ]
;;

let writings =
  [ ( "less code, less wrong."
    , "software engineer based in dublin, ireland. building fast things with typescript, \
       react & go."
    , "about.txt" )
  ; "CodeYard", "AI-powered code assistant using RAG. Co-founded in 2024.", "project"
  ; "Fused", "AI agent platform. Engineer since 2025.", "current"
  ]
;;

let stack =
  [ "typescript", "https://www.typescriptlang.org"
  ; "react", "https://react.dev"
  ; "golang", "https://go.dev"
  ; "ocaml", "https://ocaml.org"
  ; "rust", "https://www.rust-lang.org"
  ; "sqlite", "https://www.sqlite.org"
  ; "linux", "https://www.kernel.org"
  ; "helix", "https://helix-editor.com"
  ; "git", "https://git-scm.com"
  ]
;;

let a ?(attrs = []) ~href children =
  Node.a
    ~attrs:
      (Attr.href href
       :: Attr.create "target" "_blank"
       :: Attr.create "rel" "noopener noreferrer"
       :: attrs)
    children
;;

let shell attrs children = Node.div ~attrs:(List.map attrs ~f:Attr.class_) children
let txt = Node.text
let tag ?(attrs = []) name children = Node.create name ~attrs children

let header =
  shell
    [ "site-header" ]
    [ Node.div ~attrs:[ Attr.class_ "mark" ] [ txt "JJ" ]
    ; tag
        "nav"
        ~attrs:[ Attr.class_ "nav-links"; Attr.create "aria-label" "External links" ]
        (List.map links ~f:(fun (label, href) ->
           a ~href ~attrs:[ Attr.class_ "nav-link" ] [ txt label ]))
    ]
;;

let hero =
  shell
    [ "hero" ]
    [ shell
        [ "kicker" ]
        [ txt "dublin, ie"
        ; Node.span [ txt "/" ]
        ; txt "void linux"
        ; Node.span [ txt "/" ]
        ; txt "dwm"
        ]
    ; Node.h1
        ~attrs:[ Attr.class_ "hero-title" ]
        [ Node.span [ txt "Joey" ]; Node.span [ txt "Jooste" ] ]
    ; Node.p
        ~attrs:[ Attr.class_ "hero-copy" ]
        [ txt
            "software engineer. building fast things with typescript, react & go. less \
             code, less wrong."
        ]
    ]
;;

let work_view =
  shell
    [ "panel"; "work-panel" ]
    (List.map work ~f:(fun (year, role, place, note) ->
       shell
         [ "work-row" ]
         [ Node.span ~attrs:[ Attr.class_ "year" ] [ txt year ]
         ; Node.strong [ txt role ]
         ; Node.span ~attrs:[ Attr.class_ "place" ] [ txt ("@" ^ place) ]
         ; Node.span ~attrs:[ Attr.class_ "rule" ] []
         ; Node.span ~attrs:[ Attr.class_ "note" ] [ txt note ]
         ]))
;;

let writings_view =
  shell
    [ "panel"; "writing-grid" ]
    (List.map writings ~f:(fun (title, summary, kind) ->
       shell
         [ "writing-item" ]
         [ Node.span ~attrs:[ Attr.class_ "writing-kind" ] [ txt kind ]
         ; Node.h2 [ txt title ]
         ; Node.p [ txt summary ]
         ]))
;;

let stack_view =
  shell
    [ "panel"; "stack-panel" ]
    (List.map stack ~f:(fun (label, href) ->
       a ~href ~attrs:[ Attr.class_ "stack-link" ] [ txt label ]))
;;

let section_view = function
  | Section.Work -> work_view
  | Writings -> writings_view
  | Stack -> stack_view
;;

let footer =
  tag
    "footer"
    ~attrs:[ Attr.class_ "site-footer" ]
    [ shell
        [ "signal" ]
        [ Node.span ~attrs:[ Attr.class_ "signal-dot" ] []
        ; a
            ~href:"https://pagespeed.web.dev/analysis?url=https://joeyjooste.com"
            ~attrs:[ Attr.class_ "quiet-link" ]
            [ txt "page speed" ]
        ]
    ; Node.span [ txt "no cookies" ]
    ; Node.span [ txt "no tracking" ]
    ]
;;

let component graph =
  let section, set_section =
    Bonsai.state
      ~sexp_of_model:[%sexp_of: Section.t]
      ~equal:[%equal: Section.t]
      Section.Work
      graph
  in
  let%arr section = section
  and set_section = set_section in
  let tab_button tab =
    let selected = Section.equal tab section in
    Node.button
      ~attrs:
        [ Attr.classes [ "tab"; (if selected then "selected" else "") ]
        ; Attr.create "type" "button"
        ; Attr.create "aria-pressed" (Bool.to_string selected)
        ; Attr.on_click (fun _ -> set_section tab)
        ]
      [ txt (Section.label tab) ]
  in
  shell
    [ "app-shell" ]
    [ header
    ; tag
        "main"
        ~attrs:[ Attr.class_ "content" ]
        [ hero
        ; shell [ "tabs" ] (List.map Section.all ~f:tab_button)
        ; section_view section
        ]
    ; footer
    ; shell [ "monogram" ] [ txt "JJ" ]
    ]
;;

let () = Bonsai_web.Start.start component
