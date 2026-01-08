import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../redux/slices/usersApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import 'react-toastify/dist/ReactToastify.css';
import { useDropzone } from 'react-dropzone';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from "axios";


const Register = () => {
    const [name, setName] = useState('');
    const [faze, setFaze] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [registrationKey, setRegistrationKey] = useState('');
    const [finCode, setFinCode] = useState('');
    const [card, setCard] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [photo, setPhoto] = useState(null);
    const [referralCode, setReferralCode] = useState("");
    const [gender, setGender] = useState("");

    const navigation = useNavigate();
    const dispatch = useDispatch();

    const [register, { isLoading }] = useRegisterMutation();

    const [referralRequired, setReferralRequired] = useState(false);

    const [referralOwner, setReferralOwner] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("referral");

        if (code) {
            setReferralCode(code);
            console.log(`Referral Code: ${code}`);  // Burada referralCode konsola yazdırılıyor.

            axios
                .get(`${process.env.REACT_APP_API_BASE_URL}/api/users/admin/${code}`)
                .then((res) => {
                    console.log("API'den gelen veri:", res.data); // Veriyi doğru şekilde alıyoruz
                    const data = res.data;

                    if (data.count >= 2) {
                        setReferralRequired(true);
                    } else {
                        setReferralRequired(false);
                    }

                    if (data.owner) {
                        console.log("Referral sahibi bulundu:", data.owner); // Referral sahibi logu
                        setReferralOwner(data.owner);
                    } else {
                        console.log("Referral sahibi bulunamadı."); // Eğer owner yoksa
                    }
                })
                .catch((err) => {
                    console.error("Referral kod kontrol hatası:", err);
                });
        } else {
            console.log("Referral kodu bulunamadı!"); // Eğer ref parametre yoksa
        }
    }, []);




    const handleRegister = async (e) => {
        e.preventDefault();



        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('faze', faze);
            formData.append('registrationKey', registrationKey);
            formData.append('phone', phone);
            formData.append('finCode', finCode);
            formData.append('card', card);
            formData.append('email', email);
            formData.append('referralCode', referralCode);
            formData.append('password', password);
            formData.append('gender', gender);
            if (photo) {
                formData.append('photo', photo);


            }

            const params = new URLSearchParams(window.location.search);
            const referralLinkOwner = params.get("referral");


            if (referralLinkOwner) {
                formData.append('referralLinkOwner', referralLinkOwner);
            }

            const res = await register(formData).unwrap();
            dispatch(setCredentials({ ...res }));
            navigation("/");
        } catch (error) {
            console.error("Error:", error);  // Konsola da logla hata mesajını

            // Backend'den gelen hata mesajını al ve Toast ile göster
            const errorMessage = error?.data?.message || "Sunucu ile bağlantı kurulurken bir hata oluştu.";

            // Burada error mesajını toast ile ekranda göster
            toast.error(errorMessage);  // Hata mesajını ekranda göster
        }
    };


    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: 'image/*',
        maxSize: 50971520,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0];
                if (file.size <= 50971520) {
                    setPhoto(file);
                } else {
                    toast.error('File size exceeds 20 MB limit');
                }
            }
        }
    });

    const handleClearUploadPhoto = () => {
        setPhoto(null);
    };

    const [showTerms, setShowTerms] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const toggleTermsModal = () => setShowTerms(true);
    const closeTermsModal = () => setShowTerms(false);
    const acceptTerms = () => {
        setAcceptedTerms(true);
        setShowTerms(false);
    };

    

    return (
<section className="min-h-screen flex items-center justify-center p-4 bg-gray-900 font-mono text-gray-100 relative overflow-hidden">
    {/* Cyberpunk Arka Plan Efekti */}
    <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern animate-grid-pulse"></div>
    </div>

    <div className="relative z-10 bg-gray-900/80 backdrop-blur-sm p-8 md:p-12 rounded-lg shadow-neon-blue w-full max-w-4xl border-2 border-blue-600 transition-all duration-300 hover:shadow-neon-purple">
        
        {/* Başlık Bölümü */}
        <div className="text-center mb-10 border-b-2 border-purple-600 pb-4">
            <h1 className="text-4xl font-bold text-blue-400 tracking-wider mb-2 animate-pulse-light">
                 QEYDİYYAT <span className="text-purple-400">AKTİV</span>
            </h1>
            <p className="text-gray-400 text-lg">Sistemə daxil olmaq üçün məlumatlarınızı daxil edin.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-8">
            
            {/* GRUP 1: Şəxsi Məlumatlar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Ad Soyad */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-blue-300 mb-1">
                        AD SOYAD <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Adınızı və Soyadınızı daxil edin"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={true}
                        className="w-full px-4 py-2 bg-gray-800 border-2 border-blue-700 text-green-300 rounded-md shadow-inner-neon focus:border-purple-500 focus:ring-purple-500 transition duration-200 placeholder-gray-500 outline-none"
                    />
                </div>
                
                {/* Ata Adı */}
                <div>
                    <label htmlFor="faze" className="block text-sm font-medium text-blue-300 mb-1">
                        ATA ADI <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        id="faze"
                        name="faze"
                        placeholder="Ata Adını daxil edin"
                        value={faze}
                        onChange={(e) => setFaze(e.target.value)}
                        required={true}
                        className="w-full px-4 py-2 bg-gray-800 border-2 border-blue-700 text-green-300 rounded-md shadow-inner-neon focus:border-purple-500 focus:ring-purple-500 transition duration-200 placeholder-gray-500 outline-none"
                    />
                </div>
                
                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-blue-300 mb-1">
                        EMAIL <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email adresinizi daxil edin"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required={true}
                        className="w-full px-4 py-2 bg-gray-800 border-2 border-blue-700 text-green-300 rounded-md shadow-inner-neon focus:border-purple-500 focus:ring-purple-500 transition duration-200 placeholder-gray-500 outline-none"
                    />
                </div>
                
                {/* FinCode */}
                <div>
                    <label htmlFor="finCode" className="block text-sm font-medium text-blue-300 mb-1">
                        FINCODE <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="text"
                        id="finCode"
                        name="finCode"
                        placeholder="Ş/V Fin kodu (7 simvol)"
                        value={finCode}
                        onChange={(e) => setFinCode(e.target.value)}
                        required={true}
                        className="w-full px-4 py-2 bg-gray-800 border-2 border-blue-700 text-green-300 rounded-md shadow-inner-neon focus:border-purple-500 focus:ring-purple-500 transition duration-200 placeholder-gray-500 outline-none"
                    />
                </div>
            </div>
            
            <hr className="border-t-2 border-purple-600 my-8" />

            {/* GRUP 2: Şifrə ve Qeydiyyat Açarı */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Şifrə */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-blue-300 mb-1">
                        ŞİFRƏ <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Minimum 8 simvol"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required={true}
                        className="w-full px-4 py-2 bg-gray-800 border-2 border-blue-700 text-green-300 rounded-md shadow-inner-neon focus:border-purple-500 focus:ring-purple-500 transition duration-200 placeholder-gray-500 outline-none"
                    />
                </div>

                {/* Şifrə Təkrarı */}
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-300 mb-1">
                        ŞİFRƏ TƏKRARI <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Şifrənizi təsdiqləyin"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required={true}
                        className="w-full px-4 py-2 bg-gray-800 border-2 border-blue-700 text-green-300 rounded-md shadow-inner-neon focus:border-purple-500 focus:ring-purple-500 transition duration-200 placeholder-gray-500 outline-none"
                    />
                </div>
                
                {/* REGISTRATION KEY (Tam genişlikte, farklı arka plan ile vurgu) */}
                <div className="md:col-span-2 p-4 bg-purple-900/60 rounded-lg border-2 border-purple-500 shadow-neon-purple-sm">
                    <div>
                        <label htmlFor="registrationKey" className="block text-sm font-medium text-green-300 mb-1">
                            QEYDİYYAT AÇARI <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="password"
                            id="registrationKey"
                            name="registrationKey"
                            placeholder="Zəruri Qeydiyyat Açarını daxil edin"
                            value={registrationKey}
                            onChange={(e) => setRegistrationKey(e.target.value)}
                            required={true}
                            className="w-full px-4 py-2 bg-gray-800 border-2 border-green-700 text-green-300 rounded-md shadow-inner-neon focus:border-blue-500 focus:ring-blue-500 transition duration-200 placeholder-gray-500 outline-none"
                        />
                        <p className="mt-1 text-xs text-gray-400">[Sistem kodu - məxfi məlumat]</p>
                    </div>
                </div>
            </div>

            {/* GRUP 3: Lider/Referral (Koşullu) */}
            {referralRequired && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-blue-900/60 rounded-lg border-2 border-blue-500 shadow-neon-blue-sm">
                    
                    {/* Lider Kodu Girişi */}
                    <div>
                        <label htmlFor="referralCode" className="block text-sm font-medium text-green-300 mb-1">
                            LİDER KODU {referralRequired && <span className="text-red-400">*</span>}
                        </label>
                        <input
                            type="text"
                            id="referralCode"
                            name="referralCode"
                            placeholder="Dəvət edən lider kodu"
                            onChange={(e) => setReferralCode(e.target.value)}
                            required={referralRequired}
                            className="w-full px-4 py-2 bg-gray-800 border-2 border-green-700 text-green-300 rounded-md shadow-inner-neon focus:border-blue-500 focus:ring-blue-500 transition duration-200 placeholder-gray-500 outline-none"
                        />
                    </div>
                    
                    {/* Dəvət Edən Məlumatı */}
                    {referralCode && (
                        <div className="p-4 bg-gray-800 rounded-lg shadow-inner-neon border-2 border-gray-700 flex items-center space-x-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400 animate-pulse" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>
                            <div>
                                <h3 className="text-md font-semibold text-blue-300 mb-1">DƏVƏT EDƏN MƏLUMATI</h3>
                                {referralOwner ? (
                                    <div className="text-sm text-gray-300 space-y-0.5">
                                        <p><span className="font-medium text-green-400">AD:</span> **{referralOwner.name}**</p>
                                        <p><span className="font-medium text-green-400">EMAIL:</span> {referralOwner.email}</p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-red-500">Dəvət edən kodu tapılmadı. XƏTA!</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            {/* GRUP 4: Telefon, Kart, Cinsiyyət ve Foto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Telefon Nömrəsi */}
                <div>
                    <label className="block text-sm font-medium text-blue-300 mb-1">TELEFON NÖMRƏSİ <span className="text-red-400">*</span></label>
                    <PhoneInput
                        country={'az'}
                        value={phone}
                        onChange={(phone) => setPhone(phone)}
                        inputProps={{
                            name: 'Telefon nömrəsi',
                            required: true,
                        }}
                        containerClass="w-full"
                        inputClass="block w-full px-4 py-2 bg-gray-800 border-2 border-blue-700 text-green-300 rounded-md shadow-inner-neon focus:border-purple-500 focus:ring-purple-500 transition duration-200 placeholder-gray-500 outline-none"
                    />
                </div>

                {/* Card Nömrəsi */}
                <div>
                    <label htmlFor="card" className="block text-sm font-medium text-blue-300 mb-1">
                        KART NÖMRƏSİ (Opsiyonel)
                    </label>
                    <input
                        type="text"
                        id="card"
                        name="card"
                        placeholder="Qazancların köçürülməsi üçün"
                        value={card}
                        onChange={(e) => setCard(e.target.value)}
                        required={false}
                        className="w-full px-4 py-2 bg-gray-800 border-2 border-blue-700 text-green-300 rounded-md shadow-inner-neon focus:border-purple-500 focus:ring-purple-500 transition duration-200 placeholder-gray-500 outline-none"
                    />
                    <p className="mt-1 text-xs text-gray-500">[Məcburi deyil]</p>
                </div>
            </div>

            {/* Cinsiyyət və Foto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                
                {/* Cinsiyyət */}
                <div>
                    <label className="block text-sm font-medium text-blue-300 mb-2">CİNSİYYƏT <span className="text-red-400">*</span></label>
                    <div className="flex space-x-6">
                        
                        {/* Kişi Radio */}
                        <div className="flex items-center p-3 bg-gray-800 border-2 border-blue-700 rounded-md hover:border-purple-500 transition cursor-pointer shadow-neon-blue-sm">
                            <input
                                type="radio"
                                name="gender"
                                id="Kişi"
                                value="Kişi"
                                onChange={(e) => setGender(e.target.value)}
                                checked={gender === "Kişi"}
                                className="h-4 w-4 text-purple-500 border-gray-600 focus:ring-purple-500 bg-gray-700 cursor-pointer"
                            />
                            <label htmlFor="Kişi" className="ml-2 text-sm text-green-300 cursor-pointer">KİŞİ</label>
                        </div>

                        {/* Qadın Radio */}
                        <div className="flex items-center p-3 bg-gray-800 border-2 border-blue-700 rounded-md hover:border-purple-500 transition cursor-pointer shadow-neon-blue-sm">
                            <input
                                type="radio"
                                name="gender"
                                id="Qadın"
                                value="Qadın"
                                onChange={(e) => setGender(e.target.value)}
                                checked={gender === "Qadın"}
                                className="h-4 w-4 text-purple-500 border-gray-600 focus:ring-purple-500 bg-gray-700 cursor-pointer"
                            />
                            <label htmlFor="Qadın" className="ml-2 text-sm text-green-300 cursor-pointer">QADIN</label>
                        </div>
                    </div>
                </div>

                {/* Foto */}
                <div>
                    <label className="block text-sm font-medium text-blue-300 mb-1">ŞƏKİL YÜKLƏYİN (Opsiyonel)</label>
                    <div {...getRootProps({ className: 'dropzone border-2 border-blue-700 bg-gray-800 rounded-md px-4 py-2 flex items-center justify-center cursor-pointer h-[42px] transition-colors hover:border-purple-500 shadow-inner-neon' })}>
                        <input {...getInputProps()} />
                        <p className="text-gray-400 text-sm truncate">
                            {photo ? photo.name : "Faylı buraya buraxın və ya klikləyin"}
                        </p>
                        {photo && (
                            <button type="button" className="text-red-400 hover:text-red-500 ml-2 transition" onClick={handleClearUploadPhoto}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Şərtlər ve Qeydiyyat Butonu */}
            <div className="pt-6 border-t-2 border-purple-600">
                <div className="flex items-start">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="mr-3 h-4 w-4 text-purple-500 border-gray-600 rounded focus:ring-purple-500 bg-gray-700 mt-1 cursor-pointer"
                        required
                    />
                    <label htmlFor="terms" className="text-sm text-gray-300">
                        <span className="font-bold text-blue-400">ŞƏRTLƏR VƏ QAYDALAR</span> ilə razıyam.
                        <p className="cursor-pointer text-purple-400 hover:text-purple-300 font-medium text-xs mt-1 transition" onClick={toggleTermsModal}>
                            [DAHA ÇOX ÖYRƏN]
                        </p>
                    </label>
                </div>
            </div>

            <button 
                type="submit" 
                disabled={isLoading || !acceptedTerms} 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 rounded-lg shadow-neon-blue transition duration-300 ease-in-out disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-lg tracking-wider transform hover:scale-105"
            >
                {isLoading ? '>>> YÜKLƏNİR ...' : '>>> QEYDİYYATDAN KEÇ'}
            </button>
        </form>
        
        <p className="text-center mt-8 text-sm text-gray-500">
            Mövcud Hesabınız Var? <span className="text-blue-400 hover:text-purple-400 font-bold cursor-pointer transition" onClick={() => navigation('/login')}>GİRİŞ ET.</span>
        </p>
    </div>

    {/* Modal Kodu (Cyberpunk Stiline Uyarlandı) */}
    {showTerms && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 font-mono">
            <div className="relative p-6 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-neon-blue backdrop-blur-sm bg-gray-900/90 border-2 border-blue-600">
                <h3 className="text-2xl font-bold text-blue-400 mb-4 border-b-2 border-purple-600 pb-2"> ŞƏRTLƏR VƏ QAYDALAR</h3>
                <ul className="list-disc pl-5 space-y-3 text-sm text-gray-300">
                    <li>**ÖDƏNİŞ SİYASƏTİ:** Bütün ödənişlər yekundur və geri qaytarılmazdır. Əməliyyatdan öncə diqqətlə nəzərdən keçirin.</li>
                    <li>**QAZANC PROTOKOLÜ:** Dəvət sistemi vasitəsilə dərhal qazanc əldə edin. Dəvətsiz qazanclar sistem tərəfindən təyin olunmuş protokollara uyğundur.</li>
                    <li>**MƏLUMAT TƏHLÜKƏSİZLİYİ:** Şəxsi məlumatlarınız şifrələnmişdir və üçüncü tərəflərlə paylaşılmayacaqdır (qanuni tələblər istisna olmaqla).</li>
                    <li>**HESAB DONDURMA:** Sistem qaydalarına zidd hərəkətlər hesabınızın xəbərdarlıqsız dondurulmasına və ya silinməsinə səbəb ola bilər.</li>
                </ul>
                <button
                    className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2 rounded-lg transition"
                    onClick={acceptTerms}
                >
                    [QƏBUL ET]
                </button>
                <button
                    className="mt-2 w-full bg-gray-800 text-gray-300 hover:bg-gray-700 py-2 rounded-lg border border-gray-600 transition"
                    onClick={closeTermsModal}
                >
                    [İMTİNA ET]
                </button>
            </div>
        </div>
    )}
</section>


    );
};

export default Register;
