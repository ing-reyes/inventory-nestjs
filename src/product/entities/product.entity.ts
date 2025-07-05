import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { CategoriesDepartment } from "src/common/enums/categories-departament.enum";

@Schema()
export class Product extends Document {
    @Prop({ type: String, required: [true, 'Name is required'], unique: true })
    name: string;

    @Prop({ type: Number, default: 0 })
    stock?: number;

    @Prop({ type: String, enum: CategoriesDepartment, required: [true, 'Category is required'], })
    category: CategoriesDepartment;

    @Prop({ type: Date, default: Date.now })
    entryDate: Date;
    
    @Prop({ type: Date, default: null })
    departureDate: Date;

    @Prop({ type: Date, default: Date.now })
    createAt: Date;

    @Prop({ type: Date, default: Date.now })
    updateAt: Date;

    @Prop({ type: Boolean, default: true })
    active: boolean;

    @Prop({ type: String })
    img?: string;

    @Prop({ type: String })
    description?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
        doc.id = doc._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});