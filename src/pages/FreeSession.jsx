import { useContext, useEffect, useState, useMemo } from "react";
import { Search, MessageCircle, CheckCircle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { converDate, converToJustDate, getStartEndDate } from "../utils/ConverDate";
import dbService from "../appwrite/data";
import { toast } from "react-toastify";
import conf from "../conf/conf";

const FreeSession = () => {
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("thisMonth");
  const { sessions, getSessions, setDateFilter } = useContext(AppContext);
  const limit = conf.appwriteQueryLimit;

  useEffect(() => {
    setLoader(true);
    const { startDate, endDate } = getStartEndDate(filter);
    getSessions({ page, limit, startDate, endDate }).finally(() => setLoader(false));
  }, [page, filter]);

  const filteredSessions = useMemo(() => {
    return sessions
      .filter((user) => user.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [sessions, search]);

  const sendWhatsAppMessage = async (session) => {
    try {
      const whatsappUrl = `https://wa.me/${session?.phoneNo}?text=Hello%20${encodeURIComponent(session?.name)},%20your%20free%20session%20on%20zerodiet.in%20has%20been%20scheduled%20on...`;
      window.open(whatsappUrl, "_blank");

      await dbService.updateSession(session);
      refreshSessions();
    } catch (error) {
      console.error(error);
      toast.error("Error in opening WhatsApp");
    }
  };

  const deleteSession = async (id) => {
    setLoader(true);
    try {
      const success = await dbService.deleteSession(id);
      if (success) {
        toast.success("Session has been marked as completed and deleted.");
        refreshSessions();
      }
    } catch (error) {
      console.error(error);
      toast.error("Error in deleting the session");
    } finally {
      setLoader(false);
    }
  };

  const refreshSessions = () => {
    const { startDate, endDate } = getStartEndDate(filter);
    getSessions({ page, limit, startDate, endDate });
  };

  return (
    <div className="p-3 sm:p-6 bg-slate-100 min-h-screen flex flex-col items-center">
      <h2 className="text-2xl font-semibold text-slate-800 mb-4">Booked Free Sessions</h2>

      {/* Search & Filter Section */}
      <div className="w-full sm:w-1/3 mb-6 flex flex-col sm:flex-row gap-2 items-center">
        <div className="flex items-center gap-1 border border-slate-500 py-1 px-1 rounded shadow">
          <Search className="w-6 text-slate-600" size={18} />
          <input
            type="text"
            placeholder="Search by name..."
            className="outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex justify-center items-center">
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setDateFilter(e.target.value);
            }}
            className="px-1 py-1 rounded shadow-lg bg-white focus:ring-2 focus:ring-slate-600 focus:outline-none text-slate-700"
          >
            <option value="all">Filter</option>
            <option value="today">📆 Today</option>
            <option value="thisWeek">🗓️ This Week</option>
            <option value="lastWeek">⬅️ Last Week</option>
            <option value="thisMonth">📅 This Month</option>
            <option value="lastMonth">⬅️ Last Month</option>
            <option value="thisYear">📆 This Year</option>
            <option value="lastYear">⬅️ Last Year</option>
          </select>
          {loader && <Loader2 className="w-10 text-blue-950 animate-spin" />}
        </div>
      </div>

      {/* Sessions List */}
      <div className="w-full max-w-2xl min-h-[50vh]">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <SessionCard
              key={session.$id}
              session={session}
              onSendMessage={() => sendWhatsAppMessage(session)}
              onDelete={() => deleteSession(session.$id)}
              loading={loader}
            />
          ))
        ) : (
          <p className="text-slate-500 text-center">No free session bookings available.</p>
        )}
      </div>

      {/* Pagination Controls */}
      <PaginationControls
        page={page}
        setPage={setPage}
        hasNextPage={sessions.length >= limit}
      />
    </div>
  );
};

const SessionCard = ({ session, onSendMessage, onDelete, loading }) => (
  <div className="p-4 last:border-none rounded-lg mb-4 shadow-xl bg-white flex flex-col sm:flex-row justify-between max-sm:text-xs">
    <div className="text-slate-700 space-y-2">
      <p><span className="font-medium text-slate-900">Name:</span> {session.name}</p>
      <p>
        <span className="font-medium text-slate-900">Phone:</span>
        <a href={`tel:${session.phoneNo}`} className="text-blue-500 hover:underline"> {session.phoneNo}</a>
      </p>
      <p><span className="font-medium text-slate-900">Preferred Date & Time:</span> {converToJustDate(session.preferredTime)}</p>
      <p><span className="font-medium text-slate-900">Submission Time:</span> {converDate(session.$createdAt)}</p>
    </div>
    <div className="flex flex-col items-center gap-4 mt-3 text-xs">
      <div className="flex gap-2">
        <button
          onClick={onSendMessage}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition duration-200 active:scale-95 cursor-pointer"
        >
          <MessageCircle size={18} /> WhatsApp
        </button>
        <span className="text-sm bg-slate-200 text-slate-700 px-3 py-2 rounded">Sent: {session.messageCount} times</span>
      </div>
      <button
        disabled={loading}
        onClick={onDelete}
        className="flex items-center gap-2 bg-red-700 text-white px-4 py-2 rounded-md font-medium hover:bg-red-800 transition duration-200 active:scale-95 w-full cursor-pointer"
      >
        {loading ? <Loader2 className="w-4 animate-spin" /> : <CheckCircle />} Mark as Completed
      </button>
    </div>
  </div>
);

const PaginationControls = ({ page, setPage, hasNextPage }) => (
  <div className="mt-10 flex justify-between items-center text-sm w-full">
    <button
      className="flex items-center px-3 py-1 bg-slate-700 text-slate-100 rounded-full cursor-pointer disabled:opacity-50"
      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
      disabled={page === 1}
    >
      <ChevronLeft /> Previous
    </button>
    <span className="px-3 py-1 border border-slate-700 rounded-full">Page {page}</span>
    <button
      className="flex items-center px-3 py-1 bg-slate-700 text-slate-100 rounded-full cursor-pointer disabled:opacity-50"
      onClick={() => setPage((prev) => prev + 1)}
      disabled={!hasNextPage}
    >
      Next <ChevronRight />
    </button>
  </div>
);

export default FreeSession;
