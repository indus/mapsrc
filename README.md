# maprc

`mapscr` allows the use of custom source formats in [maplibre-gl-js](https://github.com/maplibre/maplibre-gl-js) / [mapbox-gl-js](https://github.com/mapbox/mapbox-gl-js) maps. [FlatGeobuf](https://github.com/flatgeobuf/flatgeobuf), [Geobuf](https://github.com/mapbox/geobuf) and [TopoJSON](https://github.com/topojson/topojson) are supported. All formats are first converted to GeoJSON and then loaded via the existing API. The additional effort in this intermediate step can be justified by the significantly smaller file sizes during loading.

The provided functions are not yet available on NPM because they are still experimental and subject to change.

## Demo
[Example with FlatGeobuf, Geobuf and TopoJSON Sources](https://mapsrc.js.org/)   
([*source*](https://github.com/indus/mapsrc/blob/main/src/main.ts#L25-L104))


## Install

```
pnpm i https://github.com/indus/mapsrc
```

## Usage

### FlatGeobuf

```js
import addSourceTypeFGB from "mapsrc/packages/FGB";

let map = new maplibregl.Map({
  //<map_options>
});

map.on("load", () => {
  // add the custom source type once before using it
  addSourceTypeFGB(map /*, () => { console.log("FGB ready")}*/);

  map.addSource("us-counties", {
    type: "flatgeobuf",
    data: "./data/us-counties.fgb",
    fgbProgressiv: 0.1,                     // optional
    fgbFilter: [[-100, 35],[-50, 55]]       // optional
  });
});
```

- `fgbProgressiv` will update the map in steps during downloads. A number between 0 and 1 will be taken as a percentage of the full feater count (e.g. 0.25 wil update the map when 25%, 50%, 75% and 100% of the features are downloaded). For a number greater than 1, the map gets updated each time that many new features are loaded.  
- `fgbFilter` A spatial filter (see the [flatgeobuf example](https://flatgeobuf.org/examples/leaflet/filtered.html)). It takes a [min-max object](https://github.com/flatgeobuf/flatgeobuf/blob/master/examples/leaflet/filtered.html#L56-L61) as used by the flatgeobuf library or a maplibre/mapbox [LngLatBounds](https://docs.mapbox.com/mapbox-gl-js/api/geography/#lnglatbounds) object or array.

### Geobuffer

```js
import addSourceTypeGPBF from "mapsrc/packages/GPBF";

let map = new maplibregl.Map({
  //<map_options>
});

map.on("load", () => {
  // add the custom source type once before using it
  addSourceTypeGPBF(map /*, () => { console.log("GPBF ready")}*/);

  map.addSource("de-counties", {
    type: "geobuf",
    data: "./data/de-counties.pbf"
  });
});
```

### TopoJSON

```js
import addSourceTypeTOPO from "mapsrc/packages/GPBF";

let map = new maplibregl.Map({
  //<map_options>
});

map.on("load", () => {
  // add the custom source type once before using it
  addSourceTypeTOPO(map /*, () => { console.log("TOPO ready")}*/);

  map.addSource("uk-counties", {
    type: "topojson",
    data: "./data/uk-counties.json",
    topoFilter: "GBR_adm2"                  //optional
  });
});
```

- `topoFilter` takes the place of the property [`object`](https://github.com/topojson/topojson-client/blob/master/README.md#feature) in the functions of the topojson library.
> ... If the specified *object* is a string, it is treated as topology.objects[*object*]. Then, if the object is a GeometryCollection, a FeatureCollection is returned, and each geometry in the collection is mapped to a Feature. ...
