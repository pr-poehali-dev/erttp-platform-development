import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';


type TariffType = 'economy' | 'comfort' | 'business';

interface Ride {
  id: string;
  from: string;
  to: string;
  date: string;
  price: number;
  status: 'completed' | 'active' | 'cancelled';
  tariff: TariffType;
}

const tariffs = [
  { id: 'economy' as TariffType, name: 'Эконом', price: 250, time: '3 мин', icon: 'Car' },
  { id: 'comfort' as TariffType, name: 'Комфорт', price: 350, time: '5 мин', icon: 'Car' },
  { id: 'business' as TariffType, name: 'Бизнес', price: 550, time: '7 мин', icon: 'Car' }
];

const mockRides: Ride[] = [
  { id: '1', from: 'ул. Ленина, 25', to: 'пр. Победы, 14', date: '2025-12-07 14:30', price: 350, status: 'completed', tariff: 'comfort' },
  { id: '2', from: 'ТЦ Галерея', to: 'Аэропорт', date: '2025-12-06 09:15', price: 550, status: 'completed', tariff: 'business' },
  { id: '3', from: 'Парк Горького', to: 'Вокзал', date: '2025-12-05 18:45', price: 250, status: 'completed', tariff: 'economy' }
];

export default function Index() {
  const [selectedTariff, setSelectedTariff] = useState<TariffType>('economy');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [activeRide, setActiveRide] = useState(false);
  const [showDriverDialog, setShowDriverDialog] = useState(false);
  const [rideStatus, setRideStatus] = useState<'searching' | 'found' | 'arriving' | 'inProgress'>('searching');

  const driverInfo = {
    name: 'Алексей Иванов',
    rating: 4.9,
    trips: 1247,
    car: 'Toyota Camry',
    plate: 'М777АА777',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=driver'
  };

  useEffect(() => {
    if (activeRide) {
      setRideStatus('searching');
      toast({
        title: '🔍 Ищем водителя...',
        description: 'Подождите несколько секунд'
      });

      setTimeout(() => {
        setRideStatus('found');
        setShowDriverDialog(true);
        toast({
          title: '✅ Водитель найден!',
          description: `${driverInfo.name} принял заказ`
        });
      }, 2000);

      setTimeout(() => {
        setRideStatus('arriving');
        toast({
          title: '🚗 Водитель едет к вам',
          description: 'Прибудет через 3 минуты'
        });
      }, 4000);
    }
  }, [activeRide]);

  const handleOrder = () => {
    if (from && to) {
      setActiveRide(true);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Icon name="Car" className="text-white" size={24} />
              </div>
              <h1 className="text-3xl font-bold text-card-foreground">TaxiGo</h1>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Icon name="User" size={24} />
            </Button>
          </div>
        </header>

        <Tabs defaultValue="order" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="order">
              <Icon name="MapPin" size={18} className="mr-2" />
              Заказ
            </TabsTrigger>
            <TabsTrigger value="active">
              <Icon name="Navigation" size={18} className="mr-2" />
              Активные
            </TabsTrigger>
            <TabsTrigger value="history">
              <Icon name="Clock" size={18} className="mr-2" />
              История
            </TabsTrigger>
          </TabsList>

          <TabsContent value="order" className="space-y-6">
            <Card className="p-6 bg-card border-border animate-scale-in">
              <div className="aspect-video bg-secondary rounded-lg mb-6 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Icon name="Map" size={48} className="mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {from && to ? 'Маршрут построен' : 'Укажите адреса для отображения маршрута'}
                    </p>
                    {from && to && (
                      <div className="mt-4 space-y-2 text-left max-w-sm mx-auto">
                        <div className="flex items-center gap-2 text-sm">
                          <Icon name="Circle" size={10} className="text-muted-foreground" />
                          <span className="text-muted-foreground">{from}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Icon name="MapPin" size={10} className="text-primary" />
                          <span className="text-muted-foreground">{to}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Icon name="Navigation" size={16} className="text-primary" />
                    <span className="text-sm font-medium">Москва</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Icon name="MapPin" className="absolute left-3 top-3 text-muted-foreground" size={20} />
                  <Input
                    placeholder="Откуда"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="pl-11 h-12 bg-secondary border-0"
                  />
                </div>
                <div className="relative">
                  <Icon name="MapPin" className="absolute left-3 top-3 text-primary" size={20} />
                  <Input
                    placeholder="Куда"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="pl-11 h-12 bg-secondary border-0"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Icon name="Car" size={20} />
                Выберите тариф
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {tariffs.map((tariff) => (
                  <button
                    key={tariff.id}
                    onClick={() => setSelectedTariff(tariff.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left hover-scale ${
                      selectedTariff === tariff.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-secondary hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-card-foreground">{tariff.name}</h4>
                        <p className="text-sm text-muted-foreground">{tariff.time}</p>
                      </div>
                      <Icon name={tariff.icon} size={24} className="text-primary" />
                    </div>
                    <p className="text-2xl font-bold text-card-foreground">{tariff.price} ₽</p>
                  </button>
                ))}
              </div>

              <Button
                onClick={handleOrder}
                disabled={!from || !to}
                className="w-full mt-6 h-12 text-base font-semibold"
                size="lg"
              >
                Заказать за {tariffs.find(t => t.id === selectedTariff)?.price} ₽
              </Button>
            </Card>

            {activeRide && (
              <Card className="p-6 bg-card border-primary animate-slide-in-right">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center animate-pulse">
                    <Icon name="Car" className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-card-foreground">
                      {rideStatus === 'searching' && 'Ищем водителя...'}
                      {rideStatus === 'found' && 'Водитель найден!'}
                      {rideStatus === 'arriving' && 'Водитель едет к вам'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {rideStatus === 'arriving' && 'Прибудет через 3 минуты'}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {rideStatus === 'searching' ? 'Поиск' : 'В пути'}
                  </Badge>
                </div>
              </Card>
            )}

            <Dialog open={showDriverDialog} onOpenChange={setShowDriverDialog}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-center">Ваш водитель</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center space-y-4 py-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={driverInfo.photo} />
                    <AvatarFallback>АИ</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="text-xl font-semibold">{driverInfo.name}</h3>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Icon name="Star" className="text-yellow-500 fill-yellow-500" size={18} />
                      <span className="font-medium">{driverInfo.rating}</span>
                      <span className="text-muted-foreground text-sm">({driverInfo.trips} поездок)</span>
                    </div>
                  </div>
                  <div className="w-full space-y-3 mt-4">
                    <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div className="flex items-center gap-2">
                        <Icon name="Car" size={20} className="text-primary" />
                        <span className="text-sm">Автомобиль</span>
                      </div>
                      <span className="font-medium">{driverInfo.car}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div className="flex items-center gap-2">
                        <Icon name="Hash" size={20} className="text-primary" />
                        <span className="text-sm">Номер</span>
                      </div>
                      <span className="font-medium">{driverInfo.plate}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full mt-4">
                    <Button variant="outline" className="flex-1">
                      <Icon name="Phone" size={18} className="mr-2" />
                      Позвонить
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Icon name="MessageSquare" size={18} className="mr-2" />
                      Написать
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <Card className="p-8 bg-card border-border text-center">
              <Icon name="Inbox" size={48} className="mx-auto mb-3 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Нет активных поездок</h3>
              <p className="text-sm text-muted-foreground">Закажите поездку на вкладке "Заказ"</p>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {mockRides.map((ride) => (
              <Card key={ride.id} className="p-5 bg-card border-border hover-scale cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="Circle" size={10} className="text-muted-foreground" />
                      <p className="text-sm font-medium text-card-foreground">{ride.from}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="MapPin" size={10} className="text-primary" />
                      <p className="text-sm font-medium text-card-foreground">{ride.to}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-card-foreground">{ride.price} ₽</p>
                    <Badge variant="secondary" className="mt-1">
                      {tariffs.find(t => t.id === ride.tariff)?.name}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Icon name="Calendar" size={14} />
                  {new Date(ride.date).toLocaleString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}