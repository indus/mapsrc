var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
let emptyGeoJSON = { "type": "FeatureCollection", "features": [] };
const getGeoJSONSource = (map) => {
  if (map._GeoJSONSource) {
    return map._GeoJSONSource;
  } else {
    map.style.addSource("$geojson", {
      "type": "geojson",
      "data": emptyGeoJSON
    });
    map._GeoJSONSource = map.style.getSource("$geojson").constructor;
    map.style.removeSource("$geojson");
    return map._GeoJSONSource;
  }
};
function reverse(array, n) {
  var t, j = array.length, i = j - n;
  while (i < --j)
    t = array[i], array[i++] = array[j], array[j] = t;
}
function identity(x) {
  return x;
}
function transform(transform2) {
  if (transform2 == null)
    return identity;
  var x0, y0, kx = transform2.scale[0], ky = transform2.scale[1], dx = transform2.translate[0], dy = transform2.translate[1];
  return function(input, i) {
    if (!i)
      x0 = y0 = 0;
    var j = 2, n = input.length, output = new Array(n);
    output[0] = (x0 += input[0]) * kx + dx;
    output[1] = (y0 += input[1]) * ky + dy;
    while (j < n)
      output[j] = input[j], ++j;
    return output;
  };
}
function topojson_decode(topology, o) {
  if (typeof o === "string")
    o = topology.objects[o];
  return o.type === "GeometryCollection" ? { type: "FeatureCollection", features: o.geometries.map(function(o2) {
    return feature(topology, o2);
  }) } : feature(topology, o);
}
function feature(topology, o) {
  var id = o.id, bbox = o.bbox, properties = o.properties == null ? {} : o.properties, geometry = object(topology, o);
  return id == null && bbox == null ? { type: "Feature", properties, geometry } : bbox == null ? { type: "Feature", id, properties, geometry } : { type: "Feature", id, bbox, properties, geometry };
}
function object(topology, o) {
  var transformPoint = transform(topology.transform), arcs = topology.arcs;
  function arc(i, points) {
    if (points.length)
      points.pop();
    for (var a = arcs[i < 0 ? ~i : i], k = 0, n = a.length; k < n; ++k) {
      points.push(transformPoint(a[k], k));
    }
    if (i < 0)
      reverse(points, n);
  }
  function point(p) {
    return transformPoint(p);
  }
  function line(arcs2) {
    var points = [];
    for (var i = 0, n = arcs2.length; i < n; ++i)
      arc(arcs2[i], points);
    if (points.length < 2)
      points.push(points[0]);
    return points;
  }
  function ring(arcs2) {
    var points = line(arcs2);
    while (points.length < 4)
      points.push(points[0]);
    return points;
  }
  function polygon(arcs2) {
    return arcs2.map(ring);
  }
  function geometry(o2) {
    var type = o2.type, coordinates;
    switch (type) {
      case "GeometryCollection":
        return { type, geometries: o2.geometries.map(geometry) };
      case "Point":
        coordinates = point(o2.coordinates);
        break;
      case "MultiPoint":
        coordinates = o2.coordinates.map(point);
        break;
      case "LineString":
        coordinates = line(o2.arcs);
        break;
      case "MultiLineString":
        coordinates = o2.arcs.map(line);
        break;
      case "Polygon":
        coordinates = polygon(o2.arcs);
        break;
      case "MultiPolygon":
        coordinates = o2.arcs.map(polygon);
        break;
      default:
        return null;
    }
    return { type, coordinates };
  }
  return geometry(o);
}
const getSourceTypeTOPO = (map) => class TopoJSONSource extends getGeoJSONSource(map) {
  constructor(id, _a, dispatcher, eventedParent) {
    var _b = _a, { data } = _b, options = __objRest(_b, ["data"]);
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
    if (typeof data === "string" || data instanceof String) {
      var req = new XMLHttpRequest();
      req.open("GET", data);
      req.responseType = "json";
      req.addEventListener("load", () => this.setData(req.response));
      req.send();
    } else if (data && data.type == "Topology") {
      this._options.data = data;
      let objects = this._options.topoFilter;
      if (Array.isArray(objects))
        objects = { "type": "GeometryCollection", "geometries": objects.map((id) => data.objects[id]) };
      if (!objects)
        objects = { "type": "GeometryCollection", "geometries": Object.values(data.objects) };
      var geojson = topojson_decode(data, objects);
      super.setData(geojson);
    } else {
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
const addSourceTypeGPBF = function(map, cb) {
  map.addSourceType("topojson", getSourceTypeTOPO(map), cb);
};
export { addSourceTypeGPBF, addSourceTypeGPBF as default, getSourceTypeTOPO };
