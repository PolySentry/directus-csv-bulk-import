<template>
	<private-view title="Bulk import">
		<v-select v-model="selected" :items="collections" />
		<v-upload :collection="selected"/>
 	</private-view>
</template>

<script lang="ts">
import { parseCollectionName } from './util';
import vUpload from './v-upload/v-upload.vue';
export default {
  components: { vUpload },
	data() {
		return {
			collections: [],
			selected: '',
		};
	},
	inject: ['api'],
	mounted() {
		// this.api is an authenticated axios instance
		this.api.get('/collections?limit=-1').then((res) => {
			const collections = res.data.data;
			console.log(collections);
			
			this.collections = collections.map((collection) => ({
				text: parseCollectionName(collection.collection), 
				value: collection.collection
			}));
			console.log(this.collections);
		});
	},
};
</script>