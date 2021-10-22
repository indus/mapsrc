import type { Map, Source, GeoJSONSource } from "maplibre-gl"

export interface GeoJSONSourceClass extends GeoJSONSource {
  new(id: string, options: any, dispatcher: any, eventedParent: any): GeoJSONSource & {
    id:string
    _options: any
  }
}

export interface Map_ extends Map {
  _GeoJSONSource: GeoJSONSourceClass
  addSourceType: (type: string, Source: Source, cb?: () => void) => void
  style:any
}

export let emptyGeoJSON = <GeoJSON.FeatureCollection>{ 'type': 'FeatureCollection', 'features': [] };

export const getGeoJSONSource = (map: Map_) => {
  if (map._GeoJSONSource) {
    return map._GeoJSONSource;
  } else {
    map.style.addSource('$geojson', {
      'type': 'geojson',
      'data': emptyGeoJSON
    });

    map._GeoJSONSource = <GeoJSONSourceClass>(<GeoJSONSource>map.style.getSource("$geojson")).constructor;
    map.style.removeSource("$geojson");
    return map._GeoJSONSource;
  }
}