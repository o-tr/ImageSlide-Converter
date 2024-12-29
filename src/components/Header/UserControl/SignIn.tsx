import { Button } from "antd";
import { signIn } from "next-auth/react";

export const SignIn = () => {
	return (
		<Button onClick={() => signIn("discord", { callbackUrl: "/" })}>
			Sign in / Sign up
		</Button>
	);
};
