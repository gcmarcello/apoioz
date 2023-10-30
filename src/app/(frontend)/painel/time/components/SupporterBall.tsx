import clsx from "clsx";

export default function SupporterBall({ level }: { level: number }) {
  const referralColor = (level: number) => {
    switch (level) {
      case 4:
        return { circle: "bg-yellow-500", shadow: "bg-yellow-500/20" };
      case 3:
        return { circle: "bg-emerald-500", shadow: "bg-emerald-500/20" };
      case 2:
        return { circle: "bg-blue-500", shadow: "bg-blue-500/20" };
      case 1:
        return { circle: "bg-red-500", shadow: "bg-red-500/20" };

      default:
        return { circle: "bg-gray-500", shadow: "bg-gray-500/20" };
    }
  };

  return (
    <div className={clsx("flex-none rounded-full p-1", referralColor(level).shadow)}>
      <div
        className={clsx("h-1.5 w-1.5 rounded-full", referralColor(level).circle)}
      ></div>
    </div>
  );
}
