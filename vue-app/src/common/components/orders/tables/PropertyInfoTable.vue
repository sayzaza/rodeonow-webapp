<template>

    <table id="property-info" class="order-table">
        <thead>
            <tr>
                <th>Property Info</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <!-- TODO one line -->
                <td class="order__text" VALIGN=TOP>
                    <b>Property Type</b>
                    <span class="order__details">{{ getDisplayText(propertyInfo.propertyType) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                </td>
            </tr>
            <tr>
                <!-- TODO one line -->
                <td class="order__text" VALIGN=TOP>
                    <b>Property Address</b>
                    <span class="order__details">{{ getDisplayText(propertyInfo.propertyAddress) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                </td>
            </tr>
            <tr>
                <td class="order__text" VALIGN=TOP>
                    <b>Property County</b>
                    <span class="order__details">{{ getDisplayText(propertyInfo.propertyCounty) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                    <b>County Classification</b>
                    <span class="order__details">{{ getDisplayText(propertyInfo.countyClassification) }}</span>
                </td>
            </tr>
            <tr>
                <!-- TODO one line -->
                <td class="order__text" VALIGN=TOP>
                    <b>Legal Description</b>
                    <span class="order__details">{{ getDisplayText(propertyInfo.legalDescription) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                </td>
            </tr>
            <tr>
                <!-- TODO one line -->
                <td class="order__text" VALIGN=TOP>
                    <b>Occupancy Type</b>
                    <span class="order__details">{{ getDisplayText(propertyInfo.occupancyType) }}</span>
                </td>
                <td class="order__text" VALIGN=TOP>
                </td>
            </tr>
        </tbody>
    </table>

</template>


<script>

export default {
    name: 'PropertyInfoTable',
    props: {
        propertyInfo: Object,
    },
    methods: {
    }
}
</script>
