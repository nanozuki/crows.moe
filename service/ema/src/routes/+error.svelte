<script>
  import { page } from '$app/stores';
</script>

<svelte:head>
  <title>Exodus 媒体艺术赏-{$page.error?.title}</title>
</svelte:head>

<h1 class="text-3xl font-bold font-serif leading-normal">{$page.error?.title}</h1>
<p class="text-xl text-subtle leading-normal">{$page.error?.message}</p>
{#if $page.error?.stack}<p class="text-subtle font-monospace">{$page.error?.stack}</p>{/if}
