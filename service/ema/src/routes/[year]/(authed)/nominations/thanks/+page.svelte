<script lang="ts">
  import { dataString } from '$lib/domain/entity.js';
  import ChevronLeft from '~icons/material-symbols/chevron-left';
  export let data;

  $: home = `/${data.ceremony.year}/nominations/${data.ceremony.departments[0]}`;
</script>

<a href={home} class="text-2xl font-serif font-bold leading-normal">
  {data.ceremony.year}年度<span class="mx-1.5">·</span>作品提名
</a>
<p class="text-xl font-serif font-bold leading-normal">提名完成！</p>
<div class="flex flex-col gap-y-2">
  <p class="text-subtle leading-normal">
    提名已完成！{data.voter.name}，感谢您的参与。在投票提名期间可以随时查看和添加提名。
  </p>
  <p class="text-subtle leading-normal">
    提名截止：{dataString(data.ceremony.votingStartAt)}
  </p>
</div>

<div class="flex flex-col gap-y-4">
  <div class="flex gap-x-2">
    <a href="/" class="flex gap-y-2 justify-start pl-1 items-center text-pine bg-highlight-med flex-1 rounded">
      <ChevronLeft class="block text-2xl text-rose" />
      <p class="text-text leading-10">返回首页</p>
    </a>
  </div>
</div>
