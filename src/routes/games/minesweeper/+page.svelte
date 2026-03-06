<script lang="ts">
  import Minesweeper from '@/components/minesweeper/Minesweeper.svelte'

  let numOfMines = 0
</script>

<svelte:head>
  <title>Minesweeper</title>
</svelte:head>

<div
  class="container mx-auto flex grow flex-col justify-evenly justify-start lg:flex-row"
>
  <div class="flex flex-col justify-center lg:grow-2">
    <h1 class="m-4 text-4xl font-bold">
      {numOfMines} mines left!
    </h1>
    <p class="m-4">texture designed by Rockpaperkatana</p>
  </div>
  <div
    class="minesweeper-container flex items-center justify-center p-4 lg:grow-3"
  >
    <Minesweeper bind:numOfMines />
  </div>
</div>
