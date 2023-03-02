import { notFound } from 'next/navigation';
import TabLine from '@app/shared/TabLine';
import Title from '@app/shared/Title';
import ToNextButton from '@app/shared/ToNextButton';
import ToPrevButton from '@app/shared/ToPrevButton';

interface DepartmentInfo {
  name: string;
  intro: string;
}

const departments: DepartmentInfo[] = [
  {
    name: 'TV动画',
    intro:
      '2022年内在电视台或者流媒体平台以剧集形式播出过的动画作品。跨年份的作品以2021年份内的部分来判断。',
  },
  { name: '其他动画', intro: '' },
  { name: '漫画', intro: '' },
  { name: '电子游戏', intro: '' },
  { name: '小说', intro: '' },
];

interface NominationPageProps {
  params: { department: string };
}

export default function Page({ params }: NominationPageProps) {
  const { department } = params;
  const order = parseInt(department);
  if (isNaN(order) || order < 1 || order > 5) {
    notFound();
  }
  const info = departments[order - 1];
  return (
    <div>
      <Title year="2022" to="/"></Title>
      <div className="mt-8 mb-8">
        <p className="font-serif font-bold text-2xl mt-1 mb-1">作品提名</p>
        <p className="text-xs text-muted mt-1 mb-1">2023.3.1-2021.3.10</p>
        <p className="text-subtle mt-1 mb-1">
          提名所有观赏或体验过的、满足范围限定的作品。在提名阶段被提名的作品，将在投票阶段进行最终的投票和排序。
          提名阶段，可以随时打开这个页面检查和提交。
        </p>
      </div>
      <TabLine page={order} />
      <div className="mt-8 mb-8">
        <p className="font-serif font-bold text-2xl mt-1 mb-1">
          {order}/5: {info.name}部门
        </p>
        <p className="text-subtle mt-1 mb-1"></p>
      </div>
      <div className="flex flex-row">
        {order > 1 && (
          <ToPrevButton to={`/2022/nomination/${order - 1}`} className="mr-2" />
        )}
        {(order < 5 && (
          <ToNextButton
            to={`/2022/nomination/${order + 1}`}
            label={`Next: ${departments[order].name}部门`}
          />
        )) || (
          <div className="flex flex-row items-center bg-highlight-med h-10 pl-8 pr-8 rounded">
            <p>完成</p>
          </div>
        )}
      </div>
      <TabLine page={order} />
    </div>
  );
}

export async function generateStaticParams() {
  return [
    { department: '1' },
    { department: '2' },
    { department: '3' },
    { department: '4' },
    { department: '5' },
  ];
}
