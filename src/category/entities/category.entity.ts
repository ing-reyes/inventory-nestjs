import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Category extends Document {

    @Prop({type: String, unique: true, required: [true, 'Category is required']})
    name: string;

    @Prop({type: String})
    description?: string;

    @Prop({type: Date, default: Date.now})
    createdAt: Date;

    @Prop({type: Date, default: Date.now})
    updatedAt: Date;

    @Prop({type: Boolean, default: true})
    active?: boolean;
}

export const CategorySchema = SchemaFactory.createForClass( Category );

CategorySchema.set( 'toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function( doc, ret ) {
        doc.id = doc._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
} );