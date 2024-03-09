import { DashboardNav } from "@/components/DashboardNav";
import { ReactNode } from "react";
import prisma from "../lib/db";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { stripe } from "../lib/stripe";
import { unstable_noStore as noStore } from "next/cache";

async function getData({
  email,
  id,
  firstName,
  lastName,
  profileImage,
}: {
  email: string;
  id: string;
  firstName: string | undefined | null;
  lastName: string | undefined | null;
  profileImage: string | undefined | null;
}) {
  noStore();
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      stripeCustomerId: true,
    },
  });

  if (!user) {
    const name = `${firstName ?? ""} ${lastName ?? ""}`;
    await prisma.user.create({
      data: {
        id: id,
        email: email,
        name: name,
      },
    });
  }

  if (!user?.stripeCustomerId) {
    const data = await stripe.customers.create({
      email: email,
    });
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        stripeCustomerId: data.id,
      },
    });
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await currentUser();
  if (!user) {
    return redirect("/");
  }
  await getData({
    email: user.emailAddresses[0].emailAddress as string,
    firstName: user.firstName,
    lastName: user.lastName,
    id: user.id,
    profileImage: user.imageUrl,
  });
  return (
    <section className="flex flex-col space-y-6 mt-10">
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardNav />
        </aside>
        <main>{children}</main>
      </div>
    </section>
  );
}
