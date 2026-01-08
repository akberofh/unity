import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAddQolbaqJsonMutation } from '../redux/slices/qolbaqApiSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaTimes, FaPlus } from 'react-icons/fa';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Send } from 'lucide-react';

const IconPlus = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg>;
const IconTimes = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 352 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.19 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.19 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>;
const IconTag = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M0 252.118V48C0 21.49 21.49 0 48 0h204.118a48 48 0 0 1 33.941 14.059l211.882 211.882c18.745 18.745 18.745 49.137 0 67.882L293.823 497.941c-18.745 18.745-49.137 18.745-67.882 0L14.059 286.059A48 48 0 0 1 0 252.118zM112 144c17.673 0 32-14.327 32-32s-14.327-32-32-32-32 14.327-32 32 14.327 32 32 32z"></path></svg>;
const IconLira = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M312.13 358.4c-4.69 0-9.06 2.53-11.4 6.59-16.7 29.06-44.75 49.33-77.26 56.41V352c0-8.84-7.16-16-16-16h-31.47v-96H240c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16h-64v-64c0-23.71 13.91-44.15 34.05-53.53a16.002 16.002 0 0 0 6.64-22.09l-14.22-26.07c-3.92-7.19-12.5-10.43-20.15-7.58C112.17 28.52 64 86.6 64 154.67V176H16c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h48v96H16c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h48v71.49C64 485.8 86.2 512 113.33 512h34.13c5.3 0 10.39-2.11 14.14-5.86l22.63-22.63c3.75-3.75 5.86-8.84 5.86-14.14V422.3c35.6-4.5 68.03-22.42 90.63-50.51 5.37-6.67-.39-13.39-8.59-13.39h-60zm-136.13-13.1c0 8.84 7.16 16 16 16h24.16c-6.83 5.35-14.65 9.49-23.16 12.01v-28.01h-17zm0-128h17v28.01c8.51 2.52 16.33 6.66 23.16 12.01H192c-8.84 0-16 7.16-16 16v28z"></path></svg>;
const IconPhone = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M493.4 24.6l-104-24c-11.3-2.6-22.9 3.3-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 48.5c-30.5 64.1-83.2 116.8-147.3 147.3L185.7 284c-6.7-8.3-18.2-11.1-28-6.9l-112 48C35 329.7 29.1 341.3 31.7 352.6l24 104c2.6 11.3 12.8 19.4 24.3 19.4C374.9 476 112 213.1 112 79.4c0-11.5-8.1-21.7-19.4-24.3z"></path></svg>;
const IconInfo = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></path></svg>;
const IconTruck = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M624 352h-16V243.9c0-12.7-5.1-24.9-14.1-33.9L494 110.1c-9-9-21.2-14.1-33.9-14.1H416V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48v320c0 26.5 21.5 48 48 48h48c0 53 43 96 96 96s96-43 96-96h128c0 53 43 96 96 96s96-43 96-96h48c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zM192 464c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm336 0c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm48-176h-160v-128h38.1c1.9 0 3.7.8 5.1 2.1L545.9 252c1.3 1.3 2.1 3.2 2.1 5.1v30.9z"></path></svg>;
const IconImage = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M464 448H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h416c26.51 0 48 21.49 48 48v288c0 26.51-21.49 48-48 48zM112 120c-30.928 0-56 25.072-56 56s25.072 56 56 56 56-25.072 56-56-25.072-56-56-56zM64 384h384V272l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L208 320l-55.515-55.515c-4.686-4.686-12.284-4.686-16.971 0L64 336v48z"></path></svg>;
const IconArrowLeft = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273.9c-9.4-9.4-9.4-24.6 0-33.9L201.4 46.5c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"></path></svg>;


const Addpagenation = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [phone, setPhone] = useState('');
    const [distance, setDistance] = useState('');
    const [photos, setPhotos] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [addQolbaqJson] = useAddQolbaqJsonMutation();
    const [previews, setPreviews] = useState([]);

    const fileInputRef = useRef(null);

    const formatPhone = (value) => {
        // yalnız rəqəmlər
        let digits = value.replace(/\D/g, '');

        // həmişə 0 ilə başlasın
        if (!digits.startsWith('0')) {
            digits = '0' + digits;
        }

        // maksimum 11 rəqəm (0515983550)
        digits = digits.slice(0, 11);

        // format: 051-598-35-50
        let formatted = digits;

        if (digits.length > 3) {
            formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
        }
        if (digits.length > 6) {
            formatted = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
        }
        if (digits.length > 8) {
            formatted = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8)}`;
        }

        return formatted;
    };



    const handlePhotoChange = (e) => {
        setPhotos((prev) => [...prev, ...Array.from(e.target.files)]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error('Məhsul adı tələb olunur');
            return;
        }

        if (!price || price <= 0) {
            toast.error('Düzgün qiymət daxil edin');
            return;
        }
        if (photos.length === 0) {
            toast.error('Ən azı bir şəkil əlavə edin');
            return;
        }
        if (phone.length === 0) {
            toast.error('Telefon nömrəsi tələb olunur');
            return;
        }

        try {
            let imageUrls = [];
            if (photos.length > 0) {
                const formData = new FormData();
                photos.forEach((photo) => {
                    formData.append('photo', photo);
                });

                console.log('Uploading images...');
                try {
                    const uploadRes = await axios.post(
                        `${process.env.REACT_APP_API_BASE_URL}/api/product/upload-image`,
                        formData,
                        { withCredentials: true }
                    );
                    imageUrls = uploadRes.data.imageUrls || [];
                    console.log('Images uploaded:', imageUrls);
                } catch (uploadError) {
                    console.error('Image upload failed:', uploadError);
                    if (uploadError.response?.status === 403) {
                        toast.error('Bu əməliyyat üçün admin səlahiyyətiniz yoxdur');
                    } else {
                        toast.error('Şəkillər yüklənə bilmədi. Zəhmət olmasa yenidən cəhd edin.');
                    }
                    return;
                }
            }

            const productData = {
                title: title.trim(),
                phone: phone.trim(),
                distance: distance.trim(),
                price: parseFloat(price),
                description: description.trim(),
                photo: imageUrls,
            };

            console.log('Creating product with data:', productData);
            const newQolbaq = await addQolbaqJson(productData).unwrap();
            console.log('Product created:', newQolbaq);

            setTimeout(() => {
                dispatch({ type: 'qolbaq/addQolbaq', payload: newQolbaq });
            }, 1000);

            toast.success('Məhsul uğurla əlavə olundu!');
            navigate('/pagination');
        } catch (err) {
            console.error('Failed to add the product:', err);
            if (err.response?.data?.error) {
                toast.error(`Xəta: ${err.response.data.error}`);
            } else {
                toast.error('Məhsul əlavə olunmadı. Zəhmət olmasa yenidən cəhd edin.');
            }
        }
    };
    const removePhoto = (index) => {
        setPhotos((prev) => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        if (photos.length === 0) {
            setPreviews([]);
            return;
        }

        const objectUrls = photos.map(photo => URL.createObjectURL(photo));
        setPreviews(objectUrls);


        return () => objectUrls.forEach(url => URL.revokeObjectURL(url));
    }, [photos]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4 transition-colors">
            <div className="max-w-3xl mx-auto">
                {/* Üst Kısım: Başlık ve Geri Dönüş */}
                <div className="flex items-center gap-6 mb-10">
                    <button
                        onClick={() => navigate('/')}
                        className="p-4 bg-white dark:bg-gray-900 rounded-[1.25rem] shadow-sm text-gray-500 hover:text-blue-600 transition-all border border-gray-100 dark:border-gray-800"
                    >
                        <IconArrowLeft />
                    </button>
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Yeni Məhsul</h2>
                        <p className="text-gray-500 text-sm mt-1 font-medium">Elan məlumatlarını aşağıda daxil edin</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8" encType="multipart/form-data">
                    {/* Temel Bilgiler Kartı */}
                    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-gray-200/40 dark:shadow-none border border-gray-100 dark:border-gray-800 space-y-8">

                        {/* Başlık Girişi */}
                        <div className="flex flex-col space-y-3">
                            <label htmlFor="title" className="flex items-center gap-2 text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest ml-1">
                                <IconTag /> Ad <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 rounded-[1.25rem] outline-none transition-all dark:text-white font-semibold text-lg placeholder-gray-400"
                                required
                                placeholder="Məs: iPhone 15 Pro Max"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Fiyat Girişi */}
                            <div className="flex flex-col space-y-3">
                                <label htmlFor="price" className="flex items-center gap-2 text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest ml-1">
                                    <IconLira /> Qiymət <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 rounded-[1.25rem] outline-none transition-all dark:text-white font-black text-xl"
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                />
                            </div>

                            {/* Telefon Girişi */}
                            <div className="flex flex-col space-y-3">
                                <label className="flex items-center gap-2 text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest ml-1">
                                    <IconPhone /> Telefon <span className="text-red-500">*</span>
                                </label>

                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                                    placeholder="051-598-35-50"
                                    maxLength={15}
                                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 rounded-[1.25rem] outline-none transition-all dark:text-white font-semibold text-lg"
                                />
                            </div>
                        </div>

                        {/* Açıklama Girişi */}
                        <div className="flex flex-col space-y-3">
                            <label htmlFor="description" className="flex items-center gap-2 text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest ml-1">
                                <IconInfo /> Haqqında
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 rounded-[1.25rem] outline-none transition-all dark:text-white min-h-[140px] resize-none font-medium"
                                placeholder="Məhsul barədə ətraflı məlumat daxil edin..."
                            ></textarea>
                        </div>

                        {/* Gönderim Bilgisi */}
                        <div className="flex flex-col space-y-3">
                            <label htmlFor="distance" className="flex items-center gap-2 text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest ml-1">
                                <IconTruck /> Göndərilmə Haqqında
                            </label>
                            <input
                                type="text"
                                id="distance"
                                value={distance}
                                onChange={(e) => setDistance(e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 rounded-[1.25rem] outline-none transition-all dark:text-white font-medium"
                                placeholder="Çatdırılma metodu, yerlər və s."
                            />
                        </div>
                    </div>

                    {/* Şəkillər Kartı */}
                    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-gray-200/40 dark:shadow-none border border-gray-100 dark:border-gray-800">
                        <label className="flex items-center gap-2 text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-6 ml-1">
                            <IconImage /> Şəkillər <span className="text-red-500">*</span>
                        </label>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {previews.map((url, index) => (
                                <div key={index} className="relative group aspect-square rounded-[1.5rem] overflow-hidden border-2 border-gray-50 dark:border-gray-800 shadow-sm transition-transform hover:scale-[1.02]">
                                    <img src={url} alt={`preview ${index}`} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                        <button
                                            type="button"
                                            onClick={() => removePhoto(index)}
                                            className="bg-white text-red-600 p-3 rounded-2xl hover:bg-red-50 transition-all shadow-xl transform hover:scale-110"
                                        >
                                            <IconTimes />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Fotoğraf Ekleme Butonu */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="aspect-square border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-[1.5rem] flex flex-col justify-center items-center gap-3 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group"
                            >
                                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl group-hover:bg-blue-500 group-hover:text-white transition-all shadow-sm">
                                    <IconPlus />
                                </div>
                                <span className="text-[10px] font-black text-gray-400 group-hover:text-blue-600 uppercase tracking-tighter">FOTO ƏLAVƏ ET</span>
                            </button>
                        </div>

                        <input type="file" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" multiple accept="image/*" />

                        {photos.length > 0 && (
                            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-black uppercase tracking-wide">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                                {photos.length} ŞƏKİL SEÇİLDİ
                            </div>
                        )}
                    </div>

                    {/* İşlem Butonları */}
                    <div className="flex flex-col sm:flex-row gap-5 pt-4 pb-16">
                        <button
                            type="submit"
                            className="flex-[2] bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-6 rounded-3xl font-black text-xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-4 active:scale-[0.98]"
                        >


                            <><Send size={22} /> Elanı Paylaş</>

                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="flex-1 py-6 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 rounded-[2rem] font-black text-lg border-2 border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-[0.98] shadow-sm"
                        >
                            Çıxış
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Addpagenation;
