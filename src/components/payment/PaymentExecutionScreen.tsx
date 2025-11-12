import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface PaymentExecutionScreenProps {
  step: "card-payment" | "sbp-payment" | "processing";
  timeLeft: number;
  processingTime: number;
  formData: {
    amount: string;
  };
  isChecking: boolean;
  onBack: () => void;
  onCheckPayment: () => void;
  onCopyToClipboard: (text: string) => void;
  formatTime: (seconds: number) => number;
}

export default function PaymentExecutionScreen({
  step,
  timeLeft,
  processingTime,
  formData,
  isChecking,
  onBack,
  onCheckPayment,
  onCopyToClipboard,
  formatTime,
}: PaymentExecutionScreenProps) {
  if (step === "card-payment") {
    return (
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b flex-wrap gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <Icon name="CreditCard" className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent" size={20} />
            <h2 className="text-lg sm:text-2xl font-semibold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Оплата картой</h2>
          </div>
          <div className={`text-xl sm:text-2xl font-bold ${timeLeft < 60 ? "text-red-600" : "text-primary"}`}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-green-500 p-4 sm:p-6 rounded-xl text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm opacity-80">Номер карты для перевода</span>
            <Icon name="Lock" size={20} />
          </div>
          <div className="flex items-center justify-between mb-4 gap-2">
            <span className="text-base sm:text-xl md:text-2xl font-mono tracking-wider break-all">2200 9802 0524 3667</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCopyToClipboard("2200980205243667")}
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
                <li>Откройте приложение банка</li>
                <li>Выберите "Переводы на карту"</li>
                <li>Введите номер карты и сумму</li>
                <li>Подтвердите перевод</li>
                <li>Нажмите "Проверить оплату"</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1 h-12">
            <Icon name="ArrowLeft" className="mr-2" size={20} />
            Назад
          </Button>
          <Button onClick={onCheckPayment} disabled={isChecking} className="flex-1 h-12 font-semibold bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
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
    );
  }

  if (step === "sbp-payment") {
    return (
      <div className="space-y-4 sm:space-y-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b flex-wrap gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <Icon name="Smartphone" className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent" size={20} />
            <h2 className="text-lg sm:text-2xl font-semibold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Оплата через СБП</h2>
          </div>
          <div className={`text-xl sm:text-2xl font-bold ${timeLeft < 60 ? "text-red-600" : "text-primary"}`}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-green-500 p-4 sm:p-6 rounded-xl text-white">
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
              onClick={() => onCopyToClipboard("+79586841276")}
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
          <Button variant="outline" onClick={onBack} className="flex-1 h-12">
            <Icon name="ArrowLeft" className="mr-2" size={20} />
            Назад
          </Button>
          <Button onClick={onCheckPayment} disabled={isChecking} className="flex-1 h-12 font-semibold bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
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
    );
  }

  if (step === "processing") {
    return (
      <div className="py-8 sm:py-12 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-100 to-green-100 rounded-full mb-6 animate-pulse">
          <Icon name="Clock" className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent" size={48} />
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-3">Платёж в обработке</h2>
        <p className="text-sm sm:text-base text-gray-600 mb-8 px-4">
          Пожалуйста, подождите. Мы проверяем ваш платёж
        </p>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 sm:p-8 mb-6 max-w-md mx-auto">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Проверка платежа</span>
              <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                {Math.floor(((60 - processingTime) / 60) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-full rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${((60 - processingTime) / 60) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Осталось: {Math.floor(processingTime / 60)}:{(processingTime % 60).toString().padStart(2, '0')}
          </div>
        </div>

        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 p-4 rounded-lg max-w-md mx-auto">
          <Icon name="Info" className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="text-sm text-left text-gray-700">
            <p className="font-semibold mb-1">Не закрывайте окно</p>
            <p>Проверка платежа может занять до 1 минуты. После завершения вы увидите чек.</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
