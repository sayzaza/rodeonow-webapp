<template>
    <div v-if="this.$store.state.isLoading" ref="loading" id="preloader-wrapper">
        <!-- <div class="pre-loader"></div> -->
        <!-- <PulseLoader :loading="this.$store.state.isLoading" :color="'#2c3346'"></PulseLoader> -->
    </div>
</template>

<script>

import { mapMutations } from 'vuex'
// import PulseLoader from 'vue-spinner/src/PulseLoader.vue';

export default {
    name: 'LoadingIndicator',
    components: {
        // PulseLoader
    },
    data(){
        return{
            r_timer: undefined,
            r_loading: true,
        }
    },
    created(){
        this.onCreate();
        //this.startTimer();
    },
    mounted() {
        //this.beginLoading();
    },
    destroyed(){
        this.unsubscribe();
    },
    methods: {
        ...mapMutations([
            'updateLoadingState',
        ]),

        /*
         * on create watch for loading status to change
         */
        onCreate(){
            this.unsubscribe = this.$store.subscribe((mutation) => {
                if (mutation.type === 'updateLoadingState') {
                    if(mutation.payload === true){
                        console.log("start indicator");
                        this.startTimer();
                    } else{
                        console.log("stop indicator");
                        this.endTimer();
                    }
                }
            })
        },


        /*
         * set 30 second timeout
         */
        startTimer(){
            let self = this;
            this.r_timer = setTimeout(function () {
                if (self.r_timer !== undefined && self.$store.state.isLoading) {
                    self.changeLoadingState(false);
                }
                clearTimeout(self.r_timer);
            }, 30000)
        },

        endTimer(){
            if (this.r_timer !== undefined && this.$store.state.isLoading) {
                clearTimeout(this.r_timer);
            }
        },



        /*
         * show loading
         */
        beginLoading(){
            this.r_loading = true;
            let self = this;
            this.r_timer = setTimeout(function () {
                let obj = self.$refs.loading;
                if (obj) {
                    self.r_loading = false;
                    self.updateLoadingState(false, false);
                }
                console.log('loading indicator: time out')
            }, 30000)
        },

        /*
         * fade out
         */
        fadeOutEffect() {
            let op = 1;  // initial opacity
            let fadeTarget = this.$refs.loading;
            let self = this;
            let timer = setInterval(function () {
                if (op <= 0.1){
                    clearInterval(timer);
                    self.r_loading = false;

                    if (self.r_timer) {
                        console.log('loading indicator: timer canceled')
                        clearTimeout(self.r_timer);
                    }
                }
                if(fadeTarget){
                    fadeTarget.style.opacity = op;
                }
                op -= 0.3;
            }, 100);
        }
    }
}

</script>

<style scoped>

@import "../../../assets/font/minimo/style.css";

/*Preloader*/
#preloader-wrapper {
    background-color: transparent; /* fff transparent */
    bottom: auto;
    height: 100%;
    left: auto;
    position: fixed;
    right: auto;
    top: auto;
    width: 100%;
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
}

.pre-loader {
    opacity: 1;
    transition: 5s opacity;
    width: 130px;
    height: 130px;
    background: #2c3346;
    border-radius: 5%;
    animation: loading 6s infinite reverse linear;
    position: relative;
    font-family: "Minimo Regular" !important;
}

.pre-loader:before {
    content: "n";
    position: absolute;
    top: 44%;
    left: 50%;
    display: block;
    font-size: 70px;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    color: #fff;
}


@keyframes loading {
    /* white */
    0% {
        box-shadow: inset 0 0 0 0 #2c3346;
    }
    24.99% {
        background: #2c3346;
        box-shadow: inset 0 0 0 160px #2c3346;
    }
    /* blue */
    25% {
        box-shadow: inset 0 0 0 0 #000;
    }
    49.99% {
        background: #000;
        box-shadow: inset 0 0 0 160px #000;
    }
    /* white */
    50% {
        box-shadow: inset 0 0 0 0 #2c3346;
    }
    74.99% {
        background: #2c3346;
        box-shadow: inset 0 0 0 160px #2c3346;
    }
    /* black (blue) */
    75% {
        box-shadow: inset 0 0 0 0 #000;
    }
    100% {
        background: #2c3346;
        box-shadow: inset 0 0 0 160px #2c3346;
    }
}

</style>
