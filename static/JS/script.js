const API_URL = 'http://127.0.0.1:5000/api/stock';
let dataBarangGudang = []; // Untuk menyimpan data ID & Nama dari database

// Ambil data dari database saat halaman kasir dibuka agar dropdown tersinkron otomatis
document.addEventListener("DOMContentLoaded", () => {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            dataBarangGudang = data.stock;
            const dropdown = document.getElementById("pilihan1");
            
            // Isi ulang pilihan menu kasir agar menampilkan info stok terupdate
            dropdown.innerHTML = '<option value="0" selected disabled>Menu</option>';
            dataBarangGudang.forEach(barang => {
                const opsi = document.createElement('option');
                opsi.value = barang.name; // Menggunakan nama sesuai HTML-mu
                opsi.textContent = `${barang.name} (Stok: ${barang.quantity})`;
                dropdown.appendChild(opsi);
            });
        })
        .catch(err => console.error("Gagal memuat menu:", err));
});

// FUNGSI UTAMA UNTUK MELAKUKAN ORDER (POTONG STOK)
function Order() {
    let name = document.getElementById("nama-pemesan").value.trim();
    let pesanan = document.getElementById("pilihan1").value;
    let jumlah_pesanan = parseInt(document.getElementById("jumlah").value);
    
    // 1. Validasi Input Awal
    if (name === "" || pesanan === "0" || !pesanan || isNaN(jumlah_pesanan) || jumlah_pesanan <= 0) {
        alert("Please fill in your name and select a valid coffee order.");
        return; // Hentikan fungsi di sini jika tidak valid!
    }
    
    // 2. Cari data barang di database berdasarkan teks menu yang dipilih user
    const barangDitemukan = dataBarangGudang.find(b => b.name === pesanan);
    if (!barangDitemukan) {
        alert("Menu not found in database.");
        return;
    }

    // 3. Validasi kecukupan stok di browser sebelum dikirim ke server
    if (barangDitemukan.quantity < jumlah_pesanan) {
        alert(`Sorry, insufficient stock! Remaining ${pesanan}: ${barangDitemukan.quantity}`);
        return;
    }
    
    // 4. Kirim data ke backend Python (Gunakan rute /kurangi yang ada di Python kamu!)
    fetch(`${API_URL}/kurangi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: barangDitemukan.id,      // Mengirim ID (Integer asli dari DB)
            quantity: jumlah_pesanan    // Mengirim Jumlah Kurang
        })
    })
    .then(res => res.json())
    .then(hasil => {
        if (hasil.error) {
            alert("Order failed: " + hasil.error);
        } else {
            alert(`Thank you for your order, ${name}!\n\nYou have ordered ${jumlah_pesanan} ${pesanan}.\nSisa Stok: ${hasil.stok_baru}`);
            
            // Bersihkan form pemesanan setelah sukses belanja
            document.getElementById("nama-pemesan").value = "";
            document.getElementById("jumlah").value = "1";
            document.getElementById("pilihan1").value = "0";
            
            // Segarkan ulang isi dropdown menu agar angka stok berubah seketika
            window.location.reload(); 
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An error occurred while submitting the order.");
    });
}

// FUNGSI LOGIN ADMIN DENGAN PROMPT
function masukAdmin() {
    const passwordInput = prompt("Enter admin password:");
    const correctPassword = "CYN123"; 
    
    if (passwordInput === correctPassword) {
        alert("Login Successful!");
        window.location.href = "admin_page/admin_page.html";
    } else if (passwordInput !== null) {
        alert("Incorrect password. Please try again.");
    }
}