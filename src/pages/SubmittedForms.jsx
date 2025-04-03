import { useContext, useEffect, useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, Loader2  } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { SingleFormApplicant } from "../components";
import { getStartEndDate } from "../utils/ConverDate";
import conf from "../conf/conf";


const ApplicantDetails = () => {
  const [loader, setLoader] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("thisMonth");
  const limit = conf.appwriteQueryLimit;

  const { forms, getForms, setDateFilter } = useContext(AppContext);

  useEffect(() => {
    setLoader(true)
    const { startDate, endDate } = getStartEndDate(filter);
    getForms({page, limit, startDate, endDate}).finally(() => setLoader(false));
  }, [page, filter]);

  // Memoize sorted and filtered applicants
  const filteredApplicants = useMemo(() => {
    return [...forms]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .filter((user) =>
        user.applicantName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
  }, [forms, search]);



  return (
    <div className="p-3 sm:p-6 bg-slate-100 min-h-screen flex flex-col items-center">
      <h2 className="text-2xl font-semibold text-slate-800 mb-2">Submitted Forms</h2>

      <div className="relative w-full sm:w-1/3 mb-6 flex flex-col sm:flex-row gap-2 items-center">
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
      <div className="w-full max-w-3xl space-y-6 min-h-[50vh]">
        {filteredApplicants.length > 0 ? (
          filteredApplicants.map((applicant) => (
            <SingleFormApplicant
              key={applicant.$id} // Use unique `id` instead of `idx`
              applicant={applicant}
              filter={filter}
            />
          ))
        ) : (
          <p className="text-slate-500 text-center">No applicants found.</p>
        )}
      </div>

      {/* Pagination Controls */}
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
          disabled={forms.length < limit}
        >
          Next <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default ApplicantDetails;
