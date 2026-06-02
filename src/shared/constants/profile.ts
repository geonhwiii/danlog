// Profile / résumé content, extracted from 정건휘_이력서.pdf.

export const profile = {
  name: '정건휘',
  role: '프론트엔드 엔지니어',
  intro:
    '요구사항을 기반으로 예측 가능한 인터페이스와 확장에 유연한 구조를 설계합니다. React의 선언적 모델과 TypeScript의 정적 타입을 적극 활용하며, 읽기 쉬운 코드와 더 나은 추상화를 고민합니다. 생산성을 높이는 도구와 새로운 기술 흐름에 관심을 가지고, 배운 것을 글과 책으로 공유하며 꾸준히 성장합니다.',
  githubUrl: 'https://github.com/geonhwiii',
};

export interface Highlight {
  title: string;
  detail?: string;
}

export interface Project {
  name: string;
  summary: string;
  highlights: Highlight[];
  tech?: string[];
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  current?: boolean;
  projects: Project[];
}

export const experiences: Experience[] = [
  {
    company: '스펙터',
    role: '프론트엔드 개발자',
    period: '2023.03 — 재직 중 · 3년',
    current: true,
    projects: [
      {
        name: '평판 조회 웹 서비스',
        summary: '공정한 채용시장을 만들기 위한 레퍼런스 체크 기반 평판 조회 플랫폼',
        highlights: [
          {
            title: 'Django 기반 웹 서비스를 Next.js로 리뉴얼',
            detail: '백엔드·프론트엔드 역할을 분리해 개발 생산성과 프론트엔드 인력 채용 용이성을 높였습니다.',
          },
          {
            title: 'pnpm + Turborepo 모노레포 직접 제안·설계',
            detail:
              '서비스 간 코드 중복과 모듈 분리 문제를 해결하고, 비슷한 UI의 신규 서비스를 패키지 재사용으로 2주 만에 개발·배포했습니다.',
          },
          {
            title: 'SSR 환경에서 안정적으로 동작하는 국제화(i18n) 구현',
            detail: '다국어 라이브러리를 도입해 SSR 환경에서도 끊김 없는 국제화 기능을 구현했습니다.',
          },
          {
            title: '확장 가능한 다단계 평판 작성 Form 시스템 설계',
            detail:
              'Form Schema를 서버에서 관리하도록 설계해 배포 없이 질문을 추가·수정할 수 있게 했고, 동적 필드에 타입 안정성을 확보해 질문 수정 소요 시간을 7일 → 1일로 단축했습니다.',
          },
          {
            title: 'Multi-Zone 도입으로 기존 서비스 영향 없이 신규 서비스 독립 개발',
            detail:
              '동일 도메인을 유지한 채 앱을 독립적으로 분리해, 사용자 경험을 해치지 않고 신규 서비스를 추가 개발했습니다.',
          },
        ],
        tech: ['Next.js', 'Vite', 'React Query', 'Zustand', 'tailwindcss', 'react-hook-form', 'zod'],
      },
      {
        name: '지원자 통합 검증 서비스',
        summary: '이력서·JD·평판·면접 분석 결과를 통합해 지원자를 종합 분석하는 B2B 플랫폼',
        highlights: [
          {
            title: 'Web Worker를 활용한 정확한 브라우저 타이머 구현',
            detail:
              '백그라운드 탭 전환 시 타이머가 throttle되어 면접 녹음 시간이 부정확해지는 문제를, 타이머를 메인 스레드와 분리해 탭 상태와 무관하게 일정하게 유지되도록 개선했습니다.',
          },
          {
            title: 'URL·SearchParams·Form을 zod 스키마로 통합 관리',
            detail:
              '애플리케이션 전반의 사용자 입력을 단일 스키마로 관리하고, 잘못된 dynamic URL 접근을 스키마 검증으로 차단해 의도하지 않은 접근을 일관되게 처리했습니다.',
          },
          {
            title: 'Base UI 기반 헤드리스 디자인 시스템 구현',
            detail:
              'Base UI를 기준으로 디자이너와 네이밍 컨벤션을 협의하며, 일관성 있고 확장 가능한 디자인 시스템을 구현했습니다.',
          },
        ],
      },
      {
        name: 'AI 음성 면접 서비스',
        summary: 'STT 기반 답변을 바탕으로 꼬리질문을 생성하는 AI 음성 면접 서비스',
        highlights: [
          {
            title: '1개월 내 AI 음성 면접 서비스 단독 설계·개발·출시',
            detail:
              '기존 서비스를 모노레포로 전환하고 디자인 시스템을 재사용해 리소스를 최소화했으며, Tailwind CSS v4 기반 모노레포 디자인 시스템으로 서비스 간 UI 일관성을 확보했습니다.',
          },
          {
            title: '백엔드 의존 없이 AI 음성 면접 기능 단독 구현',
            detail:
              'Vercel AI의 Provider로 OpenAI·Gemini 등 모델을 유연하게 교체 가능한 구조를 설계하고, Stream Output 스키마를 직접 설계해 응답을 안정적으로 파싱했습니다. STT·TTS는 별도 API 없이 Server Action으로 처리해 백엔드 리소스를 절감했습니다.',
          },
        ],
      },
      {
        name: 'React Native 개발 환경 0→1 구축 및 팀 DX 개선',
        summary: '앱 개발 경험이 없는 웹 개발자들이 React Native 개발을 맡음',
        highlights: [
          {
            title: 'Expo Router 기반 File-based Routing과 NativeWind 도입',
            detail: '웹과 동일한 개발 구조로 구현해 웹 개발자가 RN 개발 시 겪는 러닝커브를 줄였습니다.',
          },
          {
            title: 'Fastlane + Bitrise CI/CD 환경 초기부터 직접 구성',
            detail:
              '빌드·배포 전 과정을 자동화하고, Fastfile Syntax Highlighter 패키지를 직접 개발·배포해 팀원들의 작성 편의성을 개선했습니다.',
          },
        ],
      },
      {
        name: '레거시 백오피스 서비스 전체 마이그레이션',
        summary: 'FE 1인 체제에서 유지보수와 추가 개발이 어려운 상황을 자발적으로 개선',
        highlights: [
          {
            title: 'AI 에이전트 기반 자동 변환 파이프라인 구축',
            detail:
              '기존 프로젝트를 분석해 마이그레이션 규칙을 정의하고, skills·subagent를 직접 설계해 전체 마이그레이션을 수행했습니다.',
          },
          {
            title: 'dev 서버 시작 시간 80% 감소, 빌드·배포 6분 → 2분 단축',
            detail:
              'API 및 디자인 시스템 문서화로 백엔드 개발자도 프론트엔드 기능을 추가할 수 있는 구조를 완성했습니다.',
          },
        ],
      },
    ],
  },
  {
    company: '아티스츠카드',
    role: '프론트엔드 개발자',
    period: '2019.11 — 2022.12 · 3년',
    projects: [
      {
        name: 'K-POP 버티컬 커머스 서비스',
        summary: '아이돌 음반·굿즈·포토카드 판매 및 유저 간 직거래를 지원하는 커머스 플랫폼',
        highlights: [
          {
            title: 'GraphQL 기반 클라이언트 아키텍처 초기부터 직접 설계',
            detail:
              'React 초기 환경을 구성하고 Apollo Client와 GraphQL Generator를 도입해, 서버 상태 분리와 클라이언트 타입 자동 생성으로 타입 안전성을 확보했습니다.',
          },
          {
            title: '재고 소진을 위한 이벤트 기획·개발로 판매율 90% 달성',
            detail:
              '럭키드로우·랜덤팩 이벤트와 Seller 서비스를 직접 기획하고, 특정 시간대 한정 판매 전략으로 판매율 90%를 달성했습니다.',
          },
        ],
        tech: ['React', 'TypeScript', 'GraphQL', 'Apollo', 'styled-components', 'Redux'],
      },
      {
        name: '온라인 콘서트 스트리밍 서비스',
        summary: '코로나로 위축된 공연 시장을 온라인으로 전환하기 위한 콘서트 스트리밍 플랫폼',
        highlights: [
          {
            title: '멀티캠 라이브 스트리밍 개발',
            detail:
              'Mux + hls.js 기반으로 세 개의 카메라를 동시 송출하고, 시청자가 다각도 시점을 직접 선택할 수 있는 멀티캠 스트리밍을 구현했습니다.',
          },
          {
            title: '카메라 감독이 직접 운영 가능한 스트리밍 어드민 개발',
            detail:
              'OBS 키 연동과 스트림 상태 제어 기능을 어드민에서 직접 처리해, 외부 담당자가 독립적으로 운영할 수 있는 구조로 운영을 효율화했습니다.',
          },
          {
            title: '실시간 채팅 서비스 개발',
            detail: '채팅·좋아요·유저 밴 기능을 포함한 실시간 채팅 서비스를 개발했습니다.',
          },
        ],
      },
    ],
  },
];

export interface Education {
  name: string;
  period: string;
  detail: string;
}

export const education: Education[] = [
  {
    name: 'Toss Frontend Accelerator 5기',
    period: '2026.01 — 2026.02 · 1개월',
    detail:
      '프론트엔드 전문가 코칭을 통해 설계 사고와 모듈화를 학습했습니다. 모듈화 원칙·리팩토링·전문가 패턴을 반복 학습하고, 페어코딩과 녹화 복기로 코딩 패턴을 개선하며 예측 가능하고 변경에 용이한 코드 작성 기준을 확립했습니다.',
  },
];
