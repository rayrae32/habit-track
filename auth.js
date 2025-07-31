import { UI } from './ui.js';
import { Storage } from './storage.js';

const Auth = {
    async login(email, password) {
        const user = Storage.getUser();
        if (user && user.email === email && user.password === password) {
            UI.showApp();
            return true;
        }
        alert('Invalid credentials');
        return false;
    },
    async register(email, password) {
        if (Storage.getUser()) {
            alert('User already exists');
            return false;
        }
        await Storage.saveUser({ email, password });
        UI.showApp();
        return true;
    },
    logout() {
        UI.showAuth();
    }
};

export { Auth };