import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import './PostDetail.css';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      console.log('Fetching post ID:', id);
      
      // Data dummy untuk testing
      const dummyPost = {
        id: parseInt(id),
        title: `Contoh Post ${id}`,
        content: `<p>Ini adalah contoh konten lengkap dari post ID ${id}. Anda bisa melihat detail lengkap disini.</p>
                 <p>Post ini dibuat untuk demonstrasi fitur <strong>Baca Selengkapnya</strong> dengan tombol Edit dan Hapus.</p>
                 <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                 <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>`,
        user: { name: "Admin" },
        category: { name: "Teknologi" },
        created_at: "2024-11-28T10:00:00Z",
        tags: ["Laravel", "Web Development", "Tutorial"]
      };
      
      // Coba API dulu, jika gagal pakai dummy
      try {
        const response = await api.get(`/posts/${id}`);
        console.log('API Success:', response.data);
        setPost(response.data);
      } catch (apiError) {
        console.log('Using dummy data for post');
        setPost(dummyPost);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Gagal memuat artikel');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Yakin ingin menghapus artikel "${post?.title}"?`)) {
      return;
    }
    
    setDeleting(true);
    
    try {
      console.log('Deleting post ID:', id);
      
      // Coba API delete dulu
      try {
        const response = await api.delete(`/posts/${id}`);
        console.log('Delete response:', response.data);
        
        if (response.data.success) {
          alert(`✅ Post "${post?.title}" berhasil dihapus!`);
          navigate('/posts');
        } else {
          throw new Error('Delete failed');
        }
      } catch (apiError) {
        console.log('API delete failed, simulating...');
        
        // Simulasi delete sukses
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        alert(`✅ Post "${post?.title}" berhasil dihapus! (Simulasi)`);
        navigate('/posts');
      }
      
    } catch (err) {
      console.error('Delete error:', err);
      alert(`❌ Gagal menghapus post: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = post?.title || 'Post';
    
    let shareUrl = '';
    switch(platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) return (
    <div className="post-detail-loading">
      <div className="loading-spinner"></div>
      <p>Memuat artikel...</p>
    </div>
  );

  if (error) return (
    <div className="post-detail-error">
      <div className="error-icon">⚠️</div>
      <h3>Gagal memuat artikel</h3>
      <p>{error}</p>
      <button onClick={() => navigate('/posts')} className="btn-back">
        ← Kembali ke Daftar
      </button>
    </div>
  );

  if (!post) return (
    <div className="post-not-found">
      <h2>Artikel tidak ditemukan</h2>
      <p>Artikel yang Anda cari tidak tersedia.</p>
      <Link to="/posts" className="btn-back">
        ← Kembali ke Daftar
      </Link>
    </div>
  );

  return (
    <div className="container">
      <div className="post-detail-container">
        <article className="post-detail-card">
          <div className="post-detail-header">
            <button onClick={() => navigate('/posts')} className="back-button">
              ← Kembali ke Daftar
            </button>
            <h1 className="post-detail-title">{post.title}</h1>
          </div>

          <div className="post-detail-meta">
            <div className="meta-badges">
              {post.category && (
                <span className="badge badge-category">
                  📁 {post.category.name || post.category || 'Umum'}
                </span>
              )}
              {post.user && (
                <span className="badge badge-author">
                  👤 {post.user.name || 'Anonymous'}
                </span>
              )}
              {post.tags && post.tags.map((tag, index) => (
                <span key={index} className="badge badge-tag">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="meta-date">
              <span className="date-icon">📅</span>
              {post.created_at ? new Date(post.created_at).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'Tanggal tidak tersedia'}
            </div>
          </div>

          <div className="post-detail-content">
            {post.content ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <p>Tidak ada konten tersedia.</p>
            )}
          </div>

          <div className="post-detail-actions">
            <Link to={`/edit-post/${id}`} className="btn-edit">
              ✏️ Edit Post
            </Link>
            <button 
              onClick={handleDelete} 
              className="btn-delete"
              disabled={deleting}
            >
              {deleting ? '🗑️ Menghapus...' : '🗑️ Hapus Post'}
            </button>
          </div>

          <div className="share-section">
            <h4>Bagikan artikel ini:</h4>
            <div className="share-buttons">
              <button onClick={() => handleShare('twitter')} className="share-btn twitter">
                <span className="share-icon">🐦</span>
                Twitter
              </button>
              <button onClick={() => handleShare('facebook')} className="share-btn facebook">
                <span className="share-icon">👤</span>
                Facebook
              </button>
              <button onClick={() => handleShare('whatsapp')} className="share-btn whatsapp">
                <span className="share-icon">💬</span>
                WhatsApp
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

export default PostDetail;