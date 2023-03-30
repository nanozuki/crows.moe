import {
  Head1,
  Head2,
  HyperLink,
  Text,
  SmallText,
  multiLine,
} from '@app/shared/article';
import Title from '@app/shared/Title';

export default async function Page() {
  return (
    <div>
      <Title year="2022" to="/"></Title>
      <div className="mt-8 mb-8">
        <Head1>作品投票</Head1>
        <SmallText> 2023.3.22 10:00 - 2023.3.28 22:00 </SmallText>
        <Text>
          投票采用
          <HyperLink
            text="Schulze"
            href="https://en.wikipedia.org/wiki/Schulze_method"
          />
          {multiLine(
            '投票制，对范围中的作品写上排名。',
            '排序可以相等、不连续或者空缺，最终的票选结果中，两部作品的排名只与投票中两部作品的相对位置相关。',
            '投票的范围是在提名阶段被提名的所有作品，如果你发现你想投票的作品不在排名之中，请联系工作人员。'
          )}
        </Text>
      </div>
      <div className="mt-8 mb-8">
        <Head2>新投票</Head2>
      </div>
      <div className="mt-8 mb-8">
        <Head2>查看和修改投票</Head2>
      </div>
    </div>
  );
}
