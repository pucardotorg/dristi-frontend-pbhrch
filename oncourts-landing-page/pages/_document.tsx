import Document, { Html, Head, Main, NextScript } from "next/document";
import { GA_MEASUREMENT_ID } from "../lib/constants";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&family=Raleway:wght@400;700&display=swap"
            rel="stylesheet"
          />
          {/* Google Analytics */}
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `,
            }}
          />
          <script async src={process.env.NEXT_PUBLIC_GLOBAL}></script>
          {process.env.NEXT_PUBLIC_ENV === "local" && (
            <>
              <meta name="robots" content="noindex, nofollow" />
              <meta name="googlebot" content="noindex, nofollow" />
            </>
          )}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
