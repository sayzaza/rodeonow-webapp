<template>

    <multiselect
          :value="r_selectedLabel"
          :options="r_allLabels"
          :close-on-select="true"
          :clear-on-select="false"
          :hide-selected="false"
          :open-direction="selectDirection"
          :preserve-search="true"
          :multiple="false"
          :searchable="true"
          :taggable="true"
          tagPlaceholder="Press enter to create new label."
          :preselect-first="false"
          :custom-label="customLabel"
          :show-labels="false"
          track-by="value"
          selectLabel="Label"
          deselectLabel=""
          placeholder="Label Select"
          @select="onSelect"
          @remove="onRemove"
          @tag="createLabel">
     </multiselect>
     <!-- <div></div> -->

</template>


<script>

 import Multiselect from '@suadelabs/vue3-multiselect'

export default {
    name: 'CommentLabelSelect',
    components: {
        Multiselect
    },
    props: {
        selectDirection: { // bottom or top
            type: String,
            default: 'bottom',
        },
        onChangeCallback: Function,
    },
    data() {
        return {
            r_allLabels: [
                { value: "WV", text: "West Virginia"},
                { value: "WI", text: "Wisconsin"},
                { value: "WY", text: "Wyoming"},
            ],
            r_selectedLabel: { value: -1, text: "Label Select"},

            r_createdLabel: -2,

        };
    },
    created(){
        // need to load all existing labels
    },
    methods: {
        /*
         * create a custom label to display
         */
         customLabel(option) {
             return option.text;
         },

         onSelect(option){
             this.r_selectedLabel = option;
             if(this.onChangeCallback !== undefined){
                 this.onChangeCallback(this.r_selectedLabel);
             }
         },

         onRemove(){
             this.r_selectedLabel = {};
             if(this.onChangeCallback !== undefined){
                 this.onChangeCallback(this.r_selectedLabel);
             }
         },

         createLabel(label){
             let newLabel = { value: this.r_createdLabel--, text: label }
             this.r_allLabels.push(newLabel);
             this.r_selectedLabel = newLabel;

             // TODO, save in database
         },

    },
}
</script>
