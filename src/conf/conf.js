const conf = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_URL),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteApiKey: String(import.meta.env.VITE_APPWRITE_API_KEY),
    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteFormCollectionId: String(import.meta.env.VITE_APPWRITE_FORM_COLLECTION_ID),
    appwriteFreeSessionCollectionId: String(import.meta.env.VITE_APPWRITE_FREE_SESSION_COLLECTION_ID),
    appwriteTeamId: String(import.meta.env.VITE_APPWRITE_TEAM_ID),
    appwriteAdminEmail: String(import.meta.env.VITE_ADMIN_EMAIL),
    appwriteQueryLimit: (import.meta.env.VITE_APPWRITE_QUERY_LIMIT)
}

export default conf;

