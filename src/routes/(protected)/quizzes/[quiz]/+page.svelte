<script lang="ts">
    import { Button, ComboBox, DataTable, DataTableSkeleton, ExpandableTile, Grid, Pagination, SkeletonPlaceholder, SkeletonText, Tag, Toolbar, ToolbarContent, ToolbarSearch } from "carbon-components-svelte";
    import { Add } from "carbon-icons-svelte";
    import type { QuizQuestion } from "../../../../interfaces/QuizQuestion";
    import type { Quiz } from "../../../../interfaces/Quiz";
    import { httpGet, httpPatch, httpPost } from "../../../../utils/handleFetch";
    import type { Category } from "../../../../interfaces/Category";
    import type { Question } from "../../../../interfaces/Question";
    import QuizTitle from "../../../../shared/components/QuizTitle.svelte";



    export let data;

    const getQuiz : () => Promise<Quiz> = async () => {
        const response = await httpGet("protected/quizzes/"+data.id)
        if(response) return response.data
    }
    let singleQuiz = getQuiz()
    //get questions with answers
    const getQuizQuestions: ()=> Promise<QuizQuestion[]> = async () => {
        const response = await httpGet("protected/quiz-question/"+data.id).catch(err => err)
        if(response) return response.data
    }
    let reloadQuizQuestions = getQuizQuestions()
    //get categories
    let getAllCategories: () => Promise<Category[]> = async () => {
        const response = await httpGet("protected/categories/").catch((err) => err);
        if (response) return response.data;
    };
    function itemToString(item: Category) {
        return item.name;
    }
    function shouldFilterItem(item:any, value:any) {
        if (!value) return true;
        return item.name.toLowerCase().includes(value.toLowerCase());
    }
    //get questions filtered or not
    let filterQuestionsByCategory: number | null = null 
    let selectedRowIds: number[] = [];
    const getQuestions: () => Promise<Question[]> = async () => {
        const response = await httpPost("protected/quiz-question/get-questions-not-in-quiz/"+data.id, {categoryId: filterQuestionsByCategory}).catch(err => err)
        if(response) return response.data
    }
    let reloadQuestions = getQuestions()
    const setQuestionsCategoryFlter = (categoryId: number | null) => {
        filterQuestionsByCategory = categoryId
        reloadQuestions = getQuestions()
    }
    //Add questions
    const addQuestionsToQuiz = async () => {
        await httpPost("protected/quizzes/add-questions/"+data.id, {questionIds: selectedRowIds}).catch(err => err)
        reloadQuestions = getQuestions() 
        reloadQuizQuestions = getQuizQuestions()
        selectedRowIds = []
    }
    //remove question from quiz 
    const removeQuestionFromQuiz = async (questionId: number) => {
        await httpPatch("protected/quiz-question/remove-question-from-quiz", {questionId, quizId: data.id}).catch(err => err)
        reloadQuestions = getQuestions() 
        reloadQuizQuestions = getQuizQuestions()
    }
</script>


<Grid style="margin-bottom: 200px">
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
            <QuizTitle text="Quiz description"/>
            <p>{data.description}</p>
        {/await}
    </div>
    <div style="margin-top: 100px; gap: 20px; flex-direction:column">
        <QuizTitle text="Add question"/>
        {#await getAllCategories()}
            <SkeletonPlaceholder style="height: 12rem; width: 12rem;" />
        {:then categories} 
            <ComboBox
                on:select={(e) => setQuestionsCategoryFlter(e.detail.selectedId)}
                titleText=""
                placeholder="Select a category to filter questions"
                items={categories}
                {itemToString}
                {shouldFilterItem}
                on:clear={() => setQuestionsCategoryFlter(null)}
            />   
        {/await}
    </div>
    <div style="margin-top: 20px;width:100%">
        {#await reloadQuestions}
                <DataTableSkeleton
                    showHeader={false}
                    showToolbar={false}
                    columns={5}
                />
            {:then rows}
            <div style="display: flex;flex-direction:column">
                <Button disabled={selectedRowIds.length === 0} style="align-self: end" icon={Add} on:click={() => addQuestionsToQuiz()}>Add questions to quiz</Button>
                <DataTable
                    selectable
                    bind:selectedRowIds
                    headers={[{ key: "description", value: "Question" }, { key: "category.name", value: "Category" }]} 
                    {rows} pageSize={5} page={1}>
                    <Toolbar>
                        <ToolbarContent>
                            <ToolbarSearch
                                placeholder="Search by question..."
                                persistent
                                shouldFilterRows
                            />
                        </ToolbarContent>
                    </Toolbar>
                </DataTable>
                <Pagination
                    totalItems={rows.length}
                    pageSizeInputDisabled
                />
            </div>
            {/await}

    </div>
    <div style="margin-top: 100px;">
        <QuizTitle text="Quiz questions"/>
        {#await reloadQuizQuestions}
            <SkeletonText />
            <SkeletonText />
            <SkeletonText />
            <SkeletonText />
        {:then questions} 
            {#each questions as quizQuestion }
                <ExpandableTile tileExpandedLabel="View less" tileCollapsedLabel="View answer">
                    <div slot="above" style="display: flex; gap: 10px; flex-direction:column">
                        <Button style="width:fit-content" kind="danger" iconDescription="Remove question" on:click={() => removeQuestionFromQuiz(quizQuestion.question.id)}>
                            Remove question
                        </Button>
                        <strong style="font-size: 1.2em;">{quizQuestion.question.description}</strong>
                    </div>
                    <div slot="below" style="margin-top: 50px;">
                        {quizQuestion.answer ? quizQuestion.answer : "No answer related"}
                    </div>
                </ExpandableTile>
            {/each}
        {/await}
    </div>

</Grid>