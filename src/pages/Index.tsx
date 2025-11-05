import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type Step = "form" | "payment-method" | "card-payment" | "sbp-payment" | "success";

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
  const { toast } = useToast();
  const navigate = useNavigate();

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
    if (!formData.fullName || !formData.birthDate || !formData.contractNumber || !formData.amount) {
      toast({
        title: "Заполните все поля",
        description: "Все поля обязательны для заполнения",
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
    setTimeout(() => {
      setIsChecking(false);
      const generatedPaymentId = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setPaymentId(generatedPaymentId);
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

  const downloadReceipt = () => {
    const receiptDate = new Date().toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    const receiptContent = `
================================================================

                     ОПЛАТА УСПЕШНА!

          Ваш платеж обработан. Спасибо!

================================================================

                 ООО "ЭКОРРА ПЛАТЕЖ"

          ИНН: 7743123456 | КПП: 774301001

================================================================

                   НОМЕР ПЛАТЕЖА

${paymentId}

${receiptDate}

================================================================

Плательщик: ${formData.fullName}

Номер договора: ${formData.contractNumber}

Способ оплаты: ${paymentMethod === "card" ? "Банковская карта" : "СБП"}

================================================================

Сумма: ${parseFloat(formData.amount).toLocaleString('ru-RU')} руб.

================================================================

                 СТАТУС: ОПЛАЧЕНО

================================================================
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `чек_${paymentId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Чек скачан",
      description: "Файл сохранён в папку загрузок",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="w-full max-w-2xl">


        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full mb-3 sm:mb-4">
            <Icon name="Shield" className="text-white" size={24} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 px-4">Защищённая оплата</h1>
          <p className="text-sm sm:text-base text-gray-600">Ваши данные надёжно защищены</p>
        </div>

        <Card className="p-4 sm:p-6 md:p-8 shadow-2xl">
          {step === "form" && (
            <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-6 animate-fade-in">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b">
                <Icon name="User" className="text-primary" size={20} />
                <h2 className="text-xl sm:text-2xl font-semibold">Данные плательщика</h2>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">ФИО</Label>
                <Input
                  id="fullName"
                  placeholder="Иванов Иван Иванович"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="h-11 sm:h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Дата рождения</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="h-11 sm:h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contractNumber">Номер договора</Label>
                <Input
                  id="contractNumber"
                  placeholder="1234567890"
                  value={formData.contractNumber}
                  onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
                  className="h-11 sm:h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Сумма оплаты (₽)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="1000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="h-11 sm:h-12 text-xl sm:text-2xl font-semibold"
                  min="0"
                  step="0.01"
                />
              </div>

              <Button type="submit" className="w-full h-11 sm:h-12 text-base font-semibold">
                Продолжить
                <Icon name="ArrowRight" className="ml-2" size={20} />
              </Button>
            </form>
          )}

          {step === "payment-method" && (
            <div className="space-y-4 sm:space-y-6 animate-fade-in">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b">
                <Icon name="CreditCard" className="text-primary" size={20} />
                <h2 className="text-xl sm:text-2xl font-semibold">Способ оплаты</h2>
              </div>

              <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "card" | "sbp")}>
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
                <Button variant="outline" onClick={() => setStep("form")} className="w-full sm:flex-1 h-11 sm:h-12">
                  <Icon name="ArrowLeft" className="mr-2" size={18} />
                  <span className="text-sm sm:text-base">Назад</span>
                </Button>
                <Button onClick={handlePaymentMethodSelect} className="w-full sm:flex-1 h-11 sm:h-12 font-semibold">
                  <span className="text-sm sm:text-base">Выбрать</span>
                  <Icon name="ArrowRight" className="ml-2" size={18} />
                </Button>
              </div>
            </div>
          )}

          {step === "card-payment" && (
            <div className="space-y-4 sm:space-y-6 animate-fade-in">
              <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b flex-wrap gap-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Icon name="CreditCard" className="text-primary" size={20} />
                  <h2 className="text-lg sm:text-2xl font-semibold">Оплата картой</h2>
                </div>
                <div className={`text-xl sm:text-2xl font-bold ${timeLeft < 60 ? "text-red-600" : "text-primary"}`}>
                  {formatTime(timeLeft)}
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 sm:p-6 rounded-xl text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm opacity-80">Номер карты для перевода</span>
                  <Icon name="Lock" size={20} />
                </div>
                <div className="flex items-center justify-between mb-4 gap-2">
                  <span className="text-base sm:text-xl md:text-2xl font-mono tracking-wider break-all">2200 9802 0524 3667</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard("2200980205243667")}
                    className="text-white hover:bg-white/20"
                  >
                    <Icon name="Copy" size={20} />
                  </Button>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm opacity-80">Сумма к оплате:</span>
                    <span className="text-3xl font-bold">{parseFloat(formData.amount).toLocaleString('ru-RU')} ₽</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
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
            <div className="space-y-4 sm:space-y-6 animate-fade-in">
              <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b flex-wrap gap-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Icon name="Smartphone" className="text-primary" size={20} />
                  <h2 className="text-lg sm:text-2xl font-semibold">Оплата через СБП</h2>
                </div>
                <div className={`text-xl sm:text-2xl font-bold ${timeLeft < 60 ? "text-red-600" : "text-primary"}`}>
                  {formatTime(timeLeft)}
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-4 sm:p-6 rounded-xl text-white">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm opacity-80">Получатель</div>
                    <div className="font-semibold">Фора Банк СПБ</div>
                  </div>
                  <Icon name="Lock" size={20} />
                </div>
                <div className="flex items-center justify-between mb-4 gap-2">
                  <span className="text-lg sm:text-2xl font-mono">+7 958 684 12 76</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard("+79586841276")}
                    className="text-white hover:bg-white/20"
                  >
                    <Icon name="Copy" size={20} />
                  </Button>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm opacity-80">Сумма к оплате:</span>
                    <span className="text-3xl font-bold">{parseFloat(formData.amount).toLocaleString('ru-RU')} ₽</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
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
            <div className="py-6 sm:py-8 animate-fade-in">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full mb-4 animate-scale-in">
                  <Icon name="CheckCircle" className="text-green-600" size={40} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 px-4">Оплата успешна!</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-4">Ваш платёж обработан. Спасибо!</p>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 mb-6">
                <div className="text-center mb-4">
                  <div className="text-sm text-gray-500 mb-2">ООО "ЭКОРРА ПЛАТЕЖ"</div>
                  <div className="text-xs text-gray-400">ИНН: 7743123456 | КПП: 774301001</div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <div className="text-center mb-3">
                    <div className="text-xs text-gray-500 mb-1">НОМЕР ПЛАТЕЖА</div>
                    <div className="text-lg font-mono font-bold text-green-700">{paymentId}</div>
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
                    <span className="font-semibold">{formData.contractNumber}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Способ оплаты:</span>
                    <span className="font-semibold">{paymentMethod === "card" ? "Банковская карта" : "СБП"}</span>
                  </div>
                  <div className="flex justify-between py-3 bg-gray-50 px-3 rounded-lg mt-3">
                    <span className="text-gray-900 font-semibold">Сумма:</span>
                    <span className="font-bold text-xl text-green-600">{parseFloat(formData.amount).toLocaleString('ru-RU')} ₽</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-dashed">
                  <div className="flex items-center justify-center gap-2 text-xs text-green-600">
                    <Icon name="CheckCircle" size={16} />
                    <span className="font-semibold">СТАТУС: ОПЛАЧЕНО</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => {
                  setStep("form");
                  setFormData({ fullName: "", birthDate: "", contractNumber: "", amount: "" });
                  setPaymentId("");
                  setTimeLeft(180);
                }}
                className="w-full h-11 sm:h-12 font-semibold text-sm sm:text-base"
              >
                Новый платёж
              </Button>
            </div>
          )}
        </Card>

        <div className="text-center mt-4 sm:mt-6 flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-600">
          <Icon name="Lock" size={16} />
          <span>Защищённое соединение SSL/TLS</span>
        </div>
      </div>
    </div>
  );
}