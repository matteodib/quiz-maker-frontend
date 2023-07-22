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
    } from "carbon-components-svelte";

    import { Add, TrashCan } from "carbon-icons-svelte";
    import type { DataTableRow } from "carbon-components-svelte/types/DataTable/DataTable.svelte";
    import { StoreCategoryDTO, type Category } from "../../../interfaces/Category";
    import { httpDelete, httpGet, httpPost } from "../../../utils/handleFetch";


    //datatable
    let pageSize = 5;
    let page = 1;

    let getCategories: () => Promise<Category[]> = async () => {
        const response = await httpGet("categories/").catch((err) => console.log(err));
        if (response) return response.data;
    };

    let loadTable = getCategories();

    //selected row
    let selectedRow: Category | null | DataTableRow = null
    
    //add quiz
    let addModalOpen = false
    let addCategory = new StoreCategoryDTO()
    let invalidSubmit = false
    const storeCategory = async () => {
        invalidSubmit = false
        if(!addCategory.getName() ) {
            invalidSubmit = true
            return
        }
        const response = await httpPost('categories/', addCategory.getObjectToStore()).catch(err => console.log(err))
        if(response) {
            addModalOpen = false
            addCategory = new StoreCategoryDTO()
            loadTable = getCategories()
        }
    }

    //delete
    let deleteModalOpen = false
    const openDeleteModal = (row: Category | DataTableRow) => {
        selectedRow = row
        deleteModalOpen = true
    }
    const deleteCategory = async () => {
        const response = await httpDelete("categories/"+selectedRow?.id).catch(err => console.log(err))
        if(response) {
            deleteModalOpen = false
            loadTable = getCategories()
        }
    }

</script>

<div style="display: flex;flex-direction:column; gap: 20px">
    <div style="display:flex; justify-content:space-between">
        <Button icon={Add} on:click={() => addModalOpen = true}>Add category</Button> 
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
                headers={[{ key: "name", value: "Name" }, { key: "actions", value: "Actions" }]} 
                {rows} {pageSize} {page}>
                <Toolbar>
                    <ToolbarContent>
                        <ToolbarSearch
                            placeholder="Search by name..."
                            persistent
                            shouldFilterRows
                        />
                    </ToolbarContent>
                </Toolbar>
                <svelte:fragment slot="cell" let:row let:cell>
                    {#if cell.key === "actions"}
                        <Button kind="danger-tertiary" iconDescription="Delete" icon={TrashCan} on:click={() => openDeleteModal(row)}/>
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
  modalHeading="Delete category"
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => (deleteModalOpen = false)}
  on:open
  on:close={() => deleteModalOpen = false}
  on:submit={() => deleteCategory()}
>
  <p>Are you sure? This will delete all quizzes and questions related to this category</p>
</Modal>

<!-- add modal-->
<Modal
  open={addModalOpen}
  modalHeading="Add category"
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => (addModalOpen = false)}
  on:open
  on:close={() => addModalOpen = false}
  on:submit={() => storeCategory()}
>

<div>
    <Grid padding>
        <Row>
            <Column>
                <TextInput value={addCategory.getName()} labelText="Define a name" placeholder="Enter a name..." on:change={(e) => addCategory.setName(e.detail)}/>
            </Column>
        </Row>
    </Grid>
    {#if invalidSubmit}
        <p style="color: red; font-style:italic; text-align:center; padding:0">Fill all the above fields!</p>
    {/if}
</div>
</Modal>
