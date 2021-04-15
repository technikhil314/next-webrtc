import Link from "next/link";
import { useState } from "react";
import { classNames } from "../helpers/classNames";
import { text } from "../utils/constants";
import ExternalLink from "./externalLink";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <p className="fixed right-0 z-50 px-4 py-1 text-center text-white transform rotate-45 bg-gray-900 w-60 ribbon">
        <ExternalLink
          className="text-gray-200 hover:text-gray-300"
          href="https://github.com/technikhil314/next-webrtc"
        >
          Fork me on GitHub
        </ExternalLink>
      </p>
      <nav className="sticky top-0 z-40 w-full text-white bg-gray-800">
        <div className="container h-full px-4 mx-auto">
          <div className="relative flex items-center justify-between h-full">
            <button
              type="button"
              className="inline-flex items-center justify-center text-gray-400 rounded-md md:hidden active:hover:text-white active:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={classNames({
                  "h-6 w-6": true,
                  hidden: isOpen,
                })}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={classNames({
                  "h-6 w-6": true,
                  hidden: !isOpen,
                })}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="flex items-center h-full hover:bg-gray-700 hover:text-white">
              <h1 className="flex items-center flex-shrink-0 px-2 text-xl font-bold text-white text-gray-300 hover:bg-gray-700 hover:text-white">
                <a href="/" className="h-full">
                  <img
                    src="/57x57-no-bg.png"
                    width={30}
                    alt=""
                    className="inline mr-3"
                  />
                  {text.appName}
                </a>
              </h1>
            </div>
            <div
              className={classNames({
                "transition transition-transform ease-in-out duration-300	transform absolute shadow-xl top-full items-center justify-center bg-gray-800 w-full rounded-lg flex flex-col md:translate-y-0 md:ml-8 md:top-auto md:relative md:flex-row md:flex-1 md:items-stretch md:justify-start md:h-full": true,
                "translate-y-0": isOpen,
                "-translate-y-screen": !isOpen,
              })}
            >
              <div className="flex items-center w-full h-full text-gray-300 bg-transparent hover:bg-gray-700 hover:text-white md:w-auto">
                <Link href="/" passHref>
                  <a
                    href="/"
                    className="inline-block mx-auto my-4 font-semibold text-gray-300 bg-transparent text-md hover:bg-gray-700 hover:text-white md:my-0 md:mx-4 focus:bg-gray-700 focus:outline-none focus:shadow-outline"
                  >
                    Record vlog
                  </a>
                </Link>
              </div>
              <div className="flex items-center w-full h-full text-gray-300 bg-transparent hover:bg-gray-700 hover:text-white md:w-auto">
                <Link href="/meeting" passHref>
                  <a
                    href="/meeting"
                    className="inline-block mx-auto my-4 font-semibold text-gray-300 bg-transparent text-md hover:bg-gray-700 hover:text-white md:my-0 md:mx-4 focus:bg-gray-700 focus:outline-none focus:shadow-outline"
                  >
                    Create Meeting
                  </a>
                </Link>
              </div>
            </div>
            <div className="flex items-center h-full">
              <ExternalLink
                className="flex items-center inline-block h-full px-3 text-sm font-semibold text-gray-300 bg-transparent hover:bg-gray-700 hover:text-white focus:bg-gray-700 focus:text-white focus:outline-none focus:shadow-outline"
                href="https://github.com/technikhil314/next-webrtc"
              >
                <svg
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                >
                  <path
                    d="M9.358 2.145a8.209 8.209 0 00-3.716 0c-.706-.433-1.245-.632-1.637-.716a2.17 2.17 0 00-.51-.053 1.258 1.258 0 00-.232.028l-.01.002-.004.002h-.003l.137.481-.137-.48a.5.5 0 00-.32.276 3.12 3.12 0 00-.159 2.101A3.354 3.354 0 002 5.93c0 1.553.458 2.597 1.239 3.268.547.47 1.211.72 1.877.863a2.34 2.34 0 00-.116.958v.598c-.407.085-.689.058-.89-.008-.251-.083-.444-.25-.629-.49a4.798 4.798 0 01-.27-.402l-.057-.093a9.216 9.216 0 00-.224-.354c-.19-.281-.472-.633-.928-.753l-.484-.127-.254.968.484.127c.08.02.184.095.355.346a7.2 7.2 0 01.19.302l.068.11c.094.152.202.32.327.484.253.33.598.663 1.11.832.35.116.748.144 1.202.074V14.5a.5.5 0 00.5.5h4a.5.5 0 00.5-.5v-3.563c0-.315-.014-.604-.103-.873.663-.14 1.322-.39 1.866-.86.78-.676 1.237-1.73 1.237-3.292v-.001a3.354 3.354 0 00-.768-2.125 3.12 3.12 0 00-.159-2.1.5.5 0 00-.319-.277l-.137.48c.137-.48.136-.48.135-.48l-.002-.001-.004-.002-.009-.002a.671.671 0 00-.075-.015 1.261 1.261 0 00-.158-.013 2.172 2.172 0 00-.51.053c-.391.084-.93.283-1.636.716z"
                    fill="white"
                  ></path>
                </svg>
              </ExternalLink>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
