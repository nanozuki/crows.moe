<script lang="ts">
  import ChevronLeft from '~icons/material-symbols/chevron-left';
  import ChevronRight from '~icons/material-symbols/chevron-right';
  import type { ActionData, PageData } from './$types';
  import { Button, Nomination, TabLine } from '$lib/comp';
  import { dataString, type Work } from '$lib/domain/entity';
  import { departmentInfo } from '$lib/assets';

  export let data: PageData;
  export let form: ActionData;
  let inputed = false;

  const inputValue = (work: Work) => {
    if (form?.rankings.has(work.id)) {
      console.log('form.get: ', form?.rankings.get(work.id));
      return form?.rankings.get(work.id);
    } else {
      console.log('work.ranking: ', work.ranking);
      return work.ranking;
    }
  };

  $: deptTotal = data.ceremony.departments.length;
  $: deptIndex = data.ceremony.departments.indexOf(data.department);
  $: deptInfo = departmentInfo(data.ceremony.year)[data.department];
  $: next = deptIndex < deptTotal - 1 ? data.ceremony.departments[deptIndex + 1] : null;
  $: prev = deptIndex > 0 ? data.ceremony.departments[deptIndex - 1] : null;
</script>

<!-- Title --->

<div>
  <a
    href={`/${data.ceremony.year}/nominations/${data.ceremony.departments[0]}`}
    class="text-2xl font-serif font-bold leading-normal"
  >
    {data.ceremony.year}年度<span class="mx-1.5">·</span>投票
  </a>
  <p class="text-xs text-muted leading-normal">
    {dataString(data.ceremony.nominationStartAt)} - {dataString(data.ceremony.votingStartAt)}
  </p>
  <p class="text-subtle leading-normal">
    投票采用<a
      class="text-pine underline mx-1"
      target="_blank"
      rel="noopener noreferrer"
      href="https://en.wikipedia.org/wiki/Schulze_method">Schulze</a
    >投票制，对范围中的作品写上排名。排序可以相等、不连续或者空缺，最终的票选结果中，两部作品的排名只与投票中两部作品的相对位置相关。投票的范围是在提名阶段被提名的所有作品，如果你发现你想投票的作品不在排名之中，请联系工作人员。
  </p>
</div>

<!-- Department Introduction --->

<TabLine total={deptTotal} current={deptIndex} />

<div class="flex flex-col gap-y-2">
  <p class="text-xl font-serif font-bold leading-normal">{deptIndex + 1}/{deptTotal}：{deptInfo.title}部门</p>
  <p class="text-subtle leading-normal">{deptInfo.introduction}</p>
</div>

<!-- Voting Form --->

<form method="POST" class="w-full flex flex-col gap-y-4">
  <p class="text-text font-serif leading-normal">请在左侧写入作品的排名数字</p>
  {#if form?.error} <p class="text-rose leading-normal">{form?.error}</p> {/if}
  {#each data.works as work (work.id)}
    {#if form?.errors.get(work.id)}<p class="text-rose leading-normal">{form?.errors.get(work.id)}</p>{/if}
    <div class="w-full grid grid-cols-ballot gap-x-2 gap-y-4">
      <input
        type="number"
        name={work.id.toString()}
        value={inputValue(work)}
        min="1"
        class="[appearance:textfield] h-8 w-8 text-center leading-7 bg-surface rounded border-2 border-pine self-center focus:border-rose focus-visible:border-rose outline-none shadow-none"
        on:input={() => (inputed = true)}
      />
      <Nomination {work} />
    </div>
  {/each}
  {#if inputed}
    <Button type="submit">提交</Button>
  {/if}
</form>

<!-- Navigation --->

{#if !inputed}
  <div class="flex flex-col gap-y-4">
    <div class="flex gap-x-2">
      {#if prev}
        <a
          href={`/${data.ceremony.year}/votes/${prev}`}
          class="flex gap-y-2 justify-start pl-1 items-center text-pine bg-highlight-med flex-1 rounded"
        >
          <ChevronLeft class="block text-2xl text-rose" />
          <p class="text-text leading-10">上一步</p>
        </a>
      {/if}
      {#if next}
        <a
          href={`/${data.ceremony.year}/votes/${next}`}
          class="flex gap-y-2 justify-end pr-1 items-center text-pine bg-highlight-med flex-1 rounded"
        >
          <p class="text-text leading-10">下一步</p>
          <ChevronRight class="block text-2xl text-rose" />
        </a>
      {:else}
        <a
          href={`/${data.ceremony.year}/votes/thanks`}
          class="flex gap-y-2 justify-end pr-1 items-center text-pine bg-highlight-med flex-1 rounded"
        >
          <p class="text-text leading-10">完成</p>
          <ChevronRight class="block text-2xl text-rose" />
        </a>
      {/if}
    </div>
    <TabLine total={deptTotal} current={deptIndex} />
  </div>
{/if}
