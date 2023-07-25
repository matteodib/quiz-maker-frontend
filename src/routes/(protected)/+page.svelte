<script lang="ts">

    import { SkeletonPlaceholder } from "carbon-components-svelte";
    import { httpGet } from "../../utils/handleFetch";

    const getNumberOfQuizzes: () => Promise<{onGoingQuizzes: number, endedQuizzes: number}> = async () => {
        const response = await httpGet("protected/quizzes/get-statistics")
        if(response) return response.data
    }

    let getStatistics = getNumberOfQuizzes()
</script>

<div>
    {#await getStatistics}
        <div class="cards">
            <div>
                <SkeletonPlaceholder style="height: 20rem; width: 20rem;" />
            </div>
            <div>
                <SkeletonPlaceholder style="height: 20rem; width: 20rem;" />
            </div>
        </div>
    {:then data} 
        <div class="cards">
            <div class="card">
                <p class="numberTitle">{data.onGoingQuizzes}</p>
                <p class="subtitle">On going quizzes</p>
            </div>
            <div class="card">
                <p class="numberTitle">{data.endedQuizzes}</p>
                <p class="subtitle">Completed quizzes</p>
            </div>
        </div>
    {/await}

</div>
<style>
    .cards {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
    }
    .card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 15rem;
        background-color: #f4f4f4;
        padding: 5%;
    }
    .numberTitle {
        font-size: 10em;
        color: #0f62fe;
    }
    .subtitle {
        font-size: 3em;
    }
</style>