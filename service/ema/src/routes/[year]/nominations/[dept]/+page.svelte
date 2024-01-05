<script lang="ts">
  import { departmentInfo } from '$lib/assets';
  import { TabLine } from '$lib/comp';
  import { dataString } from '$lib/domain/entity';
  import type { NomPageData } from './+page.server';
  import ChevronLeft from '~icons/material-symbols/chevron-left';
  import ChevronRight from '~icons/material-symbols/chevron-right';

  export let data: NomPageData;

  $: deptTotal = data.ceremony.departments.length;
  $: deptIndex = data.ceremony.departments.indexOf(data.department);
  $: deptInfo = departmentInfo(data.ceremony.year)[data.department];
  $: next = deptIndex < deptTotal - 1 ? data.ceremony.departments[deptIndex + 1] : null;
  $: prev = deptIndex > 0 ? data.ceremony.departments[deptIndex - 1] : null;
</script>

<div>
  <a
    href={`/${data.ceremony.year}/nominations/${data.ceremony.departments[0]}`}
    class="text-2xl font-serif font-bold leading-normal"
  >
    {data.ceremony.year}年度<span class="mx-1.5">·</span>作品提名
  </a>
  <p class="text-xs text-muted leading-normal">
    {dataString(data.ceremony.nominationStartAt)} - {dataString(data.ceremony.votingStartAt)}
  </p>
  <p class="text-subtle leading-normal">
    提名所有观赏或体验过的、满足范围限定的作品。在提名阶段被提名的作品，将在投票阶段进行最终的投票和排序。提名阶段，可以随时打开这个页面检查和提交。
  </p>
</div>

<TabLine total={deptTotal} current={deptIndex} />

<div class="flex flex-col gap-y-2">
  <p class="text-xl font-serif font-bold leading-normal">{deptIndex + 1}/{deptTotal}：{deptInfo.title}部门</p>
  <p class="text-subtle leading-normal">{deptInfo.introduction}</p>
  <p class="text-subtle leading-normal">部分作品参考链接：</p>
  <ul class="list-disc list-inside">
    {#each deptInfo.reference as { description, url } (url)}
      <li>
        <a href={url} target="_blank" rel="noopener noreferrer" class="text-pine ml-1 mr-1 underline">
          {description}
        </a>
      </li>
    {/each}
  </ul>
</div>

<div class="flex flex-col gap-y-4">
  <div class="flex gap-x-2">
    {#if prev}
      <a
        href={`/${data.ceremony.year}/nominations/${prev}`}
        class="flex gap-y-2 justify-start pl-1 items-center text-pine bg-highlight-med flex-1 rounded"
      >
        <ChevronLeft class="block text-2xl text-rose" />
        <p class="text-text leading-10">上一步</p>
      </a>
    {/if}
    {#if next}
      <a
        href={`/${data.ceremony.year}/nominations/${next}`}
        class="flex gap-y-2 justify-end pr-1 items-center text-pine bg-highlight-med flex-1 rounded"
      >
        <p class="text-text leading-10">下一步</p>
        <ChevronRight class="block text-2xl text-rose" />
      </a>
    {/if}
  </div>
  <TabLine total={deptTotal} current={deptIndex} />
</div>
