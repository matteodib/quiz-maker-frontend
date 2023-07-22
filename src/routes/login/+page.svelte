<script lang="ts">
    import { Button } from "carbon-components-svelte";

    export let cookies;

    const saveCookie = (token: string) => {
        let days = 999
        var expires = "";
        let cookieName = "token"
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
        document.cookie = cookieName + "=" + (token || "")  + expires + "; path=/";
    }

    const login = () => {
        saveCookie("dkjhdjdhkdjkhddnmdnndm")
    }
</script>

<Button on:click={login}>clicca</Button>
<p>loginnnnnnnn</p>
