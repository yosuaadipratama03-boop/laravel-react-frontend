import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import './PostList.css';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      // Test dulu dengan static data
      const testData = [
        {
          id: 1,
          title: "Contoh Post 1",
          content: "Ini adalah contoh konten post pertama untuk testing frontend React.js dengan Laravel API backend.",
          user: { name: "Admin" },
          category: { name: "Teknologi" },
          created_at: "2024-11-28T10:00:00Z"
        },
        {
          id: 2, 
          title: "Contoh Post 2",
          content: "Post kedua untuk demonstrasi tampilan grid cards dengan design yang responsive dan modern.",
          user: { name: "User" },
          category: { name: "Pendidikan" },
          created_at: "2024-11-27T15:30:00Z"
        }
      ];
      
      // Coba API dulu, jika error pakai test data
      try {
        const response = await api.get('/posts');
        console.log('API Success:', response.data);
        setPosts(response.data.data || response.data || testData);
      } catch (apiError) {
        console.warn('API failed, using test data:', apiError.message);
        setPosts(testData);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="posts-loading">
      <div className="loading-spinner"></div>
      <p>Memuat posts...</p>
    </div>
  );

  if (error) return (
    <div className="posts-error">
      <div className="error-icon">⚠️</div>
      <div>
        <h3>Terjadi Error</h3>
        <p>{error}</p>
        <p style={{fontSize: '0.875rem', marginTop: '0.5rem'}}>
          Pastikan Laravel backend berjalan di localhost:8000
        </p>
      </div>
    </div>
  );

  return (
    <div className="container">
      <div className="posts-container">
        {/* Header sederhana */}
        <div className="posts-header">
          <h1>📝 Daftar Posts</h1>
          <p>Jelajahi artikel dan konten menarik</p>
        </div>

        {posts.length === 0 ? (
          <div className="posts-empty">
            <div className="empty-icon">📝</div>
            <h3>Belum ada post</h3>
            <p>Mulai dengan membuat post pertama Anda.</p>
            <Link to="/create-post" className="create-post-btn" style={{marginTop: '1rem'}}>
              <span>+</span>
              Buat Post Pertama
            </Link>
          </div>
        ) : (
          <>
            {/* Tombol Create Post di atas grid */}
            <div className="posts-actions">
              <Link to="/create-post" className="create-post-btn">
                <span>+</span>
                Buat Post Baru
              </Link>
            </div>

            <div className="posts-grid">
              {posts.map(post => (
                <article key={post.id} className="post-card">
                  <div className="post-header">
                    <h2 className="post-title">{post.title || 'No Title'}</h2>
                  </div>

                  <div className="post-badges">
                    {post.category && (
                      <span className="badge badge-category">
                        <span className="badge-icon">📁</span>
                        {post.category.name}
                      </span>
                    )}
                    {post.user && (
                      <span className="badge badge-author">
                        <span className="badge-icon">👤</span>
                        {post.user.name}
                      </span>
                    )}
                  </div>

                  <p className="post-content">
                    {post.content && post.content.length > 150 
                      ? `${post.content.substring(0, 150)}...` 
                      : post.content || 'No content available'
                    }
                  </p>

                  <div className="post-actions">
                    <Link to={`/post/${post.id}`} className="read-more-btn">
                      Baca Selengkapnya
                      <span className="arrow">→</span>
                    </Link>
                  </div>

                  <div className="post-footer">
                    <div className="post-meta">
                      <span className="meta-date">
                        <span className="meta-icon">📅</span>
                        {post.created_at ? new Date(post.created_at).toLocaleDateString('id-ID') : 'Unknown'}
                      </span>
                      <span className="meta-views">
                        <span className="meta-icon">👁️</span>
                        {Math.floor(Math.random() * 500) + 50} views
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PostList;