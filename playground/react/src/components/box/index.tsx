import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export default function Box({
  children,
  title,
  printCallback,
}: {
  printCallback?: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-black rounded p-2 m-2">
      <div className="flex flex-row justify-between items-center">
        <span>{title}</span>
        <Button onClick={printCallback}>Print</Button>
      </div>
      <Separator className="my-2" />
      <div>{children}</div>
    </div>
  );
}
