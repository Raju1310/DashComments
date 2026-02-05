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
        const total = window.curriculum.length;
        const count = completedDays.length;
        const percentage = (count / total) * 100;

        progressBar.style.width = `${percentage}%`;
        completedCountEl.textContent = count;

        // Update checkmarks
        document.querySelectorAll('.day-card').forEach(card => {
            const dayId = parseInt(card.dataset.day);
            if (completedDays.includes(dayId)) {
                card.classList.add('completed');
            } else {
                card.classList.remove('completed');
            }
        });
    }

    function renderCurriculum() {
        app.innerHTML = '';

        window.curriculum.forEach(day => {
            const card = document.createElement('div');
            card.className = 'day-card';
            card.dataset.day = day.day;

            // Header
            const header = document.createElement('div');
            header.className = 'day-header';
            header.innerHTML = `
                <div>
                    <span class="day-meta">Day ${day.day}</span>
                    <span class="day-title">${day.title}</span>
                </div>
                <div class="status-check" title="Mark as Complete"></div>
            `;

            // Toggle Content
            header.addEventListener('click', (e) => {
                // If clicking the checkmark, toggle completion
                if (e.target.classList.contains('status-check')) {
                    toggleCompletion(day.day);
                    return;
                }
                // Otherwise toggle accordion
                const wasOpen = card.classList.contains('open');
                // Close all others (optional, maybe keep them open)
                // document.querySelectorAll('.day-card').forEach(c => c.classList.remove('open'));
                if (!wasOpen) {
                    card.classList.add('open');
                } else {
                    card.classList.remove('open');
                }
            });

            // Content
            const content = document.createElement('div');
            content.className = 'day-content';
            content.innerHTML = `<p class="day-desc">${day.description}</p>`;

            // Subtopics
            day.subtopics.forEach((topic, index) => {
                const topicDiv = document.createElement('div');
                topicDiv.className = 'subtopic';

                // Tabs Logic
                const uniqueId = `d${day.day}-t${index}`;

                let tabsHtml = '<div class="tabs">';
                let contentHtml = '';

                topic.resources.forEach((res, rIndex) => {
                    const activeClass = rIndex === 0 ? 'active' : '';
                    const typeLabel = res.type.charAt(0).toUpperCase() + res.type.slice(1);
                    tabsHtml += `<button class="tab-btn ${activeClass}" data-target="${uniqueId}-r${rIndex}">${typeLabel}</button>`;

                    let innerContent = '';
                    if (res.type === 'video' && res.url.includes('youtube')) {
                         innerContent = `<div class="video-wrapper"><iframe src="${res.url}" allowfullscreen></iframe></div>`;
                    } else {
                         innerContent = `<a href="${res.url}" target="_blank" class="resource-link">Open ${res.title} ↗</a>`;
                         if (res.type === 'read') {
                             innerContent += `<p style="font-size:0.9rem; margin-top:0.5rem; color:#666;">Read this article to understand the concept.</p>`;
                         }
                    }

                    contentHtml += `<div id="${uniqueId}-r${rIndex}" class="tab-content ${activeClass}">${innerContent}</div>`;
                });
                tabsHtml += '</div>';

                topicDiv.innerHTML = `
                    <h3>${topic.title}</h3>
                    <p class="explanation">${topic.explanation}</p>
                    ${topic.resources.length > 0 ? tabsHtml + contentHtml : ''}
                    <div class="task-box">
                        <span class="task-title">Task:</span> ${topic.task}
                    </div>
                `;
                content.appendChild(topicDiv);
            });

            card.appendChild(header);
            card.appendChild(content);
            app.appendChild(card);
        });

        // Initialize Tab Event Listeners
        app.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn')) {
                const btn = e.target;
                const targetId = btn.dataset.target;
                const parentSubtopic = btn.closest('.subtopic');

                // Remove active from siblings
                parentSubtopic.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                parentSubtopic.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

                // Activate clicked
                btn.classList.add('active');
                document.getElementById(targetId).classList.add('active');
            }
        });
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
