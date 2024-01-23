<script lang="ts">
  import { subNamesOfWork, type Work } from '$lib/domain/entity';
  export let work: Work;
</script>

<div class="flex flex-col wide:flex-row items-start wide:items-center px-4 py-2 bg-overlay rounded">
  <p class="flex-1 font-serif text-2xl">{work.name}</p>
  <div class="flex-1">
    {#each subNamesOfWork(work) as name (name)}
      <p class="text-subtle">
        {name}
      </p>
    {/each}
  </div>
</div>
