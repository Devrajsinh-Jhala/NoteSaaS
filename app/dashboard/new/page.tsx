import { SubmitButton } from "@/components/SubmitButtonComponents";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import prisma from "@/app/lib/db";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
export default async function NewNote() {
  noStore();
  const user = await currentUser();

  async function postData(formData: FormData) {
    "use server";

    if (!user) {
      throw new Error("Not Authorized");
    }
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    await prisma.note.create({
      data: {
        userId: user?.id,
        description: description,
        title: title,
      },
    });

    return redirect("/dashboard");
  }
  return (
    <Card>
      <form action={postData}>
        <CardHeader>
          <CardTitle>New Note</CardTitle>
          <CardDescription>
            Right here you can now create your new notes
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-5">
          <div className="gap-y-2 flex flex-col">
            <Label>Title</Label>
            <Input
              required
              type="text"
              name="title"
              placeholder="Title of your note"
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <Label>Description</Label>
            <Textarea
              name="description"
              placeholder="Write your mind down..."
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <SubmitButton />
          <Button variant={"secondary"} asChild>
            <Link href={"/dashboard"}>Cancel</Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
