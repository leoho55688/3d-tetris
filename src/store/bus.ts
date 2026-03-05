import { writable } from 'svelte/store'

const recentBusRoute = localStorage.getItem('recent_bus_route')
const recentBusRouteWritable = writable(recentBusRoute || '')
recentBusRouteWritable.subscribe((value) =>
  localStorage.setItem('recent_bus_route', value)
)

const recentBusRouteStop = localStorage.getItem('recent_bus_route_stop')
const recentBusRouteStopWritable = writable(recentBusRouteStop || '')
recentBusRouteStopWritable.subscribe((value) =>
  localStorage.setItem('recent_bus_route_stop', value)
)

export { recentBusRouteWritable, recentBusRouteStopWritable }
