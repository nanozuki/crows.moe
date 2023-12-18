<script lang="ts">
  import { Department } from '$lib/domain/value';
  import { departmentTitle } from '$lib/assets';
  import type { AwardLayoutData } from './+layout.server';

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
  {#if data.awards.get(dept)}
    <div>
      <p>{departmentTitle[dept]}</p>
      {#each data.awards.get(dept) || [] as award (award.id)}
        <p>{award.ranking}: {award.name}</p>
      {/each}
    </div>
  {/if}
{/each}
