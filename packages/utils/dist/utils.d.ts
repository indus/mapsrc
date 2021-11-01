import type { Map, Source, GeoJSONSource } from "maplibre-gl";
export interface GeoJSONSourceClass extends GeoJSONSource {
    new (id: string, options: any, dispatcher: any, eventedParent: any): GeoJSONSource & {
        id: string;
        _options: any;
    };
}
export interface Map_ extends Map {
    _GeoJSONSource: GeoJSONSourceClass;
    addSourceType: (type: string, Source: Source, cb?: () => void) => void;
    style: any;
}
export declare let emptyGeoJSON: import("geojson").FeatureCollection<import("geojson").Geometry, import("geojson").GeoJsonProperties>;
export declare const getGeoJSONSource: (map: Map_) => GeoJSONSourceClass;
