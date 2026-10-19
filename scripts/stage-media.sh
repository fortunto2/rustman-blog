#!/usr/bin/env bash
# Stage media for a /creative note under public/media/creative/<slug>/. Audio is encoded to mp3 at
# one loudness, so an ```ab block can reference /media/creative/<slug>/<name>.mp3; pictures and
# recipe files (png/jpg/webp/svg, toml, rpp, mid, txt) are copied as <name>.<ext>.
#
#   scripts/stage-media.sh <slug> <name>=<source> [<name>=<source> ...]
#   scripts/stage-media.sh kubyz-speaks dry=~/Music/demos/src/kubyz30.wav shaped=~/Music/demos/01.wav
#
# Every take lands at -16 LUFS integrated: in an A/B the louder take wins, whatever it is.
# Run it only for a note that is being published — anything in public/ is deployed.
set -euo pipefail

TARGET_LUFS=-16
slug="${1:?usage: stage-media.sh <slug> <name>=<source> ...}"
shift
[ $# -gt 0 ] || { echo "no takes given" >&2; exit 1; }

out="$(cd "$(dirname "$0")/.." && pwd)/public/media/creative/$slug"
mkdir -p "$out"

for pair in "$@"; do
  name="${pair%%=*}"
  src="${pair#*=}"
  src="${src/#\~/$HOME}"
  [ -f "$src" ] || { echo "missing: $src" >&2; exit 1; }

  # Pictures and recipe files (a spectrum plot, a TOML chain, a REAPER project) go up as they are.
  case "${src##*.}" in
    png|jpg|jpeg|webp|svg|toml|rpp|RPP|mid|txt)
      ext="${src##*.}"
      cp "$src" "$out/$name.$ext"
      echo "$name.$ext  copied  $(du -h "$out/$name.$ext" | cut -f1)"
      continue ;;
  esac

  # Measure first, then apply one static gain: loudnorm's dynamic mode would reshape the
  # dynamics we are trying to compare.
  measured=$(ffmpeg -hide_banner -nostats -i "$src" -af ebur128 -f null - 2>&1 \
    | awk '/Integrated loudness:/{f=1} f && /I:/{print $2; exit}')
  [ -n "$measured" ] || { echo "could not measure $src" >&2; exit 1; }
  gain=$(awk -v t="$TARGET_LUFS" -v m="$measured" 'BEGIN{printf "%.2f", t-m}')

  ffmpeg -hide_banner -loglevel error -y -i "$src" \
    -af "volume=${gain}dB,alimiter=limit=0.89:level=false" \
    -ac 2 -ar 44100 -b:a 192k "$out/$name.mp3"
  echo "$name.mp3  ${measured} LUFS -> ${TARGET_LUFS} (gain ${gain} dB)  $(du -h "$out/$name.mp3" | cut -f1)"
done
