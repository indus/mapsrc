import { emptyGeoJSON, getGeoJSONSource } from "@mapsrc/utils";
//@ts-ignore
import { default as topojson_decode } from "topojson-client/src/feature";
export const getSourceTypeTOPO = (map) => class TopoJSONSource extends getGeoJSONSource(map) {
    constructor(id, { data, ...options }, dispatcher, eventedParent) {
        super(id, Object.assign(options, { data: emptyGeoJSON }), dispatcher, eventedParent);
        this.id = id;
        this.type = "geojson";
        this._options.data = data;
        if (options.topoFilter)
            this.setTOPOFilter(options.topoFilter);
        else
            this.setData(data);
    }
    setData(data) {
        if (typeof data === 'string' || data instanceof String) {
            var req = new XMLHttpRequest();
            req.open("GET", data);
            req.responseType = "json";
            req.addEventListener("load", () => this.setData(req.response));
            req.send();
        }
        else if (data && data.type == "Topology") {
            this._options.data = data;
            let objects = this._options.topoFilter;
            if (Array.isArray(objects))
                objects = { "type": "GeometryCollection", "geometries": objects.map(id => data.objects[id]) };
            if (!objects)
                objects = { "type": "GeometryCollection", "geometries": Object.values(data.objects) };
            var geojson = topojson_decode(data, objects);
            super.setData(geojson);
        }
        else {
            console.error("TopoJSONSource expects a URL or a TopoJSON as 'data'");
        }
        return this;
    }
    setTOPOFilter(filter) {
        this._options.fgbFilter = filter;
        this.setData(this._options.data);
        return this;
    }
};
export const addSourceTypeGPBF = function (map, cb) {
    map.addSourceType('topojson', getSourceTypeTOPO(map), cb);
};
export default addSourceTypeGPBF;
//# sourceMappingURL=mapsrcTOPO.js.map