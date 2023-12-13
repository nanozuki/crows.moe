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

{#each formerYears as ceremony (ceremony.year)}
  <div>
    <p>往年获奖作品</p>
    <p>{ceremony.year} 年</p>
    <ul>
      {#each data.winners.get(ceremony.year) || [] as winner (winner)}
        <li>(winner)</li>
      {/each}
    </ul>
  </div>
{/each}
