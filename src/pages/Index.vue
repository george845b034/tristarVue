<template>
    <div class="index">
        <div class="x_panel">
            <div id="header-banner" data-id="99" style="margin-top: 0px; display: block;">
                <div class="container">
                    <div class="header-banner-content">
                        <h1 style="font-weight: bold;">Tristar</h1>
                    </div>
                    <section class="portfolio-filters">
                        <div class="portfolio-filters-cate">
                            <ul class="inline">
                                <li v-for="(item, index) in photosTag" @click="filterTag(index)"><a :class="{active: item['isActive']}">{{item['name']}}</a></li>
                            </ul>
                        </div>
                    </section>
                </div>
            </div>

            <ul id="photos" class="list-unstyled" :style="{ 'column-count': (filteredData.length <= 4) ? filteredData.length -1  : ''}">
                <li :data-src="photo.image"  v-for="photo in filteredData">
                    <img :src="photo.image"/>
                </li>
            </ul>
            <footer>
                <div class="pull-right">
                    © Copyright 2017. All Rights Reserved.
                </div>
                <div class="clearfix"></div>
            </footer>
        </div>
    </div>
        
</template>

<script>
    import firebaseApi from '../api/firebaseApi'

    export default {
        name: 'index',
        firebase: {
            photos: {
                source : firebaseApi.photosRef,
                readyCallback: function () {
                    this.$nextTick(function () {
                        lightGallery(document.getElementById('photos'));
                    })
                }
            },
            photosType: {
                source : firebaseApi.photosTypeRef,
                readyCallback: function ( data ) {
                    let tempObject = []
                    this.photosType.forEach(function(val, key){
                        tempObject[key] = {}
                        tempObject[key]['isActive'] = (key <= 0) ? true : false
                        tempObject[key]['name'] = val['.value'] 
                    })
                    this.photosTag = tempObject
                }
            }
        },
        data() {
            return {
                filterKey: 'All',
                photosTag: [],
                gallery: {}
            }
        },
        computed: {
            filteredData: function(){
                let data = this.photos
                let filterKey = this.filterKey && this.filterKey.toLowerCase()
                if (filterKey && filterKey != 'all') {
                    data = data.filter(function (row) {
                        return Object.keys(row).some(function (key) {
                            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
                        })
                    })
                }
                return data
            }
        },
        methods: {
            filterTag: function( inIndex ) {
                
                window.lgData[document.getElementById('photos').getAttribute('lg-uid')].destroy(true);

                let self = this
                let tempObject = []
                let tempKey = ''
                this.photosTag.forEach(function(val, key){
                    tempObject[key] = {}
                    tempObject[key]['isActive'] = (key == inIndex) ? true : false
                    tempObject[key]['name'] = val['name'] 
                    if (key == inIndex) {
                        tempKey = val['name']
                    }
                })
                this.filterKey = tempKey
                this.photosTag = tempObject
                
                this.$nextTick(function () {
                    lightGallery(document.getElementById('photos'));
                })
            }
        },
        mounted() {
            document.body.classList.add('login')
            document.body.classList.remove('nav-md')
            
        }
    }
</script>

<style scoped>
    footer {
         margin-left: 0px; 
         padding: 20px;
    }
    #gallery {
        padding-bottom: 5px;
    }
    .portfolio-filters-cate li a {
        color: #B0B0B0;
        display: inline-block;
        border: 1px solid #E0E0E0;
        padding: 5px 15px;
        border-radius: 18px;
        height: 30px;
        line-height: 20px;
        cursor: pointer;
        box-shadow: 1px 1px 5px 1px #eeeeee;
        -moz-box-shadow: 1px 1px 5px 1px #eeeeee;
        -webkit-box-shadow: 1px 1px 5px 1px #eeeeee;
        -webkit-transition: 500ms;
        -moz-transition: 500ms;
        -o-transition: 500ms;
        transition: 500ms;
    }
    .portfolio-filters-cate li a.active {
        color: #000000;
        border: 1px solid #d0d0d0;
    }
    .portfolio-filters-cate li a:hover {
        color: #7ab80e;
        border: 1px solid #7ab80e;
    }
    .portfolio-filters {
        margin-bottom: 20px;
        text-align: center;
    }
    ul.inline {
        margin: 0;
        padding: 0;
        list-style: none;
    }
    ul.inline li {
        display: inline-block;
        padding: 0;
        margin: 0 5px 0 0;
    }



    #photos {
        /* Prevent vertical gaps */
        line-height: 0;
        
        -webkit-column-count: 5;
        -webkit-column-gap:   0px;
        -moz-column-count:    5;
        -moz-column-gap:      0px;
        column-count:         5;
        column-gap:           0px;
    }

    #photos img {
        /* Just in case there are inline attributes */
        width: 100% !important;
        height: auto !important;
        padding: 5px;
    }
    

    @media (max-width: 1200px) {
        #photos {
            -moz-column-count:    4;
            -webkit-column-count: 4;
            column-count:         4;
        }
    }
    @media (max-width: 1000px) {
        #photos {
            -moz-column-count:    3;
            -webkit-column-count: 3;
            column-count:         3;
        }
    }
    @media (max-width: 800px) {
        #photos {
            -moz-column-count:    2;
            -webkit-column-count: 2;
            column-count:         2;
        }
    }
    @media (max-width: 400px) {
        #photos {
            -moz-column-count:    1;
            -webkit-column-count: 1;
            column-count:         1;
        }
    }

</style>
