<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  import * as NavigationMenu from '$lib/components/ui/navigation-menu'
  import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte'
  import { IsMobile } from '$lib/hooks/is-mobile'
  import { cn } from '@/lib/utils'

  import ModeToggleButton from './ModeToggleButton.svelte'

  const isMobile = new IsMobile()

  const headerItems: HeaderItemProps[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'About',
      href: '/about',
    },
    {
      title: 'Bus',
      href: '/bus',
    },
    {
      title: 'Games',
      list: [
        {
          title: 'Tetris',
          href: '/games/tetris',
          content:
            'A puzzle game where players rotate falling geometric blocks to clear complete horizontal lines.',
        },
        {
          title: 'Minesweeper',
          href: '/games/minesweeper',
          content:
            'A logic puzzle where players clear a grid by uncovering safe tiles and avoiding hidden mines.',
        },
        {
          title: 'Platform Jumper',
          href: '/games/jump',
          content: 'A 2d platform game developed and published by me.',
        },
      ],
    },
  ]

  type HeaderItemProps = {
    title: string
    href?: string
    list?: ListItemProps[]
  }

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
    <NavigationMenu.Link
      {href}
      class={cn(
        'block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
        className
      )}
    >
      <div class="text-sm leading-none font-medium">{title}</div>
      <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
        {content}
      </p>
    </NavigationMenu.Link>
  </li>
{/snippet}

{#snippet HeaderItem({ href, title, list }: HeaderItemProps)}
  <NavigationMenu.Item>
    {#if list}
      <NavigationMenu.Trigger>{title}</NavigationMenu.Trigger>
      <NavigationMenu.Content class="z-100 mt-1">
        <ul
          class="grid w-[300px] gap-2 p-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]"
        >
          {#each list as component, i (i)}
            {@render ListItem(component)}
          {/each}
        </ul>
      </NavigationMenu.Content>
    {:else}
      <NavigationMenu.Link {href} class={navigationMenuTriggerStyle()}>
        {title}
      </NavigationMenu.Link>
    {/if}
  </NavigationMenu.Item>
{/snippet}

<header class="flex h-16 items-center border-b px-2 lg:px-4">
  <div class="logo-container"></div>
  <NavigationMenu.Root viewport={isMobile.current}>
    <NavigationMenu.List>
      {#each headerItems as item}
        {@render HeaderItem(item)}
      {/each}
    </NavigationMenu.List>
  </NavigationMenu.Root>
  <div class="flex-grow"></div>
  <ModeToggleButton />
</header>
