<script lang="ts">
  import * as NavigationMenu from '$lib/components/ui/navigation-menu'
  import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte'

  import ModeToggleButton from './ModeToggleButton.svelte'
</script>

<header class="flex h-16 items-center border-b px-4">
  <div class="logo-container"></div>
  <NavigationMenu.Root>
    <NavigationMenu.List>
      <NavigationMenu.Item>
        <NavigationMenu.Link>
          {#snippet child()}
            <a href="/" class={navigationMenuTriggerStyle()}>home</a>
          {/snippet}
        </NavigationMenu.Link>
      </NavigationMenu.Item>
      <NavigationMenu.Item>
        <NavigationMenu.Link>
          {#snippet child()}
            <a href="/about" class={navigationMenuTriggerStyle()}>about</a>
          {/snippet}
        </NavigationMenu.Link>
      </NavigationMenu.Item>
    </NavigationMenu.List>
  </NavigationMenu.Root>
  <div class="flex-grow"></div>
  <ModeToggleButton />
</header>
