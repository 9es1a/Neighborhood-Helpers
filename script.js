// --- VOICE UI LOGIC ---
function startVoice() {
    const btn = document.getElementById('voice-btn');
    
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        alert("Your browser doesn't support voice typing. Try using Google Chrome.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        btn.classList.add('recording');
        btn.innerText = "🛑 I'm Listening... Speak Now";
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        btn.classList.remove('recording');
        btn.innerText = "🎙️ Tap to Speak Your Need";
        
        // Auto-post what was heard
        postTask(transcript);
    };

    recognition.onerror = () => {
        btn.classList.remove('recording');
        btn.innerText = "🎙️ Tap to Speak Your Need";
        alert("I couldn't hear you clearly. Please try again!");
    };

    recognition.start();
}

// --- TASK POSTING LOGIC ---
function postTask(taskName) {
    const taskList = document.getElementById('task-list');
    const emptyMsg = document.querySelector('.empty-msg');
    if (emptyMsg) emptyMsg.remove();

    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    
    // Simple logic for a random pay amount
    const pay = (Math.floor(Math.random() * 15) + 5);

    taskItem.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
                <strong>${taskName}</strong><br>
                <small>📍 Neighbor nearby</small>
            </div>
            <div style="text-align:right;">
                <span style="display:block; font-weight:bold; color:green; font-size:1.2rem;">$${pay}</span>
                <button onclick="this.innerText='Help is on the way!'; this.disabled=true;" style="padding:8px 12px; cursor:pointer; background:#0052cc; color:white; border:none; border-radius:5px;">Accept Task</button>
            </div>
        </div>
    `;
    
    taskList.prepend(taskItem);
}
