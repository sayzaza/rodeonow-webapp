<template>

    <tr>
        <td class="order__text" VALIGN=TOP>
            <p>{{ note.note_text }}</p>
            <span v-if="note.display_name !== undefined">
                {{ "Posted by " + note.display_name + " on " + note.date_created }}
            </span>
            <span v-else>
                {{ "Posted by " + note.first_name + ' ' + note.last_name + " on " + note.date_created }}
            </span>
        </td>
        <td class="order__text" VALIGN=TOP>
            {{ note.label_id }}
        </td>
    </tr>

</template>


<script>

// TODO change created date to local time

export default {
    name: 'InternalNote',
    props: {
        note: Object,
    },
    data(){
        return{
        }
    },
    methods: {
    }
}
</script>
