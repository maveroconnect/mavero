import {
  FaUser,
  FaBriefcase,
  FaArrowRight,
} from "react-icons/fa";

const MAVERO_APP_URL = "https://app.maveroconnect.com";

export default function AppDownload({
  centered = false,
}) {
  return (
    <div
      className={`flex flex-wrap gap-3 ${
        centered ? "justify-center" : ""
      }`}
    >
      {/* Customer Button */}
      <a
        href={MAVERO_APP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 rounded-xl bg-[#004687] px-5 py-3 text-white transition duration-300 hover:-translate-y-1 hover:bg-blue-900 hover:shadow-xl"
      >
        <FaUser size={20} />

        <div>
          <p className="text-[9px] text-blue-200">
            LOOKING FOR SERVICES?
          </p>

          <p className="text-sm font-bold">
            Join as Customer
          </p>
        </div>

        <FaArrowRight
          size={12}
          className="ml-1 transition-transform duration-300 group-hover:translate-x-1"
        />
      </a>

      {/* Service Provider Button */}
      <a
        href={MAVERO_APP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 rounded-xl border border-[#004687] bg-white px-5 py-3 text-[#004687] transition duration-300 hover:-translate-y-1 hover:bg-blue-50 hover:shadow-xl"
      >
        <FaBriefcase size={21} />

        <div>
          <p className="text-[9px] text-gray-500">
            OFFER YOUR SERVICES?
          </p>

          <p className="text-sm font-bold">
            Join as Provider
          </p>
        </div>

        <FaArrowRight
          size={12}
          className="ml-1 transition-transform duration-300 group-hover:translate-x-1"
        />
      </a>
    </div>
  );
}