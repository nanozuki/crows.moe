<script lang="ts">
  import type { Ceremony } from '$lib/domain/entity';
  import type { Work } from '@service/value';

  let ceremony: Ceremony;
  let winners: Work[];
  $: count = winners.length;
</script>

<div class="flex-1 w-0 bg-iris rounded flex flex-row items-center h-20">
  <div
    class="text-clip whitespace-nowrap winner-text font-serif text-highlight-high font-bold flex-1 overflow-hidden"
    style="--count:{count}"
  >
    {#each winners || [] as winner (winner.name)}
      <p>{winner.name}</p>
    {/each}
  </div>
  <p class="whitespace-nowrap text-3xl font-serif font-black text-gold pl-2 pr-4">{ceremony.year}年</p>
</div>

<style>
  .winner-text {
    font-size: calc(5rem / var(--count));
    line-height: 1;
  }
</style>
