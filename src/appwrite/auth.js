import { Client, Account, ID, Teams } from "appwrite";
import conf from "../conf/conf";


export class AuthService {
    client = new Client();
    account;
    temas;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.account = new Account(this.client);
        this.teams = new Teams(this.client)
    }

    async login({email, password}) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            throw error
        }
    }


    async checkMembership() {
        try {
            const res = await this.teams.listMemberships(conf.appwriteTeamId);
            return res;
        } catch (error) {
            throw error;
        }
    }

    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            throw error;
        }
    }

    async sendPasswordRecoveryEmail (email, url) {
        try {
            await this.account.createRecovery(
                email, url
            )
            console.log("Recovery email sent")
        } catch (error) {
            throw error
        }
    }

    async resetPassword (userId, secret, newPassword) {
        try {
            await this.account.updateRecovery(userId, secret, newPassword, newPassword);
            console.log('Password reset successful');
        } catch (error) {
            throw error;
        }
    }
}

const authService = new AuthService();

export default authService;