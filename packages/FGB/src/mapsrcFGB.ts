import { emptyGeoJSON, getGeoJSONSource, Map_, GeoJSONSourceClass } from "@mapsrc/utils"
import type { Map } from "maplibre-gl"

import { deserialize as flatgeobuf_deserialize } from "flatgeobuf/lib/mjs/geojson"


export const getSourceTypeFGB = (map: Map): GeoJSONSourceClass =>

    class FlatgeobufSource extends getGeoJSONSource(<Map_>map) {
        
        constructor(id: string, { data, ...options }: any, dispatcher: any, eventedParent: any) {
            super(id, Object.assign(options, { data: emptyGeoJSON }), dispatcher, eventedParent);
            this.id = id;
            this.type = "geojson";
            this._options.data = data;

            if (options.fgbFilter)
                this.setFGBFilter(options.fgbFilter);
            else
                this.setData(data);
        }

        setData(data: string): this {
            if (this._options.fgbFilter ||
                <unknown>data instanceof ReadableStream ||
                <unknown>data instanceof Uint8Array) {
                let fc = emptyGeoJSON;

                let progressiv = this._options.fgbProgressiv;
                let filter = this._options.fgbFilter;
                let featureCount = 0;
                (async () => {
                    for await (let feature of <AsyncIterable<any>>flatgeobuf_deserialize(
                        data,
                        filter,
                        meta => {
                            if (progressiv > 0 && progressiv < 1)
                                progressiv = Math.ceil(meta.featuresCount * progressiv)
                        })) {
                        fc.features.push(feature);
                        if (progressiv && !(++featureCount % progressiv)) {
                            super.setData(fc)
                        }
                    }
                    super.setData(fc);
                })()
            } else if (typeof data === 'string' || <unknown>data instanceof String) {

                this._options.data = data;
                (async () => {
                    const response = await fetch(data);
                    this.setData(<any>response.body);
                })()
            } else {
                console.error("FlatgeobufSource expects a URL, a ReadableStream or a Uint8Array as 'data'")
            }

            return this
        }


        setFGBFilter(filter: any): this {
            if (filter.toArray) {
                return this.setFGBFilter(filter.toArray())
            } else if (Array.isArray(filter)) {

                let coo = filter.reduce((re, co) => {
                    re.x.push(co[0]);
                    re.y.push(co[1]);
                    return re;
                }, { x: [], y: [] })

                return this.setFGBFilter({
                    minX: Math.min.apply(null, coo.x),
                    minY: Math.min.apply(null, coo.y),
                    maxX: Math.max.apply(null, coo.x),
                    maxY: Math.max.apply(null, coo.y),
                })

            } else {
                this._options.fgbFilter = filter;
                this.setData(this._options.data)
            }
            return this;
        }
    }


export const addSourceTypeFGB = function (map: Map, cb?: () => void) {
    (<Map_>map).addSourceType('flatgeobuf', getSourceTypeFGB(<Map_>map), cb)
}

export default addSourceTypeFGB