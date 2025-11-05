import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";

type Step = "form" | "payment-method" | "card-payment" | "sbp-payment" | "success";

export default function Index() {
  const [step, setStep] = useState<Step>("form");
  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    contractNumber: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"card" | "sbp">("card");
  const [timeLeft, setTimeLeft] = useState(180);
  const [isChecking, setIsChecking] = useState(false);
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.birthDate || !formData.contractNumber) {
      toast({
        title: "Заполните все поля",
        description: "Все поля обязательны для заполнения",
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
    setTimeout(() => {
      setIsChecking(false);
      setStep("success");
      toast({
        title: "Оплата успешна!",
        description: "Ваш платёж обработан",
      });
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Скопировано",
      description: "Данные скопированы в буфер обмена",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Icon name="Shield" className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Защищённая оплата</h1>
          <p className="text-gray-600">Ваши данные надёжно защищены</p>
        </div>

        <Card className="p-8 shadow-2xl">
          {step === "form" && (
            <form onSubmit={handleFormSubmit} className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                <Icon name="User" className="text-primary" size={24} />
                <h2 className="text-2xl font-semibold">Данные плательщика</h2>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">ФИО</Label>
                <Input
                  id="fullName"
                  placeholder="Иванов Иван Иванович"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Дата рождения</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contractNumber">Номер договора</Label>
                <Input
                  id="contractNumber"
                  placeholder="1234567890"
                  value={formData.contractNumber}
                  onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
                  className="h-12"
                />
              </div>

              <Button type="submit" className="w-full h-12 text-base font-semibold">
                Продолжить
                <Icon name="ArrowRight" className="ml-2" size={20} />
              </Button>
            </form>
          )}

          {step === "payment-method" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                <Icon name="CreditCard" className="text-primary" size={24} />
                <h2 className="text-2xl font-semibold">Способ оплаты</h2>
              </div>

              <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "card" | "sbp")}>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 border-2 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Icon name="CreditCard" size={24} />
                      <div>
                        <div className="font-semibold">Оплата по номеру карты</div>
                        <div className="text-sm text-gray-600">Перевод на банковскую карту</div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-4 p-4 border-2 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                    <RadioGroupItem value="sbp" id="sbp" />
                    <Label htmlFor="sbp" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Icon name="Smartphone" size={24} />
                      <div>
                        <div className="font-semibold">Система быстрых платежей (СБП)</div>
                        <div className="text-sm text-gray-600">Перевод по номеру телефона</div>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("form")} className="flex-1 h-12">
                  <Icon name="ArrowLeft" className="mr-2" size={20} />
                  Назад
                </Button>
                <Button onClick={handlePaymentMethodSelect} className="flex-1 h-12 font-semibold">
                  Выбрать
                  <Icon name="ArrowRight" className="ml-2" size={20} />
                </Button>
              </div>
            </div>
          )}

          {step === "card-payment" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <div className="flex items-center gap-3">
                  <Icon name="CreditCard" className="text-primary" size={24} />
                  <h2 className="text-2xl font-semibold">Оплата картой</h2>
                </div>
                <div className={`text-2xl font-bold ${timeLeft < 60 ? "text-red-600" : "text-primary"}`}>
                  {formatTime(timeLeft)}
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-xl text-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm opacity-80">Номер карты для перевода</span>
                  <Icon name="Lock" size={20} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-mono tracking-wider">2200 9802 0524 3667</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard("2200980205243667")}
                    className="text-white hover:bg-white/20"
                  >
                    <Icon name="Copy" size={20} />
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex gap-3">
                  <Icon name="Info" className="text-primary flex-shrink-0" size={20} />
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold mb-1">Как оплатить:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Скопируйте номер карты</li>
                      <li>Откройте мобильное приложение вашего банка</li>
                      <li>Выполните перевод на указанную карту</li>
                      <li>Нажмите "Проверить оплату"</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("payment-method")} className="flex-1 h-12">
                  <Icon name="ArrowLeft" className="mr-2" size={20} />
                  Назад
                </Button>
                <Button onClick={handleCheckPayment} disabled={isChecking} className="flex-1 h-12 font-semibold">
                  {isChecking ? (
                    <>
                      <Icon name="Loader2" className="mr-2 animate-spin" size={20} />
                      Проверка...
                    </>
                  ) : (
                    <>
                      <Icon name="CheckCircle" className="mr-2" size={20} />
                      Проверить оплату
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === "sbp-payment" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <div className="flex items-center gap-3">
                  <Icon name="Smartphone" className="text-primary" size={24} />
                  <h2 className="text-2xl font-semibold">Оплата через СБП</h2>
                </div>
                <div className={`text-2xl font-bold ${timeLeft < 60 ? "text-red-600" : "text-primary"}`}>
                  {formatTime(timeLeft)}
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 rounded-xl text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm opacity-80">Получатель</div>
                    <div className="font-semibold">Фора Банк СПБ</div>
                  </div>
                  <Icon name="Lock" size={20} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-mono">+7 958 684 12 76</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard("+79586841276")}
                    className="text-white hover:bg-white/20"
                  >
                    <Icon name="Copy" size={20} />
                  </Button>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex gap-3">
                  <Icon name="Info" className="text-accent flex-shrink-0" size={20} />
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold mb-1">Как оплатить:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Скопируйте номер телефона</li>
                      <li>Откройте приложение вашего банка</li>
                      <li>Выберите "Переводы по СБП"</li>
                      <li>Введите номер телефона и сумму</li>
                      <li>Подтвердите перевод</li>
                      <li>Нажмите "Проверить оплату"</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("payment-method")} className="flex-1 h-12">
                  <Icon name="ArrowLeft" className="mr-2" size={20} />
                  Назад
                </Button>
                <Button onClick={handleCheckPayment} disabled={isChecking} className="flex-1 h-12 font-semibold">
                  {isChecking ? (
                    <>
                      <Icon name="Loader2" className="mr-2 animate-spin" size={20} />
                      Проверка...
                    </>
                  ) : (
                    <>
                      <Icon name="CheckCircle" className="mr-2" size={20} />
                      Проверить оплату
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-8 animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-scale-in">
                <Icon name="CheckCircle" className="text-green-600" size={48} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Оплата успешна!</h2>
              <p className="text-gray-600 mb-8">Ваш платёж обработан. Спасибо!</p>

              <div className="bg-green-50 p-6 rounded-lg mb-6">
                <div className="space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ФИО:</span>
                    <span className="font-semibold">{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Номер договора:</span>
                    <span className="font-semibold">{formData.contractNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Способ оплаты:</span>
                    <span className="font-semibold">{paymentMethod === "card" ? "Банковская карта" : "СБП"}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => {
                  setStep("form");
                  setFormData({ fullName: "", birthDate: "", contractNumber: "" });
                  setTimeLeft(180);
                }}
                className="w-full h-12 font-semibold"
              >
                Новый платёж
              </Button>
            </div>
          )}
        </Card>

        <div className="text-center mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
          <Icon name="Lock" size={16} />
          <span>Защищённое соединение SSL/TLS</span>
        </div>
      </div>
    </div>
  );
}
