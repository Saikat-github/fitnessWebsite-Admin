import { useContext, useState } from "react";
import { Users, FileText, CalendarCheck, Loader } from "lucide-react";
import { AppContext } from "../context/AppContext";



const Home = () => {
  const [filter, setFilter] = useState("thisMonth");
  const {totalCount, loader, dateFilter} = useContext(AppContext);

  // Stats based on selected filter
  const stats = [
    { title: "Total Registered Users", count: totalCount.totalUsers, icon: <Users size={32} /> },
    { title: "Total Forms Submitted", count: totalCount.totalForms, icon: <FileText size={32} /> },
    { title: "Total Sessions Booked", count: totalCount.totalSessions, icon: <CalendarCheck size={32} /> },
  ];

  if (loader) {
    return <Loader size={30} className='text-slate-700 animate-spin mx-auto my-20'/>
  }

  return (
    <div className="min-h-screen bg-gray-100 px-3 sm:px-6 my-2">
      <div className="flex flex-col justify-center items-center mb-8 gap-2 text-3xl font-bold">
        <h1 className="text-gray-800">Dashboard</h1>
        <p className="flex gap-1 items-center text-lg py-1 px-6 text-blue-600 bg-white shadow-lg shadow-slate-500 rounded-full">
          {dateFilter}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="flex flex-col gap-4 sm:gap-8 items-center">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-4 hover:shadow-lg transition w-full sm:w-1/2">
            <div className="text-blue-500">{stat.icon}</div>
            <div className="">
              <p className="text-xl font-semibold">{stat.count}</p>
              <p className="text-gray-600">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
