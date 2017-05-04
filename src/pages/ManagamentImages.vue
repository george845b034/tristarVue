<template>
    <div class="main">
    
        <div class="right_col" role="main">
            <div class="">
                <div class="page-title">
                    <div class="title_left">
                        <h3>Images List Page</h3>
                    </div>
    
                    <div class="title_right">
                        <div class="col-md-5 col-sm-5 col-xs-12 form-group pull-right top_search">
                            <div class="input-group">
                                <input type="text" class="form-control" placeholder="Search for..." v-model="searchQuery">
                                <span class="input-group-btn">
                                <button class="btn btn-default" type="button">Go!</button>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
    
                <div class="clearfix"></div>
    
                <div class="row">
                    <div class="col-md-12 col-sm-12 col-xs-12">
                        <div class="x_panel">
                            <div class="x_title">
                                <h2>Images List Page</h2>
                                <div class="clearfix"></div>
                            </div>
                            <div class="x_content">
                                <loading 
                                    :show="showLoading" 
                                    :showTxt="'loading'"
                                ></loading>
                                <tableData 
                                    :data="gridData" 
                                    :columns="gridColumns" 
                                    :insertColumns="insertColumns" 
                                    :filter-key="searchQuery" 
                                    :isPaginate="true" 
                                    :isEdit="true"
                                >
                                </tableData>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <modal v-if="showModal" @close="showModal = false" :deletekey="deleteKey"></modal>
    </div>
</template>

<script>
    import tableData from '../components/tableData'
    import loading from '../components/loading'
    import modal from '../components/modal'
    import firebaseApi from '../api/firebaseApi'
    
    export default {
        name: 'managamentImages',
        firebase: {
            photos: {
                source : firebaseApi.photosRef,
                readyCallback: function () {
                    this.showLoading = false
                }
            },
            photosSchema: firebaseApi.photosSchemaRef
        },
        data() {
            return {
                showLoading: true,
                showModal: false,
                searchQuery: '',
                gridColumns: [],
                insertColumns: [],
                gridData: [],
                deleteKey: ''
            }
        },
        computed: {
            getEMail() {
                return this.email
            }
        },
        methods: {
            firebaseInsert: function(val) {
                let imageName = val['name']
                let image = val['image']
                
                if (image != '') {
                    firebaseApi.uploadRef.child(imageName).putString(image, 'data_url').then(function(snapshot) {
                        val['image'] = snapshot.downloadURL
                        firebaseApi.photosRef.push(val)
                    })
                }else{
                    val['image'] = ''
                    firebaseApi.photosRef.push(val)
                }
            },
            firebaseUpdate: function(val) {
                let key = val['.key']
                delete val['.key']
                let imageName = val['name']
                let image = val['image']
                if (image != '' && image.indexOf('base64') != -1) {
                    firebaseApi.uploadRef.child(imageName).putString(image, 'data_url').then(function(snapshot) {
                        val['image'] = snapshot.downloadURL
                        firebaseApi.photosRef.child(key).set(val)
                    })
                }else{
                    firebaseApi.photosRef.child(key).set(val)
                }
            },
            firebaseDelete: function( inKey ) {
                if (this.photos != undefined) {
                    this.photos.forEach(function(val, key){
                        if (val['.key'] == inKey) {
                            if (val['image'] != '' && val['image'] != undefined) {
                                firebaseApi.uploadRef.child(val['name']).delete()
                            }
                            firebaseApi.photosRef.child(inKey).remove()
                        }
                    })
                }
            },
            processPhotosData: function(data) {
                this.$set(this, 'gridData', data)
            },
            processPhotosSchemaData: function(data) {
                if (data.length > 0 && this.gridColumns.length == 0) {
                    let tempColumns = []
                    Object.keys(data).some(function(key) {
                        tempColumns.push(data[key]['name'])
                    })
                    this.$set(this, 'gridColumns', tempColumns)
                    this.$set(this, 'insertColumns', data)
                }
            }
        },
        components: {
            tableData,
            loading,
            modal
        },
        created() {
            let self = this

            this.$watch('photos', function(data) {
                this.processPhotosData(data)
            })
            this.$watch('photosSchema', function(data) {
                this.processPhotosSchemaData(data)
            })
            this.$bus.$on('deleteEvent', function(key) {
                self.showModal = true
                self.deleteKey = key
            });
            this.$bus.$on('deleteSubmit', function() {
                self.firebaseDelete(self.deleteKey)
                self.showModal = false
            });
        },
        mounted() {
            if (this.photos.length > 0) {
                this.processPhotosData(this.photos)
            }
            if (this.photosSchema.length > 0) {
                this.processPhotosSchemaData(this.photosSchema)
            }
        }
    }
</script>

<style scoped>
    
</style>
