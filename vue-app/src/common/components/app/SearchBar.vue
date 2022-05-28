<template>

    <multiselect
          ref="search_select"
          v-model="r_value"
          :value="{}"
          :options="r_options"
          :close-on-select="false"
          :clear-on-select="false"
          :hide-selected="false"
          :open-direction="selectDirection"
          :preserve-search="true"
          :multiple="false"
          :searchable="true"
          group-values="selections"
          group-label="group"
          :group-select="false"
          :preselect-first="false"
          track-by="id"
          :custom-label="customLabel"
          :show-labels="false"
          selectLabel="Click to search."
          deselectLabel=""
          placeholder="Search ..."
          @open="onOpen"
          @select="onSelect">
     </multiselect>

</template>


<script>
import { mapMutations } from 'vuex'
import Multiselect from 'vue-multiselect'

export default {
    name: 'SearchBar',
    components: {
        Multiselect
    },
    props: {
        selectDirection: { // bottom or top
            type: String,
            default: 'bottom',
        },
        value: String,
        onChangeCallback: Function,
    },
    data() {
        return {
            r_options: {}, // all search options in dropdown
            r_value: this.value,
        };
    },
    mounted(){
    },
    methods: {
        ...mapMutations([
          'setSidebarCollapseStatus',
        ]),

        /*
         * create a custom label to display
         */
         customLabel(option) {
             if(option.long === undefined){
                 return option.text;
             }
             return option.text + " (" + option.long + ")";
         },

        /*
         * if this was selected
         */
         onSelect(option) {
             switch (option.search) {
                 case 'page':
                     this.goToPage(option);
                     break;
                 case 'users':
                     this.searchUser(option);
                     break;
                 case 'appraisals':
                     this.searchAppraisal(option);
                     break;
                 case 'appraisers':
                    this.searchAppraiser(option);
                    break;
                 case 'properties':
                    this.searchProperty(option);
                    break;
                 default:
             }
         },

         onOpen() {
             if (!this.$store.isSidebarCollapsed) {
                 this.setSidebarCollapseStatus(true)
             }
         },

         goToPage(option){
            //if(this.onChangeCallback === undefined)
            //    return false;
            console.log("go to pages", option)
            // switch through all pages and go to page that's selected
         },

         searchUser(option){
             console.log("go to user", option)
         },

         searchAppraisal(option){
             console.log("go to appraisal", option)
         },

         searchAppraiser(option){
             console.log("go to appraiser", option)
         },

         searchProperty(option){
             console.log("go to property", option)
         },
    },
    created(){
        this.r_options = [
            {
                group: 'Pages',
                selections: [
                    {id:'2', text:'Portal', search: 'page'},
                    {id:'3', text:'Option 111', search: 'page'},
                    {id:'4', text:'Option 112', search: 'page'},
                    {id:'5', text:'Option 113', search: 'page'},
                    {id:'6', text:'Option 114', search: 'page'},
                    {id:'7', text:'Option 115', search: 'page'},
                    {id:'8', text:'Option 116', search: 'page'},
                    {id:'1', text:'Option 117', search: 'page'},
                ]
            },
            {
                group: 'Users',
                selections: [
                    {id:'51', text:'Option 220', search: 'users'},
                    {id:'52', text:'Option 221', search: 'users'},
                    {id:'53', text:'Option 222', search: 'users'},
                    {id:'54', text:'Option 223', search: 'users'},
                ]
            },
            {
                group: 'Appraisals',
                selections: [
                    {id:'102', text:'Option 333', search: 'appraisals'},
                ]
            },
            {
                group: 'Appraisers',
                selections: [
                    {id:'105', text:'Option 444', search: 'appraisers'},
                ]
            },
            {
                group: 'Properties',
                selections: [
                    {id:'107', text:'Option 555', search: 'properties'},
                ]
            }
        ];
    }
}

</script>
