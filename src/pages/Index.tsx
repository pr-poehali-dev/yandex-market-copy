import { useState, useEffect } from 'react';
import AuthModal from '@/components/AuthModal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#1A1F2C', '#F59E0B', '#10B981', '#3B82F6'];

const salesData = [
  { month: 'Янв', sales: 4200, orders: 42 },
  { month: 'Фев', sales: 5100, orders: 51 },
  { month: 'Мар', sales: 6800, orders: 68 },
  { month: 'Апр', sales: 7200, orders: 72 },
  { month: 'Май', sales: 8900, orders: 89 },
  { month: 'Июн', sales: 9600, orders: 96 },
];

const categoryData = [
  { name: 'Электроника', value: 4500 },
  { name: 'Одежда', value: 3200 },
  { name: 'Книги', value: 2100 },
  { name: 'Дом и сад', value: 1800 },
];

const products = [
  {
    id: 1,
    name: 'Беспроводные наушники Premium',
    price: 12990,
    category: 'Электроника',
    sales: 342,
    stock: 87,
    rating: 4.8,
    image: 'https://cdn.poehali.dev/projects/3b9c8aba-f919-4454-b9da-486f7f8bcff4/files/b46b1418-eb38-483c-9542-308907f0e9ee.jpg',
  },
  {
    id: 2,
    name: 'Кожаный рюкзак Business',
    price: 8990,
    category: 'Аксессуары',
    sales: 256,
    stock: 43,
    rating: 4.9,
    image: 'https://cdn.poehali.dev/projects/3b9c8aba-f919-4454-b9da-486f7f8bcff4/files/76277a5f-da9d-4c9b-a5ff-1050f37405e9.jpg',
  },
  {
    id: 3,
    name: 'Умные часы Pro Max',
    price: 24990,
    category: 'Электроника',
    sales: 189,
    stock: 62,
    rating: 4.7,
    image: 'https://cdn.poehali.dev/projects/3b9c8aba-f919-4454-b9da-486f7f8bcff4/files/63a1e0ac-8416-4d50-a577-eba70fdd3fba.jpg',
  },
  {
    id: 4,
    name: 'Дизайнерский светильник',
    price: 6490,
    category: 'Дом и интерьер',
    sales: 421,
    stock: 128,
    rating: 4.6,
    image: 'https://cdn.poehali.dev/projects/3b9c8aba-f919-4454-b9da-486f7f8bcff4/files/c6203e04-8718-4cbb-986e-1fb3ee566c5c.jpg',
  },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authStatus = params.get('auth');
    const userData = params.get('user');

    if (authStatus === 'success' && userData) {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(userData));
        setUser(parsedUser);
        window.history.replaceState({}, '', '/');
      } catch (e) {
        console.error('Failed to parse user data');
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="border-b bg-white/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold tracking-tight">MARKET</h1>
              <nav className="hidden md:flex gap-6">
                {['Главная', 'Каталог', 'Продавцам', 'Избранное', 'Поддержка'].map((item) => (
                  <button
                    key={item}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Icon name="Search" size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <Icon name="Heart" size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <Icon name="ShoppingCart" size={20} />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => user ? null : setAuthModalOpen(true)}
              >
                {user ? (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold">
                      {user.name?.[0] || user.email?.[0] || 'U'}
                    </span>
                  </div>
                ) : (
                  <Icon name="User" size={20} />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="catalog">Каталог товаров</TabsTrigger>
            <TabsTrigger value="seller">Кабинет продавца</TabsTrigger>
          </TabsList>

          <TabsContent value="catalog" className="space-y-8">
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">Премиум коллекция</h2>
                  <p className="text-muted-foreground mt-1">Лучшие товары с доставкой по всей России</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Icon name="SlidersHorizontal" size={16} className="mr-2" />
                    Фильтры
                  </Button>
                  <Button variant="outline" size="sm">
                    <Icon name="ArrowUpDown" size={16} className="mr-2" />
                    Сортировка
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <Card
                    key={product.id}
                    className="group overflow-hidden hover:shadow-xl transition-all duration-300 animate-scale-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-3 right-3 bg-white/90 text-foreground">
                        <Icon name="Star" size={12} className="mr-1" />
                        {product.rating}
                      </Badge>
                    </div>
                    <div className="p-5">
                      <Badge variant="outline" className="mb-2">
                        {product.category}
                      </Badge>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold">{product.price.toLocaleString()} ₽</span>
                        <span className="text-sm text-muted-foreground">
                          {product.stock} в наличии
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1" size="sm">
                          <Icon name="ShoppingCart" size={16} className="mr-2" />
                          В корзину
                        </Button>
                        <Button variant="outline" size="sm">
                          <Icon name="Heart" size={16} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="seller" className="space-y-6">
            <div className="animate-fade-in">
              <div className="mb-6">
                <h2 className="text-3xl font-bold tracking-tight">Панель управления</h2>
                <p className="text-muted-foreground mt-1">Аналитика и управление вашим магазином</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Общая выручка', value: '₽ 1,234,567', change: '+12.5%', icon: 'TrendingUp' },
                  { label: 'Заказы за месяц', value: '342', change: '+8.2%', icon: 'ShoppingBag' },
                  { label: 'Активных товаров', value: '128', change: '+5', icon: 'Package' },
                  { label: 'Средний чек', value: '₽ 3,610', change: '+3.1%', icon: 'Wallet' },
                ].map((stat, index) => (
                  <Card key={stat.label} className="p-6 animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-lg bg-primary/5">
                        <Icon name={stat.icon as any} size={24} className="text-primary" />
                      </div>
                      <Badge variant="secondary" className="text-green-600 bg-green-50">
                        {stat.change}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Icon name="TrendingUp" size={20} className="mr-2" />
                    Динамика продаж
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="sales"
                        stroke="#1A1F2C"
                        strokeWidth={3}
                        dot={{ fill: '#1A1F2C', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Icon name="BarChart3" size={20} className="mr-2" />
                    Количество заказов
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="orders" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Icon name="PieChart" size={20} className="mr-2" />
                    Продажи по категориям
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {categoryData.map((cat, index) => (
                      <div key={cat.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span>{cat.name}</span>
                        </div>
                        <span className="font-semibold">₽ {cat.value.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="lg:col-span-2 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Icon name="Package" size={20} className="mr-2" />
                      Управление товарами
                    </h3>
                    <Button size="sm">
                      <Icon name="Plus" size={16} className="mr-2" />
                      Добавить товар
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {products.slice(0, 3).map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-white overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {product.sales} продаж · {product.stock} в наличии
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold">₽ {product.price.toLocaleString()}</span>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Icon name="Edit" size={16} />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Icon name="MoreVertical" size={16} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}