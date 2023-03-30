interface TextProps {
  className?: string;
  children: React.ReactNode;
}

export function Text({ className, children }: TextProps) {
  return <p className={`text-subtle mt-1 mb-1 ${className || ''}`}>{children}</p>;
}

interface SmallTextProps {
  className?: string;
  children: React.ReactNode;
}

export function SmallText({ className, children }: SmallTextProps) {
  return (
    <p className={`text-xs text-muted mt-1 mb-1 ${className || ''}`}>{children}</p>
  );
}

interface HyperLinkProps {
  className?: string;
  text: string;
  href: string;
}

export function HyperLink({ className, text, href }: HyperLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-pine ml-1 mr-1 underline ${className || ''}`}
    >
      {text}
    </a>
  );
}

interface Head1Props {
  className?: string;
  children: React.ReactNode;
}

export function Head1({ className, children }: Head1Props) {
  return (
    <p className={`font-serif font-bold text-2xl mt-1 mb-1 ${className || ''}`}>
      {children}
    </p>
  );
}

interface Head2Props {
  className?: string;
  children: React.ReactNode;
}

export function Head2({ className, children }: Head2Props) {
  return (
    <p className={`font-serif font-bold text-2xl mt-1 mb-1 ${className || ''}`}>
      {children}
    </p>
  );
}

export function multiLine(...lines: string[]): string {
  return lines.join('');
}
