import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Layout } from "antd";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import dynamic from "next/dynamic";
import { GooglePickerProvider } from "@/components/GooglePickerProvider";
import { SessionProvider } from "next-auth/react";

const PdfjsProvider = dynamic(
	() => import("@/components/PdfjsProvider").then((v) => v.PdfjsProvider),
	{ ssr: false },
);

export const metadata: Metadata = {
	title: "ImageSlide Converter",
	description: "convert pdf/images to textzip",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html lang="ja">
			<body>
				<AntdRegistry>
					<ThemeProvider>
						<SessionProvider>
							<Layout className={"!min-h-screen h-screen"}>
								<Header />
								{children}
								<Footer />
							</Layout>
						</SessionProvider>
					</ThemeProvider>
					<PdfjsProvider />
					<GooglePickerProvider />
				</AntdRegistry>
			</body>
		</html>
	);
}
