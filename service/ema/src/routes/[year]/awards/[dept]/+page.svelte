<script lang="ts">
  import { departmentTitle } from '$lib/assets';
  import type { AwardDetailData } from './+page.server';

  export let data: AwardDetailData;
</script>

<p class="text-xl font-serif font-bold">{departmentTitle[data.department]}<span class="mx-1.5">·</span>详情</p>

<div class="flex flex-col gap-y-4">
  {#each data.rankedWorks as rankedWord (rankedWord.ranking)}
    <div class="bg-overlay py-8 px-6 -mx-6 mid:mx-0 flex gap-x-6 items-center">
      <p class="text-2xl font-bold">{rankedWord.ranking}</p>
      <div class="flex flex-col gap-y-4">
        {#each rankedWord.works as work (work.id)}
          <div>
            <p class="text-xl leading-tight font-serif font-semibold">{work.name}</p>
            <p lang="ja" class="font-serif leading-tight">{work.originName}</p>
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>
