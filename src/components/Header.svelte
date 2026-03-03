<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  import * as NavigationMenu from '$lib/components/ui/navigation-menu'
  import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte'
  import { IsMobile } from '$lib/hooks/is-mobile'
  import { cn } from '@/lib/utils'

  import ModeToggleButton from './ModeToggleButton.svelte'

  const isMobile = new IsMobile()

  const components: { title: string; href: string; description: string }[] = [
    {
      title: 'Tetris',
      href: '/games/tetris',
      description:
        'A puzzle game where players rotate falling geometric blocks to clear complete horizontal lines.',
    },
    {
      title: 'Minesweeper',
      href: '/games/minesweeper',
      description:
        'A logic puzzle where players clear a grid by uncovering safe tiles and avoiding hidden mines.',
    },
    {
      title: 'Chess',
      href: '/games/chess',
      description:
        'A strategic board game where two players move sixteen pieces to checkmate the king.',
    },
  ]

  type ListItemProps = HTMLAttributes<HTMLAnchorElement> & {
    title: string
    href: string
    content: string
  }
</script>

{#snippet ListItem({
  title,
  content,
  href,
  class: className,
  ...restProps
}: ListItemProps)}
  <li>
    <NavigationMenu.Link>
      {#snippet child()}
        <a
          {href}
          class={cn(
            'block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...restProps}
        >
          <div class="text-sm leading-none font-medium">{title}</div>
          <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {content}
          </p>
        </a>
      {/snippet}
    </NavigationMenu.Link>
  </li>
{/snippet}

<header class="flex h-16 items-center border-b px-2 lg:px-4">
  <div class="logo-container"></div>
  <NavigationMenu.Root viewport={isMobile.current}>
    <NavigationMenu.List>
      <NavigationMenu.Item>
        <NavigationMenu.Link>
          {#snippet child()}
            <a href="/" class={navigationMenuTriggerStyle()}>HOME</a>
          {/snippet}
        </NavigationMenu.Link>
      </NavigationMenu.Item>
      <NavigationMenu.Item>
        <NavigationMenu.Link>
          {#snippet child()}
            <a href="/about" class={navigationMenuTriggerStyle()}>ABOUT</a>
          {/snippet}
        </NavigationMenu.Link>
      </NavigationMenu.Item>
      <NavigationMenu.Item>
        <NavigationMenu.Link>
          {#snippet child()}
            <a href="/bus" class={navigationMenuTriggerStyle()}>BUS</a>
          {/snippet}
        </NavigationMenu.Link>
      </NavigationMenu.Item>
      <NavigationMenu.Item>
        <NavigationMenu.Trigger>
          GAMES
        </NavigationMenu.Trigger>
        <NavigationMenu.Content class="mt-1 z-100">
          <ul
            class="grid w-[300px] gap-2 p-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]"
          >
            {#each components as component, i (i)}
              {@render ListItem({
                href: component.href,
                title: component.title,
                content: component.description,
              })}
            {/each}
          </ul>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
    </NavigationMenu.List>
  </NavigationMenu.Root>
  <div class="flex-grow"></div>
  <ModeToggleButton />
</header>
