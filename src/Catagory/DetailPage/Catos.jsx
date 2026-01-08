import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useAddTodoMutation } from '../../redux/slices/productApiSlice';
import { useNavigate } from 'react-router-dom';
import { FaRegHeart } from "react-icons/fa";

const Catos = ({ catagory }) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const dispatch = useDispatch();
  const [addTodo] = useAddTodoMutation();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  const handleAddToCart = async (product) => {
    try {
      const itemWithDetails = { productId: product._id };
      const newTodo = await addTodo(itemWithDetails).unwrap();
      dispatch({ type: 'product/addTodo', payload: newTodo });
      navigate('/basket');
    } catch (err) {
      console.error('Failed to add the product to cart:', err);
      alert('Ürün sepete eklenemedi. Lütfen tekrar deneyin.');
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {

        try {
          let url = `${process.env.REACT_APP_API_BASE_URL}/api/qolbaq`;
  
          if (userInfo && userInfo._id) {
            url += `/${userInfo._id}?page=${page}`;
          } else {
            url += `?page=${page}`;
          }
            const response = await axios.get(url);

            const data = response.data.allQolbaq;

            if (data && data.length > 0) {
                // Kategoriyi filtreleyip ürünleri ekleyelim
                const filteredProducts = data.filter((item) => item.catagory === catagory);
                setProducts((prev) => [...prev, ...filteredProducts]);

                // Daha fazla sayfa olup olmadığını kontrol et
                setHasMore(page < response.data.totalPages);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            // Kullanıcıya hata mesajı göstermek için
        }
    };

    // Sayfa değiştiğinde veya kategori değiştiğinde fetchProducts'ı tekrar çalıştır
    if (page > 0) fetchProducts();
}, [catagory, page, userInfo?._id]); // userInfo._id de bağımlılık listesinde olmalı


  const loadMore = () => {
    if (hasMore) setPage((prev) => prev + 1);
  };

  return (
    <div className="w-[97%] mx-auto p-4 sm:p-6">
      <div className="grid gap-4 sm:gap-6 dark:text-white grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-lg rounded-lg dark:bg-gray-800 border overflow-hidden p-4 sm:p-6 flex flex-col items-center transition-transform transform hover:scale-105 relative"
            >
              <button className="absolute top-4 right-4 p-2 rounded-full dark:text-white text-gray-950">
                <FaRegHeart className="h-6 w-6 sm:h-8 sm:w-8 hover:text-blue-900" />
              </button>

              <div className="flex justify-center mb-4 sm:mb-6 w-full">
                <div className="relative w-full h-64 sm:h-80">
                  <img
                    src={Array.isArray(product.photo) ? product.photo[0] : product.photo}
                    alt={product.title}
                    className="object-cover w-full h-full rounded-md cursor-pointer"
                    onClick={() => navigate(`/product/${product._id}`)}
                  />
                </div>
              </div>

              <h3 className="text-sm sm:text-lg font-semibold mb-2 text-gray-800 dark:text-white text-center h-10 overflow-hidden">
                {(product.title || "").slice(0, 50)}
                {(product.title || "").length > 50 && "..."}
              </h3>

              <h4 className="text-sm sm:text-lg font-semibold mb-2 dark:text-white text-gray-800 text-center">
                {product.discountApplied ? (
                  <>
                    <span className="text-red-500 line-through mr-2">
                      {product.originalPrice}₼
                    </span>
                    <span className="text-green-600">{product.price}₼</span>
                  </>
                ) : (
                  <span>{product.price}₼</span>
                )}
              </h4>

              <p
                className={`text-sm sm:text-base font-medium mb-4 ${product.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}
              >
                {product.stock > 0 ? "Stokta Var" : "Stokta Yok"}
              </p>

              <button
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
                className={`w-full py-2 sm:py-3 rounded-lg text-white ${product.stock === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                  } transition-colors duration-200`}
              >
                {product.stock === 0 ? "Stokta Yok" : "Sepete Ekle"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-center dark:text-white text-gray-600">
            Ürün bulunamadı.
          </p>
        )}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Daha Çox Göstər
          </button>
        </div>
      )}
    </div>
  );
};

export default Catos;
