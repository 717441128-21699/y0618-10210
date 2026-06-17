import { useEffect, useMemo } from 'react';
import {
  Clock,
  BookOpen,
  PenTool,
  Languages,
  Calendar,
  Trophy,
  Lock,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
} from 'recharts';
import { useUserStore } from '@/stores/userStore';
import { StatsCard } from '@/components/ui/StatsCard';
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { mockWeeklyTrend, mockCategoryRadar, mockBadges } from '@/mock/data';
import { cn } from '@/lib/utils';

interface AchievementBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt?: string;
  unlocked: boolean;
  progress?: {
    current: number;
    target: number;
    label: string;
  };
}

export default function Progress() {
  const { user, userStats, fetchUser, fetchUserStats } = useUserStore();

  useEffect(() => {
    fetchUser();
    fetchUserStats();
  }, [fetchUser, fetchUserStats]);

  const calendarData = useMemo(() => {
    const days: { date: Date; studied: boolean; minutes: number }[] = [];
    const today = new Date();
    const studyPatterns = [true, true, false, true, true, true, false, true, true, true, true, false, true];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const idx = 29 - i;
      const studied = studyPatterns[idx % studyPatterns.length];
      days.push({
        date,
        studied,
        minutes: studied ? 30 + Math.floor(Math.random() * 90) : 0,
      });
    }
    return days;
  }, []);

  const achievementBadges: AchievementBadge[] = useMemo(() => {
    const unlocked = mockBadges.map((b) => ({
      ...b,
      unlocked: true,
    }));
    const locked: AchievementBadge[] = [
      {
        id: 'lb001',
        name: '词汇大师',
        icon: '📚',
        description: '掌握100个手语词汇',
        unlocked: false,
        progress: { current: 86, target: 100, label: '学习词汇' },
      },
      {
        id: 'lb002',
        name: '月度学霸',
        icon: '🌟',
        description: '连续打卡学习30天',
        unlocked: false,
        progress: { current: 23, target: 30, label: '连续打卡' },
      },
      {
        id: 'lb003',
        name: '课程终结者',
        icon: '🎓',
        description: '完成5门完整课程',
        unlocked: false,
        progress: { current: 2, target: 5, label: '完成课程' },
      },
      {
        id: 'lb004',
        name: '练习达人',
        icon: '💪',
        description: '完成100次练习作业',
        unlocked: false,
        progress: { current: 72, target: 100, label: '完成练习' },
      },
      {
        id: 'lb005',
        name: '社交达人',
        icon: '👥',
        description: '发布10条社区帖子',
        unlocked: false,
        progress: { current: 5, target: 10, label: '发布帖子' },
      },
      {
        id: 'lb006',
        name: '翻译新星',
        icon: '🌐',
        description: '完成10次翻译服务',
        unlocked: false,
        progress: { current: 3, target: 10, label: '翻译服务' },
      },
    ];
    return [...unlocked, ...locked];
  }, []);

  const totalHours = Math.round(((userStats?.totalLessons || 0) * 45) / 60);
  const totalMinutes = totalHours * 60 + ((userStats?.totalLessons || 0) * 45) % 60;
  const totalHoursDisplay = `${totalHours}小时${totalMinutes % 60 > 0 ? `${totalMinutes % 60}分` : ''}`;

  const formatDate = (date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="min-h-screen bg-surface-bg pb-12">
      <section className="relative bg-gradient-hero text-white px-6 pt-10 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-white/20 blur-3xl animate-float" />
          <div className="absolute bottom-5 left-20 w-32 h-32 rounded-full bg-accent-mint-400/30 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>
        <div className="container relative max-w-7xl mx-auto">
          <div className="animate-fade-in-up">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3">
              <Trophy className="w-8 h-8 text-accent-yellow-300" />
              我的学习进度
            </h1>
            <p className="text-white/80 text-base md:text-lg">
              坚持每一天，沟通无障碍
            </p>
          </div>
        </div>
      </section>

      <div className="container max-w-7xl mx-auto px-4 -mt-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="animate-fade-in-up stagger-1">
            <StatsCard
              icon={<Clock className="w-6 h-6" />}
              value={totalHoursDisplay}
              label="总学习时长"
              trend={{ value: '+12%', direction: 'up', label: '本周' }}
              variant="primary"
            />
          </div>
          <div className="animate-fade-in-up stagger-2">
            <StatsCard
              icon={<BookOpen className="w-6 h-6" />}
              value={userStats?.completedLessons || 0}
              label="完成课程数"
              trend={{ value: '+3', direction: 'up', label: '本周' }}
              variant="mint"
            />
          </div>
          <div className="animate-fade-in-up stagger-3">
            <StatsCard
              icon={<PenTool className="w-6 h-6" />}
              value={userStats?.totalExercises || 0}
              label="练习提交数"
              trend={{ value: '+18', direction: 'up', label: '本周' }}
              variant="orange"
            />
          </div>
          <div className="animate-fade-in-up stagger-4">
            <StatsCard
              icon={<Languages className="w-6 h-6" />}
              value={userStats?.learnedWords || 0}
              label="掌握词汇数"
              trend={{ value: '+15', direction: 'up', label: '本周' }}
              variant="default"
            />
          </div>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="animate-fade-in-up stagger-5">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-accent-orange-500" />
                  周学习趋势
                </CardTitle>
                <CardDescription>最近7天的学习时长统计</CardDescription>
              </CardHeader>
              <CardBody>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockWeeklyTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                        dy={8}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#6B7280', fontSize: 12 }}
                        unit="分"
                      />
                      <Tooltip
                        cursor={{ fill: 'rgba(255, 107, 53, 0.08)' }}
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #E5E7EB',
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                        formatter={(value: number) => [`${value} 分钟`, '学习时长']}
                        labelStyle={{ color: '#1A1A2E', fontWeight: 600 }}
                      />
                      <Bar
                        dataKey="studyMinutes"
                        radius={[8, 8, 0, 0]}
                        barSize={36}
                      >
                        {mockWeeklyTrend.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={index % 2 === 0 ? '#FF6B35' : '#FFB347'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="animate-fade-in-up stagger-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Languages className="w-5 h-5 text-accent-mint-500" />
                  场景词汇掌握度
                </CardTitle>
                <CardDescription>各场景分类词汇掌握百分比</CardDescription>
              </CardHeader>
              <CardBody>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={mockCategoryRadar}>
                      <PolarGrid stroke="#E5E7EB" />
                      <PolarAngleAxis
                        dataKey="category"
                        tick={{ fill: '#4A4A68', fontSize: 12, fontWeight: 500 }}
                      />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={{ fill: '#9CA3AF', fontSize: 10 }}
                        tickCount={5}
                        axisLine={false}
                      />
                      <Radar
                        name="掌握度"
                        dataKey="value"
                        stroke="#4ECDC4"
                        fill="#4ECDC4"
                        fillOpacity={0.35}
                        strokeWidth={2}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #E5E7EB',
                          borderRadius: '12px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                        formatter={(value: number) => [`${value}%`, '掌握度']}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardBody>
            </Card>
          </div>
        </section>

        <section className="mb-8 animate-fade-in-up stagger-7">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-600" />
                学习打卡日历
              </CardTitle>
              <CardDescription>最近30天的学习记录，坚持就是胜利 💪</CardDescription>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-15 gap-2 sm:gap-3">
                {calendarData.map((day, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'relative flex flex-col items-center gap-1 group',
                      'transition-transform duration-200 hover:scale-110'
                    )}
                    title={`${formatDate(day.date)}${day.studied ? ` · 学习${day.minutes}分钟` : ' · 未学习'}`}
                  >
                    <div
                      className={cn(
                        'w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300',
                        day.studied
                          ? isToday(day.date)
                            ? 'bg-gradient-accent text-white shadow-lg ring-2 ring-accent-orange-300 ring-offset-2 animate-breathe'
                            : 'bg-accent-mint-500 text-white shadow-sm hover:shadow-md'
                          : isToday(day.date)
                          ? 'bg-white border-2 border-dashed border-accent-orange-400 text-accent-orange-500'
                          : 'bg-surface-border/40 text-text-tertiary'
                      )}
                      style={
                        isToday(day.date) && day.studied
                          ? {
                              boxShadow: '0 0 0 4px rgba(255, 107, 53, 0.15), 0 4px 12px rgba(255, 107, 53, 0.4)',
                            }
                          : undefined
                      }
                    >
                      {day.date.getDate()}
                    </div>
                    <span className="text-[10px] text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity">
                      {day.studied ? `${day.minutes}分` : '—'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-end gap-4 text-sm text-text-tertiary">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-surface-border/40" />
                  <span>未学习</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-accent-mint-500" />
                  <span>已学习</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gradient-accent ring-2 ring-accent-orange-300 ring-offset-1" />
                  <span>今天</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </section>

        <section className="animate-fade-in-up stagger-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-accent-yellow-500" />
                成就徽章墙
              </CardTitle>
              <CardDescription>
                已获得 {achievementBadges.filter((b) => b.unlocked).length} / {achievementBadges.length} 个徽章
              </CardDescription>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {achievementBadges.map((badge, idx) => (
                  <div
                    key={badge.id}
                    className={cn(
                      'relative rounded-2xl p-4 border transition-all duration-300 hover:-translate-y-1',
                      badge.unlocked
                        ? 'bg-gradient-to-br from-white to-surface-bg border-surface-border/60 hover:shadow-card-hover hover:border-primary-200'
                        : 'bg-surface-bg/60 border-surface-border/40'
                    )}
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <div
                      className={cn(
                        'w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center text-3xl',
                        'transition-transform duration-300 group-hover:scale-110',
                        badge.unlocked
                          ? 'bg-gradient-to-br from-accent-yellow-50 to-accent-orange-50 shadow-inner'
                          : 'bg-surface-border/30'
                      )}
                      style={
                        badge.unlocked
                          ? { filter: 'drop-shadow(0 2px 8px rgba(255, 230, 109, 0.4))' }
                          : { filter: 'grayscale(100%)', opacity: 0.6 }
                      }
                    >
                      {badge.unlocked ? badge.icon : <Lock className="w-7 h-7 text-text-muted" />}
                    </div>

                    <h4
                      className={cn(
                        'text-sm font-bold text-center mb-1 truncate',
                        badge.unlocked ? 'text-text-primary' : 'text-text-tertiary'
                      )}
                    >
                      {badge.unlocked ? badge.name : '待解锁'}
                    </h4>

                    <p className="text-xs text-text-tertiary text-center mb-3 line-clamp-2 h-8">
                      {badge.description}
                    </p>

                    {badge.unlocked && badge.unlockedAt ? (
                      <Badge variant="success" className="w-full justify-center">
                        {new Date(badge.unlockedAt).toLocaleDateString('zh-CN', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </Badge>
                    ) : (
                      <div>
                        {badge.progress && (
                          <>
                            <ProgressBar
                              value={badge.progress.current}
                              max={badge.progress.target}
                              color="mint"
                              size="sm"
                              className="mb-2"
                            />
                            <p className="text-[11px] text-text-tertiary text-center font-medium">
                              {badge.progress.label} {badge.progress.current}/{badge.progress.target}
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </section>
      </div>
    </div>
  );
}
