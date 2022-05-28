<template>

    <div class="col col-md-6">
        <div id="card-errors" role="alert"></div>
        <div ref="stripe_card_element"></div>

        <button @click="onSubmit($event)">Save</button>
    </div>

</template>


<script>

import {loadStripe} from '@stripe/stripe-js/pure';

export default {
    name: 'BillingComponent',
    data(){
        return{
            r_stripe: undefined,
            r_card: undefined,
        }
    },
    created(){
        this.onCreate();
    },
    methods: {

        onSubmit(event){
            event.preventDefault();
            this.r_stripe.createToken()
                /*.then(function(result) {
                    console.log(result)
                    if (result.error) {
                      var errorElement = document.getElementById('card-errors');
                      errorElement.textContent = result.error.message;
                    } else {
                        //this.stripeTokenHandler(result.token);
                    }
                })
                .catch((ex) => {
                    console.log(ex)
                })*/
        },

        stripeTokenHandler(token) {
              // Insert the token ID into the form so it gets submitted to the server
              var form = document.getElementById('payment-form');
              var hiddenInput = document.createElement('input');
              hiddenInput.setAttribute('type', 'hidden');
              hiddenInput.setAttribute('name', 'stripeToken');
              hiddenInput.setAttribute('value', token.id);
              form.appendChild(hiddenInput);
              form.submit();
        },

        async onCreate(){
            // Stripe.js will not be loaded until `loadStripe` is called
            this.r_stripe = await loadStripe('pk_test_51JLcElBjESVBKAgttY16TlZVcgLcDGFzmNe2MAdRePbl5CzJSxsiJ1iaPrPZYPuYrwirQrymoVxBZaO2J6QdFdje00ckYd4HHy');

            // Custom styling can be passed to options when creating an Element.
            let elements = this.r_stripe.elements();
            let style = {
              base: {
                color: '#32325d',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                  color: '#aab7c4'
                }
              },
              invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
              }
            };

            // Create an instance of the card Element.
            this.r_card = elements.create('card', {style: style});
            this.r_card.mount(this.$refs.stripe_card_element);
        },
    }
}
</script>
