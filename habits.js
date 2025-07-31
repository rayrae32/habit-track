import { Storage } from './storage.js';

const Habits = {
    habits: [],
    async init() {
        this.habits = await Storage.getHabits();
    },
    async addHabit(name, frequency, description) {
        const habit = {
            id: Date.now(),
            name,
            frequency,
            description,
            completed: []
        };
        this.habits.push(habit);
        await Storage.saveHabits(this.habits);
        return habit;
    },
    async deleteHabit(id) {
        this.habits = this.habits.filter(habit => habit.id !== id);
        await Storage.saveHabits(this.habits);
    },
    async editHabit(id, name, frequency, description) {
        const habit = this.habits.find(h => h.id === id);
        if (habit) {
            habit.name = name;
            habit.frequency = frequency;
            habit.description = description;
            await Storage.saveHabits(this.habits);
        }
    },
    async trackHabit(id, date) {
        const habit = this.habits.find(h => h.id === id);
        if (habit && !habit.completed.includes(date)) {
            habit.completed.push(date);
            await Storage.saveHabits(this.habits);
        }
    }
};

export { Habits };