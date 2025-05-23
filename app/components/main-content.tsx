export default function MainContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="p-4 h-full">{children}</div>
      </div>
    </div>
  );
}
