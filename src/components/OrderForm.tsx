import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import YandexMap from '@/components/YandexMap';

interface OrderFormProps {
  from: string;
  to: string;
  passengerPrice: number[];
  manualPrice: string;
  minPrice: number;
  gettingLocation: boolean;
  orderPublished: boolean;
  timeLeft: number;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onSliderChange: (value: number[]) => void;
  onGeolocation: () => void;
  onPublishOrder: () => void;
  formatTime: (seconds: number) => string;
}

export default function OrderForm({
  from,
  to,
  passengerPrice,
  manualPrice,
  minPrice,
  gettingLocation,
  orderPublished,
  timeLeft,
  onFromChange,
  onToChange,
  onPriceChange,
  onSliderChange,
  onGeolocation,
  onPublishOrder,
  formatTime
}: OrderFormProps) {
  return (
    <>
      <Card className="p-6 bg-card border-border animate-scale-in">
        <div className="aspect-video bg-secondary rounded-lg mb-6 relative overflow-hidden">
          {from && to ? (
            <YandexMap from={from} to={to} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Icon name="Map" size={48} className="mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Укажите адреса для отображения маршрута</p>
              </div>
            </div>
          )}
          <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <Icon name="Navigation" size={16} className="text-primary" />
              <span className="text-sm font-medium">Москва</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Icon name="Circle" className="absolute left-3 top-3 text-muted-foreground" size={20} />
              <Input
                placeholder="Откуда"
                value={from}
                onChange={(e) => onFromChange(e.target.value)}
                className="pl-11 h-12 bg-secondary border-0"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={onGeolocation}
              disabled={gettingLocation}
              className="h-12 w-12 shrink-0"
            >
              {gettingLocation ? (
                <Icon name="Loader2" size={20} className="animate-spin" />
              ) : (
                <Icon name="Crosshair" size={20} />
              )}
            </Button>
          </div>
          <div className="relative">
            <Icon name="MapPin" className="absolute left-3 top-3 text-primary" size={20} />
            <Input
              placeholder="Куда"
              value={to}
              onChange={(e) => onToChange(e.target.value)}
              className="pl-11 h-12 bg-secondary border-0"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Icon name="DollarSign" size={20} />
            Ваша цена
          </h3>
          <div className="text-3xl font-bold text-primary">
            {manualPrice || passengerPrice[0]} ₽
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Укажите, сколько готовы заплатить. Водители увидят ваше предложение и смогут принять его или предложить свою цену.
        </p>
        
        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block">
            Введите свою цену (мин. {minPrice} ₽)
          </label>
          <div className="relative">
            <Icon name="Ruble" className="absolute left-3 top-3 text-muted-foreground" size={20} />
            <Input
              type="number"
              placeholder={`От ${minPrice} ₽`}
              value={manualPrice}
              onChange={(e) => onPriceChange(e.target.value)}
              min={minPrice}
              className="pl-11 h-12 bg-secondary border-0 text-lg font-semibold"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Или используйте слайдер ниже
          </p>
        </div>

        <Slider
          value={passengerPrice}
          onValueChange={onSliderChange}
          min={minPrice}
          max={2000}
          step={50}
          className="mb-4"
        />
        <div className="flex justify-between text-sm text-muted-foreground mb-6">
          <span>{minPrice} ₽</span>
          <span>2000 ₽</span>
        </div>

        <Button
          onClick={onPublishOrder}
          disabled={!from || !to || orderPublished}
          className="w-full h-12 text-base font-semibold"
        >
          {orderPublished ? (
            <>
              <Icon name="Clock" className="mr-2" size={20} />
              Ожидание предложений... {formatTime(timeLeft)}
            </>
          ) : (
            <>
              <Icon name="Send" className="mr-2" size={20} />
              Опубликовать заказ
            </>
          )}
        </Button>
      </Card>
    </>
  );
}
