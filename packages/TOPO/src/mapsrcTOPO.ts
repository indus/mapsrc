import { emptyGeoJSON, getGeoJSONSource, Map_, GeoJSONSourceClass } from "@mapsrc/utils"
import type { Map } from "maplibre-gl"

//@ts-ignore
import { default as topojson_decode } from "topojson-client/src/feature"


export const getSourceTypeTOPO = (map: Map): GeoJSONSourceClass =>
    class TopoJSONSource extends getGeoJSONSource(<Map_>map) {
        
        constructor(id: string, { data, ...options }: any, dispatcher: any, eventedParent: any) {
            super(id, Object.assign(options, { data: emptyGeoJSON }), dispatcher, eventedParent);
            this.id = id;
            this.type = "geojson";
            this._options.data = data;

            if (options.topoFilter)
                this.setTOPOFilter(options.topoFilter);
            else
                this.setData(data);
        }
        setData(data: string): this {
            if (typeof data === 'string' || <any>data instanceof String) {
                var req = new XMLHttpRequest();
                req.open("GET", <string>data);
                req.responseType = "json";
                req.addEventListener("load", () => this.setData(req.response));
                req.send();
            } else if (data && (<any>data).type == "Topology") {
                this._options.data = data;

                let objects = this._options.topoFilter;

                if (Array.isArray(objects))
                    objects = { "type": "GeometryCollection", "geometries": objects.map(id => (<any>data).objects[id]) }
                if (!objects)
                    objects = { "type": "GeometryCollection", "geometries": Object.values((<any>data).objects) }

                var geojson = <GeoJSON.Feature | GeoJSON.FeatureCollection>topojson_decode(data, objects);
                super.setData(geojson)
            } else {
                console.error("TopoJSONSource expects a URL or a TopoJSON as 'data'")
            }
            return this

        }

        setTOPOFilter(filter: unknown): this {
            this._options.fgbFilter = filter;
            this.setData(this._options.data)

            return this;
        }
    }

export const addSourceTypeGPBF = function (map: Map, cb?: () => void) {
    (<Map_>map).addSourceType('topojson', getSourceTypeTOPO(<Map_>map), cb)
}

export default addSourceTypeGPBF