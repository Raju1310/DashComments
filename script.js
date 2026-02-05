document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    const progressBar = document.getElementById('progressBar');
    const completedCountEl = document.getElementById('completedCount');
    const resetBtn = document.getElementById('resetProgress');

    // Load progress
    let completedDays = JSON.parse(localStorage.getItem('ds_path_progress')) || [];

    function saveProgress() {
        localStorage.setItem('ds_path_progress', JSON.stringify(completedDays));
        updateProgressUI();
    }

    function updateProgressUI() {
        // Calculate total days
        let totalDays = 0;
        window.curriculum.forEach(week => {
            totalDays += week.days.length;
        });

        const count = completedDays.length;
        const percentage = (count / totalDays) * 100;

        progressBar.style.width = `${percentage}%`;
        completedCountEl.textContent = count;

        // Update checkmarks
        document.querySelectorAll('.day-status-check').forEach(check => {
            const dayId = parseInt(check.dataset.day);
            if (completedDays.includes(dayId)) {
                check.classList.add('completed');
                check.closest('.day-card').classList.add('completed-card');
            } else {
                check.classList.remove('completed');
                check.closest('.day-card').classList.remove('completed-card');
            }
        });
    }

    function renderCurriculum() {
        app.innerHTML = '';

        window.curriculum.forEach((week, weekIndex) => {
            // Week Container
            const weekContainer = document.createElement('div');
            weekContainer.className = 'week-container';

            // Week Header
            const weekHeader = document.createElement('div');
            weekHeader.className = 'week-header';
            weekHeader.innerHTML = `
                <h2>Week ${week.week}: ${week.title}</h2>
                <p>${week.description}</p>
            `;
            weekHeader.addEventListener('click', () => {
                weekContainer.classList.toggle('open');
            });

            weekContainer.appendChild(weekHeader);

            // Days Container
            const daysContainer = document.createElement('div');
            daysContainer.className = 'week-days';

            week.days.forEach(day => {
                const dayCard = document.createElement('div');
                dayCard.className = 'day-card';
                dayCard.dataset.day = day.day;

                // Day Header
                const dayHeader = document.createElement('div');
                dayHeader.className = 'day-header';
                dayHeader.innerHTML = `
                    <div class="day-header-info">
                        <span class="day-meta">Day ${day.day}</span>
                        <span class="day-title">${day.title}</span>
                    </div>
                    <div class="day-status-check" data-day="${day.day}" title="Mark Day as Complete"></div>
                `;

                // Toggle Day Content
                dayHeader.addEventListener('click', (e) => {
                    if (e.target.classList.contains('day-status-check')) {
                        toggleCompletion(day.day);
                        return;
                    }
                    dayCard.classList.toggle('open');
                });

                // Day Content
                const dayContent = document.createElement('div');
                dayContent.className = 'day-content';
                dayContent.innerHTML = `<p class="day-desc">${day.description}</p>`;

                // Subtopics
                day.subtopics.forEach((topic, tIndex) => {
                    const topicDiv = document.createElement('div');
                    topicDiv.className = 'subtopic';

                    // Unique ID for tabs
                    const uniqueId = `w${week.week}-d${day.day}-t${tIndex}`;

                    // Build Tabs
                    let tabsHtml = '<div class="tabs">';
                    let contentHtml = '<div class="tab-contents">';

                    // Add "Explanation" as the first default tab
                    tabsHtml += `<button class="tab-btn active" data-target="${uniqueId}-exp">Concept</button>`;
                    contentHtml += `<div id="${uniqueId}-exp" class="tab-content active"><div class="explanation-text">${markedParse(topic.explanation)}</div></div>`;

                    // Add other resources
                    topic.resources.forEach((res, rIndex) => {
                        const resId = `${uniqueId}-r${rIndex}`;
                        let label = res.type.charAt(0).toUpperCase() + res.type.slice(1);
                        if(res.type === 'video') label = 'Video';
                        if(res.type === 'read') label = 'Deep Dive';

                        tabsHtml += `<button class="tab-btn" data-target="${resId}">${label}</button>`;

                        let innerContent = '';
                        if (res.type === 'video' && res.url.includes('youtube')) {
                             innerContent = `<div class="video-wrapper"><iframe src="${res.url}" allowfullscreen></iframe></div>`;
                        } else if (res.type === 'read' && res.content) {
                             // Internal content
                             innerContent = `<div class="internal-read">${markedParse(res.content)}</div>`;
                        } else {
                             // External link
                             innerContent = `<div class="external-link-box">
                                <a href="${res.url}" target="_blank" class="resource-link">Open ${res.title} ↗</a>
                                <p>External Resource</p>
                             </div>`;
                        }

                        contentHtml += `<div id="${resId}" class="tab-content">${innerContent}</div>`;
                    });

                    // Add Task Tab
                    if (topic.task) {
                        const taskId = `${uniqueId}-task`;
                        tabsHtml += `<button class="tab-btn" data-target="${taskId}">Task</button>`;
                        contentHtml += `<div id="${taskId}" class="tab-content">
                            <div class="task-box">
                                <span class="task-title">Practical Task:</span>
                                <p>${topic.task}</p>
                            </div>
                        </div>`;
                    }

                    tabsHtml += '</div>'; // close tabs
                    contentHtml += '</div>'; // close tab-contents

                    topicDiv.innerHTML = `
                        <h3>${topic.title}</h3>
                        ${tabsHtml}
                        ${contentHtml}
                    `;
                    dayContent.appendChild(topicDiv);
                });

                dayCard.appendChild(dayHeader);
                dayCard.appendChild(dayContent);
                daysContainer.appendChild(dayCard);
            });

            weekContainer.appendChild(daysContainer);
            app.appendChild(weekContainer);
        });

        // Initialize Tab Listeners (Delegation)
        app.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn')) {
                const btn = e.target;
                const targetId = btn.dataset.target;
                const parentContext = btn.closest('.subtopic');

                // Deactivate all in this subtopic
                parentContext.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                parentContext.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

                // Activate clicked
                btn.classList.add('active');
                document.getElementById(targetId).classList.add('active');
            }
        });
    }

    // Simple Markdown Parser for explanations
    function markedParse(text) {
        if (!text) return '';
        let html = text
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Code block
            .replace(/```python([\s\S]*?)```/g, '<pre><code class="language-python">$1</code></pre>')
            // Inline code
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            // Newlines to br
            .replace(/\n/g, '<br>');
        return html;
    }

    function toggleCompletion(dayId) {
        if (completedDays.includes(dayId)) {
            completedDays = completedDays.filter(d => d !== dayId);
        } else {
            completedDays.push(dayId);
        }
        saveProgress();
    }

    resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if(confirm("Reset all progress?")) {
            completedDays = [];
            saveProgress();
        }
    });

    // Init
    renderCurriculum();
    updateProgressUI();
});
