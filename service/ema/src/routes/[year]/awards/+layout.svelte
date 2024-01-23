<script lang="ts">
  export let data;
  $: title = `Exodus 媒体艺术赏 - ${data.ceremony.year}年 - 获奖作品`;
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<a href={`/${data.ceremony.year}/awards`} class="text-2xl font-serif font-bold leading-normal">
  {data.ceremony.year}年度<span class="mx-1.5">·</span>获奖作品
</a>

<slot />
