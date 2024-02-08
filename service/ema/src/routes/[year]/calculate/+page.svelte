<script lang="ts">
  import type { PageData } from './$types';
  import { departmentTitle } from '$lib/assets';
  export let data: PageData;
</script>

{#each data.result as [dept, state]}
  <p>{departmentTitle[dept]}: {state === 'ok' ? '计算完成' : '已计算过'}</p>
{/each}
