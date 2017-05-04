
<template>
    <div class="row">
        <div class="col-xs-12">
            <div class="dataTables_paginate paging_simple_numbers" id="datatable-responsive_paginate">
                <ul class="pagination">
                    <li @click="$emit('paginatePreviousClick')" :class="[{disabled: pageCurrent == 1}]" class="paginate_button previous pointer">
                        <a aria-controls="datatable-responsive" data-dt-idx="0" tabindex="0">Previous</a>
                    </li>
                    <li class="paginate_button pointer" v-for="(page, index) in totalPages" @click="$emit('paginateNumberClick', index)" :class="[{active: (index+1)==pageCurrent}]">
                        <a aria-controls="datatable-responsive">{{index + 1}}</a>
                    </li>
                    <li @click="$emit('paginateNextClick')" :class="[{disabled: (totalPages == 0 || pageCurrent == totalPages)}]" class="paginate_button next pointer">
                        <a aria-controls="datatable-responsive" data-dt-idx="7" tabindex="0">Next</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'gPaginate',
        props: {
            pageCurrent: Number,
            dataLength: Number,
            pageShowItemNumber: Number
        },
        computed: {
            totalPages: function() {
                return Math.ceil(this.dataLength / this.pageShowItemNumber)
            }
        },
        data() {
            return {
                msg: 'Welcome to Your Vue.js App'
            }
        },
        filters: {
            capitalize: function(str) {
                return str.charAt(0).toUpperCase() + str.slice(1)
            }
        }
    }
</script>

<style scoped>
    .pointer {
        cursor: pointer;
    }
</style>
