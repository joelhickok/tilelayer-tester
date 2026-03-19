import {createEffect, createSignal, For} from 'solid-js'
import toast, {Toaster} from 'solid-toast'
import uniq from 'lodash-es/uniq'

import './App.css'
import LeafletMap from './LeafletMap'
import exampleUrls from './example-urls'

export default function App() {
    const base = import.meta.env.BASE_URL
    const params = new URLSearchParams(window.location.search)
    const paramExample = () => params.get('example') || exampleUrls[2].url

    const [url, setUrl] = createSignal<string>(paramExample() || exampleUrls[0].url)
    const [history, setHistory] = createSignal<string[]>([])

    const local = localStorage.getItem('history')
    if (local) {
        setHistory(JSON.parse(local))
    }

    if (paramExample()) {
        const example = exampleUrls.find(exUrl => exUrl.url === paramExample())
        if (example) {
            setUrl(example.url)
        }
    }

    const assignUrl = (ex: ExampleURL) => {
        processUrl(ex.url)
        const params = new URLSearchParams()
        params.append('example', ex.url)
        window.location.assign(`${window.location.origin}${base}?${params}`)
    }

    function isValidUrl(string: string) {
        try {
            const url = new URL(string)
            if (url.protocol === 'http:' || url.protocol === 'https:') {
                try {
                    new URL(string)
                    return true
                } catch (err) {
                    return false
                }
            }
        } catch (err) {
            return false
        }
    }

    const processUrl = (url: string) => {
        if (!isValidUrl(url)) {
            toast.error('Invalid URL.  Ensure the URL contains all valid URL components.', {
                duration: 1000 * 4,
            })
            return
        }

        if (!url.includes('{z}') || !url.includes('{x}') || !url.includes('{y}')) {

            toast.error('Invalid URL.  Must include the symbols: "{x}", "{y}", and "{z}".', {
                duration: 1000 * 4,
            })
            return
        }

        const newHistory = [
            url,
            ...history()
        ]

        const filtered = uniq(newHistory)

        setHistory(filtered)

        if (history().length) {
            localStorage.setItem('history', JSON.stringify(history()))
        }

        setUrl(url)
    }

    return (
        <div class="app ">

            <Toaster/>

            <div class="header card">

                <div class="flex items-end justify-between pb-2 mb-2 separator-bottom">

                    <div>
                        <p class="text-2xl font-bold text-violet-800">Tilelayer Status Tester</p>
                        <p class="text-gray-500">aka "xyz" layers</p>
                    </div>

                    <div class="text-violet-800">
                        Test to see if a tilelayer is valid and online.
                    </div>

                </div>

                <label for="urlInput">
                    Enter a URL to test:
                </label>

                <input id="urlInput"
                       class="border border-gray-300 mt-1 rounded-xl px-4 py-1 w-full shadow-sm"
                       type="text"
                       onInput={(e) => processUrl(e.target.value)}
                       value={url()}
                />

            </div>

            <div class="p-4 grow flex gap-4 h-100">

                <div id="info-bar" class="text-sm flex flex-col gap-4 h-full overflow-hidden"
                     style={{'max-width': '400px;'}}
                >

                    <div class="card">
                        <div class="subtitle">
                            Test existing XYZ layer:
                        </div>
                        <For each={exampleUrls}>
                            {(exampleUrl, index) => (
                                <a class="text-violet-800 block separator-bottom py-1"
                                   onClick={() => assignUrl(exampleUrl)}
                                >
                                    {exampleUrl.label}
                                </a>
                            )}
                        </For>
                    </div>

                    <div class="card grow flex flex-col h-100 overflow-hidden">

                        <div class="flex justify-between">
                            <div class="subtitle">
                                History:
                            </div>
                            <div class="font-light text-sm text-gray-500">
                                rollover to see full URL
                            </div>
                        </div>

                        <div class="grow overflow-auto">
                            <For each={history()}>
                                {(historyItem, index) => (
                                    <div title={historyItem}
                                         class="overflow-hidden text-ellipsis border-b border-b-zinc-300 py-2"
                                         onClick={() => assignUrl({url: historyItem})}
                                    >
                                        {historyItem}
                                    </div>
                                )}
                            </For>
                        </div>

                    </div>

                </div>

                <div class="grow h-full card">
                    <LeafletMap url={url}/>
                </div>

            </div>

        </div>
    )
}