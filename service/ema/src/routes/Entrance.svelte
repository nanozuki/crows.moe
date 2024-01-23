<script lang="ts">
  import { getStage } from '$lib/domain/entity';
  import { Stage } from '$lib/domain/value';
  import type { Ceremony, Work } from '$lib/domain/entity';

  export let ceremony: Ceremony;
  export let bestWorks: Work[];
  export let now: Date;

  function stageText(stage: Stage) {
    switch (stage) {
      case Stage.Preparation:
        return '准备中';
      case Stage.Nomination:
        return '提名中';
      case Stage.Voting:
        return '投票中';
      default:
        return '';
    }
  }

  function stageHref(stage: Stage): string | null {
    switch (stage) {
      case Stage.Nomination:
        return `/${ceremony.year}/nominations/${ceremony.departments[0]}`;
      case Stage.Voting:
        return `/${ceremony.year}/votes/${ceremony.departments[0]}`;
      case Stage.Award:
        return `/${ceremony.year}/awards`;
      default:
        return null;
    }
  }

  $: stage = getStage(ceremony, now);
  $: texts = stage === Stage.Award ? bestWorks.map((w) => w.name) : [stageText(stage)];
  $: count = texts.length;
  $: el = stage === Stage.Preparation ? 'div' : 'a';
  $: href = stageHref(stage);
</script>

<svelte:element
  this={el}
  {...{ href }}
  class="rounded flex flex-row items-end h-20"
  class:bg-iris={stage === Stage.Award}
  class:bg-pine={stage !== Stage.Award}
>
  <div class="text-clip whitespace-nowrap winner-text font-serif text-highlight-high font-bold flex-1 overflow-hidden">
    {#if stage === Stage.Award}
      {#each bestWorks || [] as winner (winner.name)}
        <p class="winner-text" style="--count:{count}">{winner.name}</p>
      {/each}
    {:else}
      <p class="stage-text">{texts[0]}</p>
    {/if}
  </div>
  <p class="whitespace-nowrap text-3xl leading-[5rem] font-serif font-black text-gold pl-2 pr-4">{ceremony.year}年</p>
</svelte:element>

<style>
  .winner-text {
    font-size: calc(5rem / var(--count));
    line-height: 1;
  }
  .stage-text {
    font-size: 3.5rem;
    line-height: 1;
  }
</style>
