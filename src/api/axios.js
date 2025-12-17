import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: false,
  timeout: 15000,
});

// ---- Interceptor untuk SIMULASI PUT/DELETE ----
api.interceptors.request.use(
  (config) => {
    console.log(`📤 API Request → [${config.method.toUpperCase()}] ${config.baseURL}${config.url}`);
    
    // SIMULASI: Jika endpoint edit/delete belum ada di backend
    if (config.method === 'put' || config.method === 'delete') {
      console.log('⚠️ Simulating API call for:', config.url);
    }
    
    if (config.data) console.log('Payload:', config.data);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// ---- Interceptor Response untuk SIMULASI ----
api.interceptors.response.use(
  (response) => {
    console.log(`📥 Response ← ${response.status} | ${response.config.url}`);
    return response;
  },
  (error) => {
    // Jika error karena endpoint belum ada, kita simulasi response
    if (error.response && error.response.status === 404) {
      const url = error.config.url;
      
      // SIMULASI untuk PUT /posts/{id}
      if (error.config.method === 'put' && url.includes('/posts/')) {
        console.log('🔄 Simulating PUT success');
        return Promise.resolve({
          data: { 
            success: true, 
            message: 'Post updated successfully (simulated)',
            id: url.split('/').pop()
          },
          status: 200,
          statusText: 'OK',
          config: error.config,
          headers: {}
        });
      }
      
      // SIMULASI untuk DELETE /posts/{id}
      if (error.config.method === 'delete' && url.includes('/posts/')) {
        console.log('🔄 Simulating DELETE success');
        return Promise.resolve({
          data: { 
            success: true, 
            message: 'Post deleted successfully (simulated)',
            id: url.split('/').pop()
          },
          status: 200,
          statusText: 'OK',
          config: error.config,
          headers: {}
        });
      }
    }
    
    console.error('❌ API Error:', error.message);
    return Promise.reject(error);
  }
);

export default api;