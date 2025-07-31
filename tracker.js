import { Habits } from './habits.js';
import { UI } from './ui.js';

const Tracker = {
    getCurrentDate() {
        return new Date().toISOString().split('T')[0];
    },
    async markHabitDone(id) {
        await Habits.trackHabit(id, this.getCurrentDate());
        UI.renderHabits();
        this.showNotification(`Habit marked as done!`);
    },
    showNotification(message) {
        alert(message);
    }
};

export { Tracker };