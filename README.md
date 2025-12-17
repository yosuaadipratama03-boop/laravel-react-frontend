NAMA : YOSUA CHRISTIAN ADI PRATAMA
NIM : G.211.23.0016



# Laravel React Frontend

## Deskripsi Project

Project ini merupakan **Frontend aplikasi web** yang dibangun menggunakan **ReactJS** dan terintegrasi dengan **Backend Laravel API**.

Frontend ini berfungsi sebagai antarmuka pengguna (User Interface) yang mengonsumsi **RESTful API** dari backend untuk menampilkan data, melakukan proses **CRUD**, serta menangani **autentikasi user**.

Project ini digunakan sebagai bagian dari praktikum **ReactJS** dan penyempurnaan praktikum **Laravel API CRUD**.

---

## Teknologi yang Digunakan

* ReactJS
* JavaScript (ES6+)
* Axios (HTTP Client)
* Node.js & npm
* Laravel API (Backend)

---

## Fitur Utama

* Halaman Login & Register
* Autentikasi menggunakan API Laravel
* Menampilkan data dari API
* CRUD Data (Create, Read, Update, Delete)
* Proteksi halaman berdasarkan status login
* Terintegrasi dengan Backend Laravel API

---

## Cara Install & Menjalankan Project

### 1. Clone Repository

```bash
git clone https://github.com/yosuaadipratama03-boop/laravel-react-frontend.git
cd laravel-react-frontend
```

### 2. Install Dependency

```bash
npm install
```

### 3. Konfigurasi API Endpoint

Pastikan URL API backend sudah sesuai, contoh pada file konfigurasi:

```js
const API_URL = "http://127.0.0.1:8000/api";
```

### 4. Jalankan Aplikasi

```bash
npm run dev
```

Aplikasi frontend berjalan di:

```
http://localhost:5173
```

---

## Keterkaitan dengan Backend

Frontend ini **mengonsumsi API** dari repository backend berikut:

```
https://github.com/yosuaadipratama03-boop/laravel-crud-api-backend
```

---

## Catatan Penting

* Folder `node_modules/` **tidak diupload** ke GitHub
* File `.env` **tidak diupload** ke GitHub
* Backend Laravel API **harus dijalankan terlebih dahulu**

---

## Author

Nama: Yosua Christian Adi Pratama
Program Studi: Informatika / Teknik Informatika
