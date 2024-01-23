<script lang="ts">
  import { dataString, isCeremonyActive } from '$lib/domain/entity';
  import Entrance from './Entrance.svelte';

  export let data;
  $: thisYear = isCeremonyActive(data.ceremonies[0], data.now) ? data.ceremonies[0] : null;
  $: formerYears = thisYear ? data.ceremonies.slice(1) : data.ceremonies;
</script>

{#if thisYear}
  <!-- <div class="flex flex-col gap-4"> -->
  <p class="text-2xl font-serif font-bold leading-normal">进行中</p>
  <div class="grid grid-cols-1 wide:grid-cols-2 wide:max-w-full gap-4 items-center">
    <Entrance ceremony={thisYear} bestWorks={data.bestWorks.get(thisYear.year) || []} now={data.now} />
    <div>
      <p>开始提名：{dataString(thisYear.nominationStartAt)}</p>
      <p>开始投票：{dataString(thisYear.votingStartAt)}</p>
      <p>发表结果：{dataString(thisYear.awardStartAt)}</p>
    </div>
  </div>
  <!-- </div> -->
{/if}

<!-- <div class="flex flex-col gap-4"> -->
<p class="text-2xl font-serif font-bold leading-normal">往年获奖作品</p>
<div class="grid grid-cols-1 wide:grid-cols-2 wide:max-w-full gap-4">
  {#each formerYears as ceremony (ceremony.year)}
    <Entrance {ceremony} bestWorks={data.bestWorks.get(ceremony.year) || []} now={data.now} />
  {/each}
</div>
<!-- </div> -->
