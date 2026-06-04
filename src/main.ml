open! Core
open! Bonsai_web.Cont
open Bonsai.Let_syntax
open Vdom

module Section = struct
  type t =
    | Work
    | Writings
  [@@deriving sexp, equal, enumerate]

  let label = function
    | Work -> "work"
    | Writings -> "writing"
  ;;
end

let links =
  [ "github", "https://github.com/joeyjooste"
  ; "linkedin", "https://linkedin.com/in/joeyjooste"
  ; "email", "mailto:hello@joeyjooste.com"
  ]
;;

let work =
  [ ( "2026"
    , "Software Engineer"
    , "Life Scientific"
    , "https://www.lifescientific.com/en"
    , "Optimising revenue per headcount" )
  ; "2025", "Engineer", "Fused", "https://www.fused.io", "AI agents"
  ; "2024", "Co-founder", "CodeYard", "https://codeyard.co.uk", "RAG before it was cool"
  ; "2023", "Freelance", "Independent", "#", "Golang APIs, web systems"
  ]
;;

let writing = "coming soon"

let a ?(attrs = []) ~href children =
  (* Only true external (http) links open in a new tab; mailto/anchor links
     should navigate in place. *)
  let external_links =
    if String.is_prefix href ~prefix:"http"
    then [ Attr.create "target" "_blank"; Attr.create "rel" "noopener noreferrer" ]
    else []
  in
  Node.a ~attrs:(Attr.href href :: (external_links @ attrs)) children
;;

let shell attrs children = Node.div ~attrs children
let txt = Node.text
let tag ?(attrs = []) name children = Node.create name ~attrs children

let header =
  Node.header
    ~attrs:[ Style.site_header ]
    [ Node.div ~attrs:[ Style.mark ] [ txt "JJ" ]
    ; tag
        "nav"
        ~attrs:[ Style.nav_links; Attr.create "aria-label" "External links" ]
        (List.map links ~f:(fun (label, href) ->
           a ~href ~attrs:[ Style.nav_link ] [ txt label ]))
    ]
;;

let hero =
  shell
    [ Style.hero ]
    [ shell [ Style.kicker ] [ txt "dublin, ie" ]
    ; Node.h1
        ~attrs:[ Style.hero_title ]
        [ Node.span [ txt "Joey" ]; Node.span [ txt "Jooste" ] ]
    ; Node.p
        ~attrs:[ Style.hero_copy ]
        [ txt
            "software engineer building fast things in typescript and ocaml, stretching \
             what's possible with AI agents."
        ]
    ]
;;

let work_view =
  shell
    [ Style.panel
    ; Style.work_panel
    ; Attr.create "role" "tabpanel"
    ; Attr.create "id" "section-panel"
    ; Attr.create "aria-labelledby" "tab-work"
    ; Attr.create "tabindex" "0"
    ]
    (List.map work ~f:(fun (year, role, place, href, note) ->
       shell
         [ Style.work_row ]
         [ Node.span ~attrs:[ Style.year ] [ txt year ]
         ; Node.strong [ txt role ]
         ; (if String.is_prefix href ~prefix:"http"
            then a ~href ~attrs:[ Style.place ] [ txt ("@" ^ place) ]
            else Node.span ~attrs:[ Style.place ] [ txt ("@" ^ place) ])
         ; Node.span ~attrs:[ Style.rule ] []
         ; Node.span ~attrs:[ Style.note ] [ txt note ]
         ]))
;;

let writings_view =
  shell
    [ Style.panel
    ; Style.writing_panel
    ; Attr.create "role" "tabpanel"
    ; Attr.create "id" "section-panel"
    ; Attr.create "aria-labelledby" "tab-writing"
    ; Attr.create "tabindex" "0"
    ]
    [ Node.p ~attrs:[ Style.writing_note ] [ txt writing ] ]
;;

let section_view = function
  | Section.Work -> work_view
  | Writings -> writings_view
;;

let footer =
  Node.footer
    ~attrs:[ Style.site_footer ]
    [ shell
        [ Style.signal ]
        [ Node.span ~attrs:[ Style.signal_dot; Attr.create "aria-hidden" "true" ] []
        ; a
            ~href:"https://pagespeed.web.dev/analysis?url=https://joeyjooste.com"
            ~attrs:[ Style.quiet_link ]
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
        [ Style.tab
        ; (if selected then Style.selected else Attr.empty)
        ; Attr.create "type" "button"
        ; Attr.create "role" "tab"
        ; Attr.create "id" ("tab-" ^ Section.label tab)
        ; Attr.create "aria-selected" (Bool.to_string selected)
        ; Attr.create "aria-controls" "section-panel"
        ; Attr.on_click (fun _ -> set_section tab)
        ]
      [ txt (Section.label tab) ]
  in
  shell
    [ Style.app_shell ]
    [ header
    ; tag
        "main"
        ~attrs:[ Style.content ]
        [ hero
        ; shell
            [ Style.tabs
            ; Attr.create "role" "tablist"
            ; Attr.create "aria-label" "Sections"
            ]
            (List.map Section.all ~f:tab_button)
        ; section_view section
        ]
    ; footer
    ; Node.div ~attrs:[ Style.monogram; Attr.create "aria-hidden" "true" ] [ txt "JJ" ]
    ]
;;

let () = Bonsai_web.Start.start component
