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
import { revalidatePath } from "next/cache";
import { unstable_noStore as noStore } from "next/cache";

async function getData({ userId, noteId }: { userId: string; noteId: string }) {
  const data = await prisma.note.findUnique({
    where: {
      id: noteId,
      userId: userId,
    },
    select: {
      title: true,
      description: true,
      id: true,
    },
  });
  return data;
}

export default async function Note({ params }: { params: { id: string } }) {
  noStore();
  const user = await currentUser();
  const data = await getData({
    userId: user?.id as string,
    noteId: params.id as string,
  });

  async function postData(formData: FormData) {
    "use server";
    if (!user) {
      throw new Error("Not Authorized");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    await prisma.note.update({
      where: {
        id: data?.id,
        userId: user?.id,
      },
      data: {
        description: description,
        title: title,
      },
    });
    revalidatePath("/dashboard");
    redirect("/dashboard");
  }

  return (
    <Card>
      <form action={postData}>
        <CardHeader>
          <CardTitle>Edit Note</CardTitle>
          <CardDescription>
            Right here you can now edit your notes
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
              defaultValue={data?.title}
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <Label>Description</Label>
            <Textarea
              name="description"
              placeholder="Write your mind down..."
              required
              defaultValue={data?.description}
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
