<template>

    <div>
        <HeaderNavBar/>
        <div>
            <LeftSideBar
                :show="true"
                :firstLoad="false"
                :active="5"/>
            <div class="main-body animated bounce">
                <div>
                    <OrdersTableList/>
                </div>
            </div>
        </div>
    </div>

</template>


<script>

import HeaderNavBar from '../../common/components/app/HeaderNavBar.vue'
import LeftSideBar from '../../common/components/app/LeftSideBar.vue'

import OrdersTableList from '../../common/components/orders/OrdersTableList.vue'

export default {
    name: 'OrdersList',
    components: {
        HeaderNavBar,
        LeftSideBar,
        OrdersTableList,
    },
    data(){
        return{

        }
    },
    created(){
    },
    mounted(){
        //this.changeLoadingState(true);
        //this.changeLoadingState(false);
    },
    methods: {

    }
}

</script>
