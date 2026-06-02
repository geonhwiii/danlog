// Landing-page content constants, extracted from src/pages/index.astro.

// Quiet topics strip — the personal-blog answer to Cursor's logo wall.
export const topics = ['React', 'TypeScript', 'React Query', 'Architecture', 'Tooling', 'Journal'];

// Closing band — skills stacked as oversized display type that fades in from
// near-invisible at the top to solid ink at the bottom.
export const skills = ['React', 'TypeScript', 'Next.js', 'React Query', 'zod', 'tailwindcss'];

// Contact targets for the closing band.
export const contactEmail = 'gunw.dan@gmail.com';
export const linkedInUrl = 'https://www.linkedin.com/in/gunwww';

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

// Colleague testimonials — Cursor's "The new way to build software" grid.
export const testimonials: Testimonial[] = [
  {
    quote:
      '열정적으로 업무에 대해 탐구하고 의견을 제안합니다. 항상 수용적인 태도로 상대방의 의견을 받아주고, 본인의 주장도 상대방을 생각하는 태도로 잘 전달할 줄 아는 장점이 있습니다.',
    name: '찰리 브라운',
    role: '프론트엔드 개발자 · 팀 동료',
  },
  {
    quote:
      '확실한 의사 표현과 빠른 작업 속도가 강점입니다. 또 트렌드, 인사이트를 많이 찾아보고 팀에 공유도 많이 해주시는 편이라 건휘님이 관심을 갖고 있는 기술적 영역과, 적용해볼 수 있는 다양한 작업들까지 아이디어를 확장해볼 수 있어 많은 도움이 됩니다.',
    name: '마시',
    role: '앱 개발자 · 팀 동료',
  },
  {
    quote:
      '주어진 과업에 최선을 다하며, 믿고 맡길 수 있는 동료입니다. 문제를 만날때 해결 할 수 있는 여러가지 아이디어를 제시하는 점이 큰 장점입니다.',
    name: '프랭클린',
    role: 'QA 엔지니어 · 동료',
  },
  {
    quote:
      '책임감이 강해서 누구보다 업무 집중도가 뛰어납니다. 본인이 만든 작업물에 큰 애정이 있어서 지치지 않고 즐기며 일하는 모습을 보일 때가 있습니다.',
    name: '스누피',
    role: '백엔드 개발자 · 동료',
  },
  {
    quote:
      '디스코드에 생각을 공유해 주시는 걸 보면, 지속적으로 본인만의 고민을 이어나가고 그걸 해결하고자 하는 의지가 뛰어난 분이라고 생각했어요.',
    name: '바이올렛',
    role: '프론트엔드 교육 · 동료',
  },
  {
    quote:
      '배운 것들을 금방 업무에 적용해보고, 그게 좋은 방법이든 안좋은 방법이든 스스로 근거를 세워보고, 피드백 받고, 반영하고 이런 과정들이 빠르게 진행되는 모습이 좋았던 것 같아요.',
    name: '페퍼민트 패티',
    role: '프론트엔드 교육 · 동료',
  },
  {
    quote:
      '꾸준히 최선을 다해 작성하신 코드를 들고 와서 깨지고, 그러고 나서 다시 들고와서 깨지고를 반복하시는 모습이 인상적이었습니다',
    name: '슈로더',
    role: '프론트엔드 교육 · 코치',
  },
  {
    quote:
      "작업 속도도 빠르고 많은 아이디어를 가지고 있어 타 직무에서도 건휘님을 통해 많은 인사이트를 얻고 있습니다. 그리고 누구보다 우리 서비스를 '잘' 만들고자 하는 의지가 강하고, 상황을 객관적으로 판단하려는 모습이 보입니다",
    name: '라이너스 반 펠트',
    role: '프로덕트 디자이너 · 동료',
  },
  {
    quote:
      '본인의 감정 상태를 가감없이 드러내고 늘 질문을 이끌어가는 건휘님 보면서 많이 배웠습니다! 어디 가서도 좋은 리더가 되실 거에요',
    name: '샐리 브라운',
    role: '프론트엔드 교육 · 동료',
  },
];
