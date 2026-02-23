<script lang="ts">
  import '@/app.css'
  import { ModeWatcher } from 'mode-watcher'
  import Header from '@/components/Header.svelte'
  import Footer from '@/components/Footer.svelte'

  let { children } = $props()
</script>

<ModeWatcher />
<div class="flex min-h-screen flex-col">
  <Header />
  <main class="flex flex-grow items-center justify-center">
    {#if children}
      {@render children()}
    {:else}
      <p>404 Not Found</p>
    {/if}
  </main>
  <Footer />
</div>
