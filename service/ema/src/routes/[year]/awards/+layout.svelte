<script lang="ts">
  import type { AwardLayoutData } from './+layout.server';

  export let data: AwardLayoutData;
</script>

<p class="text-2xl font-serif font-bold leading-normal">
  {data.ceremony.year}年度<span class="mx-1.5">·</span>获奖作品
</p>

<slot />
