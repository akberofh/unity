import axios from 'axios';

// 1. Axios Instance oluşturun
const apiClient = axios.create({
  baseURL: '/api', 
  withCredentials: true, // HttpOnly çerezlerini göndermek için gerekli
});

// 2. Yenileme durumunu takip etmek için bir değişken
let isRefreshing = false;
let failedQueue = [];

// Başarısız istekleri kuyruğa ekleme ve çalıştırma fonksiyonu
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 3. Response Interceptor'ü Ekleme
apiClient.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    // Eğer 401 hatası alırsak ve bu istek zaten bir yenileme isteği değilse
    if (error.response.status === 401 && !originalRequest._retry) {
      
      // Yenileme işlemini zaten yapıyorsak, isteği kuyruğa ekle
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true; // Tekrar denendi işaretle
      isRefreshing = true; // Yenileme işlemi başladı
      
      try {
        // Yeni Erişim Tokenı almak için özel rotaya istek at
        // Bu istek, HttpOnly çerezdeki Refresh Token'ı otomatik olarak kullanır
        const response = await apiClient.post('/auth/refresh'); 
        
        const newAccessToken = response.data.accessToken;
        
        // Yeni token'ı orijinal isteğin Authorization başlığına ekle
        apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
        originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;

        // Kuyruktaki tüm bekleyen istekleri yeni token ile tekrar gönder
        processQueue(null, newAccessToken);
        isRefreshing = false;

        // Orijinal isteği tekrar gönder
        return apiClient(originalRequest);

      } catch (refreshError) {
        // Yenileme Tokenı da geçersizse (süresi dolmuşsa), kullanıcıyı çıkış yapmaya yönlendir
        processQueue(refreshError, null);
        isRefreshing = false;
        // ⚠️ Redux/State'te logout aksiyonunu tetikleyin ve kullanıcıyı giriş sayfasına yönlendirin.
        // store.dispatch(logout()); 
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;