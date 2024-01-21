<script lang="ts">
  import { Department } from '$lib/domain/value';
  import type { AwardLayoutData } from './+layout.server';
  import Highlight from './Highlight.svelte';

  export let data: AwardLayoutData;

  const orderedDepartments = [
    Department.TVAnime,
    Department.NonTVAnime,
    Department.Anime,
    Department.Manga,
    Department.MangaAndNovel,
    Department.Game,
    Department.Novel,
  ];
</script>

{#each orderedDepartments as dept (dept)}
  {#if data.winningsByDept.get(dept)}
    <Highlight department={dept} rankedWorks={data.winningsByDept.get(dept) || []} />
  {/if}
{/each}
