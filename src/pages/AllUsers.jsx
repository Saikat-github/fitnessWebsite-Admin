import { useCallback, useContext, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { converDate } from "../utils/ConverDate";
import conf from "../conf/conf";



const AllUsers = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = conf.appwriteQueryLimit;

  const { users, getUsers } = useContext(AppContext);

  useEffect(() => {
    getUsers(page, limit)
  }, [page]);

  // Sort users from latest to oldest by 'createdAt' date
  const sortedUsers = [...users].sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));

  // Filter users based on search input
  const filteredUsers = sortedUsers.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-6">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-3xl font-bold text-gray-800">All Registered Users</h1>
        {/* Search Bar */}
        <div className="relative w-full sm:w-1/3 mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 border border-slate-400 rounded-lg shadow-sm focus:ring focus:ring-blue-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
        </div>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full border-collapse">
          <thead className="bg-slate-700 text-white">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Created At</th>
              <th className="p-4 text-left">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={index} className="border-t hover:bg-gray-50 transition text-xs">
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{converDate(user.$createdAt)}</td>
                  <td className="p-4">{converDate(user.accessedAt)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      {/* Pagination Controls */}
      <div className="my-6 flex justify-between items-center text-sm">
        <button className="flex items-center px-3 py-1 bg-slate-700 text-slate-100 rounded-full cursor-pointer" onClick={() => setPage(page - 1)} disabled={page === 1}>
          <ChevronLeft /> Previous
        </button>
        <span> Page {page} </span>
        <button
          className="flex items-center px-3 py-1 bg-slate-700 text-slate-100 rounded-full cursor-pointer"
          onClick={() => setPage(page + 1)}
          disabled={users.length < limit}
        >
          Next<ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default AllUsers;
