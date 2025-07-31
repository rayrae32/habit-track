import { Habits } from './habits.js';

const Progress = {
    generateCalendar(habitId) {
        const habit = Habits.habits.find(h => h.id === parseInt(habitId));
        if (!habit) return { calendar: '', stats: '' };
        
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let calendarHtml = '';
        let completionCount = 0;
        
        const streaks = {};
        habit.completed.forEach(date => {
            if (date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`)) {
                streaks[date] = (streaks[date] || 0) + 1;
            }
        });

        for (let i = 1; i <= daysInMonth; i++) {
            const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const isCompleted = habit.completed.includes(date);
            if (isCompleted) completionCount++;
            const streak = streaks[date] || 0;
            let className = '';
            if (isCompleted) {
                className = streak > 2 ? 'completed-high' : streak > 1 ? 'completed-mid' : 'completed-low';
            }
            calendarHtml += `<div class="${className}" title="${date}">${i}</div>`;
        }

        const completionPercentage = Math.round((completionCount / daysInMonth) * 100);
        const statsHtml = `Completion: ${completionCount}/${daysInMonth} days (${completionPercentage}%)`;
        
        return { calendar: calendarHtml, stats: statsHtml };
    }
};

export { Progress };