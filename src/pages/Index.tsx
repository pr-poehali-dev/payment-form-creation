import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";
import PaymentForm from "@/components/payment/PaymentForm";
import PaymentMethodSelector from "@/components/payment/PaymentMethodSelector";
import PaymentExecutionScreen from "@/components/payment/PaymentExecutionScreen";
import SuccessScreen from "@/components/payment/SuccessScreen";

type Step = "form" | "payment-method" | "card-payment" | "sbp-payment" | "processing" | "success";

export default function Index() {
  const [step, setStep] = useState<Step>("form");
  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    contractNumber: "",
    amount: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"card" | "sbp">("card");
  const [timeLeft, setTimeLeft] = useState(180);
  const [isChecking, setIsChecking] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [processingTime, setProcessingTime] = useState(60);
  const { toast } = useToast();

  useEffect(() => {
    if ((step === "card-payment" || step === "sbp-payment") && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            toast({
              title: "Время истекло",
              description: "Пожалуйста, начните процесс оплаты заново",
              variant: "destructive",
            });
            setStep("payment-method");
            return 180;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [step, timeLeft, toast]);

  useEffect(() => {
    if (step === "processing" && processingTime > 0) {
      const timer = setInterval(() => {
        setProcessingTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            const generatedPaymentId = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            setPaymentId(generatedPaymentId);
            setStep("success");
            toast({
              title: "Оплата успешна!",
              description: "Ваш платёж обработан",
            });
            return 60;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [step, processingTime, toast]);

  const handleContractNumberChange = (value: string) => {
    const cleaned = value.replace(/[^\d]/g, '');
    const limited = cleaned.slice(0, 8);
    setFormData({ ...formData, contractNumber: limited });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.birthDate || !formData.contractNumber || !formData.amount) {
      toast({
        title: "Заполните все поля",
        description: "Все поля обязательны для заполнения",
        variant: "destructive",
      });
      return;
    }
    if (formData.contractNumber.length !== 8) {
      toast({
        title: "Некорректный номер договора",
        description: "Номер должен содержать 8 цифр",
        variant: "destructive",
      });
      return;
    }
    const amountNum = parseFloat(formData.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Некорректная сумма",
        description: "Введите положительное число",
        variant: "destructive",
      });
      return;
    }
    setStep("payment-method");
  };

  const handlePaymentMethodSelect = () => {
    setTimeLeft(180);
    if (paymentMethod === "card") {
      setStep("card-payment");
    } else {
      setStep("sbp-payment");
    }
  };

  const handleCheckPayment = () => {
    setIsChecking(true);
    setProcessingTime(60);
    setTimeout(() => {
      setIsChecking(false);
      setStep("processing");
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Скопировано",
      description: "Данные скопированы в буфер обмена",
    });
  };

  const handleNewPayment = () => {
    setStep("form");
    setFormData({ fullName: "", birthDate: "", contractNumber: "", amount: "" });
    setPaymentId("");
    setTimeLeft(180);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full mb-3 sm:mb-4">
            <Icon name="Shield" className="text-white" size={24} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-1 sm:mb-2 px-4">Защищённая оплата</h1>
          <p className="text-sm sm:text-base bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Ваши данные надёжно защищены</p>
        </div>

        <Card className="p-4 sm:p-6 md:p-8 shadow-2xl bg-white">
          {step === "form" && (
            <PaymentForm
              formData={formData}
              onFormDataChange={setFormData}
              onContractNumberChange={handleContractNumberChange}
              onSubmit={handleFormSubmit}
            />
          )}

          {step === "payment-method" && (
            <PaymentMethodSelector
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              onBack={() => setStep("form")}
              onSelect={handlePaymentMethodSelect}
            />
          )}

          {(step === "card-payment" || step === "sbp-payment" || step === "processing") && (
            <PaymentExecutionScreen
              step={step}
              timeLeft={timeLeft}
              processingTime={processingTime}
              formData={formData}
              isChecking={isChecking}
              onBack={() => setStep("payment-method")}
              onCheckPayment={handleCheckPayment}
              onCopyToClipboard={copyToClipboard}
              formatTime={formatTime}
            />
          )}

          {step === "success" && (
            <SuccessScreen
              paymentId={paymentId}
              formData={formData}
              paymentMethod={paymentMethod}
              onNewPayment={handleNewPayment}
            />
          )}
        </Card>

        <div className="text-center mt-4 sm:mt-6 flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-600">
          <Icon name="Lock" size={16} />
          <span>Защищено SSL-сертификатом</span>
        </div>
      </div>
    </div>
  );
}