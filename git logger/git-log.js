document.addEventListener('DOMContentLoaded', () => {
    const logContainer = document.getElementById('git-log-list');

    Promise.all([
        fetch('git logger/users.json').then(res => {
            if (!res.ok) throw new Error('User config not found');
            return res.json();
        }),
        fetch('git logger/git-log-box.txt').then(res => {
            if (!res.ok) throw new Error('Log file not found');
            return res.text();
        })
    ])
    .then(([userData, logData]) => {
        const lines = logData.trim().split('\n');
        logContainer.innerHTML = ''; 

        lines.forEach(line => {
            const parts = line.split('|||');
            
            if (parts.length >= 5) {
                let [author, profileUrlRaw, message, files, commitUrl] = parts;
                const hash = commitUrl.split('/').pop();
                
                // FIX: Clean the profile URL. 
                // It looks like "https://github.com/{'username': 'name'}"
                // We extract "https://github.com/" and the actual username from the userData
                const username = userData[author]?.username || "";
                const cleanProfileUrl = `https://github.com/${username}`;

                const userColor = userData[author]?.color || '#888';

                const scrollItem = document.createElement('div');
                scrollItem.className = 'scroll-item';
                scrollItem.style.border = `2px solid ${userColor}`;
                scrollItem.style.borderRadius = '8px';
                scrollItem.style.marginBottom = '10px';
                scrollItem.style.padding = '10px';
                scrollItem.style.background = 'rgba(255, 255, 255, 0.02)';
                scrollItem.style.width = '100%'; // Ensure it fills the centered card

                const p = document.createElement('p');
                p.innerHTML = `
                    <a href="${cleanProfileUrl}" target="_blank" style="color: ${userColor}; font-weight: bold; text-decoration: none;">${author}</a> | 
                    ${message} --- <span style="opacity: 0.7; font-size: 0.9em;">${files}</span> | 
                    <a href="${commitUrl}" target="_blank" style="color: #0FBF3E; font-weight: bold; text-decoration: none;">#${hash}</a>
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