
import config from "../config/config.js";
import { Client, Account, ID } from "appwrite";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(config.appwriteUrl)
      .setProject(config.appwriteProjectId);

    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create({
        userId: ID.unique(),
        email,
        password,
        name,
      });

      if (userAccount) {
        return await this.login({ email, password });
      }

      return userAccount;
    } catch (error) {
      throw error;
    }
  }

  async login({ email, password }) {
    return await this.account.createEmailPasswordSession({
      email,
      password,
    });
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      // No active session is an expected guest state.
      if (error.code === 401) {
        return null;
      }

      console.error("Appwrite service :: getCurrentUser :: error", error);
      return null;
    }
  }

  async logout() {
    try {
      await this.account.deleteSessions();
      return true;
    } catch (error) {
      console.error("Appwrite service :: logout :: error", error);
      throw error;
    }
  }
}

const authService = new AuthService();

export default authService;
