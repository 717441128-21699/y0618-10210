import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  HeartPulse,
  Scale,
  GraduationCap,
  Building2,
  Briefcase,
  Users,
  Calendar,
  Clock,
  MapPin,
  Video,
  Link2,
  FileText,
  AlertCircle,
  Upload,
  Paperclip,
  CheckCircle2,
  X,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TagChip } from '@/components/ui/TagChip';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useTranslateStore } from '@/stores/translateStore';
import { cn } from '@/lib/utils';

type SceneType = 'medical' | 'court' | 'education' | 'meeting' | 'interview' | 'other';
type UrgencyType = 'normal' | 'urgent' | 'vip';
type LocationType = 'online' | 'offline';

const steps = [
  { id: 1, name: '选择场景' },
  { id: 2, name: '时间地点' },
  { id: 3, name: '详细信息' },
  { id: 4, name: '确认提交' },
];

const scenes: {
  id: SceneType;
  name: string;
  icon: typeof HeartPulse;
  desc: string;
  gradient: string;
  bgColor: string;
}[] = [
  {
    id: 'medical',
    name: '医疗',
    icon: HeartPulse,
    desc: '医院就诊、体检、取药等医疗场景陪同翻译',
    gradient: 'from-red-400 to-rose-500',
    bgColor: 'bg-red-50',
  },
  {
    id: 'court',
    name: '法庭',
    icon: Scale,
    desc: '法庭诉讼、调解、法律咨询等法律事务翻译',
    gradient: 'from-amber-400 to-orange-500',
    bgColor: 'bg-amber-50',
  },
  {
    id: 'education',
    name: '学校',
    icon: GraduationCap,
    desc: '家长会、学校活动、教育咨询等教育场景翻译',
    gradient: 'from-blue-400 to-indigo-500',
    bgColor: 'bg-blue-50',
  },
  {
    id: 'meeting',
    name: '会议',
    icon: Users,
    desc: '商务会议、企业培训、团队研讨等会议场景翻译',
    gradient: 'from-emerald-400 to-teal-500',
    bgColor: 'bg-emerald-50',
  },
  {
    id: 'interview',
    name: '面试',
    icon: Briefcase,
    desc: '求职面试、入职沟通、职场交流等职场场景翻译',
    gradient: 'from-violet-400 to-purple-500',
    bgColor: 'bg-violet-50',
  },
  {
    id: 'other',
    name: '其他',
    icon: Building2,
    desc: '其他需要手语翻译的各类生活、工作场景',
    gradient: 'from-slate-400 to-slate-600',
    bgColor: 'bg-slate-50',
  },
];

const urgencyOptions: {
  id: UrgencyType;
  name: string;
  desc: string;
  icon: typeof AlertCircle;
  color: string;
  bgColor: string;
  borderColor: string;
}[] = [
  {
    id: 'normal',
    name: '普通',
    desc: '常规预约，建议提前3天以上',
    icon: Calendar,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
  },
  {
    id: 'urgent',
    name: '紧急',
    desc: '加急处理，24小时内响应',
    icon: AlertCircle,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  {
    id: 'vip',
    name: '特急',
    desc: '最高优先级，立即匹配译员',
    icon: Zap,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
];

const sceneTitleMap: Record<SceneType, string> = {
  medical: '医疗就诊陪同翻译',
  court: '法律事务手语翻译',
  education: '教育场景陪同翻译',
  meeting: '商务会议实时翻译',
  interview: '求职面试协助翻译',
  other: '通用手语翻译服务',
};

export default function TranslateCreate() {
  const navigate = useNavigate();
  const { createOrder, loading } = useTranslateStore();

  const [currentStep, setCurrentStep] = useState(1);

  const [selectedScene, setSelectedScene] = useState<SceneType | null>(null);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [locationType, setLocationType] = useState<LocationType>('offline');
  const [address, setAddress] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<UrgencyType>('normal');
  const [budget, setBudget] = useState(300);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split('T')[0]);
    setStartTime('09:00');
    setEndTime('11:00');
  }, []);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) return selectedScene !== null;
    if (currentStep === 2) {
      return (
        date &&
        startTime &&
        endTime &&
        ((locationType === 'offline' && address.trim()) ||
          (locationType === 'online' && meetingLink.trim()))
      );
    }
    if (currentStep === 3) return description.trim().length >= 10;
    return true;
  };

  const handleSubmit = async () => {
    const scene = selectedScene || 'other';
    await createOrder({
      title: sceneTitleMap[scene],
      description,
      type: locationType === 'online' ? 'video' : 'live',
      source: '中文',
      targetLanguage: 'sign',
      urgency,
      budget,
      deadline: new Date(`${date}T${endTime}`).toISOString(),
      scene,
      date,
      startTime,
      endTime,
      locationType,
      address: locationType === 'offline' ? address : meetingLink,
      meetingLink: locationType === 'online' ? meetingLink : undefined,
    });
    setTimeout(() => navigate('/translate'), 800);
  };

  const sceneInfo = scenes.find((s) => s.id === selectedScene);
  const urgencyInfo = urgencyOptions.find((u) => u.id === urgency);

  return (
    <div className="min-h-full animate-fade-in">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white shadow-card border border-surface-border/60 flex items-center justify-center text-text-secondary hover:text-primary-600 hover:shadow-card-hover transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-text-primary">发布翻译需求</h1>
      </div>

      <div className="mb-8 bg-surface-card rounded-2xl shadow-card border border-surface-border/60 p-6">
        <div className="flex items-center justify-between max-w-3xl mx-auto mb-4">
          {steps.map((step, idx) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <div key={step.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 text-sm font-bold',
                      isCompleted
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/30'
                        : isActive
                        ? 'bg-gradient-accent text-white border-accent-orange-400 shadow-button scale-110'
                        : 'bg-surface-bg text-surface-muted border-surface-border'
                    )}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.id}
                  </div>
                  <span
                    className={cn(
                      'text-xs font-medium transition-colors',
                      isActive ? 'text-primary-600' : isCompleted ? 'text-emerald-600' : 'text-text-tertiary'
                    )}
                  >
                    {step.name}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-3 rounded-full overflow-hidden bg-surface-border">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        currentStep > step.id ? 'w-full bg-emerald-500' : 'w-0'
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <ProgressBar value={(currentStep / 4) * 100} color="orange" size="sm" />
      </div>

      <div className="max-w-4xl mx-auto">
        {currentStep === 1 && (
          <div className="bg-surface-card rounded-2xl shadow-card border border-surface-border/60 p-8 animate-fade-in-up">
            <h2 className="text-lg font-bold text-text-primary mb-2">选择翻译场景</h2>
            <p className="text-sm text-text-tertiary mb-8">
              请选择你需要手语翻译服务的场景类型，我们会为你匹配最合适的专业译员
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scenes.map((scene, idx) => {
                const SceneIcon = scene.icon;
                const isSelected = selectedScene === scene.id;
                return (
                  <button
                    key={scene.id}
                    onClick={() => setSelectedScene(scene.id)}
                    className={cn(
                      'relative p-5 rounded-2xl text-left transition-all duration-300 overflow-hidden group',
                      'animate-fade-in-up',
                      isSelected
                        ? 'bg-white shadow-elevation ring-2 ring-primary-400 scale-[1.02]'
                        : 'bg-white border-2 border-surface-border hover:border-primary-200 hover:shadow-card-hover hover:-translate-y-1'
                    )}
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    <div
                      className={cn(
                        'w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110',
                        scene.gradient
                      )}
                    >
                      <SceneIcon className="w-8 h-8 text-white drop-shadow" />
                    </div>

                    <h3 className="font-bold text-lg text-text-primary mb-1.5 flex items-center gap-2">
                      {scene.name}
                      {isSelected && (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white">
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                      )}
                    </h3>

                    <p className="text-sm text-text-tertiary leading-relaxed">{scene.desc}</p>

                    {isSelected && (
                      <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-primary-600 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-surface-card rounded-2xl shadow-card border border-surface-border/60 p-8 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              {sceneInfo && (
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center',
                    sceneInfo.gradient
                  )}
                >
                  <sceneInfo.icon className="w-5 h-5 text-white" />
                </div>
              )}
              <h2 className="text-lg font-bold text-text-primary">选择时间和地点</h2>
            </div>
            <p className="text-sm text-text-tertiary mb-8 ml-13">
              请填写翻译服务的具体时间和地点信息
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary-500" />
                  服务日期
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-xl border-2 border-surface-border bg-white text-sm text-text-primary focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary-500" />
                    开始时间
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-surface-border bg-white text-sm text-text-primary focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-accent-orange-500" />
                    结束时间
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-surface-border bg-white text-sm text-text-primary focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-text-secondary mb-3">服务方式</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setLocationType('offline')}
                  className={cn(
                    'relative p-5 rounded-2xl border-2 text-left transition-all duration-300',
                    locationType === 'offline'
                      ? 'bg-primary-50 border-primary-400 shadow-sm'
                      : 'bg-white border-surface-border hover:border-primary-200 hover:shadow-sm'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
                        locationType === 'offline'
                          ? 'bg-accent-orange-500 text-white'
                          : 'bg-surface-bg text-surface-muted'
                      )}
                    >
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3
                        className={cn(
                          'font-bold mb-1',
                          locationType === 'offline' ? 'text-primary-700' : 'text-text-primary'
                        )}
                      >
                        线下服务
                      </h3>
                      <p className="text-xs text-text-tertiary">译员到场陪同，面对面翻译</p>
                    </div>
                  </div>
                  {locationType === 'offline' && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle2 className="w-5 h-5 text-primary-600" />
                    </div>
                  )}
                </button>

                <button
                  onClick={() => setLocationType('online')}
                  className={cn(
                    'relative p-5 rounded-2xl border-2 text-left transition-all duration-300',
                    locationType === 'online'
                      ? 'bg-accent-mint-50 border-accent-mint-400 shadow-sm'
                      : 'bg-white border-surface-border hover:border-primary-200 hover:shadow-sm'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
                        locationType === 'online'
                          ? 'bg-accent-mint-500 text-white'
                          : 'bg-surface-bg text-surface-muted'
                      )}
                    >
                      <Video className="w-6 h-6" />
                    </div>
                    <div>
                      <h3
                        className={cn(
                          'font-bold mb-1',
                          locationType === 'online' ? 'text-accent-mint-700' : 'text-text-primary'
                        )}
                      >
                        线上服务
                      </h3>
                      <p className="text-xs text-text-tertiary">远程视频连线，实时翻译</p>
                    </div>
                  </div>
                  {locationType === 'online' && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle2 className="w-5 h-5 text-accent-mint-600" />
                    </div>
                  )}
                </button>
              </div>
            </div>

            {locationType === 'offline' ? (
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent-orange-500" />
                  详细地址
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="请输入具体的服务地址，如：北京市协和医院东院区心内科门诊"
                  className="w-full px-4 py-3 rounded-xl border-2 border-surface-border bg-white text-sm text-text-primary placeholder:text-surface-muted focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-accent-mint-500" />
                  会议链接
                </label>
                <input
                  type="text"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="请输入腾讯会议/Zoom/飞书等视频会议链接或会议号"
                  className="w-full px-4 py-3 rounded-xl border-2 border-surface-border bg-white text-sm text-text-primary placeholder:text-surface-muted focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all"
                />
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="bg-surface-card rounded-2xl shadow-card border border-surface-border/60 p-8 animate-fade-in-up">
            <h2 className="text-lg font-bold text-text-primary mb-2">填写详细信息</h2>
            <p className="text-sm text-text-tertiary mb-8">
              详细描述你的需求，帮助译员更好地准备服务
            </p>

            <div className="mb-8">
              <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary-500" />
                需求描述
                <span className="text-text-tertiary font-normal">（至少10个字）</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                maxLength={1000}
                placeholder="请详细描述你的翻译需求，包括：1. 具体的场景和流程 2. 涉及的专业领域或术语 3. 对译员的特殊要求（如性别、经验等）4. 其他需要注意的事项..."
                className="w-full px-4 py-3 rounded-xl border-2 border-surface-border bg-white text-sm text-text-primary placeholder:text-surface-muted focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                <span
                  className={cn(
                    'text-xs font-medium',
                    description.length >= 10 ? 'text-emerald-600' : 'text-text-tertiary'
                  )}
                >
                  {description.length >= 10 ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 字数符合要求
                    </span>
                  ) : (
                    `还需要补充 ${10 - description.length} 个字`
                  )}
                </span>
                <span className="text-xs text-text-tertiary">{description.length}/1000</span>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-text-secondary mb-3">紧急程度</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {urgencyOptions.map((option) => {
                  const OptionIcon = option.icon;
                  const isSelected = urgency === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setUrgency(option.id)}
                      className={cn(
                        'relative p-5 rounded-2xl border-2 text-left transition-all duration-300',
                        isSelected
                          ? `${option.bgColor} ${option.borderColor} shadow-sm scale-[1.02]`
                          : 'bg-white border-surface-border hover:border-primary-200 hover:shadow-sm'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
                            isSelected ? `bg-white ${option.color} shadow-sm` : 'bg-surface-bg text-surface-muted'
                          )}
                        >
                          <OptionIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3
                            className={cn(
                              'font-bold mb-1 flex items-center gap-2',
                              isSelected ? option.color : 'text-text-primary'
                            )}
                          >
                            {option.name}
                            {option.id === 'vip' && (
                              <Badge variant="danger" dot>
                                加钱
                              </Badge>
                            )}
                          </h3>
                          <p className="text-xs text-text-tertiary">{option.desc}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className={cn('absolute top-3 right-3', option.color)}>
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                <span className="text-xl">💰</span>
                预算金额
                <span className="text-xs font-normal text-text-tertiary ml-2">
                  （仅供参考，最终以协商为准）
                </span>
              </label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    type="range"
                    min={100}
                    max={3000}
                    step={50}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full h-2 bg-surface-border rounded-full appearance-none cursor-pointer accent-accent-orange-500"
                  />
                  <div className="flex justify-between text-xs text-text-tertiary mt-2">
                    <span>¥100</span>
                    <span>¥500</span>
                    <span>¥1000</span>
                    <span>¥2000</span>
                    <span>¥3000</span>
                  </div>
                </div>
                <div className="shrink-0">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-orange-500 font-bold">
                      ¥
                    </span>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(Math.max(100, Math.min(3000, Number(e.target.value))))}
                      className="w-28 pl-7 pr-4 py-3 rounded-xl border-2 border-accent-orange-200 bg-accent-orange-50 text-lg font-bold text-accent-orange-600 focus:outline-none focus:border-accent-orange-400 focus:ring-4 focus:ring-accent-orange-50 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-primary-500" />
                上传相关附件
                <span className="text-xs font-normal text-text-tertiary ml-1">（可选）</span>
              </label>
              <div className="border-2 border-dashed border-surface-border rounded-2xl p-8 text-center hover:border-primary-300 hover:bg-primary-50/30 transition-all duration-200 cursor-pointer group">
                <div className="w-16 h-16 mx-auto rounded-full bg-surface-bg flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                  <Upload className="w-8 h-8 text-surface-muted group-hover:text-primary-500 transition-colors" />
                </div>
                <h4 className="font-medium text-text-primary mb-1 group-hover:text-primary-600 transition-colors">
                  点击或拖拽上传附件
                </h4>
                <p className="text-xs text-text-tertiary">支持 PDF、图片、Word 文档等，单个文件不超过 20MB</p>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in-up">
            <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent-mint-500 rounded-3xl p-8 text-white shadow-elevation">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  {sceneInfo && <sceneInfo.icon className="w-7 h-7" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold">确认提交需求</h2>
                  <p className="text-white/80 text-sm mt-0.5">请核对以下信息，确认无误后提交</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-white/70 text-xs mb-1">服务类型</p>
                  <p className="font-bold">{sceneInfo?.name || '其他'}</p>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-white/70 text-xs mb-1">紧急程度</p>
                  <p className="font-bold flex items-center gap-1">
                    {urgencyInfo && <urgencyInfo.icon className="w-4 h-4" />}
                    {urgencyInfo?.name || '普通'}
                  </p>
                </div>
                <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-white/70 text-xs mb-1">预算金额</p>
                  <p className="font-bold text-2xl">¥{budget}</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-card rounded-2xl shadow-card border border-surface-border/60 p-6">
              <h3 className="font-bold text-text-primary mb-5 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                信息概览
              </h3>

              <div className="space-y-5">
                {[
                  {
                    label: '服务场景',
                    value: sceneInfo?.name || '未选择',
                    icon: sceneInfo?.icon || Building2,
                    iconBg: sceneInfo?.bgColor || 'bg-slate-50',
                  },
                  {
                    label: '服务时间',
                    value: `${date}  ${startTime} - ${endTime}`,
                    icon: Clock,
                    iconBg: 'bg-blue-50',
                  },
                  {
                    label: '服务方式',
                    value: locationType === 'online' ? '线上视频会议' : '线下到场陪同',
                    icon: locationType === 'online' ? Video : MapPin,
                    iconBg: locationType === 'online' ? 'bg-accent-mint-50' : 'bg-accent-orange-50',
                  },
                  {
                    label: locationType === 'online' ? '会议链接' : '详细地址',
                    value: locationType === 'online' ? meetingLink || '未填写' : address || '未填写',
                    icon: locationType === 'online' ? Link2 : MapPin,
                    iconBg: 'bg-primary-50',
                  },
                  {
                    label: '紧急程度',
                    value: urgencyInfo?.name || '普通',
                    icon: urgencyInfo?.icon || AlertCircle,
                    iconBg: urgencyInfo?.bgColor || 'bg-emerald-50',
                  },
                ].map((item, idx) => {
                  const ItemIcon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-4 p-4 rounded-xl bg-surface-bg/50 animate-fade-in-up"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div
                        className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                          item.iconBg
                        )}
                      >
                        <ItemIcon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-text-tertiary mb-1">{item.label}</p>
                        <p className="font-medium text-text-primary break-all">{item.value}</p>
                      </div>
                    </div>
                  );
                })}

                <div className="p-5 rounded-xl bg-primary-50/50 border border-primary-100 animate-fade-in-up">
                  <p className="text-xs text-primary-600 font-medium mb-2">需求描述</p>
                  <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                    {description || '（未填写详细描述）'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-accent-orange-50 border border-accent-orange-200 rounded-2xl p-5 flex items-start gap-4 animate-fade-in-up">
              <AlertCircle className="w-6 h-6 text-accent-orange-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-accent-orange-700 mb-1">温馨提示</h4>
                <ul className="text-sm text-accent-orange-600/90 space-y-1 list-disc list-inside">
                  <li>提交后，系统将为你匹配最合适的手语翻译志愿者</li>
                  <li>译员接单后，你可以在详情页查看译员信息并进行沟通</li>
                  <li>如需取消或修改需求，请在服务开始前24小时操作</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-4 sticky bottom-6 z-20">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <X className="w-4 h-4" />
              取消
            </Button>
            {currentStep > 1 && (
              <Button variant="secondary" onClick={handlePrev}>
                <ArrowLeft className="w-4 h-4" />
                上一步
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentStep < 4 ? (
              <Button
                variant="primary"
                size="lg"
                onClick={handleNext}
                disabled={!canProceed()}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                下一步
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                loading={loading}
                onClick={handleSubmit}
                leftIcon={<CheckCircle2 className="w-5 h-5" />}
              >
                确认提交
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
