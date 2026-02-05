<template>
    <div>
        <h1 class="text-2xl font-extrabold mb-5 mt-3">Konsumsi Daya</h1>
        <div class="card card-side bg-base-100 shadow-xl border border-base-200 max-w-md">
            <div class="card-body">
                <h3 class="text-sm font-semibold text-base-content/50 uppercase tracking-wider">Saat Ini</h3>
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
                <div class="w-16 h-16 rounded-full border-4 border-yellow-100 flex items-center justify-center bg-yellow-50/50">
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        class="w-8 h-8 text-yellow-500" 
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
        </div>
        <div class="card card-side bg-base-100 shadow-xl border border-base-200 max-w-md mt-3">
            <div class="card-body">
                <Line ref="chartRef" :data="chartData" :options="chartOptions" />
            </div>
        </div>
        <div class="card bg-base-100 shadow-xl border border-base-200 max-w-md mt-3 sm:mb-[100px]">
            <div class="card-body">
                <h2 class="card-title text-xl font-bold mb-2">Perkiraan Kebutuhan Daya</h2>
                <div class="space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-base-content/60 text-sm">Estimasi 1 jam lagi</span>
                        <span class="font-mono font-bold text-primary">{{ powerHour.toFixed(2) }} KW</span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-base-content/60 text-sm">Estimasi 24 jam lagi</span>
                        <span class="font-mono font-bold text-primary">{{ (powerHour * 24).toFixed(2) }} KW</span>
                    </div>
                    <div class="divider my-1"></div>
                    <div class="flex justify-between items-center bg-base-200 p-3 rounded-lg">
                        <span class="font-semibold text-sm">Estimasi biaya</span>
                        <span class="font-bold text-lg text-success">Rp  {{ new Intl.NumberFormat("id-ID", {minimumFractionDigits: 2, maximumFractionDigits: 2}).format((powerHour * 24 * 1700).toFixed(2)) }}</span>
                    </div>
                </div>
                <div class="card-actions justify-end mt-2">
                    <p class="text-[10px] text-base-content/40 italic">
                        *Berdasarkan tarif listrik rata-rata saat ini
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref as dbRef, get } from 'firebase/database'
    import { Line } from 'vue-chartjs'
    import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js'
    ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)
    import { format } from 'date-fns'

    const power = ref(0)
    const voltage = ref(0)
    const powerHour = ref(0)
    const db = useDatabase()
    const realtimeRef = dbRef(db, 'server_room/realtime')
    const realtimeData = useDatabaseObject(realtimeRef)
    const chartRef = ref(null)

    const logsRef = dbRef(db, 'server_room/history/2026-01-22')
    const snapshot = await get(logsRef)
    let logs = Object.entries(snapshot.val()).map(([key, value]) => ({ ...value, time: key })).sort((a, b) => b.time.localeCompare(a.time))
    logs = logs.slice(0, 10);
    logs = [...logs].reverse();
    const labels = logs.map(item => {
        return item.time.split(':').slice(0, 2).join(':')
    })

    watch(realtimeData, (data) => {
        if (data) {
            power.value = data.power.toFixed(2) || 0
            voltage.value = data.voltage.toFixed(2) || 0

            fetch('https://nlimabugvzcqlmhdmcrr.supabase.co/functions/v1/power', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': 'sb_publishable_UdHV07mhbEX40X4myCAwKQ_sXUGc-Tn',
                    'Authorization': 'Bearer sb_publishable_UdHV07mhbEX40X4myCAwKQ_sXUGc-Tn'
                },
                body: JSON.stringify({
                    power: power.value
                })
            }).then(res => {
                return res.json()
            }).then(data => {
                powerHour.value = data.power / 1000
            })

            const chart = chartRef.value.chart
            const labels = chart.data.labels
            const label = format(new Date((data.timestamp * 1000) - (7 * 60 * 60 * 1000)), 'HH:mm')
            labels.push(label)
            chart.data.datasets[0].data.push(power.value)
            chart.data.datasets[1].data.push(voltage.value)
            if (labels.length > 15) {
                labels.shift()
                chart.data.datasets[0].data.shift()
                chart.data.datasets[1].data.shift()
            }
            chart.update()
        }
    })

    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Power',
            data: [1268, 1260, 1261, 1270, 1265, 1265, 1263, 1265, 1260, 1261],
            borderColor: '#F1B100',
            backgroundColor: '#F1B100',
            yAxisID: 'yPower',
            tension: 0.4,
            pointRadius: 4
        }, {
            label: 'Voltase (%)',
            data: [226, 220, 221, 227, 225, 223, 221, 220, 229, 225],
            borderColor: '#FDE68A',
            backgroundColor: '#FDE68A',
            yAxisID: 'yVoltase',
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
            yPower: {
                type: 'linear',
                display: true,
                position: 'left',
                title: { display: true, text: 'Daya' }
            },
            yVoltase: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: { drawOnChartArea: false },
                title: { display: true, text: 'Voltase' }
            }
        }
    }
</script>