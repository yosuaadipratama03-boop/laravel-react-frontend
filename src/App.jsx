import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import PostList from './components/PostList';
import CreatePost from './components/CreatePost';
import PostDetail from './components/PostDetail';
import EditPost from './components/EditPost';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        {/* Navbar yang lebih sederhana */}
        <nav className="navbar">
          <div className="navbar-container">
            <Link to="/" className="logo">📝 Blog App</Link>
            <div className="nav-links">
              <Link to="/" className="nav-link">
                <span className="nav-icon">📄</span>
                Posts
              </Link>
              <Link to="/create-post" className="nav-link">
                <span className="nav-icon">✏️</span>
                Buat Post
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Content - hanya routes untuk posts */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/posts" element={<PostList />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/edit-post/:id" element={<EditPost />} />
          </Routes>
        </main>

        {/* Footer sederhana */}
        <footer className="footer">
          <div className="container">
            <p>© {new Date().getFullYear()} Blog App - Dibuat dengan React & Laravel</p>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;