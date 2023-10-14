import LoginForm from "../components/form";

export default async function LoginPage() {
  return (
    <div className="flex bg-gray-900 min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Faça login no ApoioZ
        </h2>
      </div>
      <LoginForm />

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <p className="mt-10 text-center text-sm text-gray-400">
          Not a member?{" "}
          <a
            href="#"
            className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300"
          >
            Start a 14 day free trial
          </a>
        </p>
      </div>
    </div>
  );
}
