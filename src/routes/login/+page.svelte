<script lang="ts">
    import { Button, ContentSwitcher, Switch } from "carbon-components-svelte";
    import { TextInput, PasswordInput} from "carbon-components-svelte";
    import { axiosInstance, httpPost } from "../../utils/handleFetch";
    import "carbon-components-svelte/css/white.css";
    import { goto } from "$app/navigation";
    import axios from "axios";
    import { environment } from "../../environment/environment";
    import { base } from "$app/paths";

    let isFormLogin: boolean = true
    let loading: boolean = false
    let loginData: {username: string, password: string} = {
        username: "",
        password: ""
    }
    let errorSubmit: boolean = false
    const switchForm = (bool: boolean) => {
        isFormLogin = bool
        loginData.username = ""
        loginData.password = ""
    }
    const saveCookie = (token: string) => {
        let days = 999
        var expires = "";
        let cookieName = "token"
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
        document.cookie = cookieName + "=" + (token || "")  + expires + "; path=/";
    }

    const login = async () => {
        errorSubmit = false
        if(!loginData.username || !loginData.password) {
            errorSubmit = true
            return
        }
        const response = await axios.post(environment.API_URL+'public/auth/login', loginData).catch(err => {
            errorSubmit = true
            return
        })
        if(response) {
            saveCookie(response.data.token)
            axiosInstance.defaults.headers['Authorizazion']= `Bearer ${response.data.token}`
            goto(base+"/quizzes")
        }
    }

    const register = async () => {
        errorSubmit = false
        if(!loginData.username || !loginData.password) {
            errorSubmit = true
            return
        }
        const response = await httpPost('user/register', loginData).catch(err => errorSubmit = true)
        if(response) {
            switchForm(true)
        }
    }

</script>

<div class="center-box">
    
    <div class="login-register-box">
        <ContentSwitcher size="xl">
            <Switch text="Login" on:click={() => switchForm(true)}/>
            <Switch text="Register" on:click={() => switchForm(false)}/>
        </ContentSwitcher>
        {#if isFormLogin}
            <div class="login">
                <div class="inputs-box">
                    <TextInput required placeholder="Enter user name..." bind:value={loginData.username}/>
                    <PasswordInput
                        required
                        type="password"
                        placeholder="Enter password..."
                        bind:value={loginData.password}
                    />
                    {#if errorSubmit}
                        <p style="color: red; font-style:italic; text-align:center; padding:0">Enter valid credentials!</p>
                    {/if}
                </div>
                
                <div style="width: 100%; display:flex; justify-content:right">
                    {#if loading}
                        <Button skeleton size="field" />
                        {:else}
                        <Button type="submit" style="width:100%;" on:click={() => login()}>Login</Button>
                    {/if}
                </div>
            </div>
            {:else}
            <div class="register">
                <div class="inputs-box">
                    <TextInput required placeholder="Enter user name..." bind:value={loginData.username}/>
                    <PasswordInput
                        required
                        type="password"
                        placeholder="Enter password..."
                        bind:value={loginData.password}
                    />
                </div>
                <div style="width: 100%; display:flex; justify-content:right">
                    {#if loading}
                        <Button skeleton size="field" />
                        {:else}
                        <Button type="submit" style="width:100%;" on:click={() => login()}>Register</Button>
                    {/if}
                </div>
            </div>

        {/if}

    </div>
</div>

  
<style>
    .center-box {
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 100%;
        min-height: 100vh;
    }
    .login-register-box {
        min-width: 40vw;
        min-height: 50vh;
    }
    .inputs-box {
        background-color: #f4f4f4;
        display: flex;
        gap:30px;
        flex-direction:column;
        padding: 3em 0
    }
</style>