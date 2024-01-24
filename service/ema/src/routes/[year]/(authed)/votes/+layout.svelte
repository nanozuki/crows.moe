<script lang="ts">
  export let data;
  $: title = `Exodus 媒体艺术赏 - ${data.ceremony.year}年 - 投票`;
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<slot />
