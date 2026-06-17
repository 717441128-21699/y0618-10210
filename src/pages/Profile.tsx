import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User as UserIcon,
  Edit3,
  BookOpen,
  Bookmark,
  Film,
  Handshake,
  Star,
  Trophy,
  Bell,
  Settings,
  Camera,
  Flame,
  Target,
  Award,
  ChevronRight,
  TrendingUp,
  Zap,
  Eye,
  Vibrate,
  Type,
  Contrast,
} from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import { useCommunityStore } from '@/stores/communityStore';
import { useVocabStore } from '@/stores/vocabStore';
import { useCourseStore } from '@/stores/courseStore';
import { useTranslateStore } from '@/stores/translateStore';
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { mockUser } from '@/mock/data';
import { cn } from '@/lib/utils';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

function ToggleSwitch({ checked, onChange, label }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2',
        checked ? 'bg-accent-orange-500' : 'bg-surface-border'
      )}
    >
      <span
        className={cn(
          'inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200',
          checked ? 'translate-x-5' : 'translate-x-0.5'
        )}
      />
      {label && <span className="sr-only">{label}</span>}
    </button>
  );
}

const levelTextMap: Record<string, string> = {
  beginner: '入门',
  intermediate: '初级',
  advanced: '中级',
};

export default function Profile() {
  const navigate = useNavigate();
  const { user, userStats, fetchUser, fetchUserStats } = useUserStore();
  const { posts, fetchPosts } = useCommunityStore();
  const { words, fetchVocabulary } = useVocabStore();
  const { courses, fetchCourses } = useCourseStore();
  const { orders, fetchOrders } = useTranslateStore();

  const [fontSize, setFontSize] = useState<'default' | 'large' | 'xlarge'>('default');
  const [subtitleSize, setSubtitleSize] = useState(18);
  const [highContrast, setHighContrast] = useState(false);
  const [vibration, setVibration] = useState(true);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    fetchUser();
    fetchUserStats();
    fetchPosts();
    fetchVocabulary();
    fetchCourses();
    fetchOrders();
  }, [fetchUser, fetchUserStats, fetchPosts, fetchVocabulary, fetchCourses, fetchOrders]);

  const currentUser = user || mockUser;

  const stats = useMemo(() => ({
    courses: userStats?.completedLessons || 0,
    favorites: words.filter((w) => w.isFavorite).length || 12,
    posts: userStats?.totalPosts || 0,
    orders: userStats?.translationOrders || 0,
    savedPosts: 8,
    badges: userStats?.badges?.length || 0,
  }), [userStats, words]);

  const learningCourses = useMemo(() => {
    return courses
      .filter((c) => c.completedLessons > 0)
      .slice(0, 3);
  }, [courses]);

  const leaderboard = useMemo(() => [
    { rank: 1, name: '手语小美', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face', exp: 8950, streak: 45, me: false },
    { rank: 2, name: '阳光少年小杰', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face', exp: 7620, streak: 38, me: false },
    { rank: 3, name: currentUser.name, avatar: currentUser.avatar, exp: 4280, streak: currentUser.dailyStreak || 23, me: true },
    { rank: 4, name: '听障女孩阿青', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face', exp: 3950, streak: 21, me: false },
    { rank: 5, name: '爱画画的小丽', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face', exp: 3210, streak: 18, me: false },
  ], [currentUser]);

  const menuItems = useMemo(() => [
    { icon: BookOpen, label: '我的课程', value: stats.courses, color: 'text-primary-600', bg: 'bg-primary-50', path: '/courses' },
    { icon: Bookmark, label: '收藏词汇', value: stats.favorites, color: 'text-accent-mint-600', bg: 'bg-accent-mint-50', path: '/vocabulary/my-dictionary' },
    { icon: Film, label: '发布帖子', value: stats.posts, color: 'text-accent-orange-600', bg: 'bg-accent-orange-50', path: '/community' },
    { icon: Handshake, label: '翻译订单', value: stats.orders, color: 'text-accent-yellow-600', bg: 'bg-accent-yellow-50', path: '/translate' },
    { icon: Star, label: '收藏帖子', value: stats.savedPosts, color: 'text-pink-600', bg: 'bg-pink-50', path: '/community' },
    { icon: Trophy, label: '我的徽章', value: stats.badges, color: 'text-purple-600', bg: 'bg-purple-50', path: '/progress' },
    { icon: Bell, label: '消息通知', toggle: true, value: notifications, onChange: setNotifications, color: 'text-blue-600', bg: 'bg-blue-50' },
    { icon: Settings, label: '设置', value: null, color: 'text-gray-600', bg: 'bg-gray-50', path: '#' },
  ], [stats, notifications]);

  const fontSizeLabels = {
    default: '默认',
    large: '大',
    xlarge: '特大',
  };

  const expForNextLevel = 1000;
  const currentLevelExp = (currentUser.exp || 0) % expForNextLevel;
  const expProgress = (currentLevelExp / expForNextLevel) * 100;

  return (
    <div className={cn(
      'min-h-screen pb-12 transition-colors duration-300',
      highContrast ? 'bg-black' : 'bg-surface-bg'
    )}>
      <section className="relative bg-gradient-hero text-white px-6 pt-10 pb-28 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-white/20 blur-3xl animate-float" />
          <div className="absolute bottom-5 left-20 w-32 h-32 rounded-full bg-accent-mint-400/30 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>
      </section>

      <div className="container max-w-5xl mx-auto px-4 -mt-24 relative z-10 space-y-6">
        <section className="animate-fade-in-up">
          <Card className={cn(highContrast && '!bg-gray-900 !border-gray-700')}>
            <CardBody className="pt-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="relative group shrink-0">
                  <Avatar
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    fallback={currentUser.name}
                    size="xl"
                    className={cn(
                      'w-28 h-28 !text-4xl ring-4 ring-white shadow-elevation',
                      highContrast && 'ring-gray-700'
                    )}
                  />
                  <button className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-accent-orange-500 text-white shadow-lg flex items-center justify-center hover:bg-accent-orange-600 transition-colors ring-2 ring-white">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 min-w-0 w-full">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h2 className={cn(
                          'text-2xl font-bold',
                          highContrast ? 'text-white' : 'text-text-primary'
                        )}>
                          {currentUser.name}
                        </h2>
                        <Badge variant="info" className="!bg-blue-100 !text-blue-700 !border-blue-200 !px-3 !py-1">
                          <UserIcon className="w-3 h-3 mr-1" />
                          听障人士
                        </Badge>
                      </div>
                      <p className={cn(
                        'text-sm mb-2',
                        highContrast ? 'text-gray-400' : 'text-text-tertiary'
                      )}>
                        ID: {currentUser.id} · 加入于 {new Date(currentUser.createdAt).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Edit3 className="w-4 h-4" />}
                    >
                      编辑资料
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Badge variant="success" dot>
                      <Flame className="w-3 h-3 mr-1" />
                      连续打卡 {currentUser.dailyStreak} 天
                    </Badge>
                    <Badge variant="warning">
                      <Target className="w-3 h-3 mr-1" />
                      Lv.{currentUser.level}
                    </Badge>
                    <Badge variant="info">
                      <Award className="w-3 h-3 mr-1" />
                      {levelTextMap[currentUser.signLanguageLevel] || '初级'}
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={cn(
                        'text-sm font-medium',
                        highContrast ? 'text-gray-300' : 'text-text-secondary'
                      )}>
                        等级进度
                      </span>
                      <span className={cn(
                        'text-sm font-semibold tabular-nums',
                        highContrast ? 'text-gray-300' : 'text-text-primary'
                      )}>
                        {currentLevelExp} / {expForNextLevel} EXP
                      </span>
                    </div>
                    <ProgressBar
                      value={expProgress}
                      max={100}
                      color="orange"
                      size="lg"
                    />
                  </div>

                  <p className={cn(
                    'text-sm leading-relaxed mb-3',
                    highContrast ? 'text-gray-300' : 'text-text-secondary'
                  )}>
                    {currentUser.bio}
                  </p>

                  <div className={cn(
                    'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm',
                    highContrast ? 'bg-gray-800 text-gray-300' : 'bg-primary-50 text-primary-700'
                  )}>
                    <Target className="w-4 h-4" />
                    <span className="font-medium">学习目标：</span>
                    <span>年内掌握300个常用词汇，完成全部初级课程</span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </section>

        <section className="animate-fade-in-up stagger-1">
          <Card className={cn(highContrast && '!bg-gray-900 !border-gray-700')}>
            <CardHeader>
              <CardTitle className={cn(highContrast && 'text-white')}>功能菜单</CardTitle>
              <CardDescription>快速访问常用功能</CardDescription>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {menuItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => item.path && item.path !== '#' && navigate(item.path)}
                    className={cn(
                      'relative rounded-xl p-4 border text-left transition-all duration-200',
                      'hover:-translate-y-0.5 hover:shadow-card-hover',
                      highContrast
                        ? 'bg-gray-800 border-gray-700 hover:border-accent-orange-500'
                        : 'bg-surface-card border-surface-border/60 hover:border-primary-200'
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center',
                        item.bg
                      )}>
                        <item.icon className={cn('w-5 h-5', item.color)} />
                      </div>
                      {item.toggle ? (
                        <ToggleSwitch
                          checked={item.value as boolean}
                          onChange={(v) => item.onChange?.(v)}
                        />
                      ) : item.value !== null ? (
                        <span className={cn(
                          'text-xl font-bold tabular-nums',
                          highContrast ? 'text-white' : 'text-text-primary'
                        )}>
                          {item.value}
                        </span>
                      ) : (
                        <ChevronRight className={cn(
                          'w-4 h-4',
                          highContrast ? 'text-gray-500' : 'text-text-tertiary'
                        )} />
                      )}
                    </div>
                    <p className={cn(
                      'text-sm font-medium',
                      highContrast ? 'text-gray-200' : 'text-text-primary'
                    )}>
                      {item.label}
                    </p>
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>
        </section>

        <section className="animate-fade-in-up stagger-2">
          <Card className={cn(highContrast && '!bg-gray-900 !border-gray-700')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className={cn(highContrast && 'text-white')}>继续学习</CardTitle>
                  <CardDescription>学习进度实时同步</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  rightIcon={<ChevronRight className="w-4 h-4" />}
                  onClick={() => navigate('/courses')}
                >
                  全部课程
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              {learningCourses.length > 0 ? (
                <div className="space-y-4">
                  {learningCourses.map((course) => (
                    <div
                      key={course.id}
                      className={cn(
                        'flex gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5',
                        highContrast ? 'hover:bg-gray-800' : 'hover:bg-surface-bg'
                      )}
                      onClick={() => navigate(`/course/${course.id}`)}
                    >
                      <div
                        className="w-20 h-14 rounded-lg bg-cover bg-center shrink-0"
                        style={{ backgroundImage: `url(${course.cover})` }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className={cn(
                          'font-semibold text-sm mb-1 truncate',
                          highContrast ? 'text-white' : 'text-text-primary'
                        )}>
                          {course.title}
                        </h4>
                        <ProgressBar
                          value={course.completedLessons}
                          max={course.totalLessons}
                          color="mint"
                          size="sm"
                          className="mb-1"
                        />
                        <p className={cn(
                          'text-xs',
                          highContrast ? 'text-gray-400' : 'text-text-tertiary'
                        )}>
                          第 {course.completedLessons + 1} / {course.totalLessons} 课
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={cn(
                  'text-center py-8',
                  highContrast ? 'text-gray-500' : 'text-text-tertiary'
                )}>
                  还没有开始学习的课程，去发现感兴趣的课程吧！
                </div>
              )}
            </CardBody>
          </Card>
        </section>

        <section className="animate-fade-in-up stagger-3">
          <Card className={cn(highContrast && '!bg-gray-900 !border-gray-700')}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className={cn('flex items-center gap-2', highContrast && 'text-white')}>
                    <TrendingUp className="w-5 h-5 text-accent-orange-500" />
                    学习排行榜
                  </CardTitle>
                  <CardDescription>本周学习经验值排名</CardDescription>
                </div>
                <Badge variant="warning">
                  <Zap className="w-3 h-3 mr-1" />
                  每周一更新
                </Badge>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.rank}
                    className={cn(
                      'flex items-center gap-4 p-3 rounded-xl transition-all duration-200',
                      entry.me
                        ? highContrast
                          ? 'bg-accent-orange-500/10 border border-accent-orange-500/30'
                          : 'bg-accent-orange-50 border border-accent-orange-200'
                        : highContrast
                        ? 'hover:bg-gray-800'
                        : 'hover:bg-surface-bg'
                    )}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0',
                      entry.rank === 1
                        ? 'bg-gradient-to-br from-accent-yellow-400 to-accent-yellow-600 text-white shadow-sm'
                        : entry.rank === 2
                        ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white shadow-sm'
                        : entry.rank === 3
                        ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-sm'
                        : highContrast
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-surface-border/60 text-text-secondary'
                    )}>
                      {entry.rank}
                    </div>
                    <Avatar src={entry.avatar} alt={entry.name} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={cn(
                          'font-semibold truncate',
                          entry.me
                            ? 'text-accent-orange-600'
                            : highContrast
                            ? 'text-white'
                            : 'text-text-primary'
                        )}>
                          {entry.name}
                        </p>
                        {entry.me && (
                          <Badge variant="warning" className="!px-2 !py-0.5">
                            我
                          </Badge>
                        )}
                      </div>
                      <div className={cn(
                        'flex items-center gap-1 text-xs mt-0.5',
                        highContrast ? 'text-gray-400' : 'text-text-tertiary'
                      )}>
                        <Flame className="w-3 h-3 text-accent-orange-500" />
                        连续 {entry.streak} 天
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={cn(
                        'text-lg font-bold tabular-nums',
                        highContrast ? 'text-white' : 'text-text-primary'
                      )}>
                        {entry.exp.toLocaleString()}
                      </p>
                      <p className={cn(
                        'text-xs',
                        highContrast ? 'text-gray-500' : 'text-text-tertiary'
                      )}>
                        EXP
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </section>

        <section className="animate-fade-in-up stagger-4">
          <Card className={cn(highContrast && '!bg-gray-900 !border-gray-700')}>
            <CardHeader>
              <CardTitle className={cn('flex items-center gap-2', highContrast && 'text-white')}>
                <Eye className="w-5 h-5 text-primary-600" />
                听障友好设置
              </CardTitle>
              <CardDescription>个性化设置，让使用更舒适</CardDescription>
            </CardHeader>
            <CardBody className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Type className={cn('w-4 h-4', highContrast ? 'text-gray-300' : 'text-text-secondary')} />
                    <span className={cn('font-medium', highContrast ? 'text-white' : 'text-text-primary')}>
                      字体大小
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['default', 'large', 'xlarge'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={cn(
                        'py-3 px-4 rounded-xl border-2 font-medium transition-all duration-200',
                        fontSize === size
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : highContrast
                          ? 'border-gray-700 text-gray-300 hover:border-gray-600'
                          : 'border-surface-border text-text-secondary hover:border-primary-200'
                      )}
                    >
                      <span className={cn(
                        'block',
                        size === 'default' && 'text-sm',
                        size === 'large' && 'text-base',
                        size === 'xlarge' && 'text-lg'
                      )}>
                        Aa
                      </span>
                      <span className="text-xs mt-1 block opacity-80">
                        {fontSizeLabels[size]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Type className={cn('w-4 h-4', highContrast ? 'text-gray-300' : 'text-text-secondary')} />
                    <span className={cn('font-medium', highContrast ? 'text-white' : 'text-text-primary')}>
                      字幕字号
                    </span>
                    <span className={cn(
                      'text-sm tabular-nums',
                      highContrast ? 'text-gray-400' : 'text-text-tertiary'
                    )}>
                      {subtitleSize}px
                    </span>
                  </div>
                </div>
                <div className="px-2">
                  <input
                    type="range"
                    min={12}
                    max={32}
                    step={1}
                    value={subtitleSize}
                    onChange={(e) => setSubtitleSize(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-accent-orange-500"
                    style={{
                      background: `linear-gradient(to right, #FF6B35 0%, #FF6B35 ${((subtitleSize - 12) / 20) * 100}%, ${highContrast ? '#374151' : '#E5E7EB'} ${((subtitleSize - 12) / 20) * 100}%, ${highContrast ? '#374151' : '#E5E7EB'} 100%)`,
                    }}
                  />
                  <div className="flex justify-between mt-2 text-xs">
                    <span className={highContrast ? 'text-gray-500' : 'text-text-tertiary'}>小</span>
                    <span className={highContrast ? 'text-gray-500' : 'text-text-tertiary'}>大</span>
                  </div>
                </div>
              </div>

              <div className={cn(
                'flex items-center justify-between py-3 border-t',
                highContrast ? 'border-gray-700' : 'border-surface-border/60'
              )}>
                <div className="flex items-center gap-2">
                  <Contrast className={cn('w-4 h-4', highContrast ? 'text-gray-300' : 'text-text-secondary')} />
                  <div>
                    <p className={cn('font-medium', highContrast ? 'text-white' : 'text-text-primary')}>
                      高对比度模式
                    </p>
                    <p className={cn('text-xs', highContrast ? 'text-gray-400' : 'text-text-tertiary')}>
                      增强文字与背景的对比度
                    </p>
                  </div>
                </div>
                <ToggleSwitch checked={highContrast} onChange={setHighContrast} />
              </div>

              <div className={cn(
                'flex items-center justify-between py-3 border-t',
                highContrast ? 'border-gray-700' : 'border-surface-border/60'
              )}>
                <div className="flex items-center gap-2">
                  <Vibrate className={cn('w-4 h-4', highContrast ? 'text-gray-300' : 'text-text-secondary')} />
                  <div>
                    <p className={cn('font-medium', highContrast ? 'text-white' : 'text-text-primary')}>
                      震动反馈
                    </p>
                    <p className={cn('text-xs', highContrast ? 'text-gray-400' : 'text-text-tertiary')}>
                      操作时提供触感反馈
                    </p>
                  </div>
                </div>
                <ToggleSwitch checked={vibration} onChange={setVibration} />
              </div>
            </CardBody>
          </Card>
        </section>
      </div>
    </div>
  );
}
