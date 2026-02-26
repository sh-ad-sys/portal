"use client";
import Image from 'next/image'
import Link from 'next/link'
import { useState } from "react";
import { useRouter } from "next/navigation";
import "../styles/Header.css";

interface HeaderProps {
  logoName: string;
  schoolName: string;
  userName: string;
  role: string;
  toggleSidebar: () => void;
}

export default function Header({
  logoName,
  schoolName,
  userName,
  role,
  toggleSidebar,
}: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");  
  };

  return (
    <header className="header">
      <div className="header-left">
        {/* Hamburger for toggling sidebar */}
        <button className="hamburger" onClick={toggleSidebar}>
          ☰
        </button>

        {/* Logo */}
        <Image src="/logo2.png" alt="Logo" width={70} height={70} />

        {/* School Name */}
        <div className="school-name">{schoolName}</div>
      </div>

      <div className="header-right">
        <Link href={`/dashboard/${role}/notifications`} className="notification">🔔</Link>

        <div className="user-dropdown">
          <button
            className="user-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Hi, {userName}
          </button>

          {dropdownOpen && (
            <div className="dropdown-menu">
              <Link href={`/dashboard/${role}/profile`} className="dropdown-item">
                👤 Profile
              </Link>
              <button onClick={handleLogout} className="dropdown-item logout">
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}