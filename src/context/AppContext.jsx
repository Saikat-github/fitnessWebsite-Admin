import { createContext, useEffect, useState, useMemo } from "react";
import authService from "../appwrite/auth";
import { toast } from "react-toastify";
import dbService from "../appwrite/data";
import { getStartEndDate } from "../utils/ConverDate";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [loader, setLoader] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [totalCount, setTotalCount] = useState({ totalUsers: 0, totalForms: 12, totalSessions: 50 });
  const [users, setUsers] = useState([]);
  const [forms, setForms] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [dateFilter, setDateFilter] = useState("thisMonth");



  /*** Check if the admin is authenticated ***/
  const checkAuthStatus = async () => {
    try {
      const { memberships } = await authService.checkMembership();
      return memberships.some((membership) => membership.userId === adminData?.$id);
    } catch (error) {
      return false;
    }
  };

  /*** Fetch Admin Data ***/
  const getAdminData = async () => {
    try {
      const userData = await authService.getCurrentUser();
      if (userData && userData.$id !== adminData?.$id) {
        setAdminData(userData);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  /*** Fetch Users ***/
  const getUsers = async (page, limit) => {
    try {
      const fetchedUsers = await dbService.getAllUsers(page, limit);
      if (fetchedUsers?.users) {
        setUsers(fetchedUsers.users);
        setTotalCount((prev) => ({ ...prev, totalUsers: fetchedUsers.total }));
      }
    } catch (error) {
      toast.error("Failed to fetch users: " + error.message);
    }
  };

  /*** Fetch Forms ***/
  const getForms = async ({page, limit, startDate, endDate}) => {
    console.log()
    try {
      const fetchedForms = await dbService.getAllForms({page, limit, startDate, endDate});
      if (fetchedForms?.documents) {
        setForms(fetchedForms.documents);
        setTotalCount((prev) => ({ ...prev, totalForms: fetchedForms.total }));
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch forms: " + error.message);
    }
  };

  /*** Fetch Sessions ***/
  const getSessions = async ({page, limit, startDate, endDate}) => {
    try {
      const fetchedSessions = await dbService.getAllFreeSessions({page, limit, startDate, endDate});
      if (fetchedSessions?.documents) {
        setSessions(fetchedSessions.documents);
        setTotalCount((prev) => ({ ...prev, totalSessions: fetchedSessions.total }));
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to fetch sessions: " + error.message);
    } 
  };

  /*** Fetch all required data in parallel ***/
  useEffect(() => {
    const {startDate, endDate} = getStartEndDate("thisMonth");
    const fetchData = async () => {
      try {
        const [admin, usersData, formsData, sessionsData] = await Promise.all([
          getAdminData(),
          getUsers(),
          getForms({startDate, endDate}),
          getSessions({startDate, endDate})
        ]);
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };

    fetchData();
  }, []);

  /*** Memoize Context Value ***/
  const contextValue = useMemo(
    () => ({
      adminData,
      setAdminData,
      checkAuthStatus,
      isAuthenticated,
      setIsAuthenticated,
      totalCount,
      setTotalCount,
      users,
      getUsers,
      forms,
      getForms,
      sessions,
      getSessions,
      dateFilter,
      setDateFilter
    }),
    [adminData, isAuthenticated, totalCount, users, forms, sessions]
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
