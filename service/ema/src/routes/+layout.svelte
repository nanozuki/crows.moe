<script lang="ts">
  import '../app.css';
  export let data;
  $: title = data.voter ? `Exodus 媒体艺术赏 - ${data.voter.name}` : 'Exodus 媒体艺术赏';
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<div class="w-full pl-6 pr-6 mid:max-w-screen-mid wide:max-w-screen-wide ml-auto mr-auto flex flex-col gap-y-8 py-8">
  <header>
    <a href="/">
      <p class="font-serif font-black">{'Exodus Media Awards'}</p>
      <p class="text-3xl font-serif font-black">Exodus 媒体艺术赏</p>
    </a>
  </header>
  <slot />
</div>
