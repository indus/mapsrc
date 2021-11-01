export let emptyGeoJSON = { 'type': 'FeatureCollection', 'features': [] };
export const getGeoJSONSource = (map) => {
    if (map._GeoJSONSource) {
        return map._GeoJSONSource;
    }
    else {
        map.style.addSource('$geojson', {
            'type': 'geojson',
            'data': emptyGeoJSON
        });
        map._GeoJSONSource = map.style.getSource("$geojson").constructor;
        map.style.removeSource("$geojson");
        return map._GeoJSONSource;
    }
};
//# sourceMappingURL=utils.js.map