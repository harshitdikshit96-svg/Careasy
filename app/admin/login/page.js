import LoginForm from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4 py-12">
      <div className="w-full">
        <p className="text-sm font-black uppercase tracking-widest text-emerald-600">
          Admin
        </p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">Sign in</h1>
        <p className="mb-6 mt-3 text-slate-600">
          Prototype credentials are intentionally simple.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
