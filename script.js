class ScheduleManager {
    constructor() {
        this.dataRoot = '../LHS-Connect-Beta-Data';
        this.currentSchedule = null;
        this.init();
    }

    async init() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        await this.loadAndDisplaySchedule();
    }

    formatTime(timeString) {
        const [hour, minute] = timeString.split(':');
        const h = parseInt(hour, 10);
        const m = minute;
        const ampm = h >= 12 ? 'PM' : 'AM';
        const formattedHour = h % 12 || 12;
        return `${formattedHour}:${m} ${ampm}`;
    }

    getCurrentPeriod(schedule) {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        return schedule.periods.find(p => {
            const [sH, sM] = p.startTime.split(':').map(Number);
            const [eH, eM] = p.endTime.split(':').map(Number);
            const start = sH * 60 + sM;
            const end = eH * 60 + eM;
            return currentTime >= start && currentTime < end;
        });
    }

    updateClock() {
        const now = new Date();
        document.getElementById('current-date').textContent = now.toLocaleDateString();
        document.getElementById('current-time').textContent = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' });

        if (this.currentSchedule) {
            const period = this.getCurrentPeriod(this.currentSchedule);
            const titleEl = document.getElementById('page-title');
            if (period) {
                const [eH, eM] = period.endTime.split(':').map(Number);
                const endSeconds = eH * 3600 + eM * 60;
                const nowSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
                const remainingSeconds = endSeconds - nowSeconds;
                const remainingMinutes = Math.floor(remainingSeconds / 60);
                const remainingSecs = remainingSeconds % 60;
                
                titleEl.textContent = `${remainingMinutes}m ${remainingSecs}s left in ${period.periodName}`;
                document.title = titleEl.textContent;
            } else {
                titleEl.textContent = "LHS Connect Beta";
                document.title = titleEl.textContent;
            }
        }
    }

    async fetchJson(path) {
        const response = await fetch(path);
        return await response.json();
    }

    async loadAndDisplaySchedule() {
        const now = new Date();
        const dateKey = now.toISOString().split('T')[0];
        const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();

        try {
            const [normalMapping, overrides] = await Promise.all([
                this.fetchJson(`${this.dataRoot}/normal_schedule_mapping.json`),
                this.fetchJson(`${this.dataRoot}/overrides.json`)
            ]);

            const schedulePath = overrides[dateKey] || normalMapping[dayOfWeek];
            this.currentSchedule = await this.fetchJson(`${this.dataRoot}/${schedulePath}`);

            this.displaySchedule(this.currentSchedule);
        } catch (error) {
            console.error("Failed to load schedule:", error);
        }
    }

    displaySchedule(schedule) {
        const list = document.getElementById('schedule-list');
        list.innerHTML = schedule.periods.map(p => `
            <li>
                <strong>${p.periodName}</strong>: ${this.formatTime(p.startTime)} - ${this.formatTime(p.endTime)}
            </li>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => new ScheduleManager());
