<script lang="ts">
  import { onMount } from 'svelte'
  import { SvelteMap } from 'svelte/reactivity'

  import * as Accordion from '$lib/components/ui/accordion'
  import * as InputGroup from '$lib/components/ui/input-group'
  import * as Item from '@/lib/components/ui/item'
  import { Button } from '@/lib/components/ui/button'
  import SearchIcon from '@lucide/svelte/icons/search'

  import { getRoute, type busRoute } from './bus'
  import { recentBusRouteWritable } from '@/store/bus'

  let route = $state('')

  let recentBusRoute =
    $recentBusRouteWritable === '' ? [] : $recentBusRouteWritable.split(',')
  const busRouteData: Map<string, { inbound: busRoute; outbound: busRoute }> =
    new SvelteMap()

  let errorMessage = $state('')

  const searchRotue = async (route: string) => {
    let inboundRouteRes = await getRoute(route, 'inbound')
    if (!inboundRouteRes.ok) {
      errorMessage = inboundRouteRes.error.message
      return
    }

    let outboundRouteRes = await getRoute(route, 'outbound')
    if (!outboundRouteRes.ok) {
      errorMessage = outboundRouteRes.error.message
      return
    }

    if (
      Object.keys(inboundRouteRes.value).length === 0 ||
      Object.keys(outboundRouteRes.value).length === 0
    ) {
      errorMessage = 'Selected route is not valid. Please enter again'
      return
    }

    errorMessage = ''
    busRouteData.set(route, {
      inbound: inboundRouteRes.value,
      outbound: outboundRouteRes.value,
    })
  }

  const onclick = async () => {
    busRouteData.clear()

    const routeProcessed = route.toUpperCase()
    await searchRotue(routeProcessed)

    recentBusRoute.push(routeProcessed)
    recentBusRoute = [...new Set(recentBusRoute)]
    recentBusRouteWritable.set(recentBusRoute.slice(-5).join(','))
  }

  onMount(async () => {
    busRouteData.clear()

    for (const route of recentBusRoute.reverse()) {
      const routeProcessed = route.toUpperCase()
      await searchRotue(routeProcessed)
    }

    console.log(busRouteData)
  })
</script>

<div class="bus-container">
  <div class="search-container m-4 lg:mx-50">
    <InputGroup.Root>
      <InputGroup.Input
        placeholder="Search..."
        bind:value={route}
        onkeydown={async (e: KeyboardEvent) => {
          if (e.key === 'Enter') await onclick()
        }}
      />
      <InputGroup.Addon>
        <SearchIcon />
      </InputGroup.Addon>
      <InputGroup.Addon align="inline-end">
        <InputGroup.Button variant="secondary" {onclick}
          >Search</InputGroup.Button
        >
      </InputGroup.Addon>
    </InputGroup.Root>
  </div>

  {#if errorMessage}
    <div class="error-container m-4 lg:m-50">
      <h1>
        {errorMessage}
      </h1>
    </div>
  {/if}

  {#if !errorMessage}
    <div class="item-container lg:mx-50">
      <Accordion.Root type="single" class="flex flex-col gap-4">
        {#each busRouteData as [key, value] (key)}
          <Accordion.Item class="w-full space-y-2 rounded-md border">
            <div class="my-2 flex flex-col justify-center space-x-4 px-4">
              <Accordion.Trigger>
                {key}
              </Accordion.Trigger>
              <Accordion.Content class="flex flex-col p-0 text-balance">
                <Item.Root variant="default">
                  <Item.Content>
                    <Item.Description>
                      from {value.inbound.orig_tc} to {value.inbound.dest_tc}
                    </Item.Description>
                  </Item.Content>
                  <Item.Actions>
                    <Button
                      variant="outline"
                      size="sm"
                      href={'/bus/' + key + '/inbound'}>Open</Button
                    >
                  </Item.Actions>
                </Item.Root>
                <Item.Root variant="default">
                  <Item.Content>
                    <Item.Description>
                      from {value.outbound.orig_tc} to {value.outbound.dest_tc}
                    </Item.Description>
                  </Item.Content>
                  <Item.Actions>
                    <Button
                      variant="outline"
                      size="sm"
                      href={'/bus/' + key + '/outbound'}>Open</Button
                    >
                  </Item.Actions>
                </Item.Root>
              </Accordion.Content>
            </div>
          </Accordion.Item>
        {/each}
      </Accordion.Root>
    </div>
  {/if}
</div>
