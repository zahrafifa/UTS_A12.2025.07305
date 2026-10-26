
/* =========================
   DATA HARGA PRODUK
========================= */

const hargaProduk = {
    "Hijab Segi Empat": 35000,
    "Hijab Pashmina": 45000,
    "Hijab Inner": 25000,
    "Hijab Instan": 40000
};


/* =========================
   FORMAT RUPIAH
========================= */

function rupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(angka);
}


/* =========================
   ELEMEN FORM
========================= */

const formPesanan = document.getElementById("orderForm");
const pilihanProduk = document.getElementById("produkPilihan");
const inputJumlah = document.getElementById("jumlah");

const namaRingkasan = document.getElementById("namaRingkasan");
const hargaSatuan = document.getElementById("hargaSatuan");
const jumlahRingkasan = document.getElementById("jumlahRingkasan");
const totalHarga = document.getElementById("totalHarga");

const hasilPesanan = document.getElementById("hasilPesanan");


function perbaruiRingkasan() {
    const namaProduk = pilihanProduk.value;
    const jumlah = Math.min(
        99,
        Math.max(1, Number(inputJumlah.value) || 1)
    );

    const harga = hargaProduk[namaProduk] || 0;
    const total = harga * jumlah;

    namaRingkasan.textContent = namaProduk || "-";
    hargaSatuan.textContent = rupiah(harga);
    jumlahRingkasan.textContent = jumlah;
    totalHarga.textContent = rupiah(total);
}


/* =========================
   PILIH PRODUK DARI KARTU
========================= */

function pilihProduk(nama) {
    pilihanProduk.value = nama;
    inputJumlah.value = 1;

    perbaruiRingkasan();

    // Sembunyikan konfirmasi pesanan sebelumnya
    hasilPesanan.hidden = true;
    hasilPesanan.textContent = "";

    // Arahkan pengunjung ke formulir
    document.getElementById("pesan").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* =========================
   EVENT PERUBAHAN FORM
========================= */

pilihanProduk.addEventListener("change", function () {
    perbaruiRingkasan();

    hasilPesanan.hidden = true;
    hasilPesanan.textContent = "";
});

inputJumlah.addEventListener("input", function () {
    perbaruiRingkasan();

    hasilPesanan.hidden = true;
    hasilPesanan.textContent = "";
});

inputJumlah.addEventListener("change", function () {
    let jumlah = Number(inputJumlah.value) || 1;

    jumlah = Math.min(99, Math.max(1, jumlah));
    inputJumlah.value = jumlah;

    perbaruiRingkasan();
});


/* =========================
   SIMULASI PEMESANAN
========================= */

formPesanan.addEventListener("submit", function (event) {
    event.preventDefault();

    const nama = document.getElementById("nama").value.trim();
    const hp = document.getElementById("hp").value.trim();
    const alamat = document.getElementById("alamat").value.trim();
    const catatan = document.getElementById("catatan").value.trim();

    const produk = pilihanProduk.value;
    const jumlah = Number(inputJumlah.value);
    const harga = hargaProduk[produk] || 0;
    const total = harga * jumlah;

    // Periksa kelengkapan data
    if (
        !nama ||
        !hp ||
        !alamat ||
        !produk ||
        !harga ||
        !Number.isInteger(jumlah) ||
        jumlah < 1 ||
        jumlah > 99
    ) {
        alert("Mohon lengkapi data pemesanan dengan benar.");
        return;
    }

    // Nomor pesanan simulasi
    const nomorPesanan =
        "PH-" + Date.now().toString().slice(-8);

    // Tampilkan konfirmasi tanpa memasukkan input pengguna
    // sebagai HTML
    hasilPesanan.replaceChildren();

    const judul = document.createElement("h5");
    judul.textContent = "Pesanan Berhasil Disimulasikan";

    const keterangan = document.createElement("p");
    keterangan.textContent =
        "Nomor pesanan: " + nomorPesanan;

    const detail = document.createElement("p");
    detail.textContent =
        "Nama: " + nama +
        "\nNomor HP: " + hp +
        "\nProduk: " + produk +
        "\nJumlah: " + jumlah +
        "\nTotal harga: " + rupiah(total) +
        "\nAlamat: " + alamat;

    hasilPesanan.append(judul, keterangan, detail);

    if (catatan) {
        const catatanPesanan = document.createElement("p");
        catatanPesanan.textContent = "Catatan: " + catatan;
        hasilPesanan.appendChild(catatanPesanan);
    }

    const peringatan = document.createElement("small");
    peringatan.textContent =
        "Ini hanya konfirmasi simulasi. Pesanan belum tersimpan " +
        "ke database dan belum dikirim ke penjual.";

    hasilPesanan.appendChild(peringatan);

    hasilPesanan.hidden = false;

    // Arahkan ke bagian konfirmasi
    hasilPesanan.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
});


/* =========================
   BUTTON KEMBALI KE ATAS
========================= */

const tombolKembaliAtas =
    document.getElementById("btnKembaliAtas");

function periksaPosisiScroll() {
    if (window.scrollY > 300) {
        tombolKembaliAtas.classList.add("tampil");
    } else {
        tombolKembaliAtas.classList.remove("tampil");
    }
}

tombolKembaliAtas.addEventListener("click", function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

window.addEventListener("scroll", periksaPosisiScroll);


/* =========================
   JALANKAN SAAT HALAMAN DIBUKA
========================= */

perbaruiRingkasan();
periksaPosisiScroll();