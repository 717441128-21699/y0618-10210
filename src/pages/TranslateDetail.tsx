import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  HeartPulse,
  Scale,
  GraduationCap,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  MapPin,
  Video,
  Phone,
  MessageCircle,
  Send,
  Star,
  CheckCircle2,
  AlertCircle,
  Award,
  FileText,
  Clock3,
  Sparkles,
  UserCheck,
  Heart,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { TagChip } from '@/components/ui/TagChip';
import { useTranslateStore } from '@/stores/translateStore';
import { useUserStore } from '@/stores/userStore';
import { cn } from '@/lib/utils';

const statusConfig = {
  pending: {
    label: '待接单',
    bgColor: 'bg-gradient-to-r from-slate-400 to-slate-500',
    textColor: 'text-white',
    badgeVariant: 'default' as const,
    desc: '正在等待志愿者接单...',
  },
  accepted: {
    label: '已确认',
    bgColor: 'bg-gradient-to-r from-emerald-400 to-teal-500',
    textColor: 'text-white',
    badgeVariant: 'success' as const,
    desc: '译员已接单，请保持电话畅通',
  },
  completed: {
    label: '已完成',
    bgColor: 'bg-gradient-to-r from-blue-400 to-indigo-500',
    textColor: 'text-white',
    badgeVariant: 'info' as const,
    desc: '服务已完成，感谢您的使用',
  },
  cancelled: {
    label: '已取消',
    bgColor: 'bg-gradient-to-r from-amber-400 to-orange-500',
    textColor: 'text-white',
    badgeVariant: 'warning' as const,
    desc: '订单已取消',
  },
};

const urgencyMap = {
  normal: { label: '普通', variant: 'default' as const, icon: Clock3 },
  urgent: { label: '紧急', variant: 'warning' as const, icon: AlertCircle },
  vip: { label: '特急', variant: 'danger' as const, icon: Sparkles },
};

interface ChatMessage {
  id: string;
  role: 'client' | 'translator';
  content: string;
  time: string;
}

interface SceneInfo {
  name: string;
  icon: typeof HeartPulse;
  gradient: string;
}

const sceneMap: Record<string, SceneInfo> = {
  medical: { name: '医疗', icon: HeartPulse, gradient: 'from-red-400 to-rose-500' },
  court: { name: '法律', icon: Scale, gradient: 'from-amber-400 to-orange-500' },
  education: { name: '教育', icon: GraduationCap, gradient: 'from-blue-400 to-indigo-500' },
  business: { name: '商务', icon: Briefcase, gradient: 'from-emerald-400 to-teal-500' },
  other: { name: '其他', icon: Building2, gradient: 'from-slate-400 to-slate-600' },
};

const mockMessages: ChatMessage[] = [
  { id: 'm1', role: 'client', content: '您好，请问您确定能来吗？', time: '昨天 15:30' },
  { id: 'm2', role: 'translator', content: '您好！可以的，我已经确认了时间。请问您在医院的具体位置是哪里？', time: '昨天 15:32' },
  { id: 'm3', role: 'client', content: '好的，我在心内科门诊2楼，挂号后在3诊室门口等您。大概9点左右可以吗？', time: '昨天 15:35' },
  { id: 'm4', role: 'translator', content: '没问题，我会提前15分钟到的。请问您有什么特殊的病情需要我提前了解的吗？这样翻译会更准确。', time: '昨天 15:38' },
  { id: 'm5', role: 'client', content: '主要是高血压复诊，需要问医生最近头晕的问题，还有调整用药的事情。谢谢您！', time: '昨天 15:40' },
  { id: 'm6', role: 'translator', content: '好的，我记下了！放心，我会帮您准确传达的。明天见~', time: '昨天 15:42' },
];

export default function TranslateDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { currentOrder, loading, fetchOrders, completeOrder, acceptOrder } = useTranslateStore();
  const { user, fetchUser } = useUserStore();

  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchOrders();
    fetchUser();
  }, [fetchOrders, fetchUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const orderData = useMemo(() => {
    if (currentOrder && currentOrder.id === orderId) {
      const title = currentOrder.title || '';
      let scene = 'other';
      if (/医院|医|就诊|看病|体检|检查|产检/.test(title)) scene = 'medical';
      else if (/法院|法庭|法律|开庭|律师|诉讼/.test(title)) scene = 'court';
      else if (/学校|老师|家长会|教育|培训|上课/.test(title)) scene = 'education';
      else if (/商务|会议|面试|公司|企业|洽谈/.test(title)) scene = 'business';

      const deadline = new Date(currentOrder.deadline);
      return {
        id: currentOrder.id,
        orderNo: `ORD-${currentOrder.id.toUpperCase()}`,
        scene,
        title,
        date: deadline.toLocaleDateString('zh-CN'),
        time: '09:00 - 11:30',
        location: currentOrder.type === 'video' ? 'online' : 'offline',
        address: currentOrder.type === 'video' ? '腾讯会议 ID: 856-234-128' : '北京市协和医院东院区心内科门诊',
        urgency: currentOrder.urgency as keyof typeof urgencyMap,
        status: currentOrder.status as keyof typeof statusConfig,
        budget: currentOrder.budget,
        description: currentOrder.description,
        createdAt: new Date(currentOrder.createdAt).toLocaleString('zh-CN'),
        translator: currentOrder.translatorName
          ? {
              id: currentOrder.translatorId || 't001',
              name: currentOrder.translatorName,
              avatar:
                currentOrder.translatorAvatar ||
                'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face',
              rating: 4.9,
              completedOrders: 128,
              certifications: ['国家级手语翻译证书', '医疗翻译专项认证'],
              intro: '5年专业手语翻译经验，擅长医疗场景翻译，累计服务128次，好评率99.2%。',
              phone: '138****6789',
            }
          : null,
        review: currentOrder.review
          ? {
              rating: currentOrder.rating || 5,
              content: currentOrder.review,
            }
          : null,
      };
    }

    return {
      id: orderId || 't001',
      orderNo: `ORD-${(orderId || 't001').toUpperCase()}`,
      scene: 'medical',
      title: '三甲医院心内科就诊陪同翻译',
      date: '2026年6月20日',
      time: '09:00 - 11:30',
      location: 'offline',
      address: '北京市协和医院东院区心内科门诊3诊室',
      urgency: 'urgent',
      status: 'accepted',
      budget: 400,
      description:
        '需要陪同完成心内科就诊，包括挂号、问诊、心电图检查、抽血化验、取药等环节。患者有5年高血压史，近期频繁出现头晕症状，需要咨询医生是否需要调整用药方案。要求译员熟悉心内科相关医学术语，沟通耐心细致。',
      createdAt: '2026-06-17 14:22:08',
      translator: {
        id: 't001',
        name: '周慧敏',
        avatar:
          'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face',
        rating: 4.9,
        completedOrders: 128,
        certifications: ['国家级手语翻译证书', '医疗翻译专项认证', '心理援助资格证'],
        intro:
          '5年专业手语翻译经验，擅长医疗和法律场景翻译，累计服务128次，好评率99.2%。性格开朗有耐心，善于理解听障人士的表达习惯。',
        phone: '138****6789',
      },
      review: null,
    };
  }, [currentOrder, orderId]);

  const statusInfo = statusConfig[orderData.status];
  const sceneInfo = sceneMap[orderData.scene];
  const SceneIcon = sceneInfo.icon;
  const urgencyInfo = urgencyMap[orderData.urgency];
  const UrgencyIcon = urgencyInfo.icon;

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `m${Date.now()}`,
        role: 'client',
        content: newMessage.trim(),
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setNewMessage('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `m${Date.now() + 1}`,
          role: 'translator',
          content: '收到！我这边没问题的~',
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  const submitReview = async () => {
    setIsSubmittingReview(true);
    if (orderId) {
      await completeOrder(orderId, rating, reviewText);
    }
    setTimeout(() => setIsSubmittingReview(false), 800);
  };

  return (
    <div className="min-h-full animate-fade-in">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white shadow-card border border-surface-border/60 flex items-center justify-center text-text-secondary hover:text-primary-600 hover:shadow-card-hover transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-text-primary">预约详情</h1>
            <span className="text-xs text-text-tertiary font-mono">订单号：{orderData.orderNo}</span>
          </div>
        </div>
        <Badge variant={statusInfo.badgeVariant} dot className="text-sm px-4 py-1.5">
          {statusInfo.label}
        </Badge>
      </div>

      <div
        className={cn(
          'rounded-3xl p-6 mb-6 shadow-elevation text-white overflow-hidden relative animate-fade-in-up',
          statusInfo.bgColor
        )}
      >
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white/10" />
        <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-white/10" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
            <SceneIcon className="w-10 h-10 text-white drop-shadow" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold truncate">{orderData.title}</h2>
              <TagChip
                variant={urgencyInfo.variant === 'danger' ? 'danger' : urgencyInfo.variant === 'warning' ? 'warning' : 'default'}
                className="bg-white/20 !border-white/30 text-white !bg-opacity-100 shrink-0"
              >
                <UrgencyIcon className="w-3.5 h-3.5" />
                {urgencyInfo.label}
              </TagChip>
            </div>
            <p className="text-white/80 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {statusInfo.desc}
            </p>
          </div>

          <div className="md:text-right">
            <p className="text-white/70 text-xs mb-1">预算金额</p>
            <p className="text-4xl font-bold">¥{orderData.budget}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-surface-card rounded-2xl shadow-card border border-surface-border/60 p-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <h3 className="font-bold text-text-primary mb-5 flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5 text-primary-600" />
              需求详情
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  label: '服务场景',
                  value: sceneInfo.name,
                  icon: SceneIcon,
                  gradient: sceneInfo.gradient,
                },
                {
                  label: '服务日期',
                  value: orderData.date,
                  icon: Calendar,
                  gradient: 'from-blue-400 to-indigo-500',
                },
                {
                  label: '服务时间',
                  value: orderData.time,
                  icon: Clock,
                  gradient: 'from-violet-400 to-purple-500',
                },
                {
                  label: '服务方式',
                  value: orderData.location === 'online' ? '线上视频会议' : '线下到场陪同',
                  icon: orderData.location === 'online' ? Video : MapPin,
                  gradient:
                    orderData.location === 'online' ? 'from-accent-mint-400 to-teal-500' : 'from-accent-orange-400 to-amber-500',
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-4 rounded-xl bg-surface-bg/50 hover:bg-surface-bg transition-colors"
                  >
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0',
                        item.gradient
                      )}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-text-tertiary mb-0.5">{item.label}</p>
                      <p className="font-semibold text-text-primary truncate">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 p-4 rounded-xl bg-primary-50/70 border border-primary-100">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent-orange-500 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-xs text-primary-600 font-medium mb-1">
                    {orderData.location === 'online' ? '线上会议信息' : '详细服务地址'}
                  </p>
                  <p className="text-text-primary font-medium break-all">{orderData.address}</p>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs text-text-tertiary mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                需求描述
              </p>
              <p className="text-sm text-text-secondary leading-relaxed p-4 bg-surface-bg/50 rounded-xl border border-surface-border/40">
                {orderData.description}
              </p>
            </div>
          </div>

          <div className="bg-surface-card rounded-2xl shadow-card border border-surface-border/60 overflow-hidden animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="p-5 border-b border-surface-border/60 flex items-center justify-between">
              <h3 className="font-bold text-text-primary flex items-center gap-2 text-lg">
                <MessageCircle className="w-5 h-5 text-primary-600" />
                沟通面板
              </h3>
              <Badge variant="success" dot>
                {messages.length} 条消息
              </Badge>
            </div>

            <div className="h-80 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-surface-bg/30 to-transparent">
              {messages.map((msg, idx) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex gap-3 animate-fade-in-up',
                    msg.role === 'client' ? 'flex-row-reverse' : 'flex-row'
                  )}
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <Avatar
                    src={
                      msg.role === 'client'
                        ? user?.avatar
                        : orderData.translator?.avatar
                    }
                    alt={msg.role === 'client' ? user?.name || '我' : orderData.translator?.name || '译员'}
                    fallback={msg.role === 'client' ? '我' : orderData.translator?.name || '译'}
                    size="sm"
                  />
                  <div className={cn('max-w-[75%]', msg.role === 'client' ? 'items-end' : 'items-start')}>
                    <div
                      className={cn(
                        'px-4 py-2.5 rounded-2xl text-sm shadow-sm',
                        msg.role === 'client'
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-tr-md'
                          : 'bg-white border border-surface-border/60 text-text-primary rounded-tl-md'
                      )}
                    >
                      {msg.content}
                    </div>
                    <p
                      className={cn(
                        'text-[10px] text-text-tertiary mt-1',
                        msg.role === 'client' ? 'text-right' : 'text-left'
                      )}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-surface-border/60 bg-white">
              <div className="flex items-center gap-3">
                <Avatar
                  src={user?.avatar}
                  alt={user?.name || '我'}
                  fallback={user?.name || '我'}
                  size="sm"
                />
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="输入消息..."
                    className="w-full px-4 py-2.5 pr-14 rounded-full border-2 border-surface-border bg-surface-bg text-sm text-text-primary placeholder:text-surface-muted focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className={cn(
                      'absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200',
                      newMessage.trim()
                        ? 'bg-gradient-accent text-white shadow-button hover:scale-105'
                        : 'bg-surface-border text-surface-muted cursor-not-allowed'
                    )}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {orderData.status === 'completed' && (
            <div className="bg-surface-card rounded-2xl shadow-card border border-surface-border/60 p-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
              {orderData.review ? (
                <>
                  <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2 text-lg">
                    <Star className="w-5 h-5 text-accent-orange-500" fill="currentColor" />
                    服务评价
                  </h3>
                  <div className="p-5 rounded-xl bg-gradient-to-br from-accent-orange-50 to-accent-yellow-50 border border-accent-orange-100">
                    <div className="flex items-center gap-2 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'w-6 h-6 transition-colors',
                            i < (orderData.review?.rating || 5)
                              ? 'text-accent-orange-500'
                              : 'text-surface-border'
                          )}
                          fill={i < (orderData.review?.rating || 5) ? 'currentColor' : 'none'}
                        />
                      ))}
                      <span className="ml-2 font-bold text-accent-orange-600">
                        {orderData.review?.rating || 5}.0 分
                      </span>
                    </div>
                    <p className="text-text-secondary leading-relaxed">{orderData.review?.content}</p>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2 text-lg">
                    <Sparkles className="w-5 h-5 text-accent-orange-500" />
                    服务评价
                    <span className="text-xs font-normal text-text-tertiary">（服务完成后可评价）</span>
                  </h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-3">整体满意度</label>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <button
                              key={i}
                              onMouseEnter={() => setHoveredRating(i + 1)}
                              onMouseLeave={() => setHoveredRating(0)}
                              onClick={() => setRating(i + 1)}
                              className="transition-all duration-200 hover:scale-125 p-1"
                            >
                              <Star
                                className={cn(
                                  'w-8 h-8 transition-colors',
                                  (hoveredRating || rating) > i
                                    ? 'text-accent-orange-500'
                                    : 'text-surface-border'
                                )}
                                fill={(hoveredRating || rating) > i ? 'currentColor' : 'none'}
                              />
                            </button>
                          ))}
                        </div>
                        <span className="text-lg font-bold text-accent-orange-600">
                          {rating}.0 分
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">评价内容</label>
                      <textarea
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows={4}
                        maxLength={500}
                        placeholder="请分享您对本次翻译服务的感受，译员的专业度、沟通是否顺畅、有没有特别值得表扬的地方..."
                        className="w-full px-4 py-3 rounded-xl border-2 border-surface-border bg-white text-sm text-text-primary placeholder:text-surface-muted focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all resize-none"
                      />
                      <div className="flex justify-end mt-2">
                        <span className="text-xs text-text-tertiary">{reviewText.length}/500</span>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        variant="primary"
                        size="lg"
                        loading={isSubmittingReview}
                        onClick={submitReview}
                        leftIcon={<CheckCircle2 className="w-5 h-5" />}
                      >
                        提交评价
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {orderData.translator ? (
            <div className="bg-surface-card rounded-2xl shadow-card border border-surface-border/60 overflow-hidden animate-fade-in-up" style={{ animationDelay: '150ms' }}>
              <div className="bg-gradient-to-r from-primary-500 to-accent-mint-500 p-6 pb-14 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
                <div className="absolute right-10 bottom-0 w-24 h-24 rounded-full bg-white/10" />
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">已接单译员</p>
                    <h3 className="text-xl font-bold text-white mt-1">翻译志愿者</h3>
                  </div>
                  <UserCheck className="w-8 h-8 text-white/80" />
                </div>
              </div>

              <div className="px-6 pb-6">
                <div className="flex items-end justify-between -mt-8 mb-5 relative z-10">
                  <Avatar
                    src={orderData.translator.avatar}
                    alt={orderData.translator.name}
                    fallback={orderData.translator.name}
                    size="xl"
                    className="ring-4 ring-white shadow-lg"
                  />
                  <div className="flex items-center gap-1 bg-accent-orange-50 px-2.5 py-1 rounded-full">
                    <Star className="w-4 h-4 text-accent-orange-500" fill="currentColor" />
                    <span className="text-sm font-bold text-accent-orange-600">
                      {orderData.translator.rating}
                    </span>
                  </div>
                </div>

                <h4 className="text-lg font-bold text-text-primary mb-1">
                  {orderData.translator.name}
                </h4>
                <p className="text-sm text-text-tertiary mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  累计服务 <span className="font-semibold text-primary-600">{orderData.translator.completedOrders}</span> 次
                </p>

                <p className="text-sm text-text-secondary leading-relaxed mb-5">
                  {orderData.translator.intro}
                </p>

                <div className="mb-5">
                  <p className="text-xs font-medium text-text-tertiary mb-2">资质认证</p>
                  <div className="space-y-2">
                    {orderData.translator.certifications.map((cert, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-100"
                      >
                        <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-sm text-emerald-700 font-medium">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="secondary"
                    leftIcon={<Phone className="w-4 h-4" />}
                    className="w-full"
                  >
                    联系电话
                  </Button>
                  <Button
                    variant="primary"
                    leftIcon={<MessageCircle className="w-4 h-4" />}
                    className="w-full"
                  >
                    私信沟通
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            orderData.status === 'pending' && (
              <div className="bg-surface-card rounded-2xl shadow-card border border-surface-border/60 p-6 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                <div className="text-center py-8">
                  <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-4 animate-pulse">
                    <Heart className="w-10 h-10 text-slate-400" />
                  </div>
                  <h4 className="font-bold text-text-primary text-lg mb-2">等待志愿者接单</h4>
                  <p className="text-sm text-text-tertiary max-w-xs mx-auto leading-relaxed">
                    我们正在为您匹配最合适的手语翻译志愿者，通常会在24小时内有译员接单
                  </p>
                </div>
                <Button variant="primary" size="lg" className="w-full" onClick={() => acceptOrder(orderId || 't001')}>
                  模拟译员接单（演示）
                </Button>
              </div>
            )
          )}

          <div className="bg-surface-card rounded-2xl shadow-card border border-surface-border/60 p-6 animate-fade-in-up" style={{ animationDelay: '250ms' }}>
            <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
              <Clock3 className="w-5 h-5 text-primary-600" />
              订单信息
            </h3>
            <div className="space-y-3">
              {[
                { label: '订单编号', value: orderData.orderNo, mono: true },
                { label: '创建时间', value: orderData.createdAt },
                { label: '订单状态', value: statusInfo.label, highlight: true },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2.5 border-b border-surface-border/40 last:border-0"
                >
                  <span className="text-sm text-text-tertiary">{item.label}</span>
                  <span
                    className={cn(
                      'text-sm font-medium',
                      item.mono && 'font-mono text-text-primary',
                      item.highlight && statusInfo.textColor,
                      item.highlight && 'bg-clip-text bg-gradient-primary'
                    )}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {orderData.status === 'accepted' && (
            <div className="bg-gradient-to-br from-accent-mint-50 to-primary-50 border border-accent-mint-200 rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '350ms' }}>
              <h3 className="font-bold text-primary-700 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent-mint-600" />
                温馨提示
              </h3>
              <ul className="space-y-2 text-sm text-primary-700/90">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-mint-500 mt-2 shrink-0" />
                  请提前确认好见面地点和时间
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-mint-500 mt-2 shrink-0" />
                  保持手机畅通，方便译员联系
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-mint-500 mt-2 shrink-0" />
                  如遇特殊情况，请提前24小时取消
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-mint-500 mt-2 shrink-0" />
                  服务完成后记得给译员评价哦~
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
