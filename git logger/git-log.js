document.addEventListener('DOMContentLoaded', () => {
    const logContainer = document.getElementById('git-log-list');

    fetch('git logger/git-log-box.txt')
        .then(response => {
            if (!response.ok) throw new Error('File not found');
            return response.text();
        })
        .then(data => {
            const lines = data.trim().split('\n');
            logContainer.innerHTML = ''; 

            lines.forEach(line => {
                const parts = line.split('|||');
                
                if (parts.length >= 5) {
                    const [author, profileUrl, message, files, commitUrl] = parts;
                    const hash = commitUrl.split('/').pop();

                    const scrollItem = document.createElement('div');
                    scrollItem.className = 'scroll-item';

                    const p = document.createElement('p');
                    // Style: Author (Red Link) | Message --- Files (Faded) | #Hash (Blue Link)
                    p.innerHTML = `
                        <a href="${profileUrl}" target="_blank" style="color: #e74c3c; font-weight: bold; text-decoration: none;">${author}</a> | 
                        ${message} --- <span style="opacity: 0.7; font-size: 0.9em;">${files}</span> | 
                        <a href="${commitUrl}" target="_blank" style="color: #3498db; font-weight: bold; text-decoration: none;">#${hash}</a>
                    `;
                    
                    scrollItem.appendChild(p);
                    logContainer.appendChild(scrollItem);
                }
            });
        })
        .catch(err => {
            console.error('Log Error:', err);
            logContainer.innerHTML = `<div class="scroll-item"><p style="color: red;">Error: ${err.message}</p></div>`;
        });
});