export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 place-items-center min-h-screen w-full">{children}</div>
  );
}
