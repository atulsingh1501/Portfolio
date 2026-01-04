document.addEventListener('DOMContentLoaded', () => {
    // --- GitHub Calendar (Custom Render) ---
    // Removed external library init to use custom data source for consistency
    const calendarEl = document.querySelector(".calendar");
    if (calendarEl) calendarEl.innerHTML = '<div class="custom-calendar"><div class="graph-weeks" id="graph-weeks"></div><div class="graph-footer"><span>Learn how we count contributions</span><div style="display:flex; gap:3px; align-items: center"><span>Less</span><div style="display:flex; gap:3px;"><span class="graph-day" data-level="0"></span><span class="graph-day" data-level="1"></span><span class="graph-day" data-level="2"></span><span class="graph-day" data-level="3"></span><span class="graph-day" data-level="4"></span></div><span>More</span></div></div></div>'; // Skeleton

    // --- LeetCode Stats (Real-time) ---
    async function fetchLeetCodeStats() {
        try {
            const username = "atul_1501";
            const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
            const data = await response.json();

            if (data.status === "success") {
                document.getElementById('leetcode-total').innerText = data.totalSolved;

                // Update text counts
                document.getElementById('leetcode-easy-count').innerText = data.easySolved;
                document.getElementById('leetcode-medium-count').innerText = data.mediumSolved;
                document.getElementById('leetcode-hard-count').innerText = data.hardSolved;

                // Update bars (Normalize widths based on total solved or fixed max)
                // Using percentage of total solved for relative distribution
                const total = data.totalSolved;
                document.getElementById('leetcode-easy-bar').style.width = `${(data.easySolved / total) * 100}%`;
                document.getElementById('leetcode-medium-bar').style.width = `${(data.mediumSolved / total) * 100}%`;
                document.getElementById('leetcode-hard-bar').style.width = `${(data.hardSolved / total) * 100}%`;
            } else {
                document.getElementById('leetcode-total').innerText = "500+"; // Fallback
            }
        } catch (error) {
            console.error("LeetCode fetch failed:", error);
            document.getElementById('leetcode-total').innerText = "500+"; // Fallback
        }
    }
    fetchLeetCodeStats();

    // --- GitHub Streak (Real-time) ---
    async function fetchGitHubStreak() {
        try {
            const username = "atulsingh1501";
            // Using a public API proxy for contributions (cors-enabled)
            const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`);
            const data = await response.json();

            if (data.contributions) {
                const contribMap = new Map();
                data.contributions.forEach(c => contribMap.set(c.date, c.count));

                const formatDate = (date) => {
                    const offset = date.getTimezoneOffset();
                    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
                    return localDate.toISOString().split('T')[0];
                };

                let d = new Date();
                let streak = 0;
                let dateStr = formatDate(d);

                // If today has 0, check yesterday (streak is preserved if missed today but active yesterday)
                if (!contribMap.has(dateStr) || contribMap.get(dateStr) === 0) {
                    d.setDate(d.getDate() - 1);
                    dateStr = formatDate(d);
                }

                while (contribMap.get(dateStr) > 0) {
                    streak++;
                    d.setDate(d.getDate() - 1);
                    dateStr = formatDate(d);
                }

                const streakEl = document.getElementById('github-streak');
                // Calculate Total Contributions for all years
                let totalContribs = 0;
                if (data.total) {
                    Object.values(data.total).forEach(val => totalContribs += val);
                } else {
                    // Fallback if total object isn't as expected, sum array
                    totalContribs = data.contributions.reduce((acc, curr) => acc + curr.count, 0);
                }

                if (streakEl) {
                    streakEl.innerHTML = `<span style="font-weight: 500; font-size: 0.85rem; color: var(--text-secondary);">Total: <span style="color: var(--text-primary);">${totalContribs}</span></span> &nbsp;|&nbsp; Streak: <div class="badge" style="background: rgba(16, 185, 129, 0.1); color: var(--success-color); border: 1px solid rgba(16, 185, 129, 0.2); margin-left: 4px;"><span class="live-dot"></span> ${streak}</div>`;
                }

                // --- Year Filtering Logic ---
                const graphContainer = document.getElementById('graph-weeks');
                if (graphContainer) {
                    graphContainer.innerHTML = '';

                    // 1. Create Layout Structure
                    const mainWrapper = document.createElement('div');
                    mainWrapper.className = 'calendar-main-wrapper';

                    // Year Selector (Tabs)
                    const yearSelector = document.createElement('div');
                    yearSelector.className = 'year-selector';
                    mainWrapper.appendChild(yearSelector);

                    // Graph Wrapper (Content)
                    const graphContent = document.createElement('div');
                    graphContent.className = 'calendar-grid-wrapper';
                    mainWrapper.appendChild(graphContent);

                    graphContainer.appendChild(mainWrapper);

                    const allContribs = data.contributions;

                    // Identify available years
                    const yearsSet = new Set();
                    allContribs.forEach(d => yearsSet.add(new Date(d.date).getFullYear()));
                    const years = Array.from(yearsSet).sort((a, b) => a - b); // 2024, 2025, 2026

                    let activeYear = years[years.length - 1]; // Default to latest

                    // Function to render graph for a specific year
                    const renderYear = (targetYear) => {
                        graphContent.innerHTML = ''; // Clear previous

                        // Filter data
                        const yearData = allContribs.filter(d => new Date(d.date).getFullYear() === targetYear);

                        // Update Total for this year
                        const yearTotal = yearData.reduce((acc, curr) => acc + curr.count, 0);
                        const streakEl = document.getElementById('github-streak');
                        // Reuse the global streak but update total text to reflect "Year Total" or "Total"
                        // Actually, user likely wants "Total" to remain GLOBAL or YEAR specific?
                        // Usually "2024: X contributions". Let's show Year Specific Total in the text.
                        // But we also want to show "Streak" which is global.
                        if (streakEl) {
                            streakEl.innerHTML = `<span style="font-weight: 500; font-size: 0.85rem; color: var(--text-secondary);">${targetYear}: <span style="color: var(--text-primary);">${yearTotal}</span></span> &nbsp;|&nbsp; Streak: <div class="badge" style="background: rgba(16, 185, 129, 0.1); color: var(--success-color); border: 1px solid rgba(16, 185, 129, 0.2); margin-left: 4px;"><span class="live-dot"></span> ${streak}</div>`;
                        }

                        // --- Render Tabs ---
                        yearSelector.innerHTML = '';
                        years.forEach(y => {
                            const btn = document.createElement('button');
                            btn.className = `year-btn ${y === targetYear ? 'active' : ''}`;
                            btn.innerText = y;
                            btn.onclick = () => renderYear(y);
                            yearSelector.appendChild(btn);
                        });

                        // --- Render Graph ---
                        // 1. Months Header
                        const monthsHeader = document.createElement('div');
                        monthsHeader.className = 'months-header';

                        // 2. Main Body (Weekdays + Grid)
                        const calendarBody = document.createElement('div');
                        calendarBody.className = 'calendar-body';

                        // Weekday Labels
                        const weekdaysCol = document.createElement('div');
                        weekdaysCol.className = 'weekdays-col';
                        weekdaysCol.innerHTML = `
                            <span class="wday-label"></span>
                            <span class="wday-label">Mon</span>
                            <span class="wday-label"></span>
                            <span class="wday-label">Wed</span>
                            <span class="wday-label"></span>
                            <span class="wday-label">Fri</span>
                            <span class="wday-label"></span>
                        `;
                        calendarBody.appendChild(weekdaysCol);

                        const grid = document.createElement('div');
                        grid.className = 'graph-grid';

                        // Logic to build weeks
                        let weeks = [];
                        let currentWeek = [];

                        // Pad beginning of year if needed?
                        // GitHub starts graph on SUNDAY first week.
                        // We need to calculate day of week for Jan 1
                        /* Simple Render: Just push days.
                           For accurate "weekday alignment", usually we pad based on day of week.
                           But our 'yearData' is just array of dates.
                           We should verify if 'yearData[0]' is a Sunday. 
                           If not, pad with empty squares until we hit the real start day.
                        */
                        if (yearData.length > 0) {
                            const firstDate = new Date(yearData[0].date);
                            const startDay = firstDate.getDay(); // 0 = Sun, 1 = Mon ...

                            // Pad initial week
                            for (let i = 0; i < startDay; i++) {
                                currentWeek.push({ level: -1 }); // -1 indicates empty/spacer
                            }
                        }

                        yearData.forEach((day, index) => {
                            currentWeek.push(day);
                            if (currentWeek.length === 7) {
                                weeks.push(currentWeek);
                                currentWeek = [];
                            }
                        });
                        // Push remaining
                        if (currentWeek.length > 0) {
                            weeks.push(currentWeek);
                        }

                        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                        let lastMonth = -1;

                        weeks.forEach((week, weekIndex) => {
                            // Headers
                            const firstValidDay = week.find(d => d.level !== -1);
                            if (firstValidDay) {
                                const dObj = new Date(firstValidDay.date);
                                const mIndex = dObj.getMonth();
                                if (mIndex !== lastMonth && weekIndex < weeks.length - 2) {
                                    const mLabel = document.createElement('span');
                                    mLabel.className = 'month-label';
                                    mLabel.innerText = monthNames[mIndex];
                                    mLabel.style.left = `${weekIndex * 13}px`;
                                    monthsHeader.appendChild(mLabel);
                                    lastMonth = mIndex;
                                }
                            }

                            const weekEl = document.createElement('div');
                            weekEl.className = 'graph-week';

                            week.forEach(day => {
                                const dayEl = document.createElement('div');
                                if (day.level === -1) {
                                    dayEl.className = 'graph-day empty';
                                } else {
                                    dayEl.className = 'graph-day';
                                    dayEl.setAttribute('data-level', day.level);
                                    dayEl.title = `${day.count} contributions on ${day.date}`;
                                }
                                weekEl.appendChild(dayEl);
                            });

                            // Pad end of last week
                            while (weekEl.children.length < 7) {
                                const emptyDay = document.createElement('div');
                                emptyDay.className = 'graph-day empty';
                                weekEl.appendChild(emptyDay);
                            }

                            grid.appendChild(weekEl);
                        });

                        calendarBody.appendChild(grid);
                        graphContent.appendChild(monthsHeader);
                        graphContent.appendChild(calendarBody);
                    };

                    // Initial Render
                    renderYear(activeYear);
                }
            }
        } catch (error) {
            console.error("GitHub Streak fetch failed:", error);
            const streakEl = document.getElementById('github-streak');
            if (streakEl) streakEl.innerText = "Streak: -";
        }
    }
    fetchGitHubStreak();

    // --- Navigation Highlights ---
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section');
    const mainContent = document.querySelector('.main-content');

    // Simple scroll spy to highlight sidebar
    if (mainContent) {
        mainContent.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                // 150px offset for header
                if (mainContent.scrollTop >= (sectionTop - 250)) {
                    current = section.getAttribute('id');
                }
            });

            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href').includes(current)) {
                    item.classList.add('active');
                }
            });
        });
    }

    // --- Smooth Scroll for anchors ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            // Remove active class from all
            navItems.forEach(item => item.classList.remove('active'));
            // Add to clicked
            this.classList.add('active');

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
