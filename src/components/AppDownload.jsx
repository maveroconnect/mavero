import {
  FaApple,
  FaGooglePlay,
} from "react-icons/fa";

const GOOGLE_PLAY_URL = "#";
const APP_STORE_URL = "#";

export default function AppDownload({
  centered = false,
}) {
  return (
    <div
      className={`flex flex-wrap gap-3 ${
        centered ? "justify-center" : ""
      }`}
    >
      <a
        href={GOOGLE_PLAY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 rounded-xl bg-[#004687] px-4 py-3 text-white transition duration-300 hover:-translate-y-1 hover:bg-blue-900 hover:shadow-xl"
      >
        <FaGooglePlay size={21} />

        <div>
          <p className="text-[8px] text-blue-200">
            GET IT ON
          </p>

          <p className="text-sm font-bold">
            Google Play
          </p>
        </div>
      </a>

      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 rounded-xl bg-[#004687] px-4 py-3 text-white transition duration-300 hover:-translate-y-1 hover:bg-blue-900 hover:shadow-xl"
      >
        <FaApple size={23} />

        <div>
          <p className="text-[8px] text-blue-200">
            DOWNLOAD ON THE
          </p>

          <p className="text-sm font-bold">
            App Store
          </p>
        </div>
      </a>
    </div>
  );
}