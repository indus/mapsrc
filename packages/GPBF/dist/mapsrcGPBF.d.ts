import { GeoJSONSourceClass } from "@mapsrc/utils";
import type { Map } from "maplibre-gl";
export declare const getSourceTypeGPBF: (map: Map) => GeoJSONSourceClass;
export declare const addSourceTypeGPBF: (map: Map, cb?: (() => void) | undefined) => void;
export default addSourceTypeGPBF;
