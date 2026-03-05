// 1. Setup Connection
const _supabaseUrl = 'https://kgcxehpzwdqlojkzkduw.supabase.co';
const _supabaseKey = 'sb_publishable_uNBXmDSOaMclU09S11o0ug_qqvZRllX';
const supabase = supabase.createClient(_supabaseUrl, _supabaseKey);

// 2. Fetch tasks from database when the page loads
window.onload = async () => {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

    if (data) {
        data.forEach(task => renderTaskToUI(task.task_name, task.price));
    }
};

// 3. Update your postTask function to SAVE to database
async function postTask(taskName) {
    let pay = (taskName.length > 25) ? 20 : 10;

    // Save to Supabase
    const { data, error } = await supabase
        .from('tasks')
        .insert([{ task_name: taskName, price: pay }]);

    if (error) {
        console.error("Error saving task:", error);
    } else {
        renderTaskToUI(taskName, pay);
    }
}

// 4. Move your UI drawing logic here
function renderTaskToUI(taskName, pay) {
    const taskList = document.getElementById('task-list');
    const emptyMsg = document.querySelector('.empty-msg');
    if (emptyMsg) emptyMsg.remove();

    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    taskItem.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <div><strong>${taskName}</strong><br><small>📍 Neighbor nearby</small></div>
            <div style="text-align:right;">
                <span style="display:block; font-weight:bold; color:green;">$${pay}.00</span>
                <button onclick="this.innerText='Accepted!';">Accept</button>
            </div>
        </div>`;
    taskList.prepend(taskItem);
}

// --- VOICE UI ---
function startVoice() {
    const btn = document.getElementById('voice-btn');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        alert("Voice typing is not supported in this browser. Please use Chrome.");
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
        postTask(transcript);
    };

    recognition.onerror = () => {
        btn.classList.remove('recording');
        btn.innerText = "🎙️ Tap to Speak Your Need";
    };

    recognition.start();
}

// --- OTHER OPTION LOGIC ---
function showOther() {
    const area = document.getElementById('other-input-area');
    area.style.display = 'block';
    area.scrollIntoView({ behavior: 'smooth' });
}

function submitCustomTask() {
    const input = document.getElementById('custom-task-input');
    if (input.value.trim() !== "") {
        postTask(input.value);
        input.value = "";
        document.getElementById('other-input-area').style.display = 'none';
    }
}

// --- CORE POSTING LOGIC ---
function postTask(taskName) {
    const taskList = document.getElementById('task-list');
    const emptyMsg = document.querySelector('.empty-msg');
    if (emptyMsg) emptyMsg.remove();

    // Auto-Pricing Logic based on task length or keywords
    let pay = 10;
    const lowerTask = taskName.toLowerCase();
    if (taskName.length > 25) pay = 20;
    if (lowerTask.includes("yard") || lowerTask.includes("heavy") || lowerTask.includes("store")) pay = 25;

    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    taskItem.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
                <strong>${taskName}</strong><br>
                <small>📍 Neighbor nearby</small>
            </div>
            <div style="text-align:right;">
                <span style="display:block; font-weight:bold; color:green; font-size:1.2rem;">$${pay}.00</span>
                <button onclick="this.innerText='Help is coming!'; this.disabled=true; this.style.background='#666';" 
                        style="padding:8px 12px; cursor:pointer; background:#0052cc; color:white; border:none; border-radius:5px;">Accept</button>
            </div>
        </div>
    `;
    taskList.prepend(taskItem);
}
