import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  MapPin,
  Video,
  Clock,
  ChevronRight,
  Filter,
  Building2,
  GraduationCap,
  Briefcase,
  Scale,
  HeartPulse,
  Layers,
  Users,
} from 'lucide-react';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { useTranslateStore } from '@/stores/translateStore';
import { cn } from '@/lib/utils';
import type { TranslationOrder } from '@/types';

const sceneGradient: Record<string, string> = {
  medical: 'from-red-400 to-rose-500',
  court: 'from-amber-400 to-orange-500',
  education: 'from-blue-400 to-indigo-500',
  meeting: 'from-emerald-400 to-teal-500',
  interview: 'from-violet-400 to-purple-500',
  business: 'from-emerald-400 to-teal-500',
  other: 'from-slate-400 to-slate-600',
};

const sceneNameMap: Record<string, string> = {
  medical: '医疗',
  court: '法律',
  education: '教育',
  meeting: '会议',
  interview: '面试',
  business: '商务',
  other: '其他',
};

const statusTabs = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待接单' },
  { value: 'accepted', label: '已确认' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' },
];

const sceneTags = [
  { id: 'all', name: '全部场景', icon: Layers },
  { id: 'medical', name: '医疗', icon: HeartPulse },
  { id: 'court', name: '开庭', icon: Scale },
  { id: 'education', name: '教育', icon: GraduationCap },
  { id: 'meeting', name: '会议', icon: Users },
  { id: 'business', name: '商务', icon: Briefcase },
  { id: 'other', name: '其他', icon: Building2 },
];

const sceneMap: Record<string, { name: string; icon: typeof HeartPulse; gradient: string }> = {
  medical: { name: '医疗', icon: HeartPulse, gradient: 'from-red-400 to-rose-500' },
  court: { name: '法律', icon: Scale, gradient: 'from-amber-400 to-orange-500' },
  education: { name: '教育', icon: GraduationCap, gradient: 'from-blue-400 to-indigo-500' },
  meeting: { name: '会议', icon: Users, gradient: 'from-emerald-400 to-teal-500' },
  interview: { name: '面试', icon: Briefcase, gradient: 'from-violet-400 to-purple-500' },
  business: { name: '商务', icon: Briefcase, gradient: 'from-emerald-400 to-teal-500' },
  other: { name: '其他', icon: Building2, gradient: 'from-slate-400 to-slate-600' },
};

const urgencyMap = {
  normal: { label: '普通', variant: 'default' as const },
  urgent: { label: '紧急', variant: 'warning' as const },
  vip: { label: '特急', variant: 'danger' as const },
};

const statusMap = {
  pending: { label: '待接单', variant: 'default' as const, dot: true },
  accepted: { label: '已确认', variant: 'success' as const, dot: true },
  completed: { label: '已完成', variant: 'info' as const, dot: true },
  cancelled: { label: '已取消', variant: 'warning' as const, dot: true },
};

type OrderView = TranslationOrder & { time: string; location: 'online' | 'offline' };

export default function TranslateList() {
  const navigate = useNavigate();
  const { orders, loading, fetchOrders, acceptOrder } = useTranslateStore();

  const [activeStatus, setActiveStatus] = useState('all');
  const [activeScene, setActiveScene] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'client' | 'translator'>('all');

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const displayOrders = useMemo<OrderView[]>(() => {
    let result: OrderView[] = orders.map((o) => ({
      ...o,
      time: `${o.startTime || ''} - ${o.endTime || ''}`.trim(),
      location: o.locationType || (o.type === 'video' ? 'online' : 'offline'),
    }));

    if (roleFilter === 'client') {
      result = result.filter((o) => o.clientId === 'u001');
    } else if (roleFilter === 'translator') {
      result = result.filter((o) => o.translatorId === 'u001');
    }

    if (activeStatus !== 'all') {
      result = result.filter((o) => o.status === activeStatus);
    }

    if (activeScene !== 'all') {
      result = result.filter((o) => o.scene === activeScene);
    }

    if (searchKeyword.trim()) {
      const kw = searchKeyword.trim().toLowerCase();
      result = result.filter(
        (o) =>
          (o.title || '').toLowerCase().includes(kw) ||
          (o.description || '').toLowerCase().includes(kw) ||
          (o.address || '').toLowerCase().includes(kw)
      );
    }

    return result;
  }, [orders, roleFilter, activeStatus, activeScene, searchKeyword]);

  const handleAcceptOrder = async (orderId: string) => {
    await acceptOrder(orderId);
  };

  const roleTabs = [
    { value: 'all' as const, label: '全部订单' },
    { value: 'client' as const, label: '我发布的需求' },
    { value: 'translator' as const, label: '我接的服务' },
  ];

  return (
    <div className="min-h-full animate-fade-in">
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex items-center gap-4 flex-1 flex-wrap">
          <h1 className="text-2xl font-bold text-text-primary">翻译预约</h1>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-surface-bg border border-surface-border/60">
            {roleTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setRoleFilter(tab.value)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                  roleFilter === tab.value
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-text-tertiary hover:text-text-secondary'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => navigate('/translate/create')}
        >
          发布需求
        </Button>
      </div>

      <div className="bg-surface-card rounded-2xl shadow-card border border-surface-border/60 p-5 mb-6 animate-fade-in-up">
        <div className="flex flex-col xl:flex-row xl:items-center gap-5">
          <div className="xl:max-w-md w-full">
            <Tabs items={statusTabs} value={activeStatus} onChange={setActiveStatus} />
          </div>

          <div className="h-px xl:h-10 xl:w-px bg-surface-border xl:mx-2" />

          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Filter className="w-4 h-4 text-surface-muted shrink-0" />
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {sceneTags.map((tag) => {
                const TagIcon = tag.icon;
                const isSelected = activeScene === tag.id;
                return (
                  <button
                    key={tag.id}
                    onClick={() => setActiveScene(isSelected ? 'all' : tag.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium whitespace-nowrap shrink-0 transition-all duration-200',
                      isSelected
                        ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                        : 'bg-white text-text-secondary border-surface-border hover:border-primary-300 hover:text-primary-600'
                    )}
                  >
                    <TagIcon className="w-3.5 h-3.5" />
                    {tag.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative w-full xl:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-muted" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="搜索需求..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border-2 border-surface-border bg-white text-sm text-text-primary placeholder:text-surface-muted focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-surface-card rounded-2xl p-6 border border-surface-border/60 animate-pulse"
            >
              <div className="h-24 bg-surface-border/50 rounded-xl" />
            </div>
          ))}
        </div>
      ) : displayOrders.length === 0 ? (
        <EmptyState
          type="default"
          title="暂无翻译需求"
          description={
            activeStatus !== 'all' || activeScene !== 'all'
              ? '当前筛选条件下没有找到匹配的需求，试试调整筛选条件'
              : '还没有翻译需求，点击上方按钮发布第一个需求吧'
          }
          action={
            <Button
              variant="primary"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/translate/create')}
            >
              发布需求
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {displayOrders.map((order, idx) => {
            const scene = sceneMap[order.scene];
            const SceneIcon = scene.icon;
            const urgency = urgencyMap[order.urgency];
            const status = statusMap[order.status];
            const isPending = order.status === 'pending';

            return (
              <div
                key={order.id}
                className={cn(
                  'bg-surface-card rounded-2xl shadow-card border border-surface-border/60 overflow-hidden',
                  'transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 hover:border-primary-200',
                  'animate-fade-in-up'
                )}
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="p-5 flex flex-col sm:flex-row gap-5">
                  <div
                    className={cn(
                      'relative w-24 h-24 rounded-2xl bg-gradient-to-br flex items-center justify-center shrink-0 overflow-hidden',
                      scene.gradient
                    )}
                  >
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
                    <SceneIcon className="w-12 h-12 text-white relative z-10 drop-shadow-lg" />
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-white/10" />
                    <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-white/15" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap mb-2 sm:mb-0">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-white text-xs font-medium bg-gradient-to-br',
                            sceneGradient[order.scene] || sceneGradient.other
                          )}
                        >
                          <SceneIcon className="w-3.5 h-3.5" />
                          {sceneNameMap[order.scene] || '翻译'}
                        </span>
                        {order.clientId === 'u001' && (
                          <Badge variant="info">我发布的</Badge>
                        )}
                        {order.translatorId === 'u001' && (
                          <Badge variant="success">我接的</Badge>
                        )}
                        <Badge variant={urgency.variant}>
                          {urgency.label}
                        </Badge>
                        <Badge variant={status.variant} dot={status.dot}>
                          {status.label}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold text-text-primary flex-1 min-w-[200px]">
                        {order.title}
                      </h3>
                    </div>

                    <p className="text-sm text-text-tertiary mb-4 line-clamp-2">
                      {order.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-primary-500" />
                        <span>{order.date}</span>
                        <span className="text-text-tertiary mx-1">·</span>
                        <span>{order.time}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {order.location === 'online' ? (
                          <>
                            <Video className="w-4 h-4 text-accent-mint-500" />
                            <span className="text-accent-mint-600 font-medium">线上</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="w-4 h-4 text-accent-orange-500" />
                            <span>线下</span>
                          </>
                        )}
                        <span className="text-text-tertiary mx-1">·</span>
                        <span className="text-text-tertiary max-w-48 truncate">
                          {order.address}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-text-tertiary">预算</span>
                        <span className="font-bold text-accent-orange-500">¥{order.budget}</span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:pl-5 sm:border-l sm:border-surface-border/60">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/translate/${order.id}`)}
                      rightIcon={<ChevronRight className="w-4 h-4" />}
                    >
                      查看详情
                    </Button>

                    {isPending && roleFilter !== 'client' && (
                      <Button
                        variant="primary"
                        size="md"
                        onClick={() => handleAcceptOrder(order.id)}
                        className="w-full sm:w-auto"
                      >
                        立即接单
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
