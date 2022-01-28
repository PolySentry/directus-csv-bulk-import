import { defineModule } from '@directus/extensions-sdk';
import ModuleComponent from './module.vue';

export default defineModule({
	id: 'bulk-import',
	name: 'Bulk Import',
	icon: 'publish',
	routes: [
		{
			path: '',
			component: ModuleComponent,
		},
	],
});
