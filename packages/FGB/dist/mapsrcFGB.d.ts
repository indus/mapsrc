import { GeoJSONSourceClass } from "@mapsrc/utils";
import type { Map } from "maplibre-gl";
export declare const getSourceTypeFGB: (map: Map) => GeoJSONSourceClass;
export declare const addSourceTypeFGB: (map: Map, cb?: (() => void) | undefined) => void;
export default addSourceTypeFGB;
