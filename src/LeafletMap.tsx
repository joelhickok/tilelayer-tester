import {Map, TileLayer} from 'leaflet'
import {onMount, onCleanup, createEffect, createSignal, type Accessor} from 'solid-js'
import toast from 'solid-toast'
import throttle from 'lodash-es/throttle'
import './Map.css'

export default function LeafletMap(props: { url: Accessor<string> }) {

    const [map, setMap] = createSignal<Map | null>(null)
    const [layer, setLayer] = createSignal<TileLayer | null>(null)

    const addLayer = (url: string) => {
        if (map() !== null) {
            setLayer(new TileLayer(url, {
                    attribution: 'Most vendors require attribution.  TESTING PURPOSE ONLY.',
                })
            )

            // @ts-expect-error: map accessor cannot be typed correctly
            layer()?.addTo(map())

            // if a tile request fails, there will be several or more, so throttle the result
            // rather than display too many toast messages
            const throttledErrorFunc = throttle(() => {
                // https://github.com/ardeora/solid-toast
                toast.error('Failed to load tiles.  Likely an invalid URL.', {
                    duration: 1000 * 10,
                })
            }, 3000)

            layer()?.on('tileerror', throttledErrorFunc)
        }
    }

    createEffect(() => {
        if (layer()) {
            layer()?.setUrl(props.url())
        }
    })

    onMount(() => {
        const zoom = 7
        const center = {lat: 38.90385833966778, lng: -105.77087402343751}
        const map = new Map('map-canvas', {
            center,
            zoom,
        })

        // map.on('moveend zoomend', () => {
        //     console.log(map.getZoom(), map.getCenter())
        // })

        setMap(map)
        addLayer(props.url())
    })

    onCleanup(() => {
        if (map() !== null) {
            map()?.remove()
        }
    })

    return (
        <div id="map-canvas"></div>
    )
}