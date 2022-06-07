<template>

    <table id="comments" class="results-table">
        <caption>Comments</caption>
        <thead>
            <tr>
                <th>Comment</th>
                <!-- <th>Label</th> -->
                <th>Access</th>
                <th>Read</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <Comment
                v-for="comment in this.$store.state.orderComments"
                :key="comment.comment_id"
                :comment="comment"/>
        </tbody>
    </table>

</template>


<script>

import Comment from './Comment.vue';

export default {
    name: 'CommentsTable',
    components: {
        Comment
    },
    props: {
    },
    data(){
        return{
        }
    },
    created(){
    },
    methods: {
    }
}
</script>
