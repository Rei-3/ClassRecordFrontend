"use client";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { toggleSidebar } from "@/store/themeConfigSlice";
import AnimateHeight from "react-animate-height";
import { IRootState } from "@/store";
import { useState, useEffect } from "react";
import IconCaretsDown from "@/components/icon/icon-carets-down";

import IconCaretDown from "@/components/icon/icon-caret-down";
import IconMinus from "@/components/icon/icon-minus";

import IconMenuTodo from "@/components/icon/menu/icon-menu-todo";
import IconMenuNotes from "@/components/icon/menu/icon-menu-notes";
import IconMenuScrumboard from "@/components/icon/menu/icon-menu-scrumboard";
import IconMenuContacts from "@/components/icon/menu/icon-menu-contacts";
import IconMenuInvoice from "@/components/icon/menu/icon-menu-invoice";
import IconMenuCalendar from "@/components/icon/menu/icon-menu-calendar";
import { usePathname } from "next/navigation";
import IconInfoCircle from "../icon/icon-info-circle";
import { getAuthToken, getRole } from "@/lib/utils/authUtil";
import IconMenuDashboard from "../icon/menu/icon-menu-dashboard";

const Sidebar = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [currentMenu, setCurrentMenu] = useState<string>("");
  const [errorSubMenu, setErrorSubMenu] = useState(false);
  const themeConfig = useSelector((state: IRootState) => state.themeConfig);
  const semidark = useSelector(
    (state: IRootState) => state.themeConfig.semidark
  );
  const toggleMenu = (value: string) => {
    setCurrentMenu((oldValue) => {
      return oldValue === value ? "" : value;
    });
  };
  const token = getAuthToken();
  const role = getRole(token ?? "");

  useEffect(() => {
    const selector = document.querySelector(
      '.sidebar ul a[href="' + window.location.pathname + '"]'
    );
    if (selector) {
      selector.classList.add("active");
      const ul: any = selector.closest("ul.sub-menu");
      if (ul) {
        let ele: any =
          ul.closest("li.menu").querySelectorAll(".nav-link") || [];
        if (ele.length) {
          ele = ele[0];
          setTimeout(() => {
            ele.click();
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    setActiveRoute();
    if (window.innerWidth < 1024 && themeConfig.sidebar) {
      dispatch(toggleSidebar());
    }
  }, [pathname]);

  const setActiveRoute = () => {
    let allLinks = document.querySelectorAll(".sidebar ul a.active");
    for (let i = 0; i < allLinks.length; i++) {
      const element = allLinks[i];
      element?.classList.remove("active");
    }
    const selector = document.querySelector(
      '.sidebar ul a[href="' + window.location.pathname + '"]'
    );
    selector?.classList.add("active");
  };

  return (
    <div className={semidark ? "dark" : ""}>
      <nav
        className={`sidebar fixed bottom-0 top-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${
          semidark ? "text-white-dark" : ""
        }`}
      >
        <div className="h-full bg-white dark:bg-black">
          <div className="flex items-center justify-between px-4 py-3">
            <Link
              href={
                role === "admin"
                  ? "/admin"
                  : role === "teacher"
                  ? "/teaching-loads"
                  : "/unathorized"
              }
              className="main-logo flex shrink-0 items-center"
            >
              <img
                className="ml-[5px] w-8 flex-none"
                src="/assets/images/logo.svg"
                alt="logo"
              />
              <span className="align-middle text-2xl font-semibold dark:text-white-light lg:inline ltr:ml-1.5 rtl:mr-1.5">
                RECORD
              </span>
            </Link>

            <button
              type="button"
              className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 dark:text-white-light dark:hover:bg-dark-light/10 rtl:rotate-180"
              onClick={() => dispatch(toggleSidebar())}
            >
              <IconCaretsDown className="m-auto rotate-90" />
            </button>
          </div>
          <PerfectScrollbar className="relative h-[calc(100vh-80px)]">
            <ul className="relative space-y-0.5 p-4 py-0 font-semibold">
              <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 px-7 py-3 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                <IconMinus className="hidden h-5 w-4 flex-none" />
                <span>{"apps"}</span>
              </h2>

              <li className="nav-item">
                <ul>
                  {/* <li className="nav-item">
                                        <Link href="/apps/chat" className="group">
                                            <div className="flex items-center">
                                                <IconMenuChat className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{('chat')}</span>
                                            </div>
                                        </Link>
                                    </li> */}
                  {/* <li className="nav-item">
                                        <Link href="/apps/mailbox" className="group">
                                            <div className="flex items-center">
                                                <IconMenuMailbox className="shrink-0 group-hover:!text-primary" />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{('mailbox')}</span>
                                            </div>
                                        </Link>
                                    </li> */}
{role === "teacher" && (
                  <li className="menu nav-item">
                    <button
                      type="button"
                      className={`${
                        currentMenu === "Teaching Loads" ? "active" : ""
                      } nav-link group w-full`}
                      onClick={() => toggleMenu("Teaching Loads")}
                    >
                      <div className="flex items-center">
                        <IconMenuTodo className="shrink-0 group-hover:!text-primary" />
                        <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">
                          {"Teaching Loads"}
                        </span>
                      </div>

                      <div
                        className={
                          currentMenu !== "Teaching Loads"
                            ? "-rotate-90 rtl:rotate-90"
                            : ""
                        }
                      >
                        <IconCaretDown />
                      </div>
                    </button>
                    
                      <AnimateHeight
                        duration={300}
                        height={currentMenu === "Teaching Loads" ? "auto" : 0}
                      >
                        <ul className="sub-menu text-gray-500">
                          <li>
                            <Link href="/teaching-loads">
                              {"View Subjects"}
                            </Link>
                          </li>
                          <li>
                            <Link href="/teaching-loads/add-teaching-load">
                              {"Add Subjects"}
                            </Link>
                          </li>
                        </ul>
                      </AnimateHeight>
                   

                  </li>
                   )}

                  {role === "admin" && (
                    <li className="menu nav-item">
                      <button
                        type="button"
                        className={`${
                          currentMenu === "dashboard" ? "active" : ""
                        } nav-link group w-full`}
                        onClick={() => toggleMenu("dashboard")}
                      >
                        <div className="flex items-center">
                          <IconMenuDashboard className="shrink-0 group-hover:!text-primary" />
                          <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">
                            {"dashboard"}
                          </span>
                        </div>

                        <div
                          className={
                            currentMenu !== "dashboard"
                              ? "-rotate-90 rtl:rotate-90"
                              : ""
                          }
                        >
                          <IconCaretDown />
                        </div>
                      </button>

                      <AnimateHeight
                        duration={300}
                        height={currentMenu === "dashboard" ? "auto" : 0}
                      >
                        <ul className="sub-menu text-gray-500">
                        <li>
                            <Link href="/admin">
                              {"Home Dashboard"}
                            </Link>
                          </li>
                          <li>
                            <Link href="/admin/all-teaching-loads/">
                              {"View all teaching loads"}
                            </Link>
                          </li>
                        </ul>
                        <ul className="sub-menu text-gray-500">
                          <li>
                            <Link href="/admin/users">{"View all users"}</Link>
                          </li>
                          {/* <li>
                            <Link href="/admin/roles">{"roles"}</Link>
                          </li> */}
                          <li>
                            <Link href="/admin/courses">{"View all courses"}</Link>
                          </li>
                          <li>
                            <Link href="/admin/subjects">{"View all subjects"}</Link>
                          </li>
                        </ul>
                      </AnimateHeight>
                    </li>
                  )}

                  {/* <li className="nav-item">
                    <Link href="/app/contacts" className="group">
                      <div className="flex items-center">
                        <IconMenuContacts className="shrink-0 group-hover:!text-primary" />
                        <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">
                          {"contacts"}
                        </span>
                      </div>
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link href="/app/scrumboard" className="group">
                      <div className="flex items-center">
                        <IconInfoCircle className="shrink-0 group-hover:!text-primary" />
                        <span className="text-black dark:text-[#506690] dark:group-hover:text-white-dark ltr:pl-3 rtl:pr-3">
                          {"About Us"}
                        </span>
                      </div>
                    </Link>
                  </li> */}
                </ul>
              </li>
            </ul>
          </PerfectScrollbar>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
