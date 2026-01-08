import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './Detalp.module.scss';
import { FaStar } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductCard from './Catos';
import { useAddTodoMutation } from "../../redux/slices/productApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { useAddsTodoMutation } from "../../redux/slices/todoApiSlice";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';



const Detalp = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { qolbaq_id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [addTodoo] = useAddsTodoMutation();

    const { userInfo } = useSelector((state) => state.auth);



    const [visibleLength, setVisibleLength] = useState(100); // Başlangıçta 100 karakter göster

    const handleShowMore = () => {
        setVisibleLength((prev) => prev + 700); // Her tıklamada 100 karakter daha ekle
    };

    const handleShowLess = () => {
        setVisibleLength(100); // Reset to the default 100 characters
    };

    const isFullVisible = visibleLength >= product?.description?.length;

    const [visibleLengthh, setVisibleLengthh] = useState(100); // Başlangıçta 100 karakter göster

    const handleShowMoree = () => {
        setVisibleLengthh((prev) => prev + 700); // Her tıklamada 100 karakter daha ekle
    };

    const handleShowLesss = () => {
        setVisibleLengthh(100); // Reset to the default 100 characters
    };

    const isFullVisiblee = visibleLengthh >= product?.distance?.length;

    const [addTodo] = useAddTodoMutation();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Eğer userInfo._id varsa URL'ye ekleyin, yoksa sadece qolbaq_id'yi kullanın
                const url = userInfo?._id 
                    ? `${process.env.REACT_APP_API_BASE_URL}/api/qolbaq/id/${qolbaq_id}/${userInfo._id}`
                    : `${process.env.REACT_APP_API_BASE_URL}/api/qolbaq/id/${qolbaq_id}`;
                
                const response = await axios.get(url);
                const data = response.data;
                
                if (data && data.getById) {
                    setProduct(data.getById);
                } else {
                    setError('Ürün bulunamadı.');
                }
            } catch (error) {
                console.error('Ürün alınırken hata oluştu:', error);
                setError('Ürün detayları alınırken bir hata oluştu.');
            } finally {
                setLoading(false);
            }
        };
    
        fetchProduct();
    }, [qolbaq_id, userInfo?._id]);

    const handleAddToCart = async (product) => {
        try {
            const itemWithDetails = { productId: product._id }; // Ürün ID'si ile sepete ekleme

            // Sepete ekleme işlemi
            const newTodo = await addTodo(itemWithDetails).unwrap();

            // Redux'a yeni öğeyi ekle
            dispatch({ type: 'product/addTodo', payload: newTodo });

            // Sepete ekleme işlemi başarılıysa, sepete yönlendir
            navigate('/basket');
        } catch (err) {
            console.error('Sepete ekleme hatası:', err);
            toast.error('Ürün sepete eklenemedi. Lütfen tekrar deneyin.');
        }
    };

    const handleAddToFavorie = async (product) => {


        try {
            const itemWithDetails = { productId: product._id };

            // API çağrısı
            const newFavorie = await addTodoo(itemWithDetails).unwrap();

            // Redux'a ekle
            dispatch({ type: 'favorie/add', payload: newFavorie });

            // Favoriler sayfasına yönlendir
            navigate('/favorie');
        } catch (err) {
            console.error('Failed to add the product to favorie:', err);
            alert(err.data?.error || 'Ürün favorilere eklenemedi. Lütfen tekrar deneyin.');
        }
    };

    const [thumbsSwiper, setThumbsSwiper] = useState(null);


    // Yükleniyor, hata, veya ürün bulunamadı durumları
    if (loading) {
        return <div className={styles.loading}>Yüklənir...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    if (!product) {
        return <div className={styles.error}>Məhsul yoxdur.</div>;
    }

    return (
        <div className="dark:bg-black text-gray-800 min-h-screen">
            <div className="container mx-auto px-4 lg:px-16 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Ürün Görseli */}
                    <div className="w-full max-w-xl mx-auto">
                        {/* Büyük Slider */}
                        <Swiper
                            spaceBetween={10}
                            navigation={true}
                            thumbs={{ swiper: thumbsSwiper }}
                            modules={[Navigation, Thumbs]}
                            className="rounded-xl mb-4"
                        >
                            {product.photo && Array.isArray(product.photo) ? (
                                product.photo.map((photo, index) => (
                                    <SwiperSlide key={index}>
                                        <img
                                            src={photo}
                                            alt={`product-${index}`}
                                            className="w-full h-96 object-cover rounded-xl cursor-pointer"
                                            onClick={() => navigate(`/product/${product._id}`)}
                                        />
                                    </SwiperSlide>
                                ))
                            ) : (
                                <SwiperSlide>
                                    <div className="w-full h-80 flex items-center justify-center bg-gray-200 rounded-xl text-gray-500">
                                        Görsel bulunamadı
                                    </div>
                                </SwiperSlide>
                            )}
                        </Swiper>

                        {/* Küçük Thumbnails */}
                        <Swiper
                            onSwiper={setThumbsSwiper}
                            spaceBetween={10}
                            slidesPerView={product.photo?.length > 4 ? 4 : product.photo?.length || 1}
                            modules={[Thumbs]}
                            watchSlidesProgress
                            className="rounded-md"
                        >
                            {product.photo && Array.isArray(product.photo) &&
                                product.photo.map((photo, index) => (
                                    <SwiperSlide key={index}>
                                        <img
                                            src={photo}
                                            alt={`thumb-${index}`}
                                            className="h-20 w-full object-cover rounded-md border cursor-pointer hover:opacity-80"
                                        />
                                    </SwiperSlide>
                                ))}
                        </Swiper>
                    </div>




                    {/* Ürün Detayları */}
                    <div className="flex dark:text-white flex-col justify-center">
                        <h1 className="text-3xl font-semibold mb-4">{product.title}</h1>
                        <p className="text-xl text-blue-600 font-semibold mb-6">Qiymət: {product.discountApplied ? (
                            <>
                                <span className="text-red-500 line-through mr-2">
                                    {product.originalPrice}₼
                                </span>
                                <span className="text-green-600">{product.price}₼</span>
                            </>
                        ) : (
                            <span>{product.price}₼</span>
                        )}</p>                       
                         <p className="text-lg mb-4">Stok Durumu: {product.stock > 0 ? "Var" : "Yok"}</p>
                        <div className="text-gray-700 dark:text-white mb-6">
                            {/* Açıklama Metni */}
                            <p>
                                {(product.description || "").slice(0, visibleLength)}
                                {visibleLength < (product.description || "").length && "..."}
                            </p>

                            {/* Butonlar */}
                            <div className="mt-2">
                                {!isFullVisible && (
                                    <button
                                        onClick={handleShowMore}
                                        className="text-blue-600 font-semibold mr-4"
                                    >
                                        Daha Çox Gösdər
                                    </button>
                                )}
                                {visibleLength > 100 && (
                                    <button
                                        onClick={handleShowLess}
                                        className="text-blue-600 font-semibold"
                                    >
                                        Daha Az Gösdər
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="text-gray-700 dark:text-white mb-6">
                            {/* Açıklama Metni */}
                            <p>
                                {(product.distance || "").slice(0, visibleLengthh)}
                                {visibleLengthh < (product.distance || "").length && "..."}
                            </p>

                            {/* Butonlar */}
                            <div className="mt-2">
                                {!isFullVisiblee && (
                                    <button
                                        onClick={handleShowMoree}
                                        className="text-blue-600 font-semibold mr-4"
                                    >
                                        Daha Çox Gösdər
                                    </button>
                                )}
                                {visibleLengthh > 100 && (
                                    <button
                                        onClick={handleShowLesss}
                                        className="text-blue-600 font-semibold"
                                    >
                                        Daha Az Gösdər
                                    </button>
                                )}
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 italic mb-6">Kategori: {product.catagory}</p>
                        <div className="flex items-center gap-1 text-yellow-500 text-xl mb-8">
                            <FaStar />
                            <FaStar />
                            <FaStar />
                            <FaStar />
                        </div>
                        <button
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0}
                            className={`py-3 w-[250px] px-6 rounded-lg  font-semibold text-white shadow-md transition ${product.stock === 0
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {product.stock === 0 ? "Stokda Yoxdur" : "Səbətə Əlavə Et"}
                        </button>
                        <div className='h-[20px]'></div>
                        <button
                            onClick={() => handleAddToFavorie(product)}
                            className="py-3 w-[250px] px-6 bg-green-700  hover:bg-green-900  rounded-lg font-semibold text-white shadow-md transition"
                        >
                            Sevimlilərə Elavə Et
                        </button>
                    </div>
                </div>

                {/* Diğer Ürünler */}
            </div>
            <div className="mt-16 mb-20 w-[95%] mx-auto text-center">
                <h2 className="text-3xl font-semibold my-10 dark:text-white">Digər Məhsullar</h2>
                <ProductCard catagory={product.catagory} />
            </div>



            {/* Toast Bildirimi */}
            <ToastContainer />
        </div>
    );
};

export default Detalp;
