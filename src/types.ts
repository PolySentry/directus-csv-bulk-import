export interface Collection {
	collection: string;
	meta: Meta;
}

export interface Meta {
    collection: string;
    icon: string;
    note: string;
    display_template: string;
    hidden: boolean;
    singleton: boolean;
    translations: Translation[];
    archive_field: string;
    archive_value: string;
    unarchive_value: string;
    archive_app_filter: boolean;
    sort_field: string;
    item_duplication_fields: object;
    sort: number;
    system: boolean;
}

export interface Translation {
    language: string;
    translation: string; 
}
