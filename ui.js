import { Auth } from './auth.js';
import { Habits } from './habits.js';
import { Progress } from './progress.js';
import { Storage } from './storage.js';

const UI = {
    fallbackQuotes: [
        { content: "Small steps every day lead to big results.", author: "Unknown" },
        { content: "Consistency is the key to success.", author: "Unknown" },
        { content: "Habits are the compound interest of self-improvement.", author: "James Clear" },
        { content: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" }
    ],
    async init() {
        await Habits.init();
        this.bindEvents();
        if (Storage.getUser()) {
            this.showApp();
        }
        this.fetchQuote();
    },
    bindEvents() {
        document.getElementById('login').addEventListener('click', async () => {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            await Auth.login(email, password);
        });
        document.getElementById('register').addEventListener('click', async () => {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            await Auth.register(email, password);
        });
        document.getElementById('logout').addEventListener('click', Auth.logout);
        document.getElementById('add-habit').addEventListener('click', () => this.showModal());
        document.getElementById('save-habit').addEventListener('click', () => this.saveHabit());
        document.getElementById('cancel-habit').addEventListener('click', () => this.hideModal());
        document.getElementById('view-progress').addEventListener('click', () => this.showProgress());
        document.getElementById('back-to-home').addEventListener('click', () => this.showApp());
        document.getElementById('theme-toggle').addEventListener('click', this.toggleTheme);
        document.getElementById('habit-select').addEventListener('change', (e) => {
            const { calendar, stats } = Progress.generateCalendar(e.target.value);
            document.getElementById('calendar').innerHTML = calendar;
            document.getElementById('stats').innerHTML = stats;
        });
    },
    showAuth() {
        document.getElementById('auth-section').style.display = 'block';
        document.getElementById('app-section').style.display = 'none';
        document.getElementById('progress-section').style.display = 'none';
        document.getElementById('logout').style.display = 'none';
    },
    showApp() {
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('app-section').style.display = 'block';
        document.getElementById('progress-section').style.display = 'none';
        document.getElementById('logout').style.display = 'inline-block';
        this.renderHabits();
    },
    showProgress() {
        document.getElementById('app-section').style.display = 'none';
        document.getElementById('progress-section').style.display = 'block';
        const select = document.getElementById('habit-select');
        select.innerHTML = Habits.habits.map(h => `<option value="${h.id}">${h.name}</option>`).join('');
        if (Habits.habits.length > 0) {
            const { calendar, stats } = Progress.generateCalendar(select.value);
            document.getElementById('calendar').innerHTML = calendar;
            document.getElementById('stats').innerHTML = stats;
        }
    },
    showModal(habit = null) {
        const modal = document.getElementById('habit-modal');
        document.getElementById('modal-title').textContent = habit ? 'Edit Habit' : 'Add Habit';
        document.getElementById('habit-name').value = habit ? habit.name : '';
        document.getElementById('habit-frequency').value = habit ? habit.frequency : 'daily';
        document.getElementById('habit-description').value = habit ? habit.description : '';
        document.getElementById('save-habit').dataset.id = habit ? habit.id : '';
        modal.style.display = 'flex';
    },
    hideModal() {
        document.getElementById('habit-modal').style.display = 'none';
    },
    renderHabits() {
        const list = document.getElementById('habit-list');
        list.innerHTML = Habits.habits.map(habit => `
            <div class="habit-item">
                <span>${habit.name} (${habit.frequency})</span>
                <div>
                    <button onclick="Tracker.markHabitDone(${habit.id})">Done</button>
                    <button onclick="UI.showModal(Habits.habits.find(h => h.id === ${habit.id}))">Edit</button>
                    <button onclick="Habits.deleteHabit(${habit.id}); UI.renderHabits()">Delete</button>
                </div>
            </div>
        `).join('');
    },
    async saveHabit() {
        const id = document.getElementById('save-habit').dataset.id;
        const name = document.getElementById('habit-name').value;
        const frequency = document.getElementById('habit-frequency').value;
        const description = document.getElementById('habit-description').value;
        if (id) {
            await Habits.editHabit(parseInt(id), name, frequency, description);
        } else {
            await Habits.addHabit(name, frequency, description);
        }
        this.renderHabits();
        this.hideModal();
    },
    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        document.getElementById('theme-toggle').textContent = 
            document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
    },
    async fetchQuote(attempts = 3, delay = 1000) {
        if (attempts === 0) {
            const quote = this.fallbackQuotes[Math.floor(Math.random() * this.fallbackQuotes.length)];
            document.getElementById('quote').textContent = `"${quote.content}" — ${quote.author}`;
            console.warn('All API attempts failed, using fallback quote');
            return;
        }

        try {
            const response = await fetch('https://api.quotable.io/random', { cache: 'no-store' });
            if (!response.ok) throw new Error(`API error: ${response.status}`);
            const data = await response.json();
            document.getElementById('quote').textContent = `"${data.content}" — ${data.author}`;
        } catch (error) {
            console.error('Quote API error:', error.message);
            setTimeout(() => this.fetchQuote(attempts - 1, delay * 2), delay);
        }
    }
};

UI.init();

export { UI };

import { Tracker } from './tracker.js';
window.Tracker = Tracker;
window.UI = UI;
window.Habits = Habits;