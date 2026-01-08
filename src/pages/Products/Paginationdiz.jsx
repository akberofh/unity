import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useGetCatagoryQuery } from "../../redux/slices/catagoryApiSlice";
import { setCatagory } from "../../redux/slices/catagorySlice";
import { Search, Heart, ShoppingCart, Filter, ArrowLeft, ArrowRight } from 'lucide-react';


const Paginationdiz = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
                let url = `${process.env.REACT_APP_API_BASE_URL}/api/pagination`;

                if (userInfo && userInfo._id) {
                    url += `/${userInfo._id}?page=${page}`;
                } else {
                    url += `?page=${page}`;
                }

                const response = await axios.get(url);
                const newData = response.data.allPagination;

                setProducts((prevData) => [...prevData, ...newData]);
                setHasMore(page < response.data.totalPages);
            } catch (error) {
                console.error("Veri alınamadı:", error);
            }
        };
        fetchData();
    }, [page]);


    const loadMore = () => {
        if (hasMore) setPage((prev) => prev + 1);
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
        <div className="w-full flex flex-col min-h-[740px] bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Filters - Modern Fixed Bar */}
            <div className="w-full fixed top-0 left-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md px-6 py-4 shadow-sm border-b border-gray-100 dark:border-gray-700 flex flex-nowrap items-center gap-4 overflow-x-auto no-scrollbar">
                <div className="relative min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Ad ilə axtar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border-none bg-gray-100 dark:bg-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>

                <div className="relative min-w-[150px]">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="appearance-none w-full px-4 py-2 bg-gray-100 dark:bg-gray-900 border-none rounded-xl text-sm dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50"
                    >
                        <option value="all">Bütün Kateqoriyalar</option>
                        {categoryData?.allCatagory?.map((cat) => (
                            <option key={cat._id} value={cat.title}>{cat.title}</option>
                        ))}
                    </select>
                    <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>

                <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="px-4 py-2 min-w-[150px] bg-gray-100 dark:bg-gray-900 border-none rounded-xl text-sm dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50"
                >
                    <option value="all">Qiymət: Hamısı</option>
                    <option value="low">0 - 50₼</option>
                    <option value="mid">51 - 150₼</option>
                    <option value="high">151₼+</option>
                </select>

                <select
                    value={inStock}
                    onChange={(e) => setInStock(e.target.value)}
                    className="px-4 py-2 min-w-[150px] bg-gray-100 dark:bg-gray-900 border-none rounded-xl text-sm dark:text-white cursor-pointer focus:ring-2 focus:ring-blue-500/50"
                >
                    <option value="all">Stok: Hamısı</option>
                    <option value="inStock">Stokda Olanlar</option>
                    <option value="outOfStock">Stokda Olmayanlar</option>
                </select>
            </div>

            {/* Product Scrollable Grid Section */}
            <div className="relative mt-[80px] group">
                {/* Navigation Buttons */}
                <button
                    onClick={scrollLeft}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/90 dark:bg-gray-700/90 backdrop-blur shadow-xl rounded-full text-gray-700 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110 active:scale-95"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>

                <div
                    ref={scrollRef}
                    className="overflow-x-auto whitespace-nowrap scroll-smooth px-10 no-scrollbar py-6"
                >
                    <div className="grid grid-rows-3 gap-8 auto-cols-max grid-flow-col py-6 px-4">
                        {filteredProducts.map((product) => (
                            <div
                                key={product._id}
                                className="w-64 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 relative group/card hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 flex flex-col justify-between"
                            >
                              
                                <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-900 mb-4">
                                    <img
                                        src={Array.isArray(product.photo) ? product.photo[0] : product.photo}
                                        alt={product.title}
                                        className="w-full h-full object-cover cursor-pointer transform group-hover/card:scale-110 transition-transform duration-700 ease-in-out"
                                        onClick={() => navigate(`/pagination/${product._id}`)}
                                    />

                                    {product.discountApplied && (
                                        <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
                                            ENDİRİM
                                        </div>
                                    )}
                                </div>

                              
                                <div className="flex flex-col gap-1 mb-4">
                                    <h3
                                        className="font-bold text-gray-900 dark:text-white text-base truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors tracking-tight"
                                        onClick={() => navigate(`/pagination/${product._id}`)}
                                    >
                                        {product.title}
                                    </h3>

                                    <div className="flex items-center gap-2">
                                        {product.discountApplied ? (
                                            <div className="flex items-center gap-2">
                                                <span className="text-blue-600 dark:text-blue-400 font-extrabold text-lg">
                                                    {product.price}₼
                                                </span>
                                                <span className="text-gray-400 line-through text-xs font-medium">
                                                    {product.originalPrice}₼
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-900 dark:text-gray-100 font-extrabold text-lg">
                                                {product.price}₼
                                            </span>
                                        )}
                                    </div>
                                </div>

                                
                                <button
                                    onClick={() => navigate(`/pagination/${product._id}`)}
                                    className="w-full group/btn flex items-center justify-center gap-2 py-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-600 dark:hover:bg-blue-600 rounded-xl transition-all duration-300"
                                >
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-200 group-hover/btn:text-white transition-colors">
                                        Ətraflı Bax
                                    </span>
                                    <svg
                                        className="w-4 h-4 text-gray-400 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={scrollRight}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/90 dark:bg-gray-700/90 backdrop-blur shadow-xl rounded-full text-gray-700 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110 active:scale-95"
                >
                    <ArrowRight className="w-5 h-5" />
                </button>

                {/* Load More Button */}
                {hasMore && (
                    <div className="flex justify-center mt-8 pb-10">
                        <button
                            onClick={loadMore}
                            className="px-10 py-3.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-blue-500 hover:text-blue-600 transition-all duration-300 shadow-sm"
                        >
                            Daha Çox Göstər
                        </button>
                    </div>
                )}
            </div>
        </div>

    );
};

export default Paginationdiz;
