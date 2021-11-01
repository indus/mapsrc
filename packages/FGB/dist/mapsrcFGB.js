import { emptyGeoJSON, getGeoJSONSource } from "@mapsrc/utils";
import { deserialize as flatgeobuf_deserialize } from "flatgeobuf/lib/mjs/geojson";
export const getSourceTypeFGB = (map) => class FlatgeobufSource extends getGeoJSONSource(map) {
    constructor(id, { data, ...options }, dispatcher, eventedParent) {
        super(id, Object.assign(options, { data: emptyGeoJSON }), dispatcher, eventedParent);
        this.id = id;
        this.type = "geojson";
        this._options.data = data;
        if (options.fgbFilter)
            this.setFGBFilter(options.fgbFilter);
        else
            this.setData(data);
    }
    setData(data) {
        if (this._options.fgbFilter ||
            data instanceof ReadableStream ||
            data instanceof Uint8Array) {
            let fc = emptyGeoJSON;
            let progressiv = this._options.fgbProgressiv;
            let filter = this._options.fgbFilter;
            let featureCount = 0;
            (async () => {
                for await (let feature of flatgeobuf_deserialize(data, filter, meta => {
                    if (progressiv > 0 && progressiv < 1)
                        progressiv = Math.ceil(meta.featuresCount * progressiv);
                })) {
                    fc.features.push(feature);
                    if (progressiv && !(++featureCount % progressiv)) {
                        super.setData(fc);
                    }
                }
                super.setData(fc);
            })();
        }
        else if (typeof data === 'string' || data instanceof String) {
            this._options.data = data;
            (async () => {
                const response = await fetch(data);
                this.setData(response.body);
            })();
        }
        else {
            console.error("FlatgeobufSource expects a URL, a ReadableStream or a Uint8Array as 'data'");
        }
        return this;
    }
    setFGBFilter(filter) {
        if (filter.toArray) {
            return this.setFGBFilter(filter.toArray());
        }
        else if (Array.isArray(filter)) {
            let coo = filter.reduce((re, co) => {
                re.x.push(co[0]);
                re.y.push(co[1]);
                return re;
            }, { x: [], y: [] });
            return this.setFGBFilter({
                minX: Math.min.apply(null, coo.x),
                minY: Math.min.apply(null, coo.y),
                maxX: Math.max.apply(null, coo.x),
                maxY: Math.max.apply(null, coo.y),
            });
        }
        else {
            this._options.fgbFilter = filter;
            this.setData(this._options.data);
        }
        return this;
    }
};
export const addSourceTypeFGB = function (map, cb) {
    map.addSourceType('flatgeobuf', getSourceTypeFGB(map), cb);
};
export default addSourceTypeFGB;
//# sourceMappingURL=mapsrcFGB.js.map