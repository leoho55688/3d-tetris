<script lang="ts">
  import '@/app.css'
  import { ModeWatcher } from 'mode-watcher'
  import Header from '@/components/Header.svelte'
  import Footer from '@/components/Footer.svelte'

  let { children } = $props()
</script>

<ModeWatcher />
<div class="flex h-screen flex-col">
  <Header />
  <main class="flex grow flex-col items-center justify-center overflow-hidden">
    {#if children}
      <div class="w-full h-full overflow-auto">
        {@render children()}
      </div>
    {:else}
      <p>404 Not Found</p>
    {/if}
  </main>
  <Footer />
</div>
