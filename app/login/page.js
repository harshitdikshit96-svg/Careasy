import AuthForm from "./AuthForm";

export default function LoginPage() {
  return (
    <div className="mx-auto grid min-h-[80vh] max-w-md place-items-center px-4 py-12">
      <div className="w-full">
        <div className="mb-2 flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-lg bg-emerald-500 text-lg font-black text-white">
            C
          </span>
          <span className="text-xl font-black text-slate-950">CarEasy</span>
        </div>
        <h1 className="mt-4 text-4xl font-black text-slate-950">Welcome</h1>
        <p className="mb-7 mt-2 text-slate-500">
          Sign in to save cars, compare, and get personalised deals.
        </p>
        <AuthForm />
      </div>
    </div>
  );
}
