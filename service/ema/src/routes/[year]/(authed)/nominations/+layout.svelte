<script lang="ts">
  export let data;
  $: title = `Exodus 媒体艺术赏 - ${data.ceremony.year}年 - 提名`;
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>
