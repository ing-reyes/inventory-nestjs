import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class BienestarSocial {
    @Prop()
    title: string;

    @Prop()
    year: number;

    @Prop()
    summary: string;

    @Prop({ type: Date, default: Date.now })
    createAt: Date;

    @Prop({ type: Date, default: Date.now })
    updateAt: Date;

    @Prop({ type: Boolean, default: true })
    active: boolean;

    @Prop()
    doc?: string;
}


export const BienestarSocialSchema = SchemaFactory.createForClass(BienestarSocial);

BienestarSocialSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
        doc.id = doc._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});