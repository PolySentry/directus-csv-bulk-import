<template>
	<private-view title="Example Collection List">
		<!-- <v-list>
			<v-list-item v-for="col in collections" v-bind:key="col.collection">
				{{ col.collection }}
			</v-list-item>
		</v-list> -->
		
		<input type="file" id="csv-file" name="csv-file">
		<select v-model="selected">
  			<option disabled value="">Please select one</option>
  			<option v-for="col in collections" v-bind:key="col.collection" >{{ col.collection }}</option>
		</select>
		<span>Selected: {{ selected }}</span>
		<v-button v-on:click="logToConsole">Import</v-button>
	</private-view>
</template>

<script>
export default {
	data() {
		return {
			collections: [],
			selected: '',
		};
	},
	methods: {
		inject: ['api'],
		logToConsole: async function () {
			console.log(this.selected);
			console.log(this.collections);
			const fileInput = document.querySelector('input[type="file"]');
			const formData = new FormData();
			formData.append('file', fileInput.files[0]);

			const result = await this.api.post(`/utils/import/${this.selected}`, formData);
			console.log(result);
		},
	},
	inject: ['api'],
	mounted() {
		// this.api is an authenticated axios instance
		this.api.get('/collections?limit=-1').then((res) => {
			this.collections = res.data.data;
		});
	},
};
</script>