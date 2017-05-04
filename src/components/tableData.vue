<template>
    <div>
        <transition name="slide-fadeOut">
            <div v-if="isTableShow">
                <button type="button" class="btn btn-primary" @click="tableShow()">新增</button>
                <table class="table table-striped jambo_table bulk_action" v-show="data.length > 0">
                    <thead>
                        <tr>
                            <th v-for="(key, index) in dataColumns" :class="{alignCenter:index == dataColumns.length-1}"><!--@click="sortBy(key)"-->
                                {{ key | capitalize }}
                                <span v-if="index != dataColumns.length-1" class="sortIcon fa" :class="sortOrders[key] > 0 ? 'fa-sort-asc' : 'fa-sort-desc'"></span>
                            </th>
                        </tr>
                    </thead>
                    <draggable :list="pageData" :element="'tbody'" @end="onEnd">
                        <tr v-for="(entry, index) in filteredData" :key="entry">
                            <td v-for="(key, colIndex) in dataColumns" :align="isAlign(colIndex)">
                                <div v-if="key == 'image'"><img :src="entry[key]" width="90" height="45"></div>
                                <div v-else>{{entry[key]}}</div>
                                
                                <button v-if="colIndex == dataColumns.length-1" type="button" class="btn btn-warning" @click="tableShow(index)">修改</button>
                                <button v-if="colIndex == dataColumns.length-1" type="button" class="btn btn-danger" @click="deleteRow(entry['.key'])">刪除</button>
                            </td>
                        </tr>
                    </draggable>
                    <!--<tbody>
                        <tr v-for="(entry, index) in filteredData">
                            <td v-for="(key, colIndex) in dataColumns" :align="isAlign(colIndex)">
                                <div v-if="key == 'image'"><img :src="entry[key]" width="90" height="45"></div>
                                <div v-else>{{entry[key]}}</div>
                                
                                <button v-if="colIndex == dataColumns.length-1" type="button" class="btn btn-warning" @click="tableShow(index)">修改</button>
                                <button v-if="colIndex == dataColumns.length-1" type="button" class="btn btn-danger" @click="deleteRow(entry['.key'])">刪除</button>
                            </td>
                        </tr>
                    </tbody>-->
                </table>
                <g-paginate v-if="isPaginate"  v-show="data.length > 0"
                    :pageCurrent="pageCurrent"
                    :dataLength="this.data.length"
                    :pageShowItemNumber="this.pageShowItemNumber"
                    @paginatePreviousClick="paginatePreviousClick"
                    @paginateNextClick="paginateNextClick"
                    @paginateNumberClick="paginateNumberClick"
                ></g-paginate>
            </div>
        </transition>
        <input-form 
            :is-input-form-show="isInsertShow" 
            :input-columns="insertColumns" 
            :input-data="insertData"
            @close="insertShow()"
            @buttonSubmit="insertSubmit"
        ></input-form>
    </div>
</template>

<script>

import inputForm from './inputForm'
import gPaginate from './gPaginate'
import draggable from 'vuedraggable'

export default {
    name: 'tableData',
    components: {
        inputForm,
        gPaginate,
        draggable
    },
    props: {
        data: Array,
        columns: Array,
        insertColumns: Array,
        filterKey: String,
        isPaginate: Boolean,
        isEdit: Boolean
    },
    data () {
        var tempData = this.data
        return {
            isTableShow: true,
            isInsertShow: false,
            insertData: {},
            editCurrentData: {},
            dataColumns: [],
            isEditPage: false,
            filterData: tempData,
            sortKey: 'sort',
            sortOrders: {},
            pageShowItemNumber: 10,
            pageCurrent: 1,
            pageData:[]
        }
    },
    computed: {
        filteredData: function () {
            var sortKey = this.sortKey
            var filterKey = this.filterKey && this.filterKey.toLowerCase()
            var order = this.sortOrders[sortKey] || 1
            var data = this.filterData
            if (filterKey) {
                data = data.filter(function (row) {
                    return Object.keys(row).some(function (key) {
                        return String(row[key]).toLowerCase().indexOf(filterKey) > -1
                    })
                })
            }
            if (sortKey) {
                data = data.slice().sort(function (a, b) {
                    a = a[sortKey]
                    b = b[sortKey]
                    return (a === b ? 0 : a > b ? 1 : -1) * order
                })
            }
            data = ( data.slice((this.pageCurrent-1)*this.pageShowItemNumber, this.pageCurrent*this.pageShowItemNumber) )
            this.pageData = data
            return data
        },
        processInsertData: function() {
            var insertObject = {}
            var self = this
            this.insertColumns.forEach(function (key) {
                if (self.editCurrentData[key['name']] != undefined) {
                    insertObject[key['name']] = self.editCurrentData[key['name']]
                }
            })
            return this.insertData = insertObject
        },
        processSortData: function() {
            var sortOrders = {}
            this.columns.forEach(function (key) {
                sortOrders[key] = 1
            })
            this.sortOrders = sortOrders
        }
    },
    filters: {
        capitalize: function (str) {
            return str.charAt(0).toUpperCase() + str.slice(1)
        }
    },
    methods: {
        sortBy: function (key) {
            this.sortKey = key
            this.sortOrders[key] = this.sortOrders[key] * -1
        },
        isAlign: function( index ) {
            return (index == this.dataColumns.length-1) ? 'right' : 'left'
        },
        tableShow: function( inIndex = -1 ) {
            this.isTableShow = !this.isTableShow
            let self = this
            if (inIndex > -1) {
                this.isEditPage = true
                this.editCurrentData = this.filteredData[inIndex]
                this.processInsertData
                this.insertData['.key'] = this.filteredData[inIndex]['.key']
            }else{
                this.editCurrentData = {}
                self.isEditPage = false
                this.processInsertData
            }

            setTimeout(function() {
                self.isInsertShow = !self.isInsertShow
            }, 800);
        },
        insertShow: function() {
            this.isInsertShow = !this.isInsertShow
            let self = this
            setTimeout(function(){
                self.isTableShow = !self.isTableShow
            }, 800)
        },
        paginateNumberClick: function (key) {
            this.pageCurrent = key+1
        },
        paginatePreviousClick: function () {
            if ( this.pageCurrent > 1 ) {
                this.pageCurrent--
            }
        },
        paginateNextClick: function () {
            if ( this.pageCurrent < this.totalPages ) {
                this.pageCurrent++
            }
        },
        insertSubmit: function( payload ) {
            if (this.isEditPage) {
                if (typeof this.$parent.firebaseUpdate == 'function') {
                    console.log(payload)
                    this.$parent.firebaseUpdate(payload)
                    this.insertShow()
                }
            }else{
                if (typeof this.$parent.firebaseInsert == 'function') {
                    this.$parent.firebaseInsert(payload)
                    this.insertShow()
                }
            }
        },
        deleteRow: function( inKey ) {
            this.$bus.$emit('deleteEvent', inKey)
        },
        processColumns: function( inData ) {
            let tempArray = []
            for(var tempData in inData) {
                tempArray.push(inData[tempData])
            }
            if (this.isEdit) {
                tempArray.push('Edit')
            }
            this.dataColumns = tempArray
        },
        onEnd: function(evt){

            let index = (this.pageCurrent-1)*this.pageShowItemNumber
            let self = this
                    
            this.pageData.forEach(function(val){
                let newObject = Object.assign({}, val)
                newObject['sort'] = index
                if (typeof self.$parent.firebaseInsert == 'function') {
                    self.$parent.firebaseUpdate(newObject)
                }
                index++
            })

        }
    },
    watch: {
        columns(data) {
            this.processColumns(data)
        },
        data(data) {
            this.filterData = data
        }
    },
    mounted() { 
        if (this.columns.length > 0) {
            this.processColumns(this.columns)
        }
        if (this.data.length > 0) {
            this.filterData = this.data
        }
    }
}
</script>

<style scoped>
.slide-fadeOut-enter-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fadeOut-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fadeOut-enter, .slide-fadeOut-leave-active {
    transform: translateX(100px);
    opacity: 0;
}

.sortIcon {
    padding-left: 5px;
}
.pagination {
    display: block;
    margin: 0px;
}
.alignCenter {
    text-align: center;
}
</style>
