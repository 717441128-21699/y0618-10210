import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  BookOpen,
  Flame,
  Languages,
  Play,
  ChevronRight,
  Star,
  Eye,
  MessageCircle,
  ThumbsUp,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import { useCourseStore } from '@/stores/courseStore';
import { useVocabStore } from '@/stores/vocabStore';
import { useCommunityStore } from '@/stores/communityStore';
import { StatsCard } from '@/components/ui/StatsCard';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { TagChip } from '@/components/ui/TagChip';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

const levelTextMap: Record<string, string> = {
  beginner: '入门',
  intermediate: '初级',
  advanced: '中级',
};

export default function Home() {
  const navigate = useNavigate();
  const { user, userStats, fetchUser, fetchUserStats } = useUserStore();
  const { courses, fetchCourses } = useCourseStore();
  const { words, fetchVocabulary } = useVocabStore();
  const { posts, fetchPosts } = useCommunityStore();

  useEffect(() => {
    fetchUser();
    fetchUserStats();
    fetchCourses();
    fetchVocabulary();
    fetchPosts();
  }, [fetchUser, fetchUserStats, fetchCourses, fetchVocabulary, fetchPosts]);

  const continueCourse = courses.find((c) => c.completedLessons > 0 && c.completedLessons < c.totalLessons);
  const recommendedCourses = courses.filter((c) => c.completedLessons === 0).slice(0, 6);
  const topWords = words.slice(0, 5);
  const hotPosts = posts.slice(0, 3);

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}小时${m > 0 ? `${m}分` : ''}` : `${m}分钟`;
  };

  const formatViewCount = (n: number) => {
    if (n >= 10000) return `${(n / 10000).toFixed(1)}万`;
    return String(n);
  };

  return (
    <div className="min-h-screen bg-surface-bg pb-12">
      <section className="relative bg-gradient-hero text-white px-6 pt-10 pb-20 overflow-hidden animate-fade-in">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-white/20 blur-3xl animate-float" />
          <div className="absolute bottom-5 left-20 w-32 h-32 rounded-full bg-accent-mint-400/30 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>
        <div className="container relative max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 animate-fade-in-up">
            <Avatar
              src={user?.avatar}
              alt={user?.name}
              fallback={user?.name}
              size="xl"
              className="ring-4 ring-white/30 shadow-elevation"
            />
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                你好，{user?.name || '同学'}！👋
              </h1>
              <p className="text-white/80 text-base md:text-lg mb-2">
                欢迎回到手语学习平台
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="success" dot className="bg-white/15 text-white border-white/30">
                  <Flame className="w-3 h-3 mr-1" />
                  连续打卡 {user?.dailyStreak || 0} 天
                </Badge>
                <span className="text-white/70 text-sm">
                  今天也要加油哦 💪
                </span>
              </div>
            </div>
            <div className="hidden md:flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 text-white/90">
                <Sparkles className="w-5 h-5 text-accent-yellow-300" />
                <span className="font-semibold">Lv.{user?.level || 1}</span>
              </div>
              <div className="w-32">
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-accent rounded-full transition-all duration-500"
                    style={{ width: `${((user?.exp || 0) % 1000) / 10}%` }}
                  />
                </div>
                <p className="text-xs text-white/60 mt-1 text-right">
                  {user?.exp || 0} / {((Math.floor((user?.exp || 0) / 1000) + 1) * 1000)} EXP
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container max-w-7xl mx-auto px-4 -mt-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="animate-fade-in-up stagger-1">
            <StatsCard
              icon={<Clock className="w-6 h-6" />}
              value={formatDuration(userStats?.totalLessons ? userStats.totalLessons * 45 : 0)}
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
              icon={<Flame className="w-6 h-6" />}
              value={`${user?.dailyStreak || 0}天`}
              label="连续打卡"
              trend={{ value: '继续加油', direction: 'neutral' }}
              variant="orange"
            />
          </div>
          <div className="animate-fade-in-up stagger-4">
            <StatsCard
              icon={<Languages className="w-6 h-6" />}
              value={userStats?.learnedWords || 0}
              label="已掌握词汇"
              trend={{ value: '+15', direction: 'up', label: '本周' }}
              variant="default"
            />
          </div>
        </div>

        {continueCourse && (
          <section className="mb-8 animate-fade-in-up stagger-5">
            <Card hoverable className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div
                  className="md:w-64 h-48 md:h-auto bg-cover bg-center relative shrink-0 cursor-pointer"
                  style={{ backgroundImage: `url(${continueCourse.cover})` }}
                  onClick={() => navigate(`/course/${continueCourse.id}`)}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <TagChip variant="primary" size="sm" selected>
                      {levelTextMap[continueCourse.level]}
                    </TagChip>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/30">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-elevation">
                      <Play className="w-8 h-8 text-accent-orange-500 ml-1" />
                    </div>
                  </div>
                </div>
                <CardBody className="flex-1 flex flex-col justify-between p-6">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm text-accent-orange-500 font-medium mb-1 flex items-center gap-1">
                          <Flame className="w-4 h-4" />
                          继续学习
                        </p>
                        <h3 className="text-xl font-bold text-text-primary mb-2">
                          {continueCourse.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 text-text-tertiary">
                        <Star className="w-4 h-4 text-accent-yellow-500 fill-accent-yellow-500" />
                        <span className="font-semibold">{continueCourse.rating}</span>
                      </div>
                    </div>
                    <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                      {continueCourse.description}
                    </p>
                  </div>
                  <div>
                    <ProgressBar
                      value={continueCourse.completedLessons}
                      max={continueCourse.totalLessons}
                      color="orange"
                      showPercentage
                      label={`第 ${continueCourse.completedLessons + 1} / ${continueCourse.totalLessons} 课`}
                      className="mb-4"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-text-tertiary">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDuration(continueCourse.duration)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {formatViewCount(continueCourse.students)}学员
                        </span>
                      </div>
                      <Button
                        size="lg"
                        rightIcon={<ArrowRight className="w-5 h-5" />}
                        onClick={() => navigate(`/course/${continueCourse.id}`)}
                      >
                        继续学习
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </div>
            </Card>
          </section>
        )}

        <section className="mb-8 animate-fade-in-up stagger-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-text-primary">推荐课程</h2>
              <p className="text-sm text-text-tertiary mt-1">为你精选的优质手语课程</p>
            </div>
            <Button
              variant="ghost"
              rightIcon={<ChevronRight className="w-4 h-4" />}
              onClick={() => navigate('/courses')}
            >
              查看全部
            </Button>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-4 hide-scrollbar -mx-4 px-4 snap-x">
            {recommendedCourses.map((course, idx) => (
              <Card
                key={course.id}
                hoverable
                className={cn(
                  'shrink-0 w-72 snap-start',
                  'transition-all duration-500 ease-out'
                )}
                style={{ animationDelay: `${idx * 80}ms` }}
                onClick={() => navigate(`/course/${course.id}`)}
              >
                <div
                  className="h-40 bg-cover bg-center relative"
                  style={{ backgroundImage: `url(${course.cover})` }}
                >
                  <div className="absolute top-3 left-3">
                    <TagChip
                      variant={
                        course.level === 'beginner'
                          ? 'success'
                          : course.level === 'intermediate'
                          ? 'warning'
                          : 'danger'
                      }
                      size="sm"
                      selected
                    >
                      {levelTextMap[course.level]}
                    </TagChip>
                  </div>
                  <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                    <Clock className="w-3 h-3" />
                    {formatDuration(course.duration)}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-text-primary mb-2 line-clamp-1">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {course.tags.slice(0, 2).map((tag) => (
                      <TagChip key={tag} size="sm" variant="default">
                        {tag}
                      </TagChip>
                    ))}
                  </div>
                  <ProgressBar
                    value={0}
                    max={course.totalLessons}
                    color="primary"
                    className="mb-3"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-accent-yellow-500 fill-accent-yellow-500" />
                      <span className="text-sm font-semibold text-text-primary">{course.rating}</span>
                      <span className="text-xs text-text-tertiary">({formatViewCount(course.students)}人学)</span>
                    </div>
                    <Button size="sm" variant="secondary">
                      开始学习
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-8 animate-fade-in-up stagger-7">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-text-primary">今日推荐词汇 Top 5</h2>
              <p className="text-sm text-text-tertiary mt-1">每天学习5个新词汇，积少成多</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {topWords.map((word, idx) => (
              <Card
                key={word.id}
                hoverable
                className="p-5 cursor-pointer group"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <Badge variant={
                    word.difficulty === 'easy' ? 'success' :
                    word.difficulty === 'medium' ? 'warning' : 'danger'
                  }>
                    {idx + 1}
                  </Badge>
                  <TagChip
                    size="sm"
                    variant={
                      word.difficulty === 'easy' ? 'success' :
                      word.difficulty === 'medium' ? 'warning' : 'danger'
                    }
                  >
                    {word.difficulty === 'easy' ? '简单' : word.difficulty === 'medium' ? '中等' : '困难'}
                  </TagChip>
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-1 group-hover:text-accent-orange-500 transition-colors">
                  {word.word}
                </h3>
                <p className="text-sm text-text-tertiary mb-1">{word.translation}</p>
                <p className="text-xs text-primary-500 font-medium mb-4">
                  {word.category}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full group-hover:bg-primary-600 group-hover:text-white transition-all"
                  rightIcon={<Eye className="w-4 h-4" />}
                >
                  快速查看
                </Button>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-8 animate-fade-in-up stagger-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-text-primary">社区热帖</h2>
              <p className="text-sm text-text-tertiary mt-1">看看大家都在分享什么</p>
            </div>
            <Button variant="ghost" rightIcon={<ChevronRight className="w-4 h-4" />}>
              进入社区
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {hotPosts.map((post, idx) => (
              <Card
                key={post.id}
                hoverable
                className="cursor-pointer overflow-hidden"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                {post.images && post.images.length > 0 && (
                  <div
                    className="h-40 bg-cover bg-center"
                    style={{ backgroundImage: `url(${post.images[0]})` }}
                  />
                )}
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar src={post.authorAvatar} alt={post.authorName} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary truncate">
                        {post.authorName}
                      </p>
                      <p className="text-xs text-text-tertiary flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                    <TagChip
                      size="sm"
                      variant={
                        post.channel === 'share' ? 'success' :
                        post.channel === 'help' ? 'warning' :
                        post.channel === 'news' ? 'primary' : 'primary'
                      }
                    >
                      {post.channel === 'share' ? '分享' :
                       post.channel === 'help' ? '求助' :
                       post.channel === 'news' ? '资讯' : '讨论'}
                    </TagChip>
                  </div>
                  <h3 className="font-bold text-text-primary mb-2 line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-sm text-text-secondary line-clamp-2 mb-4">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-text-tertiary">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {formatViewCount(post.views)}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {post.comments}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="animate-fade-in">
          <Card className="bg-gradient-hero text-white overflow-hidden relative">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full bg-white/20 blur-3xl" />
              <div className="absolute bottom-0 left-10 w-48 h-48 rounded-full bg-accent-mint-400/30 blur-3xl" />
            </div>
            <div className="p-8 md:p-10 relative flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-6 h-6 text-accent-yellow-300" />
                  <h2 className="text-2xl font-bold">专业手语翻译服务</h2>
                </div>
                <p className="text-white/80 mb-2 text-lg">
                  就医、出庭、面试、会议等重要场合
                </p>
                <p className="text-white/70 mb-6">
                  持证专业翻译员一对一服务，线上线下均可预约，保障沟通无障碍
                </p>
                <div className="flex flex-wrap gap-3 mb-6">
                  <Badge variant="success" dot className="bg-white/15 text-white border-white/30">
                    24小时内响应
                  </Badge>
                  <Badge variant="success" dot className="bg-white/15 text-white border-white/30">
                    全国翻译员覆盖
                  </Badge>
                  <Badge variant="success" dot className="bg-white/15 text-white border-white/30">
                    资质认证保障
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    className="!bg-white !text-primary-600 hover:!bg-white/90 !shadow-button-hover"
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    立即预约翻译
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="!border-white !text-white hover:!bg-white/10"
                  >
                    了解服务详情
                  </Button>
                </div>
              </div>
              <div className="w-48 h-48 shrink-0 rounded-3xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-elevation">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-1">300+</div>
                  <div className="text-white/70 text-sm">认证翻译员</div>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
