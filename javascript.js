// Tunggu sampai semua konten HTML dimuat
document.addEventListener("DOMContentLoaded", () => {

    // === 1. SELEKSI ELEMEN ===
    // Setup
    const setupContainer = document.getElementById("setupContainer");
    const targetItemInput = document.getElementById("targetItem");
    const targetPriceInput = document.getElementById("targetPrice");
    const startButton = document.getElementById("startButton");

    // Savings
    const savingsContainer = document.getElementById("savingsContainer");
    const itemDisplay = document.getElementById("itemDisplay");
    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");
    
    // Visual
    const moneyFill = document.getElementById("moneyFill");

    // Input
    const buttonGrid = document.querySelector(".button-grid");
    const customAmountButton = document.getElementById("customAmountButton");

    // Mobile CTA
    const mobileCtaButton = document.getElementById("mobileCtaButton");

    // Modal Sukses
    const successModal = document.getElementById("successModal");
    const successItemName = document.getElementById("successItemName");
    const motivationQuote = document.getElementById("motivationQuote");
    const resetButton = document.getElementById("resetButton");

    // === 2. STATE APLIKASI ===
    let currentTarget = {
        item: "",
        price: 0
    };
    let currentSaved = 0;

    // List Kata Motivasi (sesuai permintaan)
    const motivationalQuotes = [
        "Hebat! Kamu membuktikan bahwa disiplin kecil bisa menghasilkan hal besar. Terus semangat!",
        "Langkah pertama selalu yang terberat, dan kamu berhasil melewatinya! Apa targetmu selanjutnya?",
        "Keren! Uang hasil jerih payah sendiri rasanya beda, kan? Jaga terus kebiasaan baik ini!",
        "Wow, selamat ya! Ingat perasaan bangga ini. Kamu bisa raih apa aja kalau kamu fokus.",
        "Bukan cuma barangnya yang kamu dapat, tapi juga pelajaran berharga tentang kesabaran. Kamu luar biasa!"
    ];

    // === 3. FUNGSI-FUNGSI ===

    /**
     * Memulai proses menabung
     */
    function startGame() {
        const item = targetItemInput.value;
        const price = parseInt(targetPriceInput.value);

        // Validasi
        if (item === "" || isNaN(price) || price <= 0) {
            alert("Oops! Isi nama barang dan harganya dengan benar ya.");
            return;
        }

        // Simpan state
        currentTarget.item = item;
        currentTarget.price = price;
        currentSaved = 0;

        // Update UI
        itemDisplay.textContent = item;
        updateUI();

        // Tampilkan/sembunyikan section
        setupContainer.classList.add("hidden");
        savingsContainer.classList.remove("hidden");
        mobileCtaButton.classList.remove("hidden");
    }

    /**
     * Menambah tabungan
     */
    function addSavings(amount) {
        currentSaved += amount;

        // Pastikan tidak melebihi target
        if (currentSaved > currentTarget.price) {
            currentSaved = currentTarget.price;
        }

        updateUI();

        // Cek jika sudah tercapai
        if (currentSaved >= currentTarget.price) {
            // Beri jeda sedikit agar animasi terisi penuh
            setTimeout(showSuccess, 700);
        }
    }

    /**
     * Memperbarui tampilan UI (Progress bar, text, dan visual toples)
     */
    function updateUI() {
        // Hitung persentase
        let percentage = (currentSaved / currentTarget.price) * 100;
        if (percentage > 100) percentage = 100;

        // Update Progress Bar
        progressBar.value = percentage;

        // Update Text
        progressText.innerHTML = `Terkumpul: <strong>Rp ${formatRupiah(currentSaved)}</strong> / <strong>Rp ${formatRupiah(currentTarget.price)}</strong>`;

        // Update Visual Toples Kaca
        moneyFill.style.height = `${percentage}%`;
    }

    /**
     * Menampilkan modal saat sukses
     */
    function showSuccess() {
        // Set nama barang di modal
        successItemName.textContent = currentTarget.item;

        // Ambil motivasi random
        const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
        motivationQuote.textContent = motivationalQuotes[randomIndex];

        // Tampilkan modal
        successModal.classList.remove("hidden");
    }

    /**
     * Mereset permainan
     */
    function resetGame() {
        // Sembunyikan modal
        successModal.classList.add("hidden");

        // Tampilkan setup, sembunyikan savings
        setupContainer.classList.remove("hidden");
        savingsContainer.classList.add("hidden");
        mobileCtaButton.classList.add("hidden");

        // Reset nilai input
        targetItemInput.value = "";
        targetPriceInput.value = "";

        // Reset state
        currentSaved = 0;
        currentTarget = { item: "", price: 0 };

        // Reset UI
        updateUI(); // Ini akan membuat progress bar & toples jadi 0
    }

    /**
     * Helper function untuk format mata uang Rupiah
     */
    function formatRupiah(number) {
        return new Intl.NumberFormat('id-ID').format(number);
    }

    /**
     * Fungsi untuk tombol custom
     */
    function addCustomAmount() {
        const customAmount = prompt("Mau nabung berapa? (Masukkan angka saja)");
        const amount = parseInt(customAmount);

        if (!isNaN(amount) && amount > 0) {
            addSavings(amount);
        } else if (customAmount !== null) { // Jika user tidak klik "cancel"
            alert("Masukkan jumlah yang benar ya.");
        }
    }


    // === 4. EVENT LISTENERS ===

    // Tombol "Mulai Nabung"
    startButton.addEventListener("click", startGame);

    // Tombol-tombol di grid (event delegation)
    buttonGrid.addEventListener("click", (e) => {
        // Cek apakah yang diklik adalah tombol dengan data-amount
        if (e.target.classList.contains("btn-save") && e.target.dataset.amount) {
            const amount = parseInt(e.target.dataset.amount);
            addSavings(amount);
        }
    });

    // Tombol "Lainnya"
    customAmountButton.addEventListener("click", addCustomAmount);

    // Tombol "Yuk, nabung lagi!"
    resetButton.addEventListener("click", resetGame);

});