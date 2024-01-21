<script lang="ts">
  import { enhance } from '$app/forms';

  export let title: string; // TODO: use slot
  export let description: string; // TODO: use slot
  export let hasError: boolean;
</script>

<div class="bg-overlay py-8 px-6 -mx-6 mid:mx-0 flex flex-col gap-y-4">
  <div class="flex flex-col gap-y-1">
    <p class="text-xl font-serif font-bold leading-normal" class:text-love={hasError}>{title}</p>
    <p class="text-subtle" class:text-love={hasError}>
      {#if hasError}参数错误{:else}{description}{/if}
    </p>
  </div>
  <form method="POST" class="w-full wide:w-1/2" use:enhance>
    <div class="flex flex-col gap-y-1">
      <slot />
    </div>
    <button type="submit" class="block w-full h-10 mt-6 px-2 rounded bg-pine text-base">确认</button>
  </form>
</div>
