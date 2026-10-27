
document.addEventListener("DOMContentLoaded", function () {
  // HARGA PRODUK
  const hargaProduk = {
    "Hijab Segi Empat": 35000,
    "Hijab Pashmina": 45000,
    "Hijab Inner": 25000,
    "Hijab Instan": 40000
  };

  // ELEMEN FORM
  const orderForm = document.getElementById("orderForm");
  const namaInput = document.getElementById("nama");
  const teleponInput = document.getElementById("telepon");
  const produkSelect = document.getElementById("produkSelect");
  const jumlahInput = document.getElementById("jumlah");
  const alamatInput = document.getElementById("alamat");
  const alamatGroup = document.getElementById("alamatGroup");
  const catatanInput = document.getElementById("catatan");

  // ELEMEN RINGKASAN
  const summaryProduct = document.getElementById("summaryProduct");
  const summaryPrice = document.getElementById("summaryPrice");
  const summaryQty = document.getElementById("summaryQty");
  const summaryShipping = document.getElementById("summaryShipping");
  const summaryTotal = document.getElementById("summaryTotal");
  const summaryAddress = document.getElementById("summaryAddress");
  const summaryAddressLine = document.getElementById("summaryAddressLine");

  // ELEMEN KONFIRMASI
  const confirmation = document.getElementById("confirmation");
  const confirmationText = document.getElementById("confirmationText");

  // RADIO BUTTON PENGIRIMAN
  const pilihanPengiriman = document.querySelectorAll(
    'input[name="pengiriman"]'
  );

  // FORMAT RUPIAH
  function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(angka);
  }

  // AMBIL PILIHAN PENGIRIMAN
  function getPengirimanTerpilih() {
    return document.querySelector(
      'input[name="pengiriman"]:checked'
    );
  }

  // MENGATUR ALAMAT SESUAI METODE PENGIRIMAN
  function perbaruiPengiriman() {
    const pilihan = getPengirimanTerpilih();
    const metode = pilihan ? pilihan.value : "";
    const perluAlamat = metode === "Dikirim";

    alamatGroup.hidden = !perluAlamat;
    alamatInput.required = perluAlamat;

    if (!perluAlamat) {
      alamatInput.value = "";
    }

    perbaruiRingkasan();
  }

  // MEMPERBARUI RINGKASAN PESANAN
  function perbaruiRingkasan() {
    const produk = produkSelect.value;
    const pilihan = getPengirimanTerpilih();
    const metode = pilihan ? pilihan.value : "";

    let jumlah = Number.parseInt(jumlahInput.value, 10);

    if (!Number.isFinite(jumlah) || jumlah < 1) {
      jumlah = 1;
    }

    if (jumlah > 99) {
      jumlah = 99;
    }

    jumlahInput.value = jumlah;

    const harga = hargaProduk[produk] || 0;
    const total = harga * jumlah;

    summaryProduct.textContent = produk || "Belum dipilih";
    summaryPrice.textContent = formatRupiah(harga);
    summaryQty.textContent = String(jumlah);
    summaryShipping.textContent = metode || "Belum dipilih";
    summaryTotal.textContent = formatRupiah(total);

    // ALAMAT PADA RINGKASAN
    if (metode === "Dikirim") {
      summaryAddressLine.hidden = false;
      summaryAddress.textContent =
        alamatInput.value.trim() || "Belum diisi";
    } else {
      summaryAddressLine.hidden = true;
      summaryAddress.textContent = "-";
    }
  }

  // MEMILIH PRODUK DARI KARTU PRODUK
  function pilihProduk(namaProduk) {
    if (!Object.prototype.hasOwnProperty.call(hargaProduk, namaProduk)) {
      return;
    }

    produkSelect.value = namaProduk;

    perbaruiRingkasan();
    confirmation.hidden = true;

    document.getElementById("pesan").scrollIntoView({
      behavior: "smooth"
    });
  }

  // TOMBOL PILIH PRODUK
  document.querySelectorAll(".pilih-produk").forEach(function (tombol) {
    tombol.addEventListener("click", function () {
      pilihProduk(tombol.dataset.product);
    });
  });

  // PERUBAHAN DROPDOWN PRODUK
  produkSelect.addEventListener("change", function () {
    perbaruiRingkasan();
    confirmation.hidden = true;
  });

  // RADIO BUTTON PENGIRIMAN
  pilihanPengiriman.forEach(function (radio) {
    radio.addEventListener("change", function () {
      perbaruiPengiriman();
      confirmation.hidden = true;
    });
  });

  // PERUBAHAN JUMLAH PRODUK
  jumlahInput.addEventListener("input", function () {
    perbaruiRingkasan();
    confirmation.hidden = true;
  });

  // PERUBAHAN ALAMAT
  alamatInput.addEventListener("input", function () {
    perbaruiRingkasan();
    confirmation.hidden = true;
  });

  // SEMBUNYIKAN KONFIRMASI JIKA FORM DIUBAH
  orderForm.addEventListener("input", function () {
    confirmation.hidden = true;
  });

  orderForm.addEventListener("change", function () {
    confirmation.hidden = true;
  });

  // PROSES KONFIRMASI PESANAN
  orderForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // VALIDASI FORM
    if (!orderForm.reportValidity()) {
      return;
    }

    const nama = namaInput.value.trim();
    const telepon = teleponInput.value.trim();
    const produk = produkSelect.value;
    const jumlah = Number.parseInt(jumlahInput.value, 10);
    const alamat = alamatInput.value.trim();
    const catatan = catatanInput.value.trim();

    const pilihan = getPengirimanTerpilih();

    if (!pilihan) {
      alert("Silakan pilih metode pengiriman terlebih dahulu.");
      return;
    }

    const pengiriman = pilihan.value;
    const harga = hargaProduk[produk];

    if (!harga) {
      alert("Silakan pilih produk hijab terlebih dahulu.");
      produkSelect.focus();
      return;
    }

    if (pengiriman === "Dikirim" && !alamat) {
      alert("Silakan isi alamat pengiriman.");
      alamatInput.focus();
      return;
    }

    const total = harga * jumlah;

    // MEMBUAT PESAN KONFIRMASI
    let pesan =
      "Terima kasih, " + nama + "! " +
      "Pesanan kamu sudah tercatat dalam simulasi ini. " +
      "Produk: " + produk + ". " +
      "Harga satuan: " + formatRupiah(harga) + ". " +
      "Jumlah: " + jumlah + ". " +
      "Total produk: " + formatRupiah(total) + ". " +
      "Metode pengiriman: " + pengiriman + ". ";

    if (pengiriman === "Dikirim") {
      pesan += "Alamat pengiriman: " + alamat + ". ";
    }

    if (pengiriman === "Ambil di Toko") {
      pesan += "Silakan ambil pesanan langsung di toko. ";
    }

    pesan += "Nomor telepon: " + telepon + ".";

    if (catatan) {
      pesan += " Catatan: " + catatan + ".";
    }

    confirmationText.textContent = pesan;
    confirmation.hidden = false;

    perbaruiRingkasan();

    confirmation.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  });

  // TAHUN OTOMATIS PADA FOOTER
  document.getElementById("tahun").textContent =
    new Date().getFullYear();

  // TAMPILAN AWAL
  perbaruiPengiriman();
  perbaruiRingkasan();
});