import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import "../styles/globals.css";
import Head from "next/head";
import { pageview } from "../lib/gtag";
import { QueryClient, QueryClientProvider } from "react-query";
// import { initLibraries } from "../libraries/index"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 15 * 60 * 1000,
      cacheTime: 50 * 60 * 1000,
      retry: false,
      // retryDelay: () => Infinity,
      /*
        enable this to have auto retry incase of failure
        retryDelay: attemptIndex => Math.min(1000 * 3 ** attemptIndex, 60000)
       */
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  useEffect(() => {
    async function fetchData() {
      const lib = await import("../libraries/index");
      await lib.initLibraries(); // only runs on client
    }

    fetchData();
  }, []);

  // ── eSign redirect-back interceptor ──────────────────────────────────────
  // The CDAC eSign portal redirects to /landing?result=SUCCESS&fileStoreId=...
  // after the user completes signing. We intercept that here (in _app so it
  // runs regardless of which page the user lands on), store the result in
  // sessionStorage, and then send the user back to where they came from.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const result = params.get("result");
    const fileStoreId = params.get("filestoreId");

    // Only act when the backend has returned a sign result
    if (!result) return;

    // Persist sign result so checkSignStatus() can read it in any component
    sessionStorage.setItem(
      "isSignSuccess",
      result.toLowerCase() === "success" ? "success" : "failed",
    );
    if (fileStoreId) {
      sessionStorage.setItem("esignFileStoreId", fileStoreId);
    }

    // Read where we should redirect back to
    try {
      const raw = sessionStorage.getItem("eSignWindowObject");
      if (raw) {
        const { path, param } = JSON.parse(raw) as {
          path: string;
          param?: string;
          isEsign?: boolean;
        };
        // Clean up the esign process flag
        sessionStorage.removeItem("esignProcess");
        sessionStorage.removeItem("eSignWindowObject");

        // Redirect back to the original page (keep its own query params)
        const returnUrl = param ? `${path}${param}` : path;
        router.replace(returnUrl);
        return;
      }
    } catch {
      // Malformed JSON — fall through to homepage
    }

    // Fallback: stay on the landing page but strip the esign query params
    router.replace("/landing");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
    </>
  );
}
