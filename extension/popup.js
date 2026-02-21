document.getElementById('scan-btn').addEventListener('click', () => {
    const resultsDiv = document.getElementById('results');
    const scoreVal = document.getElementById('score-val');
    const verdict = document.getElementById('verdict');
    
    resultsDiv.classList.remove('hidden');
    verdict.textContent = "Scanning...";
    
    // Simulate scanning
    setTimeout(() => {
        const score = Math.floor(Math.random() * (100 - 70 + 1) + 70); // Random score between 70-100
        scoreVal.textContent = score;
        verdict.textContent = score > 85 ? "Likely Authentic" : "Possible AI Content";
        
        // Update color
        if (score > 85) {
            scoreVal.style.color = '#00ff9d'; // Green
        } else {
            scoreVal.style.color = '#ff9d00'; // Orange
        }
    }, 1500);
});

document.getElementById('view-report').addEventListener('click', () => {
    // Open the web app dashboard
    chrome.tabs.create({ url: 'http://localhost:3000/dashboard' });
});
