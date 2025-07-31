const Storage = {
    async saveUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
        console.log('Simulated API: Saving user data', user);
    },
    getUser() {
        return JSON.parse(localStorage.getItem('user'));
    },
    async saveHabits(habits) {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ habits })
            });
            if (!response.ok) throw new Error('Failed to save habits');
            console.log('JSONPlaceholder API: Habits saved', await response.json());
            localStorage.setItem('habits', JSON.stringify(habits));
        } catch (error) {
            console.error('Habit API error:', error.message);
            localStorage.setItem('habits', JSON.stringify(habits));
        }
    },
    async getHabits() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
            if (!response.ok) throw new Error('Failed to fetch habits');
            console.log('JSONPlaceholder API: Habits fetched', await response.json());
            return JSON.parse(localStorage.getItem('habits')) || [];
        } catch (error) {
            console.error('Habit API error:', error.message);
            return JSON.parse(localStorage.getItem('habits')) || [];
        }
    }
};

export { Storage };