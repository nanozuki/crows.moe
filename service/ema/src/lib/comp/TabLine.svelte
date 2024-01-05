<script lang="ts">
  export let total: number;
  export let current: number;
</script>

<div class="flex flex-row">
  <svg
    class="w-[0.6875rem] h-2"
    width="11"
    height="8"
    viewBox="0 0 11 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_107_47)">
      <path d="M0 4C0 1.79086 1.79086 0 4 0H7V8H4C1.79086 8 0 6.20914 0 4Z" fill="#907AA9" />
      <path d="M7 0H11L7 8V0Z" fill="#907AA9" />
    </g>
    <defs>
      <clipPath id="clip0_107_47">
        <rect width="11" height="8" fill="white" />
      </clipPath>
    </defs>
  </svg>

  <div class="flex flex-row gap-x-[0.125rem] w-[calc(100%-1.375rem)]">
    {#each Array(total) as _, i}
      <div
        class="flex-1 h-2 [transform:matrix(1,0,-0.5,1,0,0)]"
        class:bg-rose={i < current}
        class:bg-love={i === current}
        class:bg-overlay={i > current}
      />
    {/each}
  </div>

  <svg
    class="w-[0.6875rem] h-2"
    width="11"
    height="8"
    viewBox="0 0 11 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_107_48)">
      <path d="M0 8L4 0V8H0Z" fill="#907AA9" />
      <path d="M4 0H7C9.20914 0 11 1.79086 11 4C11 6.20914 9.20914 8 7 8H4V0Z" fill="#907AA9" />
    </g>
    <defs>
      <clipPath id="clip0_107_48">
        <rect width="11" height="8" fill="white" />
      </clipPath>
    </defs>
  </svg>
</div>
