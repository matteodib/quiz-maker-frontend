<script lang="ts">
    import { onMount } from "svelte";
    import Layout from "../../shared/Layout.svelte";
    import "carbon-components-svelte/css/white.css";
    import { axiosInstance } from "../../utils/handleFetch";

    let startApp = false
    function getCookie(name:string) {
        const value = `; ${document.cookie}`;
        const parts: any[] = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    onMount(() => {
        axiosInstance.defaults.headers['Authorization'] = "Bearer "+getCookie('token')
        setTimeout(() => {
            startApp = true
        }, 0)
    })
</script>

<div class="app">
    {#if startApp}
        <Layout>
            <slot />
        </Layout>
    {/if}
</div>