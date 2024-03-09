import Link from "next/link";
import { Themetoggle } from "./Themetoggle";
import { Button } from "./ui/button";
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
  currentUser,
} from "@clerk/nextjs";

export async function Navbar() {
  //   const { isAuthenticated } = getKindeServerSession();
  // console.log(currentUser);
  const user = await currentUser();

  return (
    <nav className="border-b bg-background h-[10vh] flex items-center">
      <div className="container flex items-center justify-between">
        <Link href={"/"}>
          <h1 className="font-bold text-3xl">
            Notes<span className="text-primary">SaaS</span>
          </h1>
        </Link>

        <div className="flex items-center gap-x-5">
          <Themetoggle />

          {user ? (
            <div className="flex items-center gap-x-5">
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <div className="flex items-center gap-x-5">
              <SignInButton mode="modal">
                <Button variant={"default"} size={"sm"}>
                  Login
                </Button>
              </SignInButton>

              <SignUpButton>
                <Button variant={"secondary"}>Sign Up</Button>
              </SignUpButton>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
