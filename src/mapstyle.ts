export default {
    "name": "Gray",
    "version": 8,
    "glyphs": "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
    "sources": {
        "maplibre": {
            "url": "https://demotiles.maplibre.org/tiles/tiles.json",
            "type": "vector"
        }
    },
    "layers": [
        {
            "id": "background",
            "type": "background",
            "paint": {
                "background-color": "#777"
            }
        },
        {
            "id": "coastline",
            "type": "line",
            "paint": {
                "line-blur": 0.5,
                "line-color": "#ccc",
                "line-width": {
                    "stops": [[0,2],[6,6],[14,9],[22,18]]
                }
            },
            "layout": {
                "line-cap": "round",
                "line-join": "round"
            },
            "source": "maplibre",
            "maxzoom": 24,
            "minzoom": 0,
            "source-layer": "countries"
        },
        {
            "id": "countries-fill",
            "type": "fill",
            "paint": {
                "fill-color":"#888"
            },
            "source": "maplibre",
            "source-layer": "countries"
        },
        {
            "id": "countries-boundary",
            "type": "line",
            "paint": {
                "line-color": "#999",
                "line-width": {
                    "stops": [[1,1],[6,2],[14,6],[22,12]]
                },
                "line-opacity": {
                    "stops": [[3,0.5],[6,1]]
                }
            },
            "layout": {
                "line-cap": "round",
                "line-join": "round"
            },
            "source": "maplibre",
            "source-layer": "countries"
        }
    ]
}
