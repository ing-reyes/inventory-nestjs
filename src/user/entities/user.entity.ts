import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { UserRoles } from "./../../common/enums/roles.enum";

@Schema()
export class User extends Document {
    @Prop({
        type: String,
        minlength: 3,
        required: true,
    })
    name: string;
    
    @Prop({
        required: true,
        type: String,
        unique: true,
    })
    email:string;
    
    @Prop({
        type: String,
        minlength: 6,
        required: true,
    })
    password: string;

    @Prop( {
        type: String,
        enum: Object.keys(UserRoles),
        default: UserRoles.USER
    } )
    role: UserRoles;

    @Prop({
        type: String,
    })
    img?:string;

    @Prop({
        type: Boolean,
        default: true,
    })
    active?:boolean;
}

export const UserSchema = SchemaFactory.createForClass( User );

UserSchema.set( 'toJSON', {
    virtuals: true,
    versionKey: false,
    transform( doc, ret ) {
        delete ret.password;
        delete ret.__v;
        delete ret._id;
        doc.id = doc._id;
        return ret;
    }
} )