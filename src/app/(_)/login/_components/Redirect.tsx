import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export const Redirect = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	useEffect(() => {
		if (searchParams.get("callbackUrl")) {
			void signIn("discord", {
				callbackUrl: searchParams.get("callbackUrl") ?? "/",
			});
		} else if (searchParams.get("error")) {
			router.replace("/");
		}
	}, [searchParams, router]);
	return <></>;
};
