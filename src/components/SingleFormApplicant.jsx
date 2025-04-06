import { useContext, useState } from "react";
import { Mail, MessageCircle, ChevronDown, ChevronUp, Phone, Clock } from "lucide-react";
import { converDate, getStartEndDate } from "../utils/ConverDate";
import dbService from "../appwrite/data";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";



const SingleFormApplicant = ({ applicant, filter }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { startDate, endDate } = getStartEndDate(filter)
  const { getForms } = useContext(AppContext);

  const sendWhatsAppMessage = async ({ $id, messageCount, name, phoneNo }) => {
    try {
      const whatsappUrl = `https://wa.me/${phoneNo}?text=Hello%20${encodeURIComponent(
        name
      )},%20regarding%20your%20fitness%20plan...`;
      window.open(whatsappUrl, "_blank");
      await dbService.updateForm({ id: $id, messageCount: messageCount + 1 })
      await getForms({ startDate, endDate })
    } catch (error) {
      console.log(error);
      toast.error("Error opening whatsApp")
    }
  };

  const sendEmail = async ({ $id, emailCount, email, name }) => {
    try {
      const mailtoUrl = `mailto:${email}?subject=Fitness Plan Inquiry&body=Hello ${name}, I wanted to discuss your chosen plan...`;
      window.location.href = mailtoUrl;
      await dbService.updateForm({ id: $id, emailCount: emailCount + 1 });
      await getForms({ startDate, endDate })
    } catch (error) {
      console.log(error);
      toast.error("Error opening email")
    }
  };

  return (
    <div className="bg-white p-4 shadow-lg shadow-slate-400 flex flex-col sm:flex-row justify-between rounded-lg">
      {/* Collapsed View */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <p className="font-medium text-slate-900">{applicant.applicantName}</p>
          <p className="text-slate-700 text-sm flex items-center gap-1">
            <Phone size={16} className="text-slate-500" />
            <a href={`tel:${applicant.phoneNo}`} className="text-blue-500 hover:underline">
              {applicant.phoneNo}
            </a>
          </p>
          <p className="text-slate-700 text-sm flex items-center gap-1">
          <Clock size={16} className="text-slate-500" />
            {converDate(applicant.$createdAt)}
          </p>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-600 hover:text-slate-900 transition"
          >
            {isExpanded ? <ChevronUp className="w-6 cursor-pointer" /> : <ChevronDown className="w-6 cursor-pointer" />}
          </button>
          {/* Expanded View */}
          {isExpanded && (
            <div className="p-3 transition-all text-sm space-y-2">
              <p><span className="font-medium text-slate-900">Email:</span> {applicant.email}</p>
              <p><span className="font-medium text-slate-900">Goal:</span> {applicant.applicantGoal}</p>
              <p><span className="font-medium text-slate-900">Gender:</span> {applicant.applicantGender}</p>
              <p><span className="font-medium text-slate-900">Agreed to Continue:</span> {applicant.agreedToContinue ? "Yes" : "No"}</p>
              <p><span className="font-medium text-slate-900">Age:</span> {applicant.applicantAge} years</p>
              <p><span className="font-medium text-slate-900">Weight:</span> {applicant.weight} kg</p>
              <p><span className="font-medium text-slate-900">Height:</span> {applicant.height} cm</p>
              <p><span className="font-medium text-slate-900">Plan Chosen:</span> {applicant.planChoosen}</p>
              <p><span className="font-medium text-slate-900">Gym Name:</span> {applicant.gymName}</p>
            </div>
          )}
        </div>


      </div>



      {/* Buttons */}
      <div className="flex flex-col gap-3 mt-3 text-xs">
        <div className="flex gap-2 items-center">
          <button
            onClick={() => sendWhatsAppMessage(applicant)}
            className="cursor-pointer w-36 flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition duration-200 active:scale-95"
          >
            <MessageCircle size={18} /> WhatsApp
          </button>
          <span className="bg-slate-200 text-slate-700 px-3 py-2 rounded">
            {applicant.messageCount} Sent
          </span>
        </div>

        <div className="flex gap-2 items-center">
          <button
            onClick={() => sendEmail(applicant)}
            className="cursor-pointer w-36 flex items-center gap-2 bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-700 transition duration-200 active:scale-95"
          >
            <Mail size={18} /> Email
          </button>
          <span className="bg-slate-200 text-slate-700 px-3 py-2 rounded">
            {applicant.emailCount} Sent
          </span>
        </div>
      </div>
    </div>
  );
};

export default SingleFormApplicant;




// setMessageCounts((prev) => ({ ...prev, [phone]: (prev[phone] || 0) + 1 }));