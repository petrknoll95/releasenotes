import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import AdminInput from "@/components/admin/form/admin-input";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <form className="flex-1 flex flex-col min-w-64">
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <AdminInput 
          name="email" 
          label="Email" 
          placeholder="you@example.com" 
          required 
        />
        <AdminInput
          type="password"
          name="password"
          label="Password"
          placeholder="Your password"
          required
        />
        <SubmitButton pendingText="Signing In..." formAction={signInAction}>
          Sign in
        </SubmitButton>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
