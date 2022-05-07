<template>

    <multiselect
          :value="r_selectedState"
          :options="r_allStates"
          :close-on-select="true"
          :clear-on-select="false"
          :hide-selected="false"
          :open-direction="selectDirection"
          :preserve-search="true"
          :multiple="false"
          :searchable="true"
          :taggable="false"
          :preselect-first="false"
          :custom-label="customLabel"
          :show-labels="false"
          track-by="value"
          selectLabel="State"
          deselectLabel=""
          placeholder="State Select"
          @select="onSelect"
          @remove="onRemove">
     </multiselect>
     <!-- <div></div> -->

</template>


<script>

 import Multiselect from '@suadelabs/vue3-multiselect'

export default {
    name: 'StateSelect',
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
            r_allStates: [
                { value: -1, text: "All"},
                { value: "AL", text: "Alabama"},
                { value: "AK", text: "Alaska"},
                { value: "AZ", text: "Arizona"},
                { value: "AK", text: "Arkansas"},
                { value: "CA", text: "California"},
                { value: "CO", text: "Colorado"},
                { value: "CT", text: "Connecticut"},
                { value: "DE", text: "Delaware"},
                { value: "DC", text: "District of Columbia"},
                { value: "FL", text: "Florida"},
                { value: "GA", text: "Georgia"},
                { value: "HI", text: "Hawaii"},
                { value: "ID", text: "Idaho"},
                { value: "IL", text: "Illinois"},
                { value: "IN", text: "Indiana"},
                { value: "IA", text: "Iowa"},
                { value: "KS", text: "Kansas"},
                { value: "KY", text: "Kentucky"},
                { value: "LA", text: "Louisiana"},
                { value: "ME", text: "Maine"},
                { value: "MD", text: "Maryland"},
                { value: "MA", text: "Massachusetts"},
                { value: "MI", text: "Michigan"},
                { value: "MN", text: "Minnesota"},
                { value: "MS", text: "Mississippi"},
                { value: "MO", text: "Missouri"},
                { value: "MT", text: "Montana"},
                { value: "NE", text: "Nebraska"},
                { value: "NV", text: "Nevada"},
                { value: "NH", text: "New Hampshire"},
                { value: "NJ", text: "New Jersey"},
                { value: "NM", text: "New Mexico"},
                { value: "NY", text: "New York"},
                { value: "NC", text: "North Carolina"},
                { value: "ND", text: "North Dakota"},
                { value: "OH", text: "Ohio"},
                { value: "OK", text: "Oklahoma"},
                { value: "OR", text: "Oregon"},
                { value: "PA", text: "Pennsylvania"},
                { value: "PR", text: "Puerto Rico"},
                { value: "RI", text: "Rhode Island"},
                { value: "SC", text: "South Carolina"},
                { value: "SD", text: "South Dakota"},
                { value: "TN", text: "Tennessee"},
                { value: "TX", text: "Texas"},
                { value: "UT", text: "Utah"},
                { value: "VT", text: "Vermont"},
                { value: "VA", text: "Virginia"},
                { value: "WA", text: "Washington"},
                { value: "WV", text: "West Virginia"},
                { value: "WI", text: "Wisconsin"},
                { value: "WY", text: "Wyoming"},
            ],
            r_selectedState: { value: -1, text: "All"},

        };
    },
    methods: {
        /*
         * create a custom label to display
         */
         customLabel(option) {
             return option.text;
         },

         onSelect(option){
             this.r_selectedState = option;
             if(this.onChangeCallback !== undefined){
                 this.onChangeCallback(this.r_selectedState);
             }
         },

         onRemove(){
             this.r_selectedState = { value: -1, text: "All"};
             if(this.onChangeCallback !== undefined){
                 this.onChangeCallback(this.r_selectedState);
             }
         },

    },
}
</script>
