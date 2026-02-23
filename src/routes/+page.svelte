<script lang="ts">
  import { Tetris } from '@/components/tetris'

  let name = 'World'
</script>

<div class="flex h-full items-center justify-center">
  <Tetris />

  <h1>Hello {name}!</h1>
</div>

<style>
  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }
</style>
