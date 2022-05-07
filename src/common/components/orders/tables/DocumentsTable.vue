<template>

    <div id="documents">
        <table class="results-table">
            <caption>Supporting Documents</caption>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Document Type</th>
                    <th>Uploaded by</th>
                    <th>Access</th>
                    <th>View</th>
                </tr>
            </thead>
            <tbody>
                <DocumentRow
                    v-for="row in this.$store.state.orderDocuments"
                    :key="row.document_id"
                    :documentInfo="row"/>
            </tbody>
        </table>
    </div>

</template>


<script>

import DocumentRow from './DocumentRow.vue';

export default {
    name: 'DocumentsTable',
    components: {
        DocumentRow
    },
    props: {
    },
    data(){
        return{
        }
    },
    methods: {
    }
}
</script>
