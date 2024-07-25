import { Schema, model } from 'mongoose';
import { ItemInterface } from '../types';

const ItemSchema = new Schema<ItemInterface>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    countInStock: {
      type: Number,
      required: true,
    },
    imageURL: {
      type: String,
    },
  },
  { timestamps: true }
);

export default model<ItemInterface>('Item', ItemSchema);
