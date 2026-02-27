<script lang="ts">
  import { Tetris } from '@/components/tetris'

  let clearedLines = 0
</script>

<svelte:head>
  <title>Leo's Home &#9829;</title>
</svelte:head>

<div
  class="container mx-auto flex flex-grow flex-col justify-evenly justify-start px-4 py-8 lg:flex-row"
>
  <h1 class="mx-4 mb-4 text-4xl font-bold lg:grow-2">
    Cleared {clearedLines} line!
  </h1>
  <div class="tetris-container flex w-full justify-center p-4 lg:grow-3">
    <Tetris bind:clearedLines />
  </div>
</div>
