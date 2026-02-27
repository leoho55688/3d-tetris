import { get } from '@/lib/api'

interface busStop {
  stop: string
  name_en: string
  name_tc: string
  name_sc: string
  lat: string
  long: string
}

interface busStopResponse {
  type: string
  version: string
  generated_timestamp: string
  data: busStop[]
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

interface busRouteRespose {
  type: string
  version: string
  generated_timestamp: string
  data: busRoute[]
}

interface busRouteStop {
  route: string
  bound: string
  service_type: string
  seq: string
  stop: string
}

interface busRouteStopResponse {
  type: string
  version: string
  generated_timestamp: string
  data: busRouteStop[]
}

interface eta {
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

interface etaResponse {
  type: string
  version: string
  generated_timestamp: string
  data: eta[]
}

const etaAPIRoot = 'https://data.etabus.gov.hk/v1/transport/kmb'

const getStopList = async (): Promise<busStop[]> => {
  const res: busStopResponse = await get<busStopResponse>(etaAPIRoot + '/stop')
  return res.data
}

const getRouteList = async (): Promise<busRoute[]> => {
  const res: busRouteRespose = await get<busRouteRespose>(etaAPIRoot + '/route')
  return res.data
}

const getRouteStopList = async (): Promise<busRouteStop[]> => {
  const res: busRouteStopResponse = await get<busRouteStopResponse>(
    etaAPIRoot + '/route-stop'
  )
  return res.data
}

const getEta = async (): Promise<eta[]> => {
  const res: etaResponse = await get<etaResponse>(etaAPIRoot + '/eta')
  return res.data
}

export { getStopList }
