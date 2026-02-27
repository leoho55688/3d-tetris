import { get } from '@/lib/api'
import { Ok, Err, type Result } from '@/utils/result'

interface busStop {
  stop: string
  name_en: string
  name_tc: string
  name_sc: string
  lat: string
  long: string
}

interface busRoute {
  route: string
  bound: string
  service_type: string
  orig_en: string
  orig_tc: string
  orig_sc: string
  dest_en: string
  dest_tc: string
  dest_sc: string
}

interface busRouteStop {
  route: string
  bound: string
  service_type: string
  seq: string
  stop: string
  stop_name?: string
}

interface busETA {
  co: string
  route: string
  dir: string
  service_type: number
  seq: number
  dest_tc: string
  dest_sc: string
  dest_en: string
  eta_seq: number
  eta: string
  rmk_tc: string
  rmk_sc: string
  rmk_en: string
  data_timestamp: string
}

interface busAPIResponse<T> {
  type: string
  version: string
  generated_timestamp: string
  data: T
}

const busAPIRoot = 'https://data.etabus.gov.hk/v1/transport/kmb'

const getStopList = async (): Promise<Result<busStop[]>> => {
  const res: Result<busAPIResponse<busStop[]>> = await get<
    busAPIResponse<busStop[]>
  >(busAPIRoot + '/stop')

  if (res.ok) {
    return Ok(res.value.data)
  }
  return res
}

const getStop = async (stop_id: string): Promise<Result<busStop>> => {
  const res: Result<busAPIResponse<busStop>> = await get<
    busAPIResponse<busStop>
  >(busAPIRoot + '/stop/' + stop_id)

  if (res.ok) {
    return Ok(res.value.data)
  }
  return res
}

const getRouteList = async (): Promise<Result<busRoute[]>> => {
  const res: Result<busAPIResponse<busRoute[]>> = await get<
    busAPIResponse<busRoute[]>
  >(busAPIRoot + '/route')

  if (res.ok) {
    return Ok(res.value.data)
  }
  return res
}

const getRoute = async (
  route: string,
  direction: string,
  service_type: string = '1'
): Promise<Result<busRoute>> => {
  const res: Result<busAPIResponse<busRoute>> = await get<
    busAPIResponse<busRoute>
  >(busAPIRoot + '/route/' + route + '/' + direction + '/' + service_type)

  if (res.ok) {
    return Ok(res.value.data)
  }
  return res
}

const getRouteStopList = async (): Promise<Result<busRouteStop[]>> => {
  const res: Result<busAPIResponse<busRouteStop[]>> = await get<
    busAPIResponse<busRouteStop[]>
  >(busAPIRoot + '/route-stop')

  if (res.ok) {
    return Ok(res.value.data)
  }
  return res
}

const getRouteStop = async (
  route: string,
  direction: string,
  service_type: string = '1'
): Promise<Result<busRouteStop[]>> => {
  const res: Result<busAPIResponse<busRouteStop[]>> = await get<
    busAPIResponse<busRouteStop[]>
  >(busAPIRoot + '/route-stop/' + route + '/' + direction + '/' + service_type)

  if (res.ok) {
    return Ok(res.value.data)
  }
  return res
}

const getETA = async (
  stop_id: string,
  route: string,
  service_type: string = '1'
): Promise<Result<busETA[]>> => {
  const res: Result<busAPIResponse<busETA[]>> = await get<
    busAPIResponse<busETA[]>
  >(busAPIRoot + '/eta/' + stop_id + '/' + route + '/' + service_type)

  if (res.ok) {
    return Ok(res.value.data)
  }
  return res
}

export {
  getStopList,
  getStop,
  getRouteList,
  getRoute,
  getRouteStopList,
  getRouteStop,
  getETA,
}
export type { busStop, busRoute, busRouteStop, busETA }
