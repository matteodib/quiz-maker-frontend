<script lang="ts">
    import { Button, SkeletonText, Tag, TextArea, TextAreaSkeleton } from 'carbon-components-svelte';
    import { httpGet, httpPost } from '../../../utils/handleFetch.js';
    import QuizTitle from '../../../shared/components/QuizTitle.svelte';
    import "carbon-components-svelte/css/white.css";
    import type { Quiz } from '../../../interfaces/Quiz.js';
    import type { QuizQuestion } from '../../../interfaces/QuizQuestion.js';
    import { Checkmark } from 'carbon-icons-svelte';
    import { goto } from '$app/navigation';

    export let data;
    console.log(data)
    const getQuizFromSession: () => Promise<Quiz> = async () => {
        console.log(data.session)
        const response = await httpPost("public/get-quiz-by-session", {session:data.session})
        if(response && response.status && response.status ===208) goto("/compile-quiz/thanks-for-compiling")
        if(response) return response.data
    }

    let singleQuiz = getQuizFromSession()

    const getQuestionsOfQuiz: (quizId: number) => Promise<QuizQuestion[]> = async (quizId: number) => {
        const response = await httpGet("public/get-quiz-questions/"+quizId)
        if(response) return response.data
    }

    const updateQuestionAnswer = async (quizQuestionId: number, answer:string) => {
        const response = await httpPost("public/update-answer-question/"+quizQuestionId, {answer})
        if(response) return response.data
    }

    const setQuizAsConcluded = async (quizId: number) => {
        const response = await httpGet("public/set-quiz-as-completed/"+quizId)
        if(response) return response.data
    }
</script>

<div style="padding: 2em;">
    <div style="display:flex;flex-direction:column;justify-content:space-between;">
        {#await singleQuiz}
            <SkeletonText />
            <SkeletonText />
        {:then data} 
            <QuizTitle text={data.title}/>
            <Tag style="height:fit-content; width:fit-content" type={data.active ? "red" : "green"}>{data.active ? "On Going" : "Completed"}</Tag>
        {/await}
    </div>
    <div style="margin-top: 50px">
        {#await singleQuiz}
            <SkeletonText />
        {:then data} 
            {#if data.description}
                <QuizTitle text="Description"/>
                <p>{data.description}</p>
            {/if}
        {/await}
    </div>
    <div class="questions">
        {#await singleQuiz}
            <SkeletonText />
            <SkeletonText />
            <SkeletonText />
            <SkeletonText />
        {:then quiz} 
            {#await getQuestionsOfQuiz(quiz.id)}
                <TextAreaSkeleton hideLabel />
                <TextAreaSkeleton hideLabel />
                <TextAreaSkeleton hideLabel />
                <TextAreaSkeleton hideLabel />
            {:then quizQuestions} 
                <QuizTitle text="Questions"/>
                <div class="questions-container">
                    {#each quizQuestions as quizQuestion}
                        <div>
                            <h5 style="margin-bottom: 10px;">{quizQuestion.question.description}</h5>
                            <TextArea
                            hideLabel
                            rows={10}
                            value={quizQuestion.answer}
                            placeholder="Enter a description..."
                            on:blur={(e) => updateQuestionAnswer(quizQuestion.id, e.target.value)}
                            />
                        </div>
                    {/each}
                </div>
            {/await}
        {/await}
    </div>
    <div style="margin-top: 50px">
        {#await singleQuiz}
            <SkeletonText />
        {:then data} 
            <div style="display:flex; justify-content:end">
                <Button icon={Checkmark} on:click={() =>  setQuizAsConcluded(data.id)}>Send answers</Button>
            </div>
        {/await}
    </div>
</div>
<style>
    .questions-container {
        display: flex;
        flex-direction: column;
        gap: 40px;
    }
</style>