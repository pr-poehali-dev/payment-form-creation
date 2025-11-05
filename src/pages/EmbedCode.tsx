import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function EmbedCode() {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const embedCode = `<!-- Код для вставки формы оплаты -->
<iframe 
  src="${window.location.origin}" 
  style="width: 100%; min-height: 800px; border: none; border-radius: 12px;"
  title="Форма оплаты"
  frameborder="0"
  scrolling="auto"
></iframe>`;

  const tildaInstructions = `1. Войдите в редактор Tilda
2. Добавьте блок "HTML-код" (T123)
3. Вставьте код ниже
4. Сохраните и опубликуйте страницу`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast({
      title: "Скопировано!",
      description: "Код скопирован в буфер обмена",
    });
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <Icon name="ArrowLeft" className="mr-2" size={20} />
            Назад к форме
          </Button>
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
              <Icon name="Code" className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Код для вставки</h1>
            <p className="text-gray-600">Интегрируйте форму оплаты на ваш сайт</p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b">
              <Icon name="FileCode" className="text-primary" size={24} />
              <h2 className="text-2xl font-semibold">Код для вставки</h2>
            </div>

            <div className="bg-gray-900 p-4 rounded-lg mb-4 relative">
              <pre className="text-green-400 text-sm overflow-x-auto">
                <code>{embedCode}</code>
              </pre>
              <Button
                onClick={copyToClipboard}
                className="absolute top-4 right-4"
                size="sm"
              >
                {copied ? (
                  <>
                    <Icon name="Check" className="mr-2" size={16} />
                    Скопировано
                  </>
                ) : (
                  <>
                    <Icon name="Copy" className="mr-2" size={16} />
                    Копировать
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg">
              <Icon name="Info" className="text-primary flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-gray-700">
                <p className="font-semibold mb-1">Настройка размера:</p>
                <p>Вы можете изменить параметр <code className="bg-white px-2 py-0.5 rounded">min-height</code> для регулировки высоты формы</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b">
              <Icon name="Globe" className="text-primary" size={24} />
              <h2 className="text-2xl font-semibold">Инструкция для Tilda</h2>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Откройте редактор Tilda</h3>
                  <p className="text-sm text-gray-600">Перейдите на страницу, куда хотите добавить форму оплаты</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Добавьте блок HTML-кода</h3>
                  <p className="text-sm text-gray-600">Найдите блок "HTML код" (T123) или "Другое → HTML-код"</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Вставьте код</h3>
                  <p className="text-sm text-gray-600">Скопируйте код выше и вставьте его в блок HTML</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Опубликуйте</h3>
                  <p className="text-sm text-gray-600">Сохраните изменения и опубликуйте страницу</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex gap-3">
                <Icon name="CheckCircle" className="text-green-600 flex-shrink-0" size={20} />
                <div className="text-sm">
                  <p className="font-semibold text-green-900 mb-1">Готово!</p>
                  <p className="text-green-700">Форма оплаты появится на вашем сайте. Все данные защищены SSL-шифрованием.</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b">
              <Icon name="Palette" className="text-primary" size={24} />
              <h2 className="text-2xl font-semibold">Другие платформы</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Globe" className="text-primary" size={20} />
                  <h3 className="font-semibold">WordPress</h3>
                </div>
                <p className="text-sm text-gray-600">Вставьте код в HTML-блок или виджет "Произвольный HTML"</p>
              </div>

              <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Code" className="text-primary" size={20} />
                  <h3 className="font-semibold">Wix</h3>
                </div>
                <p className="text-sm text-gray-600">Добавьте элемент "HTML iframe" через меню "Добавить" → "Embed"</p>
              </div>

              <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="Layers" className="text-primary" size={20} />
                  <h3 className="font-semibold">Squarespace</h3>
                </div>
                <p className="text-sm text-gray-600">Используйте блок "Code" в редакторе страниц</p>
              </div>

              <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name="FileCode" className="text-primary" size={20} />
                  <h3 className="font-semibold">Свой HTML-сайт</h3>
                </div>
                <p className="text-sm text-gray-600">Вставьте код напрямую в HTML-файл вашего сайта</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
