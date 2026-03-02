<script lang="ts">
  import * as InputGroup from '$lib/components/ui/input-group/index.js'
  import SearchIcon from '@lucide/svelte/icons/search'

  import { getRoute, type busRoute } from './bus'
  import * as Item from '@/lib/components/ui/item'
  import { Button } from '@/lib/components/ui/button'

  let route = $state('')
  let inboundRoute: busRoute | null = $state(null)
  let outboundRoute: busRoute | null = $state(null)

  let errorMessage = $state('')

  const onclick = async () => {
    let inboundRouteRes = await getRoute(route, 'inbound')
    if (inboundRouteRes.ok) {
      inboundRoute = inboundRouteRes.value
    } else {
      // todo
      errorMessage = inboundRouteRes.error.message
    }

    if (Object.keys(inboundRoute ?? {}).length === 0) {
      errorMessage = 'Selected route is not valid. Please enter again'
      return
    } else {
      errorMessage = ''
    }

    let outboundRouteRes = await getRoute(route, 'outbound')
    if (outboundRouteRes.ok) {
      outboundRoute = outboundRouteRes.value
    } else {
      // todo
    }

    console.log(inboundRoute)
  }
</script>

<div class="bus-container">
  <div class="search-container m-4 lg:mx-50">
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

  {#if errorMessage}
    <div class="error-container lg:m-50">
      <h1>
        {errorMessage}
      </h1>
    </div>
  {/if}

  {#if !errorMessage}
    <div class="item-container lg:mx-50">
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
                  href={'/bus/' + outboundRoute.route + '/outbound'}
                  >Open</Button
                >
              </Item.Actions>
            </Item.Root>
          </li>
        {/if}
      </ul>
    </div>
  {/if}
</div>
