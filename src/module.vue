<template>
	<private-view title="Bulk Import">
		<template #title-outer:prepend>
			<v-button class="header-icon" rounded disabled icon secondary>
				<v-icon name="publish"/>
			</v-button>
		</template>

		<template #title>
			<h1 class="type-title">Bulk Import</h1>
			<v-chip v-if="modularExtension" disabled small>Modular Extension</v-chip>
		</template>

		<div class="module-content">
			<div class="collection-select">
				<span>Collection:</span>
				<v-select v-model="selected" :items="collections" />
			</div>
			
			<v-upload :collection="selected" v-if="selected"/>
		</div>
 	</private-view>
</template>

<script lang="ts">
import { parseCollectionName } from './util';
import vUpload from './v-upload/v-upload.vue';
import { Collection } from './types';

export default {
  components: { vUpload },
	data() {
		return {
			collections: new Array<{text: string; value: string;}>(),
			selected: '',
		};
	},
	inject: ['api'],
	mounted() {
		// this.api is an authenticated axios instance
		//@ts-ignore
		this.api.get('/collections?limit=-1').then((res: { data: { data: any; }; }) => {
			const collections: Collection[] = res.data.data
				.filter((collection: Collection) => !collection.meta?.system)
				.sort((cA: Collection, cB: Collection) => {
					if (cA.collection.toLowerCase() < cB.collection.toLowerCase()) return -1;
					if (cA.collection.toLowerCase() > cB.collection.toLowerCase()) return 1;
					return 0;
				});
			
			this.collections = collections.map((collection: Collection) => ({
				text: parseCollectionName(collection.collection), 
				value: collection.collection
			}));
		});
	},
};
</script>

<style lang="css" scoped>
.module-content {
	padding: 0 var(--content-padding) var(--content-padding-bottom);
}
.v-chip {
	--v-chip-background-color: var(--v-chip-background-color-hover);
	--v-chip-color: var(--v-chip-color-hover);
	margin-left: 12px;
	cursor: default !important;
}
.collection-select {
    margin-bottom: 1vh;
}
.header-icon {
	--v-button-color-disabled: var(--foreground-normal);
}
</style>