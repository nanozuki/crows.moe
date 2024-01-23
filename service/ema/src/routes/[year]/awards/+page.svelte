<script lang="ts">
  import { orderedDepartments } from '$lib/domain/value';
  import Highlight from './Highlight.svelte';

  export let data;
</script>

{#each orderedDepartments as dept (dept)}
  {#if data.winnersByDept.get(dept)}
    <Highlight department={dept} rankedWorks={data.winnersByDept.get(dept) || []} />
  {/if}
{/each}
