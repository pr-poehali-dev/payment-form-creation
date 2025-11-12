import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Icon from "@/components/ui/icon";

interface PaymentMethodSelectorProps {
  paymentMethod: "card" | "sbp";
  onPaymentMethodChange: (method: "card" | "sbp") => void;
  onBack: () => void;
  onSelect: () => void;
}

export default function PaymentMethodSelector({
  paymentMethod,
  onPaymentMethodChange,
  onBack,
  onSelect,
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b">
        <Icon name="CreditCard" className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent" size={20} />
        <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Способ оплаты</h2>
      </div>

      <RadioGroup value={paymentMethod} onValueChange={(value) => onPaymentMethodChange(value as "card" | "sbp")}>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 border-2 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card" className="flex items-center gap-2 sm:gap-3 cursor-pointer flex-1">
              <Icon name="CreditCard" size={20} className="flex-shrink-0" />
              <div>
                <div className="font-semibold text-sm sm:text-base">Оплата по номеру карты</div>
                <div className="text-xs sm:text-sm text-gray-600">Перевод на банковскую карту</div>
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-4 p-4 border-2 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
            <RadioGroupItem value="sbp" id="sbp" />
            <Label htmlFor="sbp" className="flex items-center gap-2 sm:gap-3 cursor-pointer flex-1">
              <Icon name="Smartphone" size={20} className="flex-shrink-0" />
              <div>
                <div className="font-semibold text-sm sm:text-base">Система быстрых платежей (СБП)</div>
                <div className="text-xs sm:text-sm text-gray-600">Перевод по номеру телефона</div>
              </div>
            </Label>
          </div>
        </div>
      </RadioGroup>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" onClick={onBack} className="w-full sm:flex-1 h-11 sm:h-12">
          <Icon name="ArrowLeft" className="mr-2" size={18} />
          <span className="text-sm sm:text-base">Назад</span>
        </Button>
        <Button onClick={onSelect} className="w-full sm:flex-1 h-11 sm:h-12 font-semibold bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
          <span className="text-sm sm:text-base">Выбрать</span>
          <Icon name="ArrowRight" className="ml-2" size={18} />
        </Button>
      </div>
    </div>
  );
}
