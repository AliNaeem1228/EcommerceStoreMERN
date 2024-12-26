function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminDetails({ email, dateJoined, name }) {
  return (
    <div className="flex items-center">
      <div>
        <div className="flex items-center">
          <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
            Good morning, {name}
          </h1>
        </div>
        <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
          <dd className="flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6">
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              ></path>
            </svg>
            Role: Admin
          </dd>
          <dd className="mt-3 flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6 sm:mt-0">
            <svg
              className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            Date Joined: {dateJoined}
          </dd>
          <dd className="mt-3 flex items-center text-sm font-medium  text-gray-500 sm:mr-6 sm:mt-0">
            <svg
              className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              ></path>
            </svg>
            {email}
          </dd>
        </dl>
      </div>
    </div>
  );
}
