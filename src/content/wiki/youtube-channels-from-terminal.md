---
type: concept
title: "YouTube channels from the terminal: upload and manage with the Data API"
description: "How to upload to and manage several YouTube channels from a script with the YouTube Data API v3: Desktop OAuth client, one token per channel, the 10,000-unit daily quota, private-by-default uploads, and the 7-day token trap."
created: 2026-11-07
tags: [youtube, cli, oauth, api, video, agents]
publish: true
learned_from: "session 2026-11-07, OAuth Testing to Production; yt_upload.py and the youtube-publish skill"
index_line: "How-to: upload/manage YouTube channels from terminal via Data API v3 (one Python script, OAuth Desktop client, --account NAME = token file per brand channel). Quota 10000 units/day, upload 1600 = 5-6 per day, reset midnight Pacific; unaudited API project uploads land private. Key trap: OAuth app in Testing = refresh token dies in 7 days; fix = Publish app after Branding"
---

# YouTube channels from the terminal

## Short version

A single Python script talking to the YouTube Data API v3 covers upload, subtitles, thumbnail, playlist, publish, privacy and stats. Auth is a Desktop OAuth client plus one token file per channel (`--account NAME`). Budget: 10,000 quota units a day, an upload costs about 1600, so 5 to 6 uploads a day. Uploads from an unaudited API project arrive **private**. Publish the OAuth app (Testing to In production) or the token dies every 7 days.

## Steps

### 1. OAuth client (browser, once)

1. Google Cloud Console, create a project (`my-project`).
2. APIs and Services, Library: enable **YouTube Data API v3** (and **YouTube Analytics API** if you want stats).
3. Google Auth Platform, Branding: fill it (see key lesson below).
4. Clients, Create client, type **Desktop app**, Download JSON.
5. Save it as `~/.config/my-yt/client_secret.json`.

The same project can also hold the Gmail client, see [[gmail-cli-several-mailboxes-gws]].

### 2. Script

My script lives in a private repo, so treat the commands below as the shape to build, not a download: every one of them is a few lines over `google-api-python-client`, and a coding agent writes the file from this page in one pass.

The script is a single PEP 723 file (dependencies `google-api-python-client`, `google-auth-oauthlib`), run with `uv run`, so there is nothing to install. Scopes: `youtube.upload`, `youtube`, `youtube.force-ssl`. The last one is needed for subtitle tracks, `youtube.upload` alone cannot add them.

### 3. Auth, one token per channel

```bash
uv run yt_upload.py auth                    # default channel -> token.json
uv run yt_upload.py --account second auth   # another channel -> token-second.json
uv run yt_upload.py channel                 # who is authorised
```

The browser asks which account to use and then **which channel**. For a brand channel, pick it in that chooser, otherwise the token belongs to your personal channel. `--account NAME` (or env `YT_ACCOUNT`) selects the token file for every later command. Check `channel` after auth.

### 4. Commands

```bash
uv run yt_upload.py upload film.mp4 --title "Title" --description-file d.md \
    --tags "a,b" --privacy private --playlist "My playlist" --thumb thumb.jpg \
    --subs-ru film.ru.srt --subs-en film.en.srt --recorded 2026-10-12
uv run yt_upload.py publish VIDEO_ID                  # private -> public
uv run yt_upload.py privacy unlisted ID1 ID2 ...      # bulk
uv run yt_upload.py captions VIDEO_ID --subs-en x.en.srt
uv run yt_upload.py describe VIDEO_ID --description-file d.md --thumb new.jpg
uv run yt_upload.py list --limit 60
uv run yt_upload.py stats --days 30
```

Large files go up in resumable chunks, so a dropped connection continues rather than restarts. `--thumb` takes a jpg or a second of the film. `--playlist` finds the playlist by name or creates it. Titles are capped at 100 characters (`invalidTitle` above that). A video id that starts with `-` needs `--` before it.

### 5. Quota

- 10,000 units a day per project, reset at **midnight Pacific time**.
- Upload 1600, subtitle track about 400, thumbnail, playlist add, describe, publish about 50 each.
- So 5 to 6 uploads a day. Plan a batch ahead and push the rest to tomorrow. Quota is per project, not per channel: two channels share it.
- Need more? Apply for a quota extension and pass the API audit. The same audit lifts the private-only rule.

### 6. Uploads land private

A video uploaded through an API project that has not passed Google's audit is locked to **private**, whatever `--privacy` says. Publish separately: `publish ID` (50 units) or flip it in Studio. For a family archive this is the wanted mode.

## Key lesson: Testing status kills the token in 7 days

Measured 7 Nov 2026: an OAuth app left in **Testing** publishing status issues refresh tokens that expire after 7 days, and the script fails with `invalid_grant` once a week. The YouTube token and the Gmail token both died this way.

Fix:

1. Google Cloud Console, Google Auth Platform, **Audience**, **Publish app** (Testing to In production).
2. The button stays **disabled** with "To publish your app, you must complete your configuration on the Branding page" until Branding has:
   - an app name **without Google trademarks** (a name with "Gmail" in it was renamed),
   - an application home page,
   - a privacy policy link,
   - that domain under **Authorised domains**.
3. **Do not upload a logo.** A logo forces Google verification.
4. After publishing, run `auth` again once. The old token is dead, the new one does not expire weekly.

Personal use stays unverified: the consent screen shows "Google hasn't verified this app" (Advanced, Go to app), user cap 100. Afterwards `invalid_grant` means a revoked grant or a changed password, not the calendar.

## Pitfalls

- Wrong channel after auth: you clicked through the chooser. Delete `token-NAME.json` and run `auth` again.
- Missing `force-ssl` scope: caption upload returns 403. Delete the token and re-auth after adding the scope.
- Quota exhausted mid-batch (`quotaExceeded`): wait for midnight Pacific (`TZ=America/Los_Angeles date`).
- Do not push a multi-GB upload over a phone hotspot; check the default route first.
- "Related video" on a Short cannot be set through the API (accepted, not saved). Studio only.

## Numbers

- Quota 10,000 units/day; upload 1,600; captions ~400; small calls 50.
- 5 to 6 uploads/day.
- Testing token: 7 days. Production: no weekly expiry.
- Unverified app: 100 users.

## Related

- [[creative-video-shipping]]: what to upload (HEVC master, 1440p, private first, then publish)
- [[creative-video-with-claude]]: the editing pipeline that ends in this upload
- [[gmail-cli-several-mailboxes-gws]]: the same OAuth project and the same 7-day trap, for mail

## Learned from

Session 2026-11-07 (OAuth Testing to Production), plus months of running `yt_upload.py` on two channels.
