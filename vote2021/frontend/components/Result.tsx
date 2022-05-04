const result: Record<string, string[][]> = {
  TV动画部门: [
    ['奇巧计程车'],
    ['漂流少年', '平稳世代的韦駄天们'],
    [
      '哥斯拉 奇异点',
      '摇曳露营△ SEASON2',
      'Arcane',
      'NOMAD MEGALOBOX 机甲拳击2',
      '86－不存在的战区－（上半）',
      '86－不存在的战区－（下半）',
    ],
  ],
  其他动画部门: [
    ['剧场版 少女☆歌剧 Revue Starlight'],
    ['新·福音战士剧场版𝄇'],
    ['少女与战车 最终章 第3话'],
    ['酷爱电影的庞波小姐', '刀剑神域剧场版 -Progressive- 无星夜的咏叹调'],
    ['渔港的肉子'],
  ],
  漫画部门: [
    ['章鱼噼的原罪'],
    ['酒和鬼都要适可而止', '一霎一花'],
    ['夺魂之恋', '【我推的孩子】', '二人逃避', '赛马娘 Cinderella Gray'],
  ],
  电子游戏部门: [
    ['密特罗德 生存恐惧'],
    [
      'Inscryption',
      '破晓传说',
      '死亡循环',
      'Valheim',
      'Hades',
      '双人成行',
      '魔物猎人 崛起',
      '帝国时代4',
      'loop hero',
    ],
  ],
  小说部门: [
    ['黑牢城'],
    ['乐园杂音3'],
    ['乐园杂音2'],
    ['前女友不幸转校归来，小暮理知的罠与恋'],
    ['青梅竹马是妹妹，景山北斗的哀与爱'],
  ],
};

interface PrizeProps {
  department: string;
  title_cn: string;
  title_orig: string;
}

const Prize = ({ department, title_cn, title_orig }: PrizeProps) => {
  return (
    <div className="mt-6 mb-6">
      <p>{department}</p>
      <p className="font-serif font-extrabold text-3xl">{title_cn}</p>
      <p className="text-subtle text-sm">{title_orig}</p>
    </div>
  );
};

const Details = () => {
  return (
    <section className="mt-16 mb-8">
      <h1 className="text-xl font-serif text-love">详情</h1>
      {Object.keys(result).map((dp) => {
        return (
          <div className="mb-4 mt-4">
            <p className="text-iris mb-2">{dp}</p>
            {result[dp].map((works, index) => {
              return (
                <div className="grid grid-cols-result gap-2">
                  <p className="font-serif">{index + 1}</p>
                  <div>
                    {works.map((work) => (
                      <p>{work}</p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </section>
  );
};

const Result = () => {
  return (
    <>
      <section className="mt-16 mb-16">
        <h1 className="text-xl font-serif font-bold text-love">大赏作品</h1>
        <Prize
          department="TV动画部门"
          title_cn="奇巧计程车"
          title_orig="ODD TAXI"
        />
        <Prize
          department="其他动画部门"
          title_cn="少女☆歌剧 Revue Starlight 剧场版"
          title_orig="劇場版 少女☆歌劇 レヴュースタァライト"
        />
        <Prize
          department="漫画部门"
          title_cn="章鱼噼的原罪"
          title_orig="タコピーの原罪"
        />
        <Prize
          department="电子游戏部门"
          title_cn="密特罗德 生存恐惧"
          title_orig="Metroid Dread"
        />
        <Prize department="小说部门" title_cn="黑牢城" title_orig="黒牢城" />
      </section>
      <Details />
    </>
  );
};

export { Result };
