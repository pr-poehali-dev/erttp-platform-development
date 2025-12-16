import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

export default function Admin() {
  const [minPrice, setMinPrice] = useState('150');
  const [commission, setCommission] = useState('15');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  const stats = {
    totalRides: 1247,
    activeDrivers: 89,
    todayRevenue: 125430,
    avgPrice: 385
  };

  const handleLogin = () => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
      toast({
        title: '✅ Успешный вход',
        description: 'Добро пожаловать в админ-панель'
      });
    } else {
      toast({
        title: '❌ Ошибка',
        description: 'Неверный пароль',
        variant: 'destructive'
      });
    }
  };

  const handleSaveSettings = () => {
    const minPriceNum = parseInt(minPrice);
    const commissionNum = parseInt(commission);

    if (minPriceNum < 50) {
      toast({
        title: '⚠️ Слишком низкая цена',
        description: 'Минимальная цена не может быть меньше 50 ₽',
        variant: 'destructive'
      });
      return;
    }

    if (commissionNum < 0 || commissionNum > 50) {
      toast({
        title: '⚠️ Недопустимая комиссия',
        description: 'Комиссия должна быть от 0% до 50%',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: '✅ Настройки сохранены',
      description: `Минимальная цена: ${minPrice} ₽, Комиссия: ${commission}%`
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <Icon name="Shield" className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold mb-2">Админ-панель</h1>
            <p className="text-muted-foreground">Введите пароль для доступа</p>
          </div>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="h-12"
            />
            <Button onClick={handleLogin} className="w-full h-12">
              <Icon name="LogIn" size={20} className="mr-2" />
              Войти
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Icon name="Settings" className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Админ-панель</h1>
              <p className="text-sm text-muted-foreground">Управление настройками сервиса</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setIsAuthenticated(false);
              setPassword('');
            }}
          >
            <Icon name="LogOut" size={18} className="mr-2" />
            Выйти
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Icon name="TrendingUp" className="text-primary" size={24} />
              <Badge variant="secondary">+12%</Badge>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.totalRides}</div>
            <p className="text-sm text-muted-foreground">Всего поездок</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Icon name="Users" className="text-primary" size={24} />
              <Badge variant="secondary">Онлайн</Badge>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.activeDrivers}</div>
            <p className="text-sm text-muted-foreground">Активных водителей</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Icon name="DollarSign" className="text-primary" size={24} />
              <Badge variant="secondary">Сегодня</Badge>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.todayRevenue.toLocaleString()} ₽</div>
            <p className="text-sm text-muted-foreground">Выручка</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Icon name="BarChart3" className="text-primary" size={24} />
              <Badge variant="secondary">Средняя</Badge>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.avgPrice} ₽</div>
            <p className="text-sm text-muted-foreground">Цена поездки</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Icon name="DollarSign" size={24} />
              Ценообразование
            </h2>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Минимальная цена поездки
                </label>
                <div className="relative">
                  <Icon name="Ruble" className="absolute left-3 top-3 text-muted-foreground" size={20} />
                  <Input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="pl-11 h-12"
                    min={50}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Пассажиры не смогут установить цену ниже этого порога
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Комиссия сервиса (%)
                </label>
                <div className="relative">
                  <Icon name="Percent" className="absolute left-3 top-3 text-muted-foreground" size={20} />
                  <Input
                    type="number"
                    value={commission}
                    onChange={(e) => setCommission(e.target.value)}
                    className="pl-11 h-12"
                    min={0}
                    max={50}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Процент от стоимости поездки, который получает сервис
                </p>
              </div>

              <Button onClick={handleSaveSettings} className="w-full h-12">
                <Icon name="Save" size={20} className="mr-2" />
                Сохранить настройки
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Icon name="Clock" size={24} />
              Последние поездки
            </h2>

            <div className="space-y-3">
              {[
                { id: 1, from: 'ул. Ленина, 25', to: 'пр. Победы, 14', price: 350, time: '5 мин назад' },
                { id: 2, from: 'ТЦ Галерея', to: 'Аэропорт', price: 550, time: '12 мин назад' },
                { id: 3, from: 'Парк Горького', to: 'Вокзал', price: 250, time: '18 мин назад' },
                { id: 4, from: 'Театр', to: 'Ресторан', price: 420, time: '25 мин назад' }
              ].map((ride) => (
                <div key={ride.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{ride.from} → {ride.to}</p>
                    <p className="text-xs text-muted-foreground">{ride.time}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-semibold">{ride.price} ₽</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
