<script lang="ts">
    import {
        DataTable,
        Toolbar,
        ToolbarContent,
        ToolbarSearch,
        Pagination,
        DataTableSkeleton,
        Button,
        Modal,
        Grid,
        Row,
        Column,
        TextArea,
        ComboBox,
        InlineNotification,
        TextInput,
    } from "carbon-components-svelte";

    import { SelectSkeleton } from "carbon-components-svelte";

    import { Add, Checkmark, Information, TrashCan } from "carbon-icons-svelte";
    import type { DataTableRow } from "carbon-components-svelte/types/DataTable/DataTable.svelte";
    import { StoreQuestionDTO, type Question, type QuestionAnswer } from "../../../interfaces/Question";
    import { httpDelete, httpGet, httpPost } from "../../../utils/handleFetch";
    import type { Category } from "../../../interfaces/Category";
    import type { Ranking } from "../../../interfaces/Ranking";
    import type { QuestionType } from "../../../interfaces/QuestionType";
    import { text } from "@sveltejs/kit";

    
    let questionAnswerText: string | number | null = ""
    let selectedQuestionType: number = 0
    let newQuestionAnswers: QuestionAnswer[] = []
    const getAnswers = () => {
        return newQuestionAnswers
    }

    let reloadQuestionAnswers =  getAnswers()

    //datatable
    let pageSize = 20;
    let page = 1;
    let selectedCategory: number | null = null

    let geQuestions: () => Promise<Question[]> = async () => {
        let url = selectedCategory ? "protected/questions/category/" + selectedCategory : "protected/questions/";
        const response = await httpGet(url).catch((err) => err);
        if (response) return response.data;
    };

    let loadTable = geQuestions();

    //get all categories
    let getAllCategories: () => Promise<Category[]> = async () => {
        const response = await httpGet("protected/categories/").catch((err) => err );
        if (response) return response.data;
    };
    let reloadCategories = getAllCategories()
    
    //get all categories
    let getAllRankings: () => Promise<Ranking[]> = async () => {
        const response = await httpGet("protected/questions/get-rankings").catch((err) => err );
        if (response) return response.data;
    };
    let reloadRankings = getAllRankings()
    
    //get all categories
    let getAllQuestionTypes: () => Promise<QuestionType[]> = async () => {
        const response = await httpGet("protected/questions/get-question-types").catch((err) => err );
        if (response) return response.data;
    };
    let reloadQuestionTypes = getAllQuestionTypes()

    //reload table on category change
    const reloadTable = (event: any) => {
        selectedCategory = event
        loadTable = geQuestions();
    };

    //selected row
    let selectedRow: Question | null | DataTableRow = null
    
    //add question
    let addModalOpen = false
    let addQuestionObject = new StoreQuestionDTO()
    let invalidSubmit = false
    let invalidTypeMultiple = false
    const storeQuestion = async () => {

        addQuestionObject.setQuestionAnswers(newQuestionAnswers)
        invalidTypeMultiple = false
        invalidSubmit = false
        if(!addQuestionObject.getDescription() || addQuestionObject.getCategoryId() == 0 || addQuestionObject.getRankingId() == 0) {
            invalidSubmit = true
            return
        }
        if((selectedQuestionType == 2 && !addQuestionObject.getQuestionAnswers().length) || (selectedQuestionType == 2 && !newQuestionAnswers.find(x => x.isCorrect))) {
            invalidTypeMultiple = true
            return
        }
        const response = await httpPost('protected/questions/', addQuestionObject.getObjectToStore()).catch(err => err)
        if(response) {
            addModalOpen = false
            addQuestionObject = new StoreQuestionDTO()
            loadTable = geQuestions()
            reloadCategories = getAllCategories()
        }
    }

    //delete
    let deleteError = false
    let deleteModalOpen = false
    const openDeleteModal = (row: Question | DataTableRow) => {
        selectedRow = row
        deleteModalOpen = true
    }
    const deleteQuestion = async () => {
        deleteError = false
        const response = await httpDelete("protected/questions/"+selectedRow?.id)
        if(response) {
            deleteModalOpen = false
            loadTable = geQuestions()
        } else {
            deleteError = true
        }
    }

    //infoModal

    let infoModalOpen = false
    const openInfoModal = (row: Question | DataTableRow) => {
        selectedRow = row
        infoModalOpen = true
        console.log(selectedRow)
    }
    function itemToString(item: Category) {
        return item.name;
    }
    function shouldFilterItem(item:any, value:any) {
        if (!value) return true;
        return item.name.toLowerCase().includes(value.toLowerCase());
    }
    const truncateString = (text:string) => {
        return text.slice(0, 100)+(text.length >100 ? '...' : '')
    }

    const setAnswerAsCorrect = (selectedIndex: number) => {
        newQuestionAnswers.map((answer, index) => {
            answer.isCorrect = (index === selectedIndex ?  true : false)
        })
        reloadQuestionAnswers = getAnswers()
    }
</script>

<style>
    .choices-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 1em;
    }
    .choice {
        display: flex;
    }
    .choice-correct {
        display: flex;
        margin-left: .5em;
        align-items: center;
    }
    .green {
        color: #198038;
    }
</style>
<div style="display: flex;flex-direction:column; gap: 20px">
    <div style="display:flex; justify-content:space-between">
        {#await getAllCategories()}
            <SelectSkeleton hideLabel />

            <SelectSkeleton hideLabel />
        {:then categories}
            <Button icon={Add} on:click={() => addModalOpen = true}>Add question</Button>
            <ComboBox
                on:select={(e) => reloadTable(e.detail.selectedId)}
                titleText=""
                placeholder="Select a category"
                items={categories}
                {itemToString}
                {shouldFilterItem}
                on:clear={(e) => reloadTable(null)}
            />     
            {/await}
    </div>
    <div>
        {#await loadTable}
            <DataTableSkeleton
                showHeader={false}
                showToolbar={false}
                columns={5}
            />
        {:then rows}
            <DataTable
                headers={[{ key: "description", value: "Description" }, { key: "category.name", value: "Category" }, { key: "actions", value: "Actions" }]} 
                {rows} {pageSize} {page}>
                <Toolbar>
                    <ToolbarContent>
                        <ToolbarSearch
                            placeholder="Search by name or description..."
                            persistent
                            shouldFilterRows
                        />
                    </ToolbarContent>
                </Toolbar>
                <svelte:fragment slot="cell" let:row let:cell>
                    {#if cell.key === "actions"}
                        <Button kind="danger-tertiary" iconDescription="Delete" icon={TrashCan} on:click={() => openDeleteModal(row)}/>
                        <Button kind="tertiary" iconDescription="Info" icon={Information} on:click={() => openInfoModal(row)}/>
                    {:else if cell.key === "description"}
                        {truncateString(cell.value)}
                    {:else}
                        {cell.value}
                    {/if}
                </svelte:fragment>
            </DataTable>
            <Pagination
                bind:pageSize
                bind:page
                totalItems={rows.length}
                pageSizeInputDisabled
            />
        {/await}

        
    </div>
</div>

<!-- delete modal-->
<Modal
  open={deleteModalOpen}
  modalHeading="Delete question"
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => (deleteModalOpen = false)}
  on:open
  on:close={() => deleteModalOpen = false}
  on:submit={() => deleteQuestion()}
>
<p>Are you sure about deleting this question?</p>
    {#if deleteError}
    <Row>
        <InlineNotification
            lowContrast
            kind="error"
            title="Error:"
            subtitle="This question may be related to a quiz and cannot be deleted."
            />
    </Row>
    {/if}
</Modal>

<!-- add modal-->
<Modal
  open={addModalOpen}
  modalHeading="Add question"
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => (addModalOpen = false)}
  on:open
  on:close={() => addModalOpen = false}
  on:submit={() => storeQuestion()}
>

<div>
    {#await reloadCategories}
            <SelectSkeleton hideLabel />
        {:then categories}
            <Grid padding>
                <Row>
                    <Column>
                        <ComboBox
                            value={addQuestionObject.getCategoryId().toString()}
                            on:select={(e) => addQuestionObject.setCategoryId(e.detail.selectedId)}
                            titleText="Select a category"
                            placeholder="Choose for a category..."
                            items={categories}
                            {itemToString}
                            {shouldFilterItem}
                            on:clear={(e) => addQuestionObject.setCategoryId(0)}
                        /> 
                    </Column>
                </Row>
                <Row>
                    {#await reloadRankings}
                    <SelectSkeleton hideLabel />
                    {:then rankings} 
                    <Column>
                        <ComboBox
                            value={addQuestionObject.getRankingId().toString()}
                            on:select={(e) => addQuestionObject.setRankingId(e.detail.selectedId)}
                            titleText="Select a rank"
                            placeholder="Choose for a rank..."
                            items={rankings}
                            {itemToString}
                            {shouldFilterItem}
                            on:clear={(e) => addQuestionObject.setRankingId(0)}
                        /> 
                    </Column>
                    {/await}
                    
                </Row>
                <Row>
                    <Column>
                        <TextArea value={addQuestionObject.getDescription()} labelText="Add description" placeholder="Enter a description..." on:change={(e) => addQuestionObject.setDescription(e.target.value)}/>
                    </Column>
                </Row>
                <Row>
                    {#await reloadQuestionTypes}
                    <SelectSkeleton hideLabel />
                    {:then questionTypes} 
                    <Column>
                        <ComboBox
                            value={addQuestionObject.getTypeId().toString()}
                            on:select={(e) => {
                                selectedQuestionType = e.detail.selectedId
                                addQuestionObject.setTypeId(e.detail.selectedId)
                            }}
                            titleText="Select a question type"
                            placeholder="Choose for a type..."
                            items={questionTypes}
                            {itemToString}
                            {shouldFilterItem}
                            on:clear={(e) => addQuestionObject.setTypeId(0)}
                        /> 
                    </Column>
                    {/await}
                    
                </Row>
                {#if selectedQuestionType == 2}
                    <h5>Add some answers and check the right one</h5>
                    <Row >
                        <Column style="display:flex">
                            <TextInput value={questionAnswerText} style="width:90%" placeholder="Write something..." on:change={(e) => questionAnswerText = e.detail}/>
                            <Button icon={Add} on:click={() => {
                                const newQuestionAnswer = {id: null, text: questionAnswerText, isCorrect: false}
                                newQuestionAnswers.push(newQuestionAnswer)
                                questionAnswerText = ""
                                reloadQuestionAnswers = getAnswers()
                            }}></Button>
                        </Column>
                    </Row>
                    {#each reloadQuestionAnswers as questionAnswer, index }
                        <div style="display: flex; padding: .7em; gap:10px">
                            <input id={index.toString()} type="radio" name="answers" value={questionAnswer.text} on:change={() => setAnswerAsCorrect(index)}/>
                            <label for={index.toString()}>{questionAnswer.text}</label>
                        </div>
                    {/each}
                {/if}
            </Grid>
            {#if invalidSubmit}
                <p style="color: red; font-style:italic; text-align:center; padding:0">Fill all the above fields!</p>
            {/if}
            {#if invalidTypeMultiple}
                <p style="color: red; font-style:italic; text-align:center; padding:0">Select at lease a corret answer!</p>
            {/if}
        {/await}
</div>
</Modal>


<!-- info modal-->
<Modal
  open={infoModalOpen}
  modalHeading="Info about question"
  on:click:button--secondary={() => (infoModalOpen = false)}
  on:open
  on:close={() => infoModalOpen = false}
>
    <Row padding>
        <Column>
            <h5>Description</h5>
            <p>{selectedRow?.description}</p>
        </Column>
        <Column>
            <h5>Category</h5>
            <p>{selectedRow?.category.name}</p>
        </Column>
    </Row>
    <Row padding>
        <Column>
            <h5>Question type</h5>
            <p>{selectedRow?.questionType ? selectedRow?.questionType.name : "N/D"}</p>
        </Column>
        <Column>
            <h5>Ranking</h5>
            <p>{selectedRow?.ranking ? selectedRow?.ranking.name: "N/D"}</p>
        </Column>
    </Row>
    {#if selectedRow?.questionType?.id == 2}
    <Row padding>
        <Column>
            <h5>Risposte</h5>
            <div class="choices-list">
                {#each selectedRow?.multipleQuestionChoices as answer }
                    <div class="choice">
                        {answer.text}
                        {#if answer.isCorrect}
                            <div class="choice-correct">
                                <div>
                                    <Checkmark size={16} color={"#198038"}/>
                                </div>
                                <p class="green">Correct</p>
                            </div>

                        {/if}
                    </div>
                {/each}
            </div>
        </Column>
    </Row>
    {/if}
</Modal>