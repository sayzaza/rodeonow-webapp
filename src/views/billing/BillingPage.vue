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
                    <Billing/>
                </div>
            </div>
        </div>
    </div>

</template>

<script>

import HeaderNavBar from '../../common/components/app/HeaderNavBar.vue'
import LeftSideBar from '../../common/components/app/LeftSideBar.vue'
import Billing from '../../common/components/billing/Billing.vue'

export default {
    name: 'BillingPage',
    components: {
        HeaderNavBar,
        LeftSideBar,
        Billing,
    },
    props: {
    },
    mounted(){
        this.changeLoadingState(true);
        this.changeLoadingState(false);
    },
    methods: {
    }
}

</script>
