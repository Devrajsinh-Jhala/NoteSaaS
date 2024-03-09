import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";
export default function SuccessPage() {
  return (
    <section className="w-full z-10 min-h-[80vh] flex items-center justify-center">
      <Card className="w-[400px]">
        <div className="p-6">
          <div className="w-full flex justify-center">
            <Check className="w-12 h-12 rounded-full bg-green-500/30 text-green-500 p-2" />
          </div>

          <div className="mt-3 text-center sm:mt-5 w-full">
            <h3 className="text-lg leading-6 font-medium">Payment Succeed</h3>
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">
                Thank You for trusting us, we won&apos;t let you down
              </p>
            </div>
            <div className="mt-5 sm:mt-6 w-full">
              <Button className="w-full" asChild>
                <Link href={"/"}>
                  <p>Go back to the Dashboard</p>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
