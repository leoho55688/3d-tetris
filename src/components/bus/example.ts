// route
// https://data.etabus.gov.hk/v1/transport/kmb/route/
// https://data.etabus.gov.hk/v1/transport/kmb/route/{route}/{direction}/{service_type}
let route = {
  route: '1',
  bound: 'O',
  service_type: '1',
  orig_en: 'CHUK YUEN ESTATE',
  orig_tc: '竹園邨',
  orig_sc: '竹园邨',
  dest_en: 'STAR FERRY',
  dest_tc: '尖沙咀碼頭',
  dest_sc: '尖沙咀码头',
}
// stop
// https://data.etabus.gov.hk/v1/transport/kmb/stop
// https://data.etabus.gov.hk/v1/transport/kmb/stop/{stop_id}
let stopData = {
  stop: '18492910339410B1',
  name_en: 'CHUK YUEN ESTATE BUS TERMINUS (WT916)',
  name_tc: '竹園邨總站 (WT916)',
  name_sc: '竹园邨总站 (WT916)',
  lat: '22.345415',
  long: '114.192640',
}
// route-stop
// https://data.etabus.gov.hk/v1/transport/kmb/route-stop
// https://data.etabus.gov.hk/v1/transport/kmb/route-stop/{route}/{direction}/{service_type}
let routeStop = {
  route: '1',
  bound: 'O',
  service_type: '1',
  seq: '1',
  stop: '18492910339410B1',
}
// eta
// https://data.etabus.gov.hk/v1/transport/kmb/eta/{stop_id}/{route}/{service_type}
// https://data.etabus.gov.hk/v1/transport/kmb/stop-eta/{stop_id}
// https://data.etabus.gov.hk/v1/transport/kmb/route-eta/{route}/{service_type}
let eta = {
  co: 'KMB',
  route: '276P',
  dir: 'O',
  service_type: 1,
  seq: 1,
  dest_tc: '上水',
  dest_sc: '上水',
  dest_en: 'SHEUNG SHUI',
  eta_seq: 1,
  eta: '2026-02-27T10:45:00+08:00',
  rmk_tc: '原定班次',
  rmk_sc: '原定班次',
  rmk_en: 'Scheduled Bus',
  data_timestamp: '2026-02-27T10:45:19+08:00',
}
