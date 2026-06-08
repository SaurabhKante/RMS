import React from "react";
import { menuItems, filterItems, bottomItems } from "../data/sidebarData";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-[250px] h-screen bg-white border-r border-gray-200 flex flex-col px-4 py-6">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-teal-900">Hotelix RMS</h1>

        <p className="text-gray-500 text-sm mt-1">Main Branch</p>
      </div>

      {/* Main Menu */}
      <nav className="space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <NavLink
            key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-4 font-bold text-teal-900 rounded-xl
    ${
      isActive
        ? "bg-blue-50 text-teal-900 font-semibold"
        : "text-gray-600 hover:bg-teal-50"
    }`
              }
            >
              <Icon size={20} />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Divider */}
      {/* <div className="border-t border-gray-200 mt-8 pt-8">
        <h4 className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-4">
          Filter Tables
        </h4>

        <div className="space-y-2">
          {filterItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <button
                key={index}
                className={`w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all
                
                ${
                  item.active
                    ? "bg-teal-50 text-teal-900"
                    : "hover:bg-gray-100 text-gray-600"
                }
                `}
              >
                <div className="flex items-center gap-4">
                  <Icon size={20} />

                  <span>{item.title}</span>
                </div>

                <span
                  className={`px-2.5 py-0.5 text-xs rounded-full text-white ${item.badgeColor}`}
                >
                  {item.count}
                </span>
              </button>
            );
          })}
        </div>
      </div> */}

      {/* Bottom Menu */}
      {/* <div className="mt-auto border-t border-gray-200 pt-4 space-y-2">

        {bottomItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <button
              key={index}
              className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
            >
              <Icon size={20} />

              <span>{item.title}</span>
            </button>
          );
        })}
      </div> */}
    </aside>
  );
};

export default Sidebar;