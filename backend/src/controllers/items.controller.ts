import Item from '../models/item.model';
import { Request, Response, NextFunction } from 'express';
import { ItemInterface } from '../types';
import { customError } from '../middlewares/errorMiddleware';
import { Types } from 'mongoose';

async function updateItem(req: Request, itemData: ItemInterface) {
  const { name, description, countInStock, price, imageURL } = itemData;

  const item = await Item.findById(req.params.id);
  if (!item) {
    throw new customError('Item not found', 404);
  }

  if (name) {
    if (name.length < 1 || name.length > 20) {
      throw new customError(
        'El nombre del artículo debe tener entre 1 y 20 caracteres',
        400
      );
    }

    if (item.name !== name) item.name = name;
  }

  if (description) {
    item.description = description;
  }

  if (price) {
    item.price = price;
  }

  if (countInStock) {
    item.countInStock = countInStock;
  }

  if (imageURL) {
    item.imageURL = imageURL;
  }

  const updatedItem = await item.save();
  return updatedItem;
}

export async function updateItems(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (Array.isArray(req.body)) {
    const results = { success: [], failed: [] } as {
      success: ItemInterface[];
      failed: { item: ItemInterface; error: string }[];
    };
    for (const itemData of req.body as ItemInterface[]) {
      try {
        const updatedItem = await updateItem(req, itemData);
        results.success.push(updatedItem);
      } catch (error) {
        results.failed.push({
          item: itemData,
          error: (error as customError).message,
        });
      }
    }
    return res.json(results);
  }

  try {
    const updatedItem = await updateItem(req, req.body as ItemInterface);
    console.log(req.body);
    return res.json(updatedItem);
  } catch (error) {
    return next(error as customError);
  }
}

export async function getItems(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const items = await Item.find({});
    if (!items) throw new customError('No items found', 404);
    return res.json(items);
  } catch (error) {
    return next(error as customError);
  }
}

export async function createItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, price, description, countInStock, imageURL } =
    req.body as ItemInterface;
  console.log(req.body);
  if (!name) throw new customError('El nombre del articulo es requerido', 400);
  if (!price) throw new customError('El precio del articulo es requerido', 400);
  if (!countInStock)
    throw new customError('La cantidad del articulo es requerida', 400);

  try {
    const newItem: ItemInterface | null = new Item({
      name,
      price,
      description,
      countInStock,
      imageURL,
    });

    const savedItem = await newItem.save();
    return res.status(200).json(savedItem);
  } catch (error) {
    return next(error as customError);
  }
}

export async function deleteItem(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const deletedItem = await Item.findByIdAndDelete(
      new Types.ObjectId(req.params.id)
    );
    if (!deletedItem) throw new customError('Item not found', 404);
    return res.sendStatus(204);
  } catch (error) {
    return next(error as customError);
  }
}
