import { getCurrentYear } from '@app/lib/apis';
import { Stage } from '@app/lib/models';
import { getYearInfo } from '@app/lib/stage';
import { Head1, Text } from '@app/shared/article';
import Title from '@app/shared/Title';
import { redirect } from 'next/navigation';

export default async function Page() {
  // TODO: check current year === year in url
  const year = await getCurrentYear();
  const yearInfo = await getYearInfo(year);
  if (yearInfo.stage !== Stage.Voting || !yearInfo.voter) {
    redirect(yearInfo.redirectTo);
  }
  return (
    <div>
      <Title year="2022" to="/"></Title>
      <div className="mt-8 mb-8 flex flex-col gap-y-4">
        <Head1>投票完成！</Head1>
        <Text>投票已完成！{yearInfo.voter}，感谢您的参与。</Text>
        <Text>
          点击或保存此链接：
          <a href="/2022/voting/anime" className="text-pine ml-1 mr-1 underline">
            https://mediavote.crows.moe/2022/voting/anime
          </a>
          。在投票期间可以随时查看和修改自己的投票。
        </Text>
      </div>
    </div>
  );
}
