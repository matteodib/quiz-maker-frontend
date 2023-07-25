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
    } from "carbon-components-svelte";


    import { SelectSkeleton } from "carbon-components-svelte";

    import { Add, ParentChild, TrashCan } from "carbon-icons-svelte";
    import type { DataTableRow } from "carbon-components-svelte/types/DataTable/DataTable.svelte";
    import { StoreQuizDTO, type Quiz } from "../../../interfaces/Quiz";
    import { httpDelete, httpGet, httpPost } from "../../../utils/handleFetch";
    import type { Category } from "../../../interfaces/Category";
    import { environment } from "../../../environment/environment";



    //datatable
    let pageSize = 5;
    let page = 1;
    let selectedCategory: number | null = null

    let getQuizzes: () => Promise<Quiz[]> = async () => {
        let url = selectedCategory ? "protected/quizzes/category/" + selectedCategory : "protected/quizzes/";
        const response = await httpGet(url).catch((err) => err);
        if (response) return response.data;
    };

    let loadTable = getQuizzes();

    //get all categories
    let getAllCategories: () => Promise<Category[]> = async () => {
        const response = await httpGet("protected/categories/").catch((err) => err);
        if (response) return response.data;
    };
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
    const storeQuiz = async () => {
        invalidSubmit = false
        if(!addQuizObject.getTitle() || !addQuizObject.getDescription() || addQuizObject.getCategoryId() == 0) {
            invalidSubmit = true
            return
        }
        const response = await httpPost('protected/quizzes/', addQuizObject.getObjectToStore()).catch(err => err)
        if(response) {
            addModalOpen = false
            addQuizObject = new StoreQuizDTO()
            loadTable = getQuizzes()
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
</script>

<div style="display: flex;flex-direction:column; gap: 20px">
    <div style="display:flex; justify-content:space-between">
        {#await getAllCategories()}
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
                headers={[{key:"generateUrl", value: "Generate URL"},{ key: "title", value: "Title" },{ key: "description", value: "Description" }, { key: "category.name", value: "Category" },{ key: "active", value: "OnGoing" }, { key: "actions", value: "Actions" }]} 
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
                        <Button iconDescription="Edit questions" icon={ParentChild} href={"/quizzes/"+row.id}/>
                    {:else if cell.key === "description"}
                        {truncateString(cell.value)}
                    {:else if cell.key === "generateUrl"}
                        <CopyButton iconDescription="Click me to generate URL" text={`${environment.SITE_URL}/compile-quiz/${row.session}`} />
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
  on:click:button--secondary={() => (addModalOpen = false)}
  on:open
  on:close={() => addModalOpen = false}
  on:submit={() => storeQuiz()}
>

<div>
    {#await getAllCategories()}
            <SelectSkeleton hideLabel />
        {:then categories}
            <Grid padding>
                <Row>
                    <Column>
                        <ComboBox
                            value={addQuizObject.getCategoryId().toString()}
                            on:select={(e) => addQuizObject.setCategoryId(e.detail.selectedId)}
                            titleText="Select a category"
                            placeholder="Choose for a category..."
                            items={categories}
                            {itemToString}
                            {shouldFilterItem}
                            on:clear={(e) => addQuizObject.setCategoryId(0)}
                        /> 
                    </Column>
                </Row>
                <Row>
                    <Column>
                        <TextInput value={addQuizObject.getTitle()} labelText="Define a title" placeholder="Enter a title..." on:change={(e) => addQuizObject.setTitle(e.detail)}/>
                    </Column>
                </Row>
                <Row>
                    <Column>
                        <TextArea value={addQuizObject.getDescription()} labelText="Add description" placeholder="Enter a description..." on:change={(e) => addQuizObject.setDescription(e.target.value)}/>
                    </Column>
                </Row>
                <Row>
                    <Column>
                        <Checkbox labelText="Add random questions in category selected" value={addQuizObject.getAddRandomQuestions()} on:change={() => addQuizObject.setAddRandomQuestions(!addQuizObject.getAddRandomQuestions())}/>
                    </Column>
                </Row>
            </Grid>
            {#if invalidSubmit}
                <p style="color: red; font-style:italic; text-align:center; padding:0">Fill all the above fields!</p>
            {/if}
        {/await}
</div>
</Modal>
