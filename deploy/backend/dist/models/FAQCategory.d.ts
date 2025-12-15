import { Model, Optional } from 'sequelize';
export interface FAQCategoryAttributes {
    id: string;
    name: string;
    slug: string;
    sort_order: number;
    is_active: boolean;
    created_at?: Date;
    updated_at?: Date;
}
export type FAQCategoryCreationAttributes = Optional<FAQCategoryAttributes, 'id' | 'sort_order' | 'is_active' | 'created_at' | 'updated_at'>;
export declare class FAQCategory extends Model<FAQCategoryAttributes, FAQCategoryCreationAttributes> implements FAQCategoryAttributes {
    id: string;
    name: string;
    slug: string;
    sort_order: number;
    is_active: boolean;
    readonly created_at: Date;
    readonly updated_at: Date;
}
export default FAQCategory;
//# sourceMappingURL=FAQCategory.d.ts.map