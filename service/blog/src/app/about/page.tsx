import Link from 'next/link';

interface ContactInfoProps {
  name: string;
  link: string;
}

function ContactInfo({ name, link }: ContactInfoProps) {
  return (
    <Link href={link}>
      <div className="text-text leading-normal border-b-2 hover:text-love">
        {name}
      </div>
    </Link>
  );
}

export default function About() {
  return (
    <div>
      <h3 className="text-text font-serif font-bold my-em leading-normal text-xl">
        SNS:
      </h3>
      <div className="flex flex-row gap-x-2">
        <ContactInfo link="https://neo.gyara.moe/@nanozuki" name="Mastodon" />
        <ContactInfo link="https://twitter.com/NanozukiCrows" name="Twitter" />
        <ContactInfo link="https://github.com/nanozuki" name="Github" />
      </div>
    </div>
  );
}
