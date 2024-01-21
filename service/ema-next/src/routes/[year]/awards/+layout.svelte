<script lang="ts">
  import type { AwardLayoutData } from './+layout.server';

  export let data: AwardLayoutData;
</script>

<a href={`/${data.ceremony.year}/awards`} class="text-2xl font-serif font-bold leading-normal">
  {data.ceremony.year}年度<span class="mx-1.5">·</span>获奖作品
</a>

<slot />
