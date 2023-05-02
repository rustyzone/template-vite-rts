import React, { useEffect, useState } from "react";
import Browser from "webextension-polyfill";

// check env var and either vuse the dev or prod url
const appUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://mysite.com";

const App = (): JSX.Element => {
  const [granted, setGranted] = useState(false);
  useEffect(() => {
    (async () => {
      // check if host permissions are enabled
      const resp = await Browser.permissions.contains({
        origins: ["http://localhost:3000/*"],
      });
      setGranted(resp);
    })();
  }, []);

  return (
    <div className="flex flex-1 min-h-screen items-start justify-center bg-[#12141d]">
      <div className=" max-w-2xl my-6 rounded-md shadow-lg w-full px-4 py-6 justify-center items-center bg-white bg-opacity-5 text-[#f1f1f1]">
        <h1 className="text-2xl text-gray-400 font-black">Welcome! 👋</h1>

        {!granted && (
          <>
            <p className="py-4 text-gray-300 text-lg">
              Please click below to enable host permission to begin, without
              this the extension cannot run.
            </p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={async () => {
                const resp = await Browser.permissions.request({
                  origins: ["http://localhost:3000/*"],
                });

                setGranted(resp);
              }}
            >
              Enable Host Permissions
            </button>
          </>
        )}

        {granted && (
          <div>
            <p className="py-4 text-gray-400 text-lg">
              Almost ready, click below to continue & login.
            </p>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                // change url of the current tab to the app url
                chrome.tabs.update({ url: `${appUrl}/extension-install` });
              }}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
