import { NavLink, Outlet } from "react-router-dom";

export default function Dashboard() {
  const sections = [
    { id: "donate", name: "Donate", path: "/dashboard/donate" },
    { id: "addrec", name: "Add Receiver", path: "/dashboard/addrec" },
    { id: "current-donation", name: "Live Donation", path: "/dashboard/current-donation" },
    { id: "past-donations", name: "Past Donations", path: "/dashboard/past-donations" },
    { id: "rewards", name: "Rewards", path: "/dashboard/rewards" },
  //  { id: "analytics", name: "Analytics", path: "/dashboard/analytics" },

  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-72 bg-purple-400 text-white p-8">
  <h1 className="text-3xl font-extrabold mb-8">Dashboard</h1>
  <ul>
    {sections.map((section) => (
      <li key={section.id} className="p-4 rounded-lg">
        <NavLink
          to={section.path}
          className={({ isActive }) =>
            `block p-3 rounded-lg  font-bold font-2xl transition duration-200 ${
              isActive
                ? "bg-white text-purple-700 font-bold shadow-md"
                : "hover:bg-purple-600 hover:text-white "
            }`
          }
        >
          {section.name}
        </NavLink>
      </li>
    ))}
  </ul>
</div>
      {/* Main Content (Dynamic) */}
      <div className="flex-1 p-6">
        <Outlet /> {/* Active section renders here */}
      </div>
    </div>
  );
}
