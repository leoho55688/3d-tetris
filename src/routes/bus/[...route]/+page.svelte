<script lang="ts">
  import { page } from '$app/state'
  import BusRouteStop from '@/components/bus/BusRouteStop.svelte'
  let pathSegments = $derived(page.params.route?.split('/').filter(Boolean))
  let segmentCount = $derived(pathSegments?.length)

  let start = $state('')
  let end = $state('')
  let errorMessage = $state('')
</script>

<div class="container mx-auto flex flex-grow flex-col justify-start px-4 py-8">
  {#if pathSegments && segmentCount === 2}
    <h1 class="mx-4 mb-4 text-4xl leading-12 font-bold">
      Stop List of {pathSegments[0]}
      from {start} to {end}
    </h1>
    <BusRouteStop
      route={pathSegments[0]}
      direction={pathSegments[1]}
      bind:start
      bind:end
    />
  {:else}
    <h1 class="mx-4 mb-4 text-4xl font-bold">{errorMessage}</h1>
  {/if}
</div>
