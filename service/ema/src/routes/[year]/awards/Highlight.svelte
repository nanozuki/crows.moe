<script lang="ts">
  import type { Department } from '$lib/domain/value';
  import type { RankedWork } from '$lib/domain/entity';
  import { departmentTitle } from '$lib/assets';

  export let department: Department;
  export let rankedWorks: RankedWork[];

  // highlight works:
  // 1. Must contains the works those ranking are 1 and 2
  // 2. Continues to add works as much as possible, but the number of works must be less than 5
  function getHighlight(rankedWork: RankedWork[]): RankedWork[] {
    const highlight: RankedWork[] = [];
    let count = 0;
    for (const ranked of rankedWork) {
      if (ranked.ranking <= 2 || count + ranked.works.length <= 5) {
        highlight.push(ranked);
        count += ranked.works.length;
      } else {
        break;
      }
    }
    return highlight;
  }

  $: highlight = getHighlight(rankedWorks);
  $: title = departmentTitle[department];
</script>

<div class="bg-overlay py-8 px-6 -mx-6 mid:mx-0 flex flex-col gap-y-6">
  <p class="text-2xl leading-tight font-serif font-bold">{title}</p>
  <div class="flex flex-col gap-y-4">
    <div class="flex items-center justify-between">
      <p class="text-xl leading-tight">大赏</p>
      <a href={`./awards/${department}`} class="text-pine underline leading-tight">详情</a>
    </div>
    {#each highlight[0].works as work (work.id)}
      <div>
        <p class="text-3xl leading-tight font-serif font-black">{work.name}</p>
        <p lang="ja" class="font-serif leading-tight">{work.originName}</p>
      </div>
    {/each}
  </div>
  <div class="flex flex-col gap-y-4">
    <p class="leading-0">优秀奖</p>
    {#each highlight.slice(1) as merits (merits.ranking)}
      {#each merits.works as work (work.id)}
        <div>
          <p class="text-2xl leading-tight font-serif">{work.name}</p>
          <p lang="ja" class="font-serif leading-tight">{work.originName}</p>
        </div>
      {/each}
    {/each}
  </div>
</div>
