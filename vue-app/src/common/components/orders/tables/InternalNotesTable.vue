<template>

    <table id="notes" class="results-table">
        <caption>Internal Notes</caption>
        <thead>
            <tr>
                <th>Note</th>
                <th>Label</th>
            </tr>
        </thead>
        <tbody>
            <InternalNote
                v-for="note in this.$store.state.orderInternalNotes"
                :key="note.noteID"
                :note="note"/>
        </tbody>
    </table>

</template>


<script>

import InternalNote from './InternalNote.vue';

export default {
    name: 'InternalNotesTable',
    components: {
        InternalNote
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
