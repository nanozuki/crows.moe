<script lang="ts">
  type Variant = 'primary' | 'secondary' | 'negative' | 'disable';
  export let variant: Variant = 'primary';
  export let type: 'submit' | 'button' = 'button';
</script>

<button
  class="w-full h-10 px-8 rounded text-base"
  class:bg-pine={variant === 'primary'}
  class:bg-love={variant === 'secondary'}
  class:bg-gold={variant === 'negative'}
  class:bg-muted={variant === 'disable'}
  disabled={variant === 'disable'}
  on:click
  {type}
>
  <slot />
</button>
