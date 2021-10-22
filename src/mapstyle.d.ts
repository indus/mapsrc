declare const _default: {
    name: string;
    version: number;
    glyphs: string;
    sources: {
        maplibre: {
            url: string;
            type: string;
            maxzoom: number;
        };
    };
    layers: ({
        id: string;
        type: string;
        paint: {
            "background-color": string;
            "line-blur"?: undefined;
            "line-color"?: undefined;
            "line-width"?: undefined;
            "fill-color"?: undefined;
            "line-opacity"?: undefined;
        };
        layout?: undefined;
        source?: undefined;
        maxzoom?: undefined;
        minzoom?: undefined;
        "source-layer"?: undefined;
    } | {
        id: string;
        type: string;
        paint: {
            "line-blur": number;
            "line-color": string;
            "line-width": {
                stops: number[][];
            };
            "background-color"?: undefined;
            "fill-color"?: undefined;
            "line-opacity"?: undefined;
        };
        layout: {
            "line-cap": string;
            "line-join": string;
        };
        source: string;
        maxzoom: number;
        minzoom: number;
        "source-layer": string;
    } | {
        id: string;
        type: string;
        paint: {
            "fill-color": string;
            "background-color"?: undefined;
            "line-blur"?: undefined;
            "line-color"?: undefined;
            "line-width"?: undefined;
            "line-opacity"?: undefined;
        };
        source: string;
        "source-layer": string;
        layout?: undefined;
        maxzoom?: undefined;
        minzoom?: undefined;
    } | {
        id: string;
        type: string;
        paint: {
            "line-color": string;
            "line-width": {
                stops: number[][];
            };
            "line-opacity": {
                stops: number[][];
            };
            "background-color"?: undefined;
            "line-blur"?: undefined;
            "fill-color"?: undefined;
        };
        layout: {
            "line-cap": string;
            "line-join": string;
        };
        source: string;
        "source-layer": string;
        maxzoom?: undefined;
        minzoom?: undefined;
    })[];
};
export default _default;
