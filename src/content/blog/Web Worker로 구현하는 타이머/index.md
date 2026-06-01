---
title: "Web Worker로 구현하는 타이머"
description: "탭 전환 시 타이머가 멈추는 문제를 Web Worker로 해결하기"
date: "09 01 2025"
tags:
  - Web Worker
---

## 발생했던 이슈

녹음 기능을 개발하던 중, 사용자가 다른 탭으로 이동했다가 돌아오면 타이머가 부정확하게 동작하는 문제가 발생했습니다.

### 기존 구현

```typescript
// 기존 Recording Store 구현 예시
const useRecordingStore = create((set, get) => ({
  durationSec: 0,
  timerId: null,

  start() {
    const id = setInterval(() => {
      get().tick();
    }, 1000);
    set({ timerId: id });
  },

  tick() {
    const { status, isPaused } = get();
    if (status === "recording" && !isPaused) {
      set((s) => ({ durationSec: s.durationSec + 1 }));
    }
  },

  stop() {
    const timerId = get().timerId;
    if (timerId) {
      clearInterval(timerId);
      set({ timerId: null });
    }
  },
}));
```

### 문제 원인

브라우저는 백그라운드 탭의 성능을 최적화하기 위해 다음과 같은 제한을 가합니다:

1. **setInterval/setTimeout Throttling**: 백그라운드 탭에서는 최대 1초에 1번만 실행
2. **Page Visibility API**: 탭이 비활성화되면 타이머가 불규칙하게 동작
3. **CPU 절약**: 브라우저가 자체적으로 백그라운드 작업을 제한

이로 인해 사용자가 다른 탭으로 이동하면 녹음 타이머가 멈추거나 부정확해지는 문제가 발생합니다.

## 해결 방법: Web Worker

Web Worker는 메인 스레드와 분리된 백그라운드 스레드에서 실행되므로, 탭 상태와 무관하게 정확한 타이머를 유지할 수 있습니다.

### 1. 설계

```
┌─────────────────┐    postMessage    ┌──────────────────┐
│   Main Thread   │ ←──────────────→  │   Timer Worker   │
│  (UI + Store)   │                   │   (Pure Timer)   │
└─────────────────┘                   └──────────────────┘
        │                                       │
        ▼                                       ▼
┌─────────────────┐                   ┌──────────────────┐
│ Recording Store │                   │ setInterval(1s)  │
│ - tick()        │                   │ Always Running   │
│ - start/pause   │                   └──────────────────┘
└─────────────────┘
```

### 2. Web Worker 구현

```typescript
// timer.worker.ts
let timerState: TimerState = {
  isRunning: false,
  isPaused: false,
  startTime: null,
  pausedTime: 0,
  elapsed: 0,
};

let intervalId: NodeJS.Timeout | null = null;

function startTimer() {
  if (intervalId) {
    clearInterval(intervalId);
  }

  intervalId = setInterval(() => {
    if (timerState.isRunning && !timerState.isPaused && timerState.startTime) {
      const now = Date.now();
      timerState.elapsed = Math.floor(
        (now - timerState.startTime - timerState.pausedTime) / 1000,
      );

      const response: TimerWorkerResponse = {
        type: "tick",
        payload: {
          elapsed: timerState.elapsed,
        },
      };

      self.postMessage(response);
    }
  }, 1000);
}

self.addEventListener("message", (event: MessageEvent<TimerWorkerMessage>) => {
  const { type } = event.data;

  switch (type) {
    case "start":
      timerState.isRunning = true;
      timerState.isPaused = false;
      timerState.startTime = Date.now();
      timerState.pausedTime = 0;
      timerState.elapsed = 0;
      startTimer();
      self.postMessage({ type: "started" });
      break;

    case "pause":
      if (timerState.isRunning && !timerState.isPaused) {
        timerState.isPaused = true;
        timerState.pausedTime +=
          Date.now() - (timerState.startTime || 0) - timerState.pausedTime;
        self.postMessage({ type: "paused" });
      }
      break;

    // ... 다른 케이스들
  }
});
```

### 4. Worker 클라이언트

```typescript
// timer-worker.client.ts
import TimerWorker from "./timer.worker?worker";
import type { TimerWorkerMessage, TimerWorkerResponse } from "./types";

export class TimerWorkerClient {
  private worker: Worker | null = null;
  private _onTick: ((elapsed: number) => void) | null = null;

  constructor() {
    this.worker = new TimerWorker();
    this.worker.addEventListener("message", this.handleMessage.bind(this));
  }

  private handleMessage = (event: MessageEvent<TimerWorkerResponse>) => {
    const { type, payload } = event.data;

    switch (type) {
      case "tick":
        if (payload && this._onTick) {
          this._onTick(payload.elapsed);
        }
        break;
    }
  };

  set onTick(callback: (elapsed: number) => void) {
    this._onTick = callback;
  }

  start(): void {
    this.postMessage({ type: "start" });
  }

  pause(): void {
    this.postMessage({ type: "pause" });
  }

  destroy(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this._onTick = null;
  }

  private postMessage(message: TimerWorkerMessage): void {
    if (this.worker) {
      this.worker.postMessage(message);
    }
  }
}
```

### 5. Store 통합

```typescript
// Recording Store 수정
import { TimerWorkerClient } from "@/shared/lib/timer-worker";

const useRecordingStore = create((set, get) => ({
  timerWorker: null,

  async start() {
    // Web Worker 타이머 시작
    const timerWorker = new TimerWorkerClient();
    timerWorker.onTick = (elapsed) => {
      set({ durationSec: elapsed });
    };
    timerWorker.start();

    set({
      status: "recording",
      timerWorker,
      // ...
    });
  },

  pause() {
    const { timerWorker } = get();
    timerWorker?.pause();
    set({ isPaused: true });
  },

  async stop() {
    const { timerWorker } = get();
    timerWorker?.stop();
    timerWorker?.destroy();

    set({
      timerWorker: null,
      status: "idle",
      // ...
    });
  },
}));
```

## Vite의 Web Worker

### `?worker` Import

```typescript
import TimerWorker from "./timer.worker?worker";
```

`?worker`는 `vite`에서 제공하는 기능으로, 실제로 빌드를 해보면 다음과 같이 변환됩니다:

### 개발 모드

```typescript
// vite dev server가 실시간으로 처리
const TimerWorker = class {
  constructor() {
    return new Worker("http://localhost:5173/src/.../timer.worker.ts");
  }
};
```

### 프로덕션 빌드

```javascript
// 빌드 결과물
function rn(e) {
  return new Worker("/assets/timer.worker-DWA0CQLo.js", { name: e?.name });
}

var TimerWorkerClient = class {
  constructor() {
    this.worker = new rn(); // ← 여기서 실제 Worker 생성
  }
};
```

### 빌드 최적화

vite는 Worker 파일을 다음과 같이 최적화합니다:

1. **별도 청크 분리**: Worker 코드가 메인 번들과 분리됨
2. **변수명 압축**: `timerState` → `e`, `startTimer` → `n`
3. **코드 압축**: 공백 제거, 불필요한 코드 제거
4. **해시 파일명**: 캐싱을 위한 고유 해시 추가
5. **소스맵**: 디버깅을 위한 원본 코드 매핑

## 🎉 결과

- ✅ 탭 전환과 무관하게 정확한 시간 측정
- ✅ 백그라운드에서 지속적 동작
- ✅ 안정적인 녹음 타이머 제공
