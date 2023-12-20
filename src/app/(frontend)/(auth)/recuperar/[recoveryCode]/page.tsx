import { redirect } from "next/navigation";
import NewPasswordForm from "./components/NewPasswordForm";
import { checkRecoveryCode } from "@/app/api/auth/service";
import { showToast } from "@/app/(frontend)/_shared/components/alerts/toast";

export default async function RecoverPasswordPage({
  params,
}: {
  params: { recoveryCode: string };
}) {
  const { recoveryCode } = params;

  try {
    const checkCode = await checkRecoveryCode(recoveryCode);
    return <NewPasswordForm resetInfo={checkCode} />;
  } catch (error) {
    return redirect("/login?error=invalidRecoveryCode");
  }
}
