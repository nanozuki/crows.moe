interface ParagraphProps {
  children: React.ReactNode;
}
const Paragraph = (props: ParagraphProps) => {
  return <p className="text-text mt-em mb-em">{props.children}</p>;
};

interface HyperLinkProps {
  href: string;
  children: React.ReactNode;
}
const HyperLink = (props: HyperLinkProps) => {
  return (
    <a className="text-foam ml-1 mr-1" href={props.href}>
      {props.children}
    </a>
  );
};

interface QuoteProps {
  children: React.ReactNode;
}
const Quote = ({ children }: QuoteProps) => {
  return <blockquote className='bg-highlight-med font-mono p-4'>{children}</blockquote>;
};

export { Paragraph, HyperLink, Quote };
