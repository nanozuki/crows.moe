import TabLine from '@app/shared/TabLine';
import Title from '@app/shared/Title';
import ToNextButton from '@app/shared/ToNextButton';
import ToPrevButton from '@app/shared/ToPrevButton';

function Intro() {
  return (
    <div className="mt-8 mb-8">
      <p className="font-serif font-bold text-2xl mt-1 mb-1">作品提名</p>
      <p className="text-xs text-muted mt-1 mb-1">2023.3.1-2021.3.10</p>
      <p className="text-subtle mt-1 mb-1">
        提名所有观赏或体验过的、满足范围限定的作品。在提名阶段被提名的作品，将在投票阶段进行最终的投票和排序。
        提名阶段，可以随时打开这个页面检查和提交。
      </p>
    </div>
  );
}

function DepartmentIntro() {
  return (
    <div className="mt-8 mb-8">
      <p className="font-serif font-bold text-2xl mt-1 mb-1">1/5: TV动画部门</p>
      <p className="text-subtle mt-1 mb-1">
        2022年内在电视台或者流媒体平台以剧集形式播出过的动画作品。跨年份的作品以2021年份内的部分来判断。
      </p>
    </div>
  );
}

export default function Page() {
  return [
    <Title key="title" year="2022" to="/2022/nomination"></Title>,
    <Intro key="intro" />,
    <TabLine key="tabline-top" page={3} />,
    <DepartmentIntro key="dp-intro" />,
    <div key="nav-bottom" className="flex flex-row">
      <ToPrevButton to="/2022/nomination/2" className="mr-2" />
      <ToNextButton to="/2022/nomination/4" label="Next: 电子游戏部门" />
    </div>,
    <TabLine key="tabline-bottom" page={3} />,
  ];
}
