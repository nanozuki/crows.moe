<script lang="ts">
  import { isCeremonyActive } from '$lib/domain/entity';
  import type { HomePageData } from './+page.server';

  export let data: HomePageData;
  $: thisYear = isCeremonyActive(data.ceremonies[0], data.now) ? data.ceremonies[0] : null;
  $: formerYears = thisYear ? data.ceremonies.slice(1) : data.ceremonies;
</script>

{#if thisYear}
  <div>
    <p>进行中</p>
    <p>{thisYear.year} 年</p>
  </div>
{/if}

<div class="flex flex-col gap-y-4">
  <p class="text-2xl font-serif font-bold leading-normal">往年获奖作品</p>
  <div class="flex gap-x-4">
    {#each formerYears as ceremony (ceremony.year)}
      <div class="flex-1 w-0 bg-iris rounded flex flex-row items-center h-20">
        <div
          class="text-clip whitespace-nowrap winner-text font-serif text-highlight-high font-bold flex-1 overflow-hidden"
          style="--count:{data.winners.get(ceremony.year)?.length}"
        >
          {#each data.winners.get(ceremony.year) || [] as winner (winner.name)}
            <p>{winner.name}</p>
          {/each}
        </div>
        <p class="whitespace-nowrap text-3xl font-serif font-black text-gold pl-2 pr-4">{ceremony.year}年</p>
      </div>
    {/each}
  </div>
</div>

<style>
  .winner-text {
    font-size: calc(5rem / var(--count));
    line-height: 1;
  }
</style>
