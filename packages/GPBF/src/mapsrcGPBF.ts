import { emptyGeoJSON, getGeoJSONSource, Map_, GeoJSONSourceClass } from "@mapsrc/utils"
import type { Map } from "maplibre-gl"

import { decode as geobuf_decode } from "geobuf"
import Pbf from "pbf"

export const getSourceTypeGPBF = (map: Map): GeoJSONSourceClass =>
  class GeobufSource extends getGeoJSONSource(<Map_>map) {

    constructor(id: string, { data, ...options }: any, dispatcher: any, eventedParent: any) {
      super(id, Object.assign(options, { data: emptyGeoJSON }), dispatcher, eventedParent);
      this.id = id;
      this.type = "geojson";
      this._options.data = data;
      this.setData(data);
    }

    setData(data: string): this {
      if (typeof data === 'string' || <any>data instanceof String) {
        var req = new XMLHttpRequest();
        req.open("GET", <string>data);
        req.responseType = "arraybuffer";
        req.addEventListener("load", () => this.setData(req.response));
        req.send();
      } else if ((<ArrayBuffer>data).byteLength != 0) {
        var geojson = <any>geobuf_decode(new Pbf(data));
        super.setData(geojson)
      } else {
        console.error("GeobufSource expects a URL or a ArrayBuffer as 'data'")
      }
      return this

    }
  }


export const addSourceTypeGPBF = function (map: Map, cb?: () => void): void {
  (<Map_>map).addSourceType('geobuf', getSourceTypeGPBF(<Map_>map), cb)
}

export default addSourceTypeGPBF