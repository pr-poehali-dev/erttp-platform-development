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
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import YandexMap from '@/components/YandexMap';

interface DriverOffer {
  id: string;
  name: string;
  rating: number;
  trips: number;
  car: string;
  plate: string;
  photo: string;
  price: number;
  arrivalTime: string;
  distance: number;
}

interface Ride {
  id: string;
  from: string;
  to: string;
  date: string;
  price: number;
  status: 'completed' | 'active' | 'cancelled';
}

const mockRides: Ride[] = [
  { id: '1', from: 'ул. Ленина, 25', to: 'пр. Победы, 14', date: '2025-12-07 14:30', price: 350, status: 'completed' },
  { id: '2', from: 'ТЦ Галерея', to: 'Аэропорт', date: '2025-12-06 09:15', price: 550, status: 'completed' },
  { id: '3', from: 'Парк Горького', to: 'Вокзал', date: '2025-12-05 18:45', price: 250, status: 'completed' }
];

const mockDriverOffers: DriverOffer[] = [
  {
    id: '1',
    name: 'Алексей Иванов',
    rating: 4.9,
    trips: 1247,
    car: 'Toyota Camry',
    plate: 'М777АА777',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=driver1',
    price: 380,
    arrivalTime: '3 мин',
    distance: 1.2
  },
  {
    id: '2',
    name: 'Дмитрий Петров',
    rating: 4.8,
    trips: 892,
    car: 'Hyundai Solaris',
    plate: 'К555ВВ555',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=driver2',
    price: 420,
    arrivalTime: '5 мин',
    distance: 2.5
  },
  {
    id: '3',
    name: 'Сергей Козлов',
    rating: 4.95,
    trips: 2103,
    car: 'Volkswagen Polo',
    plate: 'А123СС123',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=driver3',
    price: 350,
    arrivalTime: '7 мин',
    distance: 3.8
  }
];

export default function Index() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [passengerPrice, setPassengerPrice] = useState([400]);
  const [showOffersDialog, setShowOffersDialog] = useState(false);
  const [driverOffers, setDriverOffers] = useState<DriverOffer[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<DriverOffer | null>(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [orderPublished, setOrderPublished] = useState(false);

  useEffect(() => {
    if (orderPublished && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [orderPublished, timeLeft]);

  useEffect(() => {
    if (orderPublished) {
      const timer1 = setTimeout(() => {
        setDriverOffers([mockDriverOffers[0]]);
        toast({
          title: '🚗 Новое предложение!',
          description: `${mockDriverOffers[0].name} предлагает ${mockDriverOffers[0].price} ₽`
        });
      }, 3000);

      const timer2 = setTimeout(() => {
        setDriverOffers((prev) => [...prev, mockDriverOffers[1]]);
        toast({
          title: '🚗 Новое предложение!',
          description: `${mockDriverOffers[1].name} предлагает ${mockDriverOffers[1].price} ₽`
        });
      }, 7000);

      const timer3 = setTimeout(() => {
        setDriverOffers((prev) => [...prev, mockDriverOffers[2]]);
        toast({
          title: '🚗 Новое предложение!',
          description: `${mockDriverOffers[2].name} предлагает ${mockDriverOffers[2].price} ₽`
        });
      }, 12000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [orderPublished]);

  const handlePublishOrder = () => {
    if (from && to && passengerPrice[0] > 0) {
      setOrderPublished(true);
      setShowOffersDialog(true);
      setTimeLeft(120);
      setDriverOffers([]);
      toast({
        title: '📢 Заказ опубликован!',
        description: 'Водители начнут присылать предложения'
      });
    }
  };

  const handleAcceptOffer = (driver: DriverOffer) => {
    setSelectedDriver(driver);
    setShowOffersDialog(false);
    setOrderPublished(false);
    toast({
      title: '✅ Поездка подтверждена!',
      description: `${driver.name} едет к вам. Прибудет через ${driver.arrivalTime}`
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const sortedOffers = [...driverOffers].sort((a, b) => a.price - b.price);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Icon name="Car" className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-card-foreground">TaxiGo</h1>
                <p className="text-sm text-muted-foreground">Ваша цена — ваши правила</p>
              </div>
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
                <div className="relative">
                  <Icon name="Circle" className="absolute left-3 top-3 text-muted-foreground" size={20} />
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Icon name="DollarSign" size={20} />
                  Ваша цена
                </h3>
                <div className="text-3xl font-bold text-primary">{passengerPrice[0]} ₽</div>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Укажите, сколько готовы заплатить. Водители увидят ваше предложение и смогут принять его или предложить свою цену.
              </p>
              <Slider
                value={passengerPrice}
                onValueChange={setPassengerPrice}
                min={100}
                max={2000}
                step={50}
                className="mb-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>100 ₽</span>
                <span>2000 ₽</span>
              </div>

              <Button
                onClick={handlePublishOrder}
                disabled={!from || !to || orderPublished}
                className="w-full mt-6 h-12 text-base font-semibold"
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

            {orderPublished && driverOffers.length > 0 && (
              <Card className="p-6 bg-card border-primary animate-slide-in-right">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Предложения водителей</h3>
                  <Badge variant="secondary" className="animate-pulse">
                    {driverOffers.length} предложений
                  </Badge>
                </div>
                <Button
                  onClick={() => setShowOffersDialog(true)}
                  variant="outline"
                  className="w-full"
                >
                  Посмотреть все предложения
                  <Icon name="ChevronRight" size={18} className="ml-2" />
                </Button>
              </Card>
            )}

            {selectedDriver && (
              <Card className="p-6 bg-card border-primary animate-scale-in">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={selectedDriver.photo} />
                    <AvatarFallback>ВД</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{selectedDriver.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="Star" className="text-yellow-500 fill-yellow-500" size={16} />
                      <span>{selectedDriver.rating}</span>
                      <span>•</span>
                      <span>{selectedDriver.car}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{selectedDriver.price} ₽</div>
                    <div className="text-sm text-muted-foreground">{selectedDriver.arrivalTime}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Icon name="Phone" size={18} className="mr-2" />
                    Позвонить
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Icon name="MessageSquare" size={18} className="mr-2" />
                    Написать
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            {!selectedDriver && !orderPublished ? (
              <Card className="p-12 bg-card border-border text-center">
                <Icon name="Navigation" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Нет активных поездок</p>
              </Card>
            ) : null}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {mockRides.map((ride) => (
              <Card key={ride.id} className="p-4 bg-card border-border hover:border-primary transition-colors cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="pt-1">
                        <Icon name="Circle" size={10} className="text-muted-foreground mb-1" />
                        <div className="w-px h-8 bg-border ml-1"></div>
                        <Icon name="MapPin" size={10} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-card-foreground">{ride.from}</p>
                        <p className="text-sm font-medium text-card-foreground mt-6">{ride.to}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                      <Icon name="Calendar" size={12} />
                      <span>{new Date(ride.date).toLocaleString('ru-RU')}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-card-foreground mb-1">{ride.price} ₽</div>
                    <Badge variant={ride.status === 'completed' ? 'default' : 'secondary'}>
                      {ride.status === 'completed' ? 'Завершена' : 'Отменена'}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        <Dialog open={showOffersDialog} onOpenChange={setShowOffersDialog}>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>Предложения водителей</DialogTitle>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon name="Clock" size={18} />
                  <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Ваша цена: <span className="font-semibold text-primary">{passengerPrice[0]} ₽</span>
              </p>
            </DialogHeader>
            <div className="space-y-3 py-4">
              {sortedOffers.length === 0 ? (
                <div className="text-center py-8">
                  <Icon name="Search" size={48} className="mx-auto mb-4 text-muted-foreground animate-pulse" />
                  <p className="text-muted-foreground">Ищем водителей...</p>
                </div>
              ) : (
                sortedOffers.map((driver, index) => (
                  <Card
                    key={driver.id}
                    className={`p-4 border-2 transition-all hover:border-primary cursor-pointer ${
                      index === 0 ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                    onClick={() => handleAcceptOffer(driver)}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="w-14 h-14">
                        <AvatarImage src={driver.photo} />
                        <AvatarFallback>ВД</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{driver.name}</h4>
                          {index === 0 && <Badge className="bg-primary">Лучшая цена</Badge>}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Icon name="Star" className="text-yellow-500 fill-yellow-500" size={14} />
                            <span>{driver.rating}</span>
                          </div>
                          <span>•</span>
                          <span>{driver.trips} поездок</span>
                          <span>•</span>
                          <span>{driver.car}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Icon name="Clock" size={14} />
                            <span>{driver.arrivalTime}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Icon name="Navigation" size={14} />
                            <span>{driver.distance} км</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{driver.price} ₽</div>
                        <div className="text-xs text-muted-foreground">
                          {driver.price > passengerPrice[0]
                            ? `+${driver.price - passengerPrice[0]} ₽`
                            : driver.price < passengerPrice[0]
                            ? `-${passengerPrice[0] - driver.price} ₽`
                            : 'Ваша цена'}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
