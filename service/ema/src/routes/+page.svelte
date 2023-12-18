<script lang="ts">
  import { isCeremonyActive } from '$lib/domain/entity';
  import type { HomePageData } from './+page.server';
  import type { RootLayoutData } from './+layout.server';
  import Entrance from './Entrance.svelte';

  const dataString = (date: Date): string => `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`;

  export let data: HomePageData & RootLayoutData;
  $: thisYear = isCeremonyActive(data.ceremonies[0], data.now) ? data.ceremonies[0] : null;
  $: formerYears = thisYear ? data.ceremonies.slice(1) : data.ceremonies;
</script>

{#if thisYear}
  <div class="flex flex-col gap-4">
    <p class="text-2xl font-serif font-bold leading-normal">进行中</p>
    <div class="grid grid-cols-1 wide:grid-cols-2 wide:max-w-full gap-4 items-center">
      <Entrance ceremony={thisYear} winners={data.winners.get(thisYear.year) || []} now={data.now} />
      <div>
        <p>开始提名：{dataString(thisYear.nominationStartAt)}</p>
        <p>开始投票：{dataString(thisYear.votingStartAt)}</p>
        <p>发表结果：{dataString(thisYear.awardStartAt)}</p>
      </div>
    </div>
  </div>
{/if}

<div class="flex flex-col gap-4">
  <p class="text-2xl font-serif font-bold leading-normal">往年获奖作品</p>
  <div class="grid grid-cols-1 wide:grid-cols-2 wide:max-w-full gap-4">
    {#each formerYears as ceremony (ceremony.year)}
      <Entrance {ceremony} winners={data.winners.get(ceremony.year) || []} now={data.now} />
    {/each}
  </div>
</div>
