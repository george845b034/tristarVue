
<template>
    <div>
        <transition name="slide-fadeIn">
            <form v-if="isInputFormShow" class="form-horizontal form-label-left" @submit.prevent="inputFormSubmit" @keyup.enter="inputFormSubmit">
    
                <div class="form-group" v-for="(val, index) in inputColumns" v-if="val['name']!='Edit'">
                    <label class="control-label col-md-3 col-sm-3 col-xs-12">
                        {{ val['name'] | capitalize }} <span class="required">*</span>
                    </label>
                    <div class="col-md-6 col-sm-6 col-xs-12" v-if="val['type'] == 'file'">
                        <label for="imageFile">
                            <input type="file" accept="image/*" id="imageFile" v-show="false" @change="fileChange">
                            <img :src="processImageSrc(formData, val['name'])" ref="displayImage" width="180"/>
                        </label>
                    </div>
                    <div class="col-md-6 col-sm-6 col-xs-12" v-else-if="val['type'] == 'select'">
                        <select class="form-control" v-model="formData[val['name']]">
                            <option value="">choose...</option>
                            <option v-for="item in photosType" :value="item['.value']">{{item['.value']}}</option>
                        </select>
                    </div>
                    <div class="col-md-6 col-sm-6 col-xs-12" v-else>
                        <input type="text" required="required" :readonly="val['isRead']" v-model="formData[val['name']]" class="form-control col-md-7 col-xs-12">
                    </div>
                </div>
                <div class="ln_solid"></div>
                <div class="form-group">
                    <div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">
                        <button class="btn btn-primary" @click.prevent="$emit('close')">Cancel</button>
                        <button type="submit" class="btn btn-success">Submit</button>
                    </div>
                </div>
            </form>
        </transition>
    </div>
</template>

<script>
    import firebaseApi from '../api/firebaseApi'

    export default {
        name: 'inputForm',
        firebase: {
            photosType: firebaseApi.photosTypeRef
        },
        props: {
            inputColumns: Array,
            isInputFormShow: Boolean,
            inputData: Object
        },
        computed: {
            // processFormData: function() {
            //     let tempObject = {}
            //     this.inputColumns.forEach(function (key) {
            //         console.log(key)
            //         // tempObject[key] = ''
            //     })
            //     this.formData = tempObject
            // }
        },
        data() {
            return {
                formData: {}
            }
        },
        filters: {
            capitalize: function(str) {
                return str.charAt(0).toUpperCase() + str.slice(1)
            }
        },
        methods: {
            inputFormSubmit: function() {
                let tempForm = document.getElementsByTagName('form')[0]
                if (tempForm.checkValidity()) {
                    this.$emit('buttonSubmit', this.formData)
                }
            },
            fileChange: function() {
                let self = this
                let files = this.$el.querySelector('#imageFile').files
                if (files.length > 0) {
                    let reader = new FileReader()
                    reader.readAsDataURL(files[0])
                    reader.onload = function() {
                        if (self.$refs.displayImage != undefined) {
                            self.$refs.displayImage[0].src = reader.result
                            self.formData['image'] = reader.result
                            self.formData['name'] = self.uuid()
                        }
                    }
                    reader.onerror = function(error) {
                        console.log('Error: ', error)
                    }
                }
            },
            processImageSrc: function( inObject, inKey ) {

                let tempString = 'http://placehold.it/180'

                if (inKey in inObject) {
                    if (inObject[inKey] != '') {
                        tempString = inObject[inKey]
                    }
                }
                return tempString
            },
            processColumns: function(data) {
                let tempObject = {}
                data.forEach(function(val){
                    tempObject[val['name']] = ''
                })
                this.formData = tempObject
            },
            processData: function(data) {
                let tempObject = {}
                Object.keys(data).some(function(key){
                    tempObject[key] = data[key]
                })
                this.formData = tempObject
            },
            processDataReset: function() {
                let tempObject = {}
                Object.keys(this.formData).some(function(key){
                    if (key != ".key") {
                        tempObject[key] = ""
                    }
                })
                this.formData = tempObject
            },
            uuid: function() {
                var s = [];
                var hexDigits = "0123456789abcdef";
                for (var i = 0; i < 36; i++) {
                    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
                }
                s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
                s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
                s[8] = s[13] = s[18] = s[23] = "_";
            
                var uuid = s.join("");
                return uuid;
            }
        },
        watch: {
            inputColumns(data) {
                this.processColumns(data)
            },
            inputData(data) {
                if (Object.keys(data).length > 0) {
                    this.processData(data)
                }else{
                    this.processDataReset()
                }
            }
        },
        mounted() {
            if (this.inputColumns.length > 0) {
                this.processColumns(this.inputColumns)
            }
            if (this.inputData.length > 0) {
                this.processData(this.inputData)
            }
        }
    }
</script>

<style scoped>
    .slide-fadeIn-enter-active {
        transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    
    .slide-fadeIn-leave-active {
        transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    
    .slide-fadeIn-enter,
    .slide-fadeIn-leave-active {
        transform: translateX(100px);
        opacity: 0;
    }
</style>
