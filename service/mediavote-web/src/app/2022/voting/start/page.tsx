import { getCurrentYear } from '@app/lib/apis';
import { DepartmentName, Stage } from '@app/lib/models';
import { getYearInfo } from '@app/lib/stage';
import { Head1, HyperLink, Text, SmallText, multiLine } from '@app/shared/article';
import Title from '@app/shared/Title';
import { redirect } from 'next/navigation';
import VoterForm from './VoterForm';

export default async function Page() {
  // TODO: check current year === year in url
  const year = await getCurrentYear();
  const yearInfo = await getYearInfo(year);
  if (yearInfo.stage !== Stage.Voting || yearInfo.voter) {
    redirect(yearInfo.redirectTo);
  }
  return (
    <div>
      <Title year="2022" to="/"></Title>
      <div className="mt-8 mb-8 flex flex-col gap-y-4">
        <div>
          <Head1>作品投票</Head1>
          <SmallText>{yearInfo.votingRange}</SmallText>
        </div>
        <Text>
          投票采用
          <HyperLink text="Schulze" href="https://en.wikipedia.org/wiki/Schulze_method" />
          {multiLine(
            '投票制，对范围中的作品写上排名。',
            '排序可以相等、不连续或者空缺，最终的票选结果中，两部作品的排名只与投票中两部作品的相对位置相关。',
            '投票的范围是在提名阶段被提名的所有作品，如果你发现你想投票的作品不在排名之中，请联系工作人员。',
          )}
        </Text>
      </div>
      <VoterForm next={`/${yearInfo.year}/voting/${DepartmentName.Anime}`} />
    </div>
  );
}

export const dynamic = 'force-dynamic';
