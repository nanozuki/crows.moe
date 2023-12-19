<script lang="ts">
  export let field: string;
  export let label: string;
  export let value: string = '';
  export let error: string | undefined;
</script>

<label for={field} class="text-subtle text-sm leading-normal"
  >{label}{#if error}<span class="text-love text-sm mx-1">{error}</span>{/if}</label
>
<input
  type="string"
  bind:value
  name={field}
  placeholder={label}
  class={'w-full h-10 px-2 rounded bg-surface border-pine border-2 ' +
    'focus:border-rose focus-visible:border-rose outline-none shadow-none'}
/>
