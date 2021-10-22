import './style.css';
import maplibregl from "maplibre-gl";
import mapstyle from "./mapstyle";
import addSourceTypeFGB from "@mapsrc/fgb";
import addSourceTypeGPBF from "@mapsrc/gpbf";
import addSourceTypeTopo from "@mapsrc/topo";
var map = new maplibregl.Map({
    container: 'map',
    style: mapstyle,
    center: [-40, 50],
    zoom: 0
}).fitBounds([
    [-110, 30],
    [25, 65]
]);
map.on("load", () => {
    //FlatGeobuf
    addSourceTypeFGB(map, () => { console.log("FGB ready"); });
    map.addLayer({
        'id': 'us-counties',
        'type': 'fill',
        'source': {
            'type': 'flatgeobuf',
            'data': './data/us-counties.fgb',
            'fgbProgressiv': .1,
            'fgbFilter': [[-100, 35], [-50, 55]]
        },
        'layout': {},
        'paint': {
            'fill-color': '#0FD',
            'fill-opacity': 0.5
        }
    });
    map.addLayer({
        'id': 'us-counties-lines',
        'type': 'line',
        'source': "us-counties",
        'paint': {
            'line-color': '#0FD'
        }
    });
    // GeoBuffer
    addSourceTypeGPBF(map, () => { console.log("GPBF ready"); });
    map.addLayer({
        'id': 'de-counties',
        'type': 'fill',
        'source': {
            'type': 'geobuf',
            'data': './data/de-counties.pbf'
        },
        'layout': {},
        'paint': {
            'fill-color': '#FD0',
            'fill-opacity': 0.5
        }
    });
    map.addLayer({
        'id': 'de-counties-lines',
        'type': 'line',
        'source': "de-counties",
        'paint': {
            'line-color': '#FD0'
        }
    });
    //TopoJSON
    addSourceTypeTopo(map, () => { console.log("TOPO ready"); });
    map.addLayer({
        'id': 'uk-counties',
        'type': 'fill',
        'source': {
            'type': 'topojson',
            'data': './data/uk-counties.json',
            'topoFilter': "GBR_adm2"
        },
        'layout': {},
        'paint': {
            'fill-color': '#D0F',
            'fill-opacity': 0.5
        }
    });
    map.addLayer({
        'id': 'uk-counties-lines',
        'type': 'line',
        'source': "uk-counties",
        'paint': {
            'line-color': '#D0F'
        }
    });
    // Labels
    map.addSource('points', {
        'type': 'geojson',
        'data': {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [-80, 39]
                    },
                    'properties': {
                        'title': 'FlatGeobuf (filtered)',
                        'color': '#088'
                    }
                },
                {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [-3, 53]
                    },
                    'properties': {
                        'title': 'TopoJSON',
                        'color': '#808'
                    }
                },
                {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [10, 50]
                    },
                    'properties': {
                        'title': 'Geobuf',
                        'color': '#880'
                    }
                }
            ]
        }
    });
    map.addLayer({
        'id': 'points',
        'type': 'symbol',
        'source': 'points',
        'layout': {
            'text-field': ['get', 'title'],
            'text-font': [
                'Open Sans Semibold'
            ],
            'text-size': ["interpolate", ["linear"], ["zoom"], 0, 9, 10, 32],
            'text-anchor': 'center'
        }, 'paint': {
            "text-color": ['get', 'color'],
            'text-halo-color': '#DDD',
            "text-halo-width": 2,
            "text-halo-blur": 2
        }
    });
});
//# sourceMappingURL=main.js.map