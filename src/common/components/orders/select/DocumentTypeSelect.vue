<template>

    <multiselect
          :value="r_selectedType"
          :options="r_allDocumentTypes"
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
          selectLabel="Document Type"
          deselectLabel=""
          placeholder="Document Type"
          @select="onSelect"
          @remove="onRemove">
     </multiselect>
<!-- <div></div> -->
</template>


<script>

 import Multiselect from '@suadelabs/vue3-multiselect'

export default {
    name: 'DocumentTypeSelect',
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
            r_allDocumentTypes: [
                { value: 0, text: "Select Type"},
                { value: 1, text: "ACI Auto Upload"},
                { value: 2, text: "AIR Certification"},
                { value: 3, text: "Appraisal Report"},
                { value: 4, text: "Attached Invoice"},
                { value: 5, text: "Auto Assignment Failure Log"},
                { value: 6, text: "Borrower Acknowledgment"},
                { value: 7, text: "Borrower Delivery Report"},
                { value: 8, text: "Cashed Check"},
                { value: 9, text: "Compliance Cert"},
                { value: 10, text: "Condo/HOA Cert"},
                { value: 11, text: "Construction Budget"},
                { value: 12, text: "Construction Plans/Specs"},
                { value: 13, text: "CrossCheck Report"},
                { value: 14, text: "EAD SSR"},
                { value: 15, text: "ENV"},
                { value: 16, text: "Fannie Mae SSR"},
                { value: 17, text: "FHASSR"},
                { value: 18, text: "Flood Certificate"},
                { value: 19, text: "FNM SSR"},
                { value: 20, text: "FRE SSR"},
                { value: 21, text: "Freddie Mac SSR"},
                { value: 22, text: "Hazard Disclosure"},
                { value: 23, text: "Inspection Document"},
                { value: 24, text: "Lease"},
                { value: 25, text: "Legal Description"},
                { value: 26, text: "Non-Photo Evidence"},
                { value: 27, text: "Other"},
                { value: 28, text: "Payment"},
                { value: 29, text: "Photo Evidence"},
                { value: 30, text: "Preliminary Title Report"},
                { value: 31, text: "Property Data"},
                { value: 32, text: "Questionnaire"},
                { value: 33, text: "RealEC Readiness Check Results"},
                { value: 34, text: "RealView Report"},
                { value: 35, text: "Review Certification"},
                { value: 36, text: "Review Checklist"},
                { value: 37, text: "Sales Contract"},
                { value: 38, text: "Sky Review Report"},
                { value: 40, text: "Special Instructions"},
                { value: 41, text: "Statement of Engagement"},
                { value: 42, text: "Value Reconsideration"},
            ],
            r_selectedType: { value: 0, text: "Select Type"},

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
             this.r_selectedType = option;
             if(this.onChangeCallback !== undefined){
                 this.onChangeCallback(this.r_selectedType);
             }
         },

         onRemove(){
             this.r_selectedType = { value: -1, text: "All"};
             if(this.onChangeCallback !== undefined){
                 this.onChangeCallback(this.r_selectedType);
             }
         },

    },
}
</script>
