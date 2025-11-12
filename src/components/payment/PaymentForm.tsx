import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";

interface PaymentFormProps {
  formData: {
    fullName: string;
    birthDate: string;
    contractNumber: string;
    amount: string;
  };
  onFormDataChange: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onContractNumberChange: (value: string) => void;
}

export default function PaymentForm({
  formData,
  onFormDataChange,
  onSubmit,
  onContractNumberChange,
}: PaymentFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b">
        <Icon name="User" className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent" size={20} />
        <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Данные плательщика</h2>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">
          ФИО <span className="text-red-500">*</span>
        </Label>
        <Input
          id="fullName"
          placeholder="Иванов Иван Иванович"
          value={formData.fullName}
          onChange={(e) => onFormDataChange({ ...formData, fullName: e.target.value })}
          className="h-11 sm:h-12 text-base"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthDate">
          Дата рождения <span className="text-red-500">*</span>
        </Label>
        <Input
          id="birthDate"
          type="date"
          value={formData.birthDate}
          onChange={(e) => onFormDataChange({ ...formData, birthDate: e.target.value })}
          className="h-11 sm:h-12 text-base"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contractNumber">
          Номер договора <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
            МД-
          </span>
          <Input
            id="contractNumber"
            placeholder="00283799"
            value={formData.contractNumber}
            onChange={(e) => onContractNumberChange(e.target.value)}
            className="h-11 sm:h-12 text-base pl-12"
            pattern="\d{8}"
            maxLength={8}
            required
          />
        </div>
        <p className="text-xs text-gray-500">Формат: МД-00283799 (8 цифр)</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">
          Сумма оплаты (₽) <span className="text-red-500">*</span>
        </Label>
        <Input
          id="amount"
          type="number"
          placeholder="1000"
          value={formData.amount}
          onChange={(e) => onFormDataChange({ ...formData, amount: e.target.value })}
          className="h-11 sm:h-12 text-xl sm:text-2xl font-semibold"
          min="0"
          step="0.01"
          required
        />
      </div>

      <Button type="submit" className="w-full h-11 sm:h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
        Продолжить
        <Icon name="ArrowRight" className="ml-2" size={20} />
      </Button>
    </form>
  );
}
