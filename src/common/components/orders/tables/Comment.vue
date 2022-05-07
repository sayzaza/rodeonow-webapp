<template>

    <tr :class="[{
        'user-comment__row': comment.user_type===1,
        'appraiser-comment__row': comment.user_type===2,
        'client-comment__row': comment.user_type===3}]">
        <td class="order__text" VALIGN=TOP>
            <p>{{ comment.comment_text }}</p>
            <span v-if="comment.display_name !== undefined">
                {{ "Posted by " + comment.display_name + " on " + comment.date_created }}
            </span>
            <span v-else>
                {{ "Posted by " + comment.first_name + ' ' + comment.last_name + " on " + comment.date_created }}
            </span>
        </td>
        <!-- <td class="order__text" VALIGN=TOP>
            {{ comment.label_id }}
        </td> -->
        <td class="order__text" VALIGN=TOP>
            <div>
                <label>
                    <input
                        type="checkbox"
                        :checked="comment.client_access"
                        @click="onShareWithClientChecked($event)"/>
                    Client
                </label>
            </div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        :checked="comment.appraiser_access"
                        @click="onShareWithAppraiserChecked($event)"/>
                    Appraiser
                </label>
            </div>
        </td>
        <td VALIGN=TOP>
            <span v-if="comment.is_read">
                <img class="pointer" src="/bootstrap-icons/icons/envelope.svg" width="20" height="20">
            </span>
            <span v-else>
                <img class="pointer" src="/bootstrap-icons/icons/envelope-fill.svg" width="20" height="20">
            </span>
        </td>
        <td VALIGN=TOP>
            <img class="pointer" src="/bootstrap-icons/icons/three-dots.svg" width="20" height="20">
        </td>
    </tr>

</template>


<script>

// TODO change created date to local time

export default {
    name: 'CommentTable',
    props: {
        comment: Object,
    },
    methods: {
        onShareWithClientChecked(){
        },

        onShareWithAppraiserChecked(){
        },
    }
}
</script>


<style scoped>

.user-comment__row{
    background-color: #ebf2ff;
}

.appraiser-comment__row{
    background-color: #d0f7c9;
}

.client-comment__row{
    background-color: #f7f5c9;
}

</style>
