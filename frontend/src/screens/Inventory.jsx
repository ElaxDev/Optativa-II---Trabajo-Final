import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  createItemFn,
  deleteItemFn,
  getItemsFn,
  updateItemFn,
} from '../api/authApi';
import { AxiosError } from 'axios';
import Loader from '../components/Loader';

function Inventory() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [price, setPrice] = useState(0);
  const [imageURL, setImageURL] = useState('');

  const handleCheckboxChange = (e) => {
    const itemId = e.target.getAttribute('data-id'); // Get item ID from data-id attribute
    const isChecked = e.target.checked;

    if (isChecked) {
      // Add item ID to the selectedItems state
      setSelectedItems((prevSelectedItems) => {
        const updatedSelectedItems = [...prevSelectedItems, itemId];
        console.log(updatedSelectedItems); // Log after updating for debugging
        return updatedSelectedItems;
      });
    } else {
      // Remove item ID from the selectedItems state
      setSelectedItems((prevSelectedItems) => {
        const updatedSelectedItems = prevSelectedItems.filter(
          (id) => id !== itemId
        );
        console.log(updatedSelectedItems); // Log after updating for debugging
        return updatedSelectedItems;
      });
    }
  };

  const {
    refetch,
    data: items,
    isLoading: isItemsLoading,
    error: itemsError,
  } = useQuery({
    queryKey: ['items'],
    queryFn: () => getItemsFn(),
  });

  if (itemsError) console.log('Error fetching items:', itemsError);

  const { mutate: createItem, isPending: isCreateItemPending } = useMutation({
    mutationFn: createItemFn,
    onSuccess: () => {
      toast.success('¡El articulo fue agregado exitosamente!');
      refetch();
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error(error.message ? error.message : 'Ha ocurrido un error');
      }
    },
  });

  const { mutate: editItem, isPending: isUpdateItemPending } = useMutation({
    mutationFn: (data) => updateItemFn(data.id, data.updateValues),
    onSuccess: () => {
      toast.success('¡El articulo fue editado exitosamente!');
      refetch();
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error(error.message ? error.message : 'Ha ocurrido un error');
      }
    },
  });

  const { mutate: deleteItems, isPending: isDeleteItemLoading } = useMutation({
    mutationFn: deleteItemFn,
    onSuccess: () => {
      toast.success('¡El articulo fue eliminado exitosamente!');
      refetch();
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error(error.message ? error.message : 'Ha ocurrido un error');
      }
    },
  });

  async function deleteItemsHandler(e) {
    e.preventDefault();
    deleteItems(selectedItems);
  }

  async function createHandler(e) {
    e.preventDefault();
    console.log({ name, description, price, countInStock, imageURL });
    createItem({ name, description, price, countInStock, imageURL });
  }

  async function editHandler(e) {
    e.preventDefault();
    if (selectedItems.length !== 1) {
      toast.error('Por favor selecciona un solo artículo para editar');
      return;
    }
    editItem({
      id: selectedItems[0],
      updateValues: {
        name,
        description,
        price,
        countInStock,
        imageURL,
      },
    });
  }

  return (
    <div className="pt-24 min-h-screen px-12">
      <input type="checkbox" id="my_modal_7" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-2xl font-bold mb-5">Editar artículo</h3>
          <form onSubmit={editHandler}>
            <div className="flex flex-col gap-4 items-center">
              <input
                type="text"
                name="name"
                className="input input-bordered w-full max-w-xs"
                placeholder="URL de la imagen"
                value={imageURL}
                onChange={(e) => setImageURL(e.target.value)}
              />
              <input
                type="text"
                name="name"
                className="input input-bordered w-full max-w-xs"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                name="description"
                placeholder="Descripcion"
                className="input input-bordered w-full max-w-xs"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                type="number"
                name="price"
                placeholder="Precio"
                className="input input-bordered w-full max-w-xs"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <input
                type="number"
                name="countInStock"
                placeholder="Cantidad"
                className="input input-bordered w-full max-w-xs"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              />
              <div className="flex flex-row gap-2">
                <button type="submit" className="btn">
                  {isUpdateItemPending ? (
                    <span className="loading loading-spinner text-primary-content" />
                  ) : (
                    'Editar artículo'
                  )}
                </button>
                <label htmlFor="my_modal_7" className="btn">
                  Cancelar
                </label>
              </div>
            </div>
          </form>
        </div>
      </div>
      <input type="checkbox" id="my_modal_6" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-2xl font-bold mb-5">Añadir artículo</h3>
          <form onSubmit={createHandler}>
            <div className="flex flex-col gap-4 items-center">
              <input
                type="text"
                name="name"
                className="input input-bordered w-full max-w-xs"
                placeholder="URL de la imagen"
                value={imageURL}
                onChange={(e) => setImageURL(e.target.value)}
              />
              <input
                type="text"
                name="name"
                className="input input-bordered w-full max-w-xs"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                name="description"
                placeholder="Descripcion"
                className="input input-bordered w-full max-w-xs"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <input
                type="number"
                name="price"
                placeholder="Precio"
                className="input input-bordered w-full max-w-xs"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <input
                type="number"
                name="countInStock"
                placeholder="Cantidad"
                className="input input-bordered w-full max-w-xs"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              />
              <div className="flex flex-row gap-2">
                <button type="submit" className="btn">
                  {isCreateItemPending ? (
                    <span className="loading loading-spinner text-primary-content" />
                  ) : (
                    'Añadir artículo'
                  )}
                </button>
                <label htmlFor="my_modal_6" className="btn">
                  Cancelar
                </label>
              </div>
            </div>
          </form>
        </div>
      </div>
      <span className="font-bold text-3xl">Inventario</span>
      <br />
      <div className="py-3">
        <label htmlFor="my_modal_6" className="btn mx-2">
          Añadir artículo
        </label>
        <label htmlFor="my_modal_7" className="btn mx-2">
          Editar artículo
        </label>
        <label onClick={deleteItemsHandler} className="btn">
          {isDeleteItemLoading ? (
            <span className="loading loading-spinner text-primary-content" />
          ) : (
            'Eliminar artículo'
          )}
        </label>
      </div>
      <div className="card">
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items?.map((item) => (
                <tr key={item.id}>
                  <th>
                    <label>
                      <input
                        type="checkbox"
                        className="checkbox"
                        data-id={item._id}
                        onChange={handleCheckboxChange}
                      />
                    </label>
                  </th>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                          {item.imageURL ? (
                            <img
                              src={item.imageURL}
                              alt="Avatar Tailwind CSS Component"
                            />
                          ) : null}
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{item.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>{item.countInStock}</td>
                  <td>{item.price}.00 RD$</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isItemsLoading && <Loader />}
    </div>
  );
}

export default Inventory;
