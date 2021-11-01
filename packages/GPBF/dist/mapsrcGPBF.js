import { emptyGeoJSON, getGeoJSONSource } from "@mapsrc/utils";
import { decode as geobuf_decode } from "geobuf";
import Pbf from "pbf";
export const getSourceTypeGPBF = (map) => class GeobufSource extends getGeoJSONSource(map) {
    constructor(id, { data, ...options }, dispatcher, eventedParent) {
        super(id, Object.assign(options, { data: emptyGeoJSON }), dispatcher, eventedParent);
        this.id = id;
        this.type = "geojson";
        this._options.data = data;
        this.setData(data);
    }
    setData(data) {
        if (typeof data === 'string' || data instanceof String) {
            var req = new XMLHttpRequest();
            req.open("GET", data);
            req.responseType = "arraybuffer";
            req.addEventListener("load", () => this.setData(req.response));
            req.send();
        }
        else if (data.byteLength != 0) {
            var geojson = geobuf_decode(new Pbf(data));
            super.setData(geojson);
        }
        else {
            console.error("GeobufSource expects a URL or a ArrayBuffer as 'data'");
        }
        return this;
    }
};
export const addSourceTypeGPBF = function (map, cb) {
    map.addSourceType('geobuf', getSourceTypeGPBF(map), cb);
};
export default addSourceTypeGPBF;
//# sourceMappingURL=mapsrcGPBF.js.map