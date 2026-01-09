<template>
    <div>
        <div class="flex justify-between items-center mb-5 mt-3">
            <h1 class="text-2xl font-extrabold">Dashboard</h1>
            <span class="text-xs text-gray-500" v-show="timestamp != 0">{{ formattedDate(timestamp) }}</span>
        </div>
        <div class="flex w-full flex-col gap-4" v-show="timestamp == 0">
            <div class="skeleton h-32 w-full"></div>
            <div class="skeleton h-4 w-28"></div>
            <div class="skeleton h-4 w-full"></div>
            <div class="skeleton h-4 w-full"></div>
        </div>
        <div v-show="timestamp != 0">
            <NuxtLink to="/temperature" class="card card-side bg-base-100 shadow-xl border border-base-200 max-w-md hover:border-primary transition-all duration-300">
                <div class="card-body">
                    <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider">Saat Ini</h3>
                    <h2 class="card-title text-xl font-bold">Suhu & Kelembapan</h2>
                    <div class="space-y-1">
                        <p class="text-lg font-medium text-base-content/70">
                            Suhu: <span class="text-base-content font-bold">{{ temperature }}°C</span>
                        </p>
                        <p class="text-lg font-medium text-base-content/70">
                            Kelembapan: <span class="text-base-content font-bold">{{ humidity }}%</span>
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
            </NuxtLink>
            <NuxtLink to="/power" class="card card-side bg-base-100 shadow-xl border border-base-200 max-w-md hover:border-primary transition-all duration-300 mt-3">
                <div class="card-body">
                    <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider">Saat Ini</h3>
                    <h2 class="card-title text-xl font-bold">Konsumsi Daya</h2>
                    <div class="space-y-1">
                        <p class="text-lg font-medium text-base-content/70">
                            Power: <span class="text-base-content font-bold">{{ power }} Watt</span>
                        </p>
                        <p class="text-lg font-medium text-base-content/70">
                            Voltase: <span class="text-base-content font-bold">{{ voltage }} Volt</span>
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
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                    </div>
                </div>
            </NuxtLink>
            <NuxtLink to="/leak" class="card card-side bg-base-100 shadow-xl border border-base-200 max-w-md hover:border-primary transition-all duration-300 mt-3">
                <div class="card-body">
                    <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider">Saat Ini</h3>
                    <h2 class="card-title text-xl font-bold">Kebocoran Air</h2>
                    <div class="space-y-1">
                        <div class="badge badge-soft badge-accent text-lg" v-if="!leak">Aman</div>
                        <div class="badge badge-soft badge-error text-lg" v-if="leak">Bocor</div>
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
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" v-if="false" /> <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                        </svg>
                    </div>
                </div>
            </NuxtLink>
            <div class="card card-side bg-base-100 shadow-xl border border-base-200 max-w-md mt-3 sm:mb-[100px]">
                <div class="card-body">
                    <Line ref="chartRef" :data="chartData" :options="chartOptions" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { Line } from 'vue-chartjs'
    import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js'
    import { ref, watch } from 'vue'
    import { ref as dbRef, get } from 'firebase/database'
    import { format } from 'date-fns'

    const db = useDatabase()
    const realtimeRef = dbRef(db, 'server_room/realtime')
    const realtimeData = useDatabaseObject(realtimeRef)
    const timestamp = ref(0)
    const temperature = ref(0)
    const humidity = ref(0)
    const power = ref(0)
    const voltage = ref(0)
    const leak = ref(false)
    const chartRef = ref(null)

    const logsRef = dbRef(db, 'server_room/history/2026-01-09')
    const snapshot = await get(logsRef)
    let logs = Object.entries(snapshot.val()).map(([key, value]) => ({ ...value, time: key })).sort((a, b) => b.time.localeCompare(a.time))
    logs = logs.slice(0, 10);
    logs = [...logs].reverse();
    const labels = logs.map(item => {
        return item.time.split(':').slice(0, 2).join(':')
    })
    const temperatureData = logs.map(item => item.temperature);
    const powerData = logs.map(item => item.power);
    const leakData = logs.map(item => item.leak ? 1 : 0);

    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Suhu (°C)',
            data: [24, 25, 24, 26, 25, 24, 25, 24, 26, 25],
            borderColor: '#3b82f6',
            backgroundColor: '#3b82f6',
            yAxisID: 'y',
            tension: 0.4
        }, {
            label: 'Konsumsi Daya (Watt)',
            data: powerData,
            borderColor: '#f59e0b',
            backgroundColor: '#f59e0b',
            yAxisID: 'y1',
            tension: 0.4
        }, {
            label: 'Status Kebocoran',
            data: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0], 
            borderColor: '#ef4444',
            backgroundColor: '#ef4444',
            yAxisID: 'y',
            stepped: true,
        }]
    }

    watch(realtimeData, (data) => {
        if (data) {
            timestamp.value = data.timestamp
            temperature.value = data.temperature || 0
            humidity.value = data.humidity || 0
            power.value = data.power || 0
            voltage.value = data.voltage || 0
            leak.value = data.leak || false

            const chart = chartRef.value.chart
            const labels = chart.data.labels
            const label = format(new Date((data.timestamp * 1000) - (7 * 60 * 60 * 1000)), 'HH:mm')
            labels.push(label)
            chart.data.datasets[0].data.push(temperature.value)
            chart.data.datasets[1].data.push(power.value)
            chart.data.datasets[2].data.push(leak.value ? 1 : 0)
            if (labels.length > 15) {
                labels.shift()
                chart.data.datasets[0].data.shift()
                chart.data.datasets[1].data.shift()
                chart.data.datasets[2].data.shift()
            }
            chart.update()
        }
    }, { deep: true })

    const formattedDate = (ts) => {
        const date = new Date((ts * 1000) - (7 * 60 * 60 * 1000))
        return format(date, 'dd/MM/yyyy HH:mm')
    }

    ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)
    const chartOptions = {
        plugins: {
            legend: { display: false }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: { display: true, text: 'Suhu' }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: { drawOnChartArea: false },
                title: { display: true, text: 'Daya' }
            }
        }
    }
</script>