import { Button } from "../ui/button";

export default function Box({ children, printCallback }: {
  printCallback?: () => void;
  children: React.ReactNode;
}) {

  return (
    <div className="shadow-md p-2 m-2">
      <Button onClick={printCallback}>Print</Button>
      <div className="mt-2">
        {children}
      </div>
    </div>
  )
}