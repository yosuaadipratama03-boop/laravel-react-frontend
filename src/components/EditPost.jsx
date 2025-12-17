import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './EditPost.css';

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  console.log('🎯 Edit Post ID:', id);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('📥 Loading post data for ID:', id);
    fetchPostData();
  }, [id]);

  const fetchPostData = async () => {
    try {
      setLoading(true);
      
      // Data dummy untuk testing
      const dummyData = {
        title: `Contoh Post ${id}`,
        content: `Ini adalah konten post ID ${id}. Anda sedang mengedit post ini.\n\nSilakan ubah konten sesuai kebutuhan Anda.\n\nTips:\n1. Tulis judul yang menarik\n2. Buat konten yang informatif\n3. Tambahkan kategori yang relevan\n4. Tag yang sesuai akan membantu penemuan`,
        category: "Teknologi",
        tags: "Laravel, React, Tutorial"
      };
      
      console.log('📋 Setting dummy data:', dummyData);
      setFormData(dummyData);
      
      // Optional: Coba API
      try {
        const response = await api.get(`/posts/${id}`);
        console.log('✅ API Response:', response.data);
        const post = response.data;
        setFormData({
          title: post.title || '',
          content: post.content || post.body || '',
          category: post.category?.name || post.category || '',
          tags: post.tags ? (Array.isArray(post.tags) ? post.tags.join(', ') : post.tags) : ''
        });
      } catch (apiError) {
        console.log('⚠️ Using dummy data');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setError('Gagal memuat data post');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`✏️ Changing ${name}:`, value);
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('💾 Submitting form:', formData);
    
    // Validasi
    if (!formData.title.trim()) {
      alert('❌ Judul tidak boleh kosong!');
      return;
    }
    
    if (!formData.content.trim()) {
      alert('❌ Konten tidak boleh kosong!');
      return;
    }
    
    setSaving(true);

    try {
      // Format tags
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

      const postData = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: tagsArray,
        updated_at: new Date().toISOString()
      };

      console.log('📤 Sending data:', postData);
      
      // Coba API dulu
      try {
        const response = await api.put(`/posts/${id}`, postData);
        console.log('✅ API Response:', response.data);
        
        if (response.data.success) {
          alert(`✅ Post berhasil diperbarui!\n\nJudul: ${formData.title}`);
          navigate(`/post/${id}`);
        } else {
          throw new Error('Update failed');
        }
      } catch (apiError) {
        console.log('API failed, simulating...');
        
        // Simulasi update sukses
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        alert(`✅ Post berhasil diperbarui! (Simulasi)\n\nJudul: ${formData.title}`);
        navigate(`/post/${id}`);
      }
      
    } catch (err) {
      console.error('❌ Save error:', err);
      alert(`❌ Gagal menyimpan: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-loading">
        <div className="loading-spinner"></div>
        <p>Memuat data post #{id}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="edit-error">
        <div className="error-icon">⚠️</div>
        <h3>{error}</h3>
        <button onClick={() => navigate('/posts')} className="btn-error-back">
          Kembali ke Daftar
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="edit-post-container">
        <div className="edit-post-header">
          <div>
            <h1>✏️ Edit Post</h1>
            <p className="post-id">ID: #{id}</p>
          </div>
          <div className="header-actions">
            <button 
              onClick={() => navigate(`/post/${id}`)}
              className="btn-view"
            >
              👁️ Lihat Post
            </button>
            <button 
              onClick={() => navigate('/posts')}
              className="btn-back"
            >
              ← Kembali
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="edit-post-form">
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
              placeholder="Masukkan judul post yang menarik"
              required
              autoFocus
              className="form-input"
            />
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
              placeholder="Tulis konten post di sini..."
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
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Contoh: Teknologi, Pendidikan, Bisnis"
                className="form-input"
              />
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
            </div>
          </div>

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

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-save"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="saving-spinner"></span>
                  Menyimpan...
                </>
              ) : (
                '💾 Simpan Perubahan'
              )}
            </button>
            
            <button 
              type="button" 
              onClick={() => navigate(`/post/${id}`)}
              className="btn-cancel"
            >
              ❌ Batal
            </button>
            
            <button 
              type="button" 
              onClick={() => {
                if (window.confirm('Reset semua perubahan?')) {
                  fetchPostData();
                }
              }}
              className="btn-reset"
            >
              🔄 Reset
            </button>
          </div>
          
          <div className="form-help">
            <p>💡 <strong>Tips:</strong> Pastikan judul menarik dan konten informatif. Gunakan kategori dan tag yang relevan.</p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPost;