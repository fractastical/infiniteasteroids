function adjustTextSize(modalId) {
    const modal = document.getElementById(modalId);
    const content = modal.querySelector('.modal-content');
    let fontSize = parseFloat(getComputedStyle(content).fontSize);
    const minFontSize = 10; // Minimum font size in pixels

    content.classList.add('adjust-text-size');

    while (content.scrollHeight > content.clientHeight && fontSize > minFontSize) {
        fontSize -= 0.5;
        content.style.fontSize = `${fontSize}px`;
    }

    content.classList.remove('adjust-text-size');
}


function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
    adjustTextSize(modalId); // Call this if you're using the dynamic text sizing function
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
}

