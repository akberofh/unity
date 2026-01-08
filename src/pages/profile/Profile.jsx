import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { logout, setCredentials } from "../../redux/slices/authSlice";
import { useLogoutMutation, useUpdateUserMutation } from "../../redux/slices/usersApiSlice";
import axios from "axios";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FaCamera } from "react-icons/fa";


const Profile = () => {
  const [email, setEmail] = useState("");
  const [activeTab, setActiveTab] = useState('profile');
  const [name, setName] = useState("");
  const [card, setCard] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [updateUser] = useUpdateUserMutation();
  const [referredUsers, setReferredUsers] = useState([]);
  const [showInfo, setShowInfo] = useState(false);
  const [solGrupSayisi, setSolGrupSayisi] = useState({ total: 0, paid: 0 });
  const [sagGrupSayisi, setSagGrupSayisi] = useState({ total: 0, paid: 0 });
  const [referrerInfo, setReferrerInfo] = useState(null);
  const [referrerInfoo, setReferrerInfoo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [referrerInf, setReferrerInf] = useState(null);
  const [referrerInfs, setReferrerInfs] = useState(null);
  const [showModa, setShowModa] = useState(false);
  const [referredUserss, setReferredUserss] = useState([]);
  const [referredUsersz, setReferredUsersz] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();
  const [paymentFilter, setPaymentFilter] = useState(null);
  const [paymentFilters, setPaymentFilters] = useState(null);
  const [stats, setStats] = useState(null);
  const [salaryData, setSalaryData] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTert, setSearchTert] = useState("");

  const { userInfo } = useSelector((state) => state.auth);
  const MySwal = withReactContent(Swal);


  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/users/getuser/${userInfo._id}`, { withCredentials: true }
        );

        if (data.payment === false) {
          // Kullanıcı ödeme yapmamış, anasayfaya yönlendir
          navigate("/");
        }
      } catch (error) {
        // Only redirect if truly unauthorized
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          navigate("/");
        } else {
          // Otherwise, just log the error
          console.error("Kullanıcı ödeme durumu kontrolü başarısız:", error);
        }
      }
    };

    if (userInfo) {
      checkPaymentStatus();
    } else {
      navigate("/"); // userInfo yoksa da yönlendir
    }
  }, [userInfo, navigate]);


  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Eğer "card" değeri yoksa hata mesajı göster
    if (!card) {
      toast.error("Kart bilgisi gereklidir!");
      return;
    }

    const formData = new FormData();
    formData.append("card", card);

    // Do not append photo here anymore

    try {
      const res = await updateUser(formData).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Profil başarıyla güncellendi!");
      navigate("/");
    } catch (error) {
      toast.error(error?.data?.message || error.message || "Bir hata oluştu.");
    }
  };


  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setPhoto(userInfo.photo);
      setReferralLink(userInfo.referralCode); // referralCode from user info
      setCard(userInfo.card || "");

      // Fetch referred users using referralCode
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/api/users/user/${userInfo.referralCode}`, { withCredentials: true })
        .then((res) => {
          setReferredUserss(res?.data?.users || []);
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            setReferredUserss([]); // No users, not a fatal error
          } else {
            console.error("Referred users fetch error:", error);
          }
        });

      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/api/users/refCode/${userInfo.referralCode}`, { withCredentials: true })
        .then((res) => {
          setReferredUsersz(res?.data?.referredUsers || []);
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            setReferredUsersz([]); // No users, not a fatal error
          } else {
            console.error("Referred users fetch error:", error);
          }
        });

      // Fetch referred users using referralCode for admin
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/api/users/admin/${userInfo.referralCode}`, { withCredentials: true })
        .then(async (res) => {
          setReferredUsers(res?.data?.users || []);

          const { users } = res.data;
          if (users.length >= 2) {
            const sagKol = users[0];
            const solKol = users[1];

            const [sagRes, solRes] = await Promise.all([
              axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/user/${sagKol.referralCode}`, { withCredentials: true }),
              axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/user/${solKol.referralCode}`, { withCredentials: true }),
            ]);

            // Qrup sayıları
            const solGroup = solRes.data.users || [];
            const sagGroup = sagRes.data.users || [];

            const solCount = solGroup.length;
            const sagCount = sagGroup.length;

            // Ödəniş edənlər
            const solPaid = solGroup.filter((u) => u.payment === true).length;
            const sagPaid = sagGroup.filter((u) => u.payment === true).length;

            setSolGrupSayisi({ total: solCount, paid: solPaid });
            setSagGrupSayisi({ total: sagCount, paid: sagPaid });
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            setReferredUsers([]); // No users, not a fatal error
          } else {
            console.error("Referred users fetch error:", error);
          }
        });
    }
  }, [userInfo]);




  // Arama fonksiyonu
  const filteredUsers = referredUserss
    .filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.referralCode.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((user) => {
      if (paymentFilters === null) return true;
      return paymentFilters ? user.payment === true : user.payment === false;
    });


  const filteredUserz = referredUsersz
    .filter((user) =>
      user.name.toLowerCase().includes(searchTert.toLowerCase()) ||
      user.referralCode.toLowerCase().includes(searchTert.toLowerCase())
    )
    .filter((user) => {
      if (paymentFilter === null) return true;
      return paymentFilter ? user.payment === true : user.payment === false;
    });


  const copyReferralLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/register?referral=${referralLink}`)
      .then(() => {
        toast.success("Referral linkiniz kopyalandı!");
      })
      .catch((error) => {
        toast.error("Referral linkiniz kopyalanmadı");
        console.error(error);
      });
  };

  const copyReferralLinke = () => {
    navigator.clipboard.writeText(`${referralLink}`)
      .then(() => {
        toast.success("İstifadəçi kodunuz kopyalandı!");
      })
      .catch((error) => {
        toast.error("İstifadəçi kodunuz kopyalanmadı");
        console.error(error);
      });
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
      // Immediately upload the image to the new endpoint with the correct field name
      const formData = new FormData();
      formData.append('profileImage', file);
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/api/users/profile/uploadImage`,
          formData,
          { withCredentials: true }
        );
        const cacheBustedUrl = res.data.imageUrl + '?v=' + Date.now();
        setPhoto(cacheBustedUrl);
        setPhotoPreview(null);
        dispatch(setCredentials({ ...userInfo, photo: cacheBustedUrl }));
        toast.success('Profil fotoğrafı başarıyla yüklendi!');
      } catch (error) {
        toast.error('Profil fotoğrafı yüklenemedi!');
      }
    }
  };




  const handleNameClickl = async () => {
    try {
      // İki API çağrısını paralel olarak başlatıyoruz
      const [res1, res2] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/get-link-owner/${userInfo.referralCode}`, { withCredentials: true }),
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/referredBykod/${userInfo.referralCode}`, { withCredentials: true })
      ]);

      // Yanıtları set ediyoruz
      setReferrerInf(res1.data);
      setReferrerInfs(res2.data);

      // Modal'ı gösteriyoruz
      setShowModa(true);
    } catch (error) {
      // Hata durumunda kullanıcıyı bilgilendiriyoruz
      setReferrerInf({ error: "Asıl davetçi tapılmadı" });
      setReferrerInfs({ error: "Asıl davetçi tapılmadı" });
      setShowModa(true);
    }
  };

  const handleNameClick = async (referralCode) => {
    try {
      // İki API çağrısını paralel olarak başlatıyoruz
      const [res1, res2] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/get-link-owner/${referralCode}`, { withCredentials: true }),
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/referredBykod/${referralCode}`, { withCredentials: true })
      ]);

      // Yanıtları set ediyoruz
      setReferrerInfo(res1.data);
      setReferrerInfoo(res2.data);

      // Modal'ı gösteriyoruz
      setShowModal(true);
    } catch (error) {
      // Hata durumunda kullanıcıyı bilgilendiriyoruz
      setReferrerInfo({ error: "Asıl davetçi tapılmadı" });
      setReferrerInfoo({ error: "Asıl davetçi tapılmadı" });
      setShowModal(true);
    }
  };




  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // 1. İstifadəçi məlumatını al
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/users/getuser/${userInfo._id}`, { withCredentials: true }
        );

        // 2. Ödəniş yoxdursa, kart məlumatını da al
        if (data.payment === false) {
          const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/kart`, { withCredentials: true });
          const kartlar = response.data.allKart || [];

          // 3. Kart nömrələrini HTML formatına sal
          const kartHtml = kartlar.map((item) => {
            return `
              <div class="bg-gray-100 p-4 rounded-lg flex items-center justify-between cursor-pointer border border-gray-300 mb-2 copyCard" data-kart="${item.kart}">
                <span class="font-mono text-lg">${item.kart}</span>
                <button class="text-blue-600 font-semibold text-sm ml-4">Kopyala</button>
              </div>
            `;
          }).join('');

          // 4. SweetAlert ilə göstər
          MySwal.fire({
            title: `💳 Salam, ${data.name}!`,
            html: `
              <p class="text-lg mb-2">Qeydiyyatınızı tamamlamaq üçün zəhmət olmasa ödəniş edin.
		Ödəniş ayda cəmi 1 dəfə – 12 AZN təşkil edir.
		Ödənişdən sonra şəxsi kabinetiniz aktivləşir və qazancınız avtomatik hesablanmağa başlayır.
		Maaş hesablaması yalnız ödəniş edən üzvlər üçün açıqdır.
		Diqqət: Ödəniş geri qaytarılmır.Komandamıza xoş gəlmisiniz – uğura gedən yol buradan başlayır!</p>
              ${kartHtml}
              <p class="text-sm text-gray-500 mt-2">Qeyd: Ödəniş etdikdən sonra qəbzi öz rəhbərinizə mütləq göndərin ✅</p>
            `,
            icon: 'warning',
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonText: 'Sonra',
            cancelButtonColor: '#F87171',
            background: '#f9fafb',
            customClass: {
              popup: 'rounded-2xl shadow-2xl border border-gray-200',
              title: 'text-2xl font-semibold text-gray-800',
            },
            didOpen: () => {
              const cards = document.querySelectorAll('.copyCard');
              cards.forEach((cardDiv) => {
                cardDiv.addEventListener('click', () => {
                  const kart = cardDiv.getAttribute('data-kart');
                  navigator.clipboard.writeText(kart.replace(/\s/g, ''));
                  Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Kart nömrəsi kopyalandı!',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    background: '#ecfdf5',
                    color: '#065f46',
                  });
                });
              });
            },
          });
        }
      } catch (error) {
        console.error('Xəta:', error);
      }
    };

    if (userInfo?._id) {
      checkPaymentStatus();
    }
  }, [userInfo]);


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/users/referral-stats/${userInfo.referralCode}`, { withCredentials: true }
        );
        setStats(res.data);
        setError(null);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Veriler alınamadı.";
        setError(errorMessage);
      }
    };

    if (userInfo?.referralCode) fetchStats();
  }, [userInfo]);

  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/users/salary/${userInfo.referralCode}`, { withCredentials: true }
        );
        setSalaryData(response.data);
        setError(null);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Maaş verisi alınarkən bir xəta baş verdi.";
        setError(errorMessage);
      }
    };

    if (userInfo?.referralCode) fetchSalaryData();
  }, [userInfo]);


  useEffect(() => {
    const fetchUserData = async () => {
      if (!userInfo?._id) return;

      try {
        const { data: userData } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/users/getuser/${userInfo._id}`, { withCredentials: true });

        const currentMonth = new Date().getFullYear() + "-" + (new Date().getMonth() + 1);
        const shownMonth = localStorage.getItem("paymentShownMonth");

        if (userData.payment) {
          if (shownMonth !== currentMonth) {
            MySwal.fire({
              title: "Təbriklər!",
              html: `
    <p>Uğura xoş gəlmisiniz!<br />
    Artıq siz rəsmi şəkildə sistemə daxil oldunuz və bu, həyatınızda yeni bir başlanğıcdır!</p>

    <p><strong>Buradan sonrası sizdən asılıdır.</strong><br />
    12 AZN ilə başlanan bu yol – sizi yüzlərlə qazanan qadın arasında görmək üçün atılmış ilk addımdır.</p>

    <p>📌 <strong>İndi nə etməli?</strong><br />
    1. WhatsApp qrupuna qoşul – dəstək və yönləndirmə üçün.<br />
    2. Gündəlik təlimləri izləməyə başla.<br />
    3. İlk qazancını elə bu gün qazan!</p>

    <p>🔗 <a href="https://chat.whatsapp.com/FohUxmClFmN5SwBunsUydh" target="_blank" style="color: #1d72f3; font-weight: bold;">WhatsApp Qrupuna Qoşul</a></p>
  `,
              icon: "success",
              confirmButtonText: "Bağla"
            });


            localStorage.setItem("paymentShownMonth", currentMonth);
          }
        } else {
          // eğer payment false ise, localStorage temizlensin
          localStorage.removeItem("paymentShownMonth");
        }

      } catch (error) {
        console.error("Payment kontrol hatası:", error);
      }
    };

    fetchUserData();
  }, [userInfo]);

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased text-gray-800 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* BAŞLIQ VƏ AKSİYONLAR */}
        <header className="flex justify-between items-center py-4 border-b-2 border-gray-300">
          <button
            onClick={() => navigate("/")}
            className="text-lg text-gray-600 hover:text-blue-600 font-medium transition-colors"
          >
            &larr; Geri Qayıt
          </button>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            İstifadəçi Paneli
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-red-700 transition-colors text-lg font-medium"
          >
            Çıxış
          </button>
        </header>

        {/* STATİSTİK KARTLARI (Yatay, Məhdud) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-lg border-l-4 border-green-500 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Maaş</p>
            <p className="text-2xl font-bold text-green-700 mt-1">{salaryData?.salary || 0} ₼</p>
          </div>
          <div className="bg-white p-5 rounded-lg border-l-4 border-blue-500 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Mükafat</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">{stats?.totalEarned || 0} ₼</p>
          </div>
          <div className="bg-white p-5 rounded-lg border-l-4 border-purple-500 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Rütbəsi</p>
            <p className="text-2xl font-bold text-purple-700 mt-1">{salaryData?.rank || "—"}</p>
          </div>
        </div>

        {/* ANA KART VƏ TABLAR */}
        <div className="bg-white p-6 rounded-xl shadow-2xl border border-gray-200">

          {/* TAB Naviqasiyası (Bu hissəyə TAB funksionallığı əlavə etmək üçün yeni bir 'state' lazımdır, lakin mən onu yazmadım. Sadəcə vizual olaraq tab kimi görünür) */}
          <div className="border-b border-gray-200 mb-6">
            {/* Dəyişiklik burada: space-x-4 və overflow-x-auto əlavə edildi */}
            <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto" aria-label="Tabs">
              <a
                href="#"
                onClick={() => setActiveTab('profile')}
                className={`
            ${activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600 font-semibold'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium'
                  } 
            whitespace-nowrap py-4 px-2 sm:px-4 text-lg border-b-2 transition-colors
        `}
              >
                Profil & Məlumatlar
              </a>

              {/* TAB 2: Sağ Sol Qollar */}
              <a
                href="#"
                onClick={() => setActiveTab('groups')}
                className={`
            ${activeTab === 'groups'
                    ? 'border-blue-500 text-blue-600 font-semibold'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium'
                  } 
            whitespace-nowrap py-4 px-2 sm:px-4 text-lg border-b-2 transition-colors
        `}
              >
                Sağ Sol Qollar
              </a>

              {/* TAB 3: Qruplar Cədvəli */}
              <a
                href="#"
                onClick={() => setActiveTab('qrouplar')}
                className={`
            ${activeTab === 'qrouplar'
                    ? 'border-blue-500 text-blue-600 font-semibold'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium'
                  } 
            whitespace-nowrap py-4 px-2 sm:px-4 text-lg border-b-2 transition-colors
        `}
              >
                Qruplar Cədvəli
              </a>

              {/* TAB 4: Şəxsi Dəvətlilər */}
              <a
                href="#"
                onClick={() => setActiveTab('referrals')}
                className={`
            ${activeTab === 'referrals'
                    ? 'border-blue-500 text-blue-600 font-semibold'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium'
                  } 
            whitespace-nowrap py-4 px-2 sm:px-4 text-lg border-b-2 transition-colors
        `}
              >
                Şəxsi Dəvətlilər
              </a>

              {/* 'Cədvələ Keçid' düyməsi */}
              {/* Bu düyməni kiçik ekranda gizlədib, tablar bitdikdən sonra göstərə bilərik (optional) */}
              <button
                onClick={() => navigate("/cedvel")}
                className="text-base font-medium text-blue-600 hover:text-blue-800 ml-auto whitespace-nowrap self-center pr-2"
              >
                Cədvələ Keçid &rarr;
              </button>
            </nav>
          </div>

          {/* TAB 1: PROFİL VƏ FORMLAR */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* SOL: PROFİL VƏ ŞƏXSİ MƏLUMAT */}
              <div className="lg:col-span-1 space-y-6">
                <div className="text-center space-y-3 p-4 border rounded-lg bg-gray-50">
                  <div className="relative w-32 h-32 mx-auto">
                    <img
                      src={photoPreview || photo}
                      alt="Profil"
                      className="w-full h-full object-cover rounded-full border-4 border-white ring-2 ring-blue-500 shadow"
                    />
                    <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                      <FaCamera className="text-white h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
                  <p className="text-md text-gray-600">{email}</p>
                  {error && (
                    <p className="text-red-500 text-sm font-medium">{error}</p>
                  )}
                </div>

                {/* ŞƏXSİ MƏLUMATLAR AÇILIR/KAPANIR */}
                <div className="border rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowInfo(!showInfo)}>
                    <h3 className="text-lg font-semibold text-gray-700">Şəxsi Detallar</h3>
                    <span className="text-blue-500 font-bold text-xl">{showInfo ? "−" : "+"}</span>
                  </div>

                  {showInfo && (
                    <dl className=" space-y-3 text-left p-2 border-t mt-4 pt-4">
                      <div className="flex justify-between border-b pb-1">
                        <dt className="text-sm font-medium text-gray-500">Ad Soyad:</dt>
                        <dd onClick={() => handleNameClickl(userInfo.referralCode)} className="text-sm font-semibold text-blue-600 cursor-pointer hover:underline">{userInfo.name}</dd>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <dt className="text-sm font-medium text-gray-500">Telefon:</dt>
                        <dd className="text-sm text-gray-900">{userInfo.phone}</dd>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <dt className="text-sm font-medium text-gray-500">FIN Kod:</dt>
                        <dd className="text-sm text-gray-900">{userInfo.finCode}</dd>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <dt className="text-sm font-medium text-gray-500">Ödəniş:</dt>
                        <dd className={`text-sm font-semibold ${userInfo.payment ? 'text-green-600' : 'text-red-600'}`}>
                          {userInfo.payment ? "Ödənilib" : "Ödənilməyib"}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-sm font-medium text-gray-500">Ata Adı:</dt>
                        <dd className="text-sm text-gray-900">{userInfo.faze}</dd>
                      </div>
                    </dl>
                  )}
                </div>
              </div>

              {/* SAĞ: FORM BLOKU */}
              <div className="lg:col-span-2 space-y-6 border p-6 rounded-lg bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900 border-b pb-3">Kart və Referans Məlumatları</h2>

                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Kart Nömrəsi */}
                  <div>
                    <label htmlFor="card-input" className="block text-sm font-medium text-gray-700 mb-2">
                      Kart Nömrəsi
                    </label>
                    <input
                      id="card-input"
                      type="text"
                      value={card}
                      onChange={(e) => setCard(e.target.value)}
                      placeholder="0000 0000 0000 0000"
                      className="w-full border border-gray-300 rounded-md p-3 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    />
                  </div>

                  {/* İstifadəçi Kodu VƏ Referans Linki */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* İstifadəçi Kodu */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        İstifadəçi Kodunuz
                      </label>
                      <div className="flex border border-gray-300 rounded-md overflow-hidden">
                        <span className="flex-1 p-3 bg-white text-gray-700 text-sm truncate">
                          {referralLink}
                        </span>
                        <button
                          type="button"
                          onClick={copyReferralLinke}
                          className="px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Kodu Kopyala
                        </button>
                      </div>
                    </div>

                    {/* Referans Linki */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Referans Linkiniz
                      </label>
                      <div className="flex border border-gray-300 rounded-md overflow-hidden">
                        <a
                          href={`${window.location.origin}/register?referral=${referralLink}`}
                          target="_blank" // İsteğe bağlı: Linki yeni sekmede açar
                          className="flex-1 p-3 bg-white text-blue-600 text-sm truncate cursor-pointer hover:underline" // 'cursor-pointer' ve 'hover:underline' ekledim
                        >
                          {`${window.location.origin}/register?referral=${referralLink}`}
                        </a>
                        <button
                          type="button"
                          onClick={copyReferralLink}
                          className="px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Linki Kopyala
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Güncelle Butonu */}
                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-lg font-medium shadow"
                    >
                      Məlumatları Güncəllə
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: TABLOLAR */}
          <div className="space-y-8 mt-12 pt-6 border-t border-gray-200">

            {/* SAĞ SOL QOLLAR TABLOSU */}

            {activeTab === 'groups' && (

              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <header className="flex justify-between items-center p-4 border-b bg-gray-50">
                  <h2 className="text-xl font-bold text-gray-800">Sağ Sol Qollar Cədvəli</h2>

                </header>
                {referredUsers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ad Soyad</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Kod</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ödəniş</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Qrup Sayı</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tarix</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {referredUsers.map((user, index) => (
                          <tr key={user._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 cursor-pointer hover:underline" onClick={() => handleNameClick(user.referralCode)}>
                              {user.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.referralCode}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 truncate">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.payment ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {user.payment ? 'Ödənilib' : 'Ödənilməyib'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {index === 0 && referredUsers.length >= 2
                                ? `${sagGrupSayisi.total} (${sagGrupSayisi.paid} ödənişli)`
                                : index === 1 && referredUsers.length >= 2
                                  ? `${solGrupSayisi.total} (${solGrupSayisi.paid} ödənişli)`
                                  : "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="p-6 text-gray-600">Qol yoxdur.</p>
                )}
              </div>
            )}

            {/* QRUPLAR TABLOSU */}

            {activeTab === 'qrouplar' && (

              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <h2 className="text-xl font-bold text-gray-800 p-4 border-b bg-gray-50">Bütün Qruplar</h2>

                <div className="p-4 flex flex-col sm:flex-row gap-4 border-b bg-white">
                  <input
                    type="text"
                    placeholder="Ad / Kod ilə axtarış"
                    className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <select
                    value={paymentFilters === null ? "" : paymentFilters ? "paid" : "unpaid"}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "paid") setPaymentFilters(true);
                      else if (val === "unpaid") setPaymentFilters(false);
                      else setPaymentFilters(null);
                    }}
                    className="p-3 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    <option value="">Bütün Ödənişlər</option>
                    <option value="paid">Ödəniş Edənlər</option>
                    <option value="unpaid">Ödəniş Etməyənlər</option>
                  </select>
                </div>

                {filteredUsers.length > 0 ? (
                  <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="sticky top-0 bg-white">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">#</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ad Soyad</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Kod</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ödəniş</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tarix</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {filteredUsers.map((user, index) => (
                          <tr key={user._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{index + 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 cursor-pointer hover:underline" onClick={() => handleNameClick(user.referralCode)}>
                              {user.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.referralCode}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 truncate">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.payment ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {user.payment ? 'Ödənilib' : 'Ödənilməyib'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="p-6 text-gray-600">Axtarışa uyğun qrup üzvü tapılmadı.</p>
                )}
              </div>

            )}

            {/* ŞƏXSİ DƏVƏTLİLƏR TABLOSU */}

            {activeTab === 'referrals' && (

              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <h2 className="text-xl font-bold text-gray-800 p-4 border-b bg-gray-50">Şəxsi Dəvətlilər</h2>

                <div className="p-4 flex flex-col sm:flex-row gap-4 border-b bg-white">
                  <input
                    type="text"
                    placeholder="Ad / Kod ilə axtarış"
                    className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                    value={searchTert}
                    onChange={(e) => setSearchTert(e.target.value)}
                  />
                  <select
                    value={paymentFilter === null ? "" : paymentFilter ? "paid" : "unpaid"}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "paid") setPaymentFilter(true);
                      else if (val === "unpaid") setPaymentFilter(false);
                      else setPaymentFilter(null);
                    }}
                    className="p-3 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    <option value="">Bütün Ödənişlər</option>
                    <option value="paid">Ödəniş Edənlər</option>
                    <option value="unpaid">Ödəniş Etməyənlər</option>
                  </select>
                </div>

                {filteredUserz.length > 0 ? (
                  <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="sticky top-0 bg-white">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">#</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ad Soyad</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Kod</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ödəniş</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tarix</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {filteredUserz.map((user, index) => (
                          <tr key={user._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{index + 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 cursor-pointer hover:underline" onClick={() => handleNameClick(user.referralCode)}>
                              {user.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.referralCode}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 truncate">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.payment ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {user.payment ? 'Ödənilib' : 'Ödənilməyib'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="p-6 text-gray-600">Axtarışa uyğun şəxsi dəvətli tapılmadı.</p>
                )}
              </div>

            )}
          </div>
        </div>
      </div>

      {/* MODALLAR */}

      {/* "Şəxsi Məlumatlar" Ad Tıklama Modalı */}
      {showModa && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl relative w-full max-w-sm border border-gray-300">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setShowModa(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <h3 className="text-xl font-bold text-center text-blue-600 mb-6 border-b pb-3">Dəvət Məlumatları</h3>

            <div className="space-y-6">
              {/* Dəvət Edən Şəxs */}
              <div className="text-center p-4 border rounded-md bg-blue-50">
                <h4 className="text-lg font-semibold text-blue-800 mb-3">Dəvət edən Şəxs</h4>
                {referrerInf?.error ? (
                  <p className="text-red-500">{referrerInf.error}</p>
                ) : (
                  <div className="space-y-2">
                    {referrerInf.referrerPhoto && (
                      <img src={referrerInf.referrerPhoto} alt="Referrer" className="w-16 h-16 object-cover mx-auto rounded-full ring-2 ring-white" />
                    )}
                    <p className="text-base font-medium text-gray-700">{referrerInf.referrerName}</p>
                    <p className="text-sm text-gray-500">{referrerInf.referrerEmail}</p>
                  </div>
                )}
              </div>

              {/* Lider */}
              <div className="text-center p-4 border rounded-md bg-purple-50">
                <h4 className="text-lg font-semibold text-purple-800 mb-3">Lider</h4>
                {referrerInfs?.error ? (
                  <p className="text-red-500">{referrerInfs.error}</p>
                ) : (
                  <div className="space-y-2">
                    {referrerInfs.referrerPhoto && (
                      <img src={referrerInfs.referrerPhoto} alt="Lider" className="w-16 h-16 object-cover mx-auto rounded-full ring-2 ring-white" />
                    )}
                    <p className="text-base font-medium text-gray-700">{referrerInfs.referrerName}</p>
                    <p className="text-sm text-gray-500">{referrerInfs.referrerEmail}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tablo Ad Tıklama Modalı */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl relative w-full max-w-sm border border-gray-300">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setShowModal(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <h3 className="text-xl font-bold text-center text-blue-600 mb-6 border-b pb-3">Dəvət Məlumatları</h3>

            <div className="space-y-6">
              {/* Dəvət Edən Şəxs */}
              <div className="text-center p-4 border rounded-md bg-blue-50">
                <h4 className="text-lg font-semibold text-blue-800 mb-3">Dəvət edən Şəxs</h4>
                {referrerInfo?.error ? (
                  <p className="text-red-500">{referrerInfo.error}</p>
                ) : (
                  <div className="space-y-2">
                    {referrerInfo.referrerPhoto && (
                      <img src={referrerInfo.referrerPhoto} alt="Referrer" className="w-16 h-16 object-cover mx-auto rounded-full ring-2 ring-white" />
                    )}
                    <p className="text-base font-medium text-gray-700">{referrerInfo.referrerName}</p>
                    <p className="text-sm text-gray-500">{referrerInfo.referrerEmail}</p>
                  </div>
                )}
              </div>

              {/* Lider */}
              <div className="text-center p-4 border rounded-md bg-purple-50">
                <h4 className="text-lg font-semibold text-purple-800 mb-3">Lider</h4>
                {referrerInfoo?.error ? (
                  <p className="text-red-500">{referrerInfoo.error}</p>
                ) : (
                  <div className="space-y-2">
                    {referrerInfoo.referrerPhoto && (
                      <img src={referrerInfoo.referrerPhoto} alt="Lider" className="w-16 h-16 object-cover mx-auto rounded-full ring-2 ring-white" />
                    )}
                    <p className="text-base font-medium text-gray-700">{referrerInfoo.referrerName}</p>
                    <p className="text-sm text-gray-500">{referrerInfoo.referrerEmail}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;