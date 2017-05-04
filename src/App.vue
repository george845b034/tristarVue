<template>
	<div id="app">
        <div class="container body">
            <div class="main_container">
				<router-view name="leftMenu"></router-view>
				<router-view name="topNavigation"></router-view>
				<router-view name="content"></router-view>
				<router-view name="footer"></router-view>
            </div>
        </div>
	</div>
</template>

<script>


export default {
	name: 'app'
}
</script>

<style>
#app {
}
</style>
