import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddTodoMutation } from "../../redux/slices/productApiSlice";
import { useAddsTodoMutation } from "../../redux/slices/todoApiSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { FaRegHeart } from "react-icons/fa";
import { useGetCatagoryQuery } from "../../redux/slices/catagoryApiSlice";
import { setCatagory } from "../../redux/slices/catagorySlice";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addTodo] = useAddTodoMutation();
  const [addTodoo] = useAddsTodoMutation();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [inStock, setInStock] = useState("all");
  const scrollRef = useRef(null);
  const [page, setPage] = useState(1); // Sayfa durumu
  const [hasMore, setHasMore] = useState(true);

  const { data: categoryData } = useGetCatagoryQuery();

  useEffect(() => {
    if (categoryData?.allCatagory) {
      dispatch(setCatagory(categoryData.allCatagory));
    }
  }, [categoryData, dispatch]);

    const { userInfo } = useSelector((state) => state.auth);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = `${process.env.REACT_APP_API_BASE_URL}/api/qolbaq`;
  
        if (userInfo && userInfo._id) {
          url += `/${userInfo._id}?page=${page}`;
        } else {
          url += `?page=${page}`;
        }
  
        const response = await axios.get(url);
        const newData = response.data.allQolbaq;
  
        setProducts((prevData) => [...prevData, ...newData]);
        setHasMore(page < response.data.totalPages);
      } catch (error) {
        console.error("Veri alınamadı:", error);
      }
    };
    fetchData();
  }, [page]);


  const loadMore = () => {
    if (hasMore) setPage((prev) => prev + 1); // Sayfayı bir arttır
  };

  const handleAddToCart = async (product) => {
    try {
      const newTodo = await addTodo({ productId: product._id }).unwrap();
      dispatch({ type: "product/addTodo", payload: newTodo });
            alert("Məhsul səbətə yükləndi.");
    } catch (err) {
      console.error("Failed to add product to cart:", err);
            alert("Ürün sepete eklenemedi. Lütfen tekrar deneyin.");

    }
  };

  const handleAddToFavorite = async (product) => {
    try {
      const newFavorie = await addTodoo({ productId: product._id }).unwrap();
      dispatch({ type: "favorie/add", payload: newFavorie });
      navigate("/favorie");
    } catch (err) {
      console.error("Failed to add product to favorite:", err);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.catagory === selectedCategory;
    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "low" && product.price <= 50) ||
      (priceRange === "mid" && product.price > 50 && product.price <= 150) ||
      (priceRange === "high" && product.price > 150);
    const matchesStock = inStock === "all" || (inStock === "inStock" && product.stock > 0) || (inStock === "outOfStock" && product.stock === 0);
    return matchesSearch && matchesCategory && matchesPrice && matchesStock;
  });

  const scrollLeft = () => {
    scrollRef.current.scrollLeft -= 400;
  };

  const scrollRight = () => {
    scrollRef.current.scrollLeft += 400;
  };

  return (
<div className="w-full flex flex-col min-h-[740px] gap-6">
  {/* Filters */}
  <div className="w-full fixed top-0 left-0 z-20 bg-white dark:bg-gray-800 p-5 shadow flex flex-nowrap gap-4 overflow-x-auto">
    <input
      type="text"
      placeholder="Ad ilə axtar"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="p-2 min-w-[150px] border rounded dark:bg-gray-900 dark:text-white"
    />
    <select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
      className="p-2 min-w-[150px] border rounded dark:bg-gray-900 dark:text-white"
    >
      <option value="all">Hamısı</option>
      {categoryData?.allCatagory?.map((cat) => (
        <option key={cat._id} value={cat.title}>{cat.title}</option>
      ))}
    </select>
    <select
      value={priceRange}
      onChange={(e) => setPriceRange(e.target.value)}
      className="p-2 min-w-[150px] border rounded dark:bg-gray-900 dark:text-white"
    >
      <option value="all">Hamısı</option>
      <option value="low">0 - 50₼</option>
      <option value="mid">51 - 150₼</option>
      <option value="high">151₼+</option>
    </select>
    <select
      value={inStock}
      onChange={(e) => setInStock(e.target.value)}
      className="p-2 min-w-[150px] border rounded dark:bg-gray-900 dark:text-white"
    >
      <option value="all">Hamısı</option>
      <option value="inStock">Stokda Olanlar</option>
      <option value="outOfStock">Stokda Olmayanlar</option>
    </select>
  </div>

  {/* Product Scrollable Grid */}
  <div className="relative">
    <button
      onClick={scrollLeft}
      className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-gray-200 dark:bg-gray-700 rounded-full shadow hover:bg-gray-300"
    >
      <FaArrowLeft />
    </button>

    <div
      ref={scrollRef}
      className="overflow-x-auto whitespace-nowrap scroll-smooth px-8"
    >
      <div className="grid grid-rows-3 gap-6 mt-[100px] auto-cols-max grid-flow-col">
        {filteredProducts.map((product) => (
          <div key={product._id} className="w-56 bg-white dark:bg-gray-800 rounded-lg shadow p-4 relative">
            <button
              onClick={() => handleAddToFavorite(product)}
              className="absolute top-2 right-2 text-gray-700 dark:text-white"
            >
              <FaRegHeart className="w-6 h-6 hover:text-red-600" />
            </button>
            <img
              src={Array.isArray(product.photo) ? product.photo[0] : product.photo}
              alt={product.title}
              className="w-full h-40 object-cover rounded cursor-pointer"
              onClick={() => navigate(`/product/${product._id}`)}
            />
            <h3 className="mt-2 font-semibold dark:text-white truncate">{product.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-300">Qiymət: {product.discountApplied ? (
                  <>
                    <span className="text-red-500 line-through mr-2">
                      {product.originalPrice}₼
                    </span>
                    <span className="text-green-600">{product.price}₼</span>
                  </>
                ) : (
                  <span>{product.price}₼</span>
                )}</p>            <button
              onClick={() => handleAddToCart(product)}
              disabled={product.stock === 0}
              className={`w-full mt-2 py-2 rounded text-white ${product.stock === 0 ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {product.stock === 0 ? "Stokda Yoxdur" : "Səbətə Əlavə Et"}
            </button>
          </div>
        ))}
      </div>
    </div>

    <button
      onClick={scrollRight}
      className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-gray-200 dark:bg-gray-700 rounded-full shadow hover:bg-gray-300"
    >
      <FaArrowRight />
    </button>

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
</div>

  );
};

export default Products;
