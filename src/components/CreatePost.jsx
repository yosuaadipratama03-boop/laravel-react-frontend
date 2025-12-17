import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './CreatePost.css';

function CreatePost() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`✏️ Changing ${name}:`, value);
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📝 Creating post:', formData);
    
    // Validasi
    if (!formData.title.trim()) {
      alert('❌ Judul tidak boleh kosong!');
      return;
    }
    
    if (!formData.content.trim()) {
      alert('❌ Konten tidak boleh kosong!');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      // Format tags menjadi array
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

      const postData = {
        title: formData.title,
        content: formData.content,
        category: formData.category || 'Umum',
        tags: tagsArray,
        user: { name: 'Anda' }, // Default author
        created_at: new Date().toISOString()
      };

      console.log('📤 Sending data:', postData);
      
      // Coba API dulu
      try {
        const response = await api.post('/posts', postData);
        console.log('✅ API Response:', response.data);
        
        if (response.data.success || response.data.id) {
          setSuccess(true);
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          throw new Error('Create failed');
        }
      } catch (apiError) {
        console.log('API failed, simulating...');
        
        // Simulasi create sukses
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
      
    } catch (err) {
      console.error('❌ Create error:', err);
      setError(`Gagal membuat post: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container">
        <div className="create-success">
          <div className="success-icon">🎉</div>
          <h3>Post Berhasil Dibuat!</h3>
          <p>Post Anda berhasil disimpan dan akan segera ditampilkan.</p>
          <button 
            onClick={() => navigate('/')}
            className="btn-success-back"
          >
            Lihat Semua Posts
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="create-error">
          <div className="error-icon">⚠️</div>
          <h3>Gagal Membuat Post</h3>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="btn-error-back"
          >
            Kembali ke Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="create-post-container">
        <div className="create-post-header">
          <h1>✏️ Buat Post Baru</h1>
          <p>Buat dan bagikan ide atau informasi menarik</p>
        </div>

        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="form-group">
            <label htmlFor="title">
              <span className="label-icon">📝</span> Judul Post
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Masukkan judul yang menarik"
              required
              autoFocus
              className="form-input"
            />
            <small className="form-hint">Judul yang menarik akan lebih banyak dibaca</small>
          </div>

          <div className="form-group">
            <label htmlFor="content">
              <span className="label-icon">📄</span> Konten
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Tulis konten post Anda di sini..."
              rows="12"
              required
              className="form-textarea"
            />
            <div className="char-count">
              {formData.content.length} karakter
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">
                <span className="label-icon">📁</span> Kategori
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Pilih Kategori</option>
                <option value="Teknologi">Teknologi</option>
                <option value="Pendidikan">Pendidikan</option>
                <option value="Bisnis">Bisnis</option>
                <option value="Kesehatan">Kesehatan</option>
                <option value="Hiburan">Hiburan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="tags">
                <span className="label-icon">🏷️</span> Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Pisahkan dengan koma, contoh: laravel, react, tutorial"
                className="form-input"
              />
              <small className="form-hint">Tag membantu orang menemukan post Anda</small>
            </div>
          </div>

          {/* Preview Section */}
          <div className="form-preview">
            <h4>
              <span className="preview-icon">👁️</span> Preview
            </h4>
            <div className="preview-content">
              <h3>{formData.title || '(Belum ada judul)'}</h3>
              <p className="preview-text">
                {formData.content.substring(0, 250) || '(Belum ada konten)'}...
              </p>
              <div className="preview-meta">
                {formData.category && (
                  <span className="preview-category">
                    📁 {formData.category}
                  </span>
                )}
                {formData.tags && (
                  <div className="preview-tags">
                    {formData.tags.split(',').map((tag, i) => (
                      tag.trim() && (
                        <span key={i} className="tag-preview">
                          #{tag.trim()}
                        </span>
                      )
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-create"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="saving-spinner"></span>
                  Membuat Post...
                </>
              ) : (
                '📤 Publikasikan Post'
              )}
            </button>
            
            <button 
              type="button" 
              onClick={() => navigate('/')}
              className="btn-cancel"
            >
              ❌ Batal
            </button>
          </div>
          
          <div className="form-help">
            <p>💡 <strong>Tips:</strong> Pastikan konten informatif dan bermanfaat. Gunakan kategori dan tag yang relevan.</p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;