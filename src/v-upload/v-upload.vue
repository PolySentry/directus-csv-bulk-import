<template>
	<div
		data-dropzone
		class="v-upload"
		:class="{ dragging, uploading }"
		@dragenter.prevent="onDragEnter"
		@dragover.prevent
		@dragleave.prevent="onDragLeave"
		@drop.stop.prevent="onDrop"
	>
		<template v-if="dragging">
			<p class="type-label">{{ t('drop_to_upload') }}</p>
			<p class="type-text">{{ t('upload_pending') }}</p>
		</template>

		<template v-else-if="uploading">
			<p class="type-label">{{ progress }}%</p>
			<p class="type-text">
				{{
					multiple && numberOfFiles > 1
						? t('upload_files_indeterminate', { done: done, total: numberOfFiles })
						: t('upload_file_indeterminate')
				}}
			</p>
			<v-progress-linear :value="progress" rounded />
		</template>

		<template v-else>
			<p class="type-label">{{ t('drag_file_here') }}</p>
			<p class="type-text">{{ t('click_to_browse') }}</p>
			<input class="browse" type="file" :multiple="multiple" @input="onBrowseSelect" />

			<template v-if="fromUrl !== false || fromLibrary !== false">
				<v-menu show-arrow placement="bottom-end">
					<template #activator="{ toggle }">
						<v-icon clickable class="options" name="more_vert" @click="toggle" />
					</template>
					<v-list>
						<v-list-item v-if="fromLibrary" clickable @click="activeDialog = 'choose'">
							<v-list-item-icon><v-icon name="folder_open" /></v-list-item-icon>
							<v-list-item-content>
								{{ t('choose_from_library') }}
							</v-list-item-content>
						</v-list-item>

						<v-list-item v-if="fromUrl" clickable @click="activeDialog = 'url'">
							<v-list-item-icon><v-icon name="link" /></v-list-item-icon>
							<v-list-item-content>
								{{ t('import_from_url') }}
							</v-list-item-content>
						</v-list-item>
					</v-list>
				</v-menu>

				<drawer-collection
					collection="directus_files"
					:active="activeDialog === 'choose'"
					:multiple="multiple"
					:filter="filterByFolder"
					@update:active="activeDialog = null"
					@input="setSelection"
				/>

				<v-dialog
					:model-value="activeDialog === 'url'"
					:persistent="urlLoading"
					@esc="activeDialog = null"
					@update:model-value="activeDialog = null"
				>
					<v-card>
						<v-card-title>{{ t('import_from_url') }}</v-card-title>
						<v-card-text>
							<v-input v-model="url" autofocus :placeholder="t('url')" :nullable="false" :disabled="urlLoading" />
						</v-card-text>
						<v-card-actions>
							<v-button :disabled="urlLoading" secondary @click="activeDialog = null">
								{{ t('cancel') }}
							</v-button>
							<v-button :loading="urlLoading" :disabled="isValidURL === false" @click="importFromURL">
								{{ t('import_label') }}
							</v-button>
						</v-card-actions>
					</v-card>
				</v-dialog>
			</template>
		</template>
	</div>
	<v-dialog :model-value="!!error">
		<v-card>
			<v-card-title>Something went wrong</v-card-title>
			<v-card-text>
				<v-error :error="error" />
			</v-card-text>
			<v-card-actions>
				<v-button @click="error = null">Done</v-button>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n';
import { defineComponent, ref, computed, inject } from 'vue';

export default defineComponent({
	props: {
		multiple: {
			type: Boolean,
			default: false,
		},
		preset: {
			type: Object,
			default: () => ({}),
		},
		fileId: {
			type: String,
			default: null,
		},
		fromUrl: {
			type: Boolean,
			default: false,
		},
		fromLibrary: {
			type: Boolean,
			default: false,
		},
		folder: {
			type: String,
			default: undefined,
		},
		collection: {
			type: String,
			default: undefined,
		}
	},
	
	emits: ['input'],
	setup(props) {
		const { t } = useI18n();
		const { uploading, progress, upload, onBrowseSelect, done, numberOfFiles, error } = useUpload();
		const { onDragEnter, onDragLeave, onDrop, dragging } = useDragging();
		const activeDialog = ref<'choose' | 'url' | null>(null);
		const api = inject('api');

		const filterByFolder = computed(() => {
			if (!props.folder) return null;
			return { folder: { id: { _eq: props.folder } } };
		});

		return {
			t,
			uploading,
			progress,
			onDragEnter,
			onDragLeave,
			onDrop,
			dragging,
			onBrowseSelect,
			done,
			numberOfFiles,
			activeDialog,
			filterByFolder,
			error
		};

		function useUpload() {
			const uploading = ref(false);
			const progress = ref(0);
			const numberOfFiles = ref(0);
			const done = ref(0);
			const error = ref(null);
							

			return { uploading, progress, upload, onBrowseSelect, numberOfFiles, done, error };

			async function upload(files: FileList) {

				uploading.value = true;
				progress.value = 0;
				console.log(files);

				try {
					numberOfFiles.value = files.length;
					if (!files[0]) throw Error("No file was found");
					const formData = new FormData();
					formData.append('file', files[0], 'filename');
					//@ts-ignore
					await api.post(`/utils/import/${props.collection}`, formData);
					console.log("Finished");

					progress.value = 100;
					done.value = 1;
					
				} catch (e) {
					//@ts-ignore
					error.value = e;
				} finally {
					setTimeout(() => {
						uploading.value = false;
						done.value = 0;
						numberOfFiles.value = 0;
					}, 1000)	
				}
			}

			function onBrowseSelect(event: InputEvent) {
				const files = (event.target as HTMLInputElement)?.files;

				if (files) {
					upload(files);
				}
			}
		}

		function useDragging() {
			const dragging = ref(false);

			let dragCounter = 0;

			return { onDragEnter, onDragLeave, onDrop, dragging };

			function onDragEnter() {
				dragCounter++;

				if (dragCounter === 1) {
					dragging.value = true;
				}
			}

			function onDragLeave() {
				dragCounter--;

				if (dragCounter === 0) {
					dragging.value = false;
				}
			}

			function onDrop(event: DragEvent) {
				dragCounter = 0;
				dragging.value = false;

				const files = event.dataTransfer?.files;

				if (files) {
					upload(files);
				}
			}
		}
	},
});
</script>

<style lang="css" scoped>
.v-upload {
	 position: relative;
	 display: flex;
	 flex-direction: column;
	 justify-content: center;
	 min-height: var(--input-height-tall);
	 padding: 32px;
	 color: var(--foreground-subdued);
	 text-align: center;
	 border: 2px dashed var(--border-normal);
	 border-radius: var(--border-radius);
	 transition: var(--fast) var(--transition);
	 transition-property: color, border-color, background-color;
}
 .v-upload p {
	 color: inherit;
}
 .v-upload:not(.uploading):hover {
	 color: var(--primary);
	 border-color: var(--primary);
}
 .browse {
	 position: absolute;
	 top: 0;
	 left: 0;
	 display: block;
	 width: 100%;
	 height: 100%;
	 cursor: pointer;
	 opacity: 0;
	 appearance: none;
}
 .dragging {
	 color: var(--primary);
	 background-color: var(--primary-alt);
	 border-color: var(--primary);
}
 .dragging * {
	 pointer-events: none;
}
 .uploading {
	 --v-progress-linear-color: var(--white);
	 --v-progress-linear-background-color: #000;
	 --v-progress-linear-height: 8px;
	 color: var(--white);
	 background-color: var(--primary);
	 border-color: var(--primary);
	 border-style: solid;
}
 .uploading .v-progress-linear {
	 position: absolute;
	 bottom: 30px;
	 left: 32px;
	 width: calc(100% - 64px);
}
 .options {
	 position: absolute;
	 top: 12px;
	 right: 12px;
	 color: var(--foreground-subdued);
	 cursor: pointer;
	 transition: color var(--medium) var(--transition);
}
 .v-upload:hover .options {
	 color: var(--primary);
}
</style>
