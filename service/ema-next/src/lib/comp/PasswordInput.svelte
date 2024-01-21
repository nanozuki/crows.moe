<script lang="ts">
  import { onMount } from 'svelte';

  export let field: string;
  export let label: string;
  export let value: string = '';
  export let error: string | undefined;
  export let focusOnMount: boolean = false;

  let ref: HTMLInputElement;
  onMount(() => {
    if (focusOnMount) {
      ref.focus();
    }
  });
</script>

<label for={field} class="text-subtle text-sm leading-normal"
  >{label}{#if error}<span class="text-love text-sm mx-1">{error}</span>{/if}</label
>
<input
  type="password"
  bind:value
  bind:this={ref}
  name={field}
  placeholder={label}
  class={'w-full h-10 px-2 rounded bg-surface border-pine border-2 ' +
    'focus:border-rose focus-visible:border-rose outline-none shadow-none'}
/>
