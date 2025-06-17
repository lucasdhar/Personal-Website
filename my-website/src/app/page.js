import styles from "./page.module.css";
//import SoftwareDeveloper from "./pages/softwareDeveloper";

export default function Home() {
  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-1/4 bg-gray-100 flex flex-col justify-center items-start px-6 space-y-6">
        <p className="text-lg font-medium cursor-pointer hover:text-blue-600">About Me</p>
        <p className="text-lg font-medium cursor-pointer hover:text-blue-600">Skills</p>
        <p className="text-lg font-medium cursor-pointer hover:text-blue-600">Projects</p>
        <p className="text-lg font-medium cursor-pointer hover:text-blue-600">Contact Me</p>
        <p className="text-lg font-medium cursor-pointer hover:text-blue-600">Resume</p>
      </div>

      {/* Right Main Content */}
      <div className="w-3/4 flex items-center justify-center">
        <div className="text-right">
          <h1 className="text-5xl font-bold text-blue-600 mb-2">
            Hi! I'm Lucas Dhar
          </h1>
          <h2 className="text-xl text-gray-700">
            Welcome to my Software Developer Side
          </h2>
        </div>
      </div>
    </div>
  );
}
