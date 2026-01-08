import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTodos } from "../../redux/slices/todoSlice";
import { useDeleteeTodoMutation, useGetsTodosQuery } from "../../redux/slices/todoApiSlice";
import { useNavigate } from "react-router-dom";

const Favorie = () => {
    const dispatch = useDispatch();
    const { data, isLoading, refetch } = useGetsTodosQuery();
    const navigate = useNavigate();

    const [deleteeTodo] = useDeleteeTodoMutation();

    useEffect(() => {
        if (data) {
            dispatch(setTodos(data));
            refetch();
        }
    }, [data, dispatch]);

    const handleDelete = async (id) => {
        try {
            await deleteeTodo(id);
            await refetch(); 
        } catch (err) {
            console.error("Silme hatası:", err);
        }
    };

    return (
        <div className="container min-h-[740px] mx-auto p-6">
            {isLoading ? (
                <p className="text-center text-gray-600">Yüklənir...</p>
            ) : (
                data && data.map(product => (
                    <div key={product._id} className="dark:bg-black border shadow-lg rounded-lg p-6 mb-6 flex flex-col md:flex-row items-center hover:shadow-xl transition-all duration-300 ease-in-out">
                        <img
                  src={Array.isArray(product.photo) ? product.photo[0] : product.photo}
                            alt={product.title}
                            className="h-28 w-28 sm:h-40 sm:w-40 object-cover mb-4 sm:mb-6 rounded-md cursor-pointer"
                            onClick={() => navigate(`/product/${product.productId}`)}
                        />
                        <div className="w-full flex flex-col items-center">
                            <h3 className="text-lg font-semibold dark:text-white text-gray-800">{product.title}</h3>
                        </div>
                        <div className="flex w-full dark:text-white items-center justify-center space-x-4 mt-4">
                            <span className="text-lg dark:text-white font-medium text-gray-700">{product.catagory}</span>
                        </div>
                        <div className="flex flex-col w-full items-center mt-4">
                            <p className="text-xl dark:text-white font-bold text-gray-800 mb-2">Qiymət: {product.price} ₼</p>
                            {product.stock === 1 ? (
                                <p className="text-red-500 mb-2">Son 1 məhsul qaldı!</p>
                            ) : product.stock === 0 ? (
                                <p className="text-red-500 mb-2">Bu məhsul stokda yoxdu!</p>
                            ) : null}
                            <button
                                onClick={() => handleDelete(product._id)}
                                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
                            >
                                Sil
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Favorie;
