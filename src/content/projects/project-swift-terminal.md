---
type: concept
description: "SSH client for iPhone with a real PTY and tmux by default, so losing signal does not kill the session. Keys generated on device, held in the Keychain behind Face ID."
title: "SuperDuper Terminal — SSH from a phone that survives the signal"
created: 2026-08-14
tags: [project, ios, swift, ssh, tmux, devtools, terminal]
project_type: app
course_module: 7
course_order: 14
publish: true
publish_as: project
source_url: "https://apps.apple.com/app/apple-store/id6758515520"
index_line: "SuperDuper Terminal: iPhone SSH client with a real PTY and tmux by default. Keys generated on device, behind Face ID"
index_section: "project"
---

# SuperDuper Terminal

Nobody develops from a phone. What people actually do is check on a long-running job,
restart a service, or answer a prompt from an agent that is still waiting.

[SuperDuper Terminal](https://apps.apple.com/app/apple-store/id6758515520) is built for
that shape of use. A full SSH terminal with a real PTY — colours, cursor keys, everything a
shell expects — and **tmux sessions by default**, which is the decision the rest follows
from. Close the app, walk into a tunnel, lose the signal: reconnect and you are exactly
where you left off. On a phone the connection is not an edge case, it is the normal
condition.

Multiple servers and live sessions from a tab strip. A keyboard row with the keys iOS hides
from a command line: Esc, Ctrl, Tab, arrows, pipe, slash. Port forwarding when a remote port
needs to be local.

## Keys never leave the phone

Ed25519, ECDSA and RSA keys are generated on the device and stored in the Keychain behind
Face ID. Nothing is uploaded, so there is no server that could be asked for them.

Free.
