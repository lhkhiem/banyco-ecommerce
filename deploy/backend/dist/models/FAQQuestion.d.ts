import { Model, Optional } from 'sequelize';
export interface FAQQuestionAttributes {
    id: string;
    category_id: string;
    question: string;
    answer: string;
    sort_order: number;
    is_active: boolean;
    created_at?: Date;
    updated_at?: Date;
}
export type FAQQuestionCreationAttributes = Optional<FAQQuestionAttributes, 'id' | 'sort_order' | 'is_active' | 'created_at' | 'updated_at'>;
export declare class FAQQuestion extends Model<FAQQuestionAttributes, FAQQuestionCreationAttributes> implements FAQQuestionAttributes {
    id: string;
    category_id: string;
    question: string;
    answer: string;
    sort_order: number;
    is_active: boolean;
    readonly created_at: Date;
    readonly updated_at: Date;
}
export default FAQQuestion;
//# sourceMappingURL=FAQQuestion.d.ts.map