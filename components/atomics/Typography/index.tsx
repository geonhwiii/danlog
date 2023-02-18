import { HTMLAttributes } from 'react';

export type TypographyProps = HTMLAttributes<HTMLSpanElement>;

const Typography = ({ children, ...props }: TypographyProps) => {
  return <span {...props}>{children}</span>;
};

export default Typography;
