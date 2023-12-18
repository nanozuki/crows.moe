<script lang="ts">
  import { getStage, type Ceremony } from '$lib/domain/entity';
  import { Stage } from '$lib/domain/value';
  import type { Work } from '@service/value';

  export let ceremony: Ceremony;
  export let winners: Work[];
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

  $: isAwardStage = getStage(ceremony, now) === Stage.Award;
  $: texts = isAwardStage ? winners.map((w) => w.name) : [stageText(getStage(ceremony, now))];
  $: count = texts.length;
</script>

<a
  href={`/${ceremony.year}/awards`}
  class="rounded flex flex-row items-end h-20"
  class:bg-iris={isAwardStage}
  class:bg-pine={!isAwardStage}
>
  <div class="text-clip whitespace-nowrap winner-text font-serif text-highlight-high font-bold flex-1 overflow-hidden">
    {#if isAwardStage}
      {#each winners || [] as winner (winner.name)}
        <p class="winner-text" style="--count:{count}">{winner.name}</p>
      {/each}
    {:else}
      <p class="stage-text">{texts[0]}</p>
    {/if}
  </div>
  <p class="whitespace-nowrap text-3xl leading-[5rem] font-serif font-black text-gold pl-2 pr-4">{ceremony.year}年</p>
</a>

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
