import mongoose,{Schema} from "mongoose"

const bookSchema = new Schema({
title:{
 type:String,
required:true,
unique:true,
},
author:{
type:String,
required:true,

},
description:{
type:String,
},
price:{
type:Number,
required:true,
},
stock:{
type:Number,
required:true,
},
coverImage:{
type:String,
}
,
seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },

category:{
    type:String,
    // Fiction or Non-Fiction
}
},{
    timestamps:true,
})


export const Book = mongoose.model("Book",bookSchema)