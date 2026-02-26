// Function to handle posting a task
function postTask(taskName) {
    const taskList = document.getElementById('task-list');
    
    // Remove the "empty" message if it exists
    const emptyMsg = document.querySelector('.empty-msg');
    if (emptyMsg) emptyMsg.remove();

    // Create the task element
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    
    // Random pay amount for demonstration
    const pay = (Math.random() * (20 - 5) + 5).toFixed(2);

    taskItem.innerHTML = `
        <div>
            <strong>${taskName}</strong><br>
            <small>📍 Within 0.5 miles</small>
        </div>
        <div>
            <span style="margin-right: 15px; font-weight: bold;">$${pay}</span>
            <button class="accept-btn" onclick="acceptTask(this)">Help Out</button>
        </div>
    `;

    // Add to the top of the list
    taskList.prepend(taskItem);
}

// Function to handle accepting a task
function acceptTask(button) {
    const confirmed = confirm("Do you want to accept this task and contact your neighbor?");
    if (confirmed) {
        const taskItem = button.parentElement.parentElement;
        taskItem.style.opacity = "0.5";
        button.innerText = "Accepted!";
        button.disabled = true;
        button.style.backgroundColor = "#666";
        alert("Thank you! Your neighbor has been notified.");
    }
}
