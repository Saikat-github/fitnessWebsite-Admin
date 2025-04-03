import { Client, Databases, ID, Query } from "appwrite";
import conf from "../conf/conf";
import axios from "axios";

export class DbService {
    client = new Client();
    databases;
    users

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId)
        this.databases = new Databases(this.client);
    }


    //Update Methods
    async updateForm({id, messageCount, emailCount}) {
        try {
                return await this.databases.updateDocument(
                    conf.appwriteDatabaseId,
                    conf.appwriteFormCollectionId,
                    id, 
                    {
                        messageCount, 
                        emailCount
                    }
                )
        } catch (error) {
            console.log("Appwrite database error: updateDocument:", error);
            throw error
        }
    }



    async updateSession({$id, messageCount}) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteFreeSessionCollectionId,
                $id, 
                {
                    messageCount: messageCount + 1
                }
            )
        } catch (error) {
            console.log("Appwrite database error: updateDocument:", error);
            throw error
        }
    }


    //Delete Methods
    async deleteForm(id) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteFormCollectionId,
                id
            )
            return true;
        } catch (error) {
            console.log("Appwrite database error: deletePost:", error);
            return false;
        }
    }


    async deleteSession(id) {
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteFreeSessionCollectionId,
                id
            )
            return true;
        } catch (error) {
            console.log("Appwrite database error: deletePost:", error);
            return false;
        }
    }



    //Query/get Methods
    async getAllUsers(page = 1, limit = conf.appwriteQueryLimit) {
        try {
            const offset = (page - 1) * limit;
            const res = await axios.get(conf.appwriteUrl + "/users", {
                headers: {
                    "X-Appwrite-Project": conf.appwriteProjectId,
                    "X-Appwrite-Key": conf.appwriteApiKey, // Ensure this key has `users.read` permission
                    "Content-Type": "application/json",
                },
                params: {
                    limit: limit,
                    offset: offset,
                },
            })
            return res.data;
        } catch (error) {
            throw error;
        }
    }


    async getAllForms({page = 1, limit = conf.appwriteQueryLimit, startDate, endDate}) {
        try {
            const res = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteFormCollectionId,
                [
                    Query.greaterThanEqual("$createdAt", startDate),
                    Query.lessThanEqual("$createdAt", endDate),
                    Query.limit(limit),
                    Query.offset((page - 1) * limit),
                    Query.orderDesc("$createdAt"), // Order by latest first
                ]
            )
            return res;
        } catch (error) {
            throw error;
        }
    }


    async getAllFreeSessions({page = 1, limit = conf.appwriteQueryLimit, startDate, endDate}) {
        try {
            const res = await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteFreeSessionCollectionId,
                [
                    Query.greaterThanEqual("$createdAt", startDate),
                    Query.lessThanEqual("$createdAt", endDate),
                    Query.limit(limit),
                    Query.offset((page - 1) * limit),
                    Query.orderDesc("$createdAt"), // Order by latest first
                ]
            )
            return res;
        } catch (error) {
            throw error;
        }
    }


};





const dbService = new DbService();
export default dbService;
