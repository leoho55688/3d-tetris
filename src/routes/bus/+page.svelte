<script lang="ts">
  import BusRoute from '@/components/bus/BusRoute.svelte'
</script>

<svelte:head>
  <title>Bus</title>
</svelte:head>

<div class="container mx-auto flex flex-grow flex-col justify-start px-4 py-8">
  <h1 class="mx-4 mb-4 text-4xl font-bold">Find The Bus</h1>
  <BusRoute />
</div>
