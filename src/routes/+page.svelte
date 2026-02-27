<script lang="ts">
  import { Tetris } from '@/components/tetris'

  let clearedLines = 0
</script>

<svelte:head>
  <title>Leo's Home &#9829;</title>
</svelte:head>

<div
  class="flex h-full w-full flex-col items-center justify-evenly lg:flex-row"
>
  <div class="info-container flex w-full grow-3 flex-col items-center p-4">
    <h1 class="text-6xl font-thin text-blue-800 uppercase">
      Cleared {clearedLines} line!
    </h1>
    <p></p>
  </div>
  <div class="tetris-container flex w-full grow-2 justify-center p-4">
    <Tetris bind:clearedLines />
  </div>
</div>
