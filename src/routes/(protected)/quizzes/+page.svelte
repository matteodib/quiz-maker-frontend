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
        TextInput,
        TextArea,
        ComboBox,
        CopyButton,
        Checkbox,
        MultiSelect,
    } from "carbon-components-svelte";


    import { SelectSkeleton } from "carbon-components-svelte";

    import { Add, ParentChild, TrashCan } from "carbon-icons-svelte";
    import type { DataTableRow } from "carbon-components-svelte/types/DataTable/DataTable.svelte";
    import { StoreQuizDTO, type Quiz } from "../../../interfaces/Quiz";
    import { httpDelete, httpGet, httpPost } from "../../../utils/handleFetch";
    import type { Category } from "../../../interfaces/Category";
    import { base } from "$app/paths";



    //datatable
    let pageSize = 20;
    let page = 1;
    let selectedCategory: number | null = null
    let showInputNumberQuestions: boolean = false
    let mappedCategories : Category[] = []
    let getQuizzes: () => Promise<Quiz[]> = async () => {
        let url = selectedCategory ? "protected/quizzes/category/" + selectedCategory : "protected/quizzes/";
        const response = await httpGet(url).catch((err) => err);
        if (response) return response.data;
    };

    let loadTable = getQuizzes();

    //get all categories
    let getAllCategories: () => Promise<Category[]> = async () => {
        const response = await httpGet("protected/categories/").catch((err) => err);
        if (response) {
            mappedCategories = response.data.map((item) => {
                item.text = item.name
                return item
            })
            console.log(mappedCategories)
            return response.data;
        }
    };

    let reloadCategories = getAllCategories()
    //reload table on category change
    const reloadTable = (event: any) => {
        selectedCategory = event
        loadTable = getQuizzes();
    };

    //selected row
    let selectedRow: Quiz | null | DataTableRow = null
    
    //add quiz
    let addModalOpen = false
    let addQuizObject = new StoreQuizDTO()
    let invalidSubmit = false
    let invalidSenioritySubmit = false
    const storeQuiz = async () => {
        invalidSenioritySubmit = false
        invalidSubmit = false
        if(!addQuizObject.getTitle() || !addQuizObject.getDescription() || !addQuizObject.getCategoryIds().length) {
            console.log(addQuizObject.getTitle(), addQuizObject.getDescription(), addQuizObject.getCategoryIds())
            invalidSubmit = true
            return
        }
        if((addQuizObject.getJuniorSeniority() + addQuizObject.getMiddleSeniority() + addQuizObject.getSeniorSeniority()) > 100) {
            invalidSenioritySubmit = true
            return 
        }
        const response = await httpPost('protected/quizzes/', addQuizObject.getObjectToStore()).catch(err => err)
        if(response) {
            addModalOpen = false
            addQuizObject = new StoreQuizDTO()
            loadTable = getQuizzes()
            reloadCategories = getAllCategories()
        }
    }

    //delete
    let deleteModalOpen = false
    const openDeleteModal = (row: Quiz | DataTableRow) => {
        selectedRow = row
        deleteModalOpen = true
    }
    const deleteQuiz = async () => {
        const response = await httpDelete("protected/quizzes/"+selectedRow?.id).catch(err => err)
        if(response) {
            deleteModalOpen = false
            loadTable = getQuizzes()
        }
    }


    const randomQuestionsChange = () => {
        addQuizObject.setAddRandomQuestions(!addQuizObject.getAddRandomQuestions())
        showInputNumberQuestions = !showInputNumberQuestions
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

    const closeAddModal = () => {
        addModalOpen = false
        addQuizObject = new StoreQuizDTO()
    }
</script>

<style>
    .prefix {
        position: absolute;
        bottom: 27%;
        right: 25%;
        z-index: 999;
    }
</style>
<div style="display: flex;flex-direction:column; gap: 20px">
    <div style="display:flex; justify-content:space-between">
        {#await reloadCategories}
            <SelectSkeleton hideLabel />

            <SelectSkeleton hideLabel />
        {:then categories}
            <Button icon={Add} on:click={() => addModalOpen = true}>Add quiz</Button>
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
                headers={[{key:"generateUrl", value: "Generate URL"},{ key: "title", value: "Title" },{ key: "description", value: "Description" }, { key: "mappedCategs", value: "Category" },{ key: "active", value: "OnGoing" }, { key: "actions", value: "Actions" }]} 
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
                        <Button iconDescription="Edit questions" icon={ParentChild} href={base+"/quizzes/"+row.id}/>
                    {:else if cell.key === "description"}
                        {truncateString(cell.value)}
                    {:else if cell.key === "mappedCategs"}
                            {row.categories.map((category) => category.name).join(", ")}
                    {:else if cell.key === "generateUrl"}
                        <CopyButton iconDescription="Click me to generate URL" text={`${window.location.protocol + "//" + window.location.host}${base}/compile-quiz/${row.session}`} />
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
  modalHeading="Delete quiz"
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => (deleteModalOpen = false)}
  on:open
  on:close={() => deleteModalOpen = false}
  on:submit={() => deleteQuiz()}
>
  <p>Are you sure? The participant will not be able to access this quiz anymore</p>
</Modal>

<!-- add modal-->
<Modal
  open={addModalOpen}
  modalHeading="Add quiz"
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => closeAddModal()}
  on:open
  on:close={() => closeAddModal()}
  on:submit={() => storeQuiz()}
>

<div>
    {#await reloadCategories}
            <SelectSkeleton hideLabel />
        {:then categories}
            <Grid padding>
                <Row>
                    <Column>
                        <MultiSelect
                        titleText="Categories"
                        label="Select categories..."
                        items={mappedCategories}
                        on:select={(e) => addQuizObject.setCategoryIds(e.detail.selectedIds)}
                        />
                    </Column>

                </Row>
                <Row>
                    <Column>
                        <TextInput value={addQuizObject.getTitle()} labelText="Define a title (add the applicant name)" placeholder="Enter a title..." on:change={(e) => addQuizObject.setTitle(e.detail)}/>
                    </Column>
                </Row>
                <Row>
                    <Column>
                        <TextArea value={addQuizObject.getDescription()} labelText="Add description" placeholder="Enter a description..." on:change={(e) => addQuizObject.setDescription(e.target.value)}/>
                    </Column>
                </Row>
                <Row>
                    <Column>
                        <Checkbox labelText="Add random questions in category selected" value={addQuizObject.getAddRandomQuestions()} on:change={() => randomQuestionsChange()}/>
                    </Column>
                </Row>
                {#if showInputNumberQuestions}
                <Row>
                    <Column>
                        <TextInput type="number" value={addQuizObject.getNumberOfQuestions()} labelText="How much questions" placeholder="Enter a number..." on:change={(e) => addQuizObject.setNumberOfQuestions(e.detail)}/>
                    </Column>
                </Row>
                <Row>
                    <Column style="position:relative">
                        <span class="prefix">%</span>
                        <TextInput type="number" value={addQuizObject.getJuniorSeniority()} labelText="Junior" placeholder="Enter a percentage..." on:change={(e) => addQuizObject.setJuniorSeniority(e.detail)}/>
                    </Column>
                    <Column style="position:relative">
                        <span class="prefix">%</span>
                        <TextInput type="number" value={addQuizObject.getMiddleSeniority()} labelText="Middle" placeholder="Enter a percentage..." on:change={(e) => addQuizObject.setMiddleSeniority(e.detail)}/>
                    </Column>
                    <Column style="position:relative">
                        <span class="prefix">%</span>
                        <TextInput type="number" value={addQuizObject.getSeniorSeniority()} labelText="Senior" placeholder="Enter a percentage..." on:change={(e) => addQuizObject.setSeniorSeniority(e.detail)}/>
                    </Column>
                </Row>
                {/if}
            </Grid>
            {#if invalidSenioritySubmit}
                <p style="color: red; font-style:italic; text-align:center; padding:0">Fill seniority the correct way!</p>
            {/if}
            {#if invalidSubmit}
                <p style="color: red; font-style:italic; text-align:center; padding:0">Fill all the above fields!</p>
            {/if}
        {/await}
</div>
</Modal>
