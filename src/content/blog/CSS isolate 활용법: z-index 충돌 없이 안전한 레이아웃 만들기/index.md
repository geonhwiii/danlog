---
title: 'CSS isolation 활용법: z-index 충돌 없이 안전한 레이아웃 만들기'
description: 'css isolation을 활용해서 z-index 충돌 없이 안전한 레이아웃을 예제를 통해 만들어 봅니다.'
date: '03 12 2025'
tags:
  - CSS
---

## 1. isolation

`CSS isolation` 속성은 원래는 `mix-blend-mode`가 적용된 요소들이 배경이나 부모 요소와 색상이 섞이는 것을 막기 위해 만들어졌습니다.

그런데 `isolation` 속성이 최근에 떠오른 이유는 요소를 새로운 `스태킹 컨텍스트(Stacking Context)`로 만들어서 부모 요소의 `z-index` 영향을 받지 않도록 사용할 수 있기 때문입니다.

> [CanIuse](https://caniuse.com/?search=isolation)에서 확인해보면 95.82%의 브라우저에서 지원하므로 호환성은 걱정할 필요가 없습니다.

`isolation`의 속성으로는 `auto`, `isolate`를 사용할 수 있습니다.

```css
/* 키워드 값 */
isolation: auto;
isolation: isolate;
```

사용법은 아래와 같이 간단합니다.

```css
.container {
  isolateion: isolate;
}
```

- auto (기본값): 요소에 적용한 속성 중 새로운 쌓임 맥락을 요구하는 속성이 있을 때만 쌓임 맥락을 생성합니다.

- isolate: 항상 새로운 쌓임 맥락을 생성합니다.

설명만 들으면 어떻게 적용할 지 감이 안잡히는데, 간단하게 아래 예시를 통해 확인해보겠습니다.

## 2. 사용 예제

실제 개발을 하다보면 아래와 같은 스트레스 받는 상황이 나타납니다...🫠

특정 컴포넌트의 `z-index`를 과하게 설정하여 헤더의 영역을 침범해버리는 예시입니다.

```tsx
export function App() {
  return (
    <Layout>
      <Header className="z-[100]">{'z-100'}</Header>
      <Container>
        <Card>
          <Button className="z-[120]">{'z-120'}</Button>
        </Card>
      </Container>
    </Layout>
  );
}
```

아래는 위 코드가 적용된 참혹한 사진입니다.

<img src="https://i.imgur.com/BxlvclK.png" width="1400" height="250" alt="raycast" style="display: inline-block;" />

이때 아래와 같이 `isolation`을 사용하여 `z-index` 충돌을 방지할 수 있습니다.

```tsx
export function App() {
  return (
    <Layout>
      <Header className="z-[100]">{'z-100'}</Header>
      <Container>
        {/* isolate를 사용해 쌓임 맥락을 Card컴포넌트에 적용합니다. */}
        <Card className="isolate">
          <Button className="z-[120]">{'z-120'}</Button>
        </Card>
      </Container>
    </Layout>
  );
}
```

<img src="https://i.imgur.com/AHxeMIb.png" width="1400" height="234" alt="raycast" style="display: inline-block;" />

UI 컴포넌트 개발 시, 애니메이션을 적용하다보면 `z-index`가 필요한 상황이 자주 발생하는데,

컴포넌트의 상단을 `isolate`로만 래핑해줘도 손쉽게 `z-index` 충돌을 방지할 수 있습니다.
