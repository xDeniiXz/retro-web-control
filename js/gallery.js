// Gallery JavaScript for Birthday Gift Website
// Printing effect: photos reveal from top to bottom, one by one

document.addEventListener('DOMContentLoaded', function () {
    // Photo configuration
    const photos = [
        { src: 'assets/photos/photo1.jpg', caption: 'Senyuman Manis', position: 'center top' },
        { src: 'assets/photos/photo2.jpg', caption: 'Cantik', position: 'center 30%' },
        { src: 'assets/photos/photo3.jpg', caption: 'comell', position: 'center 20%' },
        { src: 'assets/photos/photo4.jpg', caption: 'Gaya Keren', position: 'center 25%' },
        { src: 'assets/photos/photo5.jpg', caption: 'Cisss', position: 'center 25%' },
        { src: 'assets/photos/photo6.jpg', caption: 'Keren', position: 'center 20%' },
        { src: 'assets/photos/photo7.jpg', caption: 'Gemesin', position: 'center 15%' },
        { src: 'assets/photos/photo8.jpg', caption: 'Ganteng', position: 'center 20%' },
        { src: 'assets/photos/photo9.jpg', caption: 'Hehe😅', position: 'center 20%' },
    ];

    const photoStrip = document.getElementById('photo-strip');

    // Date stamp
    function getDateStamp() {
        const d = new Date();
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yy = String(d.getFullYear()).slice(-2);
        return `${dd}/${mm}/${yy}`;
    }

    // Create a single polaroid card element (hidden initially)
    function createCard(photo, index, dateStamp) {
        const card = document.createElement('div');
        card.className = 'polaroid-card printing';
        card.innerHTML = `
            <button class="delete-photo-btn" title="Hapus foto ini">✕</button>
            <div class="polaroid-frame">
                <div class="polaroid-image-wrap">
                    <img src="${photo.src}" 
                         alt="${photo.caption}" 
                         style="object-position: ${photo.position || 'center center'}"
                         loading="lazy">
                    <span class="polaroid-number">#${index + 1}</span>
                </div>
                <div class="polaroid-caption">${photo.caption}</div>
            </div>
            <div class="polaroid-footer">
                <div class="polaroid-date">
                    <span class="date-dot">●</span>
                    <span>${dateStamp}</span>
                    <span class="date-dot">●</span>
                </div>
                <button class="change-photo-btn" title="Ganti foto ini">
                    <span class="change-photo-icon">🔄</span>
                    <span class="change-photo-text">Ganti Foto</span>
                </button>
                <input type="file" class="change-photo-input" accept="image/*" style="display:none">
            </div>
        `;

        // Wire up the delete button
        const deleteBtn = card.querySelector('.delete-photo-btn');
        deleteBtn.addEventListener('click', () => {
            // Revoke blob URL if any
            const img = card.querySelector('.polaroid-image-wrap img');
            if (img._blobUrl) URL.revokeObjectURL(img._blobUrl);

            // Collapse animation then remove
            card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.transform = 'scale(0.8)';
            card.style.opacity = '0';
            card.style.maxHeight = card.offsetHeight + 'px';
            card.offsetHeight; // force reflow
            card.style.maxHeight = '0';
            card.style.marginTop = '0';
            card.style.marginBottom = '0';
            card.style.padding = '0';
            card.style.overflow = 'hidden';

            setTimeout(() => card.remove(), 450);
        });

        // Wire up the change photo button
        const btn = card.querySelector('.change-photo-btn');
        const fileInput = card.querySelector('.change-photo-input');
        const imgEl = card.querySelector('.polaroid-image-wrap img');

        btn.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Revoke previous blob URL if any
            if (imgEl._blobUrl) URL.revokeObjectURL(imgEl._blobUrl);

            const url = URL.createObjectURL(file);
            imgEl._blobUrl = url;
            imgEl.src = url;
            imgEl.style.objectPosition = 'center center';
            imgEl.alt = file.name;

            // Brief flash animation on the card
            card.classList.add('photo-swapped');
            setTimeout(() => card.classList.remove('photo-swapped'), 600);
        });

        return card;
    }

    // Progress indicator element
    function createProgressEl() {
        const el = document.createElement('div');
        el.className = 'print-progress';
        el.id = 'print-progress';
        return el;
    }

    // Animate one card: reveal from top using clip-path
    function animateCard(card, duration) {
        return new Promise(resolve => {
            card.classList.add('printing');
            // Force layout
            card.offsetHeight;

            let start = null;
            function step(timestamp) {
                if (!start) start = timestamp;
                const elapsed = timestamp - start;
                const progress = Math.min(elapsed / duration, 1);

                // Reveal from top to bottom
                card.style.clipPath = `inset(0 0 ${(1 - progress) * 100}% 0)`;

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    card.style.clipPath = 'none';
                    card.classList.remove('printing');
                    card.classList.add('printed');
                    // Show the change-photo & delete buttons with animation
                    const changeBtn = card.querySelector('.change-photo-btn');
                    if (changeBtn) changeBtn.classList.add('visible');
                    const delBtn = card.querySelector('.delete-photo-btn');
                    if (delBtn) delBtn.classList.add('visible');
                    resolve();
                }
            }
            requestAnimationFrame(step);
        });
    }

    // Main: print photos one by one
    async function startPrinting() {
        if (photos.length === 0) {
            photoStrip.innerHTML = `
                <div class="no-photo-message">
                    <span class="camera-icon">📷</span>
                    <p>Tambahkan foto ke folder:</p>
                    <code>assets/photos/</code>
                </div>`;
            return;
        }

        const dateStamp = getDateStamp();
        const progressEl = createProgressEl();
        photoStrip.appendChild(progressEl);

        const PRINT_DURATION = 1800; // ms per photo reveal
        const PAUSE_BETWEEN = 400;  // ms pause between photos

        for (let i = 0; i < photos.length; i++) {
            // Update progress text
            progressEl.textContent = `Mencetak foto ${i + 1} dari ${photos.length}...`;

            // Create card and add to strip
            const card = createCard(photos[i], i, dateStamp);
            photoStrip.insertBefore(card, progressEl);

            // Scroll to keep the new card visible
            card.scrollIntoView({ behavior: 'smooth', block: 'end' });

            // Animate the reveal
            await animateCard(card, PRINT_DURATION);

            // Small pause before next
            if (i < photos.length - 1) {
                await new Promise(r => setTimeout(r, PAUSE_BETWEEN));
            }
        }

        // Done printing
        progressEl.textContent = `✅ ${photos.length} foto berhasil dicetak!`;
        progressEl.classList.add('done');

        // Fade out progress after a moment
        setTimeout(() => {
            progressEl.style.opacity = '0';
            setTimeout(() => {
                progressEl.remove();
                // Show the photobox strip button after progress fades
                showPhotoStripButton();
            }, 500);
        }, 2000);
    }

    // ============================================================
    // PHOTOBOX STRIP FEATURE
    // ============================================================

    function showPhotoStripButton() {
        const btn = document.createElement('button');
        btn.id = 'photobox-strip-btn';
        btn.className = 'photobox-strip-btn';
        btn.innerHTML = `
            <span class="strip-btn-icon">🖨️</span>
            <span class="strip-btn-text">Cetak Foto Strip</span>
        `;
        photoStrip.appendChild(btn);

        // Animate in
        requestAnimationFrame(() => {
            btn.classList.add('visible');
            btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });

        btn.addEventListener('click', () => generatePhotoStrip());
    }


    function generatePhotoStrip() {
        // Collect images currently in the strip (respect deletions & changes)
        const cards = photoStrip.querySelectorAll('.polaroid-card');
        if (cards.length === 0) return;

        // Show loading modal
        showStripModal(null, true);

        // Collect photo data from the DOM
        const photoData = [];
        cards.forEach((card, i) => {
            const imgEl = card.querySelector('.polaroid-image-wrap img');
            const captionEl = card.querySelector('.polaroid-caption');
            const caption = captionEl ? captionEl.textContent : '';
            const position = imgEl.style.objectPosition || 'center center';
            photoData.push({ src: imgEl.src, caption, position, index: i + 1 });
        });

        const dateStamp = getDateStamp();

        // Build the strip as HTML
        const stripHTML = buildStripHTML(photoData, dateStamp);

        // Short delay to let loading modal show
        setTimeout(() => {
            showStripModal(stripHTML, false, photoData, dateStamp);
        }, 300);
    }

    // Build the photobox strip as a complete HTML document
    function buildStripHTML(photoData, dateStamp) {
        const sprockets = Array.from({ length: Math.max(20, photoData.length * 15) }, (_, i) =>
            `<div class="sprocket" style="top:${30 + i * 50}px;left:16px"></div>
             <div class="sprocket" style="top:${30 + i * 50}px;right:16px"></div>`
        ).join('');

        const photosHTML = photoData.map(p => `
            <div class="strip-photo-card">
                <div class="strip-photo-frame">
                    <div class="strip-photo-wrap">
                        <img src="${p.src}" style="object-position: ${p.position}" alt="Photo ${p.index}">
                        <span class="strip-photo-number">#${p.index}</span>
                    </div>
                    <div class="strip-photo-caption">${p.caption}</div>
                </div>
            </div>
        `).join('');

        return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>HEYTML PhotoBox Strip</title>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
    background: #111;
    display: flex;
    justify-content: center;
    padding: 20px;
    font-family: 'Segoe UI', 'Arial', sans-serif;
}
.strip-container {
    width: 400px;
    background: linear-gradient(180deg, #1a1a2e, #16213e, #0f3460, #16213e, #1a1a2e);
    position: relative;
    padding: 20px 40px;
    border-radius: 8px;
    overflow: hidden;
}
/* Film borders */
.strip-border-left, .strip-border-right {
    position: absolute;
    top: 0; bottom: 0;
    width: 8px;
    background: linear-gradient(180deg, #e91e63, #9c27b0, #e91e63, #9c27b0, #e91e63);
}
.strip-border-left { left: 0; }
.strip-border-right { right: 0; }
/* Sprocket holes */
.sprocket {
    position: absolute;
    width: 18px;
    height: 18px;
    background: #0a0a1a;
    border-radius: 4px;
}
/* Header */
.strip-header {
    text-align: center;
    padding: 30px 0 20px;
}
.strip-header h1 {
    color: #fff;
    font-size: 22px;
    margin-bottom: 8px;
}
.strip-header .subtitle {
    color: #e91e63;
    font-size: 14px;
    margin-bottom: 6px;
}
.strip-header .date {
    color: rgba(255,255,255,0.4);
    font-size: 11px;
}
.strip-divider {
    height: 2px;
    background: linear-gradient(90deg, transparent, #e91e63, transparent);
    margin: 15px 0;
}
/* Photo cards */
.strip-photo-card {
    margin: 20px 0;
}
.strip-photo-frame {
    background: #ffffff;
    border-radius: 6px;
    padding: 10px 10px 6px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.4);
}
.strip-photo-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 3 / 4;
    overflow: hidden;
    border-radius: 3px;
    background: #222;
}
.strip-photo-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}
.strip-photo-number {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background: rgba(0,0,0,0.6);
    color: #ffd700;
    font-weight: bold;
    font-size: 14px;
    padding: 4px 10px;
    border-radius: 4px;
}
.strip-photo-caption {
    text-align: center;
    font-family: 'Press Start 2P', cursive;
    font-size: 9px;
    color: #555;
    padding: 8px 4px 4px;
}
/* Footer */
.strip-footer {
    text-align: center;
    padding: 20px 0 30px;
}
.strip-footer .made-by {
    color: rgba(255,255,255,0.3);
    font-size: 11px;
    margin-bottom: 6px;
}
.strip-footer .info {
    color: rgba(255,255,255,0.2);
    font-size: 10px;
}
@media print {
    body { background: #fff; padding: 0; }
    .strip-container { width: 80mm; }
}
</style>
</head>
<body>
<div class="strip-container">
    <div class="strip-border-left"></div>
    <div class="strip-border-right"></div>
    ${sprockets}
    <div class="strip-header">
        <h1>📸 HEYTML PhotoBox</h1>
        <div class="subtitle">Happy Birthday, Afri Finda Viana!</div>
        <div class="date">${dateStamp}</div>
    </div>
    <div class="strip-divider"></div>
    ${photosHTML}
    <div class="strip-divider"></div>
    <div class="strip-footer">
        <div class="made-by">Made with ❤️ by Neurrochmat</div>
        <div class="info">${photoData.length} foto • ${dateStamp}</div>
    </div>
</div>
</body>
</html>`;
    }

    // ============================================================
    // STRIP PREVIEW MODAL
    // ============================================================

    function showStripModal(stripHTML, isLoading) {
        // Remove existing modal if any
        let modal = document.getElementById('strip-modal-overlay');
        if (modal) modal.remove();

        modal = document.createElement('div');
        modal.id = 'strip-modal-overlay';
        modal.className = 'strip-modal-overlay';

        if (isLoading) {
            modal.innerHTML = `
                <div class="strip-modal-content">
                    <div class="strip-loading">
                        <div class="strip-loading-spinner"></div>
                        <p>Membuat foto strip...</p>
                    </div>
                </div>
            `;
        } else {
            modal.innerHTML = `
                <div class="strip-modal-content">
                    <div class="strip-modal-header">
                        <h3>📸 Foto Strip Siap!</h3>
                        <button class="strip-modal-close" id="strip-modal-close">✕</button>
                    </div>
                    <div class="strip-preview-wrap">
                        <iframe id="strip-preview-frame" class="strip-preview-frame" sandbox="allow-same-origin"></iframe>
                    </div>
                    <div class="strip-modal-actions">
                        <button class="strip-action-btn print" id="strip-print-btn">
                            <span>🖨️</span> Print
                        </button>
                        <button class="strip-action-btn download" id="strip-open-btn">
                            <span>🔗</span> Buka
                        </button>
                    </div>
                </div>
            `;
        }

        document.body.appendChild(modal);

        // Activate with animation
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });

        if (!isLoading && stripHTML) {
            // Set iframe content
            const iframe = document.getElementById('strip-preview-frame');
            iframe.srcdoc = stripHTML;

            // Store the HTML for print/open actions
            modal._stripHTML = stripHTML;

            // Close button
            document.getElementById('strip-modal-close').addEventListener('click', () => {
                modal.classList.remove('active');
                setTimeout(() => modal.remove(), 300);
            });

            // Click outside to close
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    setTimeout(() => modal.remove(), 300);
                }
            });

            // Print - open in new window and trigger print
            document.getElementById('strip-print-btn').addEventListener('click', () => {
                const printWindow = window.open('', '_blank');
                printWindow.document.write(stripHTML);
                printWindow.document.close();
                printWindow.onload = () => {
                    setTimeout(() => printWindow.print(), 500);
                };
            });

            // Open in new tab (for saving)
            document.getElementById('strip-open-btn').addEventListener('click', () => {
                const newTab = window.open('', '_blank');
                newTab.document.write(stripHTML);
                newTab.document.close();
            });
        }
    }

    startPrinting();
    console.log('📸 Gallery printing', photos.length, 'photos');
});
