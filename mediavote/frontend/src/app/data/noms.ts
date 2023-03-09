export interface Nom {
  name: string;
  alias: string[];
}

const nominations: Record<number, Nom[]> = {
  1: [
    { name: '孤独摇滚', alias: [] },
    { name: '派对咖孔明', alias: ['派对浪客诸葛孔明'] },
    {
      name: '明日同学的水手服',
      alias: ['明日酱的水手服', '明日ちゃんのセーラー服'],
    },
  ],
  2: [{ name: '犬王', alias: [] }],
  3: [],
  4: [
    {
      name: '战神：诸神黄昏',
      alias: ['战神5', '北欧战神2', 'God of War: Ragnarök'],
    },
  ],
  5: [],
};

async function getNoms(dept: number): Promise<Nom[]> {
  return nominations[dept];
}

async function addNom(dept: number, nom: Nom): Promise<Nom[]> {
  nominations[dept].push(nom);
  return getNoms(dept);
}

export { getNoms, addNom };
