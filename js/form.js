/**
 * js/form.js
 * Validasi form & generator caption promosi UMKM dengan gaya editorial mewah.
 * Praktikum 6 PAW - Muhamad Irfan Al Arib (20240140171)
 */

const form = document.getElementById('captionForm');
const inputNama = document.getElementById('namaProduk');
const inputKeunggulan = document.getElementById('keunggulan');
const outputBox = document.getElementById('outputCaption');

const errorNama = document.getElementById('errorNama');
const errorKeunggulan = document.getElementById('errorKeunggulan');

// Elemen Tambahan
const counterNama = document.getElementById('counterNama');
const counterKeunggulan = document.getElementById('counterKeunggulan');
const btnCopyCaption = document.getElementById('btnCopyCaption');
const copyBtnText = document.getElementById('copyBtnText');
const emptyCaptionPlaceholder = document.getElementById('emptyCaptionPlaceholder');
const mockupCaption = document.getElementById('mockupCaption');
const mockupBrand = document.getElementById('mockupBrand');
const btnResetForm = document.getElementById('btnResetForm');
const toneCards = document.querySelectorAll('.tone-card');
const quickTags = document.querySelectorAll('.quick-tag');

let selectedTone = 'luxury';

// ==========================================================================
// 1. CEK PARAMETER URL (Sinkronisasi dari Katalog Produk)
// ==========================================================================
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const namaParam = urlParams.get('nama');
    const keunggulanParam = urlParams.get('keunggulan');

    if (namaParam) {
        inputNama.value = decodeURIComponent(namaParam);
        updateCounters();
    }
    if (keunggulanParam) {
        inputKeunggulan.value = decodeURIComponent(keunggulanParam);
        updateCounters();
    }

    if (namaParam || keunggulanParam) {
        showToast('Data produk berhasil diimpor dari katalog', 'fa-check');
    }
});

// ==========================================================================
// 2. COUNTERS & VALIDASI INPUT
// ==========================================================================
function updateCounters() {
    const lenNama = inputNama.value.trim().length;
    const lenKeunggulan = inputKeunggulan.value.trim().length;

    if (counterNama) {
        counterNama.textContent = `${lenNama} / 3 Karakter min`;
        if (lenNama >= 3) {
            counterNama.classList.add('valid');
            inputNama.classList.remove('is-invalid');
            errorNama.textContent = '';
        } else {
            counterNama.classList.remove('valid');
        }
    }

    if (counterKeunggulan) {
        counterKeunggulan.textContent = `${lenKeunggulan} / 10 Karakter min`;
        if (lenKeunggulan >= 10) {
            counterKeunggulan.classList.add('valid');
            inputKeunggulan.classList.remove('is-invalid');
            errorKeunggulan.textContent = '';
        } else {
            counterKeunggulan.classList.remove('valid');
        }
    }

    if (mockupBrand) {
        mockupBrand.textContent = inputNama.value.trim() ? inputNama.value.trim() : 'Atelier Studio';
    }
}

if (inputNama) inputNama.addEventListener('input', updateCounters);
if (inputKeunggulan) inputKeunggulan.addEventListener('input', updateCounters);

// Quick Sample Click
quickTags.forEach(tag => {
    tag.addEventListener('click', () => {
        inputNama.value = tag.getAttribute('data-nama') || '';
        inputKeunggulan.value = tag.getAttribute('data-keunggulan') || '';
        updateCounters();
        showToast('Contoh produk diterapkan', 'fa-check');
    });
});

// Tone Cards Selection
toneCards.forEach(card => {
    card.addEventListener('click', () => {
        toneCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        selectedTone = card.getAttribute('data-tone') || 'luxury';
    });
});

// Reset Form
if (btnResetForm) {
    btnResetForm.addEventListener('click', () => {
        form.reset();
        errorNama.textContent = '';
        errorKeunggulan.textContent = '';
        inputNama.classList.remove('is-invalid');
        inputKeunggulan.classList.remove('is-invalid');
        outputBox.classList.add('hidden');
        if (btnCopyCaption) btnCopyCaption.classList.add('hidden');
        if (emptyCaptionPlaceholder) emptyCaptionPlaceholder.classList.remove('hidden');
        if (mockupCaption) mockupCaption.textContent = 'Pratinjau tampilan caption promosi produk Anda akan tampil di sini setelah di-generate...';
        updateCounters();
        showToast('Formulir direset', 'fa-rotate-left');
    });
}

// ==========================================================================
// 3. GENERATOR CAPTION EDITORIAL ELEGAN
// ==========================================================================
function generateCaptionByTone(nama, keunggulan, tone) {
    const cleanHashtags = `\n\n#${nama.replace(/[^a-zA-Z0-9]/g, '')} #CuratedCollection #ProdukLokal #AtelierUMKM #KualitasPilihan`;

    switch (tone) {
        case 'luxury':
            return `Eksklusivitas dalam setiap detail.\n\nHadirkan sentuhan elegan bersama "${nama}". Diciptakan khusus bagi Anda yang mengapresiasi kualitas otentik dan kesempurnaan produk.\n\nKeunggulan Utama:\n✦ ${keunggulan}\n\nTersedia dalam edisi terbatas. Temukan koleksi selengkapnya melalui tautan di profil.${cleanHashtags}`;

        case 'story':
            return `Setiap produk menyimpan kisahnya tersendiri.\n\n"${nama}" lahir dari dedikasi untuk menghadirkan sesuatu yang bermakna bagi keseharian Anda. Produk ini ${keunggulan}.\n\nRasakan perbedaannya hari ini dan mari menjadi bagian dari perjalanan kami.${cleanHashtags}`;

        case 'promo':
            return `Penawaran Eksklusif Minggu Ini.\n\nKabar baik untuk Anda pecinta produk berkualitas! Dapatkan "${nama}" dengan penawaran spesial untuk periode terbatas.\n\nAlasan memilih produk ini:\n• ${keunggulan}\n\nPesan sekarang sebelum ketersediaan habis melalui tautan resmi kami.${cleanHashtags}`;

        case 'casual':
        default:
            return `Halo Sobat! Sudah cobain ${nama} belum?\n\nProduk ini spesial banget karena ${keunggulan}.\n\nYuk pesan sekarang juga sebelum kehabisan! Langsung hubungi kami ya.${cleanHashtags}`;
    }
}

// ==========================================================================
// 4. SUBMIT FORM & VALIDASI
// ==========================================================================
if (form) {
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        errorNama.textContent = '';
        errorKeunggulan.textContent = '';
        inputNama.classList.remove('is-invalid');
        inputKeunggulan.classList.remove('is-invalid');
        outputBox.classList.add('hidden');
        if (btnCopyCaption) btnCopyCaption.classList.add('hidden');

        let isValid = true;

        // Validasi Nama Produk (Minimal 3 Karakter)
        if (inputNama.value.trim().length < 3) {
            errorNama.textContent = 'Nama produk harus diisi minimal 3 karakter.';
            inputNama.classList.add('is-invalid');
            isValid = false;
        }

        // Validasi Keunggulan Produk (Minimal 10 Karakter)
        if (inputKeunggulan.value.trim().length < 10) {
            errorKeunggulan.textContent = 'Keunggulan produk harus diisi minimal 10 karakter.';
            inputKeunggulan.classList.add('is-invalid');
            isValid = false;
        }

        // Jika lolos validasi, tampilkan hasilnya
        if (isValid) {
            const namaClean = inputNama.value.trim();
            const keunggulanClean = inputKeunggulan.value.trim();

            const captionResult = generateCaptionByTone(namaClean, keunggulanClean, selectedTone);

            if (emptyCaptionPlaceholder) emptyCaptionPlaceholder.classList.add('hidden');
            outputBox.textContent = captionResult;
            outputBox.classList.remove('hidden');
            if (btnCopyCaption) btnCopyCaption.classList.remove('hidden');

            if (mockupCaption) {
                mockupCaption.textContent = captionResult;
            }

            showToast('Caption berhasil dibuat', 'fa-check');
        } else {
            showToast('Lengkapi formulir dengan benar', 'fa-triangle-exclamation');
        }
    });
}

// ==========================================================================
// 5. COPY TO CLIPBOARD
// ==========================================================================
if (btnCopyCaption) {
    btnCopyCaption.addEventListener('click', async () => {
        const textToCopy = outputBox.textContent || '';
        if (!textToCopy) return;

        try {
            await navigator.clipboard.writeText(textToCopy);
            copyBtnText.textContent = 'Tersalin';
            btnCopyCaption.style.background = '#111111';
            btnCopyCaption.style.color = '#ffffff';

            showToast('Teks berhasil disalin ke clipboard', 'fa-clipboard-check');

            setTimeout(() => {
                copyBtnText.textContent = 'Salin Teks';
                btnCopyCaption.style.background = '';
                btnCopyCaption.style.color = '';
            }, 2200);
        } catch (err) {
            console.error('Copy error:', err);
            showToast('Gagal menyalin teks', 'fa-xmark');
        }
    });
}

// ==========================================================================
// 6. TOAST NOTIFICATION MINIMAL
// ==========================================================================
function showToast(message, icon = 'fa-check') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.transition = 'all 0.25s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 250);
    }, 2800);
}
