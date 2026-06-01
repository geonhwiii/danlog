---
title: useDeferredValue를 활용한 최적화
description: React의 useDeferredValue를 사용해서 최적화하는 방법을 알아보자
date: 10 08 2025
tags:
  - React
---

React앱을 개발하다보면 초기 16.8에 나왔던 훅을 제외하고는 잘 안쓰게 됩니다. (저의 경우엔)

이번엔 `useDeferredValue`를 어떻게 사용하면 좋을지 한 번 다루어 보려고 합니다.

간단한 개념을 먼저 익히고, 예시를 살펴보도록 하겠습니다.

## 1. useDeferredValue

```ts
const deferredValue = useDeferredValue(value);
```

`useDeferredValue`는 **값의 업데이트를 지연**시켜 UI의 반응성을 향상시킵니다:

- 받은 값을 즉시 반환하지 않고 이전 값을 유지
- 백그라운드에서 새로운 값으로 리렌더링을 시도
- 새로운 업데이트가 오면 이전 렌더링을 중단하고 새로 시작

다음과 같은 상황에서 유용합니다:

1. **검색 기능**: 새로운 콘텐츠가 로드되는 동안 이전 검색 결과를 표시
2. **무거운 컴포넌트**: 차트, 긴 목록 등의 리렌더링을 지연시켜 입력 차단 방지
3. **실시간 데이터**: 빠르게 변하는 데이터를 안정적으로 표시

### 기본 사용법

```tsx
import { useState, useDeferredValue } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  // query : 연기하려는 값
  // deferredQuery : 해당 값의 지연된 버전

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <List query={deferredQuery} />
    </>
  );
}
```

**동작 과정:**

1. 사용자가 입력 → `query` 상태 업데이트
2. React가 리렌더링하면서 `deferredQuery`는 이전 값을 반환
3. 백그라운드에서 새로운 `deferredQuery` 값으로 리렌더링 시도
4. 백그라운드 렌더링이 완료되면 화면에 반영

이 목록이 정말 길거나 무거운 구성 요소가 포함되어 있으면 사용자가 입력할 때 성능 문제가 발생할 수 있습니다.

여기서 `useDeferredValue()`가 유용합니다.

## 2. 동작 원리

`useDeferredValue`는 값의 업데이트를 지연시켜 UI의 반응성을 향상시킵니다.

### 초기 렌더링

- 초기 렌더링에서는 제공된 값과 동일한 값을 반환합니다.

### 업데이트 시

- React는 먼저 이전 값으로 리렌더링을 수행합니다 (빠른 업데이트)
- 그 다음 백그라운드에서 새로운 값으로 리렌더링을 시도합니다 (지연된 업데이트)

이를 통해 UI의 반응성을 유지하면서도 무거운 연산이 필요한 부분의 업데이트를 지연시킬 수 있습니다.

## 3. 실제 사용 사례

가장 일반적인 사용 사례는 검색 기능입니다:

```tsx
import { useState, useDeferredValue, Suspense } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="검색어를 입력하세요" />
      <Suspense fallback={<div>검색 중...</div>}>
        <SearchResults query={deferredQuery} />
      </Suspense>
    </>
  );
}

function SearchResults({ query }) {
  // 검색 API 호출 또는 필터링 로직
  const results = useSearchResults(query);

  return (
    <ul>
      {results.map((result) => (
        <li key={result.id}>{result.title}</li>
      ))}
    </ul>
  );
}
```

이렇게 하면 입력 필드는 `query` 상태를 사용하고, 검색 결과는 지연된 `deferredQuery`를 사용합니다.

새로운 검색 결과가 로드되는 동안 이전 결과를 계속 표시할 수 있습니다.

`<Suspense>`의 `fallback` UI는 노출되지 않습니다.

## 4. debouncing, throttling과의 차이점

### 기존 방식

- **Debouncing**: 타이핑을 멈출 때까지(예: 1초 동안) 기다렸다가 목록을 업데이트하는 것을 의미합니다.
- **Throttling**: 가끔씩(예: 최대 1초에 한 번) 목록을 업데이트하는 것을 의미합니다.

### useDeferredValue의 차이점

공식 문서에 따르면 `useDeferredValue`는 다음과 같은 차이가 있습니다:

1. **고정 지연 없음**: debouncing/throttling과 달리 고정된 시간을 선택할 필요가 없습니다
2. **디바이스 적응**: 사용자 디바이스에 맞춰 자동으로 조정됩니다
   - 빠른 디바이스: 지연된 리렌더링이 거의 즉시 발생하여 눈에 띄지 않음
   - 느린 디바이스: 리스트가 입력에 비례하여 "지연"됨
3. **중단 가능**: 이전 리렌더링을 중단하고 최신 입력을 처리할 수 있습니다
   - debouncing/throttling은 차단적(blocking)이어서 입력을 지연시킵니다
   - `useDeferredValue`는 리렌더링 중에도 다음 키 입력을 처리하고 백그라운드에서 다시 시작합니다

---

## 5. React Query와 함께 사용한 최적화

`useDeferredValue`는 API 요청을 덜 보내거나 중복 요청을 막아주지 않습니다.

단지 UI 업데이트를 지연시킬 뿐입니다.

따라서 `debounce`와 함께 사용하거나, `React Query`의 캐싱 기능과 조합하여 사용하는 것이 더 효과적입니다.

다음은 검색 컴포넌트에서 세 가지를 조합한 예시입니다:

```tsx
import { useState, useEffect, Suspense, useDeferredValue } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

function SearchCombobox({ onSelect }) {
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. debounce로 API 요청 횟수 줄이기
  const debouncedQuery = useDebounce(searchQuery, 500);

  // 2. useDeferredValue로 UI 업데이트 지연
  const deferredQuery = useDeferredValue(debouncedQuery);

  // 3. 현재 입력값과 지연된 값이 다르면 로딩 상태
  const isStale = inputValue !== deferredQuery;

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setSearchQuery(value);
  };

  return (
    <div>
      <input placeholder="검색어를 입력하세요" value={inputValue} onChange={handleInputChange} />

      {deferredQuery.length >= 2 && (
        <ErrorBoundary fallback={<div>에러가 발생했습니다</div>}>
          <Suspense fallback={<div>검색 중...</div>}>
            <div className={isStale ? 'opacity-50' : ''}>
              <SearchResults query={deferredQuery} onSelect={onSelect} />
            </div>
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
}

function SearchResults({ query, onSelect }) {
  // React Query가 자동으로 중복 요청 제거 및 캐싱 처리
  const { data } = useSuspenseQuery({
    queryKey: ['search', query],
    queryFn: () => fetchSearchResults(query),
  });

  if (data.length === 0) {
    return <div>검색 결과가 없습니다</div>;
  }

  return (
    <ul>
      {data.map((item) => (
        <li key={item.id} onClick={() => onSelect(item)}>
          {item.name}
        </li>
      ))}
    </ul>
  );
}
```

글을 다 적고 나니 생각보다 사용법이 더 간단한 것 같습니다.

실무에서 간단한 검색 부분부터 점진적으로 적용해보는 것도 좋을 것 같습니다 :)

---

### 🔗 참고 문서 & 같이 보면 좋을 글들

1. [React 공식 문서 - useDeferredValue](https://react.dev/reference/react/useDeferredValue)

2. [Aurora Blog - Building an Async Combobox with useSuspenseQuery() and useDeferredValue()](https://aurorascharff.no/posts/building-an-async-combobox-with-usesuspensequery-and-usedeferredvalue/)

3. [Josh Comeau - Snappy UI Optimization with useDeferredValue](https://www.joshwcomeau.com/react/use-deferred-value/)
