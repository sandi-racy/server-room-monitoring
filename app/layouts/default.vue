<template>
    <div class="sm:mockup-phone w-full">
        <div class="sm:mockup-phone-display bg-slate-100">
            <div class="navbar bg-base-100 shadow-sm">
                <div class="navbar-start"></div>
                <div class="navbar-center">
                    <NuxtLink to="/" class="btn btn-ghost text-xl">Monitoring Ruang Server</NuxtLink>
                </div>
                <div class="navbar-end"></div>
            </div>
            <div class="p-2 sm:p-5 h-full overflow-y-auto no-scrollbar">
                <slot />
            </div>
        </div>
    </div>
</template>