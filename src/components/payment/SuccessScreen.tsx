import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface SuccessScreenProps {
  paymentId: string;
  formData: {
    fullName: string;
    contractNumber: string;
    amount: string;
  };
  paymentMethod: "card" | "sbp";
  onNewPayment: () => void;
}

export default function SuccessScreen({
  paymentId,
  formData,
  paymentMethod,
  onNewPayment,
}: SuccessScreenProps) {
  return (
    <div className="py-6 sm:py-8 animate-fade-in">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-green-100 rounded-full mb-4 animate-scale-in">
          <Icon name="CheckCircle" className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent" size={40} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2 px-4">Оплата успешна!</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">Ваш платёж обработан. Спасибо!</p>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 mb-6">
        <div className="text-center mb-4">
          <div className="text-sm text-gray-500 mb-2">ООО "ЭКОРРА ПЛАТЕЖ"</div>
          <div className="text-xs text-gray-400">ИНН: 7743123456 | КПП: 774301001</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-green-50 p-4 rounded-lg mb-4">
          <div className="text-center mb-3">
            <div className="text-xs text-gray-500 mb-1">НОМЕР ПЛАТЕЖА</div>
            <div className="text-lg font-mono font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">{paymentId}</div>
          </div>
          <div className="text-xs text-center text-gray-500">
            {new Date().toLocaleString('ru-RU', { 
              day: '2-digit', 
              month: '2-digit', 
              year: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Плательщик:</span>
            <span className="font-semibold text-right">{formData.fullName}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Номер договора:</span>
            <span className="font-semibold">МД-{formData.contractNumber}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Способ оплаты:</span>
            <span className="font-semibold">{paymentMethod === "card" ? "Банковская карта" : "СБП"}</span>
          </div>
          <div className="flex justify-between py-3 bg-gradient-to-br from-blue-50 to-green-50 px-3 rounded-lg mt-3">
            <span className="text-gray-900 font-semibold">Сумма:</span>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">{parseFloat(formData.amount).toLocaleString('ru-RU')} ₽</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-dashed">
          <div className="flex items-center justify-center gap-2 text-xs">
            <Icon name="CheckCircle" className="text-green-600" size={16} />
            <span className="font-semibold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">СТАТУС: ОПЛАЧЕНО</span>
          </div>
        </div>
      </div>

      <Button
        onClick={onNewPayment}
        className="w-full h-11 sm:h-12 font-semibold text-sm sm:text-base bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
      >
        Новый платёж
      </Button>
    </div>
  );
}
