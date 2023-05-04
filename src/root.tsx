// @refresh reload
import { Suspense } from "solid-js";
import {
  useLocation,
  A,
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import "./root.css";
import UserProvider from "./components/UserProvider";
import WebProvider from "./components/WebProvider";

export default function Root() {
  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname
      ? "border-sky-600"
      : "border-transparent hover:border-sky-600";
  return (
    <Html lang="en">
      <Head>
        <Title>SolidStart - With TailwindCSS</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body class="bg-[#043441] min-h-screen" >
        <Suspense>
          <ErrorBoundary>
            <WebProvider>
              <UserProvider>
                <nav class="flex justify-end p-4 text-white bg-[#09373f]">
                  <A href="/" class="p-4" activeClass="underline">
                    Home
                  </A>
                  <A
                    href="/govtransactions"
                    class="p-4"
                    activeClass="underline"
                  >
                    Gov Transactions
                  </A>
                  <A href="/donations" class="p-4" activeClass="underline">
                    Donations
                  </A>
                </nav>
                <Routes>
                  <FileRoutes />
                </Routes>
              </UserProvider>
            </WebProvider>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
