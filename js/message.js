// Message JavaScript for Birthday Gift Website

document.addEventListener('DOMContentLoaded', function () {
    // Message content
    const messages = [
        `Happy 19th Birthday, Sayangg!\n\nDi hari spesial ini, aku mau ngungkapin betapa bersyukurnya aku bisa ketemu sama seseorang yang luar biasa kayak kamuu di dalam hidup akuu.\n\nKamu adalah alasan aku buat selalu tersenyum hihi >_< ...`,

        `Setiap kali aku bersama kamu adalah hadiah terindah yang pernah aku terimaa. Ketawa kamuu adalah suara favoritkuu, dan senyuman kamu itu adalah pemandangan terindah yang selalu pengen ku liatt.\n\nMakasii dedee suda jadi bagian hidup akuu ^_^...`,

        `Di hari ulang tahun kamuu, aku berdoa semoga semua impian kamu menjadi nyataa. Semoga kamu bahagia selaluu, sehat selaluu, dan semoga kamu bisa meraih kesuksesan yaa, aamiin.\n\nSemoga ada hal-hal yang lebih baik di umur kamu yang ke 19 tahun inii!`,

        `Terimakasii buat momen indah yang uda kita lalui bareng-barengg. Aku berharap hidup kamu selalu di iringi kebahagiaan dan hal-hal baik yaa.\n\nHappy birthday sayangg. You always prettiest and beatiful girl :3. \n\nWith heart,\nDenii`
    ];

    let currentPage = 1;
    const totalPages = messages.length;
    let isTyping = false;
    let typeTimeout = null;

    const btnNext = document.getElementById('btn-next');
    const btnNextA = document.getElementById('btn-next-a');

    // Convert text with newlines to HTML
    function textToHtml(text) {
        return text.replace(/\n/g, '<br>');
    }

    // Typing effect
    function typeMessage(elementId, text, speed = 30) {
        const element = document.getElementById(elementId);
        element.innerHTML = '';
        let i = 0;
        isTyping = true;
        updateNextButton();

        function type() {
            if (i < text.length) {
                if (text.charAt(i) === '\n') {
                    element.innerHTML += '<br>';
                } else {
                    element.innerHTML += text.charAt(i);
                }
                i++;
                typeTimeout = setTimeout(type, speed);
            } else {
                // Typing finished
                isTyping = false;
                updateNextButton();
            }
        }
        type();
    }

    // Skip typing animation — show full text immediately
    function skipTyping() {
        if (!isTyping) return;
        clearTimeout(typeTimeout);
        const element = document.getElementById(`message-${currentPage}`);
        element.innerHTML = textToHtml(messages[currentPage - 1]);
        isTyping = false;
        updateNextButton();
    }

    // Update next button text based on typing state
    function updateNextButton() {
        if (isTyping) {
            btnNext.textContent = 'SKIP >>';
        } else if (currentPage === totalPages) {
            btnNext.textContent = 'GALLERY ▶';
        } else {
            btnNext.textContent = 'SELANJUTNYA ▶';
        }
    }

    // Show page
    function showPage(pageNum) {
        document.querySelectorAll('.message-page').forEach(page => {
            page.classList.remove('active');
        });

        const targetPage = document.querySelector(`[data-page="${pageNum}"]`);
        targetPage.classList.add('active');

        typeMessage(`message-${pageNum}`, messages[pageNum - 1]);

        document.getElementById('current-page').textContent = pageNum;
        document.getElementById('btn-prev').disabled = pageNum === 1;
        document.getElementById('btn-next').disabled = false;
    }

    // Handle next button: skip if typing, navigate if done
    function handleNext() {
        if (isTyping) {
            skipTyping();
        } else if (currentPage < totalPages) {
            currentPage++;
            showPage(currentPage);
        } else {
            window.location.href = 'gallery.html';
        }
    }

    // Navigation
    btnNext.addEventListener('click', handleNext);

    document.getElementById('btn-prev').addEventListener('click', () => {
        if (isTyping) {
            clearTimeout(typeTimeout);
            isTyping = false;
        }
        if (currentPage > 1) {
            currentPage--;
            showPage(currentPage);
        }
    });

    if (btnNextA) {
        btnNextA.addEventListener('click', handleNext);
    }

    // Initialize
    showPage(1);

    console.log('Message page loaded!');
});
