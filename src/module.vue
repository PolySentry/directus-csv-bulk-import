<template>
	<private-view title="Example Collection List">
		<v-list>
			<v-list-item v-for="col in collections" v-bind:key="col.collection">
				{{ col.collection }}
			</v-list-item>
		</v-list>
		<v-button v-on:click="logToConsole">Import</v-button>
		<input type="file" id="csv-file" name="csv-file">
	</private-view>
</template>

<script>
export default {
	data() {
		return {
			collections: null,
		};
	},
	methods: {
		inject: ['api'],
		logToConsole: async function () {
			const fileInput = document.querySelector('input[type="file"]');
			const formData = new FormData();
			formData.append('file', fileInput.files[0]);

			const result = await this.api.post('/utils/import/Articles', formData);
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