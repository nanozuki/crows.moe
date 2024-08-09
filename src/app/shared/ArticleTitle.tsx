export interface ArticleMeta {
  intro: string;
  publish_date: string;
  tags: string[];
}

interface ArticleTitleProps {
  name: string;
  meta: ArticleMeta;
  className?: string;
}

export default function ArticleTitle({
  name,
  meta,
  className,
}: ArticleTitleProps) {
  return (
    <section className={`flex flex-col ${className || ''}`}>
      <div className="flex flex-row gap-x-2">
        {meta.tags.map((tag) => (
          <p className="bg-rose text-base leading-normal px-2" key={tag}>
            {tag}
          </p>
        ))}
      </div>
      <h1 className="text-text font-serif font-bold leading-normal text-3xl">
        {name.replaceAll('_', ' ')}
      </h1>
      <p className="text-subtle text-sm leading-normal">
        发表于: {meta.publish_date}
      </p>
    </section>
  );
}
