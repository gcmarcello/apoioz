import { Button } from "@/frontend/panel/(shared)/components/button";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { UseFormReturn } from "react-hook-form";

export default function CheckoutTotal({
  form,
}: {
  form: UseFormReturn<any, any, undefined>;
}) {
  const watchedFields = form.watch();
  const allFieldsFilled = Object.values(watchedFields).every((field) => field);
  return (
    <div className="mt-10 flex items-center justify-between border-t border-gray-200 pt-6">
      <dl className="w-full space-y-6  border-gray-200  sm:px-6 lg:px-0">
        <div className="flex items-center justify-between">
          <dt className="text-sm">Subtotal</dt>
          <dd className="text-sm font-medium text-gray-900">R$4000,00</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-sm">Taxa de Processamento (2,29%)</dt>
          <dd className="text-sm font-medium text-gray-900">
            <span className="text-green-700">R$0,00 </span>
            <span className="line-through">
              R${(4000 * 0.0229).toFixed(2).replace(".", ",")}
            </span>{" "}
          </dd>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
          <dt className="text-base font-medium">
            Total <span className="ms-2">R$4.000,00</span>
          </dt>
          <dd>
            <Button
              type="submit"
              variant="primary"
              disabled={!form.formState.isValid}
            >
              Finalizar Pagamento
            </Button>
          </dd>
        </div>
        <p className="mt-6 flex justify-start text-sm font-medium text-gray-500">
          <LockClosedIcon
            className="mr-1.5 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          Pagamentos processados via banco digital{" "}
          <a
            href="https://asaas.com"
            className="ms-1 underline"
            target="_blank"
          >
            Asaas
          </a>
        </p>
      </dl>
    </div>
  );
}
