<template>

    <table id="borrower-info" class="order-table">
        <thead>
            <tr>
                <th>Borrower Info</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <!-- TODO one line -->
                <td class="order__text" VALIGN=TOP>
                    <b>Borrower (and Co-Borrower)</b>
                    <span class="order__details">{{ borrowerInfo.name }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Borrower Email</b>
                    <span class="order__details">{{ borrowerInfo.email }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Borrower Phone</b>
                    <span class="order__details">{{ getDisplayText(borrowerInfo.phone) }}</span>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Borrower Work Phone</b>
                    <span class="order__details">{{ getDisplayText(borrowerInfo.workPhone) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>Borrower Cell Phone</b>
                    <span class="order__details">{{ getDisplayText(borrowerInfo.cellPhone) }}</span>
                </td>
            </tr>
        </tbody>
    </table>

</template>


<script>

export default {
    name: 'BorrowerInfoTable',
    props: {
        borrowerInfo: Object,
    },
    methods: {
    }
}

</script>
