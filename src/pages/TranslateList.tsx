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
} from 'lucide-react';
import { Tabs } from '@/components/ui/Tabs';
import { TagChip } from '@/components/ui/TagChip';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { useTranslateStore } from '@/stores/translateStore';
import { cn } from '@/lib/utils';

const statusTabs = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待接单' },
  { value: 'accepted', label: '已确认' },
  { value: 'completed', label: '已完成' },
];

const sceneTags = [
  { id: 'all', name: '全部场景', icon: Layers },
  { id: 'medical', name: '医疗', icon: HeartPulse },
  { id: 'court', name: '开庭', icon: Scale },
  { id: 'education', name: '教育', icon: GraduationCap },
  { id: 'business', name: '商务', icon: Briefcase },
  { id: 'other', name: '其他', icon: Building2 },
];

interface SceneInfo {
  name: string;
  icon: typeof HeartPulse;
  bgColor: string;
  textColor: string;
  gradient: string;
}

const sceneMap: Record<string, SceneInfo> = {
  medical: {
    name: '医疗',
    icon: HeartPulse,
    bgColor: 'bg-red-50',
    textColor: 'text-red-500',
    gradient: 'from-red-400 to-rose-500',
  },
  court: {
    name: '法律',
    icon: Scale,
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-600',
    gradient: 'from-amber-400 to-orange-500',
  },
  education: {
    name: '教育',
    icon: GraduationCap,
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-500',
    gradient: 'from-blue-400 to-indigo-500',
  },
  business: {
    name: '商务',
    icon: Briefcase,
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-500',
    gradient: 'from-emerald-400 to-teal-500',
  },
  other: {
    name: '其他',
    icon: Building2,
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-500',
    gradient: 'from-purple-400 to-violet-500',
  },
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

interface MockOrder {
  id: string;
  scene: keyof typeof sceneMap;
  title: string;
  date: string;
  time: string;
  location: 'online' | 'offline';
  address: string;
  urgency: keyof typeof urgencyMap;
  status: keyof typeof statusMap;
  budget: number;
  description: string;
}

const mockOrders: MockOrder[] = [
  {
    id: 't001',
    scene: 'medical',
    title: '三甲医院心内科就诊陪同翻译',
    date: '2026-06-20',
    time: '09:00 - 11:30',
    location: 'offline',
    address: '北京市协和医院东院区',
    urgency: 'urgent',
    status: 'pending',
    budget: 400,
    description: '需要陪同完成心内科就诊，包括挂号、问诊、检查、取药等环节。患者有高血压史，需要熟悉医疗相关手语。',
  },
  {
    id: 't002',
    scene: 'court',
    title: '民事纠纷庭审手语翻译',
    date: '2026-06-22',
    time: '14:00 - 17:00',
    location: 'offline',
    address: '朝阳区人民法院第三法庭',
    urgency: 'vip',
    status: 'accepted',
    budget: 1200,
    description: '合同纠纷案件出庭翻译，需要熟悉法律术语和庭审流程，要求持有手语翻译资格证书。',
  },
  {
    id: 't003',
    scene: 'education',
    title: '小学家长会陪同翻译',
    date: '2026-06-21',
    time: '19:00 - 21:00',
    location: 'offline',
    address: '海淀区实验小学阶梯教室',
    urgency: 'normal',
    status: 'pending',
    budget: 260,
    description: '孩子的学期家长会，需要翻译老师的发言内容，以及帮助我与老师进行沟通交流。',
  },
  {
    id: 't004',
    scene: 'business',
    title: '商务视频会议实时翻译',
    date: '2026-06-19',
    time: '10:00 - 12:00',
    location: 'online',
    address: '腾讯会议 ID: 856-234-128',
    urgency: 'urgent',
    status: 'completed',
    budget: 600,
    description: '与供应商的季度业务复盘会议，需要实时进行口语和手语双向翻译。',
  },
  {
    id: 't005',
    scene: 'medical',
    title: '产科产检陪同翻译',
    date: '2026-06-25',
    time: '08:30 - 10:30',
    location: 'offline',
    address: '北京妇产医院',
    urgency: 'normal',
    status: 'pending',
    budget: 300,
    description: '孕24周常规产检陪同，需要翻译医生的各项检查建议和注意事项。',
  },
  {
    id: 't006',
    scene: 'other',
    title: '企业入职培训翻译协助',
    date: '2026-06-23',
    time: '09:00 - 18:00',
    location: 'offline',
    address: '西城区金融街T3写字楼',
    urgency: 'normal',
    status: 'pending',
    budget: 1500,
    description: '新员工为期一天的入职培训，需要全程同步翻译培训内容，并协助与同事沟通。',
  },
];

export default function TranslateList() {
  const navigate = useNavigate();
  const { orders, loading, fetchOrders, acceptOrder } = useTranslateStore();

  const [activeStatus, setActiveStatus] = useState('all');
  const [activeScene, setActiveScene] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isVolunteer, setIsVolunteer] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const displayOrders = useMemo(() => {
    let result: (MockOrder | any)[] = orders.length > 0 ? orders : mockOrders;

    if (activeStatus !== 'all') {
      result = result.filter((o) => o.status === activeStatus);
    }

    if (activeScene !== 'all') {
      result = result.filter((o) => {
        const title = o.title || '';
        const sceneKeywords: Record<string, string[]> = {
          medical: ['医院', '医', '就诊', '看病', '体检', '检查', '产检'],
          court: ['法院', '法庭', '法律', '开庭', '律师', '诉讼'],
          education: ['学校', '老师', '家长会', '教育', '培训', '上课'],
          business: ['商务', '会议', '面试', '公司', '企业', '洽谈'],
        };
        const keywords = sceneKeywords[activeScene] || [];
        return keywords.some((k) => title.includes(k));
      });
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

    return result.map((o, idx) => {
      const title = o.title || o.description?.slice(0, 20) || '翻译需求';
      let scene: keyof typeof sceneMap = 'other';
      if (/医院|医|就诊|看病|体检|检查|产检/.test(title)) scene = 'medical';
      else if (/法院|法庭|法律|开庭|律师|诉讼/.test(title)) scene = 'court';
      else if (/学校|老师|家长会|教育|培训|上课/.test(title)) scene = 'education';
      else if (/商务|会议|面试|公司|企业|洽谈/.test(title)) scene = 'business';

      return {
        id: o.id,
        scene,
        title,
        date: o.deadline ? new Date(o.deadline).toLocaleDateString('zh-CN') : mockOrders[idx % mockOrders.length].date,
        time: mockOrders[idx % mockOrders.length].time,
        location: idx % 2 === 0 ? 'offline' : 'online',
        address: o.title?.includes('视频') ? '腾讯会议 ID: 856-234-128' : mockOrders[idx % mockOrders.length].address,
        urgency: (o.urgency as keyof typeof urgencyMap) || 'normal',
        status: (o.status as keyof typeof statusMap) || 'pending',
        budget: o.budget || 300,
        description: o.description || mockOrders[idx % mockOrders.length].description,
      };
    });
  }, [orders, activeStatus, activeScene, searchKeyword]);

  const handleAcceptOrder = async (orderId: string) => {
    await acceptOrder(orderId);
  };

  return (
    <div className="min-h-full animate-fade-in">
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
          <h1 className="text-2xl font-bold text-text-primary">翻译预约</h1>
          <Badge variant={isVolunteer ? 'success' : 'info'} dot>
            {isVolunteer ? '志愿者模式' : '用户模式'}
          </Badge>
          <button
            onClick={() => setIsVolunteer(!isVolunteer)}
            className="text-xs text-primary-600 font-medium hover:text-primary-700 underline underline-offset-2"
          >
            切换角色
          </button>
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
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-lg font-bold text-text-primary truncate flex-1">
                        {order.title}
                      </h3>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant={urgency.variant} dot>
                          {urgency.label}
                        </Badge>
                        <Badge variant={status.variant} dot={status.dot}>
                          {status.label}
                        </Badge>
                      </div>
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
                      onClick={() => navigate(`/translate/detail/${order.id}`)}
                      rightIcon={<ChevronRight className="w-4 h-4" />}
                    >
                      查看详情
                    </Button>

                    {isVolunteer && isPending && (
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
