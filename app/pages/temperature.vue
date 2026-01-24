<template>
    <div>
        <h1 class="text-2xl font-extrabold mb-5 mt-3">Suhu dan Kelembapan</h1>
        <div class="flex w-full flex-col gap-4" v-show="temperature == 0">
            <div class="skeleton h-32 w-full"></div>
            <div class="skeleton h-4 w-28"></div>
            <div class="skeleton h-4 w-full"></div>
            <div class="skeleton h-4 w-full"></div>
        </div>
        <div v-show="temperature > 0">
            <div class="card card-side bg-base-100 shadow-xl border border-base-200 max-w-md">
                <div class="card-body">
                    <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider">Saat Ini</h3>
                    <div class="space-y-1">
                        <p class="text-lg font-medium text-base-content/70">
                            Suhu: <span class="text-base-content font-bold">{{ temperature }}°C</span>
                        </p>
                        <p class="text-lg font-medium text-base-content/70">
                            Kelembapan: <span class="text-base-content font-bold">{{ humidity }}%</span>
                        </p>
                        <p class="text-lg font-medium text-base-content/70">
                            Suhu AC: <span class="text-base-content font-bold">{{ Math.round(temperatureAc) }}°C</span>
                        </p>
                    </div>
                </div>
                <div class="flex items-center pr-8">
                    <div class="w-16 h-16 rounded-full border-4 border-blue-100 flex items-center justify-center bg-blue-50/50">
                        <svg xmlns="http://www.w3.org/2000/svg" 
                            class="w-8 h-8 text-blue-500" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            stroke-width="2.5" 
                            stroke-linecap="round" 
                            stroke-linejoin="round">
                            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                            <path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                            <path d="M16 19.5c0 1.93-1.57 3.5-3.5 3.5S9 21.43 9 19.5c0-2.5 3.5-6.5 3.5-6.5s3.5 4 3.5 6.5z" />
                        </svg>
                    </div>
                </div>
            </div>
            <div class="card card-side bg-base-100 shadow-xl border border-base-200 max-w-md mt-3">
                <div class="card-body">
                    <Line ref="chartRef" :data="chartData" :options="chartOptions" />
                </div>
            </div>
            <div class="card bg-base-100 shadow-xl border border-base-200 max-w-md mt-3">
                <div class="card-body">
                    <h2 class="card-title text-lg font-bold mb-4">Kontrol AC</h2>
                    <div class="space-y-4">
                        <div class="form-control w-full">
                            <select class="select select-bordered w-full focus:select-primary">
                                <option disabled selected>Pilih Mode</option>
                                <option>Cool</option>
                                <option>Dry</option>
                                <option>Fan Only</option>
                                <option>Heat</option>
                            </select>
                        </div>
                        <div class="form-control w-full">
                            <input type="range" min="15" max="30" value="25" class="range range-info" step="1" />
                            <div class="flex justify-between px-2.5 mt-2 text-xs">
                                <span>15</span>
                                <span>30</span>
                            </div>
                        </div>
                        <div class="form-control flex justify-center">
                            <label class="label cursor-pointer justify-center gap-4">
                            <span class="label-text font-bold text-lg">OFF</span>
                            <input type="checkbox" class="toggle toggle-info toggle-lg" checked />
                            <span class="label-text font-bold text-lg">ON</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card bg-base-100 shadow-xl border border-base-200 max-w-2xl mx-auto mt-3 sm:mb-[100px]">
                <div class="card-body">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="card-title text-xl font-bold">Logs</h2>
                    </div>
                    <div class="overflow-x-auto rounded-lg border border-base-200">
                        <table class="table table-zebra w-full">
                            <thead class="bg-base-200">
                                <tr>
                                    <th>Waktu</th>
                                    <th>Mode</th>
                                    <th>Suhu</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="log in temperatureData">
                                    <td class="text-sm">{{ log.time.split(':').slice(0, 2).join(':') }}</td>
                                    <td><div class="badge badge-ghost badge-sm">Cool</div></td>
                                    <td class="font-mono">{{ log.temperature }}°C</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { Line } from 'vue-chartjs'
    import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js'
    import { ref as dbRef, get } from 'firebase/database'
    import { ref } from 'vue'
    import { format } from 'date-fns'

    const temperature = ref(0)
    const humidity = ref(0)
    const temperatureAc = ref(0)
    const temperatureData = ref([])
    const db = useDatabase()
    const realtimeRef = dbRef(db, 'server_room/realtime')
    const realtimeData = useDatabaseObject(realtimeRef)
    const chartRef = ref(null)

    const logsRef = dbRef(db, 'server_room/history/2026-01-22')
    const snapshot = await get(logsRef)
    let logs = Object.entries(snapshot.val()).map(([key, value]) => ({ ...value, time: key })).sort((a, b) => b.time.localeCompare(a.time))
    logs = logs.slice(0, 10);
    temperatureData.value = logs
    logs = [...logs].reverse();
    const labels = logs.map(item => {
        return item.time.split(':').slice(0, 2).join(':')
    })

    watch(realtimeData, (data) => {
        if (data) {
            temperature.value = data.temperature || 0
            humidity.value = data.humidity || 0

            fetch('https://nlimabugvzcqlmhdmcrr.supabase.co/functions/v1/temperature', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': 'sb_publishable_UdHV07mhbEX40X4myCAwKQ_sXUGc-Tn',
                    'Authorization': 'Bearer sb_publishable_UdHV07mhbEX40X4myCAwKQ_sXUGc-Tn'
                },
                body: JSON.stringify({
                    temperature: temperature.value,
                    humidity: humidity.value
                })
            }).then(res => {
                return res.json()
            }).then(data => {
                temperatureAc.value = data.temperatureAc
            });

            temperatureData.value.unshift({
                time: format(new Date(data.timestamp * 1000 - (7 * 60 * 60 * 1000)), 'HH:mm'),
                temperature: temperature.value
            })
            const chart = chartRef.value.chart
            const labels = chart.data.labels
            const label = format(new Date((data.timestamp * 1000) - (7 * 60 * 60 * 1000)), 'HH:mm')
            labels.push(label)
            chart.data.datasets[0].data.push(temperature.value)
            chart.data.datasets[1].data.push(humidity.value)
            if (labels.length > 15) {
                labels.shift()
                chart.data.datasets[0].data.shift()
                chart.data.datasets[1].data.shift()
            }
            chart.update()
        }
    }, { deep: true })

    ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)
    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Suhu (°C)',
            data: [24, 25, 24, 26, 25, 24, 25, 24, 26, 25],
            borderColor: '#3b82f6',
            backgroundColor: '#3b82f6',
            yAxisID: 'ySuhu',
            tension: 0.4,
            pointRadius: 4
        }, {
            label: 'Kelembapan (%)',
            data: [75, 78, 80, 82, 80, 75, 78, 80, 82, 80],
            borderColor: '#93c5fd',
            backgroundColor: '#93c5fd',
            yAxisID: 'yKelembapan',
            tension: 0.4,
            pointRadius: 4
        }]
    }
    
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            ySuhu: {
                type: 'linear',
                display: true,
                position: 'left',
                title: { display: true, text: 'Suhu (°C)' },
                suggestedMin: 20,
                suggestedMax: 30
            },
            yKelembapan: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: { drawOnChartArea: false },
                title: { display: true, text: 'Kelembapan (%)' },
                suggestedMin: 60,
                suggestedMax: 100
            }
        }
    }
</script>