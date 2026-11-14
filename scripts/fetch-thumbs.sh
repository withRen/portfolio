#!/bin/sh
# Copie les miniatures YouTube des films dans public/films, pour que le site ne contacte
# pas Google au chargement (RGPD). À relancer après l'ajout d'une vidéo dans src/data/content.ts.
set -e
cd "$(dirname "$0")/.."
mkdir -p public/films
for id in $(grep -oE "video\('[A-Za-z0-9_-]{11}'" src/data/content.ts | grep -oE "[A-Za-z0-9_-]{11}"); do
  [ -f "public/films/$id.jpg" ] && continue
  curl -sf -o "public/films/$id.jpg" "https://img.youtube.com/vi/$id/maxresdefault.jpg" \
    || curl -sf -o "public/films/$id.jpg" "https://img.youtube.com/vi/$id/hqdefault.jpg"
  echo "Miniature ajoutée : $id"
done
