open! Core
open! Bonsai_web.Cont
open Vdom

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
    , "Optimising revenue and profit per employee" )
  ; "2025", "Engineer", "Fused", "https://www.fused.io", "AI agents"
  ; "2024", "Co-founder", "CodeYard", "https://codeyard.co.uk", "RAG systems"
  ; "2023", "Freelance", "Independent", "#", "Go APIs and web systems"
  ]
;;

let writing = "Nothing published yet."

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
    [ shell
        [ Style.identity ]
        [ Node.strong [ txt "Joey Jooste" ]
        ; Node.span [ txt "software engineer / dublin" ]
        ]
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
    [ shell
        [ Style.hero_intro ]
        [ shell [ Style.kicker ] [ txt "JOEY JOOSTE" ]
        ; Node.h1
            ~attrs:[ Style.hero_title ]
            [ Node.span [ txt "I'm a software engineer" ]; Node.span [ txt "in Dublin." ] ]
        ; Node.p
            ~attrs:[ Style.hero_copy ]
            [ txt
                "I work on product systems and AI agents, mostly in TypeScript and OCaml. \
                 I'm originally from Cape Town."
            ]
        ; shell
            [ Style.availability ]
            [ Node.span ~attrs:[ Style.signal_dot; Attr.create "aria-hidden" "true" ] []
            ; txt "AT LIFE SCIENTIFIC"
            ; a ~href:"mailto:hello@joeyjooste.com" [ txt "EMAIL ME ↗" ]
            ]
        ]
    ; tag
        "figure"
        ~attrs:[ Style.visual ]
        [ Node.img
            ~attrs:
              [ Attr.src "/art/cape-town-atlantic.jpg"
              ; Attr.alt
                  "A halftone study of Cape Town's Atlantic coastline and mountain slopes"
              ]
            ()
        ; tag
            "figcaption"
            [ Node.span [ txt "CAPE TOWN / ATLANTIC SEABOARD" ]
            ; Node.span [ txt "HOME / 33.9249° S" ]
            ]
        ]
    ]
;;

let work_view =
  shell
    [ Style.panel; Style.work_panel ]
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
    [ Style.panel; Style.writing_panel ]
    [ Node.p ~attrs:[ Style.writing_note ] [ txt writing ] ]
;;

let experience_section =
  tag
    "section"
    ~attrs:
      [ Style.archive
      ; Attr.create "id" "experience"
      ; Attr.create "aria-labelledby" "experience-title"
      ]
    [ shell
        [ Style.archive_header ]
        [ shell
            [ Style.archive_title; Attr.create "id" "experience-title" ]
            [ txt "WORK EXPERIENCE" ]
        ]
    ; work_view
    ]
;;

let rathmines =
  tag
    "figure"
    ~attrs:[ Style.visual; Style.historical ]
    [ Node.img
        ~attrs:
          [ Attr.src "/art/rathmines-1911.jpg"
          ; Attr.alt
              "A dithered archival view of the Rathmines junction with trams and pedestrians \
               in 1911"
          ]
        ()
    ; tag
        "figcaption"
        [ Node.span [ txt "DUBLIN / RATHMINES" ]
        ; a
            ~href:
              "https://commons.wikimedia.org/wiki/File:Junction,_Rathmines_(8102282250).jpg"
            [ txt "NLI / AUGUST 1911 ↗" ]
        ]
    ]
;;

let writing_section =
  tag
    "section"
    ~attrs:
      [ Style.writing_section
      ; Attr.create "id" "writing"
      ; Attr.create "aria-labelledby" "writing-title"
      ]
    [ shell
        [ Style.archive_header ]
        [ shell
            [ Style.archive_title; Attr.create "id" "writing-title" ]
            [ txt "WRITING" ]
        ]
    ; writings_view
    ]
;;

let footer =
  Node.footer
    ~attrs:[ Style.site_footer ]
    [ Node.span [ txt "© 2026 JOEY JOOSTE" ]
    ; Node.span [ txt "NO COOKIES / NO TRACKING" ]
    ; a
        ~href:"mailto:hello@joeyjooste.com"
        ~attrs:[ Style.quiet_link ]
        [ txt "EMAIL ↗" ]
    ]
;;

let component _graph =
  Bonsai.return
    (shell
       [ Style.app_shell ]
       [ header
       ; tag
           "main"
           ~attrs:[ Style.content ]
           [ hero; experience_section; rathmines; writing_section ]
       ; footer
       ])
;;

let () = Bonsai_web.Start.start component
