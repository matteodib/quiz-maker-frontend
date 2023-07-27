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
    } from "carbon-components-svelte";

    import { SelectSkeleton } from "carbon-components-svelte";

    import { Add, TrashCan } from "carbon-icons-svelte";
    import type { DataTableRow } from "carbon-components-svelte/types/DataTable/DataTable.svelte";
    import { StoreQuestionDTO, type Question } from "../../../interfaces/Question";
    import { httpDelete, httpGet, httpPost } from "../../../utils/handleFetch";
    import type { Category } from "../../../interfaces/Category";



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
    const storeQuestion = async () => {
        invalidSubmit = false
        if(!addQuestionObject.getDescription() || addQuestionObject.getCategoryId() == 0) {
            invalidSubmit = true
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
            console.log(response)
            deleteError = true
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
                    <Column>
                        <TextArea value={addQuestionObject.getDescription()} labelText="Add description" placeholder="Enter a description..." on:change={(e) => addQuestionObject.setDescription(e.target.value)}/>
                    </Column>
                </Row>
            </Grid>
            {#if invalidSubmit}
                <p style="color: red; font-style:italic; text-align:center; padding:0">Fill all the above fields!</p>
            {/if}
        {/await}
</div>
</Modal>
