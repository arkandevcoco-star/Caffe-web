// 1. OTOMATIS RUNNING: Ambil data gudang saat halaman admin pertama kali dibuka
document.addEventListener("DOMContentLoaded", () => {
    muatDataGudang();
});

// 2. FUNGSI TAMPILKAN DATA: Mengambil data dari Flask dan menggambar Tabel Bootstrap
function muatDataGudang() {
    fetch('http://127.0.0.1:5000/api/stock')
        .then(response => response.json())
        .then(data => {
            const tabelBody = document.getElementById('tabel-stok'); // Sesuai id HTML baru
            tabelBody.innerHTML = ''; 
            
            data.stock.forEach(barang => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="fw-bold">${barang.name}</td>
                    <td>
                        <button class="btn btn-sm btn-secondary me-2 fw-bold" onclick="ubahStok(${barang.id}, 'kurang')">-</button>
                        <span class="badge bg-primary fs-6">${barang.quantity}</span>
                        <button class="btn btn-sm btn-secondary ms-2 fw-bold" onclick="ubahStok(${barang.id}, 'tambah')">+</button>
                    </td>
                    <td>Rp ${barang.price.toLocaleString('id-ID')}</td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-danger fw-bold" onclick="hapusMenu(${barang.id})">Hapus Menu</button>
                    </td>
                `;
                tabelBody.appendChild(row);
            });
        })
        .catch(err => console.error("Gagal memuat data gudang:", err));
}

// 3. FUNGSI RUBAH ANGKA STOK: Dipanggil saat tombol (+) atau (-) di dalam tabel diklik
function ubahStok(idBarang, aksiTombol) {
    const dataKirim = {
        id: idBarang,
        aksi: aksiTombol // isinya string 'tambah' atau 'kurang'
    };

    // Tembak ke rute update-stok yang sudah diperkecil di Python tadi
    fetch('http://127.0.0.1:5000/api/stock/update-stok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataKirim)
    })
    .then(res => res.json())
    .then(hasil => {
        if (hasil.stok_baru !== undefined) {
            // Langsung segarkan tabel agar angka berubah secara real-time di layar browser
            muatDataGudang(); 
        } else {
            alert("Gagal memperbarui stok: " + (hasil.error || "Terjadi kesalahan"));
        }
    })
    .catch(err => alert("Server backend mati!"));
}

// 4. FUNGSI TAMBAH MENU BARU: (Modifikasi fungsi bawaanmu agar terhubung ke database)
function TambahBarang() {
    const namaProduk = document.getElementById("input-nama").value;
    const jumlahStok = parseInt(document.getElementById("input-stok").value);
    const hargaProduk = parseInt(document.getElementById("input-harga").value); // Pastikan ada id="input-harga" di HTML

    // Validasi input
    if (!namaProduk || isNaN(jumlahStok) || jumlahStok <= 0 || isNaN(hargaProduk) || hargaProduk <= 0) {
        alert("Please fill in all columns with valid product data.");
        return;
    }

    const dataMenuBaru = {
        name: namaProduk,
        quantity: jumlahStok,
        price: hargaProduk
    };

    // Kirim data menu baru menggunakan POST ke server Flask
    fetch('http://127.0.0.1:5000/api/stock/tambah', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataMenuBaru)
    })
    .then(res => res.json())
    .then(hasil => {
        alert(`Product: ${namaProduk}\nStock Quantity: ${jumlahStok}\nSUCCESSFULLY ADDED TO WAREHOUSE`);
        
        muatDataGudang(); // Segarkan tabel agar menu baru langsung muncul di list
        
        // Reset/kosongkan isi form input di halaman web
        document.getElementById("input-nama").value = "";
        document.getElementById("input-stok").value = "";
        document.getElementById("input-harga").value = "";
    })
    .catch(err => alert("Gagal terhubung ke server!"));
}

// 5. FUNGSI HAPUS TOTAL MENU (Opsional tapi berguna)
function hapusMenu(idBarang) {
    if (confirm("Apakah kamu yakin ingin menghapus menu ini secara permanen dari gudang?")) {
        fetch(`http://127.0.0.1:5000/api/stock/hapus/${idBarang}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(() => muatDataGudang());
    }
}