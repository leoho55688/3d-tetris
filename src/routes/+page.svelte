<script lang="ts">
  import { Tetris } from '@/components/tetris'

  let clearedLines = 0
</script>

<svelte:head>
  <title>Leo's Home</title>
</svelte:head>

<div
  class="container mx-auto flex grow flex-col justify-evenly justify-start lg:flex-row"
>
  <div class="flex flex-col justify-center lg:grow-2">
    <h1 class="mx-4 mb-4 text-4xl font-bold">
      Cleared {clearedLines} line!
    </h1>
  </div>
  <div class="tetris-container flex items-center justify-center p-4 lg:grow-3">
    <Tetris bind:clearedLines />
  </div>
</div>
