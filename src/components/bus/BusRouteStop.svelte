<script lang="ts">
  import { onMount } from 'svelte'
  import {
    getETA,
    getRouteStop,
    getStop,
    type busETA,
    type busRouteStop,
  } from './bus'

  import * as Accordion from '$lib/components/ui/accordion'

  let { route, direction, start = $bindable(), end = $bindable() } = $props()
  let routeStop: busRouteStop[] | null = $state(null)
  let busETAList: busETA[] | null = $state(null)

  let errorMessage = $state('')

  const clickHandler = async (stop: string) => {
    const busETARes = await getETA(stop, route)

    if (busETARes.ok) {
      busETAList = busETARes.value
      busETAList = busETAList.filter(
        (eta) => eta.dir === direction.charAt(0).toUpperCase()
      )
    } else {
      // todo
      console.error(busETARes.error)
      errorMessage = busETARes.error.message
    }
  }

  onMount(async () => {
    const routeStopRes = await getRouteStop(route, direction)
    if (routeStopRes.ok) {
      routeStop = routeStopRes.value
    } else {
      //todo
      console.error(routeStopRes.error)
      errorMessage = routeStopRes.error.message
    }

    if (routeStop) {
      routeStop.map(async (stop, idx) => {
        const stopRes = await getStop(stop.stop)
        if (stopRes.ok) {
          stop.stop_name = stopRes.value.name_tc
        } else {
          stop.stop_name = 'stop not found'
        }

        if (idx === 0) {
          start = stop.stop_name.split(' ').at(0)
        } else if (idx === (routeStop?.length ?? 0) - 1) {
          end = stop.stop_name.split(' ').at(0)
        }

        return stop
      })
    }
  })
</script>

{#if errorMessage}
  <div class="error-container m-4">
    <p>
      {errorMessage}
    </p>
  </div>
{/if}

<div class="route-stop-container my-4 lg:mx-50">
  {#if routeStop}
    <Accordion.Root type="single" class="flex flex-col gap-4">
      {#each routeStop as stop}
        <Accordion.Item class="w-full space-y-2 rounded-md border">
          <div class="my-2 flex flex-col justify-center space-x-4 pl-4">
            <Accordion.Trigger onclick={() => clickHandler(stop.stop)}>
              {stop.stop_name}
            </Accordion.Trigger>
            <Accordion.Content class="flex flex-col p-0 text-balance">
              {#if busETAList}
                {#each busETAList as eta}
                  <div class="border-t py-4">
                    <p>
                      {Math.round(((new Date(eta.eta)).getTime() - Date.now()) / (1000 * 60))} minutes
                    </p>
                  </div>
                {/each}
              {/if}
            </Accordion.Content>
          </div>
        </Accordion.Item>
      {/each}
    </Accordion.Root>
  {/if}
</div>
