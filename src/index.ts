import { defineModule } from '@directus/extensions-sdk';
import ModuleComponent from './module.vue';

export default defineModule({
	id: 'bulk-import',
	name: 'Bulk import',
	icon: 'publish',
	routes: [
		{
			path: '',
			component: ModuleComponent,
		},
	],
});
