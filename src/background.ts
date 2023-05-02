import { createClient } from "@supabase/supabase-js";
import localforage from "localforage";

// only emit console.log if in dev mode
const dev = process.env.NODE_ENV === "development";
const clog = (...args: any[]) => {
  if (dev) {
    console.debug(...args);
  }
};

try {
  const supapaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  const supabase = createClient(supapaseUrl, supabaseKey, {
    global: { fetch: fetch.bind(globalThis) },
    auth: {
      // @ts-ignore
      storage: localforage,
      persistSession: true,
    },
  });

  localforage.config({
    name: "supabase",
    storeName: "auth",
  });

  // singleton to check if user is logged in
  class User {
    private static instance: User;
    private _isLoggedIn: boolean = false;
    private _user: any = null;

    private constructor() {
      clog("user constructor");
      this.checkLogin();
    }

    static getInstance() {
      if (!User.instance) {
        User.instance = new User();
      }
      return User.instance;
    }

    // check if user is logged in supabase
    async checkLogin() {
      const { data: authListener } = await supabase.auth.onAuthStateChange(
        async (event, session) => {
          clog("event", event, session);
          if (event === "SIGNED_IN") {
            this._isLoggedIn = true;
            this._user = session?.user;
          } else {
            this._isLoggedIn = false;
            this._user = null;
          }
        }
      );
      clog("auth listener", authListener);
    }

    get isLoggedIn() {
      return this._isLoggedIn;
    }

    get user() {
      return this._user;
    }

    async login(a: string, r: string) {
      if (this._isLoggedIn) {
        clog("already logged in");
        return;
      }
      clog("attempt -login", a, r);
      const { error, data } = await supabase.auth.setSession({
        refresh_token: r,
        access_token: a,
      });

      clog("user", data, error);
    }

    async logout() {
      const { error } = await supabase.auth.signOut();
      if (error) {
        clog("error", error);
      }

      this._isLoggedIn = false;
      this._user = null;
    }
  }

  const user = User.getInstance();
  clog("user", user);

  chrome.runtime.onInstalled.addListener(async (details) => {
    // check if reason is install
    clog("reason", details);
    switch (details.reason) {
      case "install":
        const onboardingUrl = chrome.runtime.getURL(
          "src/pages/onboarding/index.html"
        );
        chrome.tabs.create({ url: onboardingUrl });
        break;
      case "update":
        break;
    }
  });

  const onMessageListener = async (
    message: any,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ): Promise<any> => {
    // switch case
    switch (message.type) {
      case "insert-data":
        // await supabase user
        const session = await supabase.auth.getSession();
        const userSess = session.data.session?.user;
        const userId = userSess?.id;
        clog("about to upload", userId, message?.payload, supabase);

        const type = message?.form_type || "unknown";

        const { data, error } = await supabase
          .from("form-data")
          .upsert(
            [
              {
                user_id: userId,
                data: message?.payload || {},
                updated_at: new Date(),
                form_type: type,
              },
            ],
            {
              onConflict: "user_id,form_type",
            }
          )
          .select("*");

        clog("data", data, error);
        break;
      //TODO - log in user from onboarding page or popup - also have a new tab page with login template
      case "app-auth":
        // send message to background
        clog("app auth", message);

        // Useful for passing auth from web app to extension
        User.getInstance().login(message?.payload?.a, message?.payload?.r);
        break;
    }
    return true;
  };

  if (!chrome.runtime.onMessage.hasListeners()) {
    const messageCallback = (
      message: any,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: any) => void
    ) => onMessageListener(message, sender, sendResponse);

    chrome.runtime.onMessage.addListener(messageCallback);
  }
} catch (e) {
  clog("error", e);
}
