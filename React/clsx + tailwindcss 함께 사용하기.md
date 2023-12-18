
`clsx`와 `tailwindcss`  + `tailwind-merge` 를 사용하여 개발을 진행중입니다.

```tsx
// @/utils/clsx/index.ts
import { clsx, type ClassValue } from 'clsx';

import { twMerge } from 'tailwind-merge';
  

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
```


실제 사용은 아래와 같이 사용합니다.

```tsx  
type Props = {
	message: Message
}

export function ChatMessage({ message: { role, content } }: Props) {
	return (
		<div className={cn([
				'flex items-center', 
				role === 'user' ? 'justify-end' : 'justify-start'
			])}>
		</div>
	)
}
```

