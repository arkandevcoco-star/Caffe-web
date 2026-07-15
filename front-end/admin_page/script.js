const API_URL = 'http://127.0.0.1:5000/api/stock';

// 1. OTOMATIS RUNNING SAAT HALAMAN DIBUKA
document.addEventListener("DOMContentLoaded", muatDataGudangDanDropdown);

// 2. FUNGSI TAMPILKAN TABEL & ISI DROPDOWN SECARA OTOMATIS
function muatDataGudangDanDropdown() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            // A. Kosongkan & Gambar Ulang Tabel Kanan
            const tabelBody = document.getElementById('tabel-stok');
            tabelBody.innerHTML = ''; 
            
            // B. Kosongkan & Isi Ulang Dropdown Kiri
            const dropdownNama = document.getElementById('input-nama');
            dropdownNama.innerHTML = '<option value="">-- Select Product --</option>';

            data.stock.forEach(barang => {
                // Gambar baris tabel
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="fw-bold">${barang.name}</td>
                    <td><span class="badge bg-primary fs-6">${barang.quantity}</span></td>
                    <td>Rp ${barang.price.toLocaleString('id-ID')}</td>
                `;
                tabelBody.appendChild(row);

                // Masukkan opsi menu ke dropdown (Value menyimpan ID uniknya)
                const opsi = document.createElement('option');
                opsi.value = barang.id; 
                opsi.textContent = barang.name;
                dropdownNama.appendChild(opsi);
            });
        })
        .catch(err => console.error("Gagal memuat data:", err));
}

// 3. FUNGSI TOMBOL "ADD STOCK" (PROSES RESTOCK)
function TambahBarang() {
    const idBarang = document.getElementById("input-nama").value; 
    const jumlahPasok = parseInt(document.getElementById("input-stok").value);

    if (!idBarang || isNaN(jumlahPasok) || jumlahPasok <= 0) {
        alert("Please select a product and enter a valid stock quantity.");
        return;
    }

    fetch(`${API_URL}/tambah`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: parseInt(idBarang), quantity: jumlahPasok })
    })
    .then(res => res.json()) // Langsung ubah ke JSON tanpa banyak tanya
    .then(hasil => {
        // Jika backend mengirimkan sinyal eror dari database
        if (hasil.error) {
            alert("Gagal: " + hasil.error);
            return;
        }
        
        // JIKA SUKSES:
        alert("STOCK SUCCESSFULLY ADDED TO WAREHOUSE");
        
        // Reset form angka saja, biarkan dropdown tetap di menu yang sama
        document.getElementById("input-stok").value = ""; 
        
        // Segarkan data tabel di kanan
        muatDataGudangDanDropdown(); 
    })
    .catch(err => {
        console.error("Detail log:", err);
        // Jika data di tabel kanan sudah berubah, abaikan saja alert ini!
        muatDataGudangDanDropdown();
    });
}