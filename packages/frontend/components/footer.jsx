import ExternalLink from "./externalLink";

export default function Footer() {
  return (
    <footer className="bg-gray-300 shadow-md footer text-md">
      <div className="container p-4 mx-auto">
        <div className="flex flex-col gap-6 sm:flex-row sm:justify-between sm:flex-wrap">
          <section className="flex flex-col gap-2 text-gray-900">
            <h3 className="w-full text-lg font-bold text-gray-700 uppercase">
              Follow me
            </h3>
            <ExternalLink
              href="https://www.linkedin.com/in/technikhil314/"
              className="inline-flex items-center hover:text-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-label="LinkedIn"
                role="img"
                viewBox="0 0 512 512"
                fill="#fff"
                className="inline-block mr-2"
                width="20"
                height="20"
              >
                <rect width="512" height="512" rx="15%" fill="#0077b5" />
                <circle cx="142" cy="138" r="37" />
                <path
                  stroke="#fff"
                  strokeWidth="66"
                  d="M244 194v198M142 194v198"
                />
                <path d="M276 282c0-20 13-40 36-40 24 0 33 18 33 45v105h66V279c0-61-32-89-76-89-34 0-51 19-59 32" />
              </svg>
              <span>LinkedIn</span>
            </ExternalLink>
            <ExternalLink
              href="https://twitter.com/technikhil314"
              className="inline-flex items-center hover:text-gray-600"
            >
              <svg
                height="20"
                width="20"
                className="inline-block mr-2"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Twitter"
                role="img"
                viewBox="0 0 512 512"
              >
                <rect width="512" height="512" rx="15%" fill="#1da1f2" />
                <path
                  fill="#fff"
                  d="M437 152a72 72 0 01-40 12a72 72 0 0032-40a72 72 0 01-45 17a72 72 0 00-122 65a200 200 0 01-145-74a72 72 0 0022 94a72 72 0 01-32-7a72 72 0 0056 69a72 72 0 01-32 1a72 72 0 0067 50a200 200 0 01-105 29a200 200 0 00309-179a200 200 0 0035-37"
                />
              </svg>
              <span>Twitter</span>
            </ExternalLink>
            <ExternalLink
              href="https://github.com/technikhil314"
              className="inline-flex items-center hover:text-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-label="GitHub"
                role="img"
                viewBox="0 0 512 512"
                className="inline-block mr-2"
                width="20"
                height="20"
              >
                <rect width="512" height="512" rx="15%" fill="#1B1817" />
                <path
                  fill="#fff"
                  d="M335 499c14 0 12 17 12 17H165s-2-17 12-17c13 0 16-6 16-12l-1-50c-71 16-86-28-86-28-12-30-28-37-28-37-24-16 1-16 1-16 26 2 40 26 40 26 22 39 59 28 74 22 2-17 9-28 16-35-57-6-116-28-116-126 0-28 10-51 26-69-3-6-11-32 3-67 0 0 21-7 70 26 42-12 86-12 128 0 49-33 70-26 70-26 14 35 6 61 3 67 16 18 26 41 26 69 0 98-60 120-117 126 10 8 18 24 18 48l-1 70c0 6 3 12 16 12z"
                />
              </svg>
              <span>Github</span>
            </ExternalLink>
            <ExternalLink
              href="https://stackoverflow.com/users/2503826/nikhil-mehta"
              className="inline-flex items-center hover:text-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Stack Overflow"
                role="img"
                viewBox="0 0 512 512"
                className="inline-block mr-2"
                width="20"
                height="20"
              >
                <rect width="512" height="512" rx="15%" fill="#f58025" />
                <path
                  stroke="#fff"
                  strokeWidth="30"
                  fill="none"
                  d="M293 89l90 120zm-53 50l115 97zm-41 65l136 64zm-23 69l148 31zm-6 68h150zm-45-44v105h241V297"
                />
              </svg>
              <span>StackOverflow</span>
            </ExternalLink>
          </section>
          <section className="flex flex-col gap-2">
            <h3 className="w-full text-lg font-bold text-gray-700 uppercase">
              My work
            </h3>
            <span>
              <ExternalLink
                href="https://technikhil314.netlify.app/daterangepicker"
                className="hover:text-gray-600"
              >
                Angular Date time range picker
              </ExternalLink>
            </span>
            <span>
              <ExternalLink
                href="https://technikhil314.netlify.app/carousel"
                className="hover:text-gray-600"
              >
                Carousel web component
              </ExternalLink>
            </span>
            <span>
              <ExternalLink
                href="https://technikhil314.netlify.app/autobadger"
                className="hover:text-gray-600"
              >
                Git auto badger
              </ExternalLink>
            </span>
          </section>
          <section className="flex flex-col gap-2">
            <h3 className="w-full text-lg font-bold text-gray-700 uppercase">
              About me
            </h3>
            <span>
              <ExternalLink
                href="https://technikhil314.netlify.app/"
                className="hover:text-gray-600"
              >
                My portfolio
              </ExternalLink>
            </span>
            <span>
              <ExternalLink
                href="https://technikhil314.netlify.app/about"
                className="hover:text-gray-600"
              >
                More about me
              </ExternalLink>
            </span>
            <span>
              <ExternalLink
                href="https://technikhil314.netlify.app/blog"
                className="hover:text-gray-600"
              >
                My Blog
              </ExternalLink>
            </span>
          </section>
          <section className="flex flex-col gap-2">
            <h3 className="w-full text-lg font-bold text-gray-700 uppercase">
              Sponsor my projects
            </h3>
            <span>
              <ExternalLink
                href="https://www.buymeacoffee.com/technikhil314"
                className="hover:text-gray-600"
              >
                Buy me a coffee
              </ExternalLink>
            </span>
            <span>
              <ExternalLink
                href="https://www.paypal.com/paypalme/technikhil314"
                className="hover:text-gray-600"
              >
                Paypal
              </ExternalLink>
            </span>
          </section>
        </div>
      </div>
      <section className="py-4 mt-2 bg-gray-50">
        <div className="container mx-auto text-center">
          Made with ❤️ using Next.js and Tailwind by{" "}
          <ExternalLink
            href="https://technikhil314.netlify.app/"
            className="underline"
          >
            Nikhil Mehta
          </ExternalLink>
        </div>
      </section>
    </footer>
  );
}
