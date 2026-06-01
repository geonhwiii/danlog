---
title: '직접 구현하며 이해하는 React Hooks 내부 동작 원리'
description: 'React의 Hooks를 직접 구현해보며 동작 원리와 성능 최적화에 대해 알아봅니다.'
date: '07 25 2025'
tags:
  - React
---

## 1. 프로젝트 개요

React의 내장 훅들을 직접 구현해보는 과정을 통해 React의 내부 동작 원리를 깊이 있게 이해할 수 있었습니다. 단순히 API를 사용하는 것을 넘어서, 왜 이런 방식으로 설계되었는지, 어떤 문제들을 해결하고자 했는지를 체감할 수 있는 프로젝트였습니다.

📌 구현한 함수 및 Hooks:

- **비교 함수**: `shallowEquals`, `deepEquals`
- **핵심 훅**: `useRef`, `useMemo`, `useCallback`
- **커스텀 훅**: `useShallowState`, `useDeepMemo`, `useAutoCallback`
- **고차 컴포넌트**: `memo`, `deepMemo`

## 2. 비교 함수

React의 성능 최적화는 **언제 리렌더링을 해야 하는가**를 정확히 판단하는 것에서 시작됩니다.

### 얕은 비교 vs 깊은 비교

```typescript
export const shallowEquals = (a: unknown, b: unknown) => {
  // 참조가 같으면 즉시 true 반환 (성능 최적화)
  if (a === b) return true;

  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;

  // 배열의 경우 각 요소를 === 로 비교
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  // 객체의 경우 각 속성값을 === 로 비교
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a as Record<string, unknown>);
    const keysB = Object.keys(b as Record<string, unknown>);
    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if ((a as any)[key] !== (b as any)[key]) return false;
    }
    return true;
  }

  return false;
};

export const deepEquals = (a: unknown, b: unknown) => {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (typeof a !== typeof b) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    // 각 요소를 재귀적으로 비교
    for (let i = 0; i < a.length; i++) {
      if (!deepEquals(a[i], b[i])) return false;
    }
    return true;
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a as Record<string, unknown>);
    const keysB = Object.keys(b as Record<string, unknown>);
    if (keysA.length !== keysB.length) return false;

    // 각 키의 값을 재귀적으로 비교
    for (const key of keysA) {
      if (!deepEquals((a as any)[key], (b as any)[key])) return false;
    }
    return true;
  }

  return false;
};
```

**얕은 비교**는 빠르지만 중첩된 구조를 제대로 감지하지 못하고, **깊은 비교**는 정확하지만 성능 비용이 높습니다.

이 트레이드오프를 이해하고 상황에 맞게 선택하는 것이 핵심입니다.

## 2. useRef: 참조 유지

```typescript
export function useRef<T>(initialValue?: T): MutableRefObject<T | undefined> {
  const [ref] = useState(() => ({ current: initialValue }));
  return ref;
}
```

`useRef`는 `useState`의 **lazy initialization**을 활용하여 렌더링 간에 동일한 객체 참조를 유지합니다.

**setter**를 사용하지 않으므로 `ref.current` 변경 시 리렌더링이 발생하지 않습니다.

## 3. 메모이제이션

### useMemo: 값의 메모이제이션

```typescript
type MemoState<T> = {
  value: T;
  deps: DependencyList;
};

export function useMemo<T>(factory: () => T, _deps: DependencyList, _equals = shallowEquals): T {
  const memoRef = useRef<MemoState<T>>();

  // 캐시된 값이 있다면,
  if (memoRef.current) {
    const { value, deps } = memoRef.current;
    // 이전 의존성과 현재 의존성 비교
    if (_equals(deps, _deps)) {
      return value; // 캐시된 값 반환
    }
  }

  // 캐시된 값이 없다면,
  const value = factory();
  // 캐시에 저장하고, value 리턴
  memoRef.current = { value, deps: _deps };
  return value;
}
```

### useCallback: 함수의 메모이제이션

```typescript
export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: DependencyList): T {
  return useMemo(() => callback, deps);
}
```

`useMemo`와 `useCallback`은 **의존성 배열(deps)**을 기반으로 메모이제이션 여부를 결정하는데, **얕은 비교(shallow comparison)** 방식을 사용합니다.

즉, 이전 렌더링 시의 deps 배열과 현재의 deps 배열을 얕게 비교해서 동일하다면 이전 값을 재사용하고, 하나라도 다르면 새로 계산합니다.

## 4. 깊은 비교를 활용한 고급 최적화

### useDeepMemo: 중첩 구조의 정교한 메모이제이션

```typescript
export function useDeepMemo<T>(factory: () => T, deps: DependencyList): T {
  return useMemo(factory, deps, deepEquals);
}
```

`useDeepMemo`는 `useMemo`에 `deepEquals`를 적용한 간단하면서도 강력한 확장입니다.

일반 `useMemo`는 참조가 바뀌면 재계산하지만, `useDeepMemo`는 내용이 실제로 변경되었을 때만 재계산합니다.

### useShallowState: 얕은 비교로 최적화된 상태

```typescript
export function useShallowState<T>(initialValue: T | (() => T)): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState(initialValue);

  const setShallowState = useCallback((newValue: T | ((prev: T) => T)) => {
    setState((prevState) => {
      const nextState = typeof newValue === 'function' ? (newValue as (prev: T) => T)(prevState) : newValue;

      // 얕은 비교 값이 같다면 이전 상태 반환
      if (shallowEquals(nextState, prevState)) {
        return prevState;
      }

      // 값이 다르다면 새로운 상태 반환
      return nextState;
    });
  }, []);

  return [state, setShallowState];
}
```

`useState`와 달리 `useShallowState`는 새로운 값이 현재 값과 얕은 수준에서 동일하면 상태 업데이트를 건너뛰어 성능을 최적화합니다.

## 5. useAutoCallback: 의존성 배열의 딜레마 해결

`useCallback`의 가장 큰 문제는 **의존성 배열 관리의 복잡성**입니다:

```typescript
// 문제: 의존성 누락 → stale closure
const handler1 = useCallback(() => {
  onEvent(count); // 항상 초기 count 참조
}, [onEvent]); // count 의존성 누락

// 문제: 과도한 의존성 → 불필요한 재생성
const handler2 = useCallback(() => {
  onEvent(count);
}, [onEvent, count]); // count 변경 시마다 새 함수 생성
```

`useAutoCallback`은 이 문제를 해결합니다:

```typescript
export const useAutoCallback = <T extends AnyFunction>(fn: T): T => {
  const fnRef = useRef<T>(fn);
  const stableFnRef = useRef<T>();

  // 항상 최신 콜백 저장
  fnRef.current = fn;

  // 첫 렌더링에서만 안정된 wrapper 생성
  if (!stableFnRef.current) {
    stableFnRef.current = ((...args: any[]) => {
      return fnRef.current?.(...args);
    }) as T;
  }

  // 안정된 콜백 반환
  return stableFnRef.current;
};
```

`useCallback`은 의존성 배열이 바뀔 때마다 새로운 함수를 생성하지만, `useAutoCallback`은 참조는 고정된 상태로 항상 최신 함수를 실행할 수 있도록 만들어진 커스텀 훅입니다.

따라서 `useCallback`은 의존성 기반의 메모이제이션에, `useAutoCallback`은 참조 안정성과 최신 로직 유지를 동시에 원할 때 적합합니다.

## 6. 컴포넌트 메모이제이션: memo vs deepMemo

### memo 구현

```typescript
export function memo<P extends object>(Component: FunctionComponent<P>, equals = shallowEquals) {
  return function MemoComponent(props: P) {
    const prevPropsRef = useRef<P>();
    const prevElementRef = useRef<ReactElement>();

    // 첫 번째 렌더링이거나 props가 변경된 경우
    if (!prevPropsRef.current || !equals(prevPropsRef.current, props)) {
      prevPropsRef.current = props;
      prevElementRef.current = createElement(Component, props);
    }

    // 이전 요소 반환
    return prevElementRef.current!;
  };
}
```

### deepMemo 구현

```typescript
export function deepMemo<P extends object>(Component: FunctionComponent<P>) {
  return function DeepMemoComponent(props: P) {
    const prevPropsRef = useRef<P>();
    const prevElementRef = useRef<ReactElement>();

    // 첫 번째 렌더링이거나 props가 변경된 경우
    if (!prevPropsRef.current || !deepEquals(prevPropsRef.current, props)) {
      prevPropsRef.current = props;
      prevElementRef.current = createElement(Component, props);
    }

    // 이전 요소 반환
    return prevElementRef.current!;
  };
}
```

일반 `memo`는 `shallowEquals`를, `deepMemo`는 `deepEquals`를 사용하여 `props` 변경을 감지합니다.

중첩된 데이터 구조에서는 `deepMemo`가 더 정확한 메모이제이션을 제공합니다.

## 7. 성능 최적화의 핵심 원칙

이 프로젝트를 통해 배운 성능 최적화의 핵심 원칙들:

### 1. 적절한 비교 방식 선택

- **얕은 비교**: 빠르지만 중첩 구조 감지 못함
- **깊은 비교**: 정확하지만 비용 높음
- **비교 비용 vs 렌더링 비용** 고려

### 2. 메모이제이션의 트레이드오프

- 모든 것을 메모이제이션할 필요 없음
- **복잡한 계산**이나 **자주 사용되는 컴포넌트**에만 적용
- 의존성 배열 관리의 복잡성 고려

### 3. 참조 안정성의 중요성

```typescript
// ❌ 매번 새로운 객체/함수 생성
<Component style={{ margin: 10 }} onClick={(id) => handleClick(id)} />;

// ✅ 참조 안정화
const style = useMemo(() => ({ margin: 10 }), []);
const handleClick = useCallback((id) => {
  /* ... */
}, []);
<Component style={style} onClick={handleClick} />;
```
