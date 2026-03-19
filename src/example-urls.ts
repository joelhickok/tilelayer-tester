export const urls: ExampleURL[] = [
    {
        label: 'Esri World Street Map',
        url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    },
    {
        label: 'Esri World Imagery',
        url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    },
    {
        label: 'Google Terrain',
        url: 'http://mt.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    },
    {
        label: 'OSM Humanitarian',
        url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    },
]

export default urls