<script lang="ts">
  import * as InputGroup from '$lib/components/ui/input-group/index.js'
  import SearchIcon from '@lucide/svelte/icons/search'

  import { getRoute, type busRoute } from './bus'
  import * as Item from '@/lib/components/ui/item'
  import { Button } from '@/lib/components/ui/button'

  let route = $state('')
  let inboundRoute: busRoute | null = $state(null)
  let outboundRoute: busRoute | null = $state(null)

  const onclick = async () => {
    let inboundRouteRes = await getRoute(route, 'inbound')
    if (inboundRouteRes.ok) {
      inboundRoute = inboundRouteRes.value
    } else {
      // todo
    }

    let outboundRouteRes = await getRoute(route, 'outbound')
    if (outboundRouteRes.ok) {
      outboundRoute = outboundRouteRes.value
    } else {
      //todo
    }
  }
</script>

<div class="bus-container">
  <div class="search-container m-4">
    <InputGroup.Root>
      <InputGroup.Input placeholder="Search..." bind:value={route} />
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

  <div class="item-container">
    <ul>
      {#if inboundRoute}
        <li class="m-4">
          <Item.Root variant="outline">
            <Item.Content>
              <Item.Title>{inboundRoute.route}</Item.Title>
              <Item.Description>
                from {inboundRoute.orig_tc} to {inboundRoute.dest_tc}
              </Item.Description>
            </Item.Content>
            <Item.Actions>
              <Button
                variant="outline"
                size="sm"
                href={'/bus/' + inboundRoute.route + '/inbound'}>Open</Button
              >
            </Item.Actions>
          </Item.Root>
        </li>
      {/if}
      {#if outboundRoute}
        <li class="m-4">
          <Item.Root variant="outline">
            <Item.Content>
              <Item.Title>{outboundRoute.route}</Item.Title>
              <Item.Description>
                from {outboundRoute.orig_tc} to {outboundRoute.dest_tc}
              </Item.Description>
            </Item.Content>
            <Item.Actions>
              <Button
                variant="outline"
                size="sm"
                href={'/bus/' + outboundRoute.route + '/outbound'}>Open</Button
              >
            </Item.Actions>
          </Item.Root>
        </li>
      {/if}
    </ul>
  </div>
</div>
