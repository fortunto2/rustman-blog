---
type: concept
description: "Swift 6 crash pattern: a framework callback written inside a @MainActor method inherits main-actor isolation, and the runtime executor check kills the process when the framework runs it on its own queue."
title: "Swift 6 callback isolation — the crash that hides behind a symptom"
created: 2026-08-13
tags: [swift, ios, concurrency, debugging, swift6]
index_line: "Swift 6: framework callbacks inherit @MainActor isolation and SIGTRAP on the framework's own queue — pull the crash report first"
index_section: "concept"
publish: true
---

# Swift 6 callback isolation

A crash pattern that costs more than it should, because the stack trace is trivial to read
and the symptom points somewhere else entirely.

## The pattern

```swift
@MainActor
final class CaptureViewModel {
    private func save(_ image: RenderedImage) async {
        try await PHPhotoLibrary.shared().performChanges {
            PHAssetChangeRequest.creationRequestForAsset(from: image)   // ← SIGTRAP
        }
    }
}
```

`PHPhotoLibrary.performChanges` runs its block on its own internal queue. Written inline
inside a `@MainActor` method, **the block inherits main-actor isolation**, so Swift 6 emits
a runtime executor check inside it. The check fires on Photos' queue and kills the process.

```
_dispatch_assert_queue_fail
swift_task_isCurrentExecutorWithFlagsImpl
closure #1 in CaptureViewModel.save(image:)
PHPhotoLibrary _performCancellableChanges
```

## The fix

Move the call into a `nonisolated` function — ideally a separate type, so the mistake is
hard to repeat:

```swift
enum PhotoLibraryWriter {
    static func write(_ rendered: RenderedImage) async throws {
        guard let image = rendered.makeUIImage() else { throw WriteError.couldNotRender }
        try await PHPhotoLibrary.shared().performChanges {
            PHAssetChangeRequest.creationRequestForAsset(from: image)
        }
    }
}
```

## Where else it lurks

Any framework callback not documented to run on the main queue. Grep before adding one:
`performChanges`, `addCompletedHandler`, delegate callbacks, completion handlers. Callbacks
that *are* main-queue (`Timer.scheduledTimer`, `CMMotionManager` with `to: .main`) are fine.

## The expensive part was not the fix

The app died at the end of every capture session. "It crashes when the capture finishes"
pointed at the renderer, so two full rounds of work went into the Metal pipeline. Both found
real data races and were worth keeping — but neither was the crash. The third round pulled
the crash report and it named the culprit in one frame.

**Get the report before theorising.** Symptom-shaped reasoning is confident and wrong.

```bash
xcrun devicectl device info files --device "$UDID" --domain-type systemCrashLogs | grep -i myapp
xcrun devicectl device copy from --device "$UDID" --domain-type systemCrashLogs \
  --source "MyApp-2026-08-13-015330.ips" --destination /tmp/crash.ips
```

The `.ips` is a one-line header followed by JSON;
`d["threads"][d["faultingThread"]]["frames"]` is the stack. `EXC_BREAKPOINT` / SIGTRAP in
Swift means a runtime trap — a failed executor check, a force unwrap, or a precondition.

Related: [[agent-mistake-fix-harness]], [[project-starlapse]].
