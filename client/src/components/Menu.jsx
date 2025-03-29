import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import AccountIcon from "../assets/account-icon.png";
import BlockIcon from "../assets/blocks-icon.png";
import DashboardIcon from "../assets/dashboard-icon.png";
import PoolIcon from "../assets/pools-icon.png";
import TokenImage from "../assets/token-image.png";
import TransactionImage from "../assets/coins.png";
import MenuIcon from "../assets/menu-icon.png"; // Add an icon for the menu toggle button
import AnalysisIcon from "../assets/analysis.png";

const iconList = [
  { name: "Dashboard", icon: DashboardIcon, link: '/' },
  { name: "Blocks", icon: BlockIcon, link: '/blocks' },
  { name: "Transactions", icon: TransactionImage, link: '/transactions' },
  { name: "Pools", icon: PoolIcon, link: '/pools' },
  { name: "Token", icon: TokenImage, link: '/tokens' },
  { name: "Accounts", icon: AccountIcon, link: '/accounts' },
  { name: "Analysis", icon: AnalysisIcon, link: '/analysis-transactions' },
];

// eslint-disable-next-line react/prop-types
function SmallScreenMenu({ isOpen, toggleMenu }) {
  return (
    <>
      {/* Toggle Button for Smaller Screens */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-secondaryBg rounded-full"
        onClick={toggleMenu}
      >
        <img src={MenuIcon} alt="Menu" className="w-6 h-6" />
      </button>

      {/* Sidebar Menu */}
      <div
        className={`h-screen bg-secondaryBg overflow-y-auto fixed z-50 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
      >
        <ul className="menu p-4 space-y-4 pb-20">
          {iconList.map((icon) => (
            <li key={icon.name}>
              <a className="flex flex-col items-center" href={icon.link}>
                <div className="bg-white rounded-full p-2">
                  <img src={icon.icon} className="w-6" alt={icon.name} />
                </div>
                <p className="text-white mt-1 text-sm">{icon.name}</p>
              </a>
              <hr className="rounded-none" />
            </li>
          ))}
        </ul>
      </div>

      {/* Overlay for mobile to close menu */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={toggleMenu}
        ></div>
      )}
    </>
  );
}

function LargeScreenMenu() {
  return (
    <div className="h-screen bg-secondaryBg overflow-y-auto fixed">
      <ul className="menu pb-20">
        {iconList.map((icon) => (
          <li key={icon.name}>
            <a className="flex flex-col items-center" href={icon.link}>
              <div className="bg-white rounded-full p-2">
                <img src={icon.icon} className="w-6" alt={icon.name} />
              </div>
              <p className="text-white">{icon.name}</p>
            </a>
            <hr className="rounded-none" />
          </li>
        ))}
      </ul>
    </div>
  );
}

function Menu() {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 768px)" });
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {isSmallScreen ? (
        <SmallScreenMenu isOpen={isOpen} toggleMenu={toggleMenu} />
      ) : (
        <LargeScreenMenu />
      )}
    </>
  );
}

export default Menu;
